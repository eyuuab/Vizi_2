import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

interface PresentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PresentPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const presentation = await prisma.presentation.findUnique({
      where: { id },
      select: { title: true },
    });
    return {
      title: presentation ? `Present: ${presentation.title}` : 'Presentation',
    };
  } catch {
    return { title: 'Presentation' };
  }
}

export default async function PresentPage({ params }: PresentPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;

  let presentation: {
    id: string;
    title: string;
    userId: string;
  } | null = null;

  try {
    presentation = await prisma.presentation.findUnique({
      where: { id },
      select: { id: true, title: true, userId: true },
    });
  } catch {
    // Database might not be available
  }

  if (presentation && presentation.userId !== session.user.id) {
    redirect('/dashboard');
  }

  if (!presentation) {
    notFound();
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{presentation.title}</h1>
        <p className="text-lg text-gray-400">
          Full-screen presentation mode with keyboard navigation will be implemented in Phase 5.
        </p>
        <p className="mt-8 text-sm text-gray-500">Press Escape to exit</p>
      </div>
    </div>
  );
}
