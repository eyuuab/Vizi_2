/**
 * Presentation Loader for Export
 *
 * Loads a presentation from the database and composes it
 * into a ComposedPresentation ready for rendering.
 */

import { prisma } from '@/lib/db';
import { composePresentation } from '@/lib/composer';
import type { SectionInput } from '@/lib/composer';
import type { ComposedPresentation } from '@/types/presentation';
import { ThemeTokensSchema } from '@/types/theme';
import {
  SectionContentSchema,
  StyleOverridesSchema,
  TransitionConfigSchema,
} from '@/types/presentation';

// ============================================================
// Types
// ============================================================

export interface LoadedPresentation {
  composed: ComposedPresentation;
  userId: string;
}

// ============================================================
// Public API
// ============================================================

/**
 * Load a presentation from the database and compose it for rendering.
 * Throws if the presentation is not found.
 */
export async function loadAndComposePresentation(
  presentationId: string,
): Promise<LoadedPresentation> {
  const presentation = await prisma.presentation.findUnique({
    where: { id: presentationId },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
      theme: true,
    },
  });

  if (!presentation) {
    throw new Error(`Presentation not found: ${presentationId}`);
  }

  // Parse theme tokens
  const themeTokensParsed = ThemeTokensSchema.safeParse(presentation.theme.tokens);
  if (!themeTokensParsed.success) {
    throw new Error(`Invalid theme tokens for presentation: ${presentationId}`);
  }
  const themeTokens = themeTokensParsed.data;

  // Convert database sections to SectionInput
  const sectionInputs: SectionInput[] = presentation.sections.map((section) => {
    const contentParsed = SectionContentSchema.safeParse(section.content);
    const content = contentParsed.success ? contentParsed.data : {};

    const styleOverridesParsed = StyleOverridesSchema.safeParse(section.styleOverrides);
    const styleOverrides = styleOverridesParsed.success ? styleOverridesParsed.data : undefined;

    const transitionsParsed = TransitionConfigSchema.safeParse(section.transitions);
    const transitions = transitionsParsed.success ? transitionsParsed.data : undefined;

    return {
      id: section.id,
      layoutId: section.layoutId,
      order: section.order,
      content,
      styleOverrides,
      transitions,
      notes: section.notes,
      isHidden: section.isHidden,
    };
  });

  const composed = composePresentation(
    presentation.id,
    presentation.title,
    presentation.description,
    sectionInputs,
    themeTokens,
  );

  return {
    composed,
    userId: presentation.userId,
  };
}
