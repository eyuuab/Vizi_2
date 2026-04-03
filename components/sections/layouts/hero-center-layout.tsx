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
    <BaseSection section={section} className="relative overflow-hidden">
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

      <div className="flex flex-col items-center justify-center text-center h-full py-16">
        <SlotRenderer
          slotId="title"
          slotType="HEADING"
          content={content['title']}
          layoutId={layoutId}
          className={`text-[clamp(2rem,4vw,3.5rem)] leading-tight mb-6 font-bold ${hasBgImage ? 'text-white' : ''}`}
        />
        <SlotRenderer
          slotId="subtitle"
          slotType="TEXT"
          content={content['subtitle']}
          layoutId={layoutId}
          className={`text-[clamp(1rem,1.8vw,1.5rem)] max-w-3xl leading-relaxed ${hasBgImage ? 'text-white/90' : 'text-[var(--sf-color-text-secondary)]'}`}
        />
      </div>
    </BaseSection>
  );
}
