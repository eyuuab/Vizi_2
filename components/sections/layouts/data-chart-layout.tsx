'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface DataChartLayoutProps {
  section: ResolvedSection;
}

export function DataChartLayout({ section }: DataChartLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section}>
      <div className="flex flex-col h-full py-6">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight mb-6 font-bold"
        />
        <div className="flex-1 min-h-0">
          <SlotRenderer
            slotId="chart"
            slotType="CHART"
            content={content['chart']}
            layoutId={layoutId}
            className="h-full w-full"
          />
        </div>
        <SlotRenderer
          slotId="description"
          slotType="TEXT"
          content={content['description']}
          layoutId={layoutId}
          className="mt-4 text-[clamp(0.75rem,1vw,0.875rem)] text-[var(--sf-color-text-secondary)] leading-relaxed"
        />
      </div>
    </BaseSection>
  );
}
