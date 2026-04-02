import type { ThemeTokens } from '@/types/theme';

export const forestGreen: ThemeTokens = {
  colors: {
    primary: '#15803D',
    secondary: '#22C55E',
    accent: '#A16207',
    background: '#F0FDF4',
    surface: '#DCFCE7',
    textPrimary: '#14532D',
    textSecondary: '#166534',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#BBF7D0',
    shadow: 'rgba(21, 128, 61, 0.12)',
  },
  typography: {
    fontFamily: {
      heading: '"Merriweather", Georgia, serif',
      body: '"Open Sans", "Inter", sans-serif',
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
    fontWeight: 'semibold',
    lineHeight: '1.7',
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
    borderRadius: 8,
    shadowStyle: 'sm',
    imageStyle: 'rounded',
  },
  effects: {
    backgroundType: 'solid',
  },
};
