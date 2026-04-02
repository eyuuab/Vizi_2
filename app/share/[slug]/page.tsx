import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

interface SharePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const presentation = await prisma.presentation.findUnique({
      where: { shareSlug: slug },
      select: { title: true, description: true },
    });
    if (!presentation) return { title: 'Not Found' };
    return {
      title: presentation.title,
      description: presentation.description ?? undefined,
    };
  } catch {
    return { title: 'Shared Presentation' };
  }
}

export default async function SharedPresentationPage({ params }: SharePageProps) {
  const { slug } = await params;

  let presentation: {
    id: string;
    title: string;
    description: string | null;
    isPublic: boolean;
  } | null = null;

  try {
    presentation = await prisma.presentation.findUnique({
      where: { shareSlug: slug },
      select: { id: true, title: true, description: true, isPublic: true },
    });
  } catch {
    // Database might not be available
  }

  if (!presentation || !presentation.isPublic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">{presentation.title}</h1>
          {presentation.description && (
            <p className="text-muted-foreground mt-1">{presentation.description}</p>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="rounded-lg border p-16 text-center">
          <p className="text-muted-foreground">
            Public presentation viewer will be implemented in Phase 6.
          </p>
        </div>
      </main>
    </div>
  );
}
