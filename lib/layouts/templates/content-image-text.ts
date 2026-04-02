import type { LayoutTemplate } from '@/types/layout';

export const contentImageTextLayout: LayoutTemplate = {
  id: 'content-image-text',
  name: 'Image + Text',
  category: 'CONTENT',
  description: 'Image on the left with text on the right (40/60 split). Leads with visual, follows with content.',
  thumbnail: '/thumbnails/content-image-text.svg',
  slots: [
    {
      id: 'image',
      type: 'IMAGE',
      label: 'Image',
      required: false,
      position: { x: 3, y: 5, width: 35, height: 90 },
      constraints: { aspectRatio: '4:5', allowedFormats: ['jpg', 'png', 'webp'] },
      responsive: {
        mobile: { x: 3, y: 3, width: 94, height: 42 },
        tablet: { x: 3, y: 5, width: 37, height: 90 },
      },
      aiHint: 'A leading image that draws the eye first. Should be high-quality and directly relevant.',
    },
    {
      id: 'heading',
      type: 'HEADING',
      label: 'Heading',
      required: true,
      position: { x: 42, y: 5, width: 55, height: 15 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 3, y: 48, width: 94, height: 10 },
      },
      aiHint: 'Section heading on the right side, above the body text.',
    },
    {
      id: 'body',
      type: 'RICHTEXT',
      label: 'Body Text',
      required: true,
      position: { x: 42, y: 22, width: 55, height: 70 },
      constraints: { minLength: 10, maxLength: 2000 },
      responsive: {
        mobile: { x: 3, y: 60, width: 94, height: 35 },
        tablet: { x: 42, y: 20, width: 55, height: 70 },
      },
      aiHint: 'Supporting text that explains the image. Bullet points work well here.',
    },
  ],
  defaultContent: {
    image: '',
    heading: 'Content Heading',
    body: 'Your content goes here with supporting details.',
  },
  minHeight: 350,
  maxHeight: 'auto',
  supportedMediaTypes: ['IMAGE'],
  pptxMapping: {
    image: {
      shapeType: 'image',
      x: 0.4,
      y: 0.38,
      w: 4.67,
      h: 6.75,
    },
    heading: {
      shapeType: 'textbox',
      x: 5.6,
      y: 0.38,
      w: 7.33,
      h: 1.13,
    },
    body: {
      shapeType: 'textbox',
      x: 5.6,
      y: 1.65,
      w: 7.33,
      h: 5.25,
    },
  },
};
