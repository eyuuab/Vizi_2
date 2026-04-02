import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type EditorMode = 'edit' | 'preview' | 'present';
export type RightPanelView = 'theme' | 'layout' | 'section-settings' | 'text-formatting';

export interface ClipboardEntry {
  type: 'section';
  sectionId: string;
  layoutId: string;
  content: Record<string, unknown>;
}

export interface EditorState {
  mode: EditorMode;
  selectedSectionId: string | null;
  selectedSlotId: string | null;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  rightPanelView: RightPanelView;
  zoom: number;
  isEditing: boolean;
  isDragging: boolean;
  isGenerating: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  clipboard: ClipboardEntry | null;
}

const initialState: EditorState = {
  mode: 'edit',
  selectedSectionId: null,
  selectedSlotId: null,
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  rightPanelView: 'theme',
  zoom: 100,
  isEditing: false,
  isDragging: false,
  isGenerating: false,
  isSaving: false,
  lastSavedAt: null,
  clipboard: null,
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
      if (action.payload) {
        state.rightPanelView = 'layout';
      } else {
        state.rightPanelView = 'theme';
      }
    },
    selectSlot(state, action: PayloadAction<string | null>) {
      state.selectedSlotId = action.payload;
      if (action.payload) {
        state.rightPanelView = 'text-formatting';
      } else if (state.selectedSectionId) {
        state.rightPanelView = 'layout';
      }
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
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    setDragging(state, action: PayloadAction<boolean>) {
      state.isDragging = action.payload;
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
    setClipboard(state, action: PayloadAction<ClipboardEntry | null>) {
      state.clipboard = action.payload;
    },
    deselectAll(state) {
      state.selectedSectionId = null;
      state.selectedSlotId = null;
      state.isEditing = false;
      state.rightPanelView = 'theme';
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
  setEditing,
  setDragging,
  setIsGenerating,
  setIsSaving,
  setLastSavedAt,
  setClipboard,
  deselectAll,
} = editorSlice.actions;

export default editorSlice.reducer;
