import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

/**
 * Full-save endpoint for the editor auto-save.
 * Accepts complete presentation + sections state and upserts everything in a transaction.
 */

const SavePayloadSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000).nullable().optional(),
  themeId: z.string(),
  sections: z.array(
    z.object({
      id: z.string(),
      layoutId: z.string(),
      order: z.number().int().min(0),
      content: z.record(z.string(), z.unknown()),
      styleOverrides: z.record(z.string(), z.unknown()).nullable().optional(),
      transitions: z.record(z.string(), z.unknown()).nullable().optional(),
      notes: z.string().max(10000).nullable().optional(),
      isHidden: z.boolean().optional(),
    }),
  ),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiSuccessResponse<{ savedAt: string }> | ApiErrorResponse>> {
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
    const parsed = SavePayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid save payload.',
            details: parsed.error.issues,
          },
        },
        { status: 400 },
      );
    }

    const { title, description, themeId, sections } = parsed.data;

    await prisma.$transaction(async (tx) => {
      // Update presentation metadata
      await tx.presentation.update({
        where: { id },
        data: { title, description, themeId },
      });

      // Delete all existing sections and recreate them
      await tx.section.deleteMany({ where: { presentationId: id } });

      if (sections.length > 0) {
        await tx.section.createMany({
          data: sections.map((s) => ({
            id: s.id,
            presentationId: id,
            layoutId: s.layoutId,
            order: s.order,
            content: JSON.parse(JSON.stringify(s.content)) as Parameters<typeof tx.section.create>[0]['data']['content'],
            styleOverrides: s.styleOverrides ? (JSON.parse(JSON.stringify(s.styleOverrides)) as Parameters<typeof tx.section.create>[0]['data']['styleOverrides']) : undefined,
            transitions: s.transitions ? (JSON.parse(JSON.stringify(s.transitions)) as Parameters<typeof tx.section.create>[0]['data']['transitions']) : undefined,
            notes: s.notes ?? null,
            isHidden: s.isHidden ?? false,
          })),
        });
      }
    });

    const savedAt = new Date().toISOString();

    return NextResponse.json({ success: true, data: { savedAt } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
