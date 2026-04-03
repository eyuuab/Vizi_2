'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface TimelineHorizontalLayoutProps {
  section: ResolvedSection;
}

export function TimelineHorizontalLayout({ section }: TimelineHorizontalLayoutProps): React.JSX.Element {
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
        <div className="flex-1 min-h-0 overflow-x-auto">
          <SlotRenderer
            slotId="items"
            slotType="CONFIG"
            content={content['items']}
            layoutId={layoutId}
          />
        </div>
      </div>
    </BaseSection>
  );
}
