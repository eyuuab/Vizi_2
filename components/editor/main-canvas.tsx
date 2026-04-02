'use client';

import { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSection, selectSlot, setEditing, deselectAll } from '@/store/slices/editor-slice';
import { updateSectionSlotContent } from '@/store/slices/presentation-slice';
import { getLayout } from '@/lib/layouts';
import { SectionRenderer } from '@/components/sections/section-renderer';
import { TiptapEditor } from './tiptap-editor';
import type { ResolvedSection, ResolvedSlot } from '@/types/presentation';
import type { SectionState } from '@/store/slices/presentation-slice';
import type { LayoutTemplate } from '@/types/layout';

export function MainCanvas(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((state) => state.presentation.sections);
  const selectedSectionId = useAppSelector((state) => state.editor.selectedSectionId);
  const selectedSlotId = useAppSelector((state) => state.editor.selectedSlotId);
  const isEditing = useAppSelector((state) => state.editor.isEditing);
  const zoom = useAppSelector((state) => state.editor.zoom);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if clicking the canvas background itself
      if (e.target === e.currentTarget) {
        dispatch(deselectAll());
      }
    },
    [dispatch],
  );

  const resolvedSections = useMemo(() => {
    return sections.map((s) => resolveSection(s));
  }, [sections]);

  return (
    <main
      className="flex-1 overflow-y-auto bg-muted/30 p-8"
      onClick={handleCanvasClick}
    >
      <div
        className="mx-auto transition-transform origin-top"
        style={{
          maxWidth: '960px',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
      >
        {sections.length === 0 ? (
          <EmptyCanvasPlaceholder />
        ) : (
          <div className="flex flex-col gap-[var(--sf-section-gap,32px)]">
            {resolvedSections.map((resolved, index) => {
              const section = sections[index];
              if (!section) return null;

              return (
                <CanvasSection
                  key={section.id}
                  section={section}
                  resolved={resolved}
                  isSelected={selectedSectionId === section.id}
                  selectedSlotId={selectedSlotId}
                  isEditing={isEditing}
                  onSelect={() => dispatch(selectSection(section.id))}
                  onSelectSlot={(slotId) => {
                    dispatch(selectSlot(slotId));
                    dispatch(setEditing(true));
                  }}
                  onUpdateSlot={(slotId, content) => {
                    dispatch(
                      updateSectionSlotContent({
                        sectionId: section.id,
                        slotId,
                        content,
                      }),
                    );
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// Canvas Section Wrapper
// ============================================================

interface CanvasSectionProps {
  section: SectionState;
  resolved: ResolvedSection;
  isSelected: boolean;
  selectedSlotId: string | null;
  isEditing: boolean;
  onSelect: () => void;
  onSelectSlot: (slotId: string) => void;
  onUpdateSlot: (slotId: string, content: string) => void;
}

function CanvasSection({
  section,
  resolved,
  isSelected,
  selectedSlotId,
  isEditing,
  onSelect,
  onSelectSlot,
  onUpdateSlot,
}: CanvasSectionProps): React.JSX.Element {
  let layout: LayoutTemplate | null = null;
  try {
    layout = getLayout(section.layoutId);
  } catch {
    // Unknown layout
  }

  const handleSectionClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect],
  );

  return (
    <div
      className={cn(
        'relative rounded-lg transition-all cursor-pointer',
        isSelected
          ? 'ring-2 ring-primary ring-offset-2'
          : 'hover:ring-1 hover:ring-border hover:ring-offset-1',
        section.isHidden && 'opacity-50',
      )}
      onClick={handleSectionClick}
    >
      {/* Section renderer for display */}
      {!isSelected || !isEditing ? (
        <SectionRenderer section={resolved} />
      ) : (
        <EditableSectionView
          section={section}
          layout={layout}
          selectedSlotId={selectedSlotId}
          onSelectSlot={onSelectSlot}
          onUpdateSlot={onUpdateSlot}
        />
      )}

      {/* Section action overlay on hover */}
      {isSelected && (
        <div className="absolute -top-3 right-2 flex items-center gap-1 rounded-md border bg-card px-1.5 py-0.5 shadow-sm text-xs text-muted-foreground">
          {layout?.name ?? section.layoutId}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Editable Section View
// ============================================================

interface EditableSectionViewProps {
  section: SectionState;
  layout: LayoutTemplate | null;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  onUpdateSlot: (slotId: string, content: string) => void;
}

function EditableSectionView({
  section,
  layout,
  selectedSlotId,
  onSelectSlot,
  onUpdateSlot,
}: EditableSectionViewProps): React.JSX.Element {
  if (!layout) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Unknown layout: {section.layoutId}
      </div>
    );
  }

  // Render a simplified editable version using TiptapEditor for text-based slots
  const textSlotTypes = new Set(['TEXT', 'RICHTEXT', 'HEADING']);

  return (
    <div
      className="relative w-full py-[var(--sf-section-padding-top,48px)] px-[var(--sf-section-padding-left,48px)]"
      style={section.styleOverrides?.backgroundColor ? { backgroundColor: section.styleOverrides.backgroundColor } : undefined}
    >
      <div className="mx-auto w-full max-w-[var(--sf-max-width,960px)]">
        <div className="flex flex-col gap-[var(--sf-slot-gap,16px)]">
          {layout.slots.map((slot) => {
            const content = section.content[slot.id];
            const isText = textSlotTypes.has(slot.type);
            const isSelectedSlot = selectedSlotId === slot.id;

            if (isText) {
              const textContent = typeof content === 'string' ? content : '';
              return (
                <div
                  key={slot.id}
                  className={cn(
                    'rounded-md transition-all p-1 -m-1',
                    isSelectedSlot
                      ? 'ring-2 ring-primary/50 bg-primary/5'
                      : 'hover:ring-1 hover:ring-border',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSlot(slot.id);
                  }}
                >
                  <TiptapEditor
                    content={textContent}
                    placeholder={slot.label}
                    maxLength={slot.constraints?.maxLength}
                    isHeading={slot.type === 'HEADING'}
                    onUpdate={(html) => onUpdateSlot(slot.id, html)}
                    onFocus={() => onSelectSlot(slot.id)}
                  />
                </div>
              );
            }

            // Non-text slots: show as-is
            return (
              <div
                key={slot.id}
                className="rounded-md border border-dashed border-muted-foreground/20 p-4 text-center text-xs text-muted-foreground"
              >
                {slot.label} ({slot.type})
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Empty State
// ============================================================

function EmptyCanvasPlaceholder(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
        <h3 className="text-lg font-semibold">No sections yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Add a section from the left sidebar to get started, or use the AI
          assistant to generate your presentation content.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Section Resolver
// ============================================================

function resolveSection(section: SectionState): ResolvedSection {
  let layout: LayoutTemplate;
  try {
    layout = getLayout(section.layoutId);
  } catch {
    // Return a minimal resolved section for unknown layouts
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
    content: section.content[slot.id] ?? null,
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
    computedHeight: layout.minHeight,
    yOffset: 0,
  };
}
