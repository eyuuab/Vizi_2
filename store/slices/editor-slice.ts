import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type EditorMode = 'edit' | 'preview' | 'present';
export type RightPanelView = 'theme' | 'layout' | 'section-settings';

export interface EditorState {
  mode: EditorMode;
  selectedSectionId: string | null;
  selectedSlotId: string | null;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  rightPanelView: RightPanelView;
  zoom: number;
  isGenerating: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
}

const initialState: EditorState = {
  mode: 'edit',
  selectedSectionId: null,
  selectedSlotId: null,
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  rightPanelView: 'theme',
  zoom: 100,
  isGenerating: false,
  isSaving: false,
  lastSavedAt: null,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<EditorMode>) {
      state.mode = action.payload;
    },
    selectSection(state, action: PayloadAction<string | null>) {
      state.selectedSectionId = action.payload;
      state.selectedSlotId = null;
    },
    selectSlot(state, action: PayloadAction<string | null>) {
      state.selectedSlotId = action.payload;
    },
    toggleLeftSidebar(state) {
      state.leftSidebarOpen = !state.leftSidebarOpen;
    },
    toggleRightSidebar(state) {
      state.rightSidebarOpen = !state.rightSidebarOpen;
    },
    setRightPanelView(state, action: PayloadAction<RightPanelView>) {
      state.rightPanelView = action.payload;
      state.rightSidebarOpen = true;
    },
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = Math.max(25, Math.min(200, action.payload));
    },
    setIsGenerating(state, action: PayloadAction<boolean>) {
      state.isGenerating = action.payload;
    },
    setIsSaving(state, action: PayloadAction<boolean>) {
      state.isSaving = action.payload;
    },
    setLastSavedAt(state, action: PayloadAction<string>) {
      state.lastSavedAt = action.payload;
      state.isSaving = false;
    },
    deselectAll(state) {
      state.selectedSectionId = null;
      state.selectedSlotId = null;
    },
  },
});

export const {
  setMode,
  selectSection,
  selectSlot,
  toggleLeftSidebar,
  toggleRightSidebar,
  setRightPanelView,
  setZoom,
  setIsGenerating,
  setIsSaving,
  setLastSavedAt,
  deselectAll,
} = editorSlice.actions;

export default editorSlice.reducer;
