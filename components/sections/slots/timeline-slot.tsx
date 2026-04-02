'use client';

import { cn } from '@/lib/utils';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface TimelineSlotProps {
  content: unknown;
  className?: string;
  direction: 'vertical' | 'horizontal';
  placeholder?: string;
}

function parseTimelineItems(content: unknown): TimelineItem[] {
  if (!Array.isArray(content)) {
    if (typeof content === 'object' && content !== null) {
      const record = content as Record<string, unknown>;
      if (Array.isArray(record['items'])) {
        return parseTimelineItems(record['items']);
      }
    }
    return [];
  }

  return content.filter(
    (item): item is TimelineItem =>
      typeof item === 'object' &&
      item !== null &&
      'date' in item &&
      'title' in item &&
      typeof (item as Record<string, unknown>)['date'] === 'string' &&
      typeof (item as Record<string, unknown>)['title'] === 'string',
  );
}

export function TimelineSlot({
  content,
  className,
  direction,
  placeholder,
}: TimelineSlotProps): React.JSX.Element {
  const items = parseTimelineItems(content);

  if (items.length === 0) {
    return (
      <div className={cn('text-[var(--sf-color-text-secondary)] opacity-50 italic', className)}>
        {placeholder ?? 'Add timeline items'}
      </div>
    );
  }

  if (direction === 'horizontal') {
    return (
      <div className={cn('flex items-start gap-4 overflow-x-auto py-4', className)}>
        {items.map((item, index) => (
          <div
            key={`${item.date}-${String(index)}`}
            className="flex-shrink-0 flex flex-col items-center text-center min-w-[160px] max-w-[200px]"
          >
            {/* Dot and connector */}
            <div className="flex items-center w-full mb-3">
              {index > 0 && (
                <div className="flex-1 h-0.5 bg-[var(--sf-color-border)]" />
              )}
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 border-[var(--sf-color-primary)] flex-shrink-0',
                  index === 0 ? 'bg-[var(--sf-color-primary)]' : 'bg-[var(--sf-color-background)]',
                )}
              />
              {index < items.length - 1 && (
                <div className="flex-1 h-0.5 bg-[var(--sf-color-border)]" />
              )}
            </div>
            <span className="text-[var(--sf-text-xs)] font-semibold text-[var(--sf-color-primary)] mb-1">
              {item.date}
            </span>
            <span className="text-[var(--sf-text-sm)] font-medium text-[var(--sf-color-text-primary)] mb-1">
              {item.title}
            </span>
            {item.description && (
              <span className="text-[var(--sf-text-xs)] text-[var(--sf-color-text-secondary)]">
                {item.description}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Vertical timeline
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--sf-color-border)]" />

      <div className="space-y-6 pl-12">
        {items.map((item, index) => (
          <div key={`${item.date}-${String(index)}`} className="relative">
            {/* Dot */}
            <div
              className={cn(
                'absolute -left-[2.25rem] top-1 w-4 h-4 rounded-full border-2 border-[var(--sf-color-primary)]',
                index === 0 ? 'bg-[var(--sf-color-primary)]' : 'bg-[var(--sf-color-background)]',
              )}
            />
            <span className="text-[var(--sf-text-xs)] font-semibold text-[var(--sf-color-primary)] block mb-1">
              {item.date}
            </span>
            <span className="text-[var(--sf-text-base)] font-medium text-[var(--sf-color-text-primary)] block mb-1">
              {item.title}
            </span>
            {item.description && (
              <span className="text-[var(--sf-text-sm)] text-[var(--sf-color-text-secondary)] block">
                {item.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
