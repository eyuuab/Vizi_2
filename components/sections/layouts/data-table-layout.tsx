'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface DataTableLayoutProps {
  section: ResolvedSection;
}

export function DataTableLayout({ section }: DataTableLayoutProps): React.JSX.Element {
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
        <div className="flex-1 min-h-0 overflow-auto">
          <SlotRenderer
            slotId="table"
            slotType="CONFIG"
            content={content['table']}
            layoutId={layoutId}
            className="rounded-[var(--sf-border-radius,12px)] overflow-hidden shadow-[var(--sf-shadow)]"
          />
        </div>
      </div>
    </BaseSection>
  );
}
