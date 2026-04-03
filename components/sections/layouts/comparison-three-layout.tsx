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
      <div className="flex flex-col justify-center h-full py-6">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight mb-8 text-center font-bold"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--sf-slot-gap,20px)] flex-1">
          {/* Column 1 */}
          <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius,12px)] p-[var(--sf-inner-padding,20px)] shadow-[var(--sf-shadow)] border border-[var(--sf-color-border,#e5e7eb)]">
            <SlotRenderer
              slotId="label1"
              slotType="HEADING"
              content={content['label1']}
              layoutId={layoutId}
              className="text-[clamp(0.875rem,1.4vw,1.125rem)] mb-4 text-[var(--sf-color-primary)] font-semibold border-b border-[var(--sf-color-border,#e5e7eb)] pb-3"
            />
            <SlotRenderer
              slotId="content1"
              slotType="LIST"
              content={content['content1']}
              layoutId={layoutId}
            />
          </div>
          {/* Column 2 — highlighted */}
          <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius,12px)] p-[var(--sf-inner-padding,20px)] shadow-[var(--sf-shadow)] ring-2 ring-[var(--sf-color-primary)] relative">
            <SlotRenderer
              slotId="label2"
              slotType="HEADING"
              content={content['label2']}
              layoutId={layoutId}
              className="text-[clamp(0.875rem,1.4vw,1.125rem)] mb-4 text-[var(--sf-color-primary)] font-semibold border-b border-[var(--sf-color-primary,#3b82f6)]/20 pb-3"
            />
            <SlotRenderer
              slotId="content2"
              slotType="LIST"
              content={content['content2']}
              layoutId={layoutId}
            />
          </div>
          {/* Column 3 */}
          <div className="bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius,12px)] p-[var(--sf-inner-padding,20px)] shadow-[var(--sf-shadow)] border border-[var(--sf-color-border,#e5e7eb)]">
            <SlotRenderer
              slotId="label3"
              slotType="HEADING"
              content={content['label3']}
              layoutId={layoutId}
              className="text-[clamp(0.875rem,1.4vw,1.125rem)] mb-4 text-[var(--sf-color-primary)] font-semibold border-b border-[var(--sf-color-border,#e5e7eb)] pb-3"
            />
            <SlotRenderer
              slotId="content3"
              slotType="LIST"
              content={content['content3']}
              layoutId={layoutId}
            />
          </div>
        </div>
      </div>
    </BaseSection>
  );
}
