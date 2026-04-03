/**
 * Content Renderer — Step 4 of the PPTX Pipeline
 *
 * For each mapped shape, renders content into the appropriate PptxGenJS shape:
 * - textbox → text runs via Tiptap converter or plain text
 * - image → fetched, resized, embedded
 * - chart → PptxGenJS native chart API
 * - table → PptxGenJS table rows
 * - shape → stat cards, custom shapes
 */

import type PptxGenJS from 'pptxgenjs';
import type { MappedShape } from './shape-mapper';
import { applyShapeStyle } from './shape-mapper';
import type { PptxResolvedTheme } from './theme-resolver';
import { convertTiptapToPptx, plainTextToPptx } from './tiptap-converter';
import { processImage } from './asset-processor';

// ============================================================
// Chart Data Types
// ============================================================

interface ChartDataset {
  label?: string;
  name?: string;
  data: number[];
}

interface ChartContent {
  type: string;
  labels?: string[];
  datasets?: ChartDataset[];
}

// ============================================================
// Table Data Types
// ============================================================

interface TableContent {
  headers?: string[];
  rows?: string[][];
}

// ============================================================
// Stats Data Types
// ============================================================

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

// ============================================================
// Public API
// ============================================================

/**
 * Render all mapped shapes onto a PptxGenJS slide.
 */
export async function renderShapesToSlide(
  slide: PptxGenJS.Slide,
  shapes: MappedShape[],
  theme: PptxResolvedTheme,
  options?: { includeNotes?: boolean; notes?: string | null },
): Promise<void> {
  for (const shape of shapes) {
    try {
      await renderShape(slide, shape, theme);
    } catch (error) {
      console.error(
        `[content-renderer] Failed to render shape ${shape.slotId}:`,
        error instanceof Error ? error.message : String(error),
      );
      // Render a fallback text box indicating the error
      renderFallbackShape(slide, shape, theme);
    }
  }

  // Add speaker notes if requested
  if (options?.includeNotes && options.notes) {
    slide.addNotes(options.notes);
  }
}

// ============================================================
// Shape Rendering Dispatch
// ============================================================

async function renderShape(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): Promise<void> {
  switch (shape.shapeType) {
    case 'textbox':
      renderTextbox(slide, shape, theme);
      break;
    case 'image':
      await renderImage(slide, shape, theme);
      break;
    case 'chart':
      renderChart(slide, shape, theme);
      break;
    case 'table':
      renderTable(slide, shape, theme);
      break;
    case 'shape':
      renderCustomShape(slide, shape, theme);
      break;
  }
}

// ============================================================
// Textbox Rendering
// ============================================================

function renderTextbox(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): void {
  const content = shape.content;
  let textRuns: PptxGenJS.TextProps[];

  // Determine font and size based on slot type
  const isHeading = shape.slotType === 'HEADING';
  const defaultFontFace = isHeading ? theme.fonts.heading : theme.fonts.body;
  const defaultFontSize = isHeading
    ? theme.fontSizes['2xl']
    : theme.fontSizes.base;
  const defaultColor = isHeading
    ? theme.colors.textPrimary
    : theme.colors.textPrimary;

  if (typeof content === 'string') {
    textRuns = plainTextToPptx(content, {
      fonts: theme.fonts,
      fontSizes: theme.fontSizes,
      color: defaultColor,
      bold: isHeading,
      fontSize: defaultFontSize,
      fontFace: defaultFontFace,
    });
  } else if (typeof content === 'object' && content !== null) {
    // Check if it looks like Tiptap JSON (has a 'type' field)
    const record = content as Record<string, unknown>;
    if ('type' in record) {
      textRuns = convertTiptapToPptx(content, {
        fonts: theme.fonts,
        fontSizes: theme.fontSizes,
        defaultColor,
        headingColor: theme.colors.textPrimary,
        accentColor: theme.colors.accent,
      });
    } else {
      // Fallback: stringify the object
      textRuns = plainTextToPptx(JSON.stringify(content), {
        fonts: theme.fonts,
        fontSizes: theme.fontSizes,
        color: defaultColor,
      });
    }
  } else {
    return; // No content to render
  }

  if (textRuns.length === 0) return;

  const textOptions: PptxGenJS.TextPropsOptions = {
    x: shape.position.x,
    y: shape.position.y,
    w: shape.position.w,
    h: shape.position.h,
    fontFace: defaultFontFace,
    fontSize: defaultFontSize,
    color: defaultColor,
    valign: isHeading ? 'middle' : 'top',
    wrap: true,
    fit: 'shrink',
  };

  applyShapeStyle(
    textOptions as unknown as Record<string, unknown>,
    shape.style,
    theme,
  );

  slide.addText(textRuns, textOptions);
}

