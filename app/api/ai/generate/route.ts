import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { GenerateRequestSchema } from '@/types/ai';
import { getProvider } from '@/lib/ai/providers';
import { createGenerationStream } from '@/lib/ai/pipeline';
import {
  authenticateRequest,
  checkAndEnforceRateLimit,
  recordCreditUsage,
} from '@/lib/ai/auth-helpers';

/**
 * POST /api/ai/generate
 * Full AI generation pipeline: prompt -> outline -> layouts -> content -> theme
 * Streams response as JSON-line events via SSE.
 */
export async function POST(request: NextRequest): Promise<Response> {
  // Authenticate
  const authResult = await authenticateRequest();
  if (!authResult.ok) {
    return authResult.response;
  }

  // Rate limit
  const rateLimitResult = await checkAndEnforceRateLimit(authResult.userId, 'generate');
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

  const parseResult = GenerateRequestSchema.safeParse(body);
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

  const generateRequest = parseResult.data;

  // Get AI provider
  let provider;
  try {
    provider = getProvider(generateRequest.provider);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to initialize AI provider';
    return NextResponse.json(
      { success: false, error: { code: 'PROVIDER_ERROR', message } },
      { status: 500 },
    );
  }

  // Create streaming response
  const stream = createGenerationStream(
    provider,
    generateRequest,
    request.signal,
  );

  // Wrap the stream to consume credits only after successful completion
  const userId = authResult.userId;
  const creditStream = stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        controller.enqueue(chunk);

        // Check if this chunk contains a 'complete' event
        const text = new TextDecoder().decode(chunk);
        for (const line of text.split('\n')) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as { type: string };
            if (event.type === 'complete') {
              void recordCreditUsage(userId, 'generate');
            }
          } catch {
            // Not valid JSON, skip
          }
        }
      },
    }),
  );

  return new Response(creditStream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
