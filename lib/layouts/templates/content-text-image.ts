import type { LayoutTemplate } from '@/types/layout';

export const contentTextImageLayout: LayoutTemplate = {
  id: 'content-text-image',
  name: 'Text + Image',
  category: 'CONTENT',
  description: 'Text on the left with an image on the right (60/40 split). Perfect for illustrating a point.',
  thumbnail: '/thumbnails/content-text-image.svg',
  slots: [
    {
      id: 'heading',
      type: 'HEADING',
      label: 'Heading',
      required: true,
      position: { x: 5, y: 5, width: 55, height: 15 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 3, y: 3, width: 94, height: 10 },
      },
      aiHint: 'Section heading on the left side, above the body text.',
    },
    {
      id: 'body',
      type: 'RICHTEXT',
      label: 'Body Text',
      required: true,
      position: { x: 5, y: 22, width: 55, height: 70 },
      constraints: { minLength: 10, maxLength: 2000 },
      responsive: {
        mobile: { x: 3, y: 15, width: 94, height: 35 },
        tablet: { x: 5, y: 20, width: 55, height: 70 },
      },
      aiHint: 'The main text content. Keep concise — the image carries visual weight. Use bullet points for scannability.',
    },
    {
      id: 'image',
      type: 'IMAGE',
      label: 'Image',
      required: false,
      position: { x: 62, y: 5, width: 35, height: 90 },
      constraints: { aspectRatio: '4:5', allowedFormats: ['jpg', 'png', 'webp'] },
      responsive: {
        mobile: { x: 3, y: 55, width: 94, height: 42 },
        tablet: { x: 60, y: 5, width: 37, height: 90 },
      },
      aiHint: 'An image that illustrates or supports the text content. Choose something visually strong.',
    },
  ],
  defaultContent: {
    heading: 'Content Heading',
    body: 'Your content goes here with supporting details.',
    image: '',
  },
  minHeight: 350,
  maxHeight: 'auto',
  supportedMediaTypes: ['IMAGE'],
  pptxMapping: {
    heading: {
      shapeType: 'textbox',
      x: 0.67,
      y: 0.38,
      w: 7.33,
      h: 1.13,
    },
    body: {
      shapeType: 'textbox',
      x: 0.67,
      y: 1.65,
      w: 7.33,
      h: 5.25,
    },
    image: {
      shapeType: 'image',
      x: 8.27,
      y: 0.38,
      w: 4.67,
      h: 6.75,
    },
  },
};
