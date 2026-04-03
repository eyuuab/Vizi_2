'use client';

import { cn } from '@/lib/utils';

interface ListSlotProps {
  content: unknown;
  className?: string;
  placeholder?: string;
}

interface ListItem {
  label: string;
  description?: string;
}

function parseListItems(content: unknown): ListItem[] {
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return { label: item };
        }
        if (typeof item === 'object' && item !== null && 'label' in item) {
          return {
            label: String((item as Record<string, unknown>).label),
            description: (item as Record<string, unknown>).description
              ? String((item as Record<string, unknown>).description)
              : undefined,
          };
        }
        return null;
      })
      .filter((item): item is ListItem => item !== null);
  }
  if (typeof content === 'string') {
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => ({ label: line }));
  }
  return [];
}

export function ListSlot({ content, className, placeholder }: ListSlotProps): React.JSX.Element {
  const items = parseListItems(content);

  if (items.length === 0) {
    return (
      <div className={cn('text-[var(--sf-color-text-secondary)] opacity-50 italic', className)}>
        {placeholder ?? 'Add list items'}
      </div>
    );
  }

  return (
    <ul
      className={cn(
        'list-disc pl-5 space-y-3',
        'font-[var(--sf-font-body)] text-[var(--sf-color-text-primary)]',
        'leading-[var(--sf-line-height)]',
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={`${item.label.slice(0, 20)}-${String(index)}`}>
          <span className="font-semibold">{item.label}</span>
          {item.description && (
            <p className="mt-0.5 text-[var(--sf-color-text-secondary)] text-[0.9em]">
              {item.description}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
