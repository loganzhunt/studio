
import chroma from "chroma-js";
import type { FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";

// Base hex colors for UI elements like text, icons (original muted ROYGBIV for text)
export const DOMAIN_COLORS: Record<FacetName | string, string> = {
  Ontology:     "#FF3333", // Vibrant Red
  Epistemology: "#FF9900", // Vibrant Orange
  Praxeology:   "#FFEB3B", // Vibrant Yellow
  Axiology:     "#38C172", // Vibrant Green
  Mythology:    "#2196F3", // Vibrant Blue
  Cosmology:    "#6B47DC", // Vibrant Indigo
  Teleology:    "#B455B6", // Vibrant Violet
};

// Chroma.js scales for triangle chart bands AND spectrum bars, using HCL mode.
// Colors transition from a darker shade, through the vibrant base, to a lighter shade.
const DOMAIN_SCALES: Record<FacetName, chroma.Scale> = {
  Ontology:     chroma.scale([chroma(DOMAIN_COLORS.Ontology).darken(1.5).hex(), DOMAIN_COLORS.Ontology, chroma(DOMAIN_COLORS.Ontology).brighten(1.5).hex()]).mode('hcl'),
  Epistemology: chroma.scale([chroma(DOMAIN_COLORS.Epistemology).darken(1.5).hex(), DOMAIN_COLORS.Epistemology, chroma(DOMAIN_COLORS.Epistemology).brighten(1.5).hex()]).mode('hcl'),
  Praxeology:   chroma.scale([chroma(DOMAIN_COLORS.Praxeology).darken(1.5).hex(), DOMAIN_COLORS.Praxeology, chroma(DOMAIN_COLORS.Praxeology).brighten(1.5).hex()]).mode('hcl'),
  Axiology:     chroma.scale([chroma(DOMAIN_COLORS.Axiology).darken(1.5).hex(), DOMAIN_COLORS.Axiology, chroma(DOMAIN_COLORS.Axiology).brighten(1.5).hex()]).mode('hcl'),
  Mythology:    chroma.scale([chroma(DOMAIN_COLORS.Mythology).darken(1.5).hex(), DOMAIN_COLORS.Mythology, chroma(DOMAIN_COLORS.Mythology).brighten(1.5).hex()]).mode('hcl'),
  Cosmology:    chroma.scale([chroma(DOMAIN_COLORS.Cosmology).darken(1.5).hex(), DOMAIN_COLORS.Cosmology, chroma(DOMAIN_COLORS.Cosmology).brighten(1.5).hex()]).mode('hcl'),
  Teleology:    chroma.scale([chroma(DOMAIN_COLORS.Teleology).darken(1.5).hex(), DOMAIN_COLORS.Teleology, chroma(DOMAIN_COLORS.Teleology).brighten(1.5).hex()]).mode('hcl'),
};

const FALLBACK_COLOR_HEX = "#BDBDBD"; // Medium Gray

/**
 * Calculates the band color for the TriangleChart AND Spectrum Bars using chroma-js scales.
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
    // console.warn(`Facet config not found for HSL color: ${facetName}. Using foreground.`);
    return `hsl(var(--foreground))`; // Fallback to a general foreground color
  }
  const facetConfig = FACETS[facetName as FacetName];
  if (!facetConfig.colorVariable || !facetConfig.colorVariable.startsWith('--domain-')) {
    // console.warn(`Invalid colorVariable for facet: ${facetName}. Using foreground.`);
    return `hsl(var(--foreground))`;
  }
  return `hsl(var(${facetConfig.colorVariable.slice(2)}))`;
}

export const SPECTRUM_LABELS: Record<FacetName, { left: string; right: string }> = {
  Ontology:     { left: "Materialism", right: "Idealism" },
  Epistemology: { left: "Empirical", right: "Revelatory" },
  Praxeology:   { left: "Hierarchical", right: "Egalitarian" },
  Axiology:     { left: "Individualism", right: "Collectivism" },
  Mythology:    { left: "Linear", right: "Cyclical" },
  Cosmology:    { left: "Mechanistic", right: "Holistic" },
  Teleology:    { left: "Existential", right: "Divine" },
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

