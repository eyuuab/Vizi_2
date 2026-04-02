import { z } from 'zod';

// ============================================================
// Layout Category — Section 5.1.1
// ============================================================
export const LAYOUT_CATEGORIES = [
  'COVER',
  'CONTENT',
  'DATA',
  'MEDIA',
  'COMPARISON',
  'TIMELINE',
  'CTA',
  'BLANK',
] as const;

export const LayoutCategorySchema = z.enum(LAYOUT_CATEGORIES);
export type LayoutCategory = z.infer<typeof LayoutCategorySchema>;

// ============================================================
// Slot Type — Section 5.1.3
// ============================================================
export const SLOT_TYPES = [
  'TEXT',
  'RICHTEXT',
  'HEADING',
  'IMAGE',
  'VIDEO',
  'CHART',
  'MERMAID',
  'LIST',
  'STATS',
  'URL',
  'CONFIG',
] as const;

export const SlotTypeSchema = z.enum(SLOT_TYPES);
export type SlotType = z.infer<typeof SlotTypeSchema>;

// ============================================================
// Media Type — Section 5.1.1
// ============================================================
export const MEDIA_TYPES = ['IMAGE', 'VIDEO', 'CHART', 'MERMAID'] as const;

export const MediaTypeSchema = z.enum(MEDIA_TYPES);
export type MediaType = z.infer<typeof MediaTypeSchema>;

// ============================================================
// Asset Type — Section 4.2.5
// ============================================================
export const ASSET_TYPES = ['IMAGE', 'VIDEO', 'ICON', 'CHART_DATA', 'DOCUMENT'] as const;

export const AssetTypeSchema = z.enum(ASSET_TYPES);
export type AssetType = z.infer<typeof AssetTypeSchema>;

// ============================================================
// User Plan — Section 4.2.1
// ============================================================
export const USER_PLANS = ['FREE', 'PRO', 'TEAM'] as const;

export const UserPlanSchema = z.enum(USER_PLANS);
export type UserPlan = z.infer<typeof UserPlanSchema>;

// ============================================================
// Background Type — Section 8.1.1
// ============================================================
export const BACKGROUND_TYPES = ['solid', 'gradient', 'image', 'pattern'] as const;

export const BackgroundTypeSchema = z.enum(BACKGROUND_TYPES);
export type BackgroundType = z.infer<typeof BackgroundTypeSchema>;

// ============================================================
// Shadow Style — Section 8.1.1
// ============================================================
export const SHADOW_STYLES = ['none', 'sm', 'md', 'lg'] as const;

export const ShadowStyleSchema = z.enum(SHADOW_STYLES);
export type ShadowStyle = z.infer<typeof ShadowStyleSchema>;

// ============================================================
// Image Style — Section 8.1.1
// ============================================================
export const IMAGE_STYLES = ['rounded', 'square', 'circle'] as const;

export const ImageStyleSchema = z.enum(IMAGE_STYLES);
export type ImageStyle = z.infer<typeof ImageStyleSchema>;

// ============================================================
// Font Weight — Section 8.1.1
// ============================================================
export const FONT_WEIGHTS = ['regular', 'medium', 'semibold', 'bold'] as const;

export const FontWeightSchema = z.enum(FONT_WEIGHTS);
export type FontWeight = z.infer<typeof FontWeightSchema>;
