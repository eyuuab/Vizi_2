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
      <SlotRenderer
        slotId="heading"
        slotType="HEADING"
        content={content['heading']}
        layoutId={layoutId}
        className="text-[var(--sf-text-2xl)] mb-4"
      />
      <SlotRenderer
        slotId="chart"
        slotType="CHART"
        content={content['chart']}
        layoutId={layoutId}
        className="min-h-[250px]"
      />
      <SlotRenderer
        slotId="description"
        slotType="TEXT"
        content={content['description']}
        layoutId={layoutId}
        className="mt-4 text-[var(--sf-text-sm)] text-[var(--sf-color-text-secondary)]"
      />
    </BaseSection>
  );
}
