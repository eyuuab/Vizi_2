import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

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

export default async function EditorPage({ params }: EditorPageProps) {
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
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{presentation.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Editor — Phase 3</span>
        </div>
      </header>

      {/* Editor Canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r bg-card overflow-y-auto">
          <div className="p-4 text-sm text-muted-foreground">
            Section list will be rendered here.
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border bg-card p-16 text-center">
              <h2 className="text-lg font-semibold mb-2">Editor Canvas</h2>
              <p className="text-sm text-muted-foreground">
                The full editor with section rendering, inline editing, and layout components
                will be implemented in Phase 3.
              </p>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 border-l bg-card overflow-y-auto">
          <div className="p-4 text-sm text-muted-foreground">
            Theme panel and section settings will be rendered here.
          </div>
        </aside>
      </div>

      {/* Bottom Bar */}
      <footer className="flex h-8 items-center justify-between border-t bg-card px-4 text-xs text-muted-foreground">
        <span>Zoom: 100%</span>
        <span>Press Ctrl+K for command palette</span>
      </footer>
    </div>
  );
}
