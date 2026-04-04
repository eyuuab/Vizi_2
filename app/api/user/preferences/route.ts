import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

const UpdatePreferencesSchema = z.object({
  defaultTheme: z.string().optional(),
  defaultProvider: z.enum(['anthropic', 'openai', 'google']).optional(),
  autoSaveInterval: z.number().min(5).max(300).optional(),
});

/**
 * PUT /api/user/preferences — Update user preferences
 *
 * In a full implementation, preferences would be stored in the user metadata
 * or a dedicated preferences table. For now, we validate and acknowledge.
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
    const parsed = UpdatePreferencesSchema.safeParse(body);

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

    // Acknowledge — in production, persist to user metadata or preferences table
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
