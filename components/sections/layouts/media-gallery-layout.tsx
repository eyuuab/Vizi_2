'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface MediaGalleryLayoutProps {
  section: ResolvedSection;
}

export function MediaGalleryLayout({ section }: MediaGalleryLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section}>
      <div className="flex flex-col h-full py-6">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight mb-6 font-bold"
        />
        <div className="flex-1 grid grid-cols-2 gap-[var(--sf-slot-gap,16px)]">
          <SlotRenderer
            slotId="image1"
            slotType="IMAGE"
            content={content['image1']}
            layoutId={layoutId}
            className="aspect-video rounded-[var(--sf-border-radius,8px)] overflow-hidden"
          />
          <SlotRenderer
            slotId="image2"
            slotType="IMAGE"
            content={content['image2']}
            layoutId={layoutId}
            className="aspect-video rounded-[var(--sf-border-radius,8px)] overflow-hidden"
          />
          <SlotRenderer
            slotId="image3"
            slotType="IMAGE"
            content={content['image3']}
            layoutId={layoutId}
            className="aspect-video rounded-[var(--sf-border-radius,8px)] overflow-hidden"
          />
          <SlotRenderer
            slotId="image4"
            slotType="IMAGE"
            content={content['image4']}
            layoutId={layoutId}
            className="aspect-video rounded-[var(--sf-border-radius,8px)] overflow-hidden"
          />
        </div>
      </div>
    </BaseSection>
  );
}
