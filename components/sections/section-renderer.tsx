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
import { SectionRenderProvider } from './section-render-context';

interface SectionRendererProps {
  section: ResolvedSection;
}

/**
 * Maps a layoutId to the correct layout component and renders the section.
 * This is the primary entry point for rendering a presentation section.
 */
export function SectionRenderer({ section }: SectionRendererProps): React.JSX.Element {
  let renderedLayout: React.JSX.Element;

  switch (section.layoutId) {
    case 'hero-split':
      renderedLayout = <HeroSplitLayout section={section} />;
      break;
    case 'hero-center':
      renderedLayout = <HeroCenterLayout section={section} />;
      break;
    case 'hero-gradient':
      renderedLayout = <HeroGradientLayout section={section} />;
      break;
    case 'content-text':
      renderedLayout = <ContentTextLayout section={section} />;
      break;
    case 'content-two-column':
      renderedLayout = <ContentTwoColumnLayout section={section} />;
      break;
    case 'content-text-image':
      renderedLayout = <ContentTextImageLayout section={section} />;
      break;
    case 'content-image-text':
      renderedLayout = <ContentImageTextLayout section={section} />;
      break;
    case 'data-chart':
      renderedLayout = <DataChartLayout section={section} />;
      break;
    case 'data-stats':
      renderedLayout = <DataStatsLayout section={section} />;
      break;
    case 'data-table':
      renderedLayout = <DataTableLayout section={section} />;
      break;
    case 'media-full':
      renderedLayout = <MediaFullLayout section={section} />;
      break;
    case 'media-gallery':
      renderedLayout = <MediaGalleryLayout section={section} />;
      break;
    case 'comparison-two':
      renderedLayout = <ComparisonTwoLayout section={section} />;
      break;
    case 'comparison-three':
      renderedLayout = <ComparisonThreeLayout section={section} />;
      break;
    case 'timeline-vertical':
      renderedLayout = <TimelineVerticalLayout section={section} />;
      break;
    case 'timeline-horizontal':
      renderedLayout = <TimelineHorizontalLayout section={section} />;
      break;
    case 'cta-simple':
      renderedLayout = <CtaSimpleLayout section={section} />;
      break;
    case 'blank':
      renderedLayout = <BlankLayout section={section} />;
      break;
    default:
      renderedLayout = (
        <div className="p-8 text-center text-[var(--sf-color-text-secondary)] bg-[var(--sf-color-surface)] rounded-[var(--sf-border-radius)]">
          <p className="text-lg font-medium">Unknown layout: {section.layoutId}</p>
          <p className="text-sm mt-2">This layout type is not yet supported.</p>
        </div>
      );
      break;
  }

  return (
    <SectionRenderProvider sectionId={section.id}>
      {renderedLayout}
    </SectionRenderProvider>
  );
}
