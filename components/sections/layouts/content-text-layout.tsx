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
      <div className="flex flex-col justify-center h-full py-8">
        <SlotRenderer
          slotId="heading"
          slotType="HEADING"
          content={content['heading']}
          layoutId={layoutId}
          className="text-[clamp(1.5rem,2.8vw,2.25rem)] leading-tight mb-8 font-bold"
        />
        <SlotRenderer
          slotId="body"
          slotType="RICHTEXT"
          content={content['body']}
          layoutId={layoutId}
          className="text-[clamp(0.875rem,1.3vw,1.125rem)] leading-relaxed max-w-4xl"
        />
      </div>
    </BaseSection>
  );
}
