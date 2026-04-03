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
    <BaseSection section={section} className="relative overflow-hidden !p-0">
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
      <div className="relative z-10 flex flex-col justify-end h-full p-[var(--sf-section-padding-left,64px)] pb-16">
        <SlotRenderer
          slotId="overlayTitle"
          slotType="HEADING"
          content={content['overlayTitle']}
          layoutId={layoutId}
          className="text-[clamp(1.5rem,3vw,2.5rem)] leading-tight text-white mb-3 font-bold"
        />
        <SlotRenderer
          slotId="overlayCaption"
          slotType="TEXT"
          content={content['overlayCaption']}
          layoutId={layoutId}
          className="text-[clamp(0.75rem,1.2vw,1rem)] text-white/80 max-w-2xl leading-relaxed"
        />
      </div>
    </BaseSection>
  );
}
