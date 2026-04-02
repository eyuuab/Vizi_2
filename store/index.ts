import { configureStore } from '@reduxjs/toolkit';
import editorReducer from '@/store/slices/editor-slice';
import presentationReducer from '@/store/slices/presentation-slice';
import themeReducer from '@/store/slices/theme-slice';
import uiReducer from '@/store/slices/ui-slice';
import { undoRedoMiddleware } from '@/store/undo-middleware';

export const makeStore = () =>
  configureStore({
    reducer: {
      editor: editorReducer,
      presentation: presentationReducer,
      theme: themeReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore undo/redo internal state
          ignoredActions: ['UNDO', 'REDO'],
        },
      }).concat(undoRedoMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
