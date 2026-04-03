'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TextSlotProps {
  content: unknown;
  className?: string;
  isHeading?: boolean;
  placeholder?: string;
}

/**
 * Allowlist of HTML tags and attributes for sanitization.
 * Only permits safe formatting tags — no scripts, iframes, etc.
 */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'span', 'blockquote', 'code', 'pre', 'hr',
  'sub', 'sup', 'mark',
]);

const ALLOWED_ATTRS = new Set(['href', 'target', 'rel', 'class', 'style']);

function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') return html;

  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const body = doc.body;
    if (!body) return html;

    function walk(node: Node): void {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
          const text = document.createTextNode(el.textContent ?? '');
          el.parentNode?.replaceChild(text, el);
          return;
        }
        for (const attr of Array.from(el.attributes)) {
          if (!ALLOWED_ATTRS.has(attr.name.toLowerCase())) {
            el.removeAttribute(attr.name);
          }
        }
        if (el.tagName === 'A') {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      }
      for (const child of Array.from(node.childNodes)) {
        walk(child);
      }
    }
    walk(body);
    return body.innerHTML;
  } catch {
    return html;
  }
}

/** Check if a string contains HTML tags */
function containsHTML(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

export function TextSlot({ content, className, isHeading = false, placeholder }: TextSlotProps): React.JSX.Element {
  const text = typeof content === 'string' ? content : '';

  const sanitized = useMemo(() => {
    if (!text || !containsHTML(text)) return null;
    return sanitizeHTML(text);
  }, [text]);

  if (!text && placeholder) {
    return (
      <div className={cn('text-[var(--sf-color-text-secondary)] opacity-50 italic', className)}>
        {placeholder}
      </div>
    );
  }

  // Render as HTML if it contains tags
  if (sanitized) {
    if (isHeading) {
      return (
        <h2
          className={cn(
            'font-[var(--sf-font-heading)] font-[var(--sf-font-weight)] leading-[var(--sf-line-height)] tracking-[var(--sf-letter-spacing)]',
            'text-[var(--sf-color-text-primary)]',
            'sf-richtext',
            className,
          )}
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      );
    }
    return (
      <div
        className={cn(
          'font-[var(--sf-font-body)] leading-[var(--sf-line-height)] tracking-[var(--sf-letter-spacing)]',
          'text-[var(--sf-color-text-primary)]',
          'sf-richtext',
          className,
        )}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  // Plain text rendering
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
