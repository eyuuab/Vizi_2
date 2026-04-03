/**
 * AI prompt templates for the generation pipeline.
 * Centralized here to keep pipeline steps focused on logic.
 */

import type { Outline, OutlineSection } from '@/types/ai';
import type { LayoutTemplate } from '@/types/layout';

// ============================================================
// System Prompts
// ============================================================

export const SYSTEM_PROMPT_BASE = `You are SlideForge AI, a presentation content generation assistant.
You produce structured JSON output for building professional slide presentations.
Always respond with valid JSON. Never include markdown formatting, code fences, or explanatory text outside the JSON.
Your output must be parseable by JSON.parse() directly.`;

export const SYSTEM_PROMPT_OUTLINE = `${SYSTEM_PROMPT_BASE}
Your task is to generate a presentation outline from a user's description.
Create a logical flow of sections that tells a compelling story.
Each section should have a clear purpose and advance the narrative.`;

export const SYSTEM_PROMPT_CONTENT = `${SYSTEM_PROMPT_BASE}
Your task is to generate content for a specific slide section.
Content must match the slot types and constraints of the layout template.
Keep text concise — presentations should not be walls of text.
Use bullet points for lists, keep headings under 10 words, and body text under 150 words per slide.`;

export const SYSTEM_PROMPT_THEME = `${SYSTEM_PROMPT_BASE}
Your task is to suggest a visual theme for a presentation based on its topic and tone.
Choose from available preset themes or suggest custom color overrides.`;

export const SYSTEM_PROMPT_LAYOUT = `${SYSTEM_PROMPT_BASE}
Your task is to suggest the best slide layout for given content.
Consider the type and amount of content when making your recommendation.`;

// ============================================================
// Outline Generation Prompt
// ============================================================

export function buildOutlinePrompt(
  userPrompt: string,
  options: { tone?: string; audience?: string; sectionCount?: number; detailLevel?: string },
): string {
  const sectionCount = options.sectionCount ?? 8;
  const tone = options.tone ?? 'professional';
  const audience = options.audience ?? 'general audience';
  const detailLevel = options.detailLevel ?? 'detailed';

  const detailGuidance =
    detailLevel === 'concise'
      ? '- Keep each slide minimal: 1-2 key points per section, short bullet points, no long paragraphs'
      : detailLevel === 'extended'
        ? '- Make each slide comprehensive: 3-5 key points per section, include supporting details, examples, and data where relevant'
        : '- Use a balanced level of detail: 2-4 key points per section with enough context to be informative';

  return `Create a presentation outline based on this description:

"${userPrompt}"

Requirements:
- Tone: ${tone}
- Target audience: ${audience}
- Number of sections: exactly ${String(sectionCount)} slides
- First section should be a cover/title slide
- Last section should be a CTA or conclusion
- Detail level: ${detailLevel}
${detailGuidance}
- Each section needs a clear title and key points

Respond with this exact JSON structure:
{
  "title": "Presentation Title",
  "suggestedSectionCount": ${String(sectionCount)},
  "sections": [
    {
      "title": "Section Title",
      "keyPoints": ["Point 1", "Point 2"],
      "suggestedLayoutCategory": "COVER|CONTENT|DATA|MEDIA|COMPARISON|TIMELINE|CTA|BLANK"
    }
  ]
}

Layout categories to choose from:
- COVER: Title/hero slides (use for first slide)
- CONTENT: Text-heavy explanation slides
- DATA: Charts, stats, tables
- MEDIA: Image-focused slides
- COMPARISON: Side-by-side comparisons
- TIMELINE: Sequential/process flows
- CTA: Call-to-action or conclusion slides
- BLANK: Minimal/spacer slides`;
}

// ============================================================
// Layout Assignment Prompt
// ============================================================

export function buildLayoutAssignmentPrompt(
  outline: Outline,
  availableLayouts: LayoutTemplate[],
): string {
  const layoutDescriptions = availableLayouts
    .map((l) => `  - "${l.id}" (${l.category}): ${l.description}`)
    .join('\n');

  const sections = outline.sections
    .map(
      (s, i) =>
        `  Section ${String(i)}: "${s.title}" — ${s.keyPoints.join(', ')} [suggested: ${s.suggestedLayoutCategory ?? 'CONTENT'}]`,
    )
    .join('\n');

  return `Assign the best layout template to each section of this presentation.

Presentation: "${outline.title}"

Sections:
${sections}

Available layouts:
${layoutDescriptions}

Rules:
- First section (index 0) should use a COVER layout (hero-split, hero-center, or hero-gradient)
- Last section should use a CTA layout if it's a conclusion
- Match layout category to the suggested category when possible
- DATA sections should use data-chart, data-stats, or data-table
- MEDIA sections should use media-full or media-gallery
- CONTENT sections can use content-text, content-two-column, content-text-image, or content-image-text
- COMPARISON sections should use comparison-two or comparison-three
- TIMELINE sections should use timeline-vertical or timeline-horizontal

Respond with this exact JSON structure:
{
  "assignments": [
    {
      "sectionIndex": 0,
      "layoutId": "layout-id-here",
      "rationale": "Brief reason for this choice"
    }
  ]
}`;
}

