/**
 * Meta-Prism Facet Color Utilities
 * 
 * This file provides utility functions and constants for working with the facet color system.
 * It includes helpers for dynamic class generation, color mapping, and accessibility features.
 */

// Facet color definitions matching Tailwind config
export const FACET_COLORS = {
  ontology: {
    name: 'Ontology',
    question: 'What is real?',
    description: 'Explores the fundamental nature of being and existence',
    hue: 260,
    baseColor: '#7c4dff',
    colors: {
      50: '#f8f7ff',
      100: '#f0edff',
      200: '#e4ddff',
      300: '#d2c2ff',
      400: '#b79eff',
      500: '#9870ff',
      600: '#7c4dff',
      700: '#6339e6',
      800: '#4f2bbd',
      900: '#3f1f9a',
      DEFAULT: '#7c4dff',
    },
  },
  epistemology: {
    name: 'Epistemology',
    question: 'What can be known?',
    description: 'Investigates the nature of knowledge and justified belief',
    hue: 240,
    baseColor: '#5c64ff',
    colors: {
      50: '#f4f6ff',
      100: '#ebf0ff',
      200: '#d9e2ff',
      300: '#bcc9ff',
      400: '#9aa6ff',
      500: '#7b85ff',
      600: '#5c64ff',
      700: '#4a50e6',
      800: '#3c42bd',
      900: '#30359a',
      DEFAULT: '#5c64ff',
    },
  },
  praxeology: {
    name: 'Praxeology',
    question: 'How should we act?',
    description: 'Studies human action and decision-making',
    hue: 210,
    baseColor: '#2499ff',
    colors: {
      50: '#f0f8ff',
      100: '#e0f2ff',
      200: '#bae6ff',
      300: '#85d3ff',
      400: '#4fb8ff',
      500: '#2499ff',
      600: '#0f7bff',
      700: '#0762e6',
      800: '#0a4fbd',
      900: '#0e419a',
      DEFAULT: '#2499ff',
    },
  },
  axiology: {
    name: 'Axiology',
    question: 'What has value?',
    description: 'Examines the nature of value and ethics',
    hue: 140,
    baseColor: '#22c55e',
    colors: {
      50: '#f0fdf6',
      100: '#dcfce9',
      200: '#bbf7d2',
      300: '#86efad',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      DEFAULT: '#22c55e',
    },
  },
  mythology: {
    name: 'Mythology',
    question: 'What is the story?',
    description: 'Uncovers narratives that shape understanding',
    hue: 45,
    baseColor: '#f5a623',
    colors: {
      50: '#fffcf0',
      100: '#fff8db',
      200: '#ffefb8',
      300: '#ffe385',
      400: '#ffd24a',
      500: '#ffbb1f',
      600: '#f5a623',
      700: '#cc7a1f',
      800: '#a3601f',
      900: '#85501d',
      DEFAULT: '#f5a623',
    },
  },
  cosmology: {
    name: 'Cosmology',
    question: 'What is the universe?',
    description: 'Investigates the origin and structure of reality',
    hue: 25,
    baseColor: '#ff781f',
    colors: {
      50: '#fff9f0',
      100: '#ffefe0',
      200: '#ffdbb8',
      300: '#ffc085',
      400: '#ff9a4a',
      500: '#ff781f',
      600: '#f5611f',
      700: '#cc461f',
      800: '#a3371f',
      900: '#852e1d',
      DEFAULT: '#ff781f',
    },
  },
  teleology: {
    name: 'Teleology',
    question: 'What is the purpose?',
    description: 'Explores goals, direction, and final causes',
    hue: 355,
    baseColor: '#e11d48',
    colors: {
      50: '#fff5f5',
      100: '#ffe8e8',
      200: '#ffd6d6',
      300: '#ffb8b8',
      400: '#ff8a8a',
      500: '#ff5757',
      600: '#f53333',
      700: '#e11d48',
      800: '#be123c',
      900: '#9f1239',
      DEFAULT: '#e11d48',
    },
  },
} as const;

