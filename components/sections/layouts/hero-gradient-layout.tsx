'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface HeroGradientLayoutProps {
  section: ResolvedSection;
}

export function HeroGradientLayout({ section }: HeroGradientLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection
      section={section}
      className="bg-[var(--sf-gradient,var(--sf-color-primary))]"
    >
      <div className="flex flex-col items-center justify-center text-center h-full py-16">
        <SlotRenderer
          slotId="title"
          slotType="HEADING"
          content={content['title']}
          layoutId={layoutId}
          className="text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[var(--sf-color-text-on-primary)] mb-6 font-bold"
        />
        <SlotRenderer
          slotId="subtitle"
          slotType="TEXT"
          content={content['subtitle']}
          layoutId={layoutId}
          className="text-[clamp(1rem,1.8vw,1.5rem)] text-[var(--sf-color-text-on-primary)] opacity-80 max-w-3xl leading-relaxed"
        />
      </div>
    </BaseSection>
  );
}
