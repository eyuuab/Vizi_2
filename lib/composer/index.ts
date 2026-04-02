import type { LayoutTemplate, Position } from '@/types/layout';
import type { ThemeTokens } from '@/types/theme';
import type {
  ResolvedSection,
  ResolvedSlot,
  ComposedPresentation,
  PptxPage,
  SectionContent,
  StyleOverrides,
  TransitionConfig,
} from '@/types/presentation';
import { getLayout } from '@/lib/layouts';

// ============================================================
// Constants
// ============================================================

/** Standard PPTX slide height in inches */
const PPTX_PAGE_HEIGHT = 7.5;

/** Default section gap in pixels */
const DEFAULT_SECTION_GAP = 24;

/** Default computed height for a section in pixels */
const DEFAULT_SECTION_HEIGHT = 500;

// ============================================================
// Section Input — what callers provide before resolution
// ============================================================

export interface SectionInput {
  id: string;
  layoutId: string;
  order: number;
  content: SectionContent;
  styleOverrides?: StyleOverrides;
  transitions?: TransitionConfig;
  notes?: string | null;
  isHidden?: boolean;
}

// ============================================================
// resolveSection
// ============================================================

/**
 * Resolves a section input into a fully resolved section with computed slot positions.
 * Merges layout template definitions with actual content and computes final positions.
 */
export function resolveSection(
  section: SectionInput,
  layout: LayoutTemplate,
  _theme: ThemeTokens,
): ResolvedSection {
  const resolvedSlots: ResolvedSlot[] = layout.slots.map((slot) => {
    const content = section.content[slot.id] ?? layout.defaultContent[slot.id] ?? null;

    return {
      definition: {
        id: slot.id,
        type: slot.type,
        label: slot.label,
        required: slot.required,
        position: slot.position,
        aiHint: slot.aiHint,
      },
      content,
      computedPosition: { ...slot.position },
    };
  });

  // Compute height based on the layout's min/max height constraints
  const computedHeight = computeSectionHeight(layout, section.content);

  return {
    id: section.id,
    layoutId: section.layoutId,
    layout,
    order: section.order,
    content: section.content,
    styleOverrides: section.styleOverrides ?? undefined,
    transitions: section.transitions ?? undefined,
    notes: section.notes ?? null,
    isHidden: section.isHidden ?? false,
    resolvedSlots,
    computedHeight,
    yOffset: 0, // Will be set by composePresentation
  };
}

/**
 * Compute section height based on layout constraints and content density.
 * Uses the layout's minHeight as a baseline and adjusts based on content.
 */
function computeSectionHeight(
  layout: LayoutTemplate,
  content: SectionContent,
): number {
  const baseHeight = layout.minHeight;

  // Count non-empty content slots
  let contentDensity = 0;
  for (const slot of layout.slots) {
    const value = content[slot.id];
    if (value !== undefined && value !== null && value !== '') {
      contentDensity += 1;

      // Increase height for long text content
      if (typeof value === 'string' && value.length > 300) {
        contentDensity += Math.floor(value.length / 300);
      }

      // Increase height for arrays (lists, stats, timeline items)
      if (Array.isArray(value)) {
        contentDensity += Math.max(0, value.length - 2) * 0.5;
      }

      // Increase height for config objects with nested arrays (tables, timelines)
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const record = value as Record<string, unknown>;
        if (Array.isArray(record['rows'])) {
          contentDensity += record['rows'].length * 0.3;
        }
        if (Array.isArray(record['items'])) {
          contentDensity += (record['items'] as unknown[]).length * 0.4;
        }
      }
    }
  }

  // Scale height based on density (each density unit adds ~50px)
  const dynamicHeight = baseHeight + contentDensity * 50;

  // Clamp to maxHeight if it's a number
  const maxHeight = layout.maxHeight;
  if (typeof maxHeight === 'number') {
    return Math.min(dynamicHeight, maxHeight);
  }

  return Math.max(dynamicHeight, DEFAULT_SECTION_HEIGHT);
}

// ============================================================
// composePresentation
// ============================================================

/**
 * Composes a full presentation by resolving all sections and computing vertical layout.
 */
