'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Palette,
  LayoutGrid,
  Type,
  Check,
  Loader2,
  Sparkles,
  Trash2,
  Search,
  X,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRightPanelView } from '@/store/slices/editor-slice';
import {
  setThemeId,
  updateSectionLayout,
  updateSectionSlotContent,
} from '@/store/slices/presentation-slice';
import {
  loadTheme,
  updateColorToken,
  updateTypographyToken,
  updateSpacingToken,
} from '@/store/slices/theme-slice';
import { getAllLayouts, getLayout } from '@/lib/layouts';
import { getAllThemePresets, getThemePreset } from '@/lib/themes';
import type { LayoutCategory } from '@/types/enums';
import { LAYOUT_CATEGORIES } from '@/types/enums';

export function RightSidebar(): React.JSX.Element {
  const panelView = useAppSelector((state) => state.editor.rightPanelView);

  return (
    <aside className="flex w-72 flex-col border-l bg-card overflow-hidden">
      {/* Panel navigation */}
      <div className="flex items-center border-b px-2 py-1.5 gap-0.5">
        <PanelTab
          view="theme"
          label="Theme"
          icon={<Palette className="h-3.5 w-3.5" />}
          active={panelView === 'theme'}
        />
        <PanelTab
          view="layout"
          label="Layout"
          icon={<LayoutGrid className="h-3.5 w-3.5" />}
          active={panelView === 'layout'}
        />
        <PanelTab
          view="text-formatting"
          label="Edit"
          icon={<Type className="h-3.5 w-3.5" />}
          active={panelView === 'text-formatting'}
        />
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {panelView === 'theme' && <ThemePanel />}
        {panelView === 'layout' && <LayoutPickerPanel />}
        {panelView === 'section-settings' && <LayoutPickerPanel />}
        {panelView === 'text-formatting' && <TextFormattingPanel />}
      </div>
    </aside>
  );
}

// ============================================================
// Panel Tab
// ============================================================

interface PanelTabProps {
  view: 'theme' | 'layout' | 'text-formatting';
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

function PanelTab({ view, label, icon, active }: PanelTabProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      className={cn('h-7 gap-1 text-xs', active && 'font-medium')}
      onClick={() => dispatch(setRightPanelView(view))}
    >
      {icon}
      {label}
    </Button>
  );
}

// ============================================================
// Theme Panel
// ============================================================

type ThemeFilter = 'All' | 'Dark' | 'Light' | 'Professional' | 'Colorful';

