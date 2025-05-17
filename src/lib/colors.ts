import chroma from "chroma-js";
import type { FacetName } from "@/types";
import { FACETS } from "@/config/facets"; // Import FACETS for colorVariable

// Updated ROYGBIV palette (capitalized keys to match FacetName)
export const DOMAIN_COLORS: Record<FacetName | string, string> = {
  Ontology:     "#E53935", // Red
  Epistemology: "#FB8C00", // Orange
  Praxeology:   "#FDD835", // Yellow
  Axiology:     "#43A047", // Green
  Mythology:    "#1E88E5", // Blue
  Cosmology:    "#5E35B1", // Indigo
  Teleology:    "#8E24AA", // Violet
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
  const baseColor = DOMAIN_COLORS[domainName] || FALLBACK_COLOR;

  // Score thresholds: 0-0.33 (dark), 0.34-0.66 (base), 0.67-1.0 (light)
  if (score <= 0.33) {
    return chroma(baseColor).darken(1.5).hex();
  } else if (score <= 0.66) {
    return baseColor; 
  } else {
    return chroma(baseColor).brighten(1).hex();
  }
}

/**
 * Returns the HSL string for a facet's base color.
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