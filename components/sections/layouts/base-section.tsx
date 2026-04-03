'use client';

import type { ResolvedSection } from '@/types/presentation';
import { cn } from '@/lib/utils';

interface BaseSectionProps {
  section: ResolvedSection;
  children: React.ReactNode;
  className?: string;
}

/**
 * Base wrapper for all section layouts.
 * Applies consistent padding, background, and positioning.
 */
export function BaseSection({ section, children, className }: BaseSectionProps): React.JSX.Element {
  const bgOverride = section.styleOverrides?.backgroundColor;
  const textOverride = section.styleOverrides?.textColor;
  const paddingOverride = section.styleOverrides?.padding;

  const style: React.CSSProperties = {};
  if (bgOverride) style.backgroundColor = bgOverride;
  if (textOverride) style.color = textOverride;
  if (paddingOverride) {
    if (paddingOverride.top !== undefined) style.paddingTop = `${String(paddingOverride.top)}px`;
    if (paddingOverride.right !== undefined) style.paddingRight = `${String(paddingOverride.right)}px`;
    if (paddingOverride.bottom !== undefined) style.paddingBottom = `${String(paddingOverride.bottom)}px`;
    if (paddingOverride.left !== undefined) style.paddingLeft = `${String(paddingOverride.left)}px`;
  }

  return (
    <section
      data-section-id={section.id}
      data-layout-id={section.layoutId}
      className={cn(
        'relative w-full h-full',
        'py-[var(--sf-section-padding-top,48px)] px-[var(--sf-section-padding-left,64px)]',
        section.isHidden && 'opacity-50',
        className,
      )}
      style={style}
    >
      <div className="mx-auto w-full h-full max-w-[var(--sf-max-width)]">
        {children}
      </div>
    </section>
  );
}
