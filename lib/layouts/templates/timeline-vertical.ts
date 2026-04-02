import type { LayoutTemplate } from '@/types/layout';

export const timelineVerticalLayout: LayoutTemplate = {
  id: 'timeline-vertical',
  name: 'Vertical Timeline',
  category: 'TIMELINE',
  description: 'Vertical timeline with 3-5 chronological items. Ideal for project milestones, history, or roadmaps.',
  thumbnail: '/thumbnails/timeline-vertical.svg',
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
      aiHint: 'A title for the timeline, e.g., "Our Journey" or "Project Roadmap".',
    },
    {
      id: 'items',
      type: 'CONFIG',
      label: 'Timeline Items',
      required: true,
      position: { x: 5, y: 16, width: 90, height: 80 },
      constraints: {},
      responsive: {
        mobile: { x: 3, y: 12, width: 94, height: 85 },
      },
      aiHint: 'Array of 3-5 timeline items, each with date (string), title (string), and description (string). Arrange chronologically.',
    },
  ],
  defaultContent: {
    heading: 'Timeline',
    items: [
      { date: '2024 Q1', title: 'Phase 1', description: 'Research and discovery' },
      { date: '2024 Q2', title: 'Phase 2', description: 'Design and prototyping' },
      { date: '2024 Q3', title: 'Phase 3', description: 'Development and testing' },
      { date: '2024 Q4', title: 'Phase 4', description: 'Launch and iteration' },
    ],
  },
  minHeight: 400,
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
      x: 0.67,
      y: 1.2,
      w: 12.0,
      h: 6.0,
    },
  },
};
