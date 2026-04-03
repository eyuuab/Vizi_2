'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIsSaving, setLastSavedAt } from '@/store/slices/editor-slice';
import { markClean, setThemeIdPersisted } from '@/store/slices/presentation-slice';
import { markThemeSaved } from '@/store/slices/theme-slice';
import { addToast } from '@/store/slices/ui-slice';

const AUTO_SAVE_INTERVAL_MS = 30_000;

/**
 * Hook that auto-saves presentation state to the server.
 * - Saves every 30s if there are unsaved changes.
 * - Exposes a `saveNow` function for manual Ctrl+S saves.
 */
export function useAutoSave(): { saveNow: () => Promise<void> } {
  const dispatch = useAppDispatch();
  const presentation = useAppSelector((state) => state.presentation);
  const activeThemeTokens = useAppSelector((state) => state.theme.activeTokens);
  const isDirty = useAppSelector((state) => state.presentation.isDirty);
  const isThemeCustomized = useAppSelector((state) => state.theme.isCustomized);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightSaveRef = useRef<Promise<void> | null>(null);

  const performSave = useCallback((): Promise<void> => {
    if (!presentation.id) return Promise.resolve();
    if (!presentation.isDirty && !isThemeCustomized) return Promise.resolve();
    if (inFlightSaveRef.current) return inFlightSaveRef.current;

    dispatch(setIsSaving(true));

    const savePromise = (async () => {
      try {
        const payload = {
          title: presentation.title,
          description: presentation.description,
          themeId: presentation.themeId,
          themeTokens: isThemeCustomized ? activeThemeTokens : undefined,
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
          keepalive: true,
        });

        if (!response.ok) {
          throw new Error(`Save failed with status ${String(response.status)}`);
        }

        const result = (await response.json()) as {
          success: boolean;
          data?: { savedAt: string; themeId?: string };
        };
        if (result.success && result.data) {
          if (result.data.themeId && result.data.themeId !== presentation.themeId) {
            dispatch(setThemeIdPersisted(result.data.themeId));
          }
          dispatch(setLastSavedAt(result.data.savedAt));
          dispatch(markThemeSaved());
          dispatch(markClean());
        }
      } catch (error) {
        dispatch(setIsSaving(false));
        dispatch(
          addToast({
            id: `save-error-${Date.now()}`,
            type: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Failed to save presentation.',
            duration: 5000,
          }),
        );
      }
    })();

    inFlightSaveRef.current = savePromise.finally(() => {
      inFlightSaveRef.current = null;
    });

    return inFlightSaveRef.current;
  }, [
    presentation,
    activeThemeTokens,
    isThemeCustomized,
    dispatch,
  ]);

  // Auto-save timer
  useEffect(() => {
    if ((!isDirty && !isThemeCustomized) || !presentation.id) return;

    timerRef.current = setTimeout(() => {
      void performSave();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isDirty, isThemeCustomized, presentation.id, performSave]);

  const saveNow = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    await performSave();
  }, [performSave]);

  return { saveNow };
}
