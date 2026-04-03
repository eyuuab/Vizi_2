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
      <div className="flex flex-col justify-center h-full py-6">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight mb-8 text-center font-bold"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--sf-slot-gap,24px)] flex-1">
          {/* Left Column */}
          <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius,12px)] p-[var(--sf-inner-padding,24px)] shadow-[var(--sf-shadow)] border border-[var(--sf-color-border,#e5e7eb)]">
            <SlotRenderer
              slotId="labelLeft"
              slotType="HEADING"
              content={content['labelLeft']}
              layoutId={layoutId}
              className="text-[clamp(1rem,1.6vw,1.25rem)] mb-5 text-[var(--sf-color-primary)] font-semibold border-b border-[var(--sf-color-border,#e5e7eb)] pb-3"
            />
            <SlotRenderer
              slotId="contentLeft"
              slotType="LIST"
              content={content['contentLeft']}
              layoutId={layoutId}
            />
          </div>
          {/* Right Column */}
          <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius,12px)] p-[var(--sf-inner-padding,24px)] shadow-[var(--sf-shadow)] border border-[var(--sf-color-border,#e5e7eb)]">
            <SlotRenderer
              slotId="labelRight"
              slotType="HEADING"
              content={content['labelRight']}
              layoutId={layoutId}
              className="text-[clamp(1rem,1.6vw,1.25rem)] mb-5 text-[var(--sf-color-secondary)] font-semibold border-b border-[var(--sf-color-border,#e5e7eb)] pb-3"
            />
            <SlotRenderer
              slotId="contentRight"
              slotType="LIST"
              content={content['contentRight']}
              layoutId={layoutId}
            />
          </div>
        </div>
      </div>
    </BaseSection>
  );
}
