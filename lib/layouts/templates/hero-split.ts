import type { LayoutTemplate } from '@/types/layout';

export const heroSplitLayout: LayoutTemplate = {
  id: 'hero-split',
  name: 'Hero Split',
  category: 'COVER',
  description: 'Title and subtitle on the left with a full-bleed image on the right. Ideal for opening slides.',
  thumbnail: '/thumbnails/hero-split.svg',
  slots: [
    {
      id: 'title',
      type: 'HEADING',
      label: 'Title',
      required: true,
      position: { x: 5, y: 15, width: 45, height: 30 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 5, y: 5, width: 90, height: 20 },
        tablet: { x: 5, y: 10, width: 55, height: 25 },
      },
      aiHint: 'A bold, concise title that captures the presentation topic. Maximum 8 words recommended.',
    },
    {
      id: 'subtitle',
      type: 'TEXT',
      label: 'Subtitle',
      required: false,
      position: { x: 5, y: 50, width: 45, height: 20 },
      constraints: { minLength: 1, maxLength: 300 },
      responsive: {
        mobile: { x: 5, y: 28, width: 90, height: 15 },
        tablet: { x: 5, y: 38, width: 55, height: 18 },
      },
      aiHint: 'A supporting subtitle that expands on the title. 1-2 sentences.',
    },
    {
      id: 'image',
      type: 'IMAGE',
      label: 'Hero Image',
      required: false,
      position: { x: 52, y: 0, width: 48, height: 100 },
      constraints: { aspectRatio: '3:4', allowedFormats: ['jpg', 'png', 'webp'] },
      responsive: {
        mobile: { x: 0, y: 50, width: 100, height: 50 },
        tablet: { x: 50, y: 0, width: 50, height: 100 },
      },
      aiHint: 'A high-quality, relevant hero image that complements the title. Professional photography preferred.',
    },
  ],
  defaultContent: {
    title: 'Your Presentation Title',
    subtitle: 'Add a compelling subtitle that sets the stage for your presentation.',
    image: '',
  },
  minHeight: 400,
  maxHeight: 'auto',
  supportedMediaTypes: ['IMAGE'],
  pptxMapping: {
    title: {
      shapeType: 'textbox',
      x: 0.67,
      y: 1.13,
      w: 6.0,
      h: 2.25,
    },
    subtitle: {
      shapeType: 'textbox',
      x: 0.67,
      y: 3.75,
      w: 6.0,
      h: 1.5,
    },
    image: {
      shapeType: 'image',
      x: 6.93,
      y: 0,
      w: 6.4,
      h: 7.5,
    },
  },
};
