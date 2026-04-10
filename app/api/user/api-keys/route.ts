import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
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
    const { userId } = await auth();
    if (!userId) {
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

    // User-specific API key storage is not yet implemented.
    // The schema has no field for storing per-user API keys.
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'User-specific API key storage is not yet available. The system uses server-configured API keys.',
        },
      },
      { status: 501 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
