import { z } from 'zod';
import type { ThemeTokens } from '@/types/theme';
import {
  corporateBlue,
  modernDark,
  minimalLight,
  sunsetWarm,
  oceanBreeze,
  forestGreen,
  royalPurple,
  neonNights,
  earthyTones,
  pastelDream,
  monochrome,
  vibrantPop,
} from './presets';

// ============================================================
// Theme Preset Metadata
// ============================================================

export interface ThemePresetInfo {
  id: string;
  name: string;
  description: string;
  tokens: ThemeTokens;
}

const PRESET_LIST: ThemePresetInfo[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional blue theme for business presentations.',
    tokens: corporateBlue,
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Sleek dark theme with purple accents for tech talks.',
    tokens: modernDark,
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Clean, minimal white theme with bold typography.',
    tokens: minimalLight,
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Warm orange and amber tones for creative presentations.',
    tokens: sunsetWarm,
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool blue and teal palette inspired by the sea.',
    tokens: oceanBreeze,
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green palette for sustainability and nature topics.',
    tokens: forestGreen,
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Rich purple theme for premium, elegant presentations.',
    tokens: royalPurple,
  },
  {
    id: 'neon-nights',
    name: 'Neon Nights',
    description: 'Bold neon-on-dark theme for striking visual impact.',
    tokens: neonNights,
  },
  {
    id: 'earthy-tones',
    name: 'Earthy Tones',
    description: 'Warm browns and greens for grounded, organic feel.',
    tokens: earthyTones,
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    description: 'Soft pink and purple pastels for a gentle aesthetic.',
    tokens: pastelDream,
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Pure black and white for maximum typographic clarity.',
    tokens: monochrome,
  },
  {
    id: 'vibrant-pop',
    name: 'Vibrant Pop',
    description: 'Colorful and energetic theme with bold contrasts.',
    tokens: vibrantPop,
  },
];

// ============================================================
// Theme Preset Registry
// ============================================================

export const THEME_PRESETS: Record<string, ThemeTokens> = Object.fromEntries(
  PRESET_LIST.map((preset) => [preset.id, preset.tokens]),
);

// ============================================================
// CSS Variable Map Type
// ============================================================

export type CSSVariableMap = Record<string, string>;

// ============================================================
// Public API
// ============================================================

/**
 * Get a theme preset by ID. Throws if not found.
 */
export function getThemePreset(id: string): ThemeTokens {
  const tokens = THEME_PRESETS[id];
  if (!tokens) {
    throw new Error(`Theme preset not found: "${id}". Available presets: ${Object.keys(THEME_PRESETS).join(', ')}`);
  }
  return tokens;
}

/**
 * Get all theme preset metadata (without full token objects for listing).
 */
export function getAllThemePresets(): ThemePresetInfo[] {
  return [...PRESET_LIST];
}

/**
 * Get all theme preset IDs.
 */
export function getThemePresetIds(): string[] {
  return PRESET_LIST.map((p) => p.id);
}

/**
 * Resolve ThemeTokens into a flat map of CSS custom properties.
 * Keys are formatted as --sf-{category}-{property}.
 */
export function resolveThemeTokens(tokens: ThemeTokens): CSSVariableMap {
  const vars: CSSVariableMap = {};

  // Colors
  for (const [key, value] of Object.entries(tokens.colors)) {
    vars[`--sf-color-${camelToKebab(key)}`] = value;
  }

  // Typography — font families
  vars['--sf-font-heading'] = tokens.typography.fontFamily.heading;
  vars['--sf-font-body'] = tokens.typography.fontFamily.body;
  vars['--sf-font-mono'] = tokens.typography.fontFamily.mono;

  // Typography — font sizes
  for (const [key, value] of Object.entries(tokens.typography.fontSize)) {
    vars[`--sf-text-${key}`] = value;
  }

  // Typography — weight, line height, letter spacing
  vars['--sf-font-weight'] = fontWeightToNumber(tokens.typography.fontWeight);
  vars['--sf-line-height'] = tokens.typography.lineHeight;
  vars['--sf-letter-spacing'] = tokens.typography.letterSpacing;

  // Spacing
  vars['--sf-section-padding-top'] = `${String(tokens.spacing.sectionPadding.top)}px`;
  vars['--sf-section-padding-right'] = `${String(tokens.spacing.sectionPadding.right)}px`;
  vars['--sf-section-padding-bottom'] = `${String(tokens.spacing.sectionPadding.bottom)}px`;
  vars['--sf-section-padding-left'] = `${String(tokens.spacing.sectionPadding.left)}px`;
  vars['--sf-slot-gap'] = `${String(tokens.spacing.slotGap)}px`;
  vars['--sf-inner-padding'] = `${String(tokens.spacing.innerPadding)}px`;
  vars['--sf-section-gap'] = `${String(tokens.spacing.sectionGap)}px`;

  // Layout
  vars['--sf-max-width'] = `${String(tokens.layout.maxWidth)}px`;
  vars['--sf-border-radius'] = `${String(tokens.layout.borderRadius)}px`;
  vars['--sf-shadow'] = resolveShadow(tokens.layout.shadowStyle, tokens.colors.shadow);
  vars['--sf-image-radius'] = resolveImageRadius(tokens.layout.imageStyle, tokens.layout.borderRadius);

  // Effects
  vars['--sf-bg-type'] = tokens.effects.backgroundType;
  if (tokens.effects.gradientAngle !== undefined) {
    vars['--sf-gradient-angle'] = `${String(tokens.effects.gradientAngle)}deg`;
  }
  if (tokens.effects.gradientStops && tokens.effects.gradientStops.length > 0) {
    vars['--sf-gradient'] = buildGradientCSS(
      tokens.effects.gradientAngle ?? 135,
      tokens.effects.gradientStops,
    );
  }
  if (tokens.effects.overlayOpacity !== undefined) {
    vars['--sf-overlay-opacity'] = String(tokens.effects.overlayOpacity);
  }

  // Derived slide background (subtle multi-color blend, never a flat single color)
  vars['--sf-slide-background'] = buildSlideBackground(tokens);

  return vars;
}

