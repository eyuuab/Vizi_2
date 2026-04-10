'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { undo, redo } from '@/store/undo-middleware';
import {
  selectSection,
  deselectAll,
  toggleLeftSidebar,
  toggleRightSidebar,
  setMode,
} from '@/store/slices/editor-slice';
import { duplicateSection, removeSection } from '@/store/slices/presentation-slice';
import {
  setCommandPaletteOpen,
  setExportDialogOpen,
} from '@/store/slices/ui-slice';

interface UseKeyboardShortcutsOptions {
  onSave: () => void;
}

/**
 * Registers all editor keyboard shortcuts (Section 10.4).
 */
export function useKeyboardShortcuts({ onSave }: UseKeyboardShortcutsOptions): void {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.editor.mode);
  const selectedSectionId = useAppSelector((state) => state.editor.selectedSectionId);
  const sections = useAppSelector((state) => state.presentation.sections);
  const isEditing = useAppSelector((state) => state.editor.isEditing);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.metaKey || event.ctrlKey;
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // In presentation mode, let the slideshow component fully own keyboard input.
      if (mode === 'present') {
        return;
      }

      // Always-active shortcuts (even during editing)
      if (isCtrlOrCmd && event.key === 's') {
        event.preventDefault();
        onSave();
        return;
      }

      if (isCtrlOrCmd && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        dispatch(undo());
        return;
      }

      if (isCtrlOrCmd && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        dispatch(redo());
        return;
      }

      if (isCtrlOrCmd && event.key === 'Z') {
        event.preventDefault();
        dispatch(redo());
        return;
      }

      // If actively editing text, skip navigation shortcuts
      if (isInputField && isEditing) return;

      if (isCtrlOrCmd && event.key === 'k') {
        event.preventDefault();
        dispatch(setCommandPaletteOpen(true));
        return;
      }

      if (isCtrlOrCmd && event.key === 'e') {
        event.preventDefault();
        dispatch(setExportDialogOpen(true));
        return;
      }

      if (isCtrlOrCmd && event.key === 'Enter') {
        event.preventDefault();
        dispatch(setMode('present'));
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {
            // Fall back to in-page presentation mode if browser blocks fullscreen.
          });
        }
        return;
      }

      if (isCtrlOrCmd && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        dispatch(toggleLeftSidebar());
        return;
      }

      if (isCtrlOrCmd && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        dispatch(toggleRightSidebar());
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        dispatch(deselectAll());
        return;
      }

      // Section-specific shortcuts
      if (selectedSectionId) {
        if (isCtrlOrCmd && event.key === 'd') {
          event.preventDefault();
          const newId = `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          dispatch(
            duplicateSection({
              sourceSectionId: selectedSectionId,
              newSectionId: newId,
            }),
          );
          return;
        }

        if (isCtrlOrCmd && event.key === 'Backspace') {
          event.preventDefault();
          dispatch(removeSection(selectedSectionId));
          dispatch(deselectAll());
          return;
        }
      }

      // Arrow key navigation between sections
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (sections.length === 0) return;
        event.preventDefault();

        if (!selectedSectionId) {
          const first = sections[0];
          if (first) {
            dispatch(selectSection(first.id));
          }
          return;
        }

        const currentIndex = sections.findIndex((s) => s.id === selectedSectionId);
        if (currentIndex === -1) return;

        const nextIndex =
          event.key === 'ArrowDown'
            ? Math.min(currentIndex + 1, sections.length - 1)
            : Math.max(currentIndex - 1, 0);

        const nextSection = sections[nextIndex];
        if (nextSection) {
          dispatch(selectSection(nextSection.id));
        }
      }
    },
    [dispatch, mode, selectedSectionId, sections, isEditing, onSave],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
