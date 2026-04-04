import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { EditorLayout } from '@/components/editor/editor-layout';

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditorPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const presentation = await prisma.presentation.findUnique({
      where: { id },
      select: { title: true },
    });
    return {
      title: presentation ? `Edit: ${presentation.title}` : 'Editor',
    };
  } catch {
    return { title: 'Editor' };
  }
}

export default async function EditorPage({ params }: EditorPageProps): Promise<React.JSX.Element> {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  const { id } = await params;

  const presentation = await prisma.presentation.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
      theme: true,
    },
  });

  if (!presentation) {
    notFound();
  }

  if (presentation.clerkUserId !== userId) {
    redirect('/dashboard');
  }

  // Serialize for client component
  const serialized = {
    id: presentation.id,
    title: presentation.title,
    description: presentation.description,
    themeId: presentation.themeId,
    isPublic: presentation.isPublic,
    shareSlug: presentation.shareSlug,
    sections: presentation.sections.map((s) => ({
      id: s.id,
      layoutId: s.layoutId,
      order: s.order,
      content: s.content,
      styleOverrides: s.styleOverrides,
      transitions: s.transitions,
      notes: s.notes,
      isHidden: s.isHidden,
    })),
    theme: {
      id: presentation.theme.id,
      tokens: presentation.theme.tokens,
    },
  };

  return <EditorLayout presentation={serialized} />;
}
