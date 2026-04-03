import OpenAI from 'openai';
import type {
  AIProvider,
  AIGenerateOptions,
  AITextResponse,
} from '@/types/ai';
import { AIProviderError } from '@/types/ai';

const DEFAULT_MODEL = 'gpt-4o';
const DEFAULT_MAX_TOKENS = 4096;

/**
 * OpenAI GPT-4 AI provider implementation.
 * Uses the openai SDK for direct API access.
 */
export class OpenAIProvider implements AIProvider {
  public readonly name = 'openai' as const;
  private readonly client: OpenAI;

  constructor(apiKey?: string) {
    const key = apiKey ?? process.env.OPENAI_API_KEY;
    if (!key) {
      throw new AIProviderError(
        'OPENAI_API_KEY is not configured',
        'auth_error',
        'openai',
        false,
      );
    }
    this.client = new OpenAI({ apiKey: key });
  }

  async generateText(
    prompt: string,
    options: AIGenerateOptions,
  ): Promise<AITextResponse> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await this.client.chat.completions.create({
        model: DEFAULT_MODEL,
        max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: options.temperature ?? 0.7,
        messages,
        stop: options.stopSequences,
      });

      const choice = response.choices[0];
      const text = choice?.message?.content ?? '';

      return {
        text,
        usage: {
          inputTokens: response.usage?.prompt_tokens ?? 0,
          outputTokens: response.usage?.completion_tokens ?? 0,
        },
        finishReason: mapFinishReason(choice?.finish_reason ?? null),
      };
    } catch (error: unknown) {
      throw categorizeOpenAIError(error);
    }
  }

  async *generateStream(
    prompt: string,
    options: AIGenerateOptions,
  ): AsyncGenerator<string> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const stream = await this.client.chat.completions.create({
        model: DEFAULT_MODEL,
        max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: options.temperature ?? 0.7,
        messages,
        stop: options.stopSequences,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          yield delta;
        }
      }
    } catch (error: unknown) {
      throw categorizeOpenAIError(error);
    }
  }
}

function mapFinishReason(
  reason: string | null,
): AITextResponse['finishReason'] {
  switch (reason) {
    case 'stop':
      return 'stop';
    case 'length':
      return 'max_tokens';
    case 'content_filter':
      return 'content_filter';
    default:
      return 'unknown';
  }
}

function categorizeOpenAIError(error: unknown): AIProviderError {
  if (error instanceof AIProviderError) {
    return error;
  }

  const err = error as { status?: number; message?: string; code?: string };
  const message = err.message ?? 'Unknown OpenAI error';
  const status = err.status;

  if (status === 429 || err.code === 'rate_limit_exceeded') {
    return new AIProviderError(message, 'rate_limit', 'openai', true);
  }
  if (status === 401 || status === 403) {
    return new AIProviderError(message, 'auth_error', 'openai', false);
  }
  if (err.code === 'content_policy_violation') {
    return new AIProviderError(message, 'content_filter', 'openai', false);
  }
  if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return new AIProviderError(message, 'timeout', 'openai', true);
  }

  return new AIProviderError(message, 'unknown', 'openai', true);
}
