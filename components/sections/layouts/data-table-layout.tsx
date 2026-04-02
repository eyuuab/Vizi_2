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
      <SlotRenderer
        slotId="heading"
        slotType="HEADING"
        content={content['heading']}
        layoutId={layoutId}
        className="text-[var(--sf-text-2xl)] mb-4"
      />
      <SlotRenderer
        slotId="table"
        slotType="CONFIG"
        content={content['table']}
        layoutId={layoutId}
        className="rounded-[var(--sf-border-radius)] overflow-hidden shadow-[var(--sf-shadow)]"
      />
    </BaseSection>
  );
}
