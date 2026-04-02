/**
 * Central Zod schema validation utilities for runtime data validation.
 * Re-exports all schemas from the /types module and provides
 * helper functions for API route validation.
 */

export {
  LayoutTemplateSchema,
  SlotDefinitionSchema,
  PositionSchema,
  SlotConstraintsSchema,
  PptxSlotMappingSchema,
} from '@/types/layout';

export {
  ThemeTokensSchema,
  ThemeColorsSchema,
  ThemeTypographySchema,
  ThemeSpacingSchema,
  ThemeLayoutSchema,
  ThemeEffectsSchema,
} from '@/types/theme';

export {
  OutlineSchema,
  LayoutAssignmentsSchema,
  GeneratedContentSchema,
  ImageSuggestionsSchema,
  ThemeSuggestionSchema,
  GenerateRequestSchema,
  RefineRequestSchema,
} from '@/types/ai';

export {
  CreatePresentationSchema,
  UpdatePresentationSchema,
  CreateSectionSchema,
  UpdateSectionSchema,
  ReorderSectionsSchema,
  ExportPptxSchema,
  ExportPdfSchema,
  PaginationParamsSchema,
} from '@/types/api';

export {
  SectionContentSchema,
  StyleOverridesSchema,
  TransitionConfigSchema,
  PresentationMetadataSchema,
} from '@/types/presentation';

export {
  LayoutCategorySchema,
  SlotTypeSchema,
  MediaTypeSchema,
  AssetTypeSchema,
  UserPlanSchema,
} from '@/types/enums';
