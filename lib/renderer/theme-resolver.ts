/**
 * Theme Resolution — Step 2 of the PPTX Pipeline
 *
 * Converts ThemeTokens into PPTX-compatible values:
 * - Hex colors (without '#' prefix for PptxGenJS)
 * - Font face names (extracted from CSS font-family strings)
 * - Point sizes (converted from rem/px strings)
 * - Inch measurements (from pixel values)
 */

import type { ThemeTokens, ThemeColors } from '@/types/theme';

// ============================================================
// Resolved PPTX Theme — all values PPTX-ready
// ============================================================

export interface PptxResolvedTheme {
  colors: PptxColors;
  fonts: PptxFonts;
  fontSizes: PptxFontSizes;
  spacing: PptxSpacing;
  background: PptxBackground;
}

export interface PptxColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  textOnAccent: string;
  border: string;
}

export interface PptxFonts {
  heading: string;
  body: string;
  mono: string;
}

export interface PptxFontSizes {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

export interface PptxSpacing {
  sectionPaddingInches: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  slotGapInches: number;
  innerPaddingInches: number;
}

export interface PptxBackground {
  type: 'solid' | 'gradient';
  color: string;
  gradientAngle?: number;
  gradientStops?: Array<{ color: string; position: number }>;
}

// ============================================================
// Constants
// ============================================================

const PX_PER_INCH = 96;
const BASE_FONT_SIZE_PX = 16;

// ============================================================
// Public API
// ============================================================

/**
 * Resolve ThemeTokens into PPTX-compatible values.
 */
export function resolveThemeForPptx(tokens: ThemeTokens): PptxResolvedTheme {
  return {
    colors: resolveColors(tokens.colors),
    fonts: resolveFonts(tokens),
    fontSizes: resolveFontSizes(tokens),
    spacing: resolveSpacing(tokens),
    background: resolveBackground(tokens),
  };
}

// ============================================================
// Color Resolution
// ============================================================

/**
 * Convert all theme colors to PptxGenJS hex format (no '#' prefix).
 * PptxGenJS expects hex colors as 6-char strings like 'FF0000'.
 */
function resolveColors(colors: ThemeColors): PptxColors {
  return {
    primary: stripHexPrefix(colors.primary),
    secondary: stripHexPrefix(colors.secondary),
    accent: stripHexPrefix(colors.accent),
    background: stripHexPrefix(colors.background),
    surface: stripHexPrefix(colors.surface),
    textPrimary: stripHexPrefix(colors.textPrimary),
    textSecondary: stripHexPrefix(colors.textSecondary),
    textOnPrimary: stripHexPrefix(colors.textOnPrimary),
    textOnAccent: stripHexPrefix(colors.textOnAccent),
    border: stripHexPrefix(colors.border),
  };
}

/**
 * Strip '#' prefix and handle rgba/rgb colors by converting to hex.
 */
export function stripHexPrefix(color: string): string {
  const trimmed = color.trim();

  // Handle rgba() format — extract RGB, ignore alpha for PPTX
  const rgbaMatch = trimmed.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/,
  );
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1] ?? '0', 10);
    const g = parseInt(rgbaMatch[2] ?? '0', 10);
    const b = parseInt(rgbaMatch[3] ?? '0', 10);
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  // Handle standard hex with or without '#'
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    // Convert shorthand (#RGB) to full (#RRGGBB)
    if (hex.length === 3) {
      return (hex[0] ?? 'F') + (hex[0] ?? 'F') + (hex[1] ?? 'F') + (hex[1] ?? 'F') + (hex[2] ?? 'F') + (hex[2] ?? 'F');
    }
    // Strip alpha channel if 8-char hex
    if (hex.length === 8) {
      return hex.slice(0, 6);
    }
    return hex;
  }

  // Already a bare hex string
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed;
  }

  // Fallback: return black
  return '000000';
}

