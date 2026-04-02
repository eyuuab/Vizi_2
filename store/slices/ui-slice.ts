import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  type: string;
  props: Record<string, unknown>;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration: number;
}

export interface UiState {
  activeModal: ModalState | null;
  toasts: ToastMessage[];
  commandPaletteOpen: boolean;
  exportDialogOpen: boolean;
  shareDialogOpen: boolean;
  aiGenerating: boolean;
  aiProgress: number;
}

const initialState: UiState = {
  activeModal: null,
  toasts: [],
  commandPaletteOpen: false,
  exportDialogOpen: false,
  shareDialogOpen: false,
  aiGenerating: false,
  aiProgress: 0,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<ModalState>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    addToast(state, action: PayloadAction<ToastMessage>) {
      state.toasts.push(action.payload);
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setCommandPaletteOpen(state, action: PayloadAction<boolean>) {
      state.commandPaletteOpen = action.payload;
    },
    setExportDialogOpen(state, action: PayloadAction<boolean>) {
      state.exportDialogOpen = action.payload;
    },
    setShareDialogOpen(state, action: PayloadAction<boolean>) {
      state.shareDialogOpen = action.payload;
    },
    setAiGenerating(state, action: PayloadAction<boolean>) {
      state.aiGenerating = action.payload;
      if (!action.payload) {
        state.aiProgress = 0;
      }
    },
    setAiProgress(state, action: PayloadAction<number>) {
      state.aiProgress = Math.max(0, Math.min(100, action.payload));
    },
  },
});

export const {
  openModal,
  closeModal,
  addToast,
  removeToast,
  setCommandPaletteOpen,
  setExportDialogOpen,
  setShareDialogOpen,
  setAiGenerating,
  setAiProgress,
} = uiSlice.actions;

export default uiSlice.reducer;
