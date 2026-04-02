import type { LayoutTemplate } from '@/types/layout';

export const contentTextLayout: LayoutTemplate = {
  id: 'content-text',
  name: 'Content Text',
  category: 'CONTENT',
  description: 'Full-width rich text section. Ideal for paragraphs, key points, and detailed explanations.',
  thumbnail: '/thumbnails/content-text.svg',
  slots: [
    {
      id: 'heading',
      type: 'HEADING',
      label: 'Section Heading',
      required: true,
      position: { x: 5, y: 5, width: 90, height: 15 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 3, y: 3, width: 94, height: 12 },
      },
      aiHint: 'A clear section heading that introduces the content below. 3-8 words.',
    },
    {
      id: 'body',
      type: 'RICHTEXT',
      label: 'Body Text',
      required: true,
      position: { x: 5, y: 25, width: 90, height: 70 },
      constraints: { minLength: 10, maxLength: 3000 },
      responsive: {
        mobile: { x: 3, y: 18, width: 94, height: 78 },
      },
      aiHint: 'The main content area. Support rich text with bullet points, bold text, and paragraphs. Keep concise — presentations should not be walls of text.',
    },
  ],
  defaultContent: {
    heading: 'Section Title',
    body: 'Add your content here. Use bullet points and keep text concise for readability.',
  },
  minHeight: 300,
  maxHeight: 'auto',
  supportedMediaTypes: [],
  pptxMapping: {
    heading: {
      shapeType: 'textbox',
      x: 0.67,
      y: 0.38,
      w: 12.0,
      h: 1.13,
    },
    body: {
      shapeType: 'textbox',
      x: 0.67,
      y: 1.88,
      w: 12.0,
      h: 5.25,
    },
  },
};
