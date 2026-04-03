import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CreateSectionSchema, ReorderSectionsSchema } from '@/types/api';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiSuccessResponse<unknown> | ApiErrorResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
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
        { success: false, error: { code: 'NOT_FOUND', message: 'Presentation not found.' } },
        { status: 404 },
      );
    }

    if (presentation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Access denied.' } },
        { status: 403 },
      );
    }

    const body: unknown = await request.json();
    const parsed = CreateSectionSchema.safeParse(body);

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

    const section = await prisma.section.create({
      data: {
        presentationId: id,
        layoutId: parsed.data.layoutId,
        order: parsed.data.order,
        content: JSON.parse(JSON.stringify(parsed.data.content ?? {})) as Parameters<typeof prisma.section.create>[0]['data']['content'],
      },
    });

    return NextResponse.json({ success: true, data: section }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiSuccessResponse<unknown> | ApiErrorResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
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
        { success: false, error: { code: 'NOT_FOUND', message: 'Presentation not found.' } },
        { status: 404 },
      );
    }

    if (presentation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Access denied.' } },
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

    // Batch update section orders
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
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
