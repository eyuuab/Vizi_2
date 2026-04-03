/**
 * Assembler — Step 7 of the PPTX Pipeline
 *
 * Orchestrates the full PPTX generation:
 * 1. Creates PptxGenJS instance with widescreen layout
 * 2. Defines slide master from theme
 * 3. Iterates over pages (from splitForPptx)
 * 4. For each page, maps slots to shapes and renders content
 * 5. Writes the .pptx buffer
 */

import PptxGenJS from 'pptxgenjs';
import type { ComposedPresentation, PptxPage, ResolvedSection } from '@/types/presentation';
import { splitForPptx } from '@/lib/composer';
import { resolveThemeForPptx } from './theme-resolver';
import type { PptxResolvedTheme } from './theme-resolver';
import { mapSlotsToShapes } from './shape-mapper';
import { renderShapesToSlide } from './content-renderer';
import { defineSlideMaster, applyPresentationTheme, SLIDE_MASTER_NAME } from './slide-master';

// ============================================================
// Constants
// ============================================================

const SLIDE_WIDTH_INCHES = 13.333;
const SLIDE_HEIGHT_INCHES = 7.5;

// ============================================================
// Options
// ============================================================

export interface AssembleOptions {
  includeNotes?: boolean;
  author?: string;
  company?: string;
  subject?: string;
}

// ============================================================
// Public API
// ============================================================

/**
 * Assemble a full PPTX presentation from a ComposedPresentation.
 * Returns the .pptx file as a Buffer.
 */
export async function assemblePptx(
  presentation: ComposedPresentation,
  options?: AssembleOptions,
): Promise<Buffer> {
  // Step 1: Split into pages
  const pages = splitForPptx(presentation);

  if (pages.length === 0) {
    // Return an empty presentation with a title slide
    return assembleEmptyPresentation(presentation, options);
  }

  // Step 2: Resolve theme
  const theme = resolveThemeForPptx(presentation.theme);

  // Step 3: Create PptxGenJS instance
  const pptx = createPptxInstance(presentation, theme, options);

  // Step 4: Render each page as a slide
  for (const page of pages) {
    await renderPage(pptx, page, theme, options?.includeNotes ?? false);
  }

  // Step 5: Write buffer
  const buffer = await pptx.write({ outputType: 'nodebuffer' });
  return Buffer.from(buffer as ArrayBuffer);
}

// ============================================================
// Instance Creation
// ============================================================

function createPptxInstance(
  presentation: ComposedPresentation,
  theme: PptxResolvedTheme,
  options?: AssembleOptions,
): PptxGenJS {
  const pptx = new PptxGenJS();

  // Set widescreen layout (13.333" x 7.5")
  pptx.layout = 'LAYOUT_WIDE';
  pptx.defineLayout({
    name: 'SLIDEFORGE_WIDE',
    width: SLIDE_WIDTH_INCHES,
    height: SLIDE_HEIGHT_INCHES,
  });
  pptx.layout = 'SLIDEFORGE_WIDE';

  // Set metadata
  pptx.title = presentation.title;
  pptx.author = options?.author ?? 'SlideForge AI';
  pptx.company = options?.company ?? 'SlideForge';
  pptx.subject = options?.subject ?? (presentation.description ?? '');
  pptx.revision = '1';

  // Apply theme
  applyPresentationTheme(pptx, theme);
  defineSlideMaster(pptx, theme);

  return pptx;
}

// ============================================================
// Page Rendering
// ============================================================

async function renderPage(
  pptx: PptxGenJS,
  page: PptxPage,
  theme: PptxResolvedTheme,
  includeNotes: boolean,
): Promise<void> {
  const slide = pptx.addSlide({ masterName: SLIDE_MASTER_NAME });

  // Set slide background
  slide.background = { color: theme.background.color };

  // Collect all shapes from all sections on this page
  for (const section of page.sections) {
    await renderSectionToSlide(slide, section, theme, includeNotes);
  }
}

async function renderSectionToSlide(
  slide: PptxGenJS.Slide,
  section: ResolvedSection,
  theme: PptxResolvedTheme,
  includeNotes: boolean,
): Promise<void> {
  // Apply section-level style overrides
  const effectiveTheme = applyStyleOverrides(theme, section);

  // Map slots to shapes using the layout's pptxMapping
  const shapes = mapSlotsToShapes(
    section.resolvedSlots,
    section.layout.pptxMapping,
    effectiveTheme,
  );

  // Render shapes onto the slide
  await renderShapesToSlide(slide, shapes, effectiveTheme, {
    includeNotes,
    notes: section.notes,
  });
}

// ============================================================
// Style Override Application
// ============================================================

function applyStyleOverrides(
  theme: PptxResolvedTheme,
  section: ResolvedSection,
): PptxResolvedTheme {
  if (!section.styleOverrides) return theme;

  const overrides = section.styleOverrides;
  const updatedColors = { ...theme.colors };

  if (overrides.backgroundColor) {
    const hex = overrides.backgroundColor.startsWith('#')
      ? overrides.backgroundColor.slice(1)
      : overrides.backgroundColor;
    updatedColors.background = hex;
  }

  if (overrides.textColor) {
    const hex = overrides.textColor.startsWith('#')
      ? overrides.textColor.slice(1)
      : overrides.textColor;
    updatedColors.textPrimary = hex;
  }

  if (overrides.accentColor) {
    const hex = overrides.accentColor.startsWith('#')
      ? overrides.accentColor.slice(1)
      : overrides.accentColor;
    updatedColors.accent = hex;
  }

  return {
    ...theme,
    colors: updatedColors,
  };
}

// ============================================================
// Empty Presentation
// ============================================================

async function assembleEmptyPresentation(
  presentation: ComposedPresentation,
  options?: AssembleOptions,
): Promise<Buffer> {
  const theme = resolveThemeForPptx(presentation.theme);
  const pptx = createPptxInstance(presentation, theme, options);

  const slide = pptx.addSlide({ masterName: SLIDE_MASTER_NAME });
  slide.background = { color: theme.background.color };

  slide.addText(presentation.title, {
    x: 1,
    y: 2.5,
    w: 11.333,
    h: 2,
    align: 'center',
    valign: 'middle',
    fontFace: theme.fonts.heading,
    fontSize: theme.fontSizes['4xl'],
    color: theme.colors.textPrimary,
    bold: true,
  });

  if (presentation.description) {
    slide.addText(presentation.description, {
      x: 2,
      y: 4.5,
      w: 9.333,
      h: 1,
      align: 'center',
      valign: 'top',
      fontFace: theme.fonts.body,
      fontSize: theme.fontSizes.lg,
      color: theme.colors.textSecondary,
    });
  }

  const buffer = await pptx.write({ outputType: 'nodebuffer' });
  return Buffer.from(buffer as ArrayBuffer);
}
