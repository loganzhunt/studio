import chroma from "chroma-js";
import type { FacetName, DomainScore } from "@/types"; // Added DomainScore
import { FACETS, FACET_NAMES } from "@/config/facets"; // Import FACETS for colorVariable and FACET_NAMES

// Updated ROYGBIV palette (capitalized keys to match FacetName)
export const DOMAIN_COLORS: Record<FacetName | string, string> = {
  Ontology:     "#FF3333", // Red
  Epistemology: "#FF9900", // Orange
  Praxeology:   "#FFEB3B", // Yellow
  Axiology:     "#38C172", // Green
  Mythology:    "#2196F3", // Blue
  Cosmology:    "#6B47DC", // Indigo
  Teleology:    "#B455B6", // Violet
};

// Fallback color for unknown domains
const FALLBACK_COLOR = "#BDBDBD"; // Medium Gray

/**
 * Calculates the band color based on the domain and score.
 * The color shade (dark, normal, light) is determined by the score.
 * @param domainName The name of the facet (e.g., "Ontology").
 * @param score The normalized score (0.0 - 1.0).
 * @returns A hex color string.
 */
export function getBandColor(domainName: FacetName, score: number): string {
  const baseColorKey = domainName;
  const baseColor = DOMAIN_COLORS[baseColorKey] || FALLBACK_COLOR;

  // Score thresholds for color shades
  if (score <= 0.33) { // Low scores -> darker shade
    return chroma(baseColor).darken(1.2).saturate(0.1).hex();
  } else if (score <= 0.66) { // Mid scores -> base color
    return baseColor;
  } else { // High scores -> lighter shade
    return chroma(baseColor).brighten(0.8).saturate(0.1).hex();
  }
}

/**
 * Returns the HSL string for a facet's base color from CSS variables.
 * @param facetName The name of the facet.
 * @returns HSL string (e.g., "hsl(var(--domain-ontology))") or a fallback.
 */
export function getFacetColorHsl(facetName: FacetName | string | undefined): string {
  if (!facetName || !FACETS[facetName as FacetName]) {
    return `hsl(var(--foreground))`; // Fallback color
  }
  const facetConfig = FACETS[facetName as FacetName];
  return `hsl(var(${facetConfig.colorVariable.slice(2)}))`;
}

/**
 * Defines the bipolar spectrum labels for each facet.
 */
export const SPECTRUM_LABELS: Record<FacetName, { left: string; right: string }> = {
  Ontology: { left: "Materialism", right: "Idealism" },
  Epistemology: { left: "Empirical", right: "Revelatory" },
  Praxeology: { left: "Hierarchical", right: "Egalitarian" },
  Axiology: { left: "Individualism", right: "Collectivism" },
  Mythology: { left: "Linear", right: "Cyclical" },
  Cosmology: { left: "Mechanistic", right: "Holistic" },
  Teleology: { left: "Existential", right: "Divine" },
};

/**
 * Determines the dominant facet from a list of domain scores.
 * @param scores An array of DomainScore objects.
 * @returns The FacetName of the domain with the highest score.
 */
export const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) {
    // If no scores, or empty array, return the first facet name as a default
    return FACET_NAMES[0];
  }

  const validScores = scores.filter(s => s && typeof s.score === 'number' && s.facetName && FACET_NAMES.includes(s.facetName));

  if (validScores.length === 0) {
    // If no valid scores with recognized facet names, return the first facet name as a default
    return FACET_NAMES[0];
  }

  // Find the facet with the highest score
  return validScores.reduce((prev, current) => {
    return (current.score > prev.score) ? current : prev;
  }).facetName;
};
