import type { AIProvider, AIProviderName, AIGenerateOptions, AITextResponse } from '@/types/ai';
import { AIProviderError } from '@/types/ai';
import { AnthropicProvider } from './anthropic';
import { OpenAIProvider } from './openai';
import { GoogleProvider } from './google';

// ============================================================
// Retry Configuration
// ============================================================

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 10000;

// ============================================================
// Provider Cache (singleton per provider name)
// ============================================================

const providerCache = new Map<AIProviderName, AIProvider>();

/**
 * Get (or create) an AI provider instance by name.
 * Caches provider instances for reuse.
 */
export function getProvider(name?: AIProviderName): AIProvider {
  const providerName = resolveProviderName(name);

  const cached = providerCache.get(providerName);
  if (cached) {
    return cached;
  }

  let provider: AIProvider;
  switch (providerName) {
    case 'anthropic':
      provider = new AnthropicProvider();
      break;
    case 'openai':
      provider = new OpenAIProvider();
      break;
    case 'google':
      provider = new GoogleProvider();
      break;
    default: {
      const _exhaustive: never = providerName;
      throw new AIProviderError(
        `Unknown AI provider: ${String(_exhaustive)}`,
        'unknown',
        'unknown',
        false,
      );
    }
  }

  providerCache.set(providerName, provider);
  return provider;
}

/**
 * Determine which provider to use based on explicit choice, env var, or available keys.
 */
function resolveProviderName(explicit?: AIProviderName): AIProviderName {
  if (explicit) {
    return explicit;
  }

  const envProvider = process.env.AI_DEFAULT_PROVIDER;
  if (envProvider === 'anthropic' || envProvider === 'openai' || envProvider === 'google') {
    return envProvider;
  }

  // Auto-detect based on available API keys
  if (process.env.GOOGLE_API_KEY) {
    return 'google';
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return 'anthropic';
  }
  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }

  throw new AIProviderError(
    'No AI provider API key configured. Set GOOGLE_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY.',
    'auth_error',
    'unknown',
    false,
  );
}

// ============================================================
// Retry Wrapper
// ============================================================

/**
 * Execute an AI text generation call with exponential backoff retry.
 * Only retries on retryable errors (rate_limit, timeout, unknown).
 */
export async function generateTextWithRetry(
  provider: AIProvider,
  prompt: string,
  options: AIGenerateOptions,
): Promise<AITextResponse> {
  let lastError: AIProviderError | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await provider.generateText(prompt, options);
    } catch (error: unknown) {
      const aiError =
        error instanceof AIProviderError
          ? error
          : new AIProviderError(
              error instanceof Error ? error.message : 'Unknown error',
              'unknown',
              provider.name,
              true,
            );

      lastError = aiError;

      if (!aiError.retryable || attempt === MAX_RETRIES) {
        throw aiError;
      }

      const delay = Math.min(
        BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500,
        MAX_DELAY_MS,
      );
      await sleep(delay);
    }
  }

  // Unreachable but satisfies TypeScript
  throw lastError ?? new AIProviderError('Retry exhausted', 'unknown', provider.name, false);
}

/**
 * Execute an AI streaming generation call with retry on initial connection.
 * Streaming retry only applies to the initial connection, not mid-stream failures.
 */
export async function* generateStreamWithRetry(
  provider: AIProvider,
  prompt: string,
  options: AIGenerateOptions,
): AsyncGenerator<string> {
  let lastError: AIProviderError | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const stream = provider.generateStream(prompt, options);
      // Yield the first chunk to verify connection works
      const first = await stream.next();
      if (!first.done && first.value) {
        yield first.value;
      }
      // Then yield the rest
      yield* stream;
      return;
    } catch (error: unknown) {
      const aiError =
        error instanceof AIProviderError
          ? error
          : new AIProviderError(
              error instanceof Error ? error.message : 'Unknown error',
              'unknown',
              provider.name,
              true,
            );

      lastError = aiError;

      if (!aiError.retryable || attempt === MAX_RETRIES) {
        throw aiError;
      }

      const delay = Math.min(
        BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500,
        MAX_DELAY_MS,
      );
      await sleep(delay);
    }
  }

  throw lastError ?? new AIProviderError('Retry exhausted', 'unknown', provider.name, false);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Re-export provider classes for direct use
export { AnthropicProvider } from './anthropic';
export { OpenAIProvider } from './openai';
export { GoogleProvider } from './google';
