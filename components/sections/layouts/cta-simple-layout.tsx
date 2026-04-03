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
      <div className="flex flex-col items-center justify-center text-center h-full py-16">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[clamp(1.75rem,3.5vw,3rem)] leading-tight mb-6 font-bold"
        />
        <SlotRenderer
          slotId="subtext"
          slotType="TEXT"
          content={content['subtext']}
          layoutId={layoutId}
          className="text-[clamp(1rem,1.5vw,1.25rem)] text-[var(--sf-color-text-secondary)] mb-10 max-w-2xl leading-relaxed"
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
