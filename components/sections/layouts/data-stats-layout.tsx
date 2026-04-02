'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface DataStatsLayoutProps {
  section: ResolvedSection;
}

export function DataStatsLayout({ section }: DataStatsLayoutProps): React.JSX.Element {
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
      <SlotRenderer
        slotId="stats"
        slotType="STATS"
        content={content['stats']}
        layoutId={layoutId}
      />
    </BaseSection>
  );
}
