import { z } from 'zod';

// ============================================================
// AI Provider Types — Section 7
// ============================================================

/** Supported AI provider names */
export const AI_PROVIDERS = ['anthropic', 'openai', 'google'] as const;
export const AIProviderNameSchema = z.enum(AI_PROVIDERS);
export type AIProviderName = z.infer<typeof AIProviderNameSchema>;

/** Options passed to AI generation calls */
export interface AIGenerateOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  stopSequences?: string[];
}

/** Response from a text generation call */
export interface AITextResponse {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  finishReason: 'stop' | 'max_tokens' | 'content_filter' | 'unknown';
}

/** Error categories for AI provider errors */
export const AI_ERROR_CATEGORIES = [
  'rate_limit',
  'auth_error',
  'content_filter',
  'timeout',
  'invalid_response',
  'unknown',
] as const;

export type AIErrorCategory = (typeof AI_ERROR_CATEGORIES)[number];

/** Structured AI error */
export class AIProviderError extends Error {
  public readonly category: AIErrorCategory;
  public readonly retryable: boolean;
  public readonly provider: string;

  constructor(
    message: string,
    category: AIErrorCategory,
    provider: string,
    retryable: boolean = false,
  ) {
    super(message);
    this.name = 'AIProviderError';
    this.category = category;
    this.provider = provider;
    this.retryable = retryable;
  }
}

/** The AI provider interface that all providers must implement */
export interface AIProvider {
  readonly name: AIProviderName;
  generateText(prompt: string, options: AIGenerateOptions): Promise<AITextResponse>;
  generateStream(prompt: string, options: AIGenerateOptions): AsyncGenerator<string>;
}

// ============================================================
// AI Pipeline Types — Section 6
// ============================================================

/** Step 1: Outline Generation — Section 6.2 */
export const OutlineSectionSchema = z.object({
  title: z.string().min(1).max(200),
  keyPoints: z.array(z.string().min(1)).min(1).max(10),
  suggestedLayoutCategory: z.string().optional(),
});

export type OutlineSection = z.infer<typeof OutlineSectionSchema>;

export const OutlineSchema = z.object({
  title: z.string().min(1).max(200),
  sections: z.array(OutlineSectionSchema).min(3).max(20),
  suggestedSectionCount: z.number().min(3).max(20),
});

export type Outline = z.infer<typeof OutlineSchema>;

/** Step 2: Layout Assignment — Section 6.2 */
export const LayoutAssignmentSchema = z.object({
  sectionIndex: z.number(),
  layoutId: z.string(),
  rationale: z.string(),
});

export type LayoutAssignment = z.infer<typeof LayoutAssignmentSchema>;

export const LayoutAssignmentsSchema = z.object({
  assignments: z.array(LayoutAssignmentSchema),
});

export type LayoutAssignments = z.infer<typeof LayoutAssignmentsSchema>;

/** Step 3: Section Content — Section 6.2 */
export const SectionContentGeneratedSchema = z.object({
  sectionIndex: z.number(),
  layoutId: z.string(),
  content: z.record(z.string(), z.unknown()),
});

export type SectionContentGenerated = z.infer<typeof SectionContentGeneratedSchema>;

export const GeneratedContentSchema = z.object({
  sections: z.array(SectionContentGeneratedSchema),
});

export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;

/** Step 4: Image Suggestion — Section 6.2 */
export const ImageQuerySchema = z.object({
  sectionIndex: z.number(),
  slotId: z.string(),
  searchQuery: z.string(),
  aspectRatio: z.string().optional(),
  style: z.string().optional(),
});

export type ImageQuery = z.infer<typeof ImageQuerySchema>;

export const ImageSuggestionsSchema = z.object({
  queries: z.array(ImageQuerySchema),
});

export type ImageSuggestions = z.infer<typeof ImageSuggestionsSchema>;

/** Step 5: Theme Suggestion — Section 6.2 */
export const ThemeSuggestionSchema = z.object({
  presetId: z.string().optional(),
  tokenOverrides: z.record(z.string(), z.unknown()).optional(),
  rationale: z.string(),
});

