// Utility functions to safely handle FACET_NAMES operations
import { FACET_NAMES } from '@/config/facets';
import type { FacetName, DomainScore } from '@/types';

// Safe FACET_NAMES operations with runtime fallbacks
export function safeFacetNamesMap<T>(
  mapFn: (facetName: FacetName, index: number) => T,
  fallback: T[] = []
): T[] {
  try {
    if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
      return FACET_NAMES.map(mapFn);
    }
    return fallback;
  } catch (error) {
    console.warn('safeFacetNamesMap: FACET_NAMES not available, using fallback', error);
    return fallback;
  }
}

export function safeFacetNamesForEach(
  forEachFn: (facetName: FacetName, index: number) => void
): void {
  try {
    if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
      FACET_NAMES.forEach(forEachFn);
    }
  } catch (error) {
    console.warn('safeFacetNamesForEach: FACET_NAMES not available', error);
  }
}

export function safeFacetNamesLength(): number {
  try {
    if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
      return FACET_NAMES.length;
    }
    return 0;
  } catch (error) {
    console.warn('safeFacetNamesLength: FACET_NAMES not available', error);
    return 0;
  }
}

export function safeFacetNamesIndex(index: number): FacetName | null {
  try {
    if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 && index >= 0 && index < FACET_NAMES.length) {
      return FACET_NAMES[index];
    }
    return null;
  } catch (error) {
    console.warn('safeFacetNamesIndex: FACET_NAMES not available', error);
    return null;
  }
}

// Common utility for creating default domain scores
export function createDefaultDomainScores(score: number = 0.5): DomainScore[] {
  return safeFacetNamesMap(name => ({ facetName: name, score }), []);
}
