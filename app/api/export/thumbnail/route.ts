/**
 * POST /api/export/thumbnail
 *
 * Generate a preview thumbnail for a presentation.
 * Auth required.
 * Returns the thumbnail as a JPEG image and updates the presentation's thumbnail field.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { generateThumbnailDataUrl } from '@/lib/renderer/thumbnail';
import { loadAndComposePresentation } from '@/lib/renderer/load-presentation';

const ThumbnailRequestSchema = z.object({
  presentationId: z.string().min(1),
});

export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<
    ApiSuccessResponse<{ thumbnailUrl: string }> | ApiErrorResponse
  >
> {
  try {
    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false as const,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        },
        { status: 401 },
      );
    }

    // Parse and validate request body
    const body: unknown = await request.json();
    const parsed = ThumbnailRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false as const,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body.',
            details: parsed.error.issues,
          },
        },
        { status: 400 },
      );
    }

    // Load and compose the presentation
    const { composed, userId: ownerId } = await loadAndComposePresentation(
      parsed.data.presentationId,
    );

    // Verify ownership
    if (ownerId !== userId) {
      return NextResponse.json(
        {
          success: false as const,
          error: { code: 'FORBIDDEN', message: 'Access denied.' },
        },
        { status: 403 },
      );
    }

    // Generate thumbnail
    const thumbnailDataUrl = await generateThumbnailDataUrl(composed);

    // Update the presentation's thumbnail field in the database
    await prisma.presentation.update({
      where: { id: parsed.data.presentationId },
      data: { thumbnail: thumbnailDataUrl },
    });

    return NextResponse.json({
      success: true as const,
      data: { thumbnailUrl: thumbnailDataUrl },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';

    if (message.includes('not found')) {
      return NextResponse.json(
        {
          success: false as const,
          error: { code: 'NOT_FOUND', message },
        },
        { status: 404 },
      );
    }

    console.error('[export/thumbnail] Error:', message);
    return NextResponse.json(
      {
        success: false as const,
        error: { code: 'INTERNAL_ERROR', message },
      },
      { status: 500 },
    );
  }
}
