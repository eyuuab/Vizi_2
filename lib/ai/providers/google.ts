import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  AIProvider,
  AIGenerateOptions,
  AITextResponse,
} from '@/types/ai';
import { AIProviderError } from '@/types/ai';

const DEFAULT_MODEL = process.env.GOOGLE_MODEL || 'gemini-2.0-flash';
const DEFAULT_MAX_TOKENS = 4096;

/**
 * Google Gemini AI provider implementation.
 * Uses the @google/generative-ai SDK.
 */
export class GoogleProvider implements AIProvider {
  public readonly name = 'google' as const;
  private readonly client: GoogleGenerativeAI;

  constructor(apiKey?: string) {
    const key = apiKey ?? process.env.GOOGLE_API_KEY;
    if (!key) {
      throw new AIProviderError(
        'GOOGLE_API_KEY is not configured',
        'auth_error',
        'google',
        false,
      );
    }
    this.client = new GoogleGenerativeAI(key);
  }

  async generateText(
    prompt: string,
    options: AIGenerateOptions,
  ): Promise<AITextResponse> {
    try {
      const model = this.client.getGenerativeModel({
        model: DEFAULT_MODEL,
        systemInstruction: options.systemPrompt || undefined,
        generationConfig: {
          maxOutputTokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
          temperature: options.temperature ?? 0.7,
          stopSequences: options.stopSequences,
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const usage = response.usageMetadata;

      return {
        text,
        usage: {
          inputTokens: usage?.promptTokenCount ?? 0,
          outputTokens: usage?.candidatesTokenCount ?? 0,
        },
        finishReason: mapFinishReason(response.candidates?.[0]?.finishReason),
      };
    } catch (error: unknown) {
      throw categorizeGoogleError(error);
    }
  }

  async *generateStream(
    prompt: string,
    options: AIGenerateOptions,
  ): AsyncGenerator<string> {
    try {
      const model = this.client.getGenerativeModel({
        model: DEFAULT_MODEL,
        systemInstruction: options.systemPrompt || undefined,
        generationConfig: {
          maxOutputTokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
          temperature: options.temperature ?? 0.7,
          stopSequences: options.stopSequences,
        },
      });

      const result = await model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    } catch (error: unknown) {
      throw categorizeGoogleError(error);
    }
  }
}

function mapFinishReason(
  reason: string | undefined | null,
): AITextResponse['finishReason'] {
  switch (reason) {
    case 'STOP':
      return 'stop';
    case 'MAX_TOKENS':
      return 'max_tokens';
    case 'SAFETY':
      return 'content_filter';
    default:
      return 'unknown';
  }
}

function categorizeGoogleError(error: unknown): AIProviderError {
  if (error instanceof AIProviderError) {
    return error;
  }

  const err = error as { status?: number; message?: string; code?: string };
  const message = err.message ?? 'Unknown Google AI error';
  const status = err.status;

  if (status === 429) {
    return new AIProviderError(message, 'rate_limit', 'google', true);
  }
  if (status === 401 || status === 403) {
    return new AIProviderError(message, 'auth_error', 'google', false);
  }
  if (message.includes('SAFETY') || message.includes('blocked')) {
    return new AIProviderError(message, 'content_filter', 'google', false);
  }
  if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return new AIProviderError(message, 'timeout', 'google', true);
  }

  return new AIProviderError(message, 'unknown', 'google', true);
}
