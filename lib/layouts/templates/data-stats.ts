import type { LayoutTemplate } from '@/types/layout';

export const dataStatsLayout: LayoutTemplate = {
  id: 'data-stats',
  name: 'Data Stats',
  category: 'DATA',
  description: '3-4 stat cards with large numbers and labels. Perfect for KPIs, metrics, and key figures.',
  thumbnail: '/thumbnails/data-stats.svg',
  slots: [
    {
      id: 'heading',
      type: 'HEADING',
      label: 'Section Heading',
      required: false,
      position: { x: 5, y: 5, width: 90, height: 12 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 3, y: 3, width: 94, height: 10 },
      },
      aiHint: 'An optional heading above the stats. e.g., "Key Metrics" or "Q3 Results".',
    },
    {
      id: 'stats',
      type: 'STATS',
      label: 'Statistics',
      required: true,
      position: { x: 5, y: 22, width: 90, height: 70 },
      constraints: {},
      responsive: {
        mobile: { x: 3, y: 16, width: 94, height: 80 },
      },
      aiHint: 'An array of 3-4 stat objects, each with value (the number), label (what it measures), and optional description (context). Use real-looking numbers.',
    },
  ],
  defaultContent: {
    heading: 'Key Metrics',
    stats: [
      { value: '98%', label: 'Customer Satisfaction', description: 'Based on Q3 surveys' },
      { value: '2.4M', label: 'Active Users', description: 'Monthly active users' },
      { value: '45%', label: 'Growth Rate', description: 'Year over year' },
      { value: '$12M', label: 'Revenue', description: 'Annual recurring revenue' },
    ],
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
      h: 0.9,
    },
    stats: {
      shapeType: 'shape',
      x: 0.67,
      y: 1.65,
      w: 12.0,
      h: 5.25,
    },
  },
};
