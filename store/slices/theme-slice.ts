import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeTokens } from '@/types/theme';

export interface ThemeState {
  activeTokens: ThemeTokens | null;
  presetId: string | null;
  isCustomized: boolean;
}

const initialState: ThemeState = {
  activeTokens: null,
  presetId: null,
  isCustomized: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    loadTheme(state, action: PayloadAction<{ tokens: ThemeTokens; presetId: string | null }>) {
      state.activeTokens = action.payload.tokens;
      state.presetId = action.payload.presetId;
      state.isCustomized = false;
    },
    updateColorToken(state, action: PayloadAction<{ key: string; value: string }>) {
      if (state.activeTokens) {
        const key = action.payload.key as keyof typeof state.activeTokens.colors;
        if (key in state.activeTokens.colors) {
          state.activeTokens.colors[key] = action.payload.value;
          state.isCustomized = true;
        }
      }
    },
    updateTypographyToken(state, action: PayloadAction<{ path: string; value: string }>) {
      if (state.activeTokens) {
        const parts = action.payload.path.split('.');
        // Handle nested paths like "fontFamily.heading"
        if (parts.length === 2) {
          const category = parts[0] as keyof typeof state.activeTokens.typography;
          const sub = parts[1];
          const categoryObj = state.activeTokens.typography[category];
          if (typeof categoryObj === 'object' && categoryObj !== null && sub) {
            (categoryObj as Record<string, string>)[sub] = action.payload.value;
            state.isCustomized = true;
          }
        }
      }
    },
    updateSpacingToken(
      state,
      action: PayloadAction<{ key: keyof ThemeTokens['spacing']; value: number }>,
    ) {
      if (state.activeTokens) {
        const key = action.payload.key;
        const current = state.activeTokens.spacing[key];
        if (typeof current === 'number') {
          (state.activeTokens.spacing[key] as number) = action.payload.value;
          state.isCustomized = true;
        }
      }
    },
    updateLayoutToken(
      state,
      action: PayloadAction<{ key: keyof ThemeTokens['layout']; value: unknown }>,
    ) {
      if (state.activeTokens) {
        const { key, value } = action.payload;
        // Type-safe assignment via specific key checks
        if (key === 'maxWidth' && typeof value === 'number') {
          state.activeTokens.layout.maxWidth = value;
          state.isCustomized = true;
        } else if (key === 'borderRadius' && typeof value === 'number') {
          state.activeTokens.layout.borderRadius = value;
          state.isCustomized = true;
        } else if (key === 'shadowStyle' && typeof value === 'string') {
          state.activeTokens.layout.shadowStyle = value as ThemeTokens['layout']['shadowStyle'];
          state.isCustomized = true;
        } else if (key === 'imageStyle' && typeof value === 'string') {
          state.activeTokens.layout.imageStyle = value as ThemeTokens['layout']['imageStyle'];
          state.isCustomized = true;
        }
      }
    },
    setFullTokens(state, action: PayloadAction<ThemeTokens>) {
      state.activeTokens = action.payload;
      state.isCustomized = true;
    },
    markThemeSaved(state) {
      state.isCustomized = false;
    },
    resetTheme(state) {
      state.activeTokens = null;
      state.presetId = null;
      state.isCustomized = false;
    },
  },
});

export const {
  loadTheme,
  updateColorToken,
  updateTypographyToken,
  updateSpacingToken,
  updateLayoutToken,
  setFullTokens,
  markThemeSaved,
  resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
