'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface ContentTextImageLayoutProps {
  section: ResolvedSection;
}

export function ContentTextImageLayout({ section }: ContentTextImageLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section}>
      <div className="flex flex-col md:flex-row gap-[var(--sf-slot-gap,32px)] h-full items-stretch">
        {/* Text side (55%) */}
        <div className="flex flex-col justify-center flex-1 md:w-[55%] md:flex-none py-8">
          <SlotRenderer
            slotId="heading"
            slotType="HEADING"
            content={content['heading']}
            layoutId={layoutId}
            className="text-[clamp(1.5rem,2.8vw,2.25rem)] leading-tight mb-6 font-bold"
          />
          <SlotRenderer
            slotId="body"
            slotType="RICHTEXT"
            content={content['body']}
            layoutId={layoutId}
            className="text-[clamp(0.875rem,1.3vw,1.125rem)] leading-relaxed"
          />
        </div>
        {/* Image side (45%) */}
        <div className="flex-1 md:w-[45%] md:flex-none rounded-[var(--sf-border-radius,12px)] overflow-hidden">
          <SlotRenderer
            slotId="image"
            slotType="IMAGE"
            content={content['image']}
            layoutId={layoutId}
            className="h-full w-full"
          />
        </div>
      </div>
    </BaseSection>
  );
}