// ============================================================
// Image Rendering
// ============================================================

async function renderImage(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): Promise<void> {
  const imageUrl = typeof shape.content === 'string' ? shape.content : '';
  if (!imageUrl) return;

  const processed = await processImage(imageUrl);

  const imageOptions: PptxGenJS.ImageProps = {
    data: processed.data,
    x: shape.position.x,
    y: shape.position.y,
    w: shape.position.w,
    h: shape.position.h,
    sizing: {
      type: 'cover',
      w: shape.position.w,
      h: shape.position.h,
    },
  };

  if (shape.style.rotation !== undefined) {
    imageOptions.rotate = shape.style.rotation;
  }

  if (shape.style.shadow) {
    imageOptions.shadow = {
      type: 'outer',
      color: '000000',
      opacity: 0.23,
      blur: 6,
      offset: 3,
      angle: 270,
    };
  }

  void theme; // theme used for consistency
  slide.addImage(imageOptions);
}

// ============================================================
// Chart Rendering
// ============================================================

function renderChart(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): void {
  const content = shape.content as ChartContent | null;
  if (!content || typeof content !== 'object') return;

  const chartType = resolveChartType(content.type);
  const labels = content.labels ?? [];
  const datasets = content.datasets ?? [];

  if (datasets.length === 0) return;

  const chartData: PptxGenJS.OptsChartData[] = datasets.map((ds) => ({
    name: ds.label ?? ds.name ?? 'Series',
    labels,
    values: ds.data,
  }));

  const chartColors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    theme.colors.surface,
  ];

  const chartOpts: PptxGenJS.IChartOpts = {
    x: shape.position.x,
    y: shape.position.y,
    w: shape.position.w,
    h: shape.position.h,
    showLegend: datasets.length > 1,
    legendPos: 'b',
    legendFontSize: theme.fontSizes.sm,
    legendColor: theme.colors.textSecondary,
    showTitle: false,
    chartColors,
    valGridLine: { style: 'dash', color: theme.colors.border },
  };

  slide.addChart(chartType, chartData, chartOpts);
}

function resolveChartType(type: string): PptxGenJS.CHART_NAME {
  const typeMap: Record<string, PptxGenJS.CHART_NAME> = {
    bar: 'bar',
    line: 'line',
    pie: 'pie',
    doughnut: 'doughnut',
    area: 'area',
    scatter: 'scatter',
    radar: 'radar',
  };
  return typeMap[type.toLowerCase()] ?? 'bar';
}

// ============================================================
// Table Rendering
// ============================================================

function renderTable(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): void {
  const content = shape.content as TableContent | null;
  if (!content || typeof content !== 'object') return;

  const headers = content.headers ?? [];
  const rows = content.rows ?? [];

  if (headers.length === 0 && rows.length === 0) return;

  const tableRows: PptxGenJS.TableRow[] = [];

  // Header row
  if (headers.length > 0) {
    const headerRow: PptxGenJS.TableCell[] = headers.map((header) => ({
      text: header,
      options: {
        bold: true,
        fontSize: theme.fontSizes.sm,
        fontFace: theme.fonts.heading,
        color: theme.colors.textOnPrimary,
        fill: { color: theme.colors.primary },
        border: { color: theme.colors.border, pt: 0.5 },
        valign: 'middle' as const,
        align: 'center' as const,
        margin: [4, 6, 4, 6] as [number, number, number, number],
      },
    }));
    tableRows.push(headerRow);
  }

  // Data rows
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    if (!row) continue;

    const isEvenRow = rowIndex % 2 === 0;
    const rowFill = isEvenRow ? theme.colors.surface : theme.colors.background;

    const tableRow: PptxGenJS.TableCell[] = row.map((cell) => ({
      text: cell,
      options: {
        fontSize: theme.fontSizes.sm,
        fontFace: theme.fonts.body,
        color: theme.colors.textPrimary,
        fill: { color: rowFill },
        border: { color: theme.colors.border, pt: 0.5 },
        valign: 'middle' as const,
        margin: [3, 6, 3, 6] as [number, number, number, number],
      },
    }));
    tableRows.push(tableRow);
  }

  const colCount = Math.max(
    headers.length,
    rows[0]?.length ?? 1,
  );
  const colWidth = shape.position.w / colCount;

  const tableOptions: PptxGenJS.TableProps = {
    x: shape.position.x,
    y: shape.position.y,
    w: shape.position.w,
    colW: Array.from({ length: colCount }, () => colWidth),
    fontSize: theme.fontSizes.sm,
    fontFace: theme.fonts.body,
    border: { color: theme.colors.border, pt: 0.5 },
  };

  slide.addTable(tableRows, tableOptions);
}

