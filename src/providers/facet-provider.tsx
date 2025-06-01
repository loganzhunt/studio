'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { FacetName } from '@/types';

// Create a context for facets that ensures they're always available
interface FacetContextType {
  facetNames: FacetName[];
  isReady: boolean;
}

const FacetContext = createContext<FacetContextType>({
  facetNames: [],
  isReady: false
});

// Safe fallback facet names that will always be available
const SAFE_FACET_NAMES: FacetName[] = [
  "Ontology",
  "Epistemology", 
  "Praxeology",
  "Axiology",
  "Mythology",
  "Cosmology",
  "Teleology"
];

export function FacetProvider({ children }: { children: React.ReactNode }) {
  const contextValue = useMemo(() => {
    // Always provide the safe fallback names
    return {
      facetNames: SAFE_FACET_NAMES,
      isReady: true
    };
  }, []);

  return (
    <FacetContext.Provider value={contextValue}>
      {children}
    </FacetContext.Provider>
  );
}

export function useFacetNames(): FacetName[] {
  const context = useContext(FacetContext);
  return context.facetNames;
}

export function useFacetContext(): FacetContextType {
  return useContext(FacetContext);
}

// Safe utility functions that always work
export function safeFacetMap<T>(
  callback: (facetName: FacetName, index: number) => T
): T[] {
  return SAFE_FACET_NAMES.map(callback);
}

export function safeFacetForEach(
  callback: (facetName: FacetName, index: number) => void
): void {
  SAFE_FACET_NAMES.forEach(callback);
}

export function safeFacetReduce<T>(
  callback: (acc: T, facetName: FacetName, index: number) => T,
  initialValue: T
): T {
  return SAFE_FACET_NAMES.reduce(callback, initialValue);
}
