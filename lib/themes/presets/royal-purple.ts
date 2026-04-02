import type { ThemeTokens } from '@/types/theme';

export const royalPurple: ThemeTokens = {
  colors: {
    primary: '#7C3AED',
    secondary: '#A78BFA',
    accent: '#EC4899',
    background: '#FAF5FF',
    surface: '#EDE9FE',
    textPrimary: '#2E1065',
    textSecondary: '#6B21A8',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#DDD6FE',
    shadow: 'rgba(124, 58, 237, 0.15)',
  },
  typography: {
    fontFamily: {
      heading: '"Outfit", "Inter", sans-serif',
      body: '"Inter", sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: 'semibold',
    lineHeight: '1.6',
    letterSpacing: '-0.01em',
  },
  spacing: {
    sectionPadding: { top: 48, right: 48, bottom: 48, left: 48 },
    slotGap: 24,
    innerPadding: 16,
    sectionGap: 32,
  },
  layout: {
    maxWidth: 1200,
    borderRadius: 12,
    shadowStyle: 'md',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'gradient',
    gradientAngle: 135,
    gradientStops: [
      { color: '#FAF5FF', position: 0 },
      { color: '#EDE9FE', position: 100 },
    ],
  },
};
