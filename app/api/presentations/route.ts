import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CreatePresentationSchema, PaginationParamsSchema } from '@/types/api';
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginatedResponse,
} from '@/types/api';

interface PresentationListItem {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  shareSlug: string | null;
  thumbnail: string | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
  themeId: string;
  _count: { sections: number };
}

const ListQuerySchema = PaginationParamsSchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(['updatedAt', 'createdAt', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  filter: z.enum(['all', 'ai-generated', 'manual']).default('all'),
});

/**
 * GET /api/presentations — List user's presentations (paginated, sortable, searchable)
 */
export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<
    ApiSuccessResponse<PaginatedResponse<PresentationListItem>> | ApiErrorResponse
  >
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        },
        { status: 401 },
      );
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = ListQuerySchema.safeParse(searchParams);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters.',
            details: parsed.error.issues,
          },
        },
        { status: 400 },
      );
    }

    const { page, limit, sortBy, sortOrder, search, filter } = parsed.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = { userId: session.user.id };

    if (search && search.trim().length > 0) {
      where.title = { contains: search.trim(), mode: 'insensitive' };
    }

    if (filter === 'ai-generated') {
      where.metadata = { path: ['aiPrompt'], not: null };
    } else if (filter === 'manual') {
      // Manual presentations have no aiPrompt in metadata
      where.OR = [{ metadata: null }, { metadata: { path: ['aiPrompt'], equals: null } }];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereInput = where as any;

    const [items, total] = await Promise.all([
      prisma.presentation.findMany({
        where: whereInput,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          isPublic: true,
          shareSlug: true,
          thumbnail: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          themeId: true,
          _count: { select: { sections: true } },
        },
      }) as unknown as PresentationListItem[],
      prisma.presentation.count({
        where: whereInput,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: { items, total, page, limit, totalPages },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 },
    );
  }
}

/**
 * POST /api/presentations — Create a new presentation
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiSuccessResponse<unknown> | ApiErrorResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const parsed = CreatePresentationSchema.safeParse(body);

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

    // If no themeId provided, find the first preset theme
    let themeId = parsed.data.themeId;
    if (!themeId) {
      const defaultTheme = await prisma.theme.findFirst({
        where: { isPreset: true },
        select: { id: true },
      });
      if (!defaultTheme) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NO_DEFAULT_THEME',
              message:
                'No default theme found. Please seed the database with themes first.',
            },
          },
          { status: 500 },
        );
      }
      themeId = defaultTheme.id;
    }

    const presentation = await prisma.presentation.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        userId: session.user.id,
        themeId,
      },
      include: {
        sections: true,
        theme: true,
      },
    });

    return NextResponse.json(
      { success: true, data: presentation },
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
