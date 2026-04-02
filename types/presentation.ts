import { z } from 'zod';
import { SlotContentSchema } from '@/types/layout';
import type { ThemeTokens } from '@/types/theme';
import type { LayoutTemplate, Position } from '@/types/layout';

// ============================================================
// Section Content — stored as JSON in Section.content
// ============================================================
export const SectionContentSchema = z.record(z.string(), SlotContentSchema);
export type SectionContent = z.infer<typeof SectionContentSchema>;

// ============================================================
// Style Overrides — per-section theme overrides
// ============================================================
export const StyleOverridesSchema = z
  .object({
    backgroundColor: z.string().optional(),
    padding: z
      .object({
        top: z.number().optional(),
        right: z.number().optional(),
        bottom: z.number().optional(),
        left: z.number().optional(),
      })
      .optional(),
    textColor: z.string().optional(),
    accentColor: z.string().optional(),
  })
  .optional();

export type StyleOverrides = z.infer<typeof StyleOverridesSchema>;

// ============================================================
// Transition Config
// ============================================================
export const TransitionConfigSchema = z
  .object({
    type: z.enum(['fade', 'slide', 'zoom', 'none']),
    duration: z.number().min(0).max(2000),
    direction: z.enum(['left', 'right', 'up', 'down']).optional(),
  })
  .optional();

export type TransitionConfig = z.infer<typeof TransitionConfigSchema>;

// ============================================================
// Presentation Metadata — stored as JSON in Presentation.metadata
// ============================================================
export const PresentationMetadataSchema = z.object({
  aiPrompt: z.string().optional(),
  aiProvider: z.string().optional(),
  generatedAt: z.string().optional(),
  version: z.number().optional(),
  exportSettings: z
    .object({
      includeNotes: z.boolean().optional(),
      format: z.enum(['pptx', 'pdf']).optional(),
    })
    .optional(),
});

export type PresentationMetadata = z.infer<typeof PresentationMetadataSchema>;

// ============================================================
// Resolved Section — Section 5.2.1
// A section fully resolved with its layout template and computed dimensions
// ============================================================
export interface ResolvedSlot {
  definition: {
    id: string;
    type: string;
    label: string;
    required: boolean;
    position: Position;
    aiHint: string;
  };
  content: unknown;
  computedPosition: Position;
}

export interface ResolvedSection {
  id: string;
  layoutId: string;
  layout: LayoutTemplate;
  order: number;
  content: SectionContent;
  styleOverrides: StyleOverrides;
  transitions: TransitionConfig;
  notes: string | null;
  isHidden: boolean;
  resolvedSlots: ResolvedSlot[];
  computedHeight: number;
  yOffset: number;
}

// ============================================================
// Composed Presentation — Section 5.2.1
// Full presentation ready for rendering/export
// ============================================================
export interface ComposedPresentation {
  id: string;
  title: string;
  description: string | null;
  theme: ThemeTokens;
  sections: ResolvedSection[];
  totalHeight: number;
  sectionGap: number;
}

// ============================================================
// PPTX Page — for splitForPptx
// ============================================================
export interface PptxPage {
  slideIndex: number;
  sections: ResolvedSection[];
  isContinuation: boolean;
}
