import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

/**
 * DELETE /api/user/account — Delete user account and all associated data
 */
export async function DELETE(
  _request: NextRequest,
): Promise<
  NextResponse<ApiSuccessResponse<{ deleted: boolean }> | ApiErrorResponse>
> {
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

    // Cascade delete handles presentations, sections, assets
    await prisma.userMetadata.delete({
      where: { clerkUserId: userId },
    });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
