/**
 * AI Pipeline — Section 7
 *
 * Multi-step AI pipeline for presentation generation.
 * Provider-agnostic: supports Anthropic Claude and OpenAI GPT-4.
 *
 * Pipeline flow:
 * 1. generateOutline(prompt, options) → Outline
 * 2. assignLayouts(outline, layouts) → LayoutAssignments
 * 3. generateContent(outline, layouts) → SectionContentGenerated[]
 * 4. processImageSlots(sections) → SectionContentGenerated[] (with images)
 * 5. selectTheme(topic) → ThemeSuggestion
 */

export { getProvider, generateTextWithRetry, generateStreamWithRetry } from './providers';
export {
  generateOutline,
  assignLayouts,
  generateAllContent,
  generateSectionContent,
  processImageSlots,
  searchImage,
  selectTheme,
  createGenerationStream,
  runPipeline,
} from './pipeline';
export type { PipelineResult } from './pipeline';
