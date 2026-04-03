/**
 * Slide Master — Step 6 of the PPTX Pipeline
 *
 * Generates a PptxGenJS slide master (layout) from theme tokens.
 * Sets default fonts, colors, and background for the presentation.
 */

import type PptxGenJS from 'pptxgenjs';
import type { PptxResolvedTheme } from './theme-resolver';

// ============================================================
// Constants
// ============================================================

export const SLIDE_MASTER_NAME = 'SLIDEFORGE_MASTER';

// ============================================================
// Public API
// ============================================================

/**
 * Define a slide master on the PptxGenJS instance using resolved theme tokens.
 * This sets the default background, fonts, and optional slide number.
 */
export function defineSlideMaster(
  pptx: PptxGenJS,
  theme: PptxResolvedTheme,
): void {
  const masterDef: PptxGenJS.SlideMasterProps = {
    title: SLIDE_MASTER_NAME,
    background: resolveBackground(theme),
    margin: [0.5, 0.5, 0.5, 0.5],
  };

  pptx.defineSlideMaster(masterDef);
}

/**
 * Set presentation-level theme properties (headFont, bodyFont).
 */
export function applyPresentationTheme(
  pptx: PptxGenJS,
  theme: PptxResolvedTheme,
): void {
  pptx.theme = {
    headFontFace: theme.fonts.heading,
    bodyFontFace: theme.fonts.body,
  };
}

// ============================================================
// Background Resolution for Slide Master
// ============================================================

function resolveBackground(
  theme: PptxResolvedTheme,
): PptxGenJS.BackgroundProps {
  // PptxGenJS BackgroundProps uses color (hex) or path/data for images
  return {
    color: theme.background.color,
  };
}
