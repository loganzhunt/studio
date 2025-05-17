
import chroma from "chroma-js";
import type { FacetName } from "@/types";

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
export function getBandColor(domainName: FacetName | string, score: number): string {
  const baseColor = DOMAIN_COLORS[domainName] || FALLBACK_COLOR;

  if (score <= 0.33) { // Adjusted threshold for better distribution (0-0.33, 0.34-0.66, 0.67-1.0)
    return chroma(baseColor).darken(1.5).hex(); // Slightly less dark than 2
  } else if (score <= 0.66) {
    return baseColor; // Normal shade
  } else {
    return chroma(baseColor).brighten(1).hex(); // Slightly less bright than 1.2
  }
}
