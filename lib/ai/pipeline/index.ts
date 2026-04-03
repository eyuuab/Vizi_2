/**
 * AI Generation Pipeline — orchestrates all 5 steps with streaming.
 *
 * Flow: prompt -> outline -> layouts -> content -> images -> theme
 * Streams progress events via a ReadableStream for SSE delivery.
 */

import type {
  AIProvider,
  GenerateRequest,
  StreamEvent,
  Outline,
  LayoutAssignments,
  SectionContentGenerated,
  ThemeSuggestion,
} from '@/types/ai';
import { AIProviderError } from '@/types/ai';
import { generateOutline } from './outline-generator';
import { assignLayouts } from './layout-assigner';
import { generateAllContent, generateSectionContent } from './content-generator';
import { clearImageSlots, processImageSlots } from './image-handler';
import { selectTheme } from './theme-selector';
import { getLayout } from '@/lib/layouts';

export { generateOutline } from './outline-generator';
export { assignLayouts } from './layout-assigner';
export { generateAllContent, generateSectionContent } from './content-generator';
export { clearImageSlots, processImageSlots, searchImage } from './image-handler';
export { selectTheme } from './theme-selector';

// ============================================================
// Pipeline Result
// ============================================================

export interface PipelineResult {
  outline: Outline;
  layoutAssignments: LayoutAssignments;
  sections: SectionContentGenerated[];
  theme: ThemeSuggestion;
}

// ============================================================
// Streaming Pipeline
// ============================================================

/**
 * Create a streaming ReadableStream that emits JSON-line events
 * as the pipeline progresses through each step.
 *
 * Each line is a JSON-serialized StreamEvent terminated by newline.
 */
export function createGenerationStream(
  provider: AIProvider,
  request: GenerateRequest,
  signal?: AbortSignal,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: StreamEvent): void => {
        if (signal?.aborted) {
          controller.close();
          return;
        }
        const line = JSON.stringify(event) + '\n';
        controller.enqueue(encoder.encode(line));
      };

      try {
        // Step 1: Generate outline
        emit({
          type: 'progress',
          data: { step: 'outline', progress: 0, message: 'Generating presentation outline...' },
          timestamp: Date.now(),
        });

        if (signal?.aborted) {
          controller.close();
          return;
        }

        const outline = await generateOutline(provider, request);

        emit({
          type: 'outline',
          data: outline,
          timestamp: Date.now(),
        });

        // Step 2: Assign layouts
        emit({
          type: 'progress',
          data: { step: 'layout', progress: 15, message: 'Selecting slide layouts...' },
          timestamp: Date.now(),
        });

        if (signal?.aborted) {
          controller.close();
          return;
        }

        const layoutAssignments = await assignLayouts(provider, outline);

        emit({
          type: 'layout',
          data: layoutAssignments,
          timestamp: Date.now(),
        });

        // Step 3: Generate content for each section
        emit({
          type: 'progress',
          data: { step: 'content', progress: 25, message: 'Generating slide content...' },
          timestamp: Date.now(),
        });

        const totalSections = layoutAssignments.assignments.length;
        const sections: SectionContentGenerated[] = [];

        for (const assignment of layoutAssignments.assignments) {
          if (signal?.aborted) {
            controller.close();
            return;
          }

          const section = outline.sections[assignment.sectionIndex];
          if (!section) continue;

          let layout;
          try {
            layout = getLayout(assignment.layoutId);
          } catch {
            continue;
          }

          const sectionContent = await generateSectionContent(
            provider,
            section,
            assignment.sectionIndex,
            layout,
            outline.title,
            request.tone ?? 'professional',
          );

          sections.push(sectionContent);

          // Emit each section as it's generated
          emit({
            type: 'section',
            data: sectionContent,
            timestamp: Date.now(),
          });

          const sectionProgress = 25 + Math.round((sections.length / totalSections) * 50);
          emit({
            type: 'progress',
            data: {
              step: 'content',
              progress: sectionProgress,
              message: `Generated section ${String(sections.length)} of ${String(totalSections)}...`,
            },
            timestamp: Date.now(),
          });
        }

        // Step 4: Process images
        const includeImages = request.includeImages !== false;
        emit({
          type: 'progress',
          data: {
            step: 'images',
            progress: 80,
            message: includeImages ? 'Finding images...' : 'Skipping images (disabled)',
          },
          timestamp: Date.now(),
        });

        if (signal?.aborted) {
          controller.close();
          return;
        }

        const sectionsWithImages = includeImages
          ? await processImageSlots(sections)
          : clearImageSlots(sections);

        // Emit updated sections with image URLs
        for (const section of sectionsWithImages) {
          emit({
            type: 'section',
            data: section,
            timestamp: Date.now(),
          });
        }

        // Step 5: Select theme
        emit({
          type: 'progress',
          data: { step: 'theme', progress: 90, message: 'Selecting theme...' },
          timestamp: Date.now(),
        });

        if (signal?.aborted) {
          controller.close();
          return;
        }

        const theme = await selectTheme(
          provider,
          outline.title,
          request.tone ?? 'professional',
          request.theme,
        );

        emit({
          type: 'theme',
          data: theme,
          timestamp: Date.now(),
        });

        // Done
        emit({
          type: 'complete',
          data: {
            presentationId: '',
            sectionCount: sectionsWithImages.length,
          },
          timestamp: Date.now(),
        });

        emit({
          type: 'progress',
          data: { step: 'complete', progress: 100, message: 'Presentation generated!' },
          timestamp: Date.now(),
        });

        controller.close();
      } catch (error: unknown) {
        const aiError =
          error instanceof AIProviderError
            ? error
            : new AIProviderError(
                error instanceof Error ? error.message : 'Pipeline error',
                'unknown',
                provider.name,
                false,
              );

        emit({
          type: 'error',
          data: {
            message: aiError.message,
            category: aiError.category,
            retryable: aiError.retryable,
          },
          timestamp: Date.now(),
        });

        controller.close();
      }
    },
  });
}

/**
 * Run the full pipeline without streaming — returns the complete result.
 * Useful for non-streaming API calls.
 */
export async function runPipeline(
  provider: AIProvider,
  request: GenerateRequest,
): Promise<PipelineResult> {
  const outline = await generateOutline(provider, request);
  const layoutAssignments = await assignLayouts(provider, outline);
  const sections = await generateAllContent(
    provider,
    outline,
    layoutAssignments,
    request.tone ?? 'professional',
  );
  const sectionsWithImages =
    request.includeImages === false
      ? clearImageSlots(sections)
      : await processImageSlots(sections);
  const theme = await selectTheme(
    provider,
    outline.title,
    request.tone ?? 'professional',
    request.theme,
  );

  return {
    outline,
    layoutAssignments,
    sections: sectionsWithImages,
    theme,
  };
}
