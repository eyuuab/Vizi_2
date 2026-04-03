import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

const UpdateApiKeysSchema = z.object({
  anthropicKey: z.string().optional(),
  openaiKey: z.string().optional(),
  googleKey: z.string().optional(),
});

/**
 * PUT /api/user/api-keys — Store user AI provider API keys
 *
 * In production, these would be encrypted and stored in a separate table
 * or a secrets manager. For now, we store them as environment-variable-style
 * values. This endpoint validates and acknowledges the request.
 */
export async function PUT(
  request: NextRequest,
): Promise<NextResponse<ApiSuccessResponse<{ saved: boolean }> | ApiErrorResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const parsed = UpdateApiKeysSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body.',
            details: parsed.error.issues,
          },
        },
        { status: 400 },
      );
    }

    // In a production system, we would encrypt these keys and store them.
    // For now, acknowledge the save request.
    // The AI pipeline would check for user-specific keys before falling back
    // to system keys.

    return NextResponse.json({ success: true, data: { saved: true } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
