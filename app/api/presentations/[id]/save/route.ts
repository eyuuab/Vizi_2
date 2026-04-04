import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { loadAndComposePresentation } from '@/lib/renderer/load-presentation';
import { generateThumbnailDataUrl } from '@/lib/renderer/thumbnail';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

/**
 * Full-save endpoint for the editor auto-save.
 * Accepts complete presentation + sections state and upserts everything in a transaction.
 */

const SavePayloadSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000).nullable().optional(),
  themeId: z.string(),
  themeTokens: z.unknown().optional(),
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
): Promise<
  NextResponse<ApiSuccessResponse<{ savedAt: string; themeId: string }> | ApiErrorResponse>
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
        { status: 401 },
      );
    }
    const userId = userId;

    const { id } = await params;

    const presentation = await prisma.presentation.findUnique({
      where: { id },
      select: { userId: true, themeId: true },
    });

    if (!presentation) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Presentation not found.' } },
        { status: 404 },
      );
    }

    if (presentation.clerkUserId !== userId) {
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

    const { title, description, themeId, themeTokens, sections } = parsed.data;
    let resolvedThemeId = themeId;

    await prisma.$transaction(async (tx) => {
      if (themeTokens !== undefined) {
        const theme = await tx.theme.findUnique({
          where: { id: themeId },
          select: { id: true, clerkUserId: true, isPreset: true },
        });

        if (!theme) {
          throw new Error(`Theme "${themeId}" not found.`);
        }

        const serializedTokens = JSON.parse(
          JSON.stringify(themeTokens),
        ) as Prisma.InputJsonValue;

        // Preset (or non-owned) themes are immutable for this user.
        // Fork into a user-owned theme and re-point the presentation.
        if (theme.isPreset || theme.clerkUserId !== userId) {
          const customTheme = await tx.theme.create({
            data: {
              name: `${title} (Custom Theme)`,
              userId,
              isPreset: false,
              tokens: serializedTokens,
            },
            select: { id: true },
          });
          resolvedThemeId = customTheme.id;
        } else {
          await tx.theme.update({
            where: { id: theme.id },
            data: { tokens: serializedTokens },
          });
          resolvedThemeId = theme.id;
        }
      }

      // Update presentation metadata
      await tx.presentation.update({
        where: { id },
        data: { title, description, themeId: resolvedThemeId },
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

    // Regenerate thumbnail in background after save
    regenerateThumbnail(id).catch((err) => {
      console.error('[save] Thumbnail regeneration failed:', err);
    });

    return NextResponse.json({ success: true, data: { savedAt, themeId: resolvedThemeId } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}

async function regenerateThumbnail(presentationId: string): Promise<void> {
  const { composed } = await loadAndComposePresentation(presentationId);
  const thumbnailDataUrl = await generateThumbnailDataUrl(composed);
  await prisma.presentation.update({
    where: { id: presentationId },
    data: { thumbnail: thumbnailDataUrl },
  });
}
