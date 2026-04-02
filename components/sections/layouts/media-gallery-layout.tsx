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
      <SlotRenderer
        slotId="heading"
        slotType="HEADING"
        content={content['heading']}
        layoutId={layoutId}
        className="text-[var(--sf-text-2xl)] mb-6"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--sf-slot-gap)]">
        <SlotRenderer
          slotId="image1"
          slotType="IMAGE"
          content={content['image1']}
          layoutId={layoutId}
          className="aspect-video"
        />
        <SlotRenderer
          slotId="image2"
          slotType="IMAGE"
          content={content['image2']}
          layoutId={layoutId}
          className="aspect-video"
        />
        <SlotRenderer
          slotId="image3"
          slotType="IMAGE"
          content={content['image3']}
          layoutId={layoutId}
          className="aspect-video"
        />
        <SlotRenderer
          slotId="image4"
          slotType="IMAGE"
          content={content['image4']}
          layoutId={layoutId}
          className="aspect-video"
        />
      </div>
    </BaseSection>
  );
}
