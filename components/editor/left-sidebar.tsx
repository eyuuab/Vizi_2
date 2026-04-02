'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSection, setDragging } from '@/store/slices/editor-slice';
import {
  addSection,
  removeSection,
  reorderSections,
  duplicateSection,
  toggleSectionHidden,
} from '@/store/slices/presentation-slice';
import { getLayout, getAllLayouts } from '@/lib/layouts';
import type { SectionState } from '@/store/slices/presentation-slice';

export function LeftSidebar(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((state) => state.presentation.sections);
  const selectedSectionId = useAppSelector((state) => state.editor.selectedSectionId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter((s) => {
      try {
        const layout = getLayout(s.layoutId);
        return (
          layout.name.toLowerCase().includes(query) ||
          s.layoutId.toLowerCase().includes(query)
        );
      } catch {
        return false;
      }
    });
  }, [sections, searchQuery]);

  const sectionIds = useMemo(() => filteredSections.map((s) => s.id), [filteredSections]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveDragId(String(event.active.id));
      dispatch(setDragging(true));
    },
    [dispatch],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      dispatch(setDragging(false));

      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      // Build new order mapping
      const reordered = [...sections];
      const [moved] = reordered.splice(oldIndex, 1);
      if (!moved) return;
      reordered.splice(newIndex, 0, moved);

      dispatch(
        reorderSections(
          reordered.map((s, i) => ({ id: s.id, order: i })),
        ),
      );
    },
    [sections, dispatch],
  );

  const handleAddSection = useCallback(() => {
    const layouts = getAllLayouts();
    const defaultLayout = layouts.find((l) => l.id === 'content-text') ?? layouts[0];
    if (!defaultLayout) return;

    const newId = `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    dispatch(
      addSection({
        id: newId,
        layoutId: defaultLayout.id,
        order: sections.length,
        content: { ...defaultLayout.defaultContent },
      }),
    );
    dispatch(selectSection(newId));
  }, [sections.length, dispatch]);

  const handleDuplicate = useCallback(
    (sectionId: string) => {
      const newId = `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      dispatch(duplicateSection({ sourceSectionId: sectionId, newSectionId: newId }));
      dispatch(selectSection(newId));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (sectionId: string) => {
      dispatch(removeSection(sectionId));
      if (selectedSectionId === sectionId) {
        dispatch(selectSection(null));
      }
    },
    [dispatch, selectedSectionId],
  );

  const activeDragSection = activeDragId
    ? sections.find((s) => s.id === activeDragId)
    : null;

  return (
    <aside className="flex w-64 flex-col border-r bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-semibold">Sections</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleAddSection}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Section list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {filteredSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs text-muted-foreground">
              {sections.length === 0
                ? 'No sections yet. Click + to add one.'
                : 'No sections match your search.'}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1">
                {filteredSections.map((section, index) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    index={index}
                    isSelected={selectedSectionId === section.id}
                    onSelect={() => dispatch(selectSection(section.id))}
                    onDuplicate={() => handleDuplicate(section.id)}
                    onDelete={() => handleDelete(section.id)}
                    onToggleHidden={() => dispatch(toggleSectionHidden(section.id))}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeDragSection ? (
                <SectionThumbnailCard
                  section={activeDragSection}
                  index={sections.findIndex((s) => s.id === activeDragSection.id)}
                  isSelected={false}
                  isDragOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </aside>
  );
}

// ============================================================
// Sortable Section Item
// ============================================================

interface SortableSectionItemProps {
  section: SectionState;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleHidden: () => void;
}

function SortableSectionItem({
  section,
  index,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  onToggleHidden,
}: SortableSectionItemProps): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <SectionThumbnailCard
              section={section}
              index={index}
              isSelected={isSelected}
              onClick={onSelect}
              dragListeners={listeners}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleHidden}>
            {section.isHidden ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ============================================================
// Section Thumbnail Card
// ============================================================

interface SectionThumbnailCardProps {
  section: SectionState;
  index: number;
  isSelected: boolean;
  isDragOverlay?: boolean;
  onClick?: () => void;
  dragListeners?: Record<string, unknown>;
}

function SectionThumbnailCard({
  section,
  index,
  isSelected,
  isDragOverlay = false,
  onClick,
  dragListeners,
}: SectionThumbnailCardProps): React.JSX.Element {
  let layoutName = section.layoutId;
  try {
    const layout = getLayout(section.layoutId);
    layoutName = layout.name;
  } catch {
    // fallback to raw layoutId
  }

  const titleContent = section.content['title'];
  const displayTitle =
    typeof titleContent === 'string' && titleContent.length > 0
      ? titleContent
      : layoutName;

  return (
    <div
      className={cn(
        'group flex items-center gap-2 rounded-md border p-2 transition-colors cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-transparent hover:bg-accent/50',
        isDragOverlay && 'shadow-lg border-primary',
        section.isHidden && 'opacity-50',
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Drag handle */}
      <div
        className="shrink-0 cursor-grab active:cursor-grabbing touch-none"
        {...(dragListeners as React.HTMLAttributes<HTMLDivElement>)}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Thumbnail preview */}
      <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded bg-muted/50 text-[8px] text-muted-foreground overflow-hidden">
        <span className="truncate px-1">{layoutName}</span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{displayTitle}</p>
        <p className="truncate text-[10px] text-muted-foreground">
          {String(index + 1)}. {layoutName}
        </p>
      </div>

      {/* Hidden indicator */}
      {section.isHidden && <EyeOff className="h-3 w-3 shrink-0 text-muted-foreground" />}
    </div>
  );
}