// Facet order for spectrum display
export const FACET_ORDER = [
  'ontology',
  'epistemology', 
  'praxeology',
  'axiology',
  'mythology',
  'cosmology',
  'teleology',
] as const;

// Type definitions
export type FacetKey = keyof typeof FACET_COLORS;
export type ColorShade = keyof typeof FACET_COLORS.ontology.colors;
export type FacetInfo = typeof FACET_COLORS[FacetKey];

/**
 * Get Tailwind class name for a facet color
 */
export function getFacetClass(
  facet: FacetKey,
  type: 'bg' | 'text' | 'border' | 'ring' = 'bg',
  shade: ColorShade = 'DEFAULT'
): string {
  const shadeStr = shade === 'DEFAULT' ? '' : `-${shade}`;
  return `${type}-facet-${facet}${shadeStr}`;
}

/**
 * Get hex color value for a facet
 */
export function getFacetColor(facet: FacetKey, shade: ColorShade = 'DEFAULT'): string {
  return FACET_COLORS[facet].colors[shade];
}

/**
 * Get facet information
 */
export function getFacetInfo(facet: FacetKey): FacetInfo {
  return FACET_COLORS[facet];
}

/**
 * Generate gradient class for adjacent facets
 */
export function getAdjacentGradient(facet1: FacetKey, facet2: FacetKey, direction: 'horizontal' | 'vertical' = 'horizontal'): string {
  const suffix = direction === 'vertical' ? '-vertical' : '';
  return `bg-gradient-${facet1}-${facet2}${suffix}`;
}

/**
 * Get all shades for a facet as class names
 */
export function getFacetShades(facet: FacetKey, type: 'bg' | 'text' | 'border' = 'bg'): Record<ColorShade, string> {
  const shades = {} as Record<ColorShade, string>;
  Object.keys(FACET_COLORS[facet].colors).forEach((shade) => {
    shades[shade as ColorShade] = getFacetClass(facet, type, shade as ColorShade);
  });
  return shades;
}

/**
 * Generate spectrum of all facet colors
 */
export function getSpectrumColors(): string[] {
  return FACET_ORDER.map(facet => FACET_COLORS[facet].baseColor);
}

/**
 * Check if a facet key is valid
 */
export function isValidFacet(facet: string): facet is FacetKey {
  return facet in FACET_COLORS;
}

/**
 * Get next facet in spectrum order
 */
export function getNextFacet(facet: FacetKey): FacetKey {
  const currentIndex = FACET_ORDER.indexOf(facet);
  const nextIndex = (currentIndex + 1) % FACET_ORDER.length;
  return FACET_ORDER[nextIndex];
}

/**
 * Get previous facet in spectrum order
 */
export function getPreviousFacet(facet: FacetKey): FacetKey {
  const currentIndex = FACET_ORDER.indexOf(facet);
  const prevIndex = currentIndex === 0 ? FACET_ORDER.length - 1 : currentIndex - 1;
  return FACET_ORDER[prevIndex];
}

/**
 * Button style presets for each facet
 */
export const BUTTON_STYLES = {
  primary: (facet: FacetKey) => `${getFacetClass(facet, 'bg')} hover:${getFacetClass(facet, 'bg', 700)} text-white transition-colors duration-300 ease-in-out`,
  secondary: (facet: FacetKey) => `border-2 ${getFacetClass(facet, 'border')} ${getFacetClass(facet, 'text')} hover:${getFacetClass(facet, 'bg')} hover:text-white transition-colors duration-300 ease-in-out`,
  ghost: (facet: FacetKey) => `${getFacetClass(facet, 'text')} hover:${getFacetClass(facet, 'bg', 100)} transition-colors duration-300 ease-in-out`,
};

/**
 * Chip/tag style presets for each facet
 */
