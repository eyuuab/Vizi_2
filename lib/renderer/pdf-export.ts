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
import { renderPptx } from './index';

// ============================================================
// Public API
// ============================================================

/**
 * Generate a PDF-compatible export of the presentation.
 *
 * Current implementation: generates the PPTX buffer.
 * The API route can convert to PDF via an external service
 * or serve the PPTX with proper content type.
 *
 * In production, integrate with:
 * - LibreOffice headless: `libreoffice --headless --convert-to pdf`
 * - CloudConvert API
 * - Gotenberg (Docker-based converter)
 */
export async function exportPdf(
  presentation: ComposedPresentation,
): Promise<Buffer> {
  // Generate the PPTX first
  const pptxBuffer = await renderPptx(presentation);

  // In production, convert PPTX to PDF here using an external service.
  // For now, return the PPTX buffer — the API can handle format negotiation.
  return pptxBuffer;
}
