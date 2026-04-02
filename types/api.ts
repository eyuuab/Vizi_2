import { z } from 'zod';

// ============================================================
// API Response Types
// ============================================================

/** Standard API success response */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/** Standard API error response */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Union type for API responses */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================
// Pagination
// ============================================================
export const PaginationParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Presentation API Schemas — Section 12.1
// ============================================================
export const CreatePresentationSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  themeId: z.string().optional(),
});

export type CreatePresentationInput = z.infer<typeof CreatePresentationSchema>;

export const UpdatePresentationSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional(),
  themeId: z.string().optional(),
  isPublic: z.boolean().optional(),
  shareSlug: z.string().max(100).optional(),
});

export type UpdatePresentationInput = z.infer<typeof UpdatePresentationSchema>;

// ============================================================
// Section API Schemas — Section 12.2
// ============================================================
export const CreateSectionSchema = z.object({
  layoutId: z.string(),
  order: z.number().int().min(0),
  content: z.record(z.string(), z.unknown()).optional(),
});

export type CreateSectionInput = z.infer<typeof CreateSectionSchema>;

export const UpdateSectionSchema = z.object({
  layoutId: z.string().optional(),
  order: z.number().int().min(0).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  styleOverrides: z.record(z.string(), z.unknown()).optional(),
  transitions: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().max(10000).optional(),
  isHidden: z.boolean().optional(),
});

export type UpdateSectionInput = z.infer<typeof UpdateSectionSchema>;

export const ReorderSectionsSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    }),
  ),
});

export type ReorderSectionsInput = z.infer<typeof ReorderSectionsSchema>;

// ============================================================
// Export API Schemas — Section 12.4
// ============================================================
export const ExportPptxSchema = z.object({
  presentationId: z.string(),
  includeHidden: z.boolean().optional(),
  includeNotes: z.boolean().optional(),
});

export type ExportPptxInput = z.infer<typeof ExportPptxSchema>;

export const ExportPdfSchema = z.object({
  presentationId: z.string(),
  includeHidden: z.boolean().optional(),
});

export type ExportPdfInput = z.infer<typeof ExportPdfSchema>;
