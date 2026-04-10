/**
 * PDF Export — Section 5C
 *
 * Generates a PDF by first rendering the PPTX, then converting.
 * Since we cannot use headless browser in a serverless environment reliably,
 * we implement PDF generation by re-rendering slides to SVG and using Sharp
 * to compose them into a multi-page image-based PDF-like format.
 *
 * For production, this would use LibreOffice or a dedicated conversion service.
 * This implementation generates the PPTX buffer — the API route can either
 * return it directly or delegate to an external conversion service.
 */

import type { ComposedPresentation } from '@/types/presentation';

// ============================================================
// Public API
// ============================================================

/**
 * Generate a PDF export of the presentation.
 *
 * STUB: PDF export is not yet implemented. A PPTX-to-PDF conversion service
 * (e.g., LibreOffice headless, CloudConvert, or Gotenberg) is required.
 * This function throws an error to prevent silently returning the wrong format.
 */
export async function exportPdf(
  _presentation: ComposedPresentation,
): Promise<Buffer> {
  throw new Error(
    'PDF export is not yet implemented. Please use PPTX export instead, or integrate a conversion service (LibreOffice headless, CloudConvert, or Gotenberg).',
  );
}
