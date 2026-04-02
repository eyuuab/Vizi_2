import type { ThemeTokens } from '@/types/theme';

export const monochrome: ThemeTokens = {
  colors: {
    primary: '#000000',
    secondary: '#404040',
    accent: '#737373',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    textPrimary: '#171717',
    textSecondary: '#525252',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#D4D4D4',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: {
      heading: '"Instrument Serif", Georgia, serif',
      body: '"Inter", "Helvetica Neue", sans-serif',
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
      '4xl': '2.5rem',
    },
    fontWeight: 'regular',
    lineHeight: '1.7',
    letterSpacing: '0em',
  },
  spacing: {
    sectionPadding: { top: 64, right: 64, bottom: 64, left: 64 },
    slotGap: 32,
    innerPadding: 24,
    sectionGap: 48,
  },
  layout: {
    maxWidth: 960,
    borderRadius: 0,
    shadowStyle: 'none',
    imageStyle: 'square',
  },
  effects: {
    backgroundType: 'solid',
  },
};
