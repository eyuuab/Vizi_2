'use client';

import { cn } from '@/lib/utils';

interface TextSlotProps {
  content: unknown;
  className?: string;
  isHeading?: boolean;
  placeholder?: string;
}

export function TextSlot({ content, className, isHeading = false, placeholder }: TextSlotProps): React.JSX.Element {
  const text = typeof content === 'string' ? content : '';

  if (!text && placeholder) {
    return (
      <div className={cn('text-[var(--sf-color-text-secondary)] opacity-50 italic', className)}>
        {placeholder}
      </div>
    );
  }

  if (isHeading) {
    return (
      <h2
        className={cn(
          'font-[var(--sf-font-heading)] font-[var(--sf-font-weight)] leading-[var(--sf-line-height)] tracking-[var(--sf-letter-spacing)]',
          'text-[var(--sf-color-text-primary)]',
          className,
        )}
      >
        {text}
      </h2>
    );
  }

  return (
    <div
      className={cn(
        'font-[var(--sf-font-body)] leading-[var(--sf-line-height)] tracking-[var(--sf-letter-spacing)]',
        'text-[var(--sf-color-text-primary)]',
        'whitespace-pre-wrap',
        className,
      )}
    >
      {text}
    </div>
  );
}
