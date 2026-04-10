import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { GenerateImageRequestSchema } from '@/types/ai';
import { searchImage } from '@/lib/ai/pipeline';
import {
  authenticateRequest,
  checkAndEnforceRateLimit,
  recordCreditUsage,
} from '@/lib/ai/auth-helpers';

/**
 * POST /api/ai/generate-image
 * Searches for or generates an image based on a description.
 * Currently uses Unsplash search with placeholder fallback.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Authenticate — allow unauthenticated for image search (low cost)
  let userId = 'anonymous';
  const authResult = await authenticateRequest();
  if (authResult.ok) {
    userId = authResult.userId;

    // Rate limit only for authenticated users
    const rateLimitResult = await checkAndEnforceRateLimit(userId, 'generate_image');
    if (!rateLimitResult.ok) {
      return rateLimitResult.response;
    }
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const parseResult = GenerateImageRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: parseResult.error.issues,
        },
      },
      { status: 400 },
    );
  }

  const { description, style } = parseResult.data;

  try {
    const query = style ? `${description} ${style}` : description;
    const image = await searchImage(query);

    if (!image) {
      return NextResponse.json(
        { success: false, error: { code: 'IMAGE_NOT_FOUND', message: 'No images found for the description' } },
        { status: 404 },
      );
    }

    if (userId !== 'anonymous') {
      void recordCreditUsage(userId, 'generate_image');
    }

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image generation failed';
    return NextResponse.json(
      { success: false, error: { code: 'IMAGE_ERROR', message } },
      { status: 500 },
    );
  }
}
