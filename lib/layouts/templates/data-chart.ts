import type { LayoutTemplate } from '@/types/layout';

export const dataChartLayout: LayoutTemplate = {
  id: 'data-chart',
  name: 'Data Chart',
  category: 'DATA',
  description: 'Chart visualization with title and description. Supports bar, line, pie, and area charts.',
  thumbnail: '/thumbnails/data-chart.svg',
  slots: [
    {
      id: 'heading',
      type: 'HEADING',
      label: 'Chart Title',
      required: true,
      position: { x: 5, y: 3, width: 90, height: 10 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 3, y: 2, width: 94, height: 8 },
      },
      aiHint: 'A descriptive title for the chart. Should explain what the data shows.',
    },
    {
      id: 'chart',
      type: 'CHART',
      label: 'Chart',
      required: true,
      position: { x: 5, y: 15, width: 90, height: 65 },
      constraints: {},
      responsive: {
        mobile: { x: 2, y: 12, width: 96, height: 60 },
      },
      aiHint: 'The chart data and configuration. Provide data points, labels, chart type, and colors.',
    },
    {
      id: 'description',
      type: 'TEXT',
      label: 'Description',
      required: false,
      position: { x: 5, y: 83, width: 90, height: 14 },
      constraints: { maxLength: 500 },
      responsive: {
        mobile: { x: 3, y: 75, width: 94, height: 22 },
      },
      aiHint: 'A brief description or key takeaway from the chart data. 1-2 sentences.',
    },
  ],
  defaultContent: {
    heading: 'Chart Title',
    chart: { type: 'bar', labels: ['A', 'B', 'C', 'D'], datasets: [{ label: 'Series 1', data: [10, 20, 30, 40] }] },
    description: 'Key insight from the data above.',
  },
  minHeight: 400,
  maxHeight: 'auto',
  supportedMediaTypes: ['CHART'],
  pptxMapping: {
    heading: {
      shapeType: 'textbox',
      x: 0.67,
      y: 0.23,
      w: 12.0,
      h: 0.75,
    },
    chart: {
      shapeType: 'chart',
      x: 0.67,
      y: 1.13,
      w: 12.0,
      h: 4.88,
    },
    description: {
      shapeType: 'textbox',
      x: 0.67,
      y: 6.23,
      w: 12.0,
      h: 1.05,
    },
  },
};
