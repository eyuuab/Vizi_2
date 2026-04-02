import type { LayoutTemplate } from '@/types/layout';

export const heroGradientLayout: LayoutTemplate = {
  id: 'hero-gradient',
  name: 'Hero Gradient',
  category: 'COVER',
  description: 'Bold title with a gradient background and minimal text. Modern, clean opening style.',
  thumbnail: '/thumbnails/hero-gradient.svg',
  slots: [
    {
      id: 'title',
      type: 'HEADING',
      label: 'Title',
      required: true,
      position: { x: 10, y: 30, width: 80, height: 30 },
      constraints: { minLength: 1, maxLength: 80 },
      responsive: {
        mobile: { x: 5, y: 25, width: 90, height: 30 },
        tablet: { x: 10, y: 28, width: 80, height: 30 },
      },
      aiHint: 'A single bold statement — the title is the star. 3-5 words for maximum impact.',
    },
    {
      id: 'subtitle',
      type: 'TEXT',
      label: 'Tagline',
      required: false,
      position: { x: 20, y: 65, width: 60, height: 10 },
      constraints: { minLength: 1, maxLength: 150 },
      responsive: {
        mobile: { x: 10, y: 60, width: 80, height: 12 },
        tablet: { x: 20, y: 62, width: 60, height: 10 },
      },
      aiHint: 'A brief tagline or date. Keep extremely short — under 10 words.',
    },
  ],
  defaultContent: {
    title: 'Bold Statement',
    subtitle: 'Your tagline here',
  },
  minHeight: 400,
  maxHeight: 'auto',
  supportedMediaTypes: [],
  pptxMapping: {
    title: {
      shapeType: 'textbox',
      x: 1.33,
      y: 2.25,
      w: 10.67,
      h: 2.25,
    },
    subtitle: {
      shapeType: 'textbox',
      x: 2.67,
      y: 4.88,
      w: 8.0,
      h: 0.75,
    },
  },
};
