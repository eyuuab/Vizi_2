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
import { setRightPanelView, selectSlot, setEditing } from '@/store/slices/editor-slice';
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
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
                >
                  <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
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

type LayoutFilter = 'All' | LayoutCategory;

const CATEGORY_LABELS: Record<string, string> = {
  All: 'All',
  COVER: 'Cover',
  CONTENT: 'Content',
  DATA: 'Data',
  MEDIA: 'Media',
  COMPARISON: 'Compare',
  TIMELINE: 'Timeline',
  CTA: 'CTA',
  BLANK: 'Blank',
};

function LayoutPickerPanel(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const selectedSectionId = useAppSelector((state) => state.editor.selectedSectionId);
  const sections = useAppSelector((state) => state.presentation.sections);
  const allLayouts = getAllLayouts();
  const [filter, setFilter] = useState<LayoutFilter>('All');

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

  const filteredLayouts = useMemo(() => {
    if (filter === 'All') return allLayouts;
    return allLayouts.filter((l) => l.category === filter);
  }, [allLayouts, filter]);

  const currentLayoutName = useMemo(() => {
    if (!selectedSection) return null;
    try {
      return getLayout(selectedSection.layoutId).name;
    } catch {
      return selectedSection.layoutId;
    }
  }, [selectedSection]);

  if (!selectedSection) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <LayoutGrid className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">No section selected</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click on a slide section to change its layout
          </p>
        </div>
      </div>
    );
  }

  const filterOptions: LayoutFilter[] = ['All', ...LAYOUT_CATEGORIES];

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Current layout indicator */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
        <div className="h-8 w-10 shrink-0">
          <LayoutMiniPreview layoutId={selectedSection.layoutId} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground">Current layout</p>
          <p className="text-xs font-medium truncate">{currentLayoutName}</p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1 flex-wrap">
        {filterOptions.map((f) => {
          const label = CATEGORY_LABELS[f] ?? f;
          return (
            <button
              key={f}
              type="button"
              className={cn(
                'px-2 py-1 rounded-full text-[10px] font-medium transition-colors',
                filter === f
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
              onClick={() => setFilter(f)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Layout cards grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredLayouts.map((layout) => {
          const isActive = selectedSection.layoutId === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              className={cn(
                'group relative flex flex-col rounded-xl overflow-hidden transition-all border-2',
                isActive
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/40 hover:shadow-sm',
              )}
              onClick={() => handleLayoutChange(layout.id)}
              title={layout.description}
            >
              {/* Preview area */}
              <div className="bg-muted/30 px-2.5 py-3.5 flex items-center justify-center">
                <LayoutMiniPreview layoutId={layout.id} />
              </div>

              {/* Name row */}
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1.5 border-t',
                  isActive ? 'border-primary/20 bg-primary/5' : 'border-border',
                )}
              >
                {isActive && (
                  <Check className="h-3 w-3 text-primary shrink-0" />
                )}
                <span
                  className={cn(
                    'text-[10px] font-medium truncate',
                    isActive ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {layout.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredLayouts.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No layouts in this category.
        </p>
      )}
    </div>
  );
}

function LayoutMiniPreview({ layoutId }: { layoutId: string }): React.JSX.Element {
  const previewMap: Record<string, React.ReactNode> = {
    // Cover layouts
    'hero-split': (
      <div className="flex gap-1 w-full h-10">
        <div className="flex-1 flex flex-col justify-center gap-0.5 px-1">
          <div className="h-1.5 w-8 bg-primary/40 rounded-sm" />
          <div className="h-1 w-6 bg-muted-foreground/20 rounded-sm" />
        </div>
        <div className="w-[45%] bg-primary/15 rounded-sm" />
      </div>
    ),
    'hero-center': (
      <div className="flex flex-col items-center justify-center w-full h-10 gap-1">
        <div className="h-2 w-12 bg-primary/40 rounded-sm" />
        <div className="h-1 w-8 bg-muted-foreground/20 rounded-sm" />
      </div>
    ),
    'hero-gradient': (
      <div className="flex flex-col items-center justify-center w-full h-10 gap-1 bg-gradient-to-br from-primary/20 to-primary/5 rounded-sm">
        <div className="h-2 w-10 bg-primary/50 rounded-sm" />
        <div className="h-1 w-6 bg-muted-foreground/20 rounded-sm" />
      </div>
    ),
    // Content layouts
    'content-text': (
      <div className="flex flex-col gap-1 w-full h-10 p-1">
        <div className="h-1.5 w-8 bg-primary/40 rounded-sm" />
        <div className="h-1 w-full bg-muted-foreground/15 rounded-sm" />
        <div className="h-1 w-3/4 bg-muted-foreground/15 rounded-sm" />
        <div className="h-1 w-5/6 bg-muted-foreground/10 rounded-sm" />
      </div>
    ),
    'content-two-column': (
      <div className="flex flex-col gap-1 w-full h-10 p-1">
        <div className="h-1.5 w-8 bg-primary/40 rounded-sm" />
        <div className="flex gap-1 flex-1">
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1 w-full bg-muted-foreground/15 rounded-sm" />
            <div className="h-1 w-3/4 bg-muted-foreground/10 rounded-sm" />
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1 w-full bg-muted-foreground/15 rounded-sm" />
            <div className="h-1 w-3/4 bg-muted-foreground/10 rounded-sm" />
          </div>
        </div>
      </div>
    ),
    'content-text-image': (
      <div className="flex gap-1 w-full h-10 p-1">
        <div className="flex-[3] flex flex-col gap-0.5">
          <div className="h-1.5 w-8 bg-primary/40 rounded-sm" />
          <div className="h-1 w-full bg-muted-foreground/15 rounded-sm" />
          <div className="h-1 w-3/4 bg-muted-foreground/10 rounded-sm" />
        </div>
        <div className="flex-[2] bg-primary/10 rounded-sm" />
      </div>
    ),
    'content-image-text': (
      <div className="flex gap-1 w-full h-10 p-1">
        <div className="flex-[2] bg-primary/10 rounded-sm" />
        <div className="flex-[3] flex flex-col gap-0.5">
          <div className="h-1.5 w-8 bg-primary/40 rounded-sm" />
          <div className="h-1 w-full bg-muted-foreground/15 rounded-sm" />
          <div className="h-1 w-3/4 bg-muted-foreground/10 rounded-sm" />
        </div>
      </div>
    ),
    // Data layouts
    'data-chart': (
      <div className="flex flex-col gap-1 w-full h-10 p-1">
        <div className="h-1.5 w-6 bg-primary/40 rounded-sm" />
        <div className="flex-1 flex items-end gap-0.5 px-0.5">
          <div className="w-2 h-3 bg-primary/30 rounded-t-sm" />
          <div className="w-2 h-5 bg-primary/40 rounded-t-sm" />
          <div className="w-2 h-4 bg-primary/25 rounded-t-sm" />
          <div className="w-2 h-6 bg-primary/35 rounded-t-sm" />
          <div className="w-2 h-3.5 bg-primary/20 rounded-t-sm" />
        </div>
      </div>
    ),
    'data-stats': (
      <div className="flex flex-col gap-1 w-full h-10 p-1">
        <div className="h-1 w-6 bg-primary/40 rounded-sm" />
        <div className="flex-1 grid grid-cols-3 gap-0.5">
          {[0.45, 0.35, 0.4].map((o, i) => (
            <div key={i} className="flex flex-col items-center justify-center rounded-sm bg-muted/60 gap-0.5">
              <div className="h-1.5 w-3 rounded-sm" style={{ backgroundColor: `rgba(var(--primary), ${o})` }} />
              <div className="h-0.5 w-4 bg-muted-foreground/15 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    ),
    'data-table': (
      <div className="flex flex-col gap-0.5 w-full h-10 p-1">
        <div className="h-1.5 w-6 bg-primary/40 rounded-sm mb-0.5" />
        <div className="h-1 w-full bg-primary/20 rounded-sm" />
        <div className="h-1 w-full bg-muted-foreground/10 rounded-sm" />
        <div className="h-1 w-full bg-muted-foreground/8 rounded-sm" />
        <div className="h-1 w-full bg-muted-foreground/10 rounded-sm" />
      </div>
    ),
    // Media layouts
    'media-full': (
      <div className="relative w-full h-10 bg-primary/10 rounded-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-1 left-1.5 flex flex-col gap-0.5">
          <div className="h-1.5 w-8 bg-white/60 rounded-sm" />
          <div className="h-1 w-5 bg-white/30 rounded-sm" />
        </div>
      </div>
    ),
    'media-gallery': (
      <div className="flex flex-col gap-0.5 w-full h-10 p-0.5">
        <div className="h-1 w-6 bg-primary/40 rounded-sm mb-0.5" />
        <div className="flex-1 grid grid-cols-2 gap-0.5">
          <div className="bg-primary/12 rounded-sm" />
          <div className="bg-primary/8 rounded-sm" />
          <div className="bg-primary/10 rounded-sm" />
          <div className="bg-primary/6 rounded-sm" />
        </div>
      </div>
    ),
    // Comparison layouts
    'comparison-two': (
      <div className="flex flex-col gap-0.5 w-full h-10 p-1">
        <div className="h-1.5 w-6 bg-primary/40 rounded-sm" />
        <div className="flex-1 flex gap-1">
          <div className="flex-1 flex flex-col gap-0.5 border border-muted-foreground/10 rounded-sm p-0.5">
            <div className="h-1 w-4 bg-green-500/30 rounded-sm" />
            <div className="h-0.5 w-full bg-muted-foreground/10 rounded-sm" />
            <div className="h-0.5 w-3/4 bg-muted-foreground/10 rounded-sm" />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 border border-muted-foreground/10 rounded-sm p-0.5">
            <div className="h-1 w-4 bg-blue-500/30 rounded-sm" />
            <div className="h-0.5 w-full bg-muted-foreground/10 rounded-sm" />
            <div className="h-0.5 w-3/4 bg-muted-foreground/10 rounded-sm" />
          </div>
        </div>
      </div>
    ),
    'comparison-three': (
      <div className="flex flex-col gap-0.5 w-full h-10 p-1">
        <div className="h-1 w-6 bg-primary/40 rounded-sm" />
        <div className="flex-1 flex gap-0.5">
          {['green', 'blue', 'purple'].map((c) => (
            <div key={c} className="flex-1 flex flex-col gap-0.5 border border-muted-foreground/10 rounded-sm p-0.5">
              <div className={`h-0.5 w-3 bg-${c}-500/30 rounded-sm`} />
              <div className="h-0.5 w-full bg-muted-foreground/8 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    ),
    // Timeline layouts
    'timeline-vertical': (
      <div className="flex flex-col gap-0 w-full h-10 p-1">
        <div className="h-1 w-6 bg-primary/40 rounded-sm mb-1" />
        <div className="flex-1 flex gap-1">
          <div className="w-0.5 bg-primary/25 rounded-full shrink-0 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary/50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary/40" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary/30" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div className="h-1 w-8 bg-muted-foreground/15 rounded-sm" />
            <div className="h-1 w-6 bg-muted-foreground/10 rounded-sm" />
            <div className="h-1 w-7 bg-muted-foreground/10 rounded-sm" />
          </div>
        </div>
      </div>
    ),
    'timeline-horizontal': (
      <div className="flex flex-col gap-1 w-full h-10 p-1">
        <div className="h-1 w-6 bg-primary/40 rounded-sm" />
        <div className="flex-1 flex flex-col justify-center gap-0.5">
          <div className="flex justify-between px-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
          </div>
          <div className="h-0.5 w-full bg-primary/20 rounded-full" />
        </div>
      </div>
    ),
    // CTA layout
    'cta-simple': (
      <div className="flex flex-col items-center justify-center w-full h-10 gap-1">
        <div className="h-2 w-10 bg-primary/40 rounded-sm" />
        <div className="h-1 w-7 bg-muted-foreground/15 rounded-sm" />
        <div className="h-2 w-6 bg-primary/60 rounded-full" />
      </div>
    ),
    // Blank layout
    'blank': (
      <div className="flex items-center justify-center w-full h-10 border border-dashed border-muted-foreground/20 rounded-sm">
        <div className="h-2 w-2 text-muted-foreground/30">+</div>
      </div>
    ),
  };

  return (
    <div className="w-full h-12 rounded-md bg-muted/40 flex items-center justify-center p-1">
      {previewMap[layoutId] ?? (
        <div className="flex flex-col gap-0.5 items-center">
          <div className="h-1 w-6 bg-muted-foreground/20 rounded-sm" />
          <div className="h-1 w-4 bg-muted-foreground/10 rounded-sm" />
        </div>
      )}
    </div>
  );
}

// ============================================================
// Text Formatting / Slot Edit Panel
// ============================================================

/** Layout variant suggestions: when user is on one layout, suggest related simpler/complex ones */
const LAYOUT_VARIANTS: Record<string, { id: string; label: string }[]> = {
  'comparison-three': [{ id: 'comparison-two', label: 'Switch to 2 Columns' }],
  'comparison-two': [{ id: 'comparison-three', label: 'Switch to 3 Columns' }],
  'content-two-column': [
    { id: 'content-text', label: 'Switch to Single Column' },
    { id: 'content-text-image', label: 'Switch to Text + Image' },
  ],
  'content-text': [
    { id: 'content-two-column', label: 'Switch to Two Columns' },
    { id: 'content-text-image', label: 'Add Image Column' },
  ],
  'content-text-image': [
    { id: 'content-image-text', label: 'Swap Image Side' },
    { id: 'content-text', label: 'Remove Image' },
  ],
  'content-image-text': [
    { id: 'content-text-image', label: 'Swap Image Side' },
    { id: 'content-text', label: 'Remove Image' },
  ],
  'hero-split': [
    { id: 'hero-center', label: 'Switch to Centered' },
    { id: 'hero-gradient', label: 'Switch to Gradient' },
  ],
  'hero-center': [
    { id: 'hero-split', label: 'Switch to Split' },
    { id: 'hero-gradient', label: 'Switch to Gradient' },
  ],
  'hero-gradient': [
    { id: 'hero-center', label: 'Switch to Centered' },
    { id: 'hero-split', label: 'Switch to Split' },
  ],
  'data-stats': [
    { id: 'data-chart', label: 'Switch to Chart' },
    { id: 'data-table', label: 'Switch to Table' },
  ],
  'data-chart': [
    { id: 'data-stats', label: 'Switch to Stats' },
    { id: 'data-table', label: 'Switch to Table' },
  ],
  'data-table': [
    { id: 'data-stats', label: 'Switch to Stats' },
    { id: 'data-chart', label: 'Switch to Chart' },
  ],
  'timeline-vertical': [{ id: 'timeline-horizontal', label: 'Switch to Horizontal' }],
  'timeline-horizontal': [{ id: 'timeline-vertical', label: 'Switch to Vertical' }],
  'media-full': [{ id: 'media-gallery', label: 'Switch to Gallery' }],
  'media-gallery': [{ id: 'media-full', label: 'Switch to Full Image' }],
};

const SLOT_TYPE_ICONS: Record<string, string> = {
  HEADING: 'H',
  TEXT: 'T',
  RICHTEXT: 'R',
  IMAGE: 'I',
  LIST: 'L',
  STATS: 'S',
  CHART: 'C',
  CONFIG: 'G',
  URL: 'U',
  VIDEO: 'V',
  MERMAID: 'M',
  TABLE: 'B',
};

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

  const currentLayout = useMemo(() => {
    if (!selectedSection) return null;
    try {
      return getLayout(selectedSection.layoutId);
    } catch {
      return null;
    }
  }, [selectedSection]);

  const selectedSlot = useMemo(() => {
    if (!currentLayout || !selectedSlotId) return null;
    return currentLayout.slots.find((slot) => slot.id === selectedSlotId) ?? null;
  }, [currentLayout, selectedSlotId]);

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
    dispatch(
      updateSectionSlotContent({
        sectionId: selectedSection.id,
        slotId: selectedSlot.id,
        content: imageUrlDraft.trim(),
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

  const handleClearSlot = useCallback(
    (slotId: string, slotType: string) => {
      if (!selectedSection) return;
      let emptyValue: string | unknown[] | Record<string, unknown> = '';
      if (slotType === 'LIST' || slotType === 'STATS') emptyValue = [];
      else if (slotType === 'CHART' || slotType === 'CONFIG') emptyValue = {};
      dispatch(
        updateSectionSlotContent({
          sectionId: selectedSection.id,
          slotId,
          content: emptyValue,
        }),
      );
    },
    [dispatch, selectedSection],
  );

  const handleSwitchLayout = useCallback(
    (layoutId: string) => {
      if (!selectedSectionId) return;
      dispatch(updateSectionLayout({ sectionId: selectedSectionId, layoutId }));
    },
    [dispatch, selectedSectionId],
  );

  // No section selected at all
  if (!selectedSection || !currentLayout) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Type className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">No section selected</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click on a slide to edit its content
          </p>
        </div>
      </div>
    );
  }

  // Section selected but no specific slot - show slot overview
  if (!selectedSlotId || !selectedSlot) {
    const variants = LAYOUT_VARIANTS[selectedSection.layoutId] ?? [];
    return (
      <div className="p-3 space-y-4">
        {/* Section slot overview */}
        <div>
          <Label className="text-xs font-semibold mb-2 block">
            Slide Content ({currentLayout.slots.length} slots)
          </Label>
          <p className="text-[10px] text-muted-foreground mb-2">
            Click a slot on the slide or below to edit it
          </p>
          <div className="space-y-1">
            {currentLayout.slots.map((slot) => {
              const hasContent = slotHasContent(selectedSection.content[slot.id], slot.type);
              return (
                <button
                  key={slot.id}
                  type="button"
                  className={cn(
                    'w-full flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left transition-colors',
                    'hover:bg-accent/50 hover:border-primary/30',
                  )}
                  onClick={() => {
                    dispatch(selectSlot(slot.id));
                    dispatch(setEditing(true));
                  }}
                >
                  <span
                    className={cn(
                      'h-5 w-5 rounded text-[9px] font-bold flex items-center justify-center shrink-0',
                      hasContent
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {SLOT_TYPE_ICONS[slot.type] ?? '?'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium truncate block">{slot.label}</span>
                    <span className="text-[10px] text-muted-foreground">{slot.type}</span>
                  </div>
                  {hasContent && (
                    <button
                      type="button"
                      className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearSlot(slot.id, slot.type);
                      }}
                      title="Clear slot content"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout variant suggestions */}
        {variants.length > 0 && (
          <div>
            <Label className="text-xs font-semibold mb-2 block">
              Layout Variants
            </Label>
            <p className="text-[10px] text-muted-foreground mb-2">
              Quickly switch to a related layout. Content is preserved automatically.
            </p>
            <div className="space-y-1">
              {variants.map((variant) => (
                <Button
                  key={variant.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs h-8 gap-2"
                  onClick={() => handleSwitchLayout(variant.id)}
                >
                  <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
                  {variant.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // IMAGE slot editor
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

  // LIST slot editor in sidebar
  if (selectedSlot.type === 'LIST') {
    const listItems = parseListContent(selectedSection.content[selectedSlot.id]);
    return (
      <div className="p-3 space-y-4">
        <div>
          <Label className="text-xs font-semibold mb-1 block">List Slot</Label>
          <p className="text-xs text-muted-foreground">
            {selectedSlot.label} — Edit items in the inline editor on the canvas, or use the layout variants below.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {listItems.length} items
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs gap-1.5"
          onClick={() => handleClearSlot(selectedSlot.id, selectedSlot.type)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear All Items
        </Button>
      </div>
    );
  }

  // STATS slot editor in sidebar
  if (selectedSlot.type === 'STATS') {
    const statItems = parseStatsContent(selectedSection.content[selectedSlot.id]);
    return (
      <div className="p-3 space-y-4">
        <div>
          <Label className="text-xs font-semibold mb-1 block">Stats Slot</Label>
          <p className="text-xs text-muted-foreground">
            {selectedSlot.label} — Edit stats in the inline editor on the canvas.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {statItems.length} statistics
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs gap-1.5"
          onClick={() => handleClearSlot(selectedSlot.id, selectedSlot.type)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear All Stats
        </Button>
      </div>
    );
  }

  // Default: text formatting info
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

// ============================================================
// Helpers
// ============================================================

function slotHasContent(content: unknown, slotType: string): boolean {
  if (content === undefined || content === null) return false;
  if (typeof content === 'string') return content.trim().length > 0;
  if (Array.isArray(content)) return content.length > 0;
  if (slotType === 'CHART' || slotType === 'CONFIG') {
    return typeof content === 'object' && Object.keys(content as object).length > 0;
  }
  return false;
}

function parseListContent(content: unknown): unknown[] {
  if (Array.isArray(content)) return content;
  return [];
}

function parseStatsContent(content: unknown): unknown[] {
  if (Array.isArray(content)) return content;
  return [];
}
