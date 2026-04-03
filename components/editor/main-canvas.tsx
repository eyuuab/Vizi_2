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
          <div className="flex flex-col gap-8">
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
        'relative rounded-lg transition-all cursor-pointer bg-[var(--sf-color-background,#fff)] shadow-md overflow-hidden',
        isSelected
          ? 'ring-2 ring-primary ring-offset-2'
          : 'hover:ring-1 hover:ring-border hover:ring-offset-1',
        section.isHidden && 'opacity-50',
      )}
      style={{ aspectRatio: '16 / 9' }}
      onClick={handleSectionClick}
    >
      {/* Always render the real layout */}
      <SectionRenderer section={resolved} />

      {/* Editable overlay when selected + editing */}
      {isSelected && isEditing && layout && (
        <EditableSlotOverlay
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
// Editable Slot Overlay
// ============================================================
// Shows an absolute overlay on top of the rendered layout
// that makes text slots clickable and editable inline.

interface EditableSlotOverlayProps {
  section: SectionState;
  layout: LayoutTemplate;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  onUpdateSlot: (slotId: string, content: string) => void;
}

function EditableSlotOverlay({
  section,
  layout,
  selectedSlotId,
  onSelectSlot,
  onUpdateSlot,
}: EditableSlotOverlayProps): React.JSX.Element {
  const textSlotTypes = new Set(['TEXT', 'RICHTEXT', 'HEADING']);
  const interactiveSlots = layout.slots.filter(
    (s) => textSlotTypes.has(s.type) || s.type === 'IMAGE',
  );

  const selectedSlot = interactiveSlots.find((s) => s.id === selectedSlotId);
  const selectedSlotIsText = Boolean(selectedSlot && textSlotTypes.has(selectedSlot.type));
  const selectedContent =
    selectedSlot && typeof section.content[selectedSlot.id] === 'string'
      ? (section.content[selectedSlot.id] as string)
      : '';

  return (
    <>
      {/* Transparent clickable overlay for text/image slots */}
      <div className="absolute inset-0 z-10">
        {interactiveSlots.map((slot) => {
          const pos = slot.position;
          const isSelected = selectedSlotId === slot.id;
          const isTextSlot = textSlotTypes.has(slot.type);
          return (
            <div
              key={slot.id}
              className={cn(
                'absolute rounded transition-all',
                isTextSlot ? 'cursor-text' : 'cursor-pointer',
                isSelected
                  ? 'ring-2 ring-primary/60 bg-primary/5'
                  : 'hover:ring-1 hover:ring-primary/30 hover:bg-primary/5',
              )}
              style={{
                left: `${String(pos.x)}%`,
                top: `${String(pos.y)}%`,
                width: `${String(pos.width)}%`,
                height: `${String(pos.height)}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSlot(slot.id);
              }}
            />
          );
        })}
      </div>

      {/* Inline editor panel for the selected text slot */}
      {selectedSlot && selectedSlotIsText && (
        <div
          className="relative z-20 mx-4 -mt-2 mb-2 rounded-lg border border-primary/20 bg-card p-4 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{selectedSlot.label}</span>
            <span className="rounded bg-muted px-1.5 py-0.5">{selectedSlot.type}</span>
          </div>
          <TiptapEditor
            content={selectedContent}
            placeholder={selectedSlot.label}
            maxLength={selectedSlot.constraints?.maxLength}
            isHeading={selectedSlot.type === 'HEADING'}
            onUpdate={(html) => onUpdateSlot(selectedSlot.id, html)}
            onFocus={() => onSelectSlot(selectedSlot.id)}
          />
        </div>
      )}
    </>
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
