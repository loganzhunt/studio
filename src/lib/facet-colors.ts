import React from 'react';

/**
 * Meta-Prism Facet Color Utilities
 * 
 * Helper functions for working with facet colors in a type-safe way.
 * Provides utilities for generating class names, getting color values,
 * and working with the facet spectrum.
 */

export type FacetName = 
  | 'ontology' 
  | 'epistemology' 
  | 'praxeology' 
  | 'axiology' 
  | 'mythology' 
  | 'cosmology' 
  | 'teleology';

export type ColorShade = 
  | '50' | '100' | '200' | '300' | '400' | '500' 
  | '600' | '700' | '800' | '900' | 'DEFAULT';

export type ColorType = 'bg' | 'text' | 'border' | 'ring' | 'decoration';

// Facet metadata with symbolic information
export const FACET_INFO = {
  ontology: {
    name: 'Ontology',
    question: 'What is real?',
    color: '#8b5cf6',
    hue: 270,
    order: 0,
  },
  epistemology: {
    name: 'Epistemology', 
    question: 'What can be known?',
    color: '#6366f1',
    hue: 240,
    order: 1,
  },
  praxeology: {
    name: 'Praxeology',
    question: 'How should we act?', 
    color: '#3b82f6',
    hue: 210,
    order: 2,
  },
  axiology: {
    name: 'Axiology',
    question: 'What has value?',
    color: '#10b981', 
    hue: 120,
    order: 3,
  },
  mythology: {
    name: 'Mythology',
    question: 'What is the story?',
    color: '#eab308',
    hue: 50, 
    order: 4,
  },
  cosmology: {
    name: 'Cosmology',
    question: 'What is the universe?',
    color: '#f97316',
    hue: 30,
    order: 5,
  },
  teleology: {
    name: 'Teleology', 
    question: 'What is the purpose?',
    color: '#ef4444',
    hue: 0,
    order: 6,
  },
} as const;

// Ordered array of facets in spectral order
export const FACET_ORDER: FacetName[] = [
  'ontology', 'epistemology', 'praxeology', 'axiology', 
  'mythology', 'cosmology', 'teleology'
];

/**
 * Generates a Tailwind CSS class name for facet colors
 * 
 * @param type - The type of color utility (bg, text, border, etc.)
 * @param facet - The facet name
 * @param shade - The color shade (50-900 or DEFAULT)
 * @returns Tailwind CSS class name
 * 
 * @example
 * getFacetClass('bg', 'ontology', '500') // 'bg-facet-ontology-500'
 * getFacetClass('text', 'axiology', 'DEFAULT') // 'text-facet-axiology-DEFAULT'
 */
export function getFacetClass(
  type: ColorType, 
  facet: FacetName, 
  shade: ColorShade = 'DEFAULT'
): string {
  return `${type}-facet-${facet}-${shade}`;
}

/**
 * Generates multiple facet classes at once
 * 
 * @example
 * getFacetClasses('ontology', {
 *   bg: '100',
 *   text: '700', 
 *   border: '300'
 * }) // 'bg-facet-ontology-100 text-facet-ontology-700 border-facet-ontology-300'
 */
export function getFacetClasses(
  facet: FacetName,
  classes: Partial<Record<ColorType, ColorShade>>
): string {
  return Object.entries(classes)
    .map(([type, shade]) => getFacetClass(type as ColorType, facet, shade))
    .join(' ');
}

/**
 * Gets a gradient class name for transitions between facets
 * 
 * @param fromFacet - Starting facet
 * @param toFacet - Ending facet (optional, uses next facet if not provided)
 * @returns Gradient class name
 * 
 * @example
 * getFacetGradient('ontology', 'epistemology') // 'bg-gradient-ontology-epistemology'
 * getFacetGradient('axiology') // 'bg-gradient-axiology-mythology'
 */
export function getFacetGradient(
  fromFacet: FacetName, 
  toFacet?: FacetName
): string {
  if (!toFacet) {
    const currentIndex = FACET_ORDER.indexOf(fromFacet);
    const nextIndex = (currentIndex + 1) % FACET_ORDER.length;
    toFacet = FACET_ORDER[nextIndex];
  }
  return `bg-gradient-${fromFacet}-${toFacet}`;
}

/**
 * Gets the full spectrum gradient class
 */
export function getSpectrumGradient(radial = false): string {
  return radial ? 'bg-gradient-facet-spectrum-radial' : 'bg-gradient-facet-spectrum';
}

