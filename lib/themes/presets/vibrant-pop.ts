import type { ThemeTokens } from '@/types/theme';

export const vibrantPop: ThemeTokens = {
  colors: {
    primary: '#7C3AED',
    secondary: '#F59E0B',
    accent: '#10B981',
    background: '#FFFFFF',
    surface: '#F5F3FF',
    textPrimary: '#1F2937',
    textSecondary: '#4B5563',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#E5E7EB',
    shadow: 'rgba(124, 58, 237, 0.15)',
  },
  typography: {
    fontFamily: {
      heading: '"Plus Jakarta Sans", "Inter", sans-serif',
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
      '3xl': '2rem',
      '4xl': '2.5rem',
    },
    fontWeight: 'bold',
    lineHeight: '1.5',
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
    borderRadius: 16,
    shadowStyle: 'md',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'solid',
  },
};
