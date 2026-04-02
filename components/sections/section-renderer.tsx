'use client';

import type { ResolvedSection } from '@/types/presentation';
import {
  HeroSplitLayout,
  HeroCenterLayout,
  HeroGradientLayout,
  ContentTextLayout,
  ContentTwoColumnLayout,
  ContentTextImageLayout,
  ContentImageTextLayout,
  DataChartLayout,
  DataStatsLayout,
  DataTableLayout,
  MediaFullLayout,
  MediaGalleryLayout,
  ComparisonTwoLayout,
  ComparisonThreeLayout,
  TimelineVerticalLayout,
  TimelineHorizontalLayout,
  CtaSimpleLayout,
  BlankLayout,
} from './layouts';

interface SectionRendererProps {
  section: ResolvedSection;
}

/**
 * Maps a layoutId to the correct layout component and renders the section.
 * This is the primary entry point for rendering a presentation section.
 */
export function SectionRenderer({ section }: SectionRendererProps): React.JSX.Element {
  switch (section.layoutId) {
    case 'hero-split':
      return <HeroSplitLayout section={section} />;
    case 'hero-center':
      return <HeroCenterLayout section={section} />;
    case 'hero-gradient':
      return <HeroGradientLayout section={section} />;
    case 'content-text':
      return <ContentTextLayout section={section} />;
    case 'content-two-column':
      return <ContentTwoColumnLayout section={section} />;
    case 'content-text-image':
      return <ContentTextImageLayout section={section} />;
    case 'content-image-text':
      return <ContentImageTextLayout section={section} />;
    case 'data-chart':
      return <DataChartLayout section={section} />;
    case 'data-stats':
      return <DataStatsLayout section={section} />;
    case 'data-table':
      return <DataTableLayout section={section} />;
    case 'media-full':
      return <MediaFullLayout section={section} />;
    case 'media-gallery':
      return <MediaGalleryLayout section={section} />;
    case 'comparison-two':
      return <ComparisonTwoLayout section={section} />;
    case 'comparison-three':
      return <ComparisonThreeLayout section={section} />;
    case 'timeline-vertical':
      return <TimelineVerticalLayout section={section} />;
    case 'timeline-horizontal':
      return <TimelineHorizontalLayout section={section} />;
    case 'cta-simple':
      return <CtaSimpleLayout section={section} />;
    case 'blank':
      return <BlankLayout section={section} />;
    default:
      return (
        <div className="p-8 text-center text-[var(--sf-color-text-secondary)] bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius)]">
          <p className="text-lg font-medium">Unknown layout: {section.layoutId}</p>
          <p className="text-sm mt-2">This layout type is not yet supported.</p>
        </div>
      );
  }
}
