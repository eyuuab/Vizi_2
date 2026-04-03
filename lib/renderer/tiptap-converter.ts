/**
 * Tiptap-to-PPTX Converter — Section 9.3
 *
 * Recursively converts Tiptap JSON content into PptxGenJS TextProps arrays.
 * Handles: paragraphs, text, headings, bullet lists, ordered lists,
 * code blocks, links, bold, italic, underline, strike, color, fontSize.
 */

import type PptxGenJS from 'pptxgenjs';
import type { PptxFonts, PptxFontSizes } from './theme-resolver';

// ============================================================
// Tiptap JSON Types (strict subset we handle)
// ============================================================

interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
  attrs?: Record<string, unknown>;
}

interface TiptapDocument {
  type: 'doc';
  content?: TiptapNode[];
}

// ============================================================
// Conversion Context
// ============================================================

interface ConversionContext {
  fonts: PptxFonts;
  fontSizes: PptxFontSizes;
  defaultColor: string;
  headingColor: string;
  accentColor: string;
}

// ============================================================
// Public API
// ============================================================

/**
 * Convert Tiptap JSON document to PptxGenJS TextProps array.
 * If the input is a plain string, wraps it as a single text run.
 */
export function convertTiptapToPptx(
  content: unknown,
  context: ConversionContext,
): PptxGenJS.TextProps[] {
  // Handle plain string content
  if (typeof content === 'string') {
    return [
      {
        text: content,
        options: {
          fontFace: context.fonts.body,
          fontSize: context.fontSizes.base,
          color: context.defaultColor,
        },
      },
    ];
  }

  // Handle null/undefined
  if (!content || typeof content !== 'object') {
    return [];
  }

  const doc = content as TiptapDocument;

  // Handle doc wrapper
  if (doc.type === 'doc' && Array.isArray(doc.content)) {
    return convertNodes(doc.content, context, 0);
  }

  // Handle a single node (not wrapped in doc)
  if ('type' in doc) {
    return convertNodes([doc as TiptapNode], context, 0);
  }

  return [];
}

// ============================================================
// Node Conversion
// ============================================================

function convertNodes(
  nodes: TiptapNode[],
  ctx: ConversionContext,
  indentLevel: number,
): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;

    const nodeRuns = convertNode(node, ctx, indentLevel);
    runs.push(...nodeRuns);

    // Add line break between block-level elements (except the last one)
    if (i < nodes.length - 1 && isBlockNode(node)) {
      // The break is typically included in the last run via breakLine
    }
  }

  return runs;
}

function convertNode(
  node: TiptapNode,
  ctx: ConversionContext,
  indentLevel: number,
): PptxGenJS.TextProps[] {
  switch (node.type) {
    case 'paragraph':
      return convertParagraph(node, ctx, indentLevel);
    case 'heading':
      return convertHeading(node, ctx);
    case 'bulletList':
      return convertBulletList(node, ctx, indentLevel);
    case 'orderedList':
      return convertOrderedList(node, ctx, indentLevel);
    case 'listItem':
      return convertListItem(node, ctx, indentLevel);
    case 'codeBlock':
      return convertCodeBlock(node, ctx);
    case 'blockquote':
      return convertBlockquote(node, ctx, indentLevel);
    case 'hardBreak':
      return [{ text: '', options: { breakLine: true } }];
    case 'text':
      return convertTextNode(node, ctx);
    default:
      // For unknown block nodes with content, recurse
      if (node.content) {
        return convertNodes(node.content, ctx, indentLevel);
      }
      return [];
  }
}

function isBlockNode(node: TiptapNode): boolean {
  return [
    'paragraph',
    'heading',
    'bulletList',
    'orderedList',
    'codeBlock',
    'blockquote',
  ].includes(node.type);
}

// ============================================================
// Paragraph
// ============================================================

function convertParagraph(
  node: TiptapNode,
  ctx: ConversionContext,
  _indentLevel: number,
): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = [];

  if (node.content && node.content.length > 0) {
    const inlineRuns = convertInlineContent(node.content, ctx);
    // Mark the last run with breakLine for paragraph separation
    if (inlineRuns.length > 0) {
      const lastRun = inlineRuns[inlineRuns.length - 1];
      if (lastRun) {
        lastRun.options = {
          ...lastRun.options,
          breakLine: true,
        };
      }
    }
    runs.push(...inlineRuns);
  } else {
    // Empty paragraph = blank line
    runs.push({
      text: '',
      options: {
        breakLine: true,
        fontSize: context_fontSize(ctx, 'base'),
      },
    });
  }

  return runs;
}