// ============================================================
// Content Generation Prompt
// ============================================================

export function buildContentPrompt(
  section: OutlineSection,
  sectionIndex: number,
  layout: LayoutTemplate,
  presentationTitle: string,
  tone: string,
): string {
  const slotDescriptions = layout.slots
    .map((slot) => {
      const constraints: string[] = [];
      if (slot.constraints?.minLength) {
        constraints.push(`minLength: ${String(slot.constraints.minLength)}`);
      }
      if (slot.constraints?.maxLength) {
        constraints.push(`maxLength: ${String(slot.constraints.maxLength)}`);
      }
      const constraintStr = constraints.length > 0 ? ` (${constraints.join(', ')})` : '';
      return `  - "${slot.id}" (${slot.type}, ${slot.required ? 'required' : 'optional'})${constraintStr}: ${slot.aiHint}`;
    })
    .join('\n');

  return `Generate content for section ${String(sectionIndex)} of the presentation "${presentationTitle}".

Section: "${section.title}"
Key points to cover: ${section.keyPoints.join('; ')}
Layout: "${layout.id}" (${layout.name})
Tone: ${tone}

The layout has these slots that need content:
${slotDescriptions}

Content type guidelines:
- HEADING: A short title, 3-8 words
- TEXT: Plain text content
- RICHTEXT: HTML-formatted text. Use <p>, <ul>, <li>, <strong>, <em> tags. Keep concise.
- IMAGE: Return a descriptive search query string for finding a relevant image (e.g., "modern office teamwork collaboration")
- LIST: Return an array of objects with "label" and optionally "description" fields
- STATS: Return an array of objects with "value" (string number like "95%") and "label" fields
- CHART: Return an object with "type" (bar|line|pie), "labels" array, and "datasets" array
- CONFIG: Return a configuration object appropriate to the slot

Respond with this exact JSON structure:
{
  "sectionIndex": ${String(sectionIndex)},
  "layoutId": "${layout.id}",
  "content": {
    "slotId": "content value matching the slot type"
  }
}`;
}

// ============================================================
// Theme Selection Prompt
// ============================================================

export function buildThemeSelectionPrompt(
  presentationTitle: string,
  tone: string,
  presetIds: string[],
): string {
  return `Suggest the best visual theme for this presentation.

Title: "${presentationTitle}"
Tone: ${tone}

Available theme presets:
${presetIds.map((id) => `  - "${id}"`).join('\n')}

Guidelines:
- "professional" tone → corporate-blue, monochrome, or minimal-light
- "casual" tone → vibrant-pop, pastel-dream, or sunset-warm
- "academic" tone → minimal-light, monochrome, or corporate-blue
- "creative" tone → neon-nights, vibrant-pop, or sunset-warm
- "minimal" tone → minimal-light, monochrome

Respond with this exact JSON structure:
{
  "presetId": "theme-preset-id",
  "rationale": "Brief reason for this choice"
}`;
}

// ============================================================
// Layout Suggestion Prompt
// ============================================================

export function buildLayoutSuggestionPrompt(
  content: Record<string, unknown>,
  context: string | undefined,
  availableLayoutIds: string[],
): string {
  const contentSummary = Object.entries(content)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `  "${key}": "${value.slice(0, 100)}..."`;
      }
      if (Array.isArray(value)) {
        return `  "${key}": [array with ${String(value.length)} items]`;
      }
      return `  "${key}": ${typeof value}`;
    })
    .join('\n');

  return `Suggest the best layout for this slide content.

Content:
${contentSummary}

${context ? `Context: ${context}` : ''}

Available layouts: ${availableLayoutIds.join(', ')}

Respond with ONLY the layout ID string (no JSON, no quotes, no explanation). Example: content-text`;
}

// ============================================================
// Refine Content Prompt
// ============================================================

export function buildRefinePrompt(
  currentContent: Record<string, unknown>,
  feedback: string,
  layout: LayoutTemplate,
): string {
  const slotDescriptions = layout.slots
    .map(
      (slot) =>
        `  - "${slot.id}" (${slot.type}): ${slot.aiHint}`,
    )
    .join('\n');

  return `Refine the content for this slide section based on user feedback.

Current content:
${JSON.stringify(currentContent, null, 2)}

Layout slots:
${slotDescriptions}

User feedback: "${feedback}"

Apply the feedback to improve the content while maintaining the same slot structure.
Keep all required slots filled and respect slot type constraints.

Respond with the updated content as a JSON object with the same slot IDs:
{
  "slotId": "updated content value"
}`;
}
