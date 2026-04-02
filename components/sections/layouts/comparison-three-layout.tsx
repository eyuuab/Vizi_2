'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface ComparisonThreeLayoutProps {
  section: ResolvedSection;
}

export function ComparisonThreeLayout({ section }: ComparisonThreeLayoutProps): React.JSX.Element {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--sf-slot-gap)]">
        {/* Column 1 */}
        <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius)] p-[var(--sf-inner-padding)] shadow-[var(--sf-shadow)]">
          <SlotRenderer
            slotId="label1"
            slotType="HEADING"
            content={content['label1']}
            layoutId={layoutId}
            className="text-[var(--sf-text-lg)] mb-4 text-[var(--sf-color-primary)]"
          />
          <SlotRenderer
            slotId="content1"
            slotType="LIST"
            content={content['content1']}
            layoutId={layoutId}
          />
        </div>
        {/* Column 2 */}
        <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius)] p-[var(--sf-inner-padding)] shadow-[var(--sf-shadow)] ring-2 ring-[var(--sf-color-primary)]">
          <SlotRenderer
            slotId="label2"
            slotType="HEADING"
            content={content['label2']}
            layoutId={layoutId}
            className="text-[var(--sf-text-lg)] mb-4 text-[var(--sf-color-primary)]"
          />
          <SlotRenderer
            slotId="content2"
            slotType="LIST"
            content={content['content2']}
            layoutId={layoutId}
          />
        </div>
        {/* Column 3 */}
        <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius)] p-[var(--sf-inner-padding)] shadow-[var(--sf-shadow)]">
          <SlotRenderer
            slotId="label3"
            slotType="HEADING"
            content={content['label3']}
            layoutId={layoutId}
            className="text-[var(--sf-text-lg)] mb-4 text-[var(--sf-color-primary)]"
          />
          <SlotRenderer
            slotId="content3"
            slotType="LIST"
            content={content['content3']}
            layoutId={layoutId}
          />
        </div>
      </div>
    </BaseSection>
  );
}
