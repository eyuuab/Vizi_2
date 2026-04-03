'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface HeroSplitLayoutProps {
  section: ResolvedSection;
}

export function HeroSplitLayout({ section }: HeroSplitLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section}>
      <div className="flex flex-col md:flex-row items-stretch gap-[var(--sf-slot-gap,32px)] h-full">
        {/* Left side: Title + Subtitle */}
        <div className="flex flex-col justify-center flex-1 md:w-[52%] md:flex-none py-8 pr-4">
          <SlotRenderer
            slotId="title"
            slotType="HEADING"
            content={content['title']}
            layoutId={layoutId}
            className="text-[clamp(1.75rem,3.5vw,3rem)] leading-tight mb-6 font-bold"
          />
          <SlotRenderer
            slotId="subtitle"
            slotType="TEXT"
            content={content['subtitle']}
            layoutId={layoutId}
            className="text-[clamp(0.9rem,1.5vw,1.25rem)] text-[var(--sf-color-text-secondary)] leading-relaxed"
          />
        </div>
        {/* Right side: Image */}
        <div className="flex-1 md:w-[48%] md:flex-none rounded-[var(--sf-border-radius,12px)] overflow-hidden">
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
