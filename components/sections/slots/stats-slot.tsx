'use client';

import { cn } from '@/lib/utils';

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

interface StatsSlotProps {
  content: unknown;
  className?: string;
  placeholder?: string;
}

function parseStats(content: unknown): StatItem[] {
  if (!Array.isArray(content)) return [];

  return content.filter(
    (item): item is StatItem =>
      typeof item === 'object' &&
      item !== null &&
      'value' in item &&
      'label' in item &&
      typeof (item as Record<string, unknown>)['value'] === 'string' &&
      typeof (item as Record<string, unknown>)['label'] === 'string',
  );
}

export function StatsSlot({ content, className, placeholder }: StatsSlotProps): React.JSX.Element {
  const stats = parseStats(content);

  if (stats.length === 0) {
    return (
      <div className={cn('text-[var(--sf-color-text-secondary)] opacity-50 italic', className)}>
        {placeholder ?? 'Add statistics'}
      </div>
    );
  }

  // Dynamically set grid columns based on number of stats
  const gridCols =
    stats.length <= 2
      ? 'grid-cols-2'
      : stats.length === 3
        ? 'grid-cols-3'
        : 'grid-cols-2 md:grid-cols-4';

  return (
    <div className={cn('grid gap-[var(--sf-slot-gap)]', gridCols, className)}>
      {stats.map((stat, index) => (
        <div
          key={`${stat.label}-${String(index)}`}
          className={cn(
            'flex flex-col items-center justify-center text-center',
            'p-[var(--sf-inner-padding)]',
            'bg-[var(--sf-color-surface)]',
            'rounded-[var(--sf-border-radius)]',
            'shadow-[var(--sf-shadow)]',
          )}
        >
          <span
            className={cn(
              'text-[var(--sf-text-3xl)] font-bold',
              'text-[var(--sf-color-primary)]',
              'font-[var(--sf-font-heading)]',
            )}
          >
            {stat.value}
          </span>
          <span className="mt-2 text-[var(--sf-text-sm)] font-medium text-[var(--sf-color-text-primary)]">
            {stat.label}
          </span>
          {stat.description && (
            <span className="mt-1 text-[var(--sf-text-xs)] text-[var(--sf-color-text-secondary)]">
              {stat.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
