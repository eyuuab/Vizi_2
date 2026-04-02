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
    <BaseSection section={section} className="min-h-[400px]">
      <div className="flex flex-col md:flex-row items-stretch gap-[var(--sf-slot-gap)] min-h-[350px]">
        {/* Left side: Title + Subtitle */}
        <div className="flex flex-col justify-center flex-1 md:w-[55%] md:flex-none">
          <SlotRenderer
            slotId="title"
            slotType="HEADING"
            content={content['title']}
            layoutId={layoutId}
            className="text-[var(--sf-text-4xl)] mb-4"
          />
          <SlotRenderer
            slotId="subtitle"
            slotType="TEXT"
            content={content['subtitle']}
            layoutId={layoutId}
            className="text-[var(--sf-text-lg)] text-[var(--sf-color-text-secondary)]"
          />
        </div>
        {/* Right side: Image */}
        <div className="flex-1 md:w-[45%] md:flex-none min-h-[250px]">
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
