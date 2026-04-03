import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { OutlineOnlyRequestSchema } from '@/types/ai';
import { getProvider } from '@/lib/ai/providers';
import { generateOutline } from '@/lib/ai/pipeline';
import {
  authenticateRequest,
  checkAndEnforceRateLimit,
  recordCreditUsage,
} from '@/lib/ai/auth-helpers';

/**
 * POST /api/ai/outline-only
 * Generates just the presentation outline for user review before committing.
 * Returns the outline as a JSON response (not streamed).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Authenticate
  const authResult = await authenticateRequest();
  if (!authResult.ok) {
    return authResult.response;
  }

  // Rate limit
  const rateLimitResult = await checkAndEnforceRateLimit(authResult.userId, 'outline_only');
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

  const parseResult = OutlineOnlyRequestSchema.safeParse(body);
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
    const outline = await generateOutline(provider, {
      prompt: parseResult.data.prompt,
    });

    void recordCreditUsage(authResult.userId, 'outline_only');

    return NextResponse.json({
      success: true,
      data: outline,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Outline generation failed';
    return NextResponse.json(
      { success: false, error: { code: 'AI_ERROR', message } },
      { status: 500 },
    );
  }
}