// ============================================================
// Heading
// ============================================================

function convertHeading(
  node: TiptapNode,
  ctx: ConversionContext,
): PptxGenJS.TextProps[] {
  const level = (node.attrs?.['level'] as number) ?? 1;
  const fontSize = headingFontSize(level, ctx);

  const runs: PptxGenJS.TextProps[] = [];

  if (node.content) {
    for (const child of node.content) {
      if (child.type === 'text') {
        runs.push({
          text: child.text ?? '',
          options: {
            bold: true,
            fontSize,
            fontFace: ctx.fonts.heading,
            color: ctx.headingColor,
            breakLine: false,
          },
        });
      }
    }
  }

  // Add break after heading
  if (runs.length > 0) {
    const lastRun = runs[runs.length - 1];
    if (lastRun) {
      lastRun.options = { ...lastRun.options, breakLine: true };
    }
  }

  return runs;
}

function headingFontSize(level: number, ctx: ConversionContext): number {
  switch (level) {
    case 1:
      return ctx.fontSizes['4xl'];
    case 2:
      return ctx.fontSizes['3xl'];
    case 3:
      return ctx.fontSizes['2xl'];
    case 4:
      return ctx.fontSizes.xl;
    case 5:
      return ctx.fontSizes.lg;
    default:
      return ctx.fontSizes.base;
  }
}

// ============================================================
// Lists
// ============================================================

function convertBulletList(
  node: TiptapNode,
  ctx: ConversionContext,
  indentLevel: number,
): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = [];
  if (!node.content) return runs;

  for (const listItem of node.content) {
    if (listItem.type !== 'listItem') continue;
    const itemRuns = convertListItemContent(listItem, ctx, indentLevel, 'bullet');
    runs.push(...itemRuns);
  }

  return runs;
}

function convertOrderedList(
  node: TiptapNode,
  ctx: ConversionContext,
  indentLevel: number,
): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = [];
  if (!node.content) return runs;

  for (const listItem of node.content) {
    if (listItem.type !== 'listItem') continue;
    const itemRuns = convertListItemContent(listItem, ctx, indentLevel, 'number');
    runs.push(...itemRuns);
  }

  return runs;
}

function convertListItem(
  node: TiptapNode,
  ctx: ConversionContext,
  indentLevel: number,
): PptxGenJS.TextProps[] {
  return convertListItemContent(node, ctx, indentLevel, 'bullet');
}

function convertListItemContent(
  listItem: TiptapNode,
  ctx: ConversionContext,
  indentLevel: number,
  bulletType: 'bullet' | 'number',
): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = [];

  if (!listItem.content) return runs;

  for (const child of listItem.content) {
    if (child.type === 'paragraph') {
      const inlineRuns = child.content
        ? convertInlineContent(child.content, ctx)
        : [];

      // Apply bullet to the first run of each paragraph
      if (inlineRuns.length > 0) {
        const firstRun = inlineRuns[0];
        if (firstRun) {
          firstRun.options = {
            ...firstRun.options,
            bullet: bulletType === 'number'
              ? { type: 'number', indent: 18 }
              : { type: 'bullet', indent: 18 },
            indentLevel,
          };
        }
        const lastRun = inlineRuns[inlineRuns.length - 1];
        if (lastRun) {
          lastRun.options = { ...lastRun.options, breakLine: true };
        }
        runs.push(...inlineRuns);
      }
    } else if (child.type === 'bulletList') {
      runs.push(...convertBulletList(child, ctx, indentLevel + 1));
    } else if (child.type === 'orderedList') {
      runs.push(...convertOrderedList(child, ctx, indentLevel + 1));
    }
  }

  return runs;
}

// ============================================================
// Code Block
// ============================================================