function componentToHex(c: number): string {
  const hex = Math.max(0, Math.min(255, c)).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

// ============================================================
// Font Resolution
// ============================================================

/**
 * Extract the primary font face name from CSS font-family strings.
 * E.g., '"Inter", "Helvetica Neue", Arial, sans-serif' → 'Inter'
 */
function resolveFonts(tokens: ThemeTokens): PptxFonts {
  return {
    heading: extractFontFace(tokens.typography.fontFamily.heading),
    body: extractFontFace(tokens.typography.fontFamily.body),
    mono: extractFontFace(tokens.typography.fontFamily.mono),
  };
}

/**
 * Extract the first font name from a CSS font-family string.
 */
export function extractFontFace(fontFamily: string): string {
  const firstFont = fontFamily.split(',')[0]?.trim() ?? 'Calibri';
  // Remove surrounding quotes
  return firstFont.replace(/^["']|["']$/g, '');
}

// ============================================================
// Font Size Resolution
// ============================================================

/**
 * Convert CSS font sizes (rem, px, pt) to point values for PptxGenJS.
 */
function resolveFontSizes(tokens: ThemeTokens): PptxFontSizes {
  return {
    xs: cssSizeToPoints(tokens.typography.fontSize.xs),
    sm: cssSizeToPoints(tokens.typography.fontSize.sm),
    base: cssSizeToPoints(tokens.typography.fontSize.base),
    lg: cssSizeToPoints(tokens.typography.fontSize.lg),
    xl: cssSizeToPoints(tokens.typography.fontSize.xl),
    '2xl': cssSizeToPoints(tokens.typography.fontSize['2xl']),
    '3xl': cssSizeToPoints(tokens.typography.fontSize['3xl']),
    '4xl': cssSizeToPoints(tokens.typography.fontSize['4xl']),
  };
}

/**
 * Convert a CSS size string to points.
 * - rem → multiply by base font (16px) → convert px to pt (×0.75)
 * - px → convert to pt (×0.75)
 * - pt → return as-is
 */
export function cssSizeToPoints(size: string): number {
  const trimmed = size.trim();

  const remMatch = trimmed.match(/^([\d.]+)\s*rem$/);
  if (remMatch) {
    const remValue = parseFloat(remMatch[1] ?? '1');
    const px = remValue * BASE_FONT_SIZE_PX;
    return Math.round(px * 0.75 * 10) / 10; // px to pt
  }

  const pxMatch = trimmed.match(/^([\d.]+)\s*px$/);
  if (pxMatch) {
    const pxValue = parseFloat(pxMatch[1] ?? '16');
    return Math.round(pxValue * 0.75 * 10) / 10;
  }

  const ptMatch = trimmed.match(/^([\d.]+)\s*pt$/);
  if (ptMatch) {
    return parseFloat(ptMatch[1] ?? '12');
  }

  // Fallback: assume rem
  const numericValue = parseFloat(trimmed);
  if (!isNaN(numericValue)) {
    return Math.round(numericValue * BASE_FONT_SIZE_PX * 0.75 * 10) / 10;
  }

  return 12; // Default 12pt
}

// ============================================================
// Spacing Resolution
// ============================================================

/**
 * Convert pixel spacing to inches for PPTX.
 */
function resolveSpacing(tokens: ThemeTokens): PptxSpacing {
  return {
    sectionPaddingInches: {
      top: pxToInches(tokens.spacing.sectionPadding.top),
      right: pxToInches(tokens.spacing.sectionPadding.right),
      bottom: pxToInches(tokens.spacing.sectionPadding.bottom),
      left: pxToInches(tokens.spacing.sectionPadding.left),
    },
    slotGapInches: pxToInches(tokens.spacing.slotGap),
    innerPaddingInches: pxToInches(tokens.spacing.innerPadding),
  };
}

function pxToInches(px: number): number {
  return Math.round((px / PX_PER_INCH) * 100) / 100;
}

// ============================================================
// Background Resolution
// ============================================================

/**
 * Resolve background settings for slide master.
 */
function resolveBackground(tokens: ThemeTokens): PptxBackground {
  if (
    tokens.effects.backgroundType === 'gradient' &&
    tokens.effects.gradientStops &&
    tokens.effects.gradientStops.length > 0
  ) {
    return {
      type: 'gradient',
      color: stripHexPrefix(tokens.colors.background),
      gradientAngle: tokens.effects.gradientAngle ?? 135,
      gradientStops: tokens.effects.gradientStops.map((stop) => ({
        color: stripHexPrefix(stop.color),
        position: stop.position,
      })),
    };
  }

  return {
    type: 'solid',
    color: stripHexPrefix(tokens.colors.background),
  };
}
