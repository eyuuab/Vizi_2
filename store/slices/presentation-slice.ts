import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SectionContent, StyleOverrides, TransitionConfig } from '@/types/presentation';
import { LAYOUT_REGISTRY } from '@/lib/layouts';
import type { SlotType } from '@/types/enums';

export interface SectionState {
  id: string;
  layoutId: string;
  order: number;
  content: SectionContent;
  styleOverrides: StyleOverrides;
  transitions: TransitionConfig;
  notes: string | null;
  isHidden: boolean;
}

export interface PresentationState {
  id: string | null;
  title: string;
  description: string | null;
  themeId: string;
  isPublic: boolean;
  shareSlug: string | null;
  sections: SectionState[];
  isDirty: boolean;
}

const initialState: PresentationState = {
  id: null,
  title: 'Untitled Presentation',
  description: null,
  themeId: '',
  isPublic: false,
  shareSlug: null,
  sections: [],
  isDirty: false,
};

function getEmptySlotValue(slotType: SlotType): string | Record<string, unknown> | unknown[] {
  switch (slotType) {
    case 'LIST':
    case 'STATS':
      return [];
    case 'CHART':
    case 'CONFIG':
      return {};
    default:
      return '';
  }
}

export const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    loadPresentation(
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        description: string | null;
        themeId: string;
        isPublic: boolean;
        shareSlug: string | null;
        sections: SectionState[];
      }>,
    ) {
      const p = action.payload;
      state.id = p.id;
      state.title = p.title;
      state.description = p.description;
      state.themeId = p.themeId;
      state.isPublic = p.isPublic;
      state.shareSlug = p.shareSlug;
      state.sections = p.sections;
      state.isDirty = false;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
      state.isDirty = true;
    },
    setDescription(state, action: PayloadAction<string | null>) {
      state.description = action.payload;
      state.isDirty = true;
    },
    setThemeId(state, action: PayloadAction<string>) {
      state.themeId = action.payload;
      state.isDirty = true;
    },
    setIsPublic(state, action: PayloadAction<boolean>) {
      state.isPublic = action.payload;
      state.isDirty = true;
    },
    addSection(
      state,
      action: PayloadAction<{
        id: string;
        layoutId: string;
        order: number;
        content: SectionContent;
      }>,
    ) {
      const s = action.payload;
      state.sections.push({
        id: s.id,
        layoutId: s.layoutId,
        order: s.order,
        content: s.content,
        styleOverrides: undefined,
        transitions: undefined,
        notes: null,
        isHidden: false,
      });
      // Re-sort by order
      state.sections.sort((a, b) => a.order - b.order);
      state.isDirty = true;
    },
    removeSection(state, action: PayloadAction<string>) {
      state.sections = state.sections.filter((s) => s.id !== action.payload);
      // Recompute order
      state.sections.forEach((s, i) => {
        s.order = i;
      });
      state.isDirty = true;
    },
    updateSectionContent(
      state,
      action: PayloadAction<{ sectionId: string; content: SectionContent }>,
    ) {
      const section = state.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        section.content = action.payload.content;
        state.isDirty = true;
      }
    },
    updateSectionSlotContent(
      state,
      action: PayloadAction<{ sectionId: string; slotId: string; content: string | Record<string, unknown> | unknown[] }>,
    ) {
      const section = state.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        section.content[action.payload.slotId] = action.payload.content;
        state.isDirty = true;
      }
    },
    updateSectionLayout(state, action: PayloadAction<{ sectionId: string; layoutId: string }>) {
      const section = state.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        const newLayout = LAYOUT_REGISTRY[action.payload.layoutId];
        if (newLayout) {
          const oldContent = section.content;
          const newContent: SectionContent = {};

          const oldLayout = LAYOUT_REGISTRY[section.layoutId];
          const consumedOldSlotIds = new Set<string>();

          // 1) Direct match by slot ID always wins.
          for (const slot of newLayout.slots) {
            const directMatch = oldContent[slot.id];
            if (directMatch !== undefined) {
              newContent[slot.id] = directMatch as string | Record<string, unknown> | unknown[];
              consumedOldSlotIds.add(slot.id);
            }
          }

          // 2) Build deterministic fallback pools using old layout slot order.
          // Keep text sub-types separate to avoid heading/body swaps.
          const headingValues: string[] = [];
          const textValues: string[] = [];
          const richTextValues: string[] = [];
          const imageValues: string[] = [];
          const listValues: unknown[][] = [];
          const statsValues: unknown[][] = [];
          const chartValues: Record<string, unknown>[] = [];
          const configValues: Record<string, unknown>[] = [];
          const urlValues: string[] = [];
          const videoValues: string[] = [];
          const mermaidValues: string[] = [];

          const oldSlotsInOrder = oldLayout?.slots ?? [];
          for (const oldSlot of oldSlotsInOrder) {
            if (consumedOldSlotIds.has(oldSlot.id)) continue;

            const value = oldContent[oldSlot.id];
            if (value === undefined || value === null) continue;

            switch (oldSlot.type) {
              case 'HEADING':
                if (typeof value === 'string' && value.trim().length > 0) headingValues.push(value);
                break;
              case 'TEXT':
                if (typeof value === 'string' && value.trim().length > 0) textValues.push(value);
                break;
              case 'RICHTEXT':
                if (typeof value === 'string' && value.trim().length > 0) richTextValues.push(value);
                break;
              case 'IMAGE':
                if (typeof value === 'string' && value.trim().length > 0) imageValues.push(value);
                break;
              case 'LIST':
                if (Array.isArray(value) && value.length > 0) listValues.push(value);
                break;
              case 'STATS':
                if (Array.isArray(value) && value.length > 0) statsValues.push(value);
                break;
              case 'CHART':
                if (typeof value === 'object' && !Array.isArray(value)) {
                  chartValues.push(value as Record<string, unknown>);
                }
                break;
              case 'CONFIG':
                if (typeof value === 'object' && !Array.isArray(value)) {
                  configValues.push(value as Record<string, unknown>);
                }
                break;
              case 'URL':
                if (typeof value === 'string' && value.trim().length > 0) urlValues.push(value);
                break;
              case 'VIDEO':
                if (typeof value === 'string' && value.trim().length > 0) videoValues.push(value);
                break;
              case 'MERMAID':
                if (typeof value === 'string' && value.trim().length > 0) mermaidValues.push(value);
                break;
            }
          }

          // If the old layout metadata is missing, use a safe fallback traversal.
          if (oldSlotsInOrder.length === 0) {
            for (const [slotId, value] of Object.entries(oldContent)) {
              if (consumedOldSlotIds.has(slotId)) continue;
              if (typeof value === 'string' && value.trim().length > 0) {
                textValues.push(value);
              } else if (Array.isArray(value) && value.length > 0) {
                listValues.push(value);
              } else if (typeof value === 'object' && value && !Array.isArray(value)) {
                configValues.push(value as Record<string, unknown>);
              }
            }
          }

          const takeString = (pool: string[]): string | undefined => pool.shift();
          const takeArray = (pool: unknown[][]): unknown[] | undefined => pool.shift();
          const takeObject = (
            pool: Record<string, unknown>[],
          ): Record<string, unknown> | undefined => pool.shift();

          // 3) Fill remaining new slots by type-compatible fallback.
          for (const slot of newLayout.slots) {
            if (newContent[slot.id] !== undefined) {
              continue;
            }

            switch (slot.type) {
              case 'HEADING': {
                const value =
                  takeString(headingValues) ??
                  takeString(textValues) ??
                  takeString(richTextValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'TEXT': {
                const value =
                  takeString(textValues) ??
                  takeString(richTextValues) ??
                  takeString(headingValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'RICHTEXT': {
                const value =
                  takeString(richTextValues) ??
                  takeString(textValues) ??
                  takeString(headingValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'IMAGE': {
                const value = takeString(imageValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'LIST': {
                const value = takeArray(listValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'STATS': {
                const value = takeArray(statsValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'CHART': {
                const value = takeObject(chartValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'CONFIG': {
                const value = takeObject(configValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'URL': {
                const value = takeString(urlValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'VIDEO': {
                const value = takeString(videoValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
              case 'MERMAID': {
                const value = takeString(mermaidValues);
                if (value !== undefined) {
                  newContent[slot.id] = value;
                }
                break;
              }
            }

            // 4) Do not inject template sample content on layout switch.
            // Leave unmatched slots empty so user content stays preserved.
            newContent[slot.id] = getEmptySlotValue(slot.type);
          }

          section.content = newContent;
        }
        section.layoutId = action.payload.layoutId;
        state.isDirty = true;
      }
    },
    updateSectionStyleOverrides(
      state,
      action: PayloadAction<{ sectionId: string; styleOverrides: StyleOverrides }>,
    ) {
      const section = state.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        section.styleOverrides = action.payload.styleOverrides;
        state.isDirty = true;
      }
    },
    updateSectionTransitions(
      state,
      action: PayloadAction<{ sectionId: string; transitions: TransitionConfig }>,
    ) {
      const section = state.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        section.transitions = action.payload.transitions;
        state.isDirty = true;
      }
    },
    updateSectionNotes(state, action: PayloadAction<{ sectionId: string; notes: string | null }>) {
      const section = state.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        section.notes = action.payload.notes;
        state.isDirty = true;
      }
    },
    toggleSectionHidden(state, action: PayloadAction<string>) {
      const section = state.sections.find((s) => s.id === action.payload);
      if (section) {
        section.isHidden = !section.isHidden;
        state.isDirty = true;
      }
    },
    reorderSections(state, action: PayloadAction<{ id: string; order: number }[]>) {
      for (const { id, order } of action.payload) {
        const section = state.sections.find((s) => s.id === id);
        if (section) {
          section.order = order;
        }
      }
      state.sections.sort((a, b) => a.order - b.order);
      state.isDirty = true;
    },
    duplicateSection(
      state,
      action: PayloadAction<{ sourceSectionId: string; newSectionId: string }>,
    ) {
      const source = state.sections.find((s) => s.id === action.payload.sourceSectionId);
      if (source) {
        const newSection: SectionState = {
          ...structuredClone(source),
          id: action.payload.newSectionId,
          order: source.order + 1,
        };
        // Shift all sections after the source
        state.sections.forEach((s) => {
          if (s.order > source.order) {
            s.order += 1;
          }
        });
        state.sections.push(newSection);
        state.sections.sort((a, b) => a.order - b.order);
        state.isDirty = true;
      }
    },
    markClean(state) {
      state.isDirty = false;
    },
    resetPresentation() {
      return initialState;
    },
  },
});

export const {
  loadPresentation,
  setTitle,
  setDescription,
  setThemeId,
  setIsPublic,
  addSection,
  removeSection,
  updateSectionContent,
  updateSectionSlotContent,
  updateSectionLayout,
  updateSectionStyleOverrides,
  updateSectionTransitions,
  updateSectionNotes,
  toggleSectionHidden,
  reorderSections,
  duplicateSection,
  markClean,
  resetPresentation,
} = presentationSlice.actions;

export default presentationSlice.reducer;