function convertCodeBlock(
  node: TiptapNode,
  ctx: ConversionContext,
): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = [];

  if (node.content) {
    for (const child of node.content) {
      if (child.type === 'text') {
        runs.push({
          text: child.text ?? '',
          options: {
            fontFace: ctx.fonts.mono,
            fontSize: ctx.fontSizes.sm,
            color: ctx.defaultColor,
            breakLine: true,
          },
        });
      }
    }
  }

  return runs;
}

// ============================================================
// Blockquote
// ============================================================

function convertBlockquote(
  node: TiptapNode,
  ctx: ConversionContext,
  indentLevel: number,
): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = [];
  if (!node.content) return runs;

  for (const child of node.content) {
    const childRuns = convertNode(child, ctx, indentLevel + 1);
    for (const run of childRuns) {
      run.options = {
        ...run.options,
        italic: true,
        color: ctx.accentColor,
        indentLevel: indentLevel + 1,
      };
    }
    runs.push(...childRuns);
  }

  return runs;
}

// ============================================================
// Inline Content
// ============================================================

function convertInlineContent(
  nodes: TiptapNode[],
  ctx: ConversionContext,
): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = [];

  for (const node of nodes) {
    if (node.type === 'text') {
      runs.push(...convertTextNode(node, ctx));
    } else if (node.type === 'hardBreak') {
      runs.push({ text: '', options: { breakLine: true } });
    } else if (node.content) {
      // Recurse for inline nodes with content (like mentions, etc.)
      runs.push(...convertInlineContent(node.content, ctx));
    }
  }

  return runs;
}

// ============================================================
// Text Node with Marks
// ============================================================

function convertTextNode(
  node: TiptapNode,
  ctx: ConversionContext,
): PptxGenJS.TextProps[] {
  const text = node.text ?? '';
  const options: PptxGenJS.TextPropsOptions = {
    fontFace: ctx.fonts.body,
    fontSize: context_fontSize(ctx, 'base'),
    color: ctx.defaultColor,
  };

  if (node.marks) {
    for (const mark of node.marks) {
      applyMark(mark, options);
    }
  }

  return [{ text, options }];
}

function applyMark(
  mark: TiptapMark,
  options: PptxGenJS.TextPropsOptions,
): void {
  switch (mark.type) {
    case 'bold':
      options.bold = true;
      break;
    case 'italic':
      options.italic = true;
      break;
    case 'underline':
      options.underline = { style: 'sng' };
      break;
    case 'strike':
      options.strike = 'sngStrike';
      break;
    case 'code':
      // Inline code: use mono font
      options.fontFace = undefined; // Will be overridden
      break;
    case 'link': {
      const href = mark.attrs?.['href'];
      if (typeof href === 'string') {
        options.hyperlink = { url: href };
      }
      break;
    }
    case 'textStyle': {
      const color = mark.attrs?.['color'];
      if (typeof color === 'string') {
        // Strip '#' for PptxGenJS
        options.color = color.startsWith('#') ? color.slice(1) : color;
      }
      break;
    }
    case 'highlight': {
      const highlightColor = mark.attrs?.['color'];
      if (typeof highlightColor === 'string') {
        options.highlight = highlightColor.startsWith('#')
          ? highlightColor.slice(1)
          : highlightColor;
      }
      break;
    }
    default:
      break;
  }
}

// ============================================================
// Helpers
// ============================================================

function context_fontSize(
  ctx: ConversionContext,
  size: keyof PptxFontSizes,
): number {
  return ctx.fontSizes[size];
}

/**
 * Convert plain text (with newlines) to PptxGenJS TextProps.
 * Useful when content is stored as a simple string rather than Tiptap JSON.
 */
export function plainTextToPptx(
  text: string,
  options: {
    fonts: PptxFonts;
    fontSizes: PptxFontSizes;
    color: string;
    bold?: boolean;
    fontSize?: number;
    fontFace?: string;
    align?: 'left' | 'center' | 'right';
  },
): PptxGenJS.TextProps[] {
  const lines = text.split('\n');
  const runs: PptxGenJS.TextProps[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    runs.push({
      text: line,
      options: {
        fontFace: options.fontFace ?? options.fonts.body,
        fontSize: options.fontSize ?? options.fontSizes.base,
        color: options.color,
        bold: options.bold,
        align: options.align,
        breakLine: i < lines.length - 1,
      },
    });
  }

  return runs;
}
