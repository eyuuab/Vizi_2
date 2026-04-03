import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SuggestLayoutRequestSchema } from '@/types/ai';
import { getProvider } from '@/lib/ai/providers';
import { generateTextWithRetry } from '@/lib/ai/providers';
import { getLayoutIds, getLayout } from '@/lib/layouts';
import { SYSTEM_PROMPT_LAYOUT, buildLayoutSuggestionPrompt } from '@/lib/ai/pipeline/prompts';
import {
  authenticateRequest,
  checkAndEnforceRateLimit,
  recordCreditUsage,
} from '@/lib/ai/auth-helpers';

/**
 * POST /api/ai/suggest-layout
 * Suggests the best layout for given content.
 * Returns a layoutId suggestion.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Authenticate
  const authResult = await authenticateRequest();
  if (!authResult.ok) {
    return authResult.response;
  }

  // Rate limit
  const rateLimitResult = await checkAndEnforceRateLimit(authResult.userId, 'suggest_layout');
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

  const parseResult = SuggestLayoutRequestSchema.safeParse(body);
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

  const { content, context } = parseResult.data;

  // Get AI provider
  let provider;
  try {
    provider = getProvider();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to initialize AI provider';
    return NextResponse.json(
      { success: false, error: { code: 'PROVIDER_ERROR', message } },
      { status: 500 },
    );
  }

  try {
    const layoutIds = getLayoutIds();
    const prompt = buildLayoutSuggestionPrompt(content, context, layoutIds);

    const response = await generateTextWithRetry(provider, prompt, {
      systemPrompt: SYSTEM_PROMPT_LAYOUT,
      maxTokens: 256,
      temperature: 0.3,
    });

    // The response should be a plain layout ID
    const suggestedId = response.text.trim().replace(/['"]/g, '');

    // Verify the layout exists
    let layoutId: string;
    try {
      getLayout(suggestedId);
      layoutId = suggestedId;
    } catch {
      // If the suggested layout is invalid, fall back to content-text
      layoutId = 'content-text';
    }

    void recordCreditUsage(authResult.userId, 'suggest_layout');

    return NextResponse.json({
      success: true,
      data: { layoutId },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Layout suggestion failed';
    return NextResponse.json(
      { success: false, error: { code: 'AI_ERROR', message } },
      { status: 500 },
    );
  }
}
