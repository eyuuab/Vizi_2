/**
 * PPTX Rendering Pipeline — Section 9
 *
 * Main entry point for the PPTX rendering pipeline.
 * Orchestrates all 7 steps:
 * 1. Composition Split (splitForPptx from /lib/composer)
 * 2. Theme Resolution (theme-resolver.ts)
 * 3. Layout-to-Shape Mapping (shape-mapper.ts)
 * 4. Content Rendering (content-renderer.ts)
 * 5. Asset Processing (asset-processor.ts)
 * 6. Slide Master (slide-master.ts)
 * 7. Assembly & Export (assembler.ts)
 */

import type { ComposedPresentation } from '@/types/presentation';
import { assemblePptx } from './assembler';
import type { AssembleOptions } from './assembler';

export type { AssembleOptions } from './assembler';
export { resolveThemeForPptx } from './theme-resolver';
export type { PptxResolvedTheme } from './theme-resolver';
export { convertTiptapToPptx, plainTextToPptx } from './tiptap-converter';
export { processImage, processImageBuffer } from './asset-processor';
export type { ProcessedImage } from './asset-processor';
export { mapSlotsToShapes } from './shape-mapper';
export type { MappedShape } from './shape-mapper';

/**
 * Render a ComposedPresentation into a .pptx file buffer.
 *
 * This is the main entry point for PPTX export.
 * Call this with a fully composed presentation (from composePresentation + splitForPptx)
 * and receive a Buffer that can be sent as a file download.
 *
 * @param presentation - A fully composed presentation with resolved sections, theme, etc.
 * @param options - Optional settings: includeNotes, author, company, subject
 * @returns Promise<Buffer> - The .pptx file as a Node.js Buffer
 */
export async function renderPptx(
  presentation: ComposedPresentation,
  options?: AssembleOptions,
): Promise<Buffer> {
  try {
    const buffer = await assemblePptx(presentation, options);
    return buffer;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown rendering error';
    throw new Error(`PPTX rendering failed: ${message}`);
  }
}
