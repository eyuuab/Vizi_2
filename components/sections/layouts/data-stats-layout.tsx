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
      <div className="flex flex-col justify-center h-full py-8">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight mb-10 text-center font-bold"
        />
        <SlotRenderer
          slotId="stats"
          slotType="STATS"
          content={content['stats']}
          layoutId={layoutId}
        />
      </div>
    </BaseSection>
  );
}
