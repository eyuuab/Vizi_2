/**
 * Thumbnail Generation — Section 5G
 *
 * Generates a preview thumbnail for dashboard display.
 * Creates an SVG representation of the first slide, then converts to JPEG via Sharp.
 */

import sharp from 'sharp';
import type { ComposedPresentation, ResolvedSection } from '@/types/presentation';
import { resolveThemeForPptx } from './theme-resolver';
import type { PptxResolvedTheme } from './theme-resolver';

// ============================================================
// Constants
// ============================================================

const THUMBNAIL_WIDTH = 640;
const THUMBNAIL_HEIGHT = 360; // 16:9 aspect ratio
const JPEG_QUALITY = 85;

// ============================================================
// Public API
// ============================================================

/**
 * Generate a thumbnail image for a presentation.
 * Renders the first slide as a styled SVG, then converts to JPEG.
 * Returns base64-encoded JPEG data.
 */
export async function generateThumbnail(
  presentation: ComposedPresentation,
): Promise<Buffer> {
  const theme = resolveThemeForPptx(presentation.theme);
  const firstSection = presentation.sections.find((s) => !s.isHidden);

  const svg = renderThumbnailSvg(
    firstSection ?? null,
    theme,
    presentation.title,
  );

  const buffer = await sharp(Buffer.from(svg))
    .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  return buffer;
}

/**
 * Generate thumbnail and return as base64 data URL.
 */
