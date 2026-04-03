import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/presentations/[id]/duplicate — Deep clone a presentation with all sections
 */
export async function POST(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiSuccessResponse<unknown> | ApiErrorResponse>> {
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

    const original = await prisma.presentation.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!original) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Presentation not found.' },
        },
        { status: 404 },
      );
    }

    if (original.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'FORBIDDEN', message: 'Access denied.' },
        },
        { status: 403 },
      );
    }

    // Deep clone the presentation with all sections
    const duplicate = await prisma.presentation.create({
      data: {
        title: `${original.title} (Copy)`,
        description: original.description,
        userId: session.user.id,
        themeId: original.themeId,
        isPublic: false,
        shareSlug: null,
        thumbnail: original.thumbnail,
        metadata: original.metadata as Parameters<typeof prisma.presentation.create>[0]['data']['metadata'],
        sections: {
          create: original.sections.map((section) => ({
            layoutId: section.layoutId,
            order: section.order,
            content: section.content as Parameters<typeof prisma.section.create>[0]['data']['content'],
            styleOverrides: section.styleOverrides as Parameters<typeof prisma.section.create>[0]['data']['styleOverrides'],
            transitions: section.transitions as Parameters<typeof prisma.section.create>[0]['data']['transitions'],
            notes: section.notes,
            isHidden: section.isHidden,
          })),
        },
      },
      include: {
        sections: true,
      },
    });

    return NextResponse.json(
      { success: true, data: duplicate },
      { status: 201 },
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
