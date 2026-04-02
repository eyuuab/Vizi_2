'use client';

import { cn } from '@/lib/utils';

interface ImageSlotProps {
  content: unknown;
  className?: string;
  alt?: string;
  placeholder?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export function ImageSlot({
  content,
  className,
  alt = 'Slide image',
  placeholder,
  objectFit = 'cover',
}: ImageSlotProps): React.JSX.Element {
  const src = typeof content === 'string' ? content : '';

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          'bg-[var(--sf-color-surface)] border-2 border-dashed border-[var(--sf-color-border)]',
          'rounded-[var(--sf-image-radius)]',
          'text-[var(--sf-color-text-secondary)] text-sm',
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2 p-4">
          <svg
            className="h-8 w-8 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z"
            />
          </svg>
          <span>{placeholder ?? 'Add image'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-[var(--sf-image-radius)]', className)}>
      {/* Using native img for Server Component compatibility and simplicity */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn('h-full w-full', {
          'object-cover': objectFit === 'cover',
          'object-contain': objectFit === 'contain',
          'object-fill': objectFit === 'fill',
        })}
        loading="lazy"
      />
    </div>
  );
}
