import type { LayoutTemplate } from '@/types/layout';

export const timelineHorizontalLayout: LayoutTemplate = {
  id: 'timeline-horizontal',
  name: 'Horizontal Timeline',
  category: 'TIMELINE',
  description: 'Horizontal timeline flowing left to right. Great for process flows, steps, or chronological events.',
  thumbnail: '/thumbnails/timeline-horizontal.svg',
  slots: [
    {
      id: 'heading',
      type: 'HEADING',
      label: 'Timeline Title',
      required: true,
      position: { x: 5, y: 3, width: 90, height: 10 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 3, y: 2, width: 94, height: 8 },
      },
      aiHint: 'A title for the horizontal timeline or process flow.',
    },
    {
      id: 'items',
      type: 'CONFIG',
      label: 'Timeline Items',
      required: true,
      position: { x: 3, y: 20, width: 94, height: 75 },
      constraints: {},
      responsive: {
        mobile: { x: 3, y: 12, width: 94, height: 85 },
      },
      aiHint: 'Array of 3-5 timeline items, each with date (string), title (string), and description (string). Items flow left to right.',
    },
  ],
  defaultContent: {
    heading: 'Process Timeline',
    items: [
      { date: 'Step 1', title: 'Discovery', description: 'Identify needs and goals' },
      { date: 'Step 2', title: 'Design', description: 'Create solutions' },
      { date: 'Step 3', title: 'Develop', description: 'Build and iterate' },
      { date: 'Step 4', title: 'Deliver', description: 'Launch and measure' },
    ],
  },
  minHeight: 350,
  maxHeight: 'auto',
  supportedMediaTypes: [],
  pptxMapping: {
    heading: {
      shapeType: 'textbox',
      x: 0.67,
      y: 0.23,
      w: 12.0,
      h: 0.75,
    },
    items: {
      shapeType: 'shape',
      x: 0.4,
      y: 1.5,
      w: 12.53,
      h: 5.63,
    },
  },
};
