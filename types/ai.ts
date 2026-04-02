import { z } from 'zod';

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

/** AI Generation Request */
export const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(5000),
  tone: z.enum(['professional', 'casual', 'academic', 'creative', 'minimal']).optional(),
  audience: z.string().max(200).optional(),
  sectionCount: z.number().min(3).max(20).optional(),
  provider: z.enum(['anthropic', 'openai', 'google']).optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

/** AI Refine Request */
export const RefineRequestSchema = z.object({
  presentationId: z.string(),
  sectionIds: z.array(z.string()).min(1),
  feedback: z.string().min(1).max(2000),
  provider: z.enum(['anthropic', 'openai', 'google']).optional(),
});

export type RefineRequest = z.infer<typeof RefineRequestSchema>;
