import type { ThemeTokens } from '@/types/theme';

export const earthyTones: ThemeTokens = {
  colors: {
    primary: '#92400E',
    secondary: '#B45309',
    accent: '#15803D',
    background: '#FFFBEB',
    surface: '#FEF3C7',
    textPrimary: '#422006',
    textSecondary: '#78350F',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#FDE68A',
    shadow: 'rgba(146, 64, 14, 0.1)',
  },
  typography: {
    fontFamily: {
      heading: '"Libre Baskerville", Georgia, serif',
      body: '"Nunito Sans", "Inter", sans-serif',
      mono: '"IBM Plex Mono", monospace',
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
    lineHeight: '1.7',
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
    borderRadius: 8,
    shadowStyle: 'sm',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'solid',
  },
};