export async function generateThumbnailDataUrl(
  presentation: ComposedPresentation,
): Promise<string> {
  const buffer = await generateThumbnail(presentation);
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

// ============================================================
// SVG Rendering
// ============================================================

function renderThumbnailSvg(
  section: ResolvedSection | null,
  theme: PptxResolvedTheme,
  title: string,
): string {
  const bgColor = `#${theme.background.color}`;
  const primaryColor = `#${theme.colors.primary}`;
  const textColor = `#${theme.colors.textPrimary}`;
  const textSecondary = `#${theme.colors.textSecondary}`;
  const headingFont = theme.fonts.heading;
  const bodyFont = theme.fonts.body;

  if (!section) {
    // No sections — render title-only thumbnail
    return `
      <svg width="${String(THUMBNAIL_WIDTH)}" height="${String(THUMBNAIL_HEIGHT)}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${escapeXml(bgColor)}"/>
        <text
          x="50%" y="45%"
          font-family="${escapeXml(headingFont)}, Arial, sans-serif"
          font-size="28"
          font-weight="bold"
          fill="${escapeXml(textColor)}"
          text-anchor="middle"
          dominant-baseline="middle"
        >${escapeXml(truncate(title, 40))}</text>
        <text
          x="50%" y="62%"
          font-family="${escapeXml(bodyFont)}, Arial, sans-serif"
          font-size="14"
          fill="${escapeXml(textSecondary)}"
          text-anchor="middle"
          dominant-baseline="middle"
        >SlideForge AI</text>
      </svg>
    `;
  }

  // Render based on the section layout category
  const category = section.layout.category;
  const slots = section.resolvedSlots;

  // Extract common content
  const titleSlot = slots.find(
    (s) => s.definition.id === 'title' || s.definition.type === 'HEADING',
  );
  const subtitleSlot = slots.find(
    (s) => s.definition.id === 'subtitle' || (s.definition.type === 'TEXT' && s.definition.id !== 'description'),
  );
  const imageSlot = slots.find((s) => s.definition.type === 'IMAGE');

  const titleText = extractTextContent(titleSlot?.content) || title;
  const subtitleText = extractTextContent(subtitleSlot?.content) || '';
  const hasImage = Boolean(imageSlot && imageSlot.content && imageSlot.content !== '');

  switch (category) {
    case 'COVER':
      return renderCoverThumbnail(
        bgColor, primaryColor, textColor, textSecondary,
        headingFont, bodyFont, titleText, subtitleText, hasImage,
      );
    case 'DATA':
      return renderDataThumbnail(
        bgColor, primaryColor, textColor, textSecondary,
        headingFont, bodyFont, titleText,
      );
    default:
      return renderDefaultThumbnail(
        bgColor, primaryColor, textColor, textSecondary,
        headingFont, bodyFont, titleText, subtitleText,
      );
  }
}

function renderCoverThumbnail(
  bgColor: string, primaryColor: string, textColor: string, _textSecondary: string,
  headingFont: string, bodyFont: string, titleText: string, subtitleText: string, hasImage: boolean,
): string {
  const imageBlock = hasImage
    ? `<rect x="55%" y="0" width="45%" height="100%" fill="${escapeXml(primaryColor)}" opacity="0.15"/>`
    : '';

  return `
    <svg width="${String(THUMBNAIL_WIDTH)}" height="${String(THUMBNAIL_HEIGHT)}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${escapeXml(bgColor)}"/>
      ${imageBlock}
      <text
        x="5%" y="40%"
        font-family="${escapeXml(headingFont)}, Arial, sans-serif"
        font-size="24"
        font-weight="bold"
        fill="${escapeXml(textColor)}"
        dominant-baseline="middle"
      >${escapeXml(truncate(titleText, 35))}</text>
      <text
        x="5%" y="55%"
        font-family="${escapeXml(bodyFont)}, Arial, sans-serif"
        font-size="13"
        fill="${escapeXml(textColor)}"
        opacity="0.7"
        dominant-baseline="middle"
      >${escapeXml(truncate(subtitleText, 50))}</text>
      <rect x="5%" y="70%" width="15%" height="3" rx="1.5" fill="${escapeXml(primaryColor)}"/>
    </svg>
  `;
}

function renderDataThumbnail(
  bgColor: string, primaryColor: string, textColor: string, _textSecondary: string,
  headingFont: string, _bodyFont: string, titleText: string,
): string {
  // Render a simple chart placeholder
  return `
    <svg width="${String(THUMBNAIL_WIDTH)}" height="${String(THUMBNAIL_HEIGHT)}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${escapeXml(bgColor)}"/>
      <text
        x="5%" y="15%"
        font-family="${escapeXml(headingFont)}, Arial, sans-serif"
        font-size="18"
        font-weight="bold"
        fill="${escapeXml(textColor)}"
        dominant-baseline="middle"
      >${escapeXml(truncate(titleText, 40))}</text>
      <!-- Chart placeholder bars -->
      <rect x="10%" y="35%" width="12%" height="45%" fill="${escapeXml(primaryColor)}" opacity="0.8" rx="2"/>
      <rect x="27%" y="45%" width="12%" height="35%" fill="${escapeXml(primaryColor)}" opacity="0.6" rx="2"/>
      <rect x="44%" y="30%" width="12%" height="50%" fill="${escapeXml(primaryColor)}" opacity="0.9" rx="2"/>
      <rect x="61%" y="50%" width="12%" height="30%" fill="${escapeXml(primaryColor)}" opacity="0.5" rx="2"/>
      <rect x="78%" y="38%" width="12%" height="42%" fill="${escapeXml(primaryColor)}" opacity="0.7" rx="2"/>
      <!-- Baseline -->
      <line x1="8%" y1="82%" x2="92%" y2="82%" stroke="${escapeXml(textColor)}" stroke-width="1" opacity="0.2"/>
    </svg>
  `;
}

function renderDefaultThumbnail(
  bgColor: string, primaryColor: string, textColor: string, textSecondary: string,
  headingFont: string, bodyFont: string, titleText: string, subtitleText: string,
): string {
  return `
    <svg width="${String(THUMBNAIL_WIDTH)}" height="${String(THUMBNAIL_HEIGHT)}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${escapeXml(bgColor)}"/>
      <text
        x="50%" y="38%"
        font-family="${escapeXml(headingFont)}, Arial, sans-serif"
        font-size="22"
        font-weight="bold"
        fill="${escapeXml(textColor)}"
        text-anchor="middle"
        dominant-baseline="middle"
      >${escapeXml(truncate(titleText, 40))}</text>
      <text
        x="50%" y="55%"
        font-family="${escapeXml(bodyFont)}, Arial, sans-serif"
        font-size="12"
        fill="${escapeXml(textSecondary)}"
        text-anchor="middle"
        dominant-baseline="middle"
      >${escapeXml(truncate(subtitleText, 60))}</text>
      <rect x="40%" y="68%" width="20%" height="3" rx="1.5" fill="${escapeXml(primaryColor)}"/>
    </svg>
  `;
}

// ============================================================
// Helpers
// ============================================================

function extractTextContent(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!content || typeof content !== 'object') return '';

  const record = content as Record<string, unknown>;

  // Tiptap doc
  if (record['type'] === 'doc' && Array.isArray(record['content'])) {
    const nodes = record['content'] as Array<Record<string, unknown>>;
    return nodes
      .map((node) => {
        if (Array.isArray(node['content'])) {
          return (node['content'] as Array<Record<string, unknown>>)
            .map((child) => (typeof child['text'] === 'string' ? child['text'] : ''))
            .join('');
        }
        return '';
      })
      .join(' ')
      .trim();
  }

  return '';
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}
