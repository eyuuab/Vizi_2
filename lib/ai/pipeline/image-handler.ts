/**
 * Step 4 — Image Handling
 * For IMAGE slots, searches Unsplash API or generates AI image descriptions.
 * Returns image URLs for each image slot.
 */

import type { ImageResult } from '@/types/ai';
import { ImageResultSchema } from '@/types/ai';
import type { SectionContentGenerated } from '@/types/ai';
import type { LayoutTemplate } from '@/types/layout';
import { getLayout } from '@/lib/layouts';

/** Unsplash API base URL */
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  width: number;
  height: number;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
}

/**
 * Process all image slots across generated sections.
 * For each IMAGE slot, search for or generate an image.
 * Returns sections with image URLs filled in.
 */
export async function processImageSlots(
  sections: SectionContentGenerated[],
): Promise<SectionContentGenerated[]> {
  const results: SectionContentGenerated[] = [];

  for (const section of sections) {
    let layout: LayoutTemplate;
    try {
      layout = getLayout(section.layoutId);
    } catch {
      results.push(section);
      continue;
    }

    const updatedContent: Record<string, unknown> = { ...section.content };

    for (const slot of layout.slots) {
      if (slot.type !== 'IMAGE') continue;

      const currentValue = updatedContent[slot.id];
      if (typeof currentValue !== 'string' || currentValue.length === 0) continue;

      // The current value should be a search query from the content generator
      try {
        const image = await searchImage(currentValue, slot.constraints?.aspectRatio);
        if (image) {
          updatedContent[slot.id] = image.url;
        }
        // If search fails, keep the original search query as placeholder
      } catch {
        // Keep the original value — the editor can handle image search later
      }
    }

    results.push({
      ...section,
      content: updatedContent,
    });
  }

  return results;
}

/**
 * Search for an image using the Unsplash API.
 * Falls back to a placeholder if the API key is not configured.
 */
export async function searchImage(
  query: string,
  aspectRatio?: string,
): Promise<ImageResult | null> {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!apiKey) {
    // Return a placeholder image when Unsplash is not configured
    return generatePlaceholderImage(query, aspectRatio);
  }

  try {
    const orientation = mapAspectRatioToOrientation(aspectRatio);
    const params = new URLSearchParams({
      query,
      per_page: '1',
      content_filter: 'high',
    });

    if (orientation) {
      params.set('orientation', orientation);
    }

    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${apiKey}`,
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      return generatePlaceholderImage(query, aspectRatio);
    }

    const data = (await response.json()) as UnsplashSearchResponse;
    const photo = data.results[0];

    if (!photo) {
      return generatePlaceholderImage(query, aspectRatio);
    }

    const result: ImageResult = {
      url: photo.urls.regular,
      alt: photo.alt_description ?? query,
      attribution: `Photo by ${photo.user.name} on Unsplash`,
      width: photo.width,
      height: photo.height,
    };

    // Validate the result
    return ImageResultSchema.parse(result);
  } catch {
    return generatePlaceholderImage(query, aspectRatio);
  }
}

/**
 * Generate a placeholder image URL using a placeholder service.
 * Used when Unsplash API is not available.
 */
function generatePlaceholderImage(
  query: string,
  aspectRatio?: string,
): ImageResult {
  const { width, height } = parseDimensions(aspectRatio);
  const encodedText = encodeURIComponent(query.slice(0, 30));

  return {
    url: `https://placehold.co/${String(width)}x${String(height)}/1a1a2e/eaeaea?text=${encodedText}`,
    alt: query,
    attribution: 'Placeholder image',
    width,
    height,
  };
}

/**
 * Map an aspect ratio string to Unsplash orientation parameter.
 */
function mapAspectRatioToOrientation(
  aspectRatio?: string,
): string | undefined {
  if (!aspectRatio) return undefined;

  const parts = aspectRatio.split(':');
  const w = Number(parts[0]);
  const h = Number(parts[1]);

  if (isNaN(w) || isNaN(h)) return undefined;

  if (w > h) return 'landscape';
  if (h > w) return 'portrait';
  return 'squarish';
}

/**
 * Parse dimensions from an aspect ratio string.
 */
function parseDimensions(aspectRatio?: string): { width: number; height: number } {
  if (!aspectRatio) {
    return { width: 800, height: 600 };
  }

  const parts = aspectRatio.split(':');
  const w = Number(parts[0]);
  const h = Number(parts[1]);

  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
    return { width: 800, height: 600 };
  }

  // Scale to reasonable dimensions
  const scale = 800 / Math.max(w, h);
  return {
    width: Math.round(w * scale),
    height: Math.round(h * scale),
  };
}
