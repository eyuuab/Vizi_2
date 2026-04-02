import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SectionContent, StyleOverrides, TransitionConfig } from '@/types/presentation';

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
