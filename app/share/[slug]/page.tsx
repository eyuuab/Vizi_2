import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
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

interface SharePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const presentation = await prisma.presentation.findUnique({
      where: { shareSlug: slug },
      select: { title: true, description: true, thumbnail: true },
    });
    if (!presentation) return { title: 'Not Found' };

    const ogImages: Array<{ url: string; width: number; height: number; alt: string }> = [];
    if (presentation.thumbnail) {
      ogImages.push({
        url: presentation.thumbnail,
        width: 640,
        height: 360,
        alt: presentation.title,
      });
    }

    return {
      title: presentation.title,
      description: presentation.description ?? undefined,
      openGraph: {
        title: presentation.title,
        description: presentation.description ?? undefined,
        type: 'website',
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: presentation.title,
        description: presentation.description ?? undefined,
        images: ogImages.map((img) => img.url),
      },
    };
  } catch {
    return { title: 'Shared Presentation' };
  }
}

export default async function SharedPresentationPage({
  params,
}: SharePageProps): Promise<React.JSX.Element> {
  const { slug } = await params;

  const presentation = await prisma.presentation.findUnique({
    where: { shareSlug: slug },
    include: {
      sections: { orderBy: { order: 'asc' } },
      theme: true,
    },
  });

  if (!presentation || !presentation.isPublic) {
    notFound();
  }

  // Parse theme tokens
  const themeTokensParsed = ThemeTokensSchema.safeParse(
    presentation.theme.tokens,
  );
  if (!themeTokensParsed.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Unable to load presentation theme.
        </p>
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
        notes: null, // Do not expose notes in shared view
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

  const visibleSections = composed.sections.filter((s) => !s.isHidden);
  const themeVars = resolveThemeTokens(themeTokens);

  if (visibleSections.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {presentation.title}
          </h1>
          <p className="text-gray-500">
            This presentation has no visible slides.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header bar for shared view */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center justify-between px-6 py-3 pointer-events-auto">
          <div>
            <h1 className="text-white/90 text-sm font-semibold">
              {presentation.title}
            </h1>
          </div>
          <div className="text-white/50 text-xs">
            Powered by SlideForge AI
          </div>
        </div>
      </div>

      {/* Slideshow */}
      <SlideshowViewer
        slides={visibleSections}
        title={presentation.title}
        themeVars={themeVars}
      />
    </div>
  );
}