export const CHIP_STYLES = {
  solid: (facet: FacetKey) => `${getFacetClass(facet, 'bg')} text-white px-3 py-1 rounded-full text-sm font-medium`,
  soft: (facet: FacetKey) => `${getFacetClass(facet, 'bg', '100')} ${getFacetClass(facet, 'text', '800')} px-3 py-1 rounded-full text-sm font-medium`,
  outline: (facet: FacetKey) => `border ${getFacetClass(facet, 'border', '300')} ${getFacetClass(facet, 'text', '700')} px-3 py-1 rounded-full text-sm font-medium`,
};

/**
 * Card style presets for each facet
 */
export const CARD_STYLES = {
  subtle: (facet: FacetKey) => `bg-gradient-to-br from-facet-${facet}-50 to-facet-${facet}-100 border ${getFacetClass(facet, 'border', '200')}`,
  accent: (facet: FacetKey) => `border-l-4 ${getFacetClass(facet, 'border')} pl-4`,
  header: (facet: FacetKey) => `bg-gradient-to-r from-facet-${facet}-500 to-facet-${facet}-600`,
};

/**
 * Progress bar style for each facet
 */
export const PROGRESS_STYLE = (facet: FacetKey) => 
  `bg-gradient-to-r from-facet-${facet}-400 to-facet-${facet}-600`;

/**
 * Status indicator style for each facet
 */
export const STATUS_STYLE = (facet: FacetKey) => 
  `w-3 h-3 ${getFacetClass(facet, 'bg')} rounded-full`;

/**
 * Accessibility helpers - get high contrast combinations
 */
export const ACCESSIBLE_COMBINATIONS = {
  // White text on colored background (WCAG AA compliant)
  whiteOnColor: (facet: FacetKey) => `${getFacetClass(facet, 'bg', '600')} text-white`,
  // Dark text on light background
  darkOnLight: (facet: FacetKey) => `${getFacetClass(facet, 'bg', '50')} ${getFacetClass(facet, 'text', '900')}`,
  // Colored text on white (good contrast)
  colorOnWhite: (facet: FacetKey) => `${getFacetClass(facet, 'text', '700')}`,
};

/**
 * Generate complete component classes for a facet
 */
export function generateFacetClasses(facet: FacetKey) {
  return {
    // Text colors
    text: {
      primary: getFacetClass(facet, 'text'),
      secondary: getFacetClass(facet, 'text', '600'),
      muted: getFacetClass(facet, 'text', '500'),
    },
    // Background colors  
    bg: {
      primary: getFacetClass(facet, 'bg'),
      light: getFacetClass(facet, 'bg', '100'),
      subtle: getFacetClass(facet, 'bg', '50'),
    },
    // Border colors
    border: {
      primary: getFacetClass(facet, 'border'),
      light: getFacetClass(facet, 'border', '200'),
      subtle: getFacetClass(facet, 'border', '100'),
    },
    // Buttons
    buttons: {
      primary: BUTTON_STYLES.primary(facet),
      secondary: BUTTON_STYLES.secondary(facet),
      ghost: BUTTON_STYLES.ghost(facet),
    },
    // Chips
    chips: {
      solid: CHIP_STYLES.solid(facet),
      soft: CHIP_STYLES.soft(facet),
      outline: CHIP_STYLES.outline(facet),
    },
    // Cards
    cards: {
      subtle: CARD_STYLES.subtle(facet),
      accent: CARD_STYLES.accent(facet),
      header: CARD_STYLES.header(facet),
    },
    // Components
    progress: PROGRESS_STYLE(facet),
    status: STATUS_STYLE(facet),
  };
}

/**
 * Export default for easy importing
 */
export default {
  FACET_COLORS,
  FACET_ORDER,
  getFacetClass,
  getFacetColor,
  getFacetInfo,
  getAdjacentGradient,
  getFacetShades,
  getSpectrumColors,
  isValidFacet,
  getNextFacet,
  getPreviousFacet,
  BUTTON_STYLES,
  CHIP_STYLES,
  CARD_STYLES,
  PROGRESS_STYLE,
  STATUS_STYLE,
  ACCESSIBLE_COMBINATIONS,
  generateFacetClasses,
};
