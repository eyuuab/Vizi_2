import type { LayoutTemplate } from '@/types/layout';

export const contentTwoColumnLayout: LayoutTemplate = {
  id: 'content-two-column',
  name: 'Two Column Content',
  category: 'CONTENT',
  description: 'Two equal text columns for side-by-side content. Great for pros/cons, two topics, or balanced information.',
  thumbnail: '/thumbnails/content-two-column.svg',
  slots: [
    {
      id: 'heading',
      type: 'HEADING',
      label: 'Section Heading',
      required: true,
      position: { x: 5, y: 5, width: 90, height: 12 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 3, y: 3, width: 94, height: 10 },
      },
      aiHint: 'A heading that spans both columns. Describes the overall topic.',
    },
    {
      id: 'columnLeft',
      type: 'RICHTEXT',
      label: 'Left Column',
      required: true,
      position: { x: 5, y: 22, width: 43, height: 73 },
      constraints: { minLength: 1, maxLength: 1500 },
      responsive: {
        mobile: { x: 3, y: 16, width: 94, height: 38 },
        tablet: { x: 5, y: 20, width: 43, height: 73 },
      },
      aiHint: 'Content for the left column. Use bullet points or short paragraphs. Keep balanced with the right column.',
    },
    {
      id: 'columnRight',
      type: 'RICHTEXT',
      label: 'Right Column',
      required: true,
      position: { x: 52, y: 22, width: 43, height: 73 },
      constraints: { minLength: 1, maxLength: 1500 },
      responsive: {
        mobile: { x: 3, y: 56, width: 94, height: 38 },
        tablet: { x: 52, y: 20, width: 43, height: 73 },
      },
      aiHint: 'Content for the right column. Mirror the structure of the left column for visual balance.',
    },
  ],
  defaultContent: {
    heading: 'Two Column Layout',
    columnLeft: 'Left column content goes here.',
    columnRight: 'Right column content goes here.',
  },
  minHeight: 350,
  maxHeight: 'auto',
  supportedMediaTypes: [],
  pptxMapping: {
    heading: {
      shapeType: 'textbox',
      x: 0.67,
      y: 0.38,
      w: 12.0,
      h: 0.9,
    },
    columnLeft: {
      shapeType: 'textbox',
      x: 0.67,
      y: 1.65,
      w: 5.73,
      h: 5.47,
    },
    columnRight: {
      shapeType: 'textbox',
      x: 6.93,
      y: 1.65,
      w: 5.73,
      h: 5.47,
    },
  },
};
