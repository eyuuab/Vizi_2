/**
 * POST /api/export/pdf
 *
 * Generate and download a PDF for a presentation.
 * Auth required — owner only.
 *
 * Current implementation generates a PPTX and returns it.
 * In production, integrate with a PPTX-to-PDF conversion service.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ExportPdfSchema } from '@/types/api';
import type { ApiErrorResponse } from '@/types/api';
import { exportPdf } from '@/lib/renderer/pdf-export';
import { loadAndComposePresentation } from '@/lib/renderer/load-presentation';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ArrayBuffer | ApiErrorResponse>> {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
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
    const parsed = ExportPdfSchema.safeParse(body);

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
    const { composed, userId } = await loadAndComposePresentation(
      parsed.data.presentationId,
    );

    // Verify ownership
    if (userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false as const,
          error: { code: 'FORBIDDEN', message: 'Access denied.' },
        },
        { status: 403 },
      );
    }

    // Generate the PDF (currently generates PPTX format)
    const buffer = await exportPdf(composed);

    const safeTitle = composed.title
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 50);
    const filename = `${safeTitle || 'presentation'}.pptx`;

    // Return as downloadable file
    // Note: Content-Type is PPTX until a PDF conversion service is integrated
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

    console.error('[export/pdf] Error:', message);
    return NextResponse.json(
      {
        success: false as const,
        error: { code: 'INTERNAL_ERROR', message },
      },
      { status: 500 },
    );
  }
}
