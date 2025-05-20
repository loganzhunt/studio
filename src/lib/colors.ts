
import chroma from "chroma-js";
import type { FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";

// Color scales for triangle bands, using 3-stop LCH mode
const DOMAIN_SCALES: Record<FacetName, chroma.Scale> = {
  Ontology:     chroma.scale(['#f3e8ff', '#7c3aed', '#3d1c65']).mode('lch'), // Violet tones
  Epistemology: chroma.scale(['#e0e7ff', '#6366f1', '#1e293b']).mode('lch'), // Indigo tones
  Praxeology:   chroma.scale(['#dbeafe', '#3b82f6', '#1e40af']).mode('lch'), // Blue tones
  Axiology:     chroma.scale(['#d1fae5', '#10b981', '#065f46']).mode('lch'), // Green tones
  Mythology:    chroma.scale(['#fef9c3', '#fde047', '#ca8a04']).mode('lch'), // Yellow tones
  Cosmology:    chroma.scale(['#ffedd5', '#fb923c', '#7c2d12']).mode('lch'), // Orange tones
  Teleology:    chroma.scale(['#fee2e2', '#ef4444', '#7f1d1d']).mode('lch'), // Red tones
};

// Function to get color for triangle bands and spectrum bars (solid color based on score)
export function getFacetScoreColor(facetName: FacetName, score: number): string {
  const scale = DOMAIN_SCALES[facetName];
  if (scale) {
    return scale(Math.max(0, Math.min(1, score))).hex(); // Clamp score to 0-1
  }
  console.warn(`Color scale not found for facet: ${facetName}. Using fallback color.`);
  return "#BDBDBD"; // Fallback color
}

// Original HSL variables for text, icons etc. (used for UI accents beyond the triangle)
export const DOMAIN_COLORS_HSL_VARS: Record<FacetName, string> = {
  Ontology:     "hsl(var(--domain-ontology))",     // Red in globals.css
  Epistemology: "hsl(var(--domain-epistemology))", // Orange in globals.css
  Praxeology:   "hsl(var(--domain-praxeology))",   // Yellow in globals.css
  Axiology:     "hsl(var(--domain-axiology))",     // Green in globals.css
  Mythology:    "hsl(var(--domain-mythology))",    // Blue in globals.css
  Cosmology:    "hsl(var(--domain-cosmology))",    // Indigo in globals.css
  Teleology:    "hsl(var(--domain-teleology))",    // Violet in globals.css
};

// Base HEX colors for UI elements like text, icons (matching CSS variables)
export const DOMAIN_COLORS: Record<FacetName, string> = {
  Ontology:     "#FF3333", // Red
  Epistemology: "#FF9900", // Orange
  Praxeology:   "#FFEB3B", // Yellow
  Axiology:     "#38C172", // Green
  Mythology:    "#2196F3", // Blue
  Cosmology:    "#6B47DC", // Indigo
  Teleology:    "#B455B6", // Violet
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
  // Filter out any potentially malformed score objects and ensure score is a number
  const validScores = scores.filter(s => s && typeof s.score === 'number' && FACET_NAMES.includes(s.facetName));
  if (validScores.length === 0) {
    return FACET_NAMES[0]; // Default if no valid scores found
  }
  // Find the facet with the highest score
  return validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev).facetName;
};