/**
 * Determines if two facets are adjacent in the spectrum
 */
export function areAdjacentFacets(facet1: FacetName, facet2: FacetName): boolean {
  const index1 = FACET_ORDER.indexOf(facet1);
  const index2 = FACET_ORDER.indexOf(facet2);
  const diff = Math.abs(index1 - index2);
  return diff === 1 || diff === FACET_ORDER.length - 1; // Handle wraparound
}

/**
 * Gets the next facet in the spectrum (with wraparound)
 */
export function getNextFacet(facet: FacetName): FacetName {
  const currentIndex = FACET_ORDER.indexOf(facet);
  const nextIndex = (currentIndex + 1) % FACET_ORDER.length;
  return FACET_ORDER[nextIndex];
}

/**
 * Gets the previous facet in the spectrum (with wraparound)
 */
export function getPreviousFacet(facet: FacetName): FacetName {
  const currentIndex = FACET_ORDER.indexOf(facet);
  const prevIndex = (currentIndex - 1 + FACET_ORDER.length) % FACET_ORDER.length;
  return FACET_ORDER[prevIndex];
}

/**
 * Gets facets within a range of the spectrum
 * 
 * @param startFacet - Starting facet
 * @param endFacet - Ending facet
 * @returns Array of facets in the range
 */
export function getFacetRange(startFacet: FacetName, endFacet: FacetName): FacetName[] {
  const startIndex = FACET_ORDER.indexOf(startFacet);
  const endIndex = FACET_ORDER.indexOf(endFacet);
  
  if (startIndex <= endIndex) {
    return FACET_ORDER.slice(startIndex, endIndex + 1);
  } else {
    // Handle wraparound
    return [
      ...FACET_ORDER.slice(startIndex),
      ...FACET_ORDER.slice(0, endIndex + 1)
    ];
  }
}

/**
 * Component helper for dynamic facet styling
 * 
 * @example
 * const cardStyles = useFacetStyles('ontology', {
 *   background: '50',
 *   text: '700',
 *   border: '200'
 * });
 */
export function useFacetStyles(
  facet: FacetName,
  styles: {
    background?: ColorShade;
    text?: ColorShade;
    border?: ColorShade;
    ring?: ColorShade;
  }
) {
  const classes: string[] = [];
  
  if (styles.background) {
    classes.push(getFacetClass('bg', facet, styles.background));
  }
  if (styles.text) {
    classes.push(getFacetClass('text', facet, styles.text));
  }
  if (styles.border) {
    classes.push(getFacetClass('border', facet, styles.border));
  }
  if (styles.ring) {
    classes.push(getFacetClass('ring', facet, styles.ring));
  }
  
  return classes.join(' ');
}

/**
 * Accessibility helper - gets high contrast text color for a facet background
 * 
 * @param facet - The facet name
 * @param backgroundShade - The background shade being used
 * @returns Recommended text shade for accessibility
 */
export function getAccessibleTextShade(
  facet: FacetName, 
  backgroundShade: ColorShade
): ColorShade {
  const lightShades = ['50', '100', '200', '300'];
  const mediumShades = ['400', '500'];
  const darkShades = ['600', '700', '800', '900'];
  
  if (lightShades.includes(backgroundShade)) {
    return '800'; // Dark text on light background
  } else if (mediumShades.includes(backgroundShade)) {
    return '50'; // Light text on medium background
  } else {
    return '50'; // Light text on dark background
  }
}

/**
 * React hook for managing facet state with color utilities
 */
export function useFacetState(initialFacet: FacetName = 'ontology') {
  const [currentFacet, setCurrentFacet] = React.useState<FacetName>(initialFacet);
  
  const facetInfo = FACET_INFO[currentFacet];
  
  const nextFacet = () => setCurrentFacet(getNextFacet(currentFacet));
  const prevFacet = () => setCurrentFacet(getPreviousFacet(currentFacet));
  
  const getClasses = (styles: Parameters<typeof useFacetStyles>[1]) => 
    useFacetStyles(currentFacet, styles);
  
  const getGradient = (toFacet?: FacetName) => 
    getFacetGradient(currentFacet, toFacet);
  
  return {
    currentFacet,
    setCurrentFacet,
    facetInfo,
    nextFacet,
    prevFacet,
    getClasses,
    getGradient,
    isFirst: currentFacet === FACET_ORDER[0],
    isLast: currentFacet === FACET_ORDER[FACET_ORDER.length - 1],
  };
}
