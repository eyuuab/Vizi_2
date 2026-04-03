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
    <BaseSection section={section}>
      <div className="flex flex-col justify-center h-full py-8">
        <SlotRenderer
          slotId="content"
          slotType="RICHTEXT"
          content={content['content']}
          layoutId={layoutId}
          className="flex-1"
        />
      </div>
    </BaseSection>
  );
}
