'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIsSaving, setLastSavedAt } from '@/store/slices/editor-slice';
import { markClean } from '@/store/slices/presentation-slice';
import { addToast } from '@/store/slices/ui-slice';

const AUTO_SAVE_INTERVAL_MS = 30_000;

/**
 * Hook that auto-saves presentation state to the server.
 * - Saves every 30s if there are unsaved changes.
 * - Exposes a `saveNow` function for manual Ctrl+S saves.
 */
export function useAutoSave(): { saveNow: () => void } {
  const dispatch = useAppDispatch();
  const presentation = useAppSelector((state) => state.presentation);
  const isDirty = useAppSelector((state) => state.presentation.isDirty);
  const isSaving = useAppSelector((state) => state.editor.isSaving);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

  const performSave = useCallback(async () => {
    if (!presentation.id || isSavingRef.current) return;
    if (!presentation.isDirty) return;

    isSavingRef.current = true;
    dispatch(setIsSaving(true));

    try {
      const payload = {
        title: presentation.title,
        description: presentation.description,
        themeId: presentation.themeId,
        sections: presentation.sections.map((s) => ({
          id: s.id,
          layoutId: s.layoutId,
          order: s.order,
          content: s.content,
          styleOverrides: s.styleOverrides ?? null,
          transitions: s.transitions ?? null,
          notes: s.notes,
          isHidden: s.isHidden,
        })),
      };

      const response = await fetch(`/api/presentations/${presentation.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Save failed with status ${String(response.status)}`);
      }

      const result = (await response.json()) as { success: boolean; data?: { savedAt: string } };
      if (result.success && result.data) {
        dispatch(setLastSavedAt(result.data.savedAt));
        dispatch(markClean());
      }
    } catch (error) {
      dispatch(setIsSaving(false));
      dispatch(
        addToast({
          id: `save-error-${Date.now()}`,
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to save presentation.',
          duration: 5000,
        }),
      );
    } finally {
      isSavingRef.current = false;
    }
  }, [presentation, dispatch]);

  // Auto-save timer
  useEffect(() => {
    if (!isDirty || !presentation.id) return;

    timerRef.current = setTimeout(() => {
      void performSave();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isDirty, presentation.id, performSave]);

  const saveNow = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    void performSave();
  }, [performSave]);

  return { saveNow };
}
