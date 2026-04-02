'use client';

import { cn } from '@/lib/utils';

interface ListSlotProps {
  content: unknown;
  className?: string;
  placeholder?: string;
}

function parseListItems(content: unknown): string[] {
  if (Array.isArray(content)) {
    return content.filter((item): item is string => typeof item === 'string');
  }
  if (typeof content === 'string') {
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
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
        'list-disc pl-5 space-y-2',
        'font-[var(--sf-font-body)] text-[var(--sf-color-text-primary)]',
        'leading-[var(--sf-line-height)]',
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={`${item.slice(0, 20)}-${String(index)}`}>{item}</li>
      ))}
    </ul>
  );
}
