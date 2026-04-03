/**
 * Step 1 — Outline Generation
 * Takes a user's natural language prompt and generates a structured outline.
 */

import type { AIProvider, Outline, GenerateRequest } from '@/types/ai';
import { OutlineSchema } from '@/types/ai';
import { generateTextWithRetry } from '@/lib/ai/providers';
import { SYSTEM_PROMPT_OUTLINE, buildOutlinePrompt } from './prompts';
import { parseAIJson } from './json-parser';

const MAX_PARSE_RETRIES = 2;

/**
 * Generate a presentation outline from a user prompt.
 * Validates the AI response against the OutlineSchema.
 * If parsing/validation fails, retries with a stricter prompt.
 */
export async function generateOutline(
  provider: AIProvider,
  request: GenerateRequest,
): Promise<Outline> {
  const prompt = buildOutlinePrompt(request.prompt, {
    tone: request.tone,
    audience: request.audience,
    sectionCount: request.sectionCount,
    detailLevel: request.detailLevel,
  });

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= MAX_PARSE_RETRIES; attempt++) {
    const effectivePrompt =
      attempt === 0
        ? prompt
        : `${prompt}\n\nIMPORTANT: Your previous response was not valid JSON. Respond with ONLY the JSON object, no markdown, no explanation. Start your response with { and end with }.`;

    const response = await generateTextWithRetry(provider, effectivePrompt, {
      systemPrompt: SYSTEM_PROMPT_OUTLINE,
      maxTokens: 4096,
      temperature: attempt === 0 ? 0.7 : 0.3, // Lower temperature on retry
    });

    try {
      const parsed = parseAIJson<unknown>(response.text);
      const validated = OutlineSchema.parse(parsed);
      return validated;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to retry
    }
  }

  throw new Error(
    `Failed to generate valid outline after ${String(MAX_PARSE_RETRIES + 1)} attempts: ${lastError?.message ?? 'Unknown error'}`,
  );
}
