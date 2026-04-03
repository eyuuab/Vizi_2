/**
 * Asset Processing — Step 5 of the PPTX Pipeline
 *
 * Downloads images, resizes via Sharp, compresses to JPEG,
 * and returns base64-encoded data for embedding in PPTX.
 * Handles missing/failed images with a branded placeholder.
 */

import sharp from 'sharp';

// ============================================================
// Constants
// ============================================================

const MAX_IMAGE_WIDTH = 1920;
const MAX_IMAGE_HEIGHT = 1080;
const JPEG_QUALITY = 85;
const FETCH_TIMEOUT_MS = 15000;

// ============================================================
// Types
// ============================================================

export interface ProcessedImage {
  data: string; // base64-encoded image data with MIME prefix
  width: number;
  height: number;
  mimeType: string;
}

// ============================================================
// Public API
// ============================================================

/**
 * Download and process an image for PPTX embedding.
 * - Fetches the image from a URL
 * - Resizes to fit within MAX_IMAGE_WIDTH x MAX_IMAGE_HEIGHT
 * - Compresses as JPEG at JPEG_QUALITY
 * - Returns base64 data string suitable for PptxGenJS
 *
 * On failure, returns a branded placeholder.
 */
export async function processImage(
  url: string,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  },
): Promise<ProcessedImage> {
  const maxW = options?.maxWidth ?? MAX_IMAGE_WIDTH;
  const maxH = options?.maxHeight ?? MAX_IMAGE_HEIGHT;
  const quality = options?.quality ?? JPEG_QUALITY;

  try {
    const imageBuffer = await fetchImageBuffer(url);
    return await resizeAndCompress(imageBuffer, maxW, maxH, quality);
  } catch (error) {
    console.error(
      `[asset-processor] Failed to process image: ${url}`,
      error instanceof Error ? error.message : String(error),
    );
    return generatePlaceholder(maxW, maxH);
  }
}

/**
 * Process a raw buffer (e.g., from an upload) for PPTX embedding.
 */
export async function processImageBuffer(
  buffer: Buffer,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  },
): Promise<ProcessedImage> {
  const maxW = options?.maxWidth ?? MAX_IMAGE_WIDTH;
  const maxH = options?.maxHeight ?? MAX_IMAGE_HEIGHT;
  const quality = options?.quality ?? JPEG_QUALITY;

  try {
    return await resizeAndCompress(buffer, maxW, maxH, quality);
  } catch {
    return generatePlaceholder(maxW, maxH);
  }
}

// ============================================================
// Image Fetching
// ============================================================

async function fetchImageBuffer(url: string): Promise<Buffer> {
  // Handle data URLs
  if (url.startsWith('data:')) {
    const base64Data = url.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid data URL: no base64 data found');
    }
    return Buffer.from(base64Data, 'base64');
  }

  // Handle relative URLs — cannot fetch server-side without host
  if (url.startsWith('/')) {
    throw new Error(`Cannot fetch relative URL server-side: ${url}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SlideForge-PPTX-Renderer/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${String(response.status)}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
// Image Resizing & Compression
// ============================================================

async function resizeAndCompress(
  buffer: Buffer,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<ProcessedImage> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const originalWidth = metadata.width ?? maxWidth;
  const originalHeight = metadata.height ?? maxHeight;

  // Calculate resize dimensions while maintaining aspect ratio
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (targetWidth > maxWidth) {
    targetHeight = Math.round((maxWidth / targetWidth) * targetHeight);
    targetWidth = maxWidth;
  }
  if (targetHeight > maxHeight) {
    targetWidth = Math.round((maxHeight / targetHeight) * targetWidth);
    targetHeight = maxHeight;
  }

  const processedBuffer = await image
    .resize(targetWidth, targetHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  const base64 = processedBuffer.toString('base64');

  return {
    data: `image/jpeg;base64,${base64}`,
    width: targetWidth,
    height: targetHeight,
    mimeType: 'image/jpeg',
  };
}

// ============================================================
// Placeholder Generation
// ============================================================

/**
 * Generate a branded placeholder image for missing/failed images.
 * Creates a gray rectangle with "Image Unavailable" text overlay.
 */
async function generatePlaceholder(
  width: number,
  height: number,
): Promise<ProcessedImage> {
  // Scale down for placeholder — we do not need full resolution
  const placeholderWidth = Math.min(width, 800);
  const placeholderHeight = Math.min(height, 600);

  const svgPlaceholder = `
    <svg width="${String(placeholderWidth)}" height="${String(placeholderHeight)}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#E2E8F0"/>
      <rect x="10%" y="10%" width="80%" height="80%" fill="#CBD5E1" rx="8"/>
      <text
        x="50%" y="45%"
        font-family="Arial, sans-serif"
        font-size="${String(Math.max(14, Math.round(placeholderWidth / 25)))}"
        fill="#64748B"
        text-anchor="middle"
        dominant-baseline="middle"
      >Image Unavailable</text>
      <text
        x="50%" y="58%"
        font-family="Arial, sans-serif"
        font-size="${String(Math.max(10, Math.round(placeholderWidth / 40)))}"
        fill="#94A3B8"
        text-anchor="middle"
        dominant-baseline="middle"
      >SlideForge AI</text>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svgPlaceholder))
    .jpeg({ quality: 80 })
    .toBuffer();

  const base64 = buffer.toString('base64');

  return {
    data: `image/jpeg;base64,${base64}`,
    width: placeholderWidth,
    height: placeholderHeight,
    mimeType: 'image/jpeg',
  };
}
