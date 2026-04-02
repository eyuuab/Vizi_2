import { z } from 'zod';
import type { LayoutTemplate } from '@/types/layout';
import type { LayoutCategory } from '@/types/enums';
import {
  heroSplitLayout,
  heroCenterLayout,
  heroGradientLayout,
  contentTextLayout,
  contentTwoColumnLayout,
  contentTextImageLayout,
  contentImageTextLayout,
  dataChartLayout,
  dataStatsLayout,
  dataTableLayout,
  mediaFullLayout,
  mediaGalleryLayout,
  comparisonTwoLayout,
  comparisonThreeLayout,
  timelineVerticalLayout,
  timelineHorizontalLayout,
  ctaSimpleLayout,
  blankLayout,
} from './templates';

// ============================================================
// Layout Registry
// ============================================================

const ALL_LAYOUTS: LayoutTemplate[] = [
  heroSplitLayout,
  heroCenterLayout,
  heroGradientLayout,
  contentTextLayout,
  contentTwoColumnLayout,
  contentTextImageLayout,
  contentImageTextLayout,
  dataChartLayout,
  dataStatsLayout,
  dataTableLayout,
  mediaFullLayout,
  mediaGalleryLayout,
  comparisonTwoLayout,
  comparisonThreeLayout,
  timelineVerticalLayout,
  timelineHorizontalLayout,
  ctaSimpleLayout,
  blankLayout,
];

export const LAYOUT_REGISTRY: Record<string, LayoutTemplate> = Object.fromEntries(
  ALL_LAYOUTS.map((layout) => [layout.id, layout]),
);

// ============================================================
// Validation Result
// ============================================================

export interface ValidationIssue {
  slotId: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

// ============================================================
// Public API
// ============================================================

/**
 * Get a layout template by its unique ID.
 * Throws if the layout is not found.
 */
export function getLayout(id: string): LayoutTemplate {
  const layout = LAYOUT_REGISTRY[id];
  if (!layout) {
    throw new Error(`Layout not found: "${id}". Available layouts: ${Object.keys(LAYOUT_REGISTRY).join(', ')}`);
  }
  return layout;
}

/**
 * Get all layout templates belonging to a given category.
 */
export function getLayoutsByCategory(category: LayoutCategory): LayoutTemplate[] {
  return ALL_LAYOUTS.filter((layout) => layout.category === category);
}

/**
 * Get all registered layout templates.
 */
export function getAllLayouts(): LayoutTemplate[] {
  return [...ALL_LAYOUTS];
}

/**
 * Get all registered layout IDs.
 */
export function getLayoutIds(): string[] {
  return ALL_LAYOUTS.map((layout) => layout.id);
}

/**
 * Validate slot content against a layout template's slot definitions.
 * Returns a ValidationResult with issues for any violations found.
 */
export function validateSlotContent(
  layout: LayoutTemplate,
  content: Record<string, unknown>,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  for (const slot of layout.slots) {
    const value = content[slot.id];

    // Check required slots
    if (slot.required && (value === undefined || value === null || value === '')) {
      issues.push({
        slotId: slot.id,
        field: 'required',
        message: `Slot "${slot.label}" is required but has no content.`,
        severity: 'error',
      });
      continue;
    }

    // Skip further validation if value is absent and slot is optional
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Validate text-based slots
    if (
      (slot.type === 'TEXT' || slot.type === 'RICHTEXT' || slot.type === 'HEADING') &&
      typeof value === 'string'
    ) {
      const minLen = slot.constraints?.minLength;
      const maxLen = slot.constraints?.maxLength;

      if (minLen !== undefined && value.length < minLen) {
        issues.push({
          slotId: slot.id,
          field: 'minLength',
          message: `Slot "${slot.label}" content is too short. Minimum: ${String(minLen)} characters, got: ${String(value.length)}.`,
          severity: 'error',
        });
      }

      if (maxLen !== undefined && value.length > maxLen) {
        issues.push({
          slotId: slot.id,
          field: 'maxLength',
          message: `Slot "${slot.label}" content exceeds maximum length. Maximum: ${String(maxLen)} characters, got: ${String(value.length)}.`,
          severity: 'error',
        });
      }
    }

    // Validate IMAGE slots — check format if string URL provided
    if (slot.type === 'IMAGE' && typeof value === 'string' && value.length > 0) {
      const allowedFormats = slot.constraints?.allowedFormats;
      if (allowedFormats && allowedFormats.length > 0) {
        const extension = value.split('.').pop()?.toLowerCase();
        if (extension && !allowedFormats.includes(extension)) {
          issues.push({
            slotId: slot.id,
            field: 'allowedFormats',
            message: `Slot "${slot.label}" image format "${extension}" is not allowed. Allowed: ${allowedFormats.join(', ')}.`,
            severity: 'warning',
          });
        }
      }
    }
  }

  // Warn about unknown slot IDs in content
  const knownSlotIds = new Set(layout.slots.map((s) => s.id));
  for (const key of Object.keys(content)) {
    if (!knownSlotIds.has(key)) {
      issues.push({
        slotId: key,
        field: 'unknown',
        message: `Content key "${key}" does not match any slot in layout "${layout.id}".`,
        severity: 'warning',
      });
    }
  }

  return {
    valid: issues.filter((i) => i.severity === 'error').length === 0,
    issues,
  };
}

// ============================================================
// Zod schema for layout IDs (useful for API validation)
// ============================================================

export const LayoutIdSchema = z.enum(
  ALL_LAYOUTS.map((l) => l.id) as [string, ...string[]],
);

export type LayoutId = z.infer<typeof LayoutIdSchema>;
