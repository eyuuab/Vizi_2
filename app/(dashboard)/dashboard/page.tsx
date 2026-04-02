import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your presentations.',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  let presentations: {
    id: string;
    title: string;
    description: string | null;
    updatedAt: Date;
    thumbnail: string | null;
    _count: { sections: number };
  }[] = [];

  try {
    presentations = await prisma.presentation.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        updatedAt: true,
        thumbnail: true,
        _count: { select: { sections: true } },
      },
    });
  } catch {
    // Database might not be available yet during development
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Presentations</h1>
          <p className="text-muted-foreground mt-1">Create and manage your presentations</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/templates">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              From Template
            </Button>
          </Link>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Blank Presentation
          </Button>
        </div>
      </div>

      {presentations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No presentations yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by creating a new presentation from scratch, using a template, or
            generating one with AI.
          </p>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Create Your First Presentation
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presentations.map((presentation) => (
            <Link
              key={presentation.id}
              href={`/editor/${presentation.id}`}
              className="group rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md overflow-hidden"
            >
              <div className="aspect-video bg-muted flex items-center justify-center">
                {presentation.thumbnail ? (
                  <img
                    src={presentation.thumbnail}
                    alt={presentation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {presentation.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {presentation._count.sections} sections &middot; Updated{' '}
                  {new Date(presentation.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
