'use client';

import { useCallback, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSection, selectSlot, setEditing, deselectAll } from '@/store/slices/editor-slice';
import { updateSectionSlotContent } from '@/store/slices/presentation-slice';
import { getLayout } from '@/lib/layouts';
import { SectionRenderer } from '@/components/sections/section-renderer';
import { InlineListEditor, parseItems } from './inline-list-editor';
import { InlineStatsEditor, parseStats } from './inline-stats-editor';
import { ImageGenerationDialog } from './image-generation-dialog';
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
                  onSelect={() => {
                    dispatch(selectSection(section.id));
                    dispatch(setEditing(true));
                  }}
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
  onUpdateSlot: (slotId: string, content: string | Record<string, unknown> | unknown[]) => void;
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
        'relative rounded-lg transition-all cursor-pointer shadow-md',
        isSelected
          ? 'ring-2 ring-primary ring-offset-2'
          : 'hover:ring-1 hover:ring-border hover:ring-offset-1',
        section.isHidden && 'opacity-50',
      )}
      style={{
        aspectRatio: '16 / 9',
        background: 'var(--sf-slide-background, var(--sf-color-background, #fff))',
      }}
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
// for non-text slot interactions (image/list/stats tools).

interface EditableSlotOverlayProps {
  section: SectionState;
  layout: LayoutTemplate;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  onUpdateSlot: (slotId: string, content: string | Record<string, unknown> | unknown[]) => void;
}

const EDITABLE_SLOT_TYPES = new Set(['IMAGE', 'LIST', 'STATS']);

function EditableSlotOverlay({
  section,
  layout,
  selectedSlotId,
  onSelectSlot,
  onUpdateSlot,
}: EditableSlotOverlayProps): React.JSX.Element {
  const interactiveSlots = layout.slots.filter(
    (s) => EDITABLE_SLOT_TYPES.has(s.type),
  );

  const selectedSlot = interactiveSlots.find((s) => s.id === selectedSlotId);

  const selectedSlotIsList = selectedSlot?.type === 'LIST';
  const selectedSlotIsStats = selectedSlot?.type === 'STATS';
  const selectedSlotIsImage = selectedSlot?.type === 'IMAGE';
  const selectedContent =
    selectedSlot && typeof section.content[selectedSlot.id] === 'string'
      ? (section.content[selectedSlot.id] as string)
      : '';

  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  return (
    <>
      {/* Transparent clickable overlay for editable slots */}
      <div className="absolute inset-0 z-10 overflow-visible">
        {interactiveSlots.map((slot) => {
          const pos = slot.position;
          const isSelected = selectedSlotId === slot.id;
          return (
            <div
              key={slot.id}
              className={cn(
                'absolute rounded transition-all group cursor-pointer',
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
            >
              {/* Show slot type badge on hover */}
              {!isSelected && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] rounded bg-primary/10 px-1 py-0.5 text-primary font-medium">
                    {slot.type}
                  </span>
                </div>
              )}

              {/* Action for selected IMAGE slot */}
              {isSelected && slot.type === 'IMAGE' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageDialogOpen(true);
                    }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ImageGenerationDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onGenerate={(url) => {
          if (selectedSlotId) {
            onUpdateSlot(selectedSlotId, url);
            setImageDialogOpen(false);
          }
        }}
        initialQuery={
          selectedSlotIsImage && selectedContent && !selectedContent.match(/^(https?:\/\/|data:image\/|\/)/i)
            ? selectedContent
            : ''
        }
      />

      {/* Non-text editor panel (list/stats) shown below the slide */}
      {selectedSlot && (selectedSlotIsList || selectedSlotIsStats) && (
        <div
          className="absolute left-0 right-0 z-30 mx-4 rounded-lg border border-primary/20 bg-card p-4 shadow-lg"
          style={{ top: '100%', marginTop: '8px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* List editor */}
          {selectedSlotIsList && (
            <InlineListEditor
              items={parseItems(section.content[selectedSlot.id])}
              slotLabel={selectedSlot.label}
              onUpdate={(items) => onUpdateSlot(selectedSlot.id, items)}
            />
          )}

          {/* Stats editor */}
          {selectedSlotIsStats && (
            <InlineStatsEditor
              stats={parseStats(section.content[selectedSlot.id])}
              slotLabel={selectedSlot.label}
              onUpdate={(stats) => onUpdateSlot(selectedSlot.id, stats)}
            />
          )}
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
