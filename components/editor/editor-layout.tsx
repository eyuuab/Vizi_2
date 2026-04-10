'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadPresentation } from '@/store/slices/presentation-slice';
import { setMode } from '@/store/slices/editor-slice';
import { loadTheme } from '@/store/slices/theme-slice';
import { useAutoSave } from './hooks/use-auto-save';
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts';
import { TopBar } from './top-bar';
import { LeftSidebar } from './left-sidebar';
import { MainCanvas } from './main-canvas';
import { RightSidebar } from './right-sidebar';
import { BottomBar } from './bottom-bar';
import { generateThemeCSS, getThemePreset, resolveThemeTokens } from '@/lib/themes';
import { getLayout } from '@/lib/layouts';
import { SlideshowViewer } from '@/components/presentation/slideshow-viewer';
import type {
  SectionContent,
  StyleOverrides,
  TransitionConfig,
  ResolvedSection,
  ResolvedSlot,
} from '@/types/presentation';
import type { LayoutTemplate } from '@/types/layout';
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
  const mode = useAppSelector((state) => state.editor.mode);
  const leftSidebarOpen = useAppSelector((state) => state.editor.leftSidebarOpen);
  const rightSidebarOpen = useAppSelector((state) => state.editor.rightSidebarOpen);
  const sections = useAppSelector((state) => state.presentation.sections);
  const title = useAppSelector((state) => state.presentation.title);
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

  const themeVars = useMemo(() => {
    if (!activeTokens) return undefined;
    return resolveThemeTokens(activeTokens);
  }, [activeTokens]);

  const presentSlides = useMemo(
    () =>
      sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) => resolveSectionForPreview(section))
        .filter((section) => !section.isHidden),
    [sections],
  );

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

      {mode === 'present' && (
        <div className="fixed inset-0 z-[100]">
          <SlideshowViewer
            slides={presentSlides}
            title={title}
            themeVars={themeVars}
            autoEnterFullscreen
            showExitButton
            onExit={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {
                  // noop
                });
              }
              dispatch(setMode('edit'));
            }}
          />
        </div>
      )}
    </>
  );
}

function resolveSectionForPreview(section: SectionState): ResolvedSection {
  let layout: LayoutTemplate;
  try {
    layout = getLayout(section.layoutId);
  } catch {
    return {
      id: section.id,
      layoutId: section.layoutId,
      layout: {
        id: section.layoutId,
        name: 'Unknown',
        category: 'BLANK',
        description: '',
        thumbnail: '',
        slots: [],
        defaultContent: {},
        minHeight: 200,
        maxHeight: 'auto',
        supportedMediaTypes: [],
        pptxMapping: {},
      },
      order: section.order,
      content: section.content,
      styleOverrides: section.styleOverrides,
      transitions: section.transitions,
      notes: section.notes,
      isHidden: section.isHidden,
      resolvedSlots: [],
      computedHeight: 200,
      yOffset: 0,
    };
  }

  const resolvedSlots: ResolvedSlot[] = layout.slots.map((slot) => ({
    definition: {
      id: slot.id,
      type: slot.type,
      label: slot.label,
      required: slot.required,
      position: slot.position,
      aiHint: slot.aiHint,
    },
    content:
      section.content[slot.id] !== undefined
        ? section.content[slot.id]
        : layout.defaultContent[slot.id] ?? '',
    computedPosition: slot.position,
  }));

  return {
    id: section.id,
    layoutId: section.layoutId,
    layout,
    order: section.order,
    content: section.content,
    styleOverrides: section.styleOverrides,
    transitions: section.transitions,
    notes: section.notes,
    isHidden: section.isHidden,
    resolvedSlots,
    computedHeight:
      typeof layout.minHeight === 'number' ? layout.minHeight : 400,
    yOffset: 0,
  };
}
