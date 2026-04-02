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
      className="min-h-[400px] bg-[var(--sf-gradient,var(--sf-color-primary))]"
    >
      <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
        <SlotRenderer
          slotId="title"
          slotType="HEADING"
          content={content['title']}
          layoutId={layoutId}
          className="text-[var(--sf-text-4xl)] text-[var(--sf-color-text-on-primary)] mb-4"
        />
        <SlotRenderer
          slotId="subtitle"
          slotType="TEXT"
          content={content['subtitle']}
          layoutId={layoutId}
          className="text-[var(--sf-text-lg)] text-[var(--sf-color-text-on-primary)] opacity-80"
        />
      </div>
    </BaseSection>
  );
}
