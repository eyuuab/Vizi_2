/**
 * AI prompt templates for the generation pipeline.
 * Centralized here to keep pipeline steps focused on logic.
 */

import type { Outline, OutlineSection } from '@/types/ai';
import type { LayoutTemplate } from '@/types/layout';

// ============================================================
// System Prompts
// ============================================================

export const SYSTEM_PROMPT_BASE = `You are SlideForge AI, a world-class presentation designer and content writer.
You produce structured JSON output for building professional slide presentations.
Always respond with valid JSON. Never include markdown formatting, code fences, or explanatory text outside the JSON.
Your output must be parseable by JSON.parse() directly.

Key principles:
- Write like a professional presentation designer — concise, impactful, visual-first
- Every slide should have ONE clear takeaway
- Use short sentences and active voice
- Avoid filler words and generic statements
- Use concrete data, examples, and specifics over vague claims`;

export const SYSTEM_PROMPT_OUTLINE = `${SYSTEM_PROMPT_BASE}
Your task is to generate a presentation outline from a user's description.
Create a logical flow of sections that tells a compelling story.
Each section should have a clear purpose and advance the narrative.
Think about the visual variety — mix different layout types to keep the audience engaged.
Alternate between text-heavy, visual, data, and comparison slides.`;

export const SYSTEM_PROMPT_CONTENT = `${SYSTEM_PROMPT_BASE}
Your task is to generate content for a specific slide section.
Content must match the slot types and constraints of the layout template.

CRITICAL RULES for content quality:
- Headings: Maximum 8 words. Be specific and compelling, never generic.
- Body text: Use HTML formatting. Keep under 100 words per slide. Use <strong> for key terms.
- Lists: Always return as arrays of objects with "label" and "description" fields.
- Use concrete numbers, examples, and specifics — never generic placeholder text.
- Each slide must have one clear takeaway or message.
- Write as if presenting to executives — every word must earn its place.`;

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
- First section MUST be a cover/title slide (COVER category)
- Last section MUST be a CTA or conclusion (CTA category)
- Detail level: ${detailLevel}
${detailGuidance}
- Each section needs a specific, compelling title (not generic)
- Key points should be concrete and actionable, not vague
- Vary the layout categories for visual interest — don't use CONTENT for every slide

IMPORTANT: Create a diverse mix of slide types:
- Use DATA for any statistics, metrics, or numerical information
- Use COMPARISON for contrasting ideas, pros/cons, options
- Use MEDIA when an image would strengthen the message
- Use TIMELINE for processes, steps, or chronological information
- Use CONTENT for explanatory text slides

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
    .map((l) => {
      const slotSummary = l.slots.map((s) => `${s.id}(${s.type})`).join(', ');
      return `  - "${l.id}" (${l.category}): ${l.description} — Slots: [${slotSummary}]`;
    })
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
- First section (index 0) MUST use a COVER layout (hero-split, hero-center, or hero-gradient)
- Last section MUST use cta-simple if it's a conclusion/CTA
- Match layout to content type: data slides need data layouts, comparisons need comparison layouts
- Use content-two-column for slides with two distinct ideas or aspects
- Use content-text-image or content-image-text when the topic benefits from visuals
- Use data-stats when there are 2-4 key metrics to highlight
- Use comparison-two for any contrasting ideas
- Avoid using content-text for more than 2 consecutive sections — vary layouts for visual interest

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
      return `  - "${slot.id}" (${slot.type}, ${slot.required ? 'REQUIRED' : 'optional'})${constraintStr}: ${slot.aiHint}`;
    })
    .join('\n');

  const slotExamples = layout.slots
    .map((slot) => {
      switch (slot.type) {
        case 'HEADING':
          return `    "${slot.id}": "Short Impactful Heading"`;
        case 'TEXT':
          return `    "${slot.id}": "A concise sentence or short paragraph. No HTML tags."`;
        case 'RICHTEXT':
          return `    "${slot.id}": "<p>Opening statement with <strong>key term</strong> highlighted.</p><p>Second point elaborating on the topic with specific detail.</p><ul><li>Concrete point one</li><li>Concrete point two</li></ul>"`;
        case 'IMAGE':
          return `    "${slot.id}": "specific descriptive image search query"`;
        case 'LIST':
          return `    "${slot.id}": [{"label": "Key Point", "description": "Brief explanation of this point"}]`;
        case 'STATS':
          return `    "${slot.id}": [{"value": "95%", "label": "Customer Satisfaction"}, {"value": "2.5x", "label": "Revenue Growth"}]`;
        case 'CHART':
          return `    "${slot.id}": {"type": "bar", "labels": ["Q1", "Q2", "Q3"], "datasets": [{"label": "Revenue", "values": [120, 180, 240]}]}`;
        case 'URL':
          return `    "${slot.id}": "https://example.com"`;
        default:
          return `    "${slot.id}": {}`;
      }
    })
    .join(',\n');

  return `Generate content for section ${String(sectionIndex)} of the presentation "${presentationTitle}".

Section: "${section.title}"
Key points to cover: ${section.keyPoints.join('; ')}
Layout: "${layout.id}" (${layout.name})
Tone: ${tone}

The layout has these content slots:
${slotDescriptions}

SLOT TYPE RULES (follow exactly):
- HEADING: Plain text, 3-8 words. Specific and compelling. NO HTML tags.
- TEXT: Plain text, 1-2 sentences. NO HTML tags.
- RICHTEXT: HTML-formatted text. Use <p> for paragraphs, <strong> for emphasis, <ul>/<li> for lists, <em> for italic. Keep under 100 words. Structure with multiple short paragraphs.
- IMAGE: A descriptive search query for finding a relevant stock photo (e.g., "team collaborating in modern office space")
- LIST: JSON array of objects: [{"label": "Point Name", "description": "Brief explanation"}]. Include 3-6 items.
- STATS: JSON array of objects: [{"value": "42%", "label": "Metric Name"}]. Include 2-4 items with realistic numbers.
- CHART: JSON object: {"type": "bar|line|pie", "labels": [...], "datasets": [{"label": "Series", "values": [...]}]}
- URL: A URL string
- CONFIG: A configuration object appropriate to the slot context

Example format for this layout:
{
  "sectionIndex": ${String(sectionIndex)},
  "layoutId": "${layout.id}",
  "content": {
${slotExamples}
  }
}

IMPORTANT:
- Fill ALL required slots with real, specific content — no placeholders
- RICHTEXT must use proper HTML tags (<p>, <strong>, <em>, <ul>, <li>)
- LIST must be arrays of objects with "label" and "description" fields
- STATS must have realistic, specific numbers
- Content should be specific to the topic, not generic
- Write as a professional presentation designer

Respond with the JSON structure shown above.`;
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

SLOT TYPE RULES:
- HEADING: Plain text, 3-8 words. No HTML.
- TEXT: Plain text, 1-2 sentences. No HTML.
- RICHTEXT: HTML-formatted using <p>, <strong>, <em>, <ul>, <li> tags. Keep concise.
- LIST: Array of objects with "label" and "description" fields.
- STATS: Array of objects with "value" and "label" fields.

Respond with the updated content as a JSON object with the same slot IDs:
{
  "slotId": "updated content value"
}`;
}