/**
 * Generate a complete CSS string from ThemeTokens.
 * Wraps all CSS variables in a :root or custom selector block.
 */
export function generateThemeCSS(tokens: ThemeTokens, selector: string = ':root'): string {
  const vars = resolveThemeTokens(tokens);
  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `${selector} {\n${lines}\n}`;
}

// ============================================================
// Zod schema for theme preset IDs
// ============================================================

export const ThemePresetIdSchema = z.enum(
  PRESET_LIST.map((p) => p.id) as [string, ...string[]],
);

export type ThemePresetId = z.infer<typeof ThemePresetIdSchema>;

// ============================================================
// Internal Helpers
// ============================================================

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function fontWeightToNumber(weight: string): string {
  const map: Record<string, string> = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  };
  return map[weight] ?? '400';
}

function resolveShadow(style: string, shadowColor: string): string {
  switch (style) {
    case 'sm':
      return `0 1px 2px 0 ${shadowColor}`;
    case 'md':
      return `0 4px 6px -1px ${shadowColor}, 0 2px 4px -2px ${shadowColor}`;
    case 'lg':
      return `0 10px 15px -3px ${shadowColor}, 0 4px 6px -4px ${shadowColor}`;
    case 'none':
    default:
      return 'none';
  }
}

function resolveImageRadius(style: string, baseBorderRadius: number): string {
  switch (style) {
    case 'rounded':
      return `${String(baseBorderRadius)}px`;
    case 'circle':
      return '50%';
    case 'square':
    default:
      return '0px';
  }
}

function buildGradientCSS(
  angle: number,
  stops: Array<{ color: string; position: number }>,
): string {
  const stopStrings = stops.map((s) => `${s.color} ${String(s.position)}%`).join(', ');
  return `linear-gradient(${String(angle)}deg, ${stopStrings})`;
}

function buildSlideBackground(tokens: ThemeTokens): string {
  const bg = parseColor(tokens.colors.background) ?? { r: 255, g: 255, b: 255 };
  const surface = parseColor(tokens.colors.surface) ?? bg;
  const primary = parseColor(tokens.colors.primary) ?? surface;
  const text = parseColor(tokens.colors.textPrimary) ?? { r: 17, g: 24, b: 39 };

  const darkTheme = getPerceivedLuminance(text) > getPerceivedLuminance(bg);

  // Keep blends subtle so readability stays high for content-heavy slides.
  const stopA = mixColors(bg, surface, darkTheme ? 0.65 : 0.5);
  const stopB = mixColors(bg, primary, darkTheme ? 0.18 : 0.1);
  const stopC = mixColors(surface, primary, darkTheme ? 0.24 : 0.14);

  const angle = tokens.effects.gradientAngle ?? 135;
  return `linear-gradient(${String(angle)}deg, ${toHex(stopA)} 0%, ${toHex(stopB)} 52%, ${toHex(stopC)} 100%)`;
}

function parseColor(value: string): { r: number; g: number; b: number } | null {
  const hex = value.trim();
  if (hex.startsWith('#')) {
    const raw = hex.slice(1);
    if (raw.length === 3) {
      const rChar = raw.charAt(0);
      const gChar = raw.charAt(1);
      const bChar = raw.charAt(2);
      const r = parseInt(rChar + rChar, 16);
      const g = parseInt(gChar + gChar, 16);
      const b = parseInt(bChar + bChar, 16);
      if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
      return { r, g, b };
    }
    if (raw.length === 6) {
      const r = parseInt(raw.slice(0, 2), 16);
      const g = parseInt(raw.slice(2, 4), 16);
      const b = parseInt(raw.slice(4, 6), 16);
      if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
      return { r, g, b };
    }
    return null;
  }

  const rgbMatch = hex.match(
    /^rgb\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)$/i,
  );
  if (!rgbMatch) return null;

  const rRaw = rgbMatch[1];
  const gRaw = rgbMatch[2];
  const bRaw = rgbMatch[3];
  if (!rRaw || !gRaw || !bRaw) return null;

  const r = clamp8(parseInt(rRaw, 10));
  const g = clamp8(parseInt(gRaw, 10));
  const b = clamp8(parseInt(bRaw, 10));
  return { r, g, b };
}

function clamp8(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mixColors(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  weight: number,
): { r: number; g: number; b: number } {
  const w = Math.max(0, Math.min(1, weight));
  return {
    r: clamp8(a.r * (1 - w) + b.r * w),
    g: clamp8(a.g * (1 - w) + b.g * w),
    b: clamp8(a.b * (1 - w) + b.b * w),
  };
}

function toHex(color: { r: number; g: number; b: number }): string {
  const r = color.r.toString(16).padStart(2, '0');
  const g = color.g.toString(16).padStart(2, '0');
  const b = color.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function getPerceivedLuminance(color: { r: number; g: number; b: number }): number {
  return (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
}
