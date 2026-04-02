'use client';

import { useCallback } from 'react';
import {
  Palette,
  LayoutGrid,
  Type,
  Check,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRightPanelView } from '@/store/slices/editor-slice';
import { updateSectionLayout } from '@/store/slices/presentation-slice';
import { setThemeId } from '@/store/slices/presentation-slice';
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
          label="Text"
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

function ThemePanel(): React.JSX.Element {
  return (
    <div className="p-3 space-y-6">
      <PresetGrid />
      <ColorPalette />
      <FontSelector />
      <SpacingControls />
    </div>
  );
}

function PresetGrid(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const currentThemeId = useAppSelector((state) => state.presentation.themeId);
  const presets = getAllThemePresets();

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

  return (
    <div>
      <Label className="text-xs font-semibold mb-2 block">Theme Presets</Label>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => {
          const isActive = currentThemeId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              className={cn(
                'relative flex flex-col items-center rounded-md border p-1.5 transition-all text-center',
                isActive
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-border hover:border-primary/50',
              )}
              onClick={() => handleSelectPreset(preset.id)}
              title={preset.description}
            >
              {/* Color preview dots */}
              <div className="flex gap-0.5 mb-1">
                <div
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: preset.tokens.colors.primary }}
                />
                <div
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: preset.tokens.colors.secondary }}
                />
                <div
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: preset.tokens.colors.accent }}
                />
              </div>
              <span className="text-[9px] leading-tight truncate w-full">
                {preset.name}
              </span>
              {isActive && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
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
  const selectedSlotId = useAppSelector((state) => state.editor.selectedSlotId);

  if (!selectedSlotId) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Click on a text element to format it.
        </p>
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
