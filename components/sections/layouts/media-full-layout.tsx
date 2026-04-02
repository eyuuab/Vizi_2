'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface MediaFullLayoutProps {
  section: ResolvedSection;
}

export function MediaFullLayout({ section }: MediaFullLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section} className="relative min-h-[400px] overflow-hidden p-0">
      {/* Full-bleed media */}
      <div className="absolute inset-0">
        <SlotRenderer
          slotId="media"
          slotType="IMAGE"
          content={content['media']}
          layoutId={layoutId}
          className="h-full w-full"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Overlay text */}
      <div className="relative z-10 flex flex-col justify-end min-h-[400px] p-[var(--sf-section-padding-left)]">
        <SlotRenderer
          slotId="overlayTitle"
          slotType="HEADING"
          content={content['overlayTitle']}
          layoutId={layoutId}
          className="text-[var(--sf-text-3xl)] text-white mb-2"
        />
        <SlotRenderer
          slotId="overlayCaption"
          slotType="TEXT"
          content={content['overlayCaption']}
          layoutId={layoutId}
          className="text-[var(--sf-text-sm)] text-white/80"
        />
      </div>
    </BaseSection>
  );
}
