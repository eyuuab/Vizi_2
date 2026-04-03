import Anthropic from '@anthropic-ai/sdk';
import type {
  AIProvider,
  AIGenerateOptions,
  AITextResponse,
} from '@/types/ai';
import { AIProviderError } from '@/types/ai';

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 4096;

/**
 * Anthropic Claude AI provider implementation.
 * Uses the @anthropic-ai/sdk for direct API access.
 */
export class AnthropicProvider implements AIProvider {
  public readonly name = 'anthropic' as const;
  private readonly client: Anthropic;

  constructor(apiKey?: string) {
    const key = apiKey ?? process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new AIProviderError(
        'ANTHROPIC_API_KEY is not configured',
        'auth_error',
        'anthropic',
        false,
      );
    }
    this.client = new Anthropic({ apiKey: key });
  }

  async generateText(
    prompt: string,
    options: AIGenerateOptions,
  ): Promise<AITextResponse> {
    try {
      const response = await this.client.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: options.temperature ?? 0.7,
        system: options.systemPrompt ?? '',
        messages: [{ role: 'user', content: prompt }],
        stop_sequences: options.stopSequences,
      });

      const textContent = response.content.find((block) => block.type === 'text');
      const text = textContent && 'text' in textContent ? textContent.text : '';

      return {
        text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
        finishReason: mapStopReason(response.stop_reason),
      };
    } catch (error: unknown) {
      throw categorizeAnthropicError(error);
    }
  }

  async *generateStream(
    prompt: string,
    options: AIGenerateOptions,
  ): AsyncGenerator<string> {
    try {
      const stream = this.client.messages.stream({
        model: DEFAULT_MODEL,
        max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: options.temperature ?? 0.7,
        system: options.systemPrompt ?? '',
        messages: [{ role: 'user', content: prompt }],
        stop_sequences: options.stopSequences,
      });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          'delta' in event &&
          event.delta.type === 'text_delta'
        ) {
          yield event.delta.text;
        }
      }
    } catch (error: unknown) {
      throw categorizeAnthropicError(error);
    }
  }
}

function mapStopReason(
  reason: string | null,
): AITextResponse['finishReason'] {
  switch (reason) {
    case 'end_turn':
    case 'stop_sequence':
      return 'stop';
    case 'max_tokens':
      return 'max_tokens';
    default:
      return 'unknown';
  }
}

function categorizeAnthropicError(error: unknown): AIProviderError {
  if (error instanceof AIProviderError) {
    return error;
  }

  const err = error as { status?: number; message?: string };
  const message = err.message ?? 'Unknown Anthropic error';
  const status = err.status;

  if (status === 429) {
    return new AIProviderError(message, 'rate_limit', 'anthropic', true);
  }
  if (status === 401 || status === 403) {
    return new AIProviderError(message, 'auth_error', 'anthropic', false);
  }
  if (status === 400 && message.includes('content')) {
    return new AIProviderError(message, 'content_filter', 'anthropic', false);
  }
  if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return new AIProviderError(message, 'timeout', 'anthropic', true);
  }

  return new AIProviderError(message, 'unknown', 'anthropic', true);
}
