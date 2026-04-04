/**
 * POST /api/export/pptx
 *
 * Generate and download a .pptx file for a presentation.
 * Auth required — owner only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ExportPptxSchema } from '@/types/api';
import type { ApiErrorResponse } from '@/types/api';
import { renderPptx } from '@/lib/renderer';
import { loadAndComposePresentation } from '@/lib/renderer/load-presentation';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ArrayBuffer | ApiErrorResponse>> {
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
    const parsed = ExportPptxSchema.safeParse(body);

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
    const { composed, userId: presentationUserId } = await loadAndComposePresentation(
      parsed.data.presentationId,
    );

    // Verify ownership
    if (presentationUserId !== userId) {
      return NextResponse.json(
        {
          success: false as const,
          error: { code: 'FORBIDDEN', message: 'Access denied.' },
        },
        { status: 403 },
      );
    }

    // Render the PPTX
    const buffer = await renderPptx(composed, {
      includeNotes: parsed.data.includeNotes ?? false,
      author: 'SlideForge User',
    });

    // Build a safe filename
    const safeTitle = composed.title
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 50);
    const filename = `${safeTitle || 'presentation'}.pptx`;

    // Return as downloadable file
    const responseBody = new Uint8Array(buffer);
    return new NextResponse(responseBody, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
      },
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

    console.error('[export/pptx] Error:', message);
    return NextResponse.json(
      {
        success: false as const,
        error: { code: 'INTERNAL_ERROR', message },
      },
      { status: 500 },
    );
  }
}
