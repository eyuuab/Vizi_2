/**
 * Step 2 — Layout Assignment
 * For each outline section, selects the best layout from the 18 available.
 * Uses AI suggestions with rule-based fallback.
 */

import type { AIProvider, Outline, LayoutAssignments, LayoutAssignment } from '@/types/ai';
import { LayoutAssignmentsSchema } from '@/types/ai';
import type { LayoutTemplate } from '@/types/layout';
import type { LayoutCategory } from '@/types/enums';
import { getAllLayouts, getLayoutsByCategory } from '@/lib/layouts';
import { generateTextWithRetry } from '@/lib/ai/providers';
import { SYSTEM_PROMPT_LAYOUT, buildLayoutAssignmentPrompt } from './prompts';
import { parseAIJson } from './json-parser';

const MAX_PARSE_RETRIES = 1;

/**
 * Assign layouts to each section in an outline.
 * Attempts AI-based assignment first, with rule-based fallback.
 */
export async function assignLayouts(
  provider: AIProvider,
  outline: Outline,
): Promise<LayoutAssignments> {
  const allLayouts = getAllLayouts();

  try {
    return await assignLayoutsWithAI(provider, outline, allLayouts);
  } catch {
    // Fall back to rule-based assignment
    return assignLayoutsRuleBased(outline, allLayouts);
  }
}

/**
 * AI-based layout assignment with validation.
 */
async function assignLayoutsWithAI(
  provider: AIProvider,
  outline: Outline,
  allLayouts: LayoutTemplate[],
): Promise<LayoutAssignments> {
  const prompt = buildLayoutAssignmentPrompt(outline, allLayouts);
  const validLayoutIds = new Set(allLayouts.map((l) => l.id));

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= MAX_PARSE_RETRIES; attempt++) {
    const effectivePrompt =
      attempt === 0
        ? prompt
        : `${prompt}\n\nIMPORTANT: Respond with ONLY valid JSON. Start with { and end with }.`;

    const response = await generateTextWithRetry(provider, effectivePrompt, {
      systemPrompt: SYSTEM_PROMPT_LAYOUT,
      maxTokens: 2048,
      temperature: 0.3,
    });

    try {
      const parsed = parseAIJson<unknown>(response.text);
      const validated = LayoutAssignmentsSchema.parse(parsed);

      // Verify all layoutIds are valid and all sections are covered
      const corrected = validateAndCorrectAssignments(
        validated,
        outline,
        validLayoutIds,
      );

      return corrected;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw new Error(
    `AI layout assignment failed: ${lastError?.message ?? 'Unknown error'}`,
  );
}

/**
 * Validate AI assignments and fix any issues:
 * - Replace invalid layoutIds with defaults for the category
 * - Add missing section assignments
 */
function validateAndCorrectAssignments(
  assignments: LayoutAssignments,
  outline: Outline,
  validLayoutIds: Set<string>,
): LayoutAssignments {
  const assignmentMap = new Map<number, LayoutAssignment>();

  for (const assignment of assignments.assignments) {
    if (validLayoutIds.has(assignment.layoutId)) {
      assignmentMap.set(assignment.sectionIndex, assignment);
    }
  }

  // Fill in any missing assignments with rule-based defaults
  const correctedAssignments: LayoutAssignment[] = [];

  for (let i = 0; i < outline.sections.length; i++) {
    const section = outline.sections[i];
    if (!section) continue;

    const existing = assignmentMap.get(i);
    if (existing) {
      correctedAssignments.push(existing);
    } else {
      correctedAssignments.push({
        sectionIndex: i,
        layoutId: getDefaultLayoutForCategory(
          (section.suggestedLayoutCategory as LayoutCategory | undefined) ?? 'CONTENT',
          i === 0,
          i === outline.sections.length - 1,
        ),
        rationale: 'Rule-based fallback assignment',
      });
    }
  }

  return { assignments: correctedAssignments };
}

/**
 * Rule-based layout assignment — deterministic fallback.
 */
function assignLayoutsRuleBased(
  outline: Outline,
  _allLayouts: LayoutTemplate[],
): LayoutAssignments {
  const assignments: LayoutAssignment[] = outline.sections.map((section, index) => {
    const isFirst = index === 0;
    const isLast = index === outline.sections.length - 1;
    const category = (section.suggestedLayoutCategory as LayoutCategory | undefined) ?? 'CONTENT';

    return {
      sectionIndex: index,
      layoutId: getDefaultLayoutForCategory(category, isFirst, isLast),
      rationale: `Rule-based: ${category} category${isFirst ? ' (cover)' : ''}${isLast ? ' (conclusion)' : ''}`,
    };
  });

  return { assignments };
}

/**
 * Get the default layout ID for a given category, with special handling
 * for first/last sections.
 */
function getDefaultLayoutForCategory(
  category: LayoutCategory | string,
  isFirst: boolean,
  isLast: boolean,
): string {
  if (isFirst) {
    return 'hero-split';
  }

  if (isLast) {
    return 'cta-simple';
  }

  // Category-specific defaults
  const categoryDefaults: Record<string, string> = {
    COVER: 'hero-center',
    CONTENT: 'content-text',
    DATA: 'data-stats',
    MEDIA: 'media-full',
    COMPARISON: 'comparison-two',
    TIMELINE: 'timeline-vertical',
    CTA: 'cta-simple',
    BLANK: 'blank',
  };

  return categoryDefaults[category] ?? 'content-text';
}

/**
 * Get all layouts available for a specific category.
 * Useful for giving the AI choices within a category.
 */
export function getLayoutOptionsForCategory(
  category: LayoutCategory,
): LayoutTemplate[] {
  return getLayoutsByCategory(category);
}
