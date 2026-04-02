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
      <SlotRenderer
        slotId="heading"
        slotType="HEADING"
        content={content['heading']}
        layoutId={layoutId}
        className="text-[var(--sf-text-3xl)] mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--sf-slot-gap)]">
        <SlotRenderer
          slotId="columnLeft"
          slotType="RICHTEXT"
          content={content['columnLeft']}
          layoutId={layoutId}
          className="text-[var(--sf-text-base)]"
        />
        <SlotRenderer
          slotId="columnRight"
          slotType="RICHTEXT"
          content={content['columnRight']}
          layoutId={layoutId}
          className="text-[var(--sf-text-base)]"
        />
      </div>
    </BaseSection>
  );
}
