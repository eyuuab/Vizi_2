/**
 * Shape Mapper — Step 3 of the PPTX Pipeline
 *
 * Maps layout template slots to PptxGenJS shapes using the layout's pptxMapping.
 * Each slot's pptxMapping entry defines:
 * - shapeType: 'textbox' | 'image' | 'shape' | 'table' | 'chart'
 * - x, y, w, h: position and size in inches
 * - Optional: fill, border, shadow, rotation
 */

import type PptxGenJS from 'pptxgenjs';
import type { PptxSlotMapping } from '@/types/layout';
import type { ResolvedSlot } from '@/types/presentation';
import type { PptxResolvedTheme } from './theme-resolver';
import { stripHexPrefix } from './theme-resolver';

// ============================================================
// Types
// ============================================================

export interface MappedShape {
  slotId: string;
  slotType: string;
  shapeType: 'textbox' | 'image' | 'shape' | 'table' | 'chart';
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content: unknown;
  style: ShapeStyle;
}

export interface ShapeStyle {
  fill?: string;
  border?: { color: string; width: number };
  shadow?: boolean;
  rotation?: number;
}

// ============================================================
// Public API
// ============================================================

/**
 * Map all resolved slots of a section to PptxGenJS shape specifications.
 * Uses the layout's pptxMapping to determine coordinates and shape types.
 */
export function mapSlotsToShapes(
  slots: ResolvedSlot[],
  pptxMapping: PptxSlotMapping,
  theme: PptxResolvedTheme,
): MappedShape[] {
  const shapes: MappedShape[] = [];

  for (const slot of slots) {
    const mapping = pptxMapping[slot.definition.id];
    if (!mapping) {
      // No mapping defined for this slot — skip
      continue;
    }

    // Skip slots with no content
    if (slot.content === null || slot.content === undefined || slot.content === '') {
      continue;
    }

    const style: ShapeStyle = {};

    if (mapping.fill) {
      style.fill = stripHexPrefix(mapping.fill);
    }

    if (mapping.border) {
      style.border = {
        color: stripHexPrefix(mapping.border.color),
        width: mapping.border.width,
      };
    }

    if (mapping.shadow !== undefined) {
      style.shadow = mapping.shadow;
    }

    if (mapping.rotation !== undefined) {
      style.rotation = mapping.rotation;
    }

    shapes.push({
      slotId: slot.definition.id,
      slotType: slot.definition.type,
      shapeType: mapping.shapeType,
      position: {
        x: mapping.x,
        y: mapping.y,
        w: mapping.w,
        h: mapping.h,
      },
      content: slot.content,
      style,
    });
  }

  return shapes;
}

/**
 * Apply common style properties to a PptxGenJS shape options object.
 */
export function applyShapeStyle(
  options: Record<string, unknown>,
  style: ShapeStyle,
  _theme: PptxResolvedTheme,
): void {
  if (style.fill) {
    options['fill'] = { color: style.fill };
  }

  if (style.border) {
    options['line'] = {
      color: style.border.color,
      width: style.border.width,
    };
  }

  if (style.shadow) {
    options['shadow'] = {
      type: 'outer' as const,
      color: '000000',
      opacity: 0.23,
      blur: 6,
      offset: 3,
      angle: 270,
    } satisfies PptxGenJS.ShadowProps;
  }

  if (style.rotation !== undefined) {
    options['rotate'] = style.rotation;
  }
}
