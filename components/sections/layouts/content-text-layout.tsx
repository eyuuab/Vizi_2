'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface ContentTextLayoutProps {
  section: ResolvedSection;
}

export function ContentTextLayout({ section }: ContentTextLayoutProps): React.JSX.Element {
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
      <SlotRenderer
        slotId="body"
        slotType="RICHTEXT"
        content={content['body']}
        layoutId={layoutId}
        className="text-[var(--sf-text-base)]"
      />
    </BaseSection>
  );
}
