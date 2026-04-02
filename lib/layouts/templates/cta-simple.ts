import type { LayoutTemplate } from '@/types/layout';

export const ctaSimpleLayout: LayoutTemplate = {
  id: 'cta-simple',
  name: 'Call to Action',
  category: 'CTA',
  description: 'Heading, subtext, and a call-to-action button or link. Perfect for closing slides or next steps.',
  thumbnail: '/thumbnails/cta-simple.svg',
  slots: [
    {
      id: 'heading',
      type: 'HEADING',
      label: 'CTA Heading',
      required: true,
      position: { x: 10, y: 20, width: 80, height: 20 },
      constraints: { minLength: 1, maxLength: 100 },
      responsive: {
        mobile: { x: 5, y: 15, width: 90, height: 20 },
      },
      aiHint: 'A compelling call-to-action heading. Action-oriented, e.g., "Ready to Get Started?" or "Let\'s Connect".',
    },
    {
      id: 'subtext',
      type: 'TEXT',
      label: 'Supporting Text',
      required: false,
      position: { x: 15, y: 45, width: 70, height: 15 },
      constraints: { maxLength: 300 },
      responsive: {
        mobile: { x: 5, y: 40, width: 90, height: 15 },
      },
      aiHint: 'Supporting text below the heading. 1-2 sentences that reinforce the CTA.',
    },
    {
      id: 'ctaUrl',
      type: 'URL',
      label: 'CTA Link',
      required: false,
      position: { x: 30, y: 68, width: 40, height: 12 },
      constraints: {},
      responsive: {
        mobile: { x: 15, y: 60, width: 70, height: 12 },
      },
      aiHint: 'The call-to-action button URL and label. Format: { url: string, label: string }.',
    },
  ],
  defaultContent: {
    heading: 'Ready to Get Started?',
    subtext: 'Contact us today to learn more about how we can help you succeed.',
    ctaUrl: { url: 'https://example.com', label: 'Get Started' },
  },
  minHeight: 300,
  maxHeight: 'auto',
  supportedMediaTypes: [],
  pptxMapping: {
    heading: {
      shapeType: 'textbox',
      x: 1.33,
      y: 1.5,
      w: 10.67,
      h: 1.5,
    },
    subtext: {
      shapeType: 'textbox',
      x: 2.0,
      y: 3.38,
      w: 9.33,
      h: 1.13,
    },
    ctaUrl: {
      shapeType: 'shape',
      x: 4.0,
      y: 5.1,
      w: 5.33,
      h: 0.9,
      fill: '#2563EB',
      border: { color: '#2563EB', width: 0 },
    },
  },
};
