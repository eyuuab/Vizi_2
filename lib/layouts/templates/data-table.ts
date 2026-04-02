import type { LayoutTemplate } from '@/types/layout';

export const dataTableLayout: LayoutTemplate = {
  id: 'data-table',
  name: 'Data Table',
  category: 'DATA',
  description: 'Table with title for structured data presentation. Supports headers and multiple rows.',
  thumbnail: '/thumbnails/data-table.svg',
  slots: [
    {
      id: 'heading',
      type: 'HEADING',
      label: 'Table Title',
      required: true,
      position: { x: 5, y: 3, width: 90, height: 10 },
      constraints: { minLength: 1, maxLength: 120 },
      responsive: {
        mobile: { x: 3, y: 2, width: 94, height: 8 },
      },
      aiHint: 'A descriptive title for the table data.',
    },
    {
      id: 'table',
      type: 'CONFIG',
      label: 'Table Data',
      required: true,
      position: { x: 5, y: 16, width: 90, height: 78 },
      constraints: {},
      responsive: {
        mobile: { x: 2, y: 12, width: 96, height: 84 },
      },
      aiHint: 'Table data with headers array and rows array. Keep to 3-6 columns and up to 8 rows for readability. Format: { headers: string[], rows: string[][] }',
    },
  ],
  defaultContent: {
    heading: 'Data Overview',
    table: {
      headers: ['Category', 'Q1', 'Q2', 'Q3', 'Q4'],
      rows: [
        ['Product A', '$120K', '$135K', '$142K', '$168K'],
        ['Product B', '$85K', '$92K', '$101K', '$115K'],
        ['Product C', '$45K', '$52K', '$58K', '$67K'],
      ],
    },
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
    table: {
      shapeType: 'table',
      x: 0.67,
      y: 1.2,
      w: 12.0,
      h: 5.85,
    },
  },
};
