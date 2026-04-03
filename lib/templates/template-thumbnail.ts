/**
 * Template Thumbnail Generator
 *
 * Generates SVG-based thumbnail previews for starter templates.
 * Uses the template's color and first section content to create
 * a visually representative preview without requiring database themes.
 */

const WIDTH = 640;
const HEIGHT = 360;

interface TemplateThumbnailInput {
  title: string;
  subtitle?: string;
  color: string;
  category: string;
  layoutId?: string;
}

/**
 * Generate an SVG thumbnail for a starter template.
 * Returns a base64 data URL suitable for use in <img> tags.
 */
export function generateTemplateThumbnailDataUrl(
  input: TemplateThumbnailInput,
): string {
  const svg = generateTemplateThumbnailSvg(input);
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function generateTemplateThumbnailSvg(input: TemplateThumbnailInput): string {
  const { title, subtitle, color, category, layoutId } = input;
  const bgColor = color;
  const textColor = getContrastColor(bgColor);
  const accentColor = lightenColor(bgColor, 0.3);

  // Choose render style based on layoutId or category
  if (layoutId?.startsWith('hero-') || layoutId?.startsWith('cta-')) {
    return renderHeroStyle(bgColor, textColor, accentColor, title, subtitle ?? '');
  }
  if (layoutId?.startsWith('data-')) {
    return renderDataStyle(bgColor, textColor, accentColor, title);
  }
  if (layoutId?.startsWith('comparison-')) {
    return renderComparisonStyle(bgColor, textColor, accentColor, title);
  }
  if (layoutId?.startsWith('timeline-')) {
    return renderTimelineStyle(bgColor, textColor, accentColor, title);
  }

  // Default: category-based style
  switch (category) {
    case 'Business':
    case 'Tech':
      return renderHeroStyle(bgColor, textColor, accentColor, title, subtitle ?? '');
    case 'Education':
      return renderContentStyle(bgColor, textColor, accentColor, title, subtitle ?? '');
    case 'Marketing':
    case 'Creative':
      return renderHeroStyle(bgColor, textColor, accentColor, title, subtitle ?? '');
    default:
      return renderHeroStyle(bgColor, textColor, accentColor, title, subtitle ?? '');
  }
}

// ============================================================
// SVG Render Styles
// ============================================================

function renderHeroStyle(
  bg: string, text: string, accent: string,
  title: string, subtitle: string,
): string {
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${esc(bg)};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${esc(darkenColor(bg, 0.2))};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="55%" y="8%" width="40%" height="84%" rx="8" fill="${esc(accent)}" opacity="0.15"/>
  <rect x="58%" y="20%" width="34%" height="20%" rx="4" fill="${esc(accent)}" opacity="0.1"/>
  <rect x="58%" y="48%" width="34%" height="30%" rx="4" fill="${esc(accent)}" opacity="0.08"/>
  <text x="5%" y="38%" font-family="system-ui, Arial, sans-serif" font-size="24" font-weight="bold" fill="${esc(text)}" dominant-baseline="middle">${esc(truncate(title, 30))}</text>
  <text x="5%" y="52%" font-family="system-ui, Arial, sans-serif" font-size="12" fill="${esc(text)}" opacity="0.7" dominant-baseline="middle">${esc(truncate(subtitle, 45))}</text>
  <rect x="5%" y="64%" width="18%" height="4" rx="2" fill="${esc(accent)}"/>
</svg>`;
}

function renderDataStyle(
  bg: string, text: string, accent: string, title: string,
): string {
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${esc(bg)};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${esc(darkenColor(bg, 0.15))};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="5%" y="15%" font-family="system-ui, Arial, sans-serif" font-size="18" font-weight="bold" fill="${esc(text)}" dominant-baseline="middle">${esc(truncate(title, 40))}</text>
  <rect x="8%" y="30%" width="14%" height="50%" rx="3" fill="${esc(accent)}" opacity="0.85"/>
  <rect x="26%" y="40%" width="14%" height="40%" rx="3" fill="${esc(accent)}" opacity="0.65"/>
  <rect x="44%" y="28%" width="14%" height="52%" rx="3" fill="${esc(accent)}" opacity="0.9"/>
  <rect x="62%" y="48%" width="14%" height="32%" rx="3" fill="${esc(accent)}" opacity="0.55"/>
  <rect x="80%" y="35%" width="14%" height="45%" rx="3" fill="${esc(accent)}" opacity="0.75"/>
  <line x1="6%" y1="84%" x2="96%" y2="84%" stroke="${esc(text)}" stroke-width="1" opacity="0.15"/>
</svg>`;
}

function renderComparisonStyle(
  bg: string, text: string, accent: string, title: string,
): string {
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${esc(bg)};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${esc(darkenColor(bg, 0.15))};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="50%" y="14%" font-family="system-ui, Arial, sans-serif" font-size="18" font-weight="bold" fill="${esc(text)}" text-anchor="middle" dominant-baseline="middle">${esc(truncate(title, 40))}</text>
  <rect x="5%" y="24%" width="42%" height="68%" rx="6" fill="${esc(accent)}" opacity="0.12"/>
  <rect x="53%" y="24%" width="42%" height="68%" rx="6" fill="${esc(accent)}" opacity="0.12"/>
  <rect x="10%" y="34%" width="32%" height="6" rx="3" fill="${esc(accent)}" opacity="0.3"/>
  <rect x="10%" y="48%" width="28%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.15"/>
  <rect x="10%" y="60%" width="30%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.15"/>
  <rect x="58%" y="34%" width="32%" height="6" rx="3" fill="${esc(accent)}" opacity="0.3"/>
  <rect x="58%" y="48%" width="28%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.15"/>
  <rect x="58%" y="60%" width="30%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.15"/>
</svg>`;
}

function renderTimelineStyle(
  bg: string, text: string, accent: string, title: string,
): string {
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${esc(bg)};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${esc(darkenColor(bg, 0.15))};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="50%" y="14%" font-family="system-ui, Arial, sans-serif" font-size="18" font-weight="bold" fill="${esc(text)}" text-anchor="middle" dominant-baseline="middle">${esc(truncate(title, 40))}</text>
  <line x1="10%" y1="55%" x2="90%" y2="55%" stroke="${esc(accent)}" stroke-width="2" opacity="0.4"/>
  <circle cx="20%" cy="55%" r="8" fill="${esc(accent)}" opacity="0.8"/>
  <circle cx="40%" cy="55%" r="8" fill="${esc(accent)}" opacity="0.6"/>
  <circle cx="60%" cy="55%" r="8" fill="${esc(accent)}" opacity="0.8"/>
  <circle cx="80%" cy="55%" r="8" fill="${esc(accent)}" opacity="0.6"/>
  <rect x="14%" y="68%" width="12%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.15"/>
  <rect x="34%" y="38%" width="12%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.15"/>
  <rect x="54%" y="68%" width="12%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.15"/>
  <rect x="74%" y="38%" width="12%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.15"/>
</svg>`;
}

function renderContentStyle(
  bg: string, text: string, accent: string,
  title: string, subtitle: string,
): string {
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${esc(bg)};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${esc(darkenColor(bg, 0.15))};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="50%" y="30%" font-family="system-ui, Arial, sans-serif" font-size="22" font-weight="bold" fill="${esc(text)}" text-anchor="middle" dominant-baseline="middle">${esc(truncate(title, 35))}</text>
  <text x="50%" y="44%" font-family="system-ui, Arial, sans-serif" font-size="11" fill="${esc(text)}" opacity="0.65" text-anchor="middle" dominant-baseline="middle">${esc(truncate(subtitle, 55))}</text>
  <rect x="30%" y="56%" width="40%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.12"/>
  <rect x="25%" y="66%" width="50%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.1"/>
  <rect x="28%" y="76%" width="44%" height="5" rx="2.5" fill="${esc(text)}" opacity="0.08"/>
  <rect x="42%" y="88%" width="16%" height="3" rx="1.5" fill="${esc(accent)}"/>
</svg>`;
}

// ============================================================
// Color Helpers
// ============================================================

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a2e' : '#f0f0f5';
}

function lightenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.min(255, Math.round(r + (255 - r) * amount));
  const ng = Math.min(255, Math.round(g + (255 - g) * amount));
  const nb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

function darkenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.max(0, Math.round(r * (1 - amount)));
  const ng = Math.max(0, Math.round(g * (1 - amount)));
  const nb = Math.max(0, Math.round(b * (1 - amount)));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}
