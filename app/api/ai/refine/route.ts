import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RefineRequestSchema } from '@/types/ai';
import { getProvider } from '@/lib/ai/providers';
import { generateTextWithRetry } from '@/lib/ai/providers';
import { getLayout } from '@/lib/layouts';
import { SYSTEM_PROMPT_CONTENT, buildRefinePrompt } from '@/lib/ai/pipeline/prompts';
import { parseAIJson } from '@/lib/ai/pipeline/json-parser';
import { prisma } from '@/lib/db';
import {
  authenticateRequest,
  checkAndEnforceRateLimit,
  recordCreditUsage,
} from '@/lib/ai/auth-helpers';

/**
 * POST /api/ai/refine
 * Refine specific section content based on user feedback.
 * Streams the updated section content.
 */
export async function POST(request: NextRequest): Promise<Response> {
  // Authenticate
  const authResult = await authenticateRequest();
  if (!authResult.ok) {
    return authResult.response;
  }

  // Rate limit
  const rateLimitResult = await checkAndEnforceRateLimit(authResult.userId, 'refine');
  if (!rateLimitResult.ok) {
    return rateLimitResult.response;
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parseResult = RefineRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: parseResult.error.issues,
        },
      },
      { status: 400 },
    );
  }

  const { presentationId, sectionId, feedback, provider: providerName } = parseResult.data;

  // Verify the presentation belongs to the user
  const presentation = await prisma.presentation.findFirst({
    where: { id: presentationId, userId: authResult.userId },
    include: {
      sections: {
        where: { id: sectionId },
      },
    },
  });

  if (!presentation) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Presentation not found' } },
      { status: 404 },
    );
  }

  const section = presentation.sections[0];
  if (!section) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Section not found' } },
      { status: 404 },
    );
  }

  // Get layout for the section
  let layout;
  try {
    layout = getLayout(section.layoutId);
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_LAYOUT', message: `Layout "${section.layoutId}" not found` } },
      { status: 400 },
    );
  }

  // Get AI provider
  let provider;
  try {
    provider = getProvider(providerName);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to initialize AI provider';
    return NextResponse.json(
      { success: false, error: { code: 'PROVIDER_ERROR', message } },
      { status: 500 },
    );
  }

  // Create streaming response for refine
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const currentContent = section.content as Record<string, unknown>;
        const prompt = buildRefinePrompt(currentContent, feedback, layout);

        const response = await generateTextWithRetry(provider, prompt, {
          systemPrompt: SYSTEM_PROMPT_CONTENT,
          maxTokens: 2048,
          temperature: 0.6,
        });

        const refinedContent = parseAIJson<Record<string, unknown>>(response.text);

        // Emit the refined section
        const event = JSON.stringify({
          type: 'section',
          data: {
            sectionId,
            layoutId: section.layoutId,
            content: refinedContent,
          },
          timestamp: Date.now(),
        }) + '\n';

        controller.enqueue(encoder.encode(event));

        // Emit completion
        const completeEvent = JSON.stringify({
          type: 'complete',
          data: { sectionId },
          timestamp: Date.now(),
        }) + '\n';

        controller.enqueue(encoder.encode(completeEvent));
        controller.close();

        // Record credit usage
        void recordCreditUsage(authResult.userId, 'refine');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Refinement failed';
        const errorEvent = JSON.stringify({
          type: 'error',
          data: { message, category: 'unknown', retryable: true },
          timestamp: Date.now(),
        }) + '\n';

        controller.enqueue(encoder.encode(errorEvent));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
