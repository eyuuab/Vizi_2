import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { UpdateSectionSchema } from '@/types/api';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Helper: verify ownership of a section via its presentation.
 */
async function verifyOwnership(
  sectionId: string,
  userId: string,
): Promise<
  | { ok: true; section: { id: string; presentationId: string } }
  | { ok: false; response: NextResponse<ApiErrorResponse> }
> {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: {
      id: true,
      presentationId: true,
      presentation: { select: { clerkUserId: true } },
    },
  });

  if (!section) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Section not found.' },
        },
        { status: 404 },
      ),
    };
  }

  if (section.presentation.clerkUserId !== userId) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: { code: 'FORBIDDEN', message: 'Access denied.' },
        },
        { status: 403 },
      ),
    };
  }

  return { ok: true, section: { id: section.id, presentationId: section.presentationId } };
}

/**
 * PATCH /api/sections/[id] — Update an individual section
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams,
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

    const { id } = await params;
    const ownership = await verifyOwnership(id, userId);
    if (!ownership.ok) return ownership.response;

    const body: unknown = await request.json();
    const parsed = UpdateSectionSchema.safeParse(body);

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

    // Build the update data, being careful with JSON fields
    const updateData: Record<string, unknown> = {};
    if (parsed.data.layoutId !== undefined) updateData.layoutId = parsed.data.layoutId;
    if (parsed.data.order !== undefined) updateData.order = parsed.data.order;
    if (parsed.data.content !== undefined) updateData.content = JSON.parse(JSON.stringify(parsed.data.content));
    if (parsed.data.styleOverrides !== undefined) updateData.styleOverrides = JSON.parse(JSON.stringify(parsed.data.styleOverrides));
    if (parsed.data.transitions !== undefined) updateData.transitions = JSON.parse(JSON.stringify(parsed.data.transitions));
    if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;
    if (parsed.data.isHidden !== undefined) updateData.isHidden = parsed.data.isHidden;

    const updated = await prisma.section.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/sections/[id] — Delete a section
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
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

    const { id } = await params;
    const ownership = await verifyOwnership(id, userId);
    if (!ownership.ok) return ownership.response;

    await prisma.section.delete({ where: { id } });

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