export type ThemeSuggestion = z.infer<typeof ThemeSuggestionSchema>;

/** Detail level for content generation */
export const DETAIL_LEVELS = ['concise', 'detailed', 'extended'] as const;
export type DetailLevel = (typeof DETAIL_LEVELS)[number];

/** AI Generation Request */
export const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(5000),
  tone: z.enum(['professional', 'casual', 'academic', 'creative', 'minimal']).optional(),
  audience: z.string().max(200).optional(),
  sectionCount: z.number().min(3).max(20).optional(),
  detailLevel: z.enum(DETAIL_LEVELS).optional(),
  provider: AIProviderNameSchema.optional(),
  theme: z.string().optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

/** AI Refine Request */
export const RefineRequestSchema = z.object({
  presentationId: z.string(),
  sectionId: z.string(),
  feedback: z.string().min(1).max(2000),
  provider: AIProviderNameSchema.optional(),
});

export type RefineRequest = z.infer<typeof RefineRequestSchema>;

/** Suggest Layout Request */
export const SuggestLayoutRequestSchema = z.object({
  content: z.record(z.string(), z.unknown()),
  context: z.string().optional(),
});

export type SuggestLayoutRequest = z.infer<typeof SuggestLayoutRequestSchema>;

/** Outline-Only Request */
export const OutlineOnlyRequestSchema = z.object({
  prompt: z.string().min(1).max(5000),
});

export type OutlineOnlyRequest = z.infer<typeof OutlineOnlyRequestSchema>;

/** Generate Image Request */
export const GenerateImageRequestSchema = z.object({
  description: z.string().min(1).max(1000),
  style: z.string().optional(),
});

export type GenerateImageRequest = z.infer<typeof GenerateImageRequestSchema>;

/** Image result from search or generation */
export const ImageResultSchema = z.object({
  url: z.string(),
  alt: z.string(),
  attribution: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type ImageResult = z.infer<typeof ImageResultSchema>;

// ============================================================
// Streaming Event Types — Section 7.3
// ============================================================

export const STREAM_EVENT_TYPES = [
  'outline',
  'layout',
  'section',
  'image',
  'theme',
  'complete',
  'error',
  'progress',
] as const;

export type StreamEventType = (typeof STREAM_EVENT_TYPES)[number];

export interface StreamEvent {
  type: StreamEventType;
  data: unknown;
  timestamp: number;
}

export interface OutlineStreamEvent extends StreamEvent {
  type: 'outline';
  data: Outline;
}

export interface LayoutStreamEvent extends StreamEvent {
  type: 'layout';
  data: LayoutAssignments;
}

export interface SectionStreamEvent extends StreamEvent {
  type: 'section';
  data: SectionContentGenerated;
}

export interface ImageStreamEvent extends StreamEvent {
  type: 'image';
  data: { sectionIndex: number; slotId: string; imageUrl: string };
}

export interface ThemeStreamEvent extends StreamEvent {
  type: 'theme';
  data: ThemeSuggestion;
}

export interface CompleteStreamEvent extends StreamEvent {
  type: 'complete';
  data: { presentationId: string; sectionCount: number };
}

export interface ErrorStreamEvent extends StreamEvent {
  type: 'error';
  data: { message: string; category: AIErrorCategory; retryable: boolean };
}

export interface ProgressStreamEvent extends StreamEvent {
  type: 'progress';
  data: { step: string; progress: number; message: string };
}

// ============================================================
// Rate Limiting Constants
// ============================================================

/** AI credits per plan tier */
export const AI_CREDITS_LIMIT: Record<string, number> = {
  FREE: 50,
  PRO: 500,
  TEAM: 2000,
};

/** Credits consumed per operation */
export const AI_CREDITS_COST: Record<string, number> = {
  generate: 10,
  refine: 3,
  suggest_layout: 1,
  outline_only: 2,
  generate_image: 5,
};
