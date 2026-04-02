import type { ThemeTokens } from '@/types/theme';

export const oceanBreeze: ThemeTokens = {
  colors: {
    primary: '#0369A1',
    secondary: '#0EA5E9',
    accent: '#14B8A6',
    background: '#F0F9FF',
    surface: '#E0F2FE',
    textPrimary: '#0C4A6E',
    textSecondary: '#0369A1',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#BAE6FD',
    shadow: 'rgba(3, 105, 161, 0.12)',
  },
  typography: {
    fontFamily: {
      heading: '"Poppins", "Inter", sans-serif',
      body: '"Source Sans Pro", "Inter", sans-serif',
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
      '4xl': '2.25rem',
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
    maxWidth: 1200,
    borderRadius: 12,
    shadowStyle: 'md',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'gradient',
    gradientAngle: 135,
    gradientStops: [
      { color: '#F0F9FF', position: 0 },
      { color: '#E0F2FE', position: 100 },
    ],
  },
};
