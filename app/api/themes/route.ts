import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { ThemeTokensSchema } from '@/types/theme';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

/**
 * GET /api/themes — List available themes (presets + user custom)
 */
export async function GET(
  _request: NextRequest,
): Promise<NextResponse<ApiSuccessResponse<unknown[]> | ApiErrorResponse>> {
  try {
    const { userId } = await auth();

    // Presets are always available; user themes require auth
    const where = userId
      ? { OR: [{ isPreset: true }, { clerkUserId: userId }] }
      : { isPreset: true };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const themes = await prisma.theme.findMany({
      where: where as any,
      orderBy: [{ isPreset: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        isPreset: true,
        tokens: true,
        preview: true,
        clerkUserId: true,
      },
    });

    return NextResponse.json({ success: true, data: themes });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}

const CreateThemeSchema = z.object({
  name: z.string().min(1).max(200),
  tokens: ThemeTokensSchema,
  preview: z.string().optional(),
});

/**
 * POST /api/themes — Create a custom theme
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiSuccessResponse<unknown> | ApiErrorResponse>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const parsed = CreateThemeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body.',
            details: parsed.error.issues,
          },
        },
        { status: 400 },
      );
    }

    const theme = await prisma.theme.create({
      data: {
        name: parsed.data.name,
        clerkUserId: userId,
        isPreset: false,
        tokens: JSON.parse(JSON.stringify(parsed.data.tokens)),
        preview: parsed.data.preview ?? null,
      },
    });

    return NextResponse.json(
      { success: true, data: theme },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}
