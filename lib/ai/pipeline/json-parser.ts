/**
 * Robust JSON parser for AI responses.
 * AI models sometimes wrap JSON in markdown code fences or include
 * trailing text — this module handles those edge cases.
 */

/**
 * Extract and parse JSON from an AI response string.
 * Handles: raw JSON, markdown code fences, leading/trailing text.
 */
export function parseAIJson<T>(text: string): T {
  const cleaned = extractJsonString(text);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(
      `Failed to parse AI response as JSON. Cleaned text starts with: "${cleaned.slice(0, 200)}"`,
    );
  }
}

/**
 * Extract a JSON string from text that may contain markdown fences or extra content.
 */
function extractJsonString(text: string): string {
  const trimmed = text.trim();

  // Try to extract from markdown code fence
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  // Try to find JSON object/array boundaries
  const firstBrace = trimmed.indexOf('{');
  const firstBracket = trimmed.indexOf('[');

  let startIndex: number;
  let endChar: string;

  if (firstBrace === -1 && firstBracket === -1) {
    // No JSON structure found — return as-is (might be a plain string response)
    return trimmed;
  }

  if (firstBrace === -1) {
    startIndex = firstBracket;
    endChar = ']';
  } else if (firstBracket === -1) {
    startIndex = firstBrace;
    endChar = '}';
  } else if (firstBrace < firstBracket) {
    startIndex = firstBrace;
    endChar = '}';
  } else {
    startIndex = firstBracket;
    endChar = ']';
  }

  // Find matching closing brace/bracket using depth tracking
  let depth = 0;
  let inString = false;
  let escaped = false;
  let endIndex = startIndex;

  for (let i = startIndex; i < trimmed.length; i++) {
    const char = trimmed[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === '{' || char === '[') {
      depth++;
    } else if (char === '}' || char === ']') {
      depth--;
      if (depth === 0 && char === endChar) {
        endIndex = i;
        break;
      }
    }
  }

  return trimmed.slice(startIndex, endIndex + 1);
}

/**
 * Collect all chunks from an async generator into a single string.
 * Useful for collecting streamed AI responses before parsing.
 */
export async function collectStream(
  stream: AsyncGenerator<string>,
): Promise<string> {
  let result = '';
  for await (const chunk of stream) {
    result += chunk;
  }
  return result;
}
