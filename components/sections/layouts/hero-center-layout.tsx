'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface HeroCenterLayoutProps {
  section: ResolvedSection;
}

export function HeroCenterLayout({ section }: HeroCenterLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;
  const hasBgImage = typeof content['backgroundImage'] === 'string' && content['backgroundImage'] !== '';

  return (
    <BaseSection section={section} className="relative min-h-[400px] overflow-hidden">
      {/* Background image */}
      {hasBgImage && (
        <div className="absolute inset-0 -z-10">
          <SlotRenderer
            slotId="backgroundImage"
            slotType="IMAGE"
            content={content['backgroundImage']}
            layoutId={layoutId}
            className="h-full w-full"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
        <SlotRenderer
          slotId="title"
          slotType="HEADING"
          content={content['title']}
          layoutId={layoutId}
          className={`text-[var(--sf-text-4xl)] mb-6 ${hasBgImage ? 'text-white' : ''}`}
        />
        <SlotRenderer
          slotId="subtitle"
          slotType="TEXT"
          content={content['subtitle']}
          layoutId={layoutId}
          className={`text-[var(--sf-text-xl)] max-w-2xl ${hasBgImage ? 'text-white/90' : 'text-[var(--sf-color-text-secondary)]'}`}
        />
      </div>
    </BaseSection>
  );
}
