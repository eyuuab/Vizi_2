import type { Middleware, PayloadAction } from '@reduxjs/toolkit';

const MAX_UNDO_STACK_SIZE = 50;
const DEBOUNCE_MS = 500;

/** Actions that should be tracked for undo/redo */
const UNDOABLE_ACTIONS = new Set([
  'presentation/updateSectionContent',
  'presentation/updateSectionSlotContent',
  'presentation/updateSectionLayout',
  'presentation/updateSectionStyleOverrides',
  'presentation/addSection',
  'presentation/removeSection',
  'presentation/reorderSections',
  'presentation/duplicateSection',
  'presentation/setTitle',
  'presentation/setDescription',
  'theme/updateColorToken',
  'theme/updateTypographyToken',
  'theme/updateSpacingToken',
  'theme/updateLayoutToken',
  'theme/setFullTokens',
]);

interface UndoEntry {
  actionType: string;
  timestamp: number;
  presentationState: unknown;
  themeState: unknown;
}

interface UndoRedoState {
  undoStack: UndoEntry[];
  redoStack: UndoEntry[];
  lastEntryTimestamp: number;
}

const undoRedoState: UndoRedoState = {
  undoStack: [],
  redoStack: [],
  lastEntryTimestamp: 0,
};

export function getUndoStack(): ReadonlyArray<UndoEntry> {
  return undoRedoState.undoStack;
}

export function getRedoStack(): ReadonlyArray<UndoEntry> {
  return undoRedoState.redoStack;
}

export function canUndo(): boolean {
  return undoRedoState.undoStack.length > 0;
}

export function canRedo(): boolean {
  return undoRedoState.redoStack.length > 0;
}

export const undoRedoMiddleware: Middleware = (store) => (next) => (action) => {
  const typedAction = action as PayloadAction<unknown> & { type: string };

  // Handle undo action
  if (typedAction.type === 'UNDO') {
    const entry = undoRedoState.undoStack.pop();
    if (entry) {
      // Save current state to redo stack
      const currentState = store.getState() as {
        presentation: unknown;
        theme: unknown;
      };
      undoRedoState.redoStack.push({
        actionType: 'redo',
        timestamp: Date.now(),
        presentationState: currentState.presentation,
        themeState: currentState.theme,
      });

      // Restore previous state
      store.dispatch({
        type: 'presentation/loadPresentation',
        payload: entry.presentationState,
      });
      store.dispatch({
        type: 'theme/loadTheme',
        payload: entry.themeState,
      });
    }
    return;
  }

  // Handle redo action
  if (typedAction.type === 'REDO') {
    const entry = undoRedoState.redoStack.pop();
    if (entry) {
      // Save current state to undo stack
      const currentState = store.getState() as {
        presentation: unknown;
        theme: unknown;
      };
      undoRedoState.undoStack.push({
        actionType: 'undo',
        timestamp: Date.now(),
        presentationState: currentState.presentation,
        themeState: currentState.theme,
      });

      // Restore redo state
      store.dispatch({
        type: 'presentation/loadPresentation',
        payload: entry.presentationState,
      });
      store.dispatch({
        type: 'theme/loadTheme',
        payload: entry.themeState,
      });
    }
    return;
  }

  // Track undoable actions
  if (UNDOABLE_ACTIONS.has(typedAction.type)) {
    const now = Date.now();
    const shouldDebounce = now - undoRedoState.lastEntryTimestamp < DEBOUNCE_MS;

    if (!shouldDebounce) {
      const currentState = store.getState() as {
        presentation: unknown;
        theme: unknown;
      };

      undoRedoState.undoStack.push({
        actionType: typedAction.type,
        timestamp: now,
        presentationState: structuredClone(currentState.presentation),
        themeState: structuredClone(currentState.theme),
      });

      // Trim stack to max size
      while (undoRedoState.undoStack.length > MAX_UNDO_STACK_SIZE) {
        undoRedoState.undoStack.shift();
      }

      // Clear redo stack on new action
      undoRedoState.redoStack = [];
    }

    undoRedoState.lastEntryTimestamp = now;
  }

  return next(action);
};

/** Dispatch these action types to trigger undo/redo */
export const undo = () => ({ type: 'UNDO' as const });
export const redo = () => ({ type: 'REDO' as const });
