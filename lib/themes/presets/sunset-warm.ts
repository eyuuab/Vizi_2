import type { ThemeTokens } from '@/types/theme';

export const sunsetWarm: ThemeTokens = {
  colors: {
    primary: '#EA580C',
    secondary: '#F97316',
    accent: '#E11D48',
    background: '#FFFBEB',
    surface: '#FEF3C7',
    textPrimary: '#451A03',
    textSecondary: '#92400E',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#FDE68A',
    shadow: 'rgba(234, 88, 12, 0.15)',
  },
  typography: {
    fontFamily: {
      heading: '"Playfair Display", Georgia, serif',
      body: '"Lato", "Inter", sans-serif',
      mono: '"Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.5rem',
    },
    fontWeight: 'semibold',
    lineHeight: '1.6',
    letterSpacing: '0em',
  },
  spacing: {
    sectionPadding: { top: 48, right: 48, bottom: 48, left: 48 },
    slotGap: 24,
    innerPadding: 16,
    sectionGap: 32,
  },
  layout: {
    maxWidth: 1100,
    borderRadius: 16,
    shadowStyle: 'md',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'gradient',
    gradientAngle: 180,
    gradientStops: [
      { color: '#FFFBEB', position: 0 },
      { color: '#FEF3C7', position: 50 },
      { color: '#FDE68A', position: 100 },
    ],
  },
};
