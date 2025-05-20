
import chroma from "chroma-js";
import type { FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";

// Base hex colors for UI elements like text, icons (original muted ROYGBIV)
export const DOMAIN_COLORS: Record<FacetName | string, string> = {
  Ontology:     "#FF3333", // Red
  Epistemology: "#FF9900", // Orange
  Praxeology:   "#FFEB3B", // Yellow
  Axiology:     "#38C172", // Green
  Mythology:    "#2196F3", // Blue
  Cosmology:    "#6B47DC", // Indigo
  Teleology:    "#B455B6", // Violet
};

// Chroma.js scales for triangle chart bands using HCL mode
// Color assignments based on user's "Domain Color Endpoints" prompt:
// Ontology (Violet), Epistemology (Indigo), Praxeology (Blue), etc.
const DOMAIN_SCALES: Record<FacetName, chroma.Scale> = {
  Ontology:     chroma.scale(['#f3e8ff', '#7c3aed', '#3d1c65']).mode('hcl'), // Violet tones
  Epistemology: chroma.scale(['#e0e7ff', '#6366f1', '#1e293b']).mode('hcl'), // Indigo tones
  Praxeology:   chroma.scale(['#dbeafe', '#3b82f6', '#1e40af']).mode('hcl'), // Blue tones
  Axiology:     chroma.scale(['#d1fae5', '#10b981', '#065f46']).mode('hcl'), // Green tones
  Mythology:    chroma.scale(['#fef9c3', '#fde047', '#ca8a04']).mode('hcl'), // Yellow tones
  Cosmology:    chroma.scale(['#ffedd5', '#fb923c', '#7c2d12']).mode('hcl'), // Orange tones
  Teleology:    chroma.scale(['#fee2e2', '#ef4444', '#7f1d1d']).mode('hcl'), // Red tones
};

const FALLBACK_COLOR_HEX = "#BDBDBD"; // Medium Gray

/**
 * Calculates the band color for the TriangleChart using chroma-js scales in HCL mode.
 * @param facetName The name of the facet.
 * @param score The normalized score (0.0 - 1.0).
 * @returns A hex color string.
 */
export function getFacetScoreColor(facetName: FacetName, score: number): string {
  const scale = DOMAIN_SCALES[facetName];
  if (scale) {
    return scale(Math.max(0, Math.min(1, score))).hex(); // Clamp score to 0-1
  }
  console.warn(`Scale not found for facet: ${facetName}. Using fallback color.`);
  return FALLBACK_COLOR_HEX; 
}

/**
 * Returns the HSL string for a facet's base color from CSS variables (used for text, icons).
 * @param facetName The name of the facet.
 * @returns HSL string (e.g., "hsl(var(--domain-ontology))") or a fallback.
 */
export function getFacetColorHsl(facetName: FacetName | string | undefined): string {
  if (!facetName || !FACETS[facetName as FacetName]) {
    return `hsl(var(--foreground))`;
  }
  const facetConfig = FACETS[facetName as FacetName];
  return `hsl(var(${facetConfig.colorVariable.slice(2)}))`;
}

export const SPECTRUM_LABELS: Record<FacetName, { left: string; right: string }> = {
  Ontology:     { left: "Materialism", right: "Idealism" },
  Epistemology: { left: "Empirical", right: "Revelatory" },
  Praxeology:   { left: "Hierarchical", right: "Egalitarian" },
  Axiology:     { left: "Individualism", right: "Collectivism" },
  Mythology:    { left: "Linear", right: "Cyclical" },
  Cosmology:    { left: "Mechanistic", right: "Holistic" },
  Teleology:    { left: "Existential", right: "Divine" }, // Reversed
};

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
