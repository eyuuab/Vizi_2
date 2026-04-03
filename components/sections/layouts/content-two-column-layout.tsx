'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface ContentTwoColumnLayoutProps {
  section: ResolvedSection;
}

export function ContentTwoColumnLayout({ section }: ContentTwoColumnLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section}>
      <div className="flex flex-col justify-center h-full py-8">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[clamp(1.5rem,2.8vw,2.25rem)] leading-tight mb-10 font-bold"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--sf-slot-gap,32px)]">
          <div className="border-l-4 border-[var(--sf-color-primary,#3b82f6)] pl-6">
            <SlotRenderer
              slotId="columnLeft"
              slotType="RICHTEXT"
              content={content['columnLeft']}
              layoutId={layoutId}
              className="text-[clamp(0.875rem,1.3vw,1.125rem)] leading-relaxed"
            />
          </div>
          <div className="border-l-4 border-[var(--sf-color-secondary,#8b5cf6)] pl-6">
            <SlotRenderer
              slotId="columnRight"
              slotType="RICHTEXT"
              content={content['columnRight']}
              layoutId={layoutId}
              className="text-[clamp(0.875rem,1.3vw,1.125rem)] leading-relaxed"
            />
          </div>
        </div>
      </div>
    </BaseSection>
  );
}
