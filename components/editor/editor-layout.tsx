'use client';

import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadPresentation } from '@/store/slices/presentation-slice';
import { loadTheme } from '@/store/slices/theme-slice';
import { useAutoSave } from './hooks/use-auto-save';
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts';
import { TopBar } from './top-bar';
import { LeftSidebar } from './left-sidebar';
import { MainCanvas } from './main-canvas';
import { RightSidebar } from './right-sidebar';
import { BottomBar } from './bottom-bar';
import { generateThemeCSS, getThemePreset } from '@/lib/themes';
import type { SectionContent, StyleOverrides, TransitionConfig } from '@/types/presentation';
import type { SectionState } from '@/store/slices/presentation-slice';

interface PresentationData {
  id: string;
  title: string;
  description: string | null;
  themeId: string;
  isPublic: boolean;
  shareSlug: string | null;
  sections: Array<{
    id: string;
    layoutId: string;
    order: number;
    content: unknown;
    styleOverrides: unknown;
    transitions: unknown;
    notes: string | null;
    isHidden: boolean;
  }>;
  theme: {
    id: string;
    tokens: unknown;
  };
}

interface EditorLayoutProps {
  presentation: PresentationData;
}

/**
 * Main editor layout component.
 * Initializes Redux store with presentation data and renders the full editor UI.
 */
export function EditorLayout({ presentation }: EditorLayoutProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const leftSidebarOpen = useAppSelector((state) => state.editor.leftSidebarOpen);
  const rightSidebarOpen = useAppSelector((state) => state.editor.rightSidebarOpen);
  const activeTokens = useAppSelector((state) => state.theme.activeTokens);

  // Initialize store with presentation data
  useEffect(() => {
    const sections: SectionState[] = presentation.sections.map((s) => ({
      id: s.id,
      layoutId: s.layoutId,
      order: s.order,
      content: (s.content ?? {}) as SectionContent,
      styleOverrides: (s.styleOverrides ?? undefined) as StyleOverrides,
      transitions: (s.transitions ?? undefined) as TransitionConfig,
      notes: s.notes,
      isHidden: s.isHidden,
    }));

    dispatch(
      loadPresentation({
        id: presentation.id,
        title: presentation.title,
        description: presentation.description,
        themeId: presentation.themeId,
        isPublic: presentation.isPublic,
        shareSlug: presentation.shareSlug,
        sections,
      }),
    );

    // Load theme tokens
    let tokens = presentation.theme.tokens;
    if (!tokens || typeof tokens !== 'object') {
      // Fallback to preset
      try {
        tokens = getThemePreset(presentation.themeId);
      } catch {
        tokens = getThemePreset('corporate-blue');
      }
    }

    dispatch(
      loadTheme({
        tokens: tokens as ReturnType<typeof getThemePreset>,
        presetId: presentation.themeId,
      }),
    );
  }, [presentation, dispatch]);

  // Generate theme CSS
  const themeCSS = useMemo(() => {
    if (!activeTokens) return '';
    return generateThemeCSS(activeTokens, '.sf-editor');
  }, [activeTokens]);

  // Auto-save + keyboard shortcuts
  const { saveNow } = useAutoSave();
  useKeyboardShortcuts({ onSave: saveNow });

  return (
    <>
      {/* Inject theme CSS variables */}
      {themeCSS && <style dangerouslySetInnerHTML={{ __html: themeCSS }} />}

      <div className="sf-editor flex h-screen flex-col">
        <TopBar onSave={saveNow} />

        <div className="flex flex-1 overflow-hidden">
          {leftSidebarOpen && <LeftSidebar />}
          <MainCanvas />
          {rightSidebarOpen && <RightSidebar />}
        </div>

        <BottomBar />
      </div>
    </>
  );
}
