import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ReorderSectionsSchema } from '@/types/api';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/presentations/[id]/reorder — Bulk reorder sections
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams,
): Promise<
  NextResponse<ApiSuccessResponse<{ reordered: boolean }> | ApiErrorResponse>
> {
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

    const { id } = await params;

    const presentation = await prisma.presentation.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!presentation) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Presentation not found.' },
        },
        { status: 404 },
      );
    }

    if (presentation.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'FORBIDDEN', message: 'Access denied.' },
        },
        { status: 403 },
      );
    }

    const body: unknown = await request.json();
    const parsed = ReorderSectionsSchema.safeParse(body);

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

    await prisma.$transaction(
      parsed.data.sections.map((s) =>
        prisma.section.update({
          where: { id: s.id },
          data: { order: s.order },
        }),
      ),
    );

    return NextResponse.json({ success: true, data: { reordered: true } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
