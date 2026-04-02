import type { ThemeTokens } from '@/types/theme';

export const modernDark: ThemeTokens = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#6366F1',
    accent: '#22D3EE',
    background: '#0F172A',
    surface: '#1E293B',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#0F172A',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
  typography: {
    fontFamily: {
      heading: '"Space Grotesk", "Inter", sans-serif',
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
    borderRadius: 12,
    shadowStyle: 'lg',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'gradient',
    gradientAngle: 135,
    gradientStops: [
      { color: '#0F172A', position: 0 },
      { color: '#1E293B', position: 100 },
    ],
  },
};
