import type { ThemeTokens } from '@/types/theme';

export const minimalLight: ThemeTokens = {
  colors: {
    primary: '#18181B',
    secondary: '#3F3F46',
    accent: '#DC2626',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    textPrimary: '#18181B',
    textSecondary: '#71717A',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    border: '#E4E4E7',
    shadow: 'rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontFamily: {
      heading: '"DM Sans", "Inter", sans-serif',
      body: '"DM Sans", "Inter", sans-serif',
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
    borderRadius: 4,
    shadowStyle: 'sm',
    imageStyle: 'square',
  },
  effects: {
    backgroundType: 'solid',
  },
};
