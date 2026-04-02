import { z } from 'zod';
import { LayoutCategorySchema, MediaTypeSchema, SlotTypeSchema } from '@/types/enums';

// ============================================================
// Position — Section 5.1.3
// Percentage-based bounding box (0-100)
// ============================================================
export const PositionSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().min(0).max(100),
  height: z.number().min(0).max(100),
});

export type Position = z.infer<typeof PositionSchema>;

// ============================================================
// Slot Constraints — Section 5.1.3
// ============================================================
export const SlotConstraintsSchema = z.object({
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  aspectRatio: z.string().optional(),
  allowedFormats: z.array(z.string()).optional(),
});

export type SlotConstraints = z.infer<typeof SlotConstraintsSchema>;

// ============================================================
// Responsive overrides — Section 5.1.3
// ============================================================
export const ResponsiveOverridesSchema = z.object({
  mobile: PositionSchema.partial().optional(),
  tablet: PositionSchema.partial().optional(),
});

export type ResponsiveOverrides = z.infer<typeof ResponsiveOverridesSchema>;

// ============================================================
// PPTX Slot Mapping — Section 9
// Maps a layout slot to PPTX shape coordinates
// ============================================================
export const PptxSlotMappingSchema = z.record(
  z.string(),
  z.object({
    shapeType: z.enum(['textbox', 'image', 'shape', 'table', 'chart']),
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
    fill: z.string().optional(),
    border: z
      .object({
        color: z.string(),
        width: z.number(),
      })
      .optional(),
    shadow: z.boolean().optional(),
    rotation: z.number().optional(),
  }),
);

export type PptxSlotMapping = z.infer<typeof PptxSlotMappingSchema>;

// ============================================================
// Slot Definition — Section 5.1.3
// ============================================================
export const SlotDefinitionSchema = z.object({
  id: z.string(),
  type: SlotTypeSchema,
  label: z.string(),
  required: z.boolean(),
  position: PositionSchema,
  constraints: SlotConstraintsSchema.optional(),
  responsive: ResponsiveOverridesSchema.optional(),
  aiHint: z.string(),
});

export type SlotDefinition = z.infer<typeof SlotDefinitionSchema>;

// ============================================================
// Slot Content — flexible content union per slot type
// ============================================================
export const SlotContentSchema = z.union([
  z.string(),
  z.record(z.string(), z.unknown()),
  z.array(z.unknown()),
]);

export type SlotContent = z.infer<typeof SlotContentSchema>;

// ============================================================
// Layout Template — Section 5.1.1
// ============================================================
export const LayoutTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: LayoutCategorySchema,
  description: z.string(),
  thumbnail: z.string(),
  slots: z.array(SlotDefinitionSchema),
  defaultContent: z.record(z.string(), SlotContentSchema),
  minHeight: z.number(),
  maxHeight: z.union([z.number(), z.literal('auto')]),
  supportedMediaTypes: z.array(MediaTypeSchema),
  pptxMapping: PptxSlotMappingSchema,
});

export type LayoutTemplate = z.infer<typeof LayoutTemplateSchema>;
