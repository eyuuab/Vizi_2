const fs = require('fs');
const path = 'lib/ai/pipeline/image-handler.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  `/**
 * Generate a placeholder image URL using a placeholder service.
 * Used when Unsplash API is not available.
 */
function generatePlaceholderImage(
  query: string,
  aspectRatio?: string,
): ImageResult {
  const { width, height } = parseDimensions(aspectRatio);
  const encodedText = encodeURIComponent(query.slice(0, 30));

  return {
    url: \`https://placehold.co/\${String(width)}x\${String(height)}/1a1a2e/eaeaea?text=\${encodedText}\`,
    alt: query,
    attribution: 'Placeholder image',
    width,
    height,
  };
}`,
  `/**
 * Generate a placeholder image URL using a free AI provider.
 * Used when Unsplash API is not available or FAILS.
 */
function generatePlaceholderImage(
  query: string,
  aspectRatio?: string,
): ImageResult {
  const { width, height } = parseDimensions(aspectRatio);
  const encodedQuery = encodeURIComponent(query);

  return {
    url: \`https://image.pollinations.ai/prompt/\${encodedQuery}?width=\${String(width)}&height=\${String(height)}&nologo=true\`,
    alt: query,
    attribution: 'AI Generated Image',
    width,
    height,
  };
}`
);

fs.writeFileSync(path, code);
