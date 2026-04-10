'use client';

import { createContext, useContext } from 'react';

interface SectionRenderContextValue {
  sectionId: string;
}

const SectionRenderContext = createContext<SectionRenderContextValue | null>(null);

interface SectionRenderProviderProps {
  sectionId: string;
  children: React.ReactNode;
}

export function SectionRenderProvider({
  sectionId,
  children,
}: SectionRenderProviderProps): React.JSX.Element {
  return (
    <SectionRenderContext.Provider value={{ sectionId }}>
      {children}
    </SectionRenderContext.Provider>
  );
}

export function useSectionRenderContext(): SectionRenderContextValue | null {
  return useContext(SectionRenderContext);
}
