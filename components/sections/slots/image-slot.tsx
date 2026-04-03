'use client';

import { cn } from '@/lib/utils';

interface ImageSlotProps {
  content: unknown;
  className?: string;
  alt?: string;
  placeholder?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

/** Check if a string looks like a URL or data URI (not just a search query) */
function isImageUrl(str: string): boolean {
  return /^(https?:\/\/|data:image\/|\/)/i.test(str.trim());
}

export function ImageSlot({
  content,
  className,
  alt = 'Slide image',
  placeholder,
  objectFit = 'cover',
}: ImageSlotProps): React.JSX.Element {
  const src = typeof content === 'string' ? content.trim() : '';

  // No content or content is a search query (not a URL)
  if (!src || !isImageUrl(src)) {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          'bg-gradient-to-br from-[var(--sf-color-surface,#f3f4f6)] to-[var(--sf-color-border,#e5e7eb)]',
          'rounded-[var(--sf-image-radius,8px)]',
          'text-[var(--sf-color-text-secondary)] text-sm',
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2 p-4">
          <svg
            className="h-8 w-8 mb-1 text-[var(--sf-color-primary,#3b82f6)] opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z"
            />
          </svg>
          <div className="flex flex-col items-center gap-1.5 text-center max-w-[280px]">
            <span className="font-medium text-[var(--sf-color-text-primary)]">
              {placeholder ?? "Select Image"}
            </span>
            {src && !isImageUrl(src) && (
              <span className="text-xs text-[var(--sf-color-text-secondary)] italic leading-tight px-4 py-1.5 bg-[var(--sf-color-surface-hover,#ffffff)] bg-opacity-50 rounded-full border border-[var(--sf-color-border,#e5e7eb)] shadow-sm">
                Suggesting: {src}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-[var(--sf-image-radius,8px)]', className)}>
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
