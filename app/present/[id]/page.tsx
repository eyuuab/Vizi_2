import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { composePresentation } from '@/lib/composer';
import type { SectionInput } from '@/lib/composer';
import { resolveThemeTokens } from '@/lib/themes';
import { ThemeTokensSchema } from '@/types/theme';
import {
  SectionContentSchema,
  StyleOverridesSchema,
  TransitionConfigSchema,
} from '@/types/presentation';
import { SlideshowViewer } from '@/components/presentation/slideshow-viewer';

interface PresentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PresentPageProps): Promise<Metadata> {
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

export default async function PresentPage({
  params,
}: PresentPageProps): Promise<React.JSX.Element> {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  const { id } = await params;

  const presentation = await prisma.presentation.findUnique({
    where: { id },
    include: {
      sections: { orderBy: { order: 'asc' } },
      theme: true,
    },
  });

  if (!presentation) {
    notFound();
  }

  if (presentation.userId !== userId) {
    redirect('/dashboard');
  }

  // Parse theme tokens
  const themeTokensParsed = ThemeTokensSchema.safeParse(
    presentation.theme.tokens,
  );
  if (!themeTokensParsed.success) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p>Error: Invalid theme configuration.</p>
      </div>
    );
  }
  const themeTokens = themeTokensParsed.data;

  // Build section inputs
  const sectionInputs: SectionInput[] = presentation.sections.map(
    (section) => {
      const contentParsed = SectionContentSchema.safeParse(section.content);
      const styleOverridesParsed = StyleOverridesSchema.safeParse(
        section.styleOverrides,
      );
      const transitionsParsed = TransitionConfigSchema.safeParse(
        section.transitions,
      );

      return {
        id: section.id,
        layoutId: section.layoutId,
        order: section.order,
        content: contentParsed.success ? contentParsed.data : {},
        styleOverrides: styleOverridesParsed.success
          ? styleOverridesParsed.data
          : undefined,
        transitions: transitionsParsed.success
          ? transitionsParsed.data
          : undefined,
        notes: section.notes,
        isHidden: section.isHidden,
      };
    },
  );

  // Compose the presentation
  const composed = composePresentation(
    presentation.id,
    presentation.title,
    presentation.description,
    sectionInputs,
    themeTokens,
  );

  // Filter visible sections for slides
  const visibleSections = composed.sections.filter((s) => !s.isHidden);

  // Resolve theme CSS variables
  const themeVars = resolveThemeTokens(themeTokens);

  return (
    <SlideshowViewer
      slides={visibleSections}
      title={presentation.title}
      themeVars={themeVars}
    />
  );
}