function isDarkTheme(bg: string): boolean {
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

const THEME_CATEGORIES: Record<string, ThemeFilter[]> = {
  'corporate-blue': ['Professional'],
  'modern-dark': ['Dark', 'Professional'],
  'minimal-light': ['Light'],
  'sunset-warm': ['Colorful'],
  'ocean-breeze': ['Colorful'],
  'forest-green': ['Colorful'],
  'royal-purple': ['Colorful', 'Dark'],
  'neon-nights': ['Dark', 'Colorful'],
  'earthy-tones': ['Light'],
  'pastel-dream': ['Light', 'Colorful'],
  'monochrome': ['Light', 'Professional'],
  'vibrant-pop': ['Colorful'],
};

function ThemePanel(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets');

  return (
    <div className="flex flex-col h-full">
      {/* Tab switcher */}
      <div className="flex border-b px-3 pt-2">
        <button
          type="button"
          className={cn(
            'px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'presets'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
          onClick={() => setActiveTab('presets')}
        >
          Presets
        </button>
        <button
          type="button"
          className={cn(
            'px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'customize'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
          onClick={() => setActiveTab('customize')}
        >
          Customize
        </button>
      </div>

      {activeTab === 'presets' ? (
        <PresetGrid />
      ) : (
        <div className="p-3 space-y-6">
          <ColorPalette />
          <FontSelector />
          <SpacingControls />
        </div>
      )}
    </div>
  );
}

function PresetGrid(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const currentThemeId = useAppSelector((state) => state.presentation.themeId);
  const presets = getAllThemePresets();
  const [filter, setFilter] = useState<ThemeFilter>('All');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSelectPreset = useCallback(
    (presetId: string) => {
      try {
        const tokens = getThemePreset(presetId);
        dispatch(setThemeId(presetId));
        dispatch(loadTheme({ tokens, presetId }));
      } catch {
        // ignore invalid preset
      }
    },
    [dispatch],
  );

  const filters: ThemeFilter[] = ['All', 'Dark', 'Light', 'Professional', 'Colorful'];

  const filteredPresets = useMemo(() => {
    let result = presets;

    if (filter !== 'All') {
      result = result.filter((preset) => {
        const categories = THEME_CATEGORIES[preset.id] ?? [];
        if (categories.includes(filter)) return true;
        if (filter === 'Dark') return isDarkTheme(preset.tokens.colors.background);
        if (filter === 'Light') return !isDarkTheme(preset.tokens.colors.background);
        return false;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    return result;
  }, [presets, filter, search]);

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Header with description */}
      <p className="text-[11px] text-muted-foreground leading-snug">
        Themes let you customize colors, fonts, logo and other visual styling
      </p>

      {/* Filter pills + search toggle */}
      <div className="flex items-center gap-1 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors',
              filter === f
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          className={cn(
            'p-1 rounded-full transition-colors ml-auto',
            showSearch ? 'bg-muted' : 'hover:bg-muted',
          )}
          onClick={() => {
            setShowSearch(!showSearch);
            if (showSearch) setSearch('');
          }}
        >
          {showSearch ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Search input */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search themes..."
            className="h-8 text-xs pl-7"
            autoFocus
          />
        </div>
      )}

      {/* Theme cards grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredPresets.map((preset) => {
          const isActive = currentThemeId === preset.id;
          const colors = preset.tokens.colors;
          const dark = isDarkTheme(colors.background);

          return (
            <button
              key={preset.id}
              type="button"
              className={cn(
                'group relative flex flex-col rounded-xl overflow-hidden transition-all',
                'border-2',
                isActive
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/40 hover:shadow-sm',
              )}
              onClick={() => handleSelectPreset(preset.id)}
              title={preset.description}
            >
              {/* Preview card */}
              <div
                className="flex flex-col justify-center px-3.5 py-5 gap-1"
                style={{ backgroundColor: colors.background }}
              >
                <span
                  className="text-base font-semibold leading-tight"
                  style={{
                    color: colors.primary,
                    fontFamily: preset.tokens.typography.fontFamily.heading,
                  }}
                >
                  Title
                </span>
                <span
                  className="text-[11px] leading-snug"
                  style={{
                    color: colors.textSecondary,
                    fontFamily: preset.tokens.typography.fontFamily.body,
                  }}
                >
                  Body &{' '}
                  <span
                    className="underline"
                    style={{ color: colors.accent }}
                  >
                    link
                  </span>
                </span>
              </div>

              {/* Name + actions row */}
              <div
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1.5 border-t',
                  isActive ? 'border-primary/20' : 'border-border',
                )}
              >
                {isActive && (
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
                <span
                  className={cn(
                    'text-[11px] font-medium truncate',
                    isActive ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {preset.name}
                </span>
                <button
                  type="button"
                  className="ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </button>
          );
        })}
      </div>

      {filteredPresets.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No themes match your search.
        </p>
      )}
    </div>
  );
}

function ColorPalette(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector((state) => state.theme.activeTokens);

  if (!activeTokens) {
    return (
      <div className="text-xs text-muted-foreground">Select a theme to customize colors.</div>
    );
  }

  const colorKeys = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'background', label: 'Background' },
    { key: 'surface', label: 'Surface' },
    { key: 'textPrimary', label: 'Text Primary' },
    { key: 'textSecondary', label: 'Text Secondary' },
    { key: 'border', label: 'Border' },
  ] as const;

  return (
    <div>
      <Label className="text-xs font-semibold mb-2 block">Colors</Label>
      <div className="grid grid-cols-2 gap-2">
        {colorKeys.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="color"
              value={activeTokens.colors[key]}
              onChange={(e) =>
                dispatch(updateColorToken({ key, value: e.target.value }))
              }
              className="h-7 w-7 cursor-pointer rounded border p-0.5"
              title={label}
            />
            <span className="text-[10px] text-muted-foreground truncate">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FontSelector(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector((state) => state.theme.activeTokens);

  if (!activeTokens) return <></>;

  const fonts = [
    'Inter',
    'Geist',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Source Sans 3',
    'IBM Plex Sans',
    'DM Sans',
    'Fira Code',
    'JetBrains Mono',
  ];

  return (
    <div>
      <Label className="text-xs font-semibold mb-2 block">Typography</Label>
      <div className="space-y-2">
        <div>
          <Label className="text-[10px] text-muted-foreground">Heading Font</Label>
          <Select
            value={activeTokens.typography.fontFamily.heading}
            onValueChange={(value) =>
              dispatch(updateTypographyToken({ path: 'fontFamily.heading', value }))
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font} value={font} className="text-xs">
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Body Font</Label>
          <Select
            value={activeTokens.typography.fontFamily.body}
            onValueChange={(value) =>
              dispatch(updateTypographyToken({ path: 'fontFamily.body', value }))
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font} value={font} className="text-xs">
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Monospace Font</Label>
          <Select
            value={activeTokens.typography.fontFamily.mono}
            onValueChange={(value) =>
              dispatch(updateTypographyToken({ path: 'fontFamily.mono', value }))
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.filter((f) => f.includes('Code') || f.includes('Mono')).map((font) => (
                <SelectItem key={font} value={font} className="text-xs">
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function SpacingControls(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector((state) => state.theme.activeTokens);

  if (!activeTokens) return <></>;

  const spacingFields = [
    { key: 'sectionGap' as const, label: 'Section Gap', min: 0, max: 128, step: 4 },
    { key: 'slotGap' as const, label: 'Slot Gap', min: 0, max: 64, step: 2 },
    { key: 'innerPadding' as const, label: 'Inner Padding', min: 0, max: 96, step: 4 },
  ];

  return (
    <div>
      <Label className="text-xs font-semibold mb-2 block">Spacing</Label>
      <div className="space-y-3">
        {spacingFields.map(({ key, label, min, max, step }) => {
          const value = activeTokens.spacing[key];
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-[10px] text-muted-foreground">{label}</Label>
                <span className="text-[10px] text-muted-foreground">{String(value)}px</span>
              </div>
              <Slider
                value={[typeof value === 'number' ? value : 0]}
                onValueChange={(v) => {
                  const newVal = v[0];
                  if (newVal !== undefined) {
                    dispatch(updateSpacingToken({ key, value: newVal }));
                  }
                }}
                min={min}
                max={max}
                step={step}
                className="w-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Layout Picker Panel
// ============================================================

function LayoutPickerPanel(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const selectedSectionId = useAppSelector((state) => state.editor.selectedSectionId);
  const sections = useAppSelector((state) => state.presentation.sections);
  const allLayouts = getAllLayouts();

  const selectedSection = selectedSectionId
    ? sections.find((s) => s.id === selectedSectionId)
    : null;

  const handleLayoutChange = useCallback(
    (layoutId: string) => {
      if (!selectedSectionId) return;
      dispatch(updateSectionLayout({ sectionId: selectedSectionId, layoutId }));
    },
    [dispatch, selectedSectionId],
  );

  if (!selectedSection) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Select a section to change its layout.
        </p>
      </div>
    );
  }

  // Group layouts by category
  const layoutsByCategory = new Map<LayoutCategory, typeof allLayouts>();
  for (const layout of allLayouts) {
    const existing = layoutsByCategory.get(layout.category);
    if (existing) {
      existing.push(layout);
    } else {
      layoutsByCategory.set(layout.category, [layout]);
    }
  }

  const categoryLabels: Record<string, string> = {
    COVER: 'Cover / Hero',
    CONTENT: 'Content',
    DATA: 'Data & Charts',
    MEDIA: 'Media',
    COMPARISON: 'Comparison',
    TIMELINE: 'Timeline',
    CTA: 'Call to Action',
    BLANK: 'Blank',
  };

  return (
    <div className="p-3 space-y-4">
      <div>
        <Label className="text-xs font-semibold mb-1 block">Current Layout</Label>
        <p className="text-xs text-muted-foreground">
          {(() => {
            try {
              return getLayout(selectedSection.layoutId).name;
            } catch {
              return selectedSection.layoutId;
            }
          })()}
        </p>
      </div>

      {LAYOUT_CATEGORIES.map((category) => {
        const layouts = layoutsByCategory.get(category);
        if (!layouts || layouts.length === 0) return null;

        return (
          <div key={category}>
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              {categoryLabels[category] ?? category}
            </Label>
            <div className="grid grid-cols-2 gap-1.5">
              {layouts.map((layout) => {
                const isActive = selectedSection.layoutId === layout.id;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    className={cn(
                      'flex flex-col items-center rounded-md border p-2 transition-all text-center',
                      isActive
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/50 hover:bg-accent/30',
                    )}
                    onClick={() => handleLayoutChange(layout.id)}
                    title={layout.description}
                  >
                    {/* Layout visual preview */}
                    <LayoutMiniPreview layoutId={layout.id} />
                    <span className="text-[9px] leading-tight mt-1 truncate w-full">
                      {layout.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LayoutMiniPreview({ layoutId }: { layoutId: string }): React.JSX.Element {
  // Simple visual representation of each layout type
  const previewMap: Record<string, React.ReactNode> = {
    'hero-split': (
      <div className="flex gap-0.5 w-full h-6">
        <div className="flex-1 bg-muted-foreground/20 rounded-sm" />
        <div className="flex-1 bg-muted-foreground/10 rounded-sm" />
      </div>
    ),
    'hero-center': (
      <div className="flex flex-col items-center justify-center w-full h-6 gap-0.5">
        <div className="h-1.5 w-8 bg-muted-foreground/20 rounded-sm" />
        <div className="h-1 w-6 bg-muted-foreground/10 rounded-sm" />
      </div>
    ),
    'content-text': (
      <div className="flex flex-col gap-0.5 w-full h-6 p-0.5">
        <div className="h-1.5 w-6 bg-muted-foreground/20 rounded-sm" />
        <div className="flex-1 bg-muted-foreground/10 rounded-sm" />
      </div>
    ),
    'content-two-column': (
      <div className="flex gap-0.5 w-full h-6 p-0.5">
        <div className="flex-1 bg-muted-foreground/15 rounded-sm" />
        <div className="flex-1 bg-muted-foreground/15 rounded-sm" />
      </div>
    ),
  };

  return (
    <div className="w-full h-8 rounded bg-muted/50 flex items-center justify-center p-0.5">
      {previewMap[layoutId] ?? (
        <div className="h-1 w-6 bg-muted-foreground/20 rounded-sm" />
      )}
    </div>
  );
}

// ============================================================
// Text Formatting Panel
// ============================================================

function TextFormattingPanel(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const selectedSlotId = useAppSelector((state) => state.editor.selectedSlotId);
  const selectedSectionId = useAppSelector((state) => state.editor.selectedSectionId);
  const sections = useAppSelector((state) => state.presentation.sections);
  const [imageUrlDraft, setImageUrlDraft] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageError, setImageError] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const selectedSection = selectedSectionId
    ? sections.find((section) => section.id === selectedSectionId)
    : null;

  const selectedSlot = useMemo(() => {
    if (!selectedSection || !selectedSlotId) return null;
    try {
      const layout = getLayout(selectedSection.layoutId);
      return layout.slots.find((slot) => slot.id === selectedSlotId) ?? null;
    } catch {
      return null;
    }
  }, [selectedSection, selectedSlotId]);

  const selectedImageValue =
    selectedSlot?.type === 'IMAGE' &&
    selectedSection &&
    typeof selectedSection.content[selectedSlot.id] === 'string'
      ? (selectedSection.content[selectedSlot.id] as string)
      : '';

  useEffect(() => {
    if (selectedSlot?.type === 'IMAGE') {
      setImageUrlDraft(selectedImageValue);
      setImageError('');
    } else {
      setImageUrlDraft('');
      setImagePrompt('');
      setImageError('');
    }
  }, [selectedImageValue, selectedSlot]);

  const applyImageUrl = useCallback(() => {
    if (!selectedSection || !selectedSlot || selectedSlot.type !== 'IMAGE') return;

    const nextUrl = imageUrlDraft.trim();
    dispatch(
      updateSectionSlotContent({
        sectionId: selectedSection.id,
        slotId: selectedSlot.id,
        content: nextUrl,
      }),
    );
    setImageError('');
  }, [dispatch, imageUrlDraft, selectedSection, selectedSlot]);

  const clearImage = useCallback(() => {
    if (!selectedSection || !selectedSlot || selectedSlot.type !== 'IMAGE') return;
    dispatch(
      updateSectionSlotContent({
        sectionId: selectedSection.id,
        slotId: selectedSlot.id,
        content: '',
      }),
    );
    setImageUrlDraft('');
    setImageError('');
  }, [dispatch, selectedSection, selectedSlot]);

  const generateImage = useCallback(async () => {
    if (!selectedSection || !selectedSlot || selectedSlot.type !== 'IMAGE') return;
    if (!imagePrompt.trim()) return;

    setIsGeneratingImage(true);
    setImageError('');

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: imagePrompt.trim() }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; data?: { url?: string }; error?: { message?: string } }
        | null;

      if (!response.ok || !payload?.success || !payload.data?.url) {
        throw new Error(payload?.error?.message ?? 'Failed to generate image');
      }

      dispatch(
        updateSectionSlotContent({
          sectionId: selectedSection.id,
          slotId: selectedSlot.id,
          content: payload.data.url,
        }),
      );
      setImageUrlDraft(payload.data.url);
    } catch (error: unknown) {
      setImageError(error instanceof Error ? error.message : 'Image generation failed');
    } finally {
      setIsGeneratingImage(false);
    }
  }, [dispatch, imagePrompt, selectedSection, selectedSlot]);

  if (!selectedSlotId) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Click on a text or image slot to edit it.
        </p>
      </div>
    );
  }

  if (!selectedSection || !selectedSlot) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Select a valid slot to edit.
        </p>
      </div>
    );
  }

  if (selectedSlot.type === 'IMAGE') {
    return (
      <div className="p-3 space-y-4">
        <div>
          <Label className="text-xs font-semibold mb-1 block">Image Slot</Label>
          <p className="text-xs text-muted-foreground">
            {selectedSlot.label}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-prompt" className="text-xs font-semibold">
            Generate Image
          </Label>
          <Input
            id="image-prompt"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the image you want..."
            disabled={isGeneratingImage}
          />
          <Button
            onClick={() => void generateImage()}
            disabled={!imagePrompt.trim() || isGeneratingImage}
            className="w-full gap-2"
          >
            {isGeneratingImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGeneratingImage ? 'Generating...' : 'Generate Image'}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-url" className="text-xs font-semibold">
            Image URL
          </Label>
          <Input
            id="image-url"
            value={imageUrlDraft}
            onChange={(e) => setImageUrlDraft(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={applyImageUrl}
              disabled={isGeneratingImage}
              className="flex-1"
            >
              Apply URL
            </Button>
            <Button
              variant="outline"
              onClick={clearImage}
              disabled={isGeneratingImage}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {imageError && (
          <p className="text-xs text-destructive">{imageError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      <div>
        <Label className="text-xs font-semibold mb-2 block">Text Formatting</Label>
        <p className="text-xs text-muted-foreground">
          Use the floating toolbar above the selected text for formatting options.
          Select text and use the bubble menu for bold, italic, headings, alignment, and more.
        </p>
      </div>

      <div>
        <Label className="text-xs font-semibold mb-2 block">Keyboard Shortcuts</Label>
        <div className="space-y-1">
          {[
            { keys: 'Ctrl+B', action: 'Bold' },
            { keys: 'Ctrl+I', action: 'Italic' },
            { keys: 'Ctrl+U', action: 'Underline' },
            { keys: '# + Space', action: 'Heading 1' },
            { keys: '## + Space', action: 'Heading 2' },
            { keys: '- + Space', action: 'Bullet list' },
            { keys: '1. + Space', action: 'Numbered list' },
          ].map(({ keys, action }) => (
            <div key={keys} className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">{action}</span>
              <kbd className="rounded border bg-muted px-1 py-0.5 text-[9px] font-mono">
                {keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
