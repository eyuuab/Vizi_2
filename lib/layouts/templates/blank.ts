import type { LayoutTemplate } from '@/types/layout';

export const blankLayout: LayoutTemplate = {
  id: 'blank',
  name: 'Blank Canvas',
  category: 'BLANK',
  description: 'Empty canvas for custom content. Full creative freedom with no predefined slots.',
  thumbnail: '/thumbnails/blank.svg',
  slots: [
    {
      id: 'content',
      type: 'RICHTEXT',
      label: 'Content',
      required: false,
      position: { x: 5, y: 5, width: 90, height: 90 },
      constraints: { maxLength: 5000 },
      responsive: {
        mobile: { x: 3, y: 3, width: 94, height: 94 },
      },
      aiHint: 'Free-form content area. Place anything here — text, images, or custom elements.',
    },
  ],
  defaultContent: {
    content: '',
  },
  minHeight: 200,
  maxHeight: 'auto',
  supportedMediaTypes: ['IMAGE', 'VIDEO', 'CHART', 'MERMAID'],
  pptxMapping: {
    content: {
      shapeType: 'textbox',
      x: 0.67,
      y: 0.38,
      w: 12.0,
      h: 6.75,
    },
  },
};
