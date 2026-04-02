import { NextResponse } from 'next/server';

/**
 * AI API routes — Phase 4 implementation
 * POST /api/ai/generate — Full pipeline: prompt -> outline -> layouts -> content -> theme
 * POST /api/ai/refine — Refine specific section(s) based on user feedback
 * POST /api/ai/suggest-layout — Suggest best layout for given content
 * POST /api/ai/generate-image — Generate image via DALL-E or search Unsplash
 * POST /api/ai/outline-only — Generate outline without full content
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'AI endpoints will be implemented in Phase 4.' },
    { status: 501 },
  );
}
