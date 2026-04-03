/**
 * Step 5 — Theme Selection
 * Based on presentation topic/mood, selects or generates an appropriate theme.
 * Can pick from 12 presets or suggest custom token overrides.
 */

import type { AIProvider, ThemeSuggestion } from '@/types/ai';
import { ThemeSuggestionSchema } from '@/types/ai';
import { getThemePresetIds, getThemePreset } from '@/lib/themes';
import { generateTextWithRetry } from '@/lib/ai/providers';
import { SYSTEM_PROMPT_THEME, buildThemeSelectionPrompt } from './prompts';
import { parseAIJson } from './json-parser';

/** Default theme to use when AI selection fails */
const DEFAULT_THEME_ID = 'corporate-blue';

/**
 * Select a theme for the presentation based on its title and tone.
 * Uses AI suggestion with rule-based fallback.
 */
export async function selectTheme(
  provider: AIProvider,
  presentationTitle: string,
  tone: string,
  explicitThemeId?: string,
): Promise<ThemeSuggestion> {
  // If an explicit theme was requested, use it
  if (explicitThemeId) {
    const presetIds = getThemePresetIds();
    if (presetIds.includes(explicitThemeId)) {
      return {
        presetId: explicitThemeId,
        rationale: 'User-selected theme',
      };
    }
  }

  try {
    return await selectThemeWithAI(provider, presentationTitle, tone);
  } catch {
    return selectThemeRuleBased(tone);
  }
}

/**
 * AI-based theme selection.
 */
async function selectThemeWithAI(
  provider: AIProvider,
  presentationTitle: string,
  tone: string,
): Promise<ThemeSuggestion> {
  const presetIds = getThemePresetIds();
  const prompt = buildThemeSelectionPrompt(presentationTitle, tone, presetIds);

  const response = await generateTextWithRetry(provider, prompt, {
    systemPrompt: SYSTEM_PROMPT_THEME,
    maxTokens: 512,
    temperature: 0.5,
  });

  try {
    const parsed = parseAIJson<unknown>(response.text);
    const validated = ThemeSuggestionSchema.parse(parsed);

    // Verify the preset ID exists
    if (validated.presetId) {
      try {
        getThemePreset(validated.presetId);
        return validated;
      } catch {
        // Invalid preset ID, fall through to rule-based
      }
    }

    // If no valid preset, use rule-based
    return selectThemeRuleBased(tone);
  } catch {
    return selectThemeRuleBased(tone);
  }
}

/**
 * Rule-based theme selection based on tone.
 */
function selectThemeRuleBased(tone: string): ThemeSuggestion {
  const toneToTheme: Record<string, string> = {
    professional: 'corporate-blue',
    casual: 'vibrant-pop',
    academic: 'minimal-light',
    creative: 'sunset-warm',
    minimal: 'monochrome',
  };

  const presetId = toneToTheme[tone] ?? DEFAULT_THEME_ID;

  return {
    presetId,
    rationale: `Rule-based selection: "${tone}" tone mapped to "${presetId}"`,
  };
}
