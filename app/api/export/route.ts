import { NextResponse } from 'next/server';

/**
 * Export API routes — Phase 5 implementation
 * POST /api/export/pptx — Generate and download .pptx file
 * POST /api/export/pdf — Generate PDF via Puppeteer
 * POST /api/export/thumbnail — Generate preview thumbnail image
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Export endpoints will be implemented in Phase 5.' },
    { status: 501 },
  );
}
