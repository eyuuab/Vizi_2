/**
 * GET /api/export
 *
 * Info endpoint for export capabilities.
 * Actual export is done via:
 * - POST /api/export/pptx
 * - POST /api/export/pdf
 * - POST /api/export/thumbnail
 */

import { NextResponse } from 'next/server';
import type { ApiSuccessResponse } from '@/types/api';

interface ExportInfo {
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
  }>;
}

export async function GET(): Promise<
  NextResponse<ApiSuccessResponse<ExportInfo>>
> {
  return NextResponse.json({
    success: true as const,
    data: {
      endpoints: [
        {
          method: 'POST',
          path: '/api/export/pptx',
          description:
            'Generate and download a .pptx file. Body: { presentationId, includeNotes?, includeHidden? }',
        },
        {
          method: 'POST',
          path: '/api/export/pdf',
          description:
            'Generate and download a PDF. Body: { presentationId, includeHidden? }',
        },
        {
          method: 'POST',
          path: '/api/export/thumbnail',
          description:
            'Generate a preview thumbnail. Body: { presentationId }',
        },
      ],
    },
  });
}
