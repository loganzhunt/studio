
import chroma from "chroma-js";
import type { FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";

// LCH Derived Hex Colors for Fractal Triangle Logo and other specific UI elements
// Ordered for the 7 bands: Ontology (Violet) -> Teleology (Red)
export const LCH_DOMAIN_COLORS_HEX = [
  chroma.lch(60, 60, 310).hex(), // Ontology (Violet)
  chroma.lch(60, 60, 270).hex(), // Epistemology (Indigo)
  chroma.lch(60, 60, 240).hex(), // Praxeology (Blue)
  chroma.lch(70, 60, 170).hex(), // Axiology (Green)
  chroma.lch(85, 60, 100).hex(), // Mythology (Yellow)
  chroma.lch(75, 60, 50).hex(),  // Cosmology (Orange)
  chroma.lch(60, 60, 30).hex(),  // Teleology (Red)
];

// Color scales for triangle bands and spectrum gradients (original LCH from a previous step, now set to .mode('hcl'))
// These are the tones used for the *main triangle charts* and spectrum bars, not necessarily the logo.
export const DOMAIN_SCALES: Record<FacetName, chroma.Scale> = {
  Ontology:     chroma.scale(['#f3e8ff', '#7c3aed', '#3d1c65']).mode('hcl'), // Violet tones
  Epistemology: chroma.scale(['#e0e7ff', '#6366f1', '#1e293b']).mode('hcl'), // Indigo tones
  Praxeology:   chroma.scale(['#dbeafe', '#3b82f6', '#1e40af']).mode('hcl'), // Blue tones
  Axiology:     chroma.scale(['#d1fae5', '#10b981', '#065f46']).mode('hcl'), // Green tones
  Mythology:    chroma.scale(['#fef9c3', '#fde047', '#ca8a04']).mode('hcl'), // Yellow tones
  Cosmology:    chroma.scale(['#ffedd5', '#fb923c', '#7c2d12']).mode('hcl'), // Orange tones
  Teleology:    chroma.scale(['#fee2e2', '#ef4444', '#7f1d1d']).mode('hcl'), // Red tones
};

// Function to get color for triangle bands and spectrum bars based on DOMAIN_SCALES
export function getFacetScoreColor(facetName: FacetName, score: number): string {
  const scale = DOMAIN_SCALES[facetName];
  if (scale) {
    return scale(Math.max(0, Math.min(1, score))).hex(); // Clamp score to 0-1
  }
  // console.warn(`Color scale not found for facet: ${facetName}. Using fallback color.`);
  return "#BDBDBD"; // Fallback color
}

// Original HSL variables for text, icons etc. (used for UI accents beyond the triangle)
// These correspond to the --domain-facet CSS variables in globals.css
export const DOMAIN_COLORS_HSL_VARS: Record<FacetName, string> = {
  Ontology:     "hsl(var(--domain-ontology))",
  Epistemology: "hsl(var(--domain-epistemology))",
  Praxeology:   "hsl(var(--domain-praxeology))",
  Axiology:     "hsl(var(--domain-axiology))",
  Mythology:    "hsl(var(--domain-mythology))",
  Cosmology:    "hsl(var(--domain-cosmology))",
  Teleology:    "hsl(var(--domain-teleology))",
};

// Base HEX colors (Classic ROYGBIV) for UI elements like text, icons (matching CSS variables from globals.css)
// These might be different from the LCH palette used for the logo, or the DOMAIN_SCALES.
export const DOMAIN_COLORS: Record<FacetName, string> = {
  Ontology:     "#FF3333", // Red (classic)
  Epistemology: "#FF9900", // Orange (classic)
  Praxeology:   "#FFEB3B", // Yellow (classic)
  Axiology:     "#38C172", // Green (classic)
  Mythology:    "#2196F3", // Blue (classic)
  Cosmology:    "#6B47DC", // Indigo (classic)
  Teleology:    "#B455B6", // Violet (classic)
};

// Function to get HSL string for text, icons, etc., from CSS variables
export function getFacetColorHsl(facetName?: FacetName | string): string {
  if (!facetName || !FACETS[facetName as FacetName]) {
    return `hsl(var(--foreground))`;
  }
  const facetConfig = FACETS[facetName as FacetName];
  if (!facetConfig.colorVariable || !facetConfig.colorVariable.startsWith('--domain-')) {
    return `hsl(var(--foreground))`;
  }
  return `hsl(var(${facetConfig.colorVariable.slice(2)}))`;
}

// Bipolar labels for spectrums
export const SPECTRUM_LABELS: Record<FacetName, { left: string; right: string }> = {
  Ontology:     { left: "Materialism", right: "Idealism" },
  Epistemology: { left: "Empirical", right: "Revelatory" },
  Praxeology:   { left: "Hierarchical", right: "Egalitarian" },
  Axiology:     { left: "Individualism", right: "Collectivism" },
  Mythology:    { left: "Linear", right: "Cyclical" },
  Cosmology:    { left: "Mechanistic", right: "Holistic" },
  Teleology:    { left: "Existential", right: "Divine" },
};

// Helper function to get the dominant facet based on scores
export const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) {
    return FACET_NAMES[0]; // Default to the first facet name if no scores
  }
  const validScores = scores.filter(s => s && typeof s.score === 'number' && FACET_NAMES.includes(s.facetName));
  if (validScores.length === 0) {
    return FACET_NAMES[0]; // Default if no valid scores found
  }
  // Find the score object with the highest score
  const dominantScoreObject = validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev);
  return dominantScoreObject.facetName || FACET_NAMES[0]; // Return its facetName, or default
};