// ============================================================
// Custom Shape (Stats cards, etc.)
// ============================================================

function renderCustomShape(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): void {
  // For STATS slot type, render stat cards
  if (shape.slotType === 'STATS') {
    renderStatCards(slide, shape, theme);
    return;
  }

  // For LIST slot type, render as a text list
  if (shape.slotType === 'LIST') {
    renderListShape(slide, shape, theme);
    return;
  }

  // Generic shape: render as textbox with content
  renderTextbox(slide, shape, theme);
}

function renderStatCards(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): void {
  const stats = shape.content as StatItem[] | null;
  if (!Array.isArray(stats) || stats.length === 0) return;

  const cardCount = Math.min(stats.length, 4);
  const totalWidth = shape.position.w;
  const gap = 0.2; // inches between cards
  const cardWidth = (totalWidth - gap * (cardCount - 1)) / cardCount;
  const cardHeight = shape.position.h;

  for (let i = 0; i < cardCount; i++) {
    const stat = stats[i];
    if (!stat) continue;

    const cardX = shape.position.x + i * (cardWidth + gap);

    // Card background
    slide.addShape('rect', {
      x: cardX,
      y: shape.position.y,
      w: cardWidth,
      h: cardHeight,
      fill: { color: theme.colors.surface },
      line: { color: theme.colors.border, width: 1 },
      rectRadius: 0.05,
    });

    // Stat value (large number)
    slide.addText(stat.value, {
      x: cardX,
      y: shape.position.y + cardHeight * 0.1,
      w: cardWidth,
      h: cardHeight * 0.4,
      align: 'center',
      valign: 'bottom',
      fontFace: theme.fonts.heading,
      fontSize: theme.fontSizes['3xl'],
      color: theme.colors.primary,
      bold: true,
    });

    // Stat label
    slide.addText(stat.label, {
      x: cardX,
      y: shape.position.y + cardHeight * 0.52,
      w: cardWidth,
      h: cardHeight * 0.22,
      align: 'center',
      valign: 'top',
      fontFace: theme.fonts.body,
      fontSize: theme.fontSizes.base,
      color: theme.colors.textPrimary,
      bold: true,
    });

    // Stat description (if present)
    if (stat.description) {
      slide.addText(stat.description, {
        x: cardX,
        y: shape.position.y + cardHeight * 0.72,
        w: cardWidth,
        h: cardHeight * 0.22,
        align: 'center',
        valign: 'top',
        fontFace: theme.fonts.body,
        fontSize: theme.fontSizes.xs,
        color: theme.colors.textSecondary,
      });
    }
  }
}

function renderListShape(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): void {
  const items = shape.content as string[] | null;
  if (!Array.isArray(items)) {
    renderTextbox(slide, shape, theme);
    return;
  }

  const textRuns: PptxGenJS.TextProps[] = items.map((item, index) => ({
    text: typeof item === 'string' ? item : String(item),
    options: {
      bullet: { type: 'bullet' as const },
      fontFace: theme.fonts.body,
      fontSize: theme.fontSizes.base,
      color: theme.colors.textPrimary,
      breakLine: index < items.length - 1,
    },
  }));

  slide.addText(textRuns, {
    x: shape.position.x,
    y: shape.position.y,
    w: shape.position.w,
    h: shape.position.h,
    valign: 'top',
    wrap: true,
  });
}

// ============================================================
// Fallback Shape
// ============================================================

function renderFallbackShape(
  slide: PptxGenJS.Slide,
  shape: MappedShape,
  theme: PptxResolvedTheme,
): void {
  slide.addText(`[Content unavailable: ${shape.slotId}]`, {
    x: shape.position.x,
    y: shape.position.y,
    w: shape.position.w,
    h: shape.position.h,
    fontFace: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    italic: true,
    valign: 'middle',
    align: 'center',
  });
}
