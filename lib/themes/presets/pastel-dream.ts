import type { ThemeTokens } from '@/types/theme';

export const pastelDream: ThemeTokens = {
  colors: {
    primary: '#DB2777',
    secondary: '#EC4899',
    accent: '#7C3AED',
    background: '#FDF2F8',
    surface: '#FCE7F3',
    textPrimary: '#831843',
    textSecondary: '#9D174D',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#FBCFE8',
    shadow: 'rgba(219, 39, 119, 0.1)',
  },
  typography: {
    fontFamily: {
      heading: '"Quicksand", "Inter", sans-serif',
      body: '"Nunito", "Inter", sans-serif',
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
    fontWeight: 'medium',
    lineHeight: '1.6',
    letterSpacing: '0.01em',
  },
  spacing: {
    sectionPadding: { top: 48, right: 48, bottom: 48, left: 48 },
    slotGap: 24,
    innerPadding: 16,
    sectionGap: 32,
  },
  layout: {
    maxWidth: 1100,
    borderRadius: 20,
    shadowStyle: 'sm',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'gradient',
    gradientAngle: 135,
    gradientStops: [
      { color: '#FDF2F8', position: 0 },
      { color: '#EDE9FE', position: 100 },
    ],
  },
};
