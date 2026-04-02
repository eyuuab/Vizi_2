'use client';

import { cn } from '@/lib/utils';

interface CtaData {
  url: string;
  label: string;
}

interface CtaSlotProps {
  content: unknown;
  className?: string;
  placeholder?: string;
}

function parseCtaData(content: unknown): CtaData | null {
  if (typeof content !== 'object' || content === null) return null;
  const record = content as Record<string, unknown>;

  if (typeof record['url'] !== 'string' || typeof record['label'] !== 'string') {
    return null;
  }

  return { url: record['url'], label: record['label'] };
}

export function CtaSlot({ content, className, placeholder }: CtaSlotProps): React.JSX.Element {
  const cta = parseCtaData(content);

  if (!cta) {
    return (
      <div className={cn('text-[var(--sf-color-text-secondary)] opacity-50 italic text-center', className)}>
        {placeholder ?? 'Add a call-to-action link'}
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center', className)}>
      <a
        href={cta.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center justify-center px-8 py-3',
          'bg-[var(--sf-color-primary)] text-[var(--sf-color-text-on-primary)]',
          'rounded-[var(--sf-border-radius)]',
          'font-[var(--sf-font-heading)] font-semibold text-[var(--sf-text-base)]',
          'hover:opacity-90 transition-opacity',
          'shadow-[var(--sf-shadow)]',
        )}
      >
        {cta.label}
      </a>
    </div>
  );
}
