import type { ThemeTokens } from '@/types/theme';

export const neonNights: ThemeTokens = {
  colors: {
    primary: '#E11D48',
    secondary: '#F43F5E',
    accent: '#06B6D4',
    background: '#030712',
    surface: '#111827',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#030712',
    border: '#1F2937',
    shadow: 'rgba(225, 29, 72, 0.25)',
  },
  typography: {
    fontFamily: {
      heading: '"Space Grotesk", "Inter", sans-serif',
      body: '"Inter", sans-serif',
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
    fontWeight: 'bold',
    lineHeight: '1.5',
    letterSpacing: '-0.02em',
  },
  spacing: {
    sectionPadding: { top: 56, right: 56, bottom: 56, left: 56 },
    slotGap: 28,
    innerPadding: 20,
    sectionGap: 36,
  },
  layout: {
    maxWidth: 1200,
    borderRadius: 16,
    shadowStyle: 'lg',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'gradient',
    gradientAngle: 160,
    gradientStops: [
      { color: '#030712', position: 0 },
      { color: '#111827', position: 50 },
      { color: '#1E1338', position: 100 },
    ],
  },
};
