import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/sections/[id]/duplicate — Duplicate a section within its presentation
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

    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        presentation: { select: { userId: true } },
      },
    });

    if (!section) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Section not found.' },
        },
        { status: 404 },
      );
    }

    if (section.presentation.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'FORBIDDEN', message: 'Access denied.' },
        },
        { status: 403 },
      );
    }

    // Shift all subsequent sections down by 1
    await prisma.section.updateMany({
      where: {
        presentationId: section.presentationId,
        order: { gt: section.order },
      },
      data: {
        order: { increment: 1 },
      },
    });

    // Create duplicate right after the original
    const duplicate = await prisma.section.create({
      data: {
        presentationId: section.presentationId,
        layoutId: section.layoutId,
        order: section.order + 1,
        content: section.content as Parameters<typeof prisma.section.create>[0]['data']['content'],
        styleOverrides: section.styleOverrides as Parameters<typeof prisma.section.create>[0]['data']['styleOverrides'],
        transitions: section.transitions as Parameters<typeof prisma.section.create>[0]['data']['transitions'],
        notes: section.notes,
        isHidden: section.isHidden,
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
