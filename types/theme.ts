import { z } from 'zod';
import {
  BackgroundTypeSchema,
  FontWeightSchema,
  ImageStyleSchema,
  ShadowStyleSchema,
} from '@/types/enums';

// ============================================================
// Theme Token System — Section 8.1
// ============================================================

/** Color tokens — Section 8.1.1 Colors */
export const ThemeColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  surface: z.string(),
  textPrimary: z.string(),
  textSecondary: z.string(),
  textOnPrimary: z.string(),
  textOnAccent: z.string(),
  border: z.string(),
  shadow: z.string(),
});

export type ThemeColors = z.infer<typeof ThemeColorsSchema>;

/** Typography tokens — Section 8.1.1 Typography */
export const ThemeTypographySchema = z.object({
  fontFamily: z.object({
    heading: z.string(),
    body: z.string(),
    mono: z.string(),
  }),
  fontSize: z.object({
    xs: z.string(),
    sm: z.string(),
    base: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    '3xl': z.string(),
    '4xl': z.string(),
  }),
  fontWeight: FontWeightSchema,
  lineHeight: z.string(),
  letterSpacing: z.string(),
});

export type ThemeTypography = z.infer<typeof ThemeTypographySchema>;

/** Spacing tokens — Section 8.1.1 Spacing */
export const ThemeSpacingSchema = z.object({
  sectionPadding: z.object({
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
    left: z.number(),
  }),
  slotGap: z.number(),
  innerPadding: z.number(),
  sectionGap: z.number(),
});

export type ThemeSpacing = z.infer<typeof ThemeSpacingSchema>;

/** Layout tokens — Section 8.1.1 Layout */
export const ThemeLayoutSchema = z.object({
  maxWidth: z.number(),
  borderRadius: z.number(),
  shadowStyle: ShadowStyleSchema,
  imageStyle: ImageStyleSchema,
});

export type ThemeLayout = z.infer<typeof ThemeLayoutSchema>;

/** Gradient stop */
export const GradientStopSchema = z.object({
  color: z.string(),
  position: z.number().min(0).max(100),
});

export type GradientStop = z.infer<typeof GradientStopSchema>;

/** Effects tokens — Section 8.1.1 Effects */
export const ThemeEffectsSchema = z.object({
  backgroundType: BackgroundTypeSchema,
  gradientAngle: z.number().optional(),
  gradientStops: z.array(GradientStopSchema).optional(),
  overlayOpacity: z.number().min(0).max(1).optional(),
});

export type ThemeEffects = z.infer<typeof ThemeEffectsSchema>;

/** Complete ThemeTokens — combines all token categories */
export const ThemeTokensSchema = z.object({
  colors: ThemeColorsSchema,
  typography: ThemeTypographySchema,
  spacing: ThemeSpacingSchema,
  layout: ThemeLayoutSchema,
  effects: ThemeEffectsSchema,
});

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
