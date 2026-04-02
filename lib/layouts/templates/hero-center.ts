import type { LayoutTemplate } from '@/types/layout';

export const heroCenterLayout: LayoutTemplate = {
  id: 'hero-center',
  name: 'Hero Center',
  category: 'COVER',
  description: 'Centered title and subtitle with a background image. Classic opening slide layout.',
  thumbnail: '/thumbnails/hero-center.svg',
  slots: [
    {
      id: 'title',
      type: 'HEADING',
      label: 'Title',
      required: true,
      position: { x: 10, y: 25, width: 80, height: 25 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 5, y: 20, width: 90, height: 25 },
        tablet: { x: 10, y: 22, width: 80, height: 25 },
      },
      aiHint: 'A bold, attention-grabbing title centered on the slide. Keep it punchy — 6 words or fewer ideal.',
    },
    {
      id: 'subtitle',
      type: 'TEXT',
      label: 'Subtitle',
      required: false,
      position: { x: 15, y: 55, width: 70, height: 15 },
      constraints: { minLength: 1, maxLength: 300 },
      responsive: {
        mobile: { x: 5, y: 50, width: 90, height: 15 },
        tablet: { x: 15, y: 52, width: 70, height: 15 },
      },
      aiHint: 'Supporting text beneath the title. Short and impactful — one sentence preferred.',
    },
    {
      id: 'backgroundImage',
      type: 'IMAGE',
      label: 'Background Image',
      required: false,
      position: { x: 0, y: 0, width: 100, height: 100 },
      constraints: { aspectRatio: '16:9', allowedFormats: ['jpg', 'png', 'webp'] },
      aiHint: 'A full-bleed background image. Works best with dark overlay for text readability.',
    },
  ],
  defaultContent: {
    title: 'Your Presentation Title',
    subtitle: 'A brief description of what this presentation covers.',
    backgroundImage: '',
  },
  minHeight: 400,
  maxHeight: 'auto',
  supportedMediaTypes: ['IMAGE'],
  pptxMapping: {
    title: {
      shapeType: 'textbox',
      x: 1.33,
      y: 1.88,
      w: 10.67,
      h: 1.88,
    },
    subtitle: {
      shapeType: 'textbox',
      x: 2.0,
      y: 4.13,
      w: 9.33,
      h: 1.13,
    },
    backgroundImage: {
      shapeType: 'image',
      x: 0,
      y: 0,
      w: 13.333,
      h: 7.5,
    },
  },
};