export function composePresentation(
  id: string,
  title: string,
  description: string | null,
  sections: SectionInput[],
  theme: ThemeTokens,
): ComposedPresentation {
  const sectionGap = theme.spacing.sectionGap ?? DEFAULT_SECTION_GAP;

  // Resolve all sections with their layouts
  const resolvedSections: ResolvedSection[] = [];
  let yOffset = 0;

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  for (const section of sortedSections) {
    let layout: LayoutTemplate;
    try {
      layout = getLayout(section.layoutId);
    } catch {
      // Skip sections with invalid layouts
      continue;
    }

    const resolved = resolveSection(section, layout, theme);
    resolved.yOffset = yOffset;
    resolvedSections.push(resolved);

    if (!resolved.isHidden) {
      yOffset += resolved.computedHeight + sectionGap;
    }
  }

  // Total height is the last offset minus the trailing gap
  const totalHeight = yOffset > 0 ? yOffset - sectionGap : 0;

  return {
    id,
    title,
    description,
    theme,
    sections: resolvedSections,
    totalHeight,
    sectionGap,
  };
}

// ============================================================
// splitForPptx
// ============================================================

/**
 * Splits a composed presentation into PPTX pages (7.5" slide height).
 * Each section is placed on a slide. If a section is too tall, it continues on the next slide.
 * Hidden sections are excluded.
 */
export function splitForPptx(composed: ComposedPresentation): PptxPage[] {
  const pages: PptxPage[] = [];
  const visibleSections = composed.sections.filter((s) => !s.isHidden);

  if (visibleSections.length === 0) {
    return [];
  }

  // Convert pixel heights to inches for PPTX (approximate: 96px per inch)
  const PX_PER_INCH = 96;
  let currentPage: PptxPage = {
    slideIndex: 0,
    sections: [],
    isContinuation: false,
  };
  let currentPageHeight = 0;

  for (const section of visibleSections) {
    const sectionHeightInches = section.computedHeight / PX_PER_INCH;

    // If this section fits on the current page, add it
    if (currentPageHeight + sectionHeightInches <= PPTX_PAGE_HEIGHT || currentPage.sections.length === 0) {
      currentPage.sections.push(section);
      currentPageHeight += sectionHeightInches;
    } else {
      // Start a new page
      pages.push(currentPage);
      currentPage = {
        slideIndex: pages.length,
        sections: [section],
        isContinuation: false,
      };
      currentPageHeight = sectionHeightInches;
    }

    // If a single section exceeds page height, it still gets its own page
    // but mark subsequent pages as continuations
    if (sectionHeightInches > PPTX_PAGE_HEIGHT) {
      pages.push(currentPage);
      currentPage = {
        slideIndex: pages.length,
        sections: [],
        isContinuation: true,
      };
      currentPageHeight = 0;
    }
  }

  // Push the last page if it has sections
  if (currentPage.sections.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

// ============================================================
// computeResponsiveLayout
// ============================================================

interface Viewport {
  width: number;
  height: number;
}

/**
 * Recomputes slot positions for a given viewport size using responsive overrides.
 * Mobile: viewport.width < 640
 * Tablet: viewport.width >= 640 && viewport.width < 1024
 * Desktop: viewport.width >= 1024 (uses default positions)
 */
export function computeResponsiveLayout(
  resolved: ResolvedSection,
  viewport: Viewport,
): ResolvedSection {
  const breakpoint = getBreakpoint(viewport.width);

  const updatedSlots: ResolvedSlot[] = resolved.resolvedSlots.map((slot) => {
    const definition = resolved.layout.slots.find((s) => s.id === slot.definition.id);
    if (!definition) {
      return slot;
    }

    let computedPosition: Position = { ...definition.position };

    if (breakpoint === 'mobile' && definition.responsive?.mobile) {
      computedPosition = mergePosition(computedPosition, definition.responsive.mobile);
    } else if (breakpoint === 'tablet' && definition.responsive?.tablet) {
      computedPosition = mergePosition(computedPosition, definition.responsive.tablet);
    }

    return {
      ...slot,
      computedPosition,
    };
  });

  return {
    ...resolved,
    resolvedSlots: updatedSlots,
  };
}

/**
 * Determine the breakpoint for a given viewport width.
 */
function getBreakpoint(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Merge a partial position override into a base position.
 */
function mergePosition(
  base: Position,
  override: Partial<Position>,
): Position {
  return {
    x: override.x ?? base.x,
    y: override.y ?? base.y,
    width: override.width ?? base.width,
    height: override.height ?? base.height,
  };
}
