'use client';

import type { ResolvedSection } from '@/types/presentation';
import { SlotRenderer } from '../slot-renderer';
import { BaseSection } from './base-section';

interface BlankLayoutProps {
  section: ResolvedSection;
}

export function BlankLayout({ section }: BlankLayoutProps): React.JSX.Element {
  const { content, layoutId } = section;

  return (
    <BaseSection section={section} className="min-h-[200px]">
      <SlotRenderer
        slotId="content"
        slotType="RICHTEXT"
        content={content['content']}
        layoutId={layoutId}
        className="min-h-[150px]"
      />
    </BaseSection>
  );
}
