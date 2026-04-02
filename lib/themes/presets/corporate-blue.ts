import type { ThemeTokens } from '@/types/theme';

export const corporateBlue: ThemeTokens = {
  colors: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#1E293B',
    border: '#E2E8F0',
    shadow: 'rgba(30, 64, 175, 0.12)',
  },
  typography: {
    fontFamily: {
      heading: '"Inter", "Helvetica Neue", Arial, sans-serif',
      body: '"Inter", "Helvetica Neue", Arial, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
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
    borderRadius: 8,
    shadowStyle: 'md',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'solid',
  },
};
