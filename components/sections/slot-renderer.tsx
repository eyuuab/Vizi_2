'use client';

import type { SlotType } from '@/types/enums';
import { TiptapEditor } from '@/components/editor/tiptap-editor';
import { TextSlot } from './slots/text-slot';
import { ImageSlot } from './slots/image-slot';
import { ListSlot } from './slots/list-slot';
import { StatsSlot } from './slots/stats-slot';
import { ChartSlot } from './slots/chart-slot';
import { TableSlot } from './slots/table-slot';
import { TimelineSlot } from './slots/timeline-slot';
import { CtaSlot } from './slots/cta-slot';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSection, selectSlot, setEditing } from '@/store/slices/editor-slice';
import { updateSectionSlotContent } from '@/store/slices/presentation-slice';
import { useSectionRenderContext } from './section-render-context';

export interface SlotRendererProps {
  slotId: string;
  slotType: SlotType;
  content: unknown;
  className?: string;
  /** For timeline slots to determine vertical vs horizontal rendering */
  layoutId?: string;
}

/**
 * Maps a slot type to the appropriate content component.
 * Handles all slot types defined in the SlotType enum.
 */
export function SlotRenderer({
  slotId,
  slotType,
  content,
  className,
  layoutId,
}: SlotRendererProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const selectedSectionId = useAppSelector((state) => state.editor.selectedSectionId);
  const selectedSlotId = useAppSelector((state) => state.editor.selectedSlotId);
  const isEditing = useAppSelector((state) => state.editor.isEditing);
  const sectionContext = useSectionRenderContext();
  const sectionId = sectionContext?.sectionId ?? null;

  const isTextSlotType = slotType === 'HEADING' || slotType === 'TEXT' || slotType === 'RICHTEXT';
  const isActiveTextEditor =
    isTextSlotType &&
    sectionId !== null &&
    selectedSectionId === sectionId &&
    selectedSlotId === slotId &&
    isEditing;

  const activateTextEditing = (event: React.MouseEvent) => {
    if (!isTextSlotType || !sectionId) return;
    event.stopPropagation();
    dispatch(selectSection(sectionId));
    dispatch(selectSlot(slotId));
    dispatch(setEditing(true));
  };

  const updateTextContent = (html: string) => {
    if (!sectionId) return;
    dispatch(updateSectionSlotContent({ sectionId, slotId, content: html }));
  };

  switch (slotType) {
    case 'HEADING': {
      const textContent = typeof content === 'string' ? content : '';
      if (isActiveTextEditor) {
        return (
          <div className="relative z-20">
            <TiptapEditor
              content={textContent}
              placeholder={`Add ${slotId}`}
              isHeading
              className={className}
              onUpdate={updateTextContent}
              onFocus={() => {
                if (!sectionId) return;
                dispatch(selectSection(sectionId));
                dispatch(selectSlot(slotId));
                dispatch(setEditing(true));
              }}
            />
          </div>
        );
      }

      return (
        <div className="relative z-20 cursor-text" onClick={activateTextEditing}>
          <TextSlot content={content} className={className} isHeading placeholder={`Add ${slotId}`} />
        </div>
      );
    }

    case 'TEXT':
    case 'RICHTEXT': {
      const textContent = typeof content === 'string' ? content : '';
      if (isActiveTextEditor) {
        return (
          <div className="relative z-20">
            <TiptapEditor
              content={textContent}
              placeholder={`Add ${slotId}`}
              className={className}
              onUpdate={updateTextContent}
              onFocus={() => {
                if (!sectionId) return;
                dispatch(selectSection(sectionId));
                dispatch(selectSlot(slotId));
                dispatch(setEditing(true));
              }}
            />
          </div>
        );
      }

      return (
        <div className="relative z-20 cursor-text" onClick={activateTextEditing}>
          <TextSlot content={content} className={className} placeholder={`Add ${slotId}`} />
        </div>
      );
    }

    case 'IMAGE':
    case 'VIDEO':
      return <ImageSlot content={content} className={className} alt={slotId} placeholder={`Add ${slotId}`} />;

    case 'LIST':
      return <ListSlot content={content} className={className} placeholder={`Add ${slotId} items`} />;

    case 'STATS':
      return <StatsSlot content={content} className={className} placeholder="Add statistics" />;

    case 'CHART':
      return <ChartSlot content={content} className={className} placeholder="Add chart data" />;

    case 'MERMAID':
      // Mermaid diagrams rendered as code blocks (full Mermaid rendering is a Phase 4+ feature)
      return (
        <div className={className}>
          <pre className="bg-[var(--sf-color-surface)] p-4 rounded-[var(--sf-border-radius)] overflow-x-auto text-[var(--sf-text-sm)] font-[var(--sf-font-mono)]">
            <code>{typeof content === 'string' ? content : 'Add mermaid diagram'}</code>
          </pre>
        </div>
      );

    case 'URL':
      return <CtaSlot content={content} className={className} placeholder="Add link" />;

    case 'CONFIG':
      // CONFIG slots are layout-specific. Route to the right renderer.
      return renderConfigSlot(slotId, content, className, layoutId);

    default: {
      // Exhaustive check — if a new slot type is added, TypeScript will catch it here
      const _exhaustive: never = slotType;
      return (
        <div className={className}>
          <span className="text-[var(--sf-color-text-secondary)] italic">
            Unknown slot type: {String(_exhaustive)}
          </span>
        </div>
      );
    }
  }
}

/**
 * Route CONFIG slot content to the appropriate renderer based on slot ID and layout context.
 */
function renderConfigSlot(
  slotId: string,
  content: unknown,
  className: string | undefined,
  layoutId: string | undefined,
): React.JSX.Element {
  // Table data
  if (slotId === 'table') {
    return <TableSlot content={content} className={className} />;
  }

  // Timeline items
  if (slotId === 'items') {
    const direction = layoutId === 'timeline-horizontal' ? 'horizontal' : 'vertical';
    return <TimelineSlot content={content} className={className} direction={direction} />;
  }

  // Fallback: render as JSON
  return (
    <div className={className}>
      <pre className="bg-[var(--sf-color-surface)] p-4 rounded-[var(--sf-border-radius)] overflow-x-auto text-[var(--sf-text-xs)] font-[var(--sf-font-mono)] text-[var(--sf-color-text-secondary)]">
        {typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content ?? '')}
      </pre>
    </div>
  );
}
