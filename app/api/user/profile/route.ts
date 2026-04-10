import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(200),
});

/**
 * PATCH /api/user/profile — Update user profile
 */
export async function PATCH(
  request: NextRequest,
): Promise<NextResponse<ApiSuccessResponse<unknown> | ApiErrorResponse>> {
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
    const parsed = UpdateProfileSchema.safeParse(body);

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

    // Profile data (name, email, image) is managed by Clerk, not stored in UserMetadata.
    // Use the Clerk SDK to update profile fields.
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Profile updates are managed through Clerk. Use the Clerk user profile to change your name.',
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
