import type { LayoutTemplate } from '@/types/layout';

export const mediaFullLayout: LayoutTemplate = {
  id: 'media-full',
  name: 'Full Media',
  category: 'MEDIA',
  description: 'Full-bleed image or video with overlay text. Creates a dramatic visual impact.',
  thumbnail: '/thumbnails/media-full.svg',
  slots: [
    {
      id: 'media',
      type: 'IMAGE',
      label: 'Background Media',
      required: true,
      position: { x: 0, y: 0, width: 100, height: 100 },
      constraints: { aspectRatio: '16:9', allowedFormats: ['jpg', 'png', 'webp', 'mp4'] },
      aiHint: 'A stunning full-bleed image or video. High resolution, strong visual. Will have text overlaid.',
    },
    {
      id: 'overlayTitle',
      type: 'HEADING',
      label: 'Overlay Title',
      required: false,
      position: { x: 5, y: 60, width: 90, height: 20 },
      constraints: { minLength: 1, maxLength: 100 },
      responsive: {
        mobile: { x: 5, y: 55, width: 90, height: 20 },
      },
      aiHint: 'A short title overlaid on the media. Should be readable against the background.',
    },
    {
      id: 'overlayCaption',
      type: 'TEXT',
      label: 'Caption',
      required: false,
      position: { x: 5, y: 82, width: 90, height: 12 },
      constraints: { maxLength: 200 },
      responsive: {
        mobile: { x: 5, y: 78, width: 90, height: 15 },
      },
      aiHint: 'A brief caption or credit line for the media. Very short.',
    },
  ],
  defaultContent: {
    media: '',
    overlayTitle: 'Visual Statement',
    overlayCaption: 'Image caption or credit',
  },
  minHeight: 400,
  maxHeight: 'auto',
  supportedMediaTypes: ['IMAGE', 'VIDEO'],
  pptxMapping: {
    media: {
      shapeType: 'image',
      x: 0,
      y: 0,
      w: 13.333,
      h: 7.5,
    },
    overlayTitle: {
      shapeType: 'textbox',
      x: 0.67,
      y: 4.5,
      w: 12.0,
      h: 1.5,
    },
    overlayCaption: {
      shapeType: 'textbox',
      x: 0.67,
      y: 6.15,
      w: 12.0,
      h: 0.9,
    },
  },
};
