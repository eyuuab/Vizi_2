/**
 * Step 3 — Content Generation
 * For each section+layout pair, generates content that fills all required slots.
 * Content is validated against slot type constraints.
 */

import type {
  AIProvider,
  Outline,
  LayoutAssignments,
  SectionContentGenerated,
} from '@/types/ai';
import { SectionContentGeneratedSchema } from '@/types/ai';
import type { LayoutTemplate, SlotDefinition } from '@/types/layout';
import { getLayout } from '@/lib/layouts';
import { generateTextWithRetry } from '@/lib/ai/providers';
import { SYSTEM_PROMPT_CONTENT, buildContentPrompt } from './prompts';
import { parseAIJson } from './json-parser';

const MAX_PARSE_RETRIES = 1;

/**
 * Callback for streaming progress updates as sections are generated.
 */
export type SectionProgressCallback = (
  sectionIndex: number,
  total: number,
) => void;

/**
 * Generate content for all sections based on outline and layout assignments.
 * Calls the AI provider once per section to generate slot content.
 */
export async function generateAllContent(
  provider: AIProvider,
  outline: Outline,
  assignments: LayoutAssignments,
  tone: string,
  onProgress?: SectionProgressCallback,
): Promise<SectionContentGenerated[]> {
  const results: SectionContentGenerated[] = [];
  const total = assignments.assignments.length;

  for (const assignment of assignments.assignments) {
    const section = outline.sections[assignment.sectionIndex];
    if (!section) continue;

    let layout: LayoutTemplate;
    try {
      layout = getLayout(assignment.layoutId);
    } catch {
      // If layout not found, skip this section
      continue;
    }

    const content = await generateSectionContent(
      provider,
      section,
      assignment.sectionIndex,
      layout,
      outline.title,
      tone,
    );

    results.push(content);

    if (onProgress) {
      onProgress(results.length, total);
    }
  }

  return results;
}

/**
 * Generate content for a single section.
 * Validates the response and fills missing required slots with defaults.
 */
export async function generateSectionContent(
  provider: AIProvider,
  section: { title: string; keyPoints: string[] },
  sectionIndex: number,
  layout: LayoutTemplate,
  presentationTitle: string,
  tone: string,
): Promise<SectionContentGenerated> {
  const prompt = buildContentPrompt(
    { title: section.title, keyPoints: section.keyPoints },
    sectionIndex,
    layout,
    presentationTitle,
    tone,
  );

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= MAX_PARSE_RETRIES; attempt++) {
    const effectivePrompt =
      attempt === 0
        ? prompt
        : `${prompt}\n\nIMPORTANT: Respond with ONLY valid JSON. Start with { and end with }.`;

    const response = await generateTextWithRetry(provider, effectivePrompt, {
      systemPrompt: SYSTEM_PROMPT_CONTENT,
      maxTokens: 2048,
      temperature: attempt === 0 ? 0.7 : 0.4,
    });

    try {
      const parsed = parseAIJson<unknown>(response.text);
      const validated = SectionContentGeneratedSchema.parse(parsed);

      // Validate and fill missing slots
      const corrected = validateSectionContent(validated, layout, sectionIndex);
      return corrected;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  // Final fallback: generate default content for all slots
  return generateDefaultContent(layout, sectionIndex, section.title);
}

/**
 * Validate section content against layout slots.
 * Fills in missing required slots with default content.
 * Enforces maxLength constraints.
 */
function validateSectionContent(
  generated: SectionContentGenerated,
  layout: LayoutTemplate,
  sectionIndex: number,
): SectionContentGenerated {
  const content: Record<string, unknown> = { ...generated.content };

  for (const slot of layout.slots) {
    const value = content[slot.id];

    // Fill missing required slots
    if (slot.required && (value === undefined || value === null || value === '')) {
      content[slot.id] = getDefaultForSlotType(slot, layout);
    }

    // Enforce maxLength on text content
    if (
      slot.constraints?.maxLength &&
      typeof content[slot.id] === 'string'
    ) {
      const strValue = content[slot.id] as string;
      if (strValue.length > slot.constraints.maxLength) {
        content[slot.id] = strValue.slice(0, slot.constraints.maxLength);
      }
    }
  }

  return {
    sectionIndex,
    layoutId: layout.id,
    content,
  };
}

/**
 * Get a sensible default value for a slot based on its type.
 */
function getDefaultForSlotType(
  slot: SlotDefinition,
  layout: LayoutTemplate,
): unknown {
  // Check if the layout has default content for this slot
  const layoutDefault = layout.defaultContent[slot.id];
  if (layoutDefault !== undefined) {
    return layoutDefault;
  }

  switch (slot.type) {
    case 'HEADING':
      return 'Section Title';
    case 'TEXT':
    case 'RICHTEXT':
      return '<p>Content will be added here.</p>';
    case 'IMAGE':
      return 'professional presentation slide background';
    case 'LIST':
      return [
        { label: 'Point 1', description: 'Description for point 1' },
        { label: 'Point 2', description: 'Description for point 2' },
      ];
    case 'STATS':
      return [
        { value: '100%', label: 'Metric' },
        { value: '50+', label: 'Items' },
      ];
    case 'CHART':
      return {
        type: 'bar',
        labels: ['A', 'B', 'C'],
        datasets: [{ label: 'Data', values: [30, 50, 20] }],
      };
    case 'CONFIG':
      return {};
    case 'VIDEO':
    case 'MERMAID':
    case 'URL':
      return '';
    default:
      return '';
  }
}

/**
 * Generate completely default content for a layout when AI fails.
 */
function generateDefaultContent(
  layout: LayoutTemplate,
  sectionIndex: number,
  sectionTitle: string,
): SectionContentGenerated {
  const content: Record<string, unknown> = {};

  for (const slot of layout.slots) {
    if (slot.type === 'HEADING') {
      content[slot.id] = sectionTitle;
    } else {
      content[slot.id] = getDefaultForSlotType(slot, layout);
    }
  }

  return {
    sectionIndex,
    layoutId: layout.id,
    content,
  };
}
