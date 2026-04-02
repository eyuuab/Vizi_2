'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface TimelineVerticalLayoutProps {
  section: ResolvedSection;
}

export function TimelineVerticalLayout({ section }: TimelineVerticalLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section}>
      <SlotRenderer
        slotId="heading"
        slotType="HEADING"
        content={content['heading']}
        layoutId={layoutId}
        className="text-[var(--sf-text-2xl)] mb-6"
      />
      <SlotRenderer
        slotId="items"
        slotType="CONFIG"
        content={content['items']}
        layoutId={layoutId}
      />
    </BaseSection>
  );
}
