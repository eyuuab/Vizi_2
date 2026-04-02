'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface CtaSimpleLayoutProps {
  section: ResolvedSection;
}

export function CtaSimpleLayout({ section }: CtaSimpleLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section}>
      <div className="flex flex-col items-center justify-center text-center min-h-[200px]">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[var(--sf-text-3xl)] mb-4"
        />
        <SlotRenderer
          slotId="subtext"
          slotType="TEXT"
          content={content['subtext']}
          layoutId={layoutId}
          className="text-[var(--sf-text-lg)] text-[var(--sf-color-text-secondary)] mb-8 max-w-xl"
        />
        <SlotRenderer
          slotId="ctaUrl"
          slotType="URL"
          content={content['ctaUrl']}
          layoutId={layoutId}
        />
      </div>
    </BaseSection>
  );
}
