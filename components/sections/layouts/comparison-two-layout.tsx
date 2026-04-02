'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface ComparisonTwoLayoutProps {
  section: ResolvedSection;
}

export function ComparisonTwoLayout({ section }: ComparisonTwoLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section}>
      <SlotRenderer
        slotId="heading"
        slotType="HEADING"
        content={content['heading']}
        layoutId={layoutId}
        className="text-[var(--sf-text-2xl)] mb-6 text-center"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--sf-slot-gap)]">
        {/* Left Column */}
        <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius)] p-[var(--sf-inner-padding)] shadow-[var(--sf-shadow)]">
          <SlotRenderer
            slotId="labelLeft"
            slotType="HEADING"
            content={content['labelLeft']}
            layoutId={layoutId}
            className="text-[var(--sf-text-xl)] mb-4 text-[var(--sf-color-primary)]"
          />
          <SlotRenderer
            slotId="contentLeft"
            slotType="LIST"
            content={content['contentLeft']}
            layoutId={layoutId}
          />
        </div>
        {/* Right Column */}
        <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius)] p-[var(--sf-inner-padding)] shadow-[var(--sf-shadow)]">
          <SlotRenderer
            slotId="labelRight"
            slotType="HEADING"
            content={content['labelRight']}
            layoutId={layoutId}
            className="text-[var(--sf-text-xl)] mb-4 text-[var(--sf-color-secondary)]"
          />
          <SlotRenderer
            slotId="contentRight"
            slotType="LIST"
            content={content['contentRight']}
            layoutId={layoutId}
          />
        </div>
      </div>
    </BaseSection>
  );
}
