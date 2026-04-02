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
      <div className="flex flex-col md:flex-row gap-[var(--sf-slot-gap)]">
        {/* Text side (60%) */}
        <div className="flex-1 md:w-[60%] md:flex-none">
          <SlotRenderer
            slotId="heading"
            slotType="HEADING"
            content={content['heading']}
            layoutId={layoutId}
            className="text-[var(--sf-text-3xl)] mb-4"
          />
          <SlotRenderer
            slotId="body"
            slotType="RICHTEXT"
            content={content['body']}
            layoutId={layoutId}
            className="text-[var(--sf-text-base)]"
          />
        </div>
        {/* Image side (40%) */}
        <div className="flex-1 md:w-[40%] md:flex-none min-h-[200px]">
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
