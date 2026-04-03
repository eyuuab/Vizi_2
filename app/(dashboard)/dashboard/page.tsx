import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Sparkles, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { CreatePresentationDialog } from '@/components/dashboard/create-presentation-dialog';
import type { PresentationCardData } from '@/components/dashboard/presentation-card';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your presentations.',
};

interface DashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const params = await searchParams;

  const search = typeof params.search === 'string' ? params.search : '';
  const sortRaw = typeof params.sort === 'string' ? params.sort : 'updatedAt-desc';
  const filter = typeof params.filter === 'string' ? params.filter : 'all';
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10) || 1) : 1;
  const limit = 20;

  // Parse sort
  let sortBy: 'updatedAt' | 'createdAt' | 'title' = 'updatedAt';
  let sortOrder: 'asc' | 'desc' = 'desc';
  if (sortRaw === 'updatedAt-asc') {
    sortBy = 'updatedAt';
    sortOrder = 'asc';
  } else if (sortRaw === 'createdAt-desc') {
    sortBy = 'createdAt';
    sortOrder = 'desc';
  } else if (sortRaw === 'title-asc') {
    sortBy = 'title';
    sortOrder = 'asc';
  }

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { userId: session.user.id };

  if (search.trim()) {
    where.title = { contains: search.trim(), mode: 'insensitive' };
  }

  if (filter === 'ai-generated') {
    where.metadata = { path: ['aiPrompt'], not: null };
  } else if (filter === 'manual') {
    where.OR = [{ metadata: null }, { metadata: { path: ['aiPrompt'], equals: null } }];
  }

  let presentations: PresentationCardData[] = [];
  let total = 0;

  try {
    const [items, count] = await Promise.all([
      prisma.presentation.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          isPublic: true,
          shareSlug: true,
          thumbnail: true,
          updatedAt: true,
          _count: { select: { sections: true } },
        },
      }),
      prisma.presentation.count({ where }),
    ]);

    presentations = items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      isPublic: item.isPublic,
      shareSlug: item.shareSlug,
      thumbnail: item.thumbnail,
      updatedAt: item.updatedAt.toISOString(),
      sectionCount: item._count.sections,
    }));
    total = count;
  } catch {
    // Database might not be available yet
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Presentations</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your presentations
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/templates">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              From Template
            </Button>
          </Link>
          <CreatePresentationDialog
            trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Presentation
              </Button>
            }
          />
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        {presentations.length === 0 && !search && filter === 'all' ? (
          <EmptyState />
        ) : presentations.length === 0 ? (
          <NoResults search={search} />
        ) : (
          <DashboardContent
            presentations={presentations}
            totalPages={totalPages}
            currentPage={page}
          />
        )}
      </Suspense>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-16 text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <FolderOpen className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No presentations yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Get started by creating a new presentation from scratch, using a template, or
        generating one with AI.
      </p>
      <div className="flex gap-3">
        <Link href="/dashboard/templates">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Browse Templates
          </Button>
        </Link>
        <CreatePresentationDialog
          trigger={
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              Create Your First Presentation
            </Button>
          }
        />
      </div>
    </div>
  );
}

function NoResults({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-16 text-center">
      <FileText className="h-10 w-10 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">No results found</h2>
      <p className="text-muted-foreground max-w-md">
        {search
          ? `No presentations matching "${search}". Try a different search term.`
          : 'No presentations match the current filter.'}
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1 max-w-md" />
        <Skeleton className="h-10 w-[140px]" />
        <Skeleton className="h-10 w-[170px]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
