import type { FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { clamp } from "@/lib/utils";
import {
  calculateBandColor,
  generateTriangleColorPalette,
  getFacetScoreColorLCH,
  FACET_COLORS_LCH,
  generateROYGBIVSpectrum,
} from "./lch-colors";

// Vivid ROYGBIV Reference Colors (for static UI elements)
// Triangle bands use dynamic LCH colors based on scores - these are reference colors only
// Updated: Triangle rendering now uses vivid, reference-quality LCH colors with no opacity
export const FACET_COLORS: Record<FacetName, string> = {
  Ontology: "#8e6bf7", // Violet (Reference)
  Epistemology: "#0082ff", // Indigo (Reference)
  Praxeology: "#00b8ff", // Blue (Reference)
  Axiology: "#2df36c", // Green (Reference)
  Mythology: "#f1e800", // Yellow (Reference)
  Cosmology: "#ff9315", // Orange (Reference)
  Teleology: "#ff0045", // Red (Reference)
};

// Export for backup component compatibility
export const LCH_DOMAIN_COLORS_HEX: string[] = Object.values(FACET_COLORS);

/**
 * ENHANCED: Gets bold, saturated colors for maximum visual impact
 * This is the main function used by triangle rendering
 * Supports both 2-parameter (backup) and 3-parameter (current) signatures
 * Updated: Uses bold, saturated LCH values that "pop" against any background
 */
export function getFacetScoreColor(...args: any[]): string {
  if (args.length === 2) {
    // Enhanced signature: getFacetScoreColor(facetName, score)
    const [facetName, score] = args;

    if (typeof score === "number" && score >= 0 && score <= 1) {
      // Use bold, saturated LCH colors
      return getFacetScoreColorLCH(facetName as FacetName, score);
    }

    // Fallback to static color
    return FACET_COLORS[facetName as FacetName] || "#6b7280";
  } else if (args.length === 3) {
    // Current signature: getFacetScoreColor(worldviewName, facetName, score)
    const [worldviewName, facetName, score] = args;

    if (typeof score === "number" && score >= 0 && score <= 1) {
      // Use bold, saturated LCH colors
      return getFacetScoreColorLCH(facetName as FacetName, score);
    }

    // Fallback to static color
    return FACET_COLORS[facetName as FacetName] || "#6b7280";
  }

  return "#6b7280";
}

/**
 * Generate a complete color palette for triangle rendering
 * Used by Codex, Archetypes, Dashboard, and Results sections
 */
export function generateTriangleColors(
  domainScores: DomainScore[]
): Record<FacetName, string> {
  return generateTriangleColorPalette(domainScores);
}

/**
 * Generate ROYGBIV spectrum colors using LCH system
 * Used for spectrum sliders and gradient backgrounds
 */
export function getROYGBIVSpectrum(score: number = 0.7): string[] {
  return generateROYGBIVSpectrum(score);
}

/**
 * Simple color interpolation based on opacity for scores (legacy)
 */
export function interpolateFacetColor(
  facetName: FacetName,
  score: number
): string {
  // Use the new LCH system for better color interpolation
  if (typeof score === "number" && score >= 0 && score <= 1) {
    return getFacetScoreColorLCH(facetName, score);
  }

  // Fallback to old opacity-based method
  const baseColor = FACET_COLORS[facetName];
  if (!baseColor) return "#6b7280";

  // Convert to rgba with opacity based on score
  const opacity = clamp(score, 0.3, 1);
  const hex = baseColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Utility functions to replace chroma-js functionality
 */

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Brighten a hex color
export function brightenColor(hex: string, amount: number = 1.5): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 + amount * 0.2; // Convert to a reasonable factor
  const r = Math.min(255, Math.round(rgb.r * factor));
  const g = Math.min(255, Math.round(rgb.g * factor));
  const b = Math.min(255, Math.round(rgb.b * factor));

  return rgbToHex(r, g, b);
}

// Darken a hex color
export function darkenColor(hex: string, amount: number = 1.5): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 - amount * 0.2; // Convert to a reasonable factor
  const r = Math.max(0, Math.round(rgb.r * factor));
  const g = Math.max(0, Math.round(rgb.g * factor));
  const b = Math.max(0, Math.round(rgb.b * factor));

  return rgbToHex(r, g, b);
}

// Simple color scale interpolation
export function colorScale(colors: string[], score: number): string {
  if (colors.length < 2) return colors[0] || "#888888";

  // Clamp score between 0 and 1
  const clampedScore = clamp(score);

  if (clampedScore === 0) return colors[0];
  if (clampedScore === 1) return colors[colors.length - 1];

  // Find the two colors to interpolate between
  const segmentSize = 1 / (colors.length - 1);
  const segmentIndex = Math.floor(clampedScore / segmentSize);
  const segmentProgress = (clampedScore % segmentSize) / segmentSize;

  const color1 = hexToRgb(colors[segmentIndex]);
  const color2 = hexToRgb(
    colors[Math.min(segmentIndex + 1, colors.length - 1)]
  );

  if (!color1 || !color2) return colors[segmentIndex];

  // Interpolate between the two colors
  const r = Math.round(color1.r + (color2.r - color1.r) * segmentProgress);
  const g = Math.round(color1.g + (color2.g - color1.g) * segmentProgress);
  const b = Math.round(color1.b + (color2.b - color1.b) * segmentProgress);

  return rgbToHex(r, g, b);
}

// Calculate color contrast (simplified version)
export function getTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return "#000";

  // Calculate luminance (simplified)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Return white text for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000" : "#fff";
}

/**
 * Legacy function for backward compatibility
 */
export function getFacetScoreColorLegacy(
  facetName: FacetName,
  score: number
): string {
  return FACET_COLORS[facetName] || "#6b7280";
}

/**
 * Get the pure reference color for a facet band (for legends, etc.)
 */
export function getFacetBandColor(facetName: FacetName): string {
  return FACET_COLORS[facetName] || "#6b7280";
}

// Legacy HSL variables for UI components (text, icons, etc.)
export const DOMAIN_COLORS_HSL_VARS: Record<FacetName, string> = {
  Ontology: "hsl(var(--domain-ontology))",
  Epistemology: "hsl(var(--domain-epistemology))",
  Praxeology: "hsl(var(--domain-praxeology))",
  Axiology: "hsl(var(--domain-axiology))",
  Mythology: "hsl(var(--domain-mythology))",
  Cosmology: "hsl(var(--domain-cosmology))",
  Teleology: "hsl(var(--domain-teleology))",
};

// Base HEX colors for UI elements (legacy compatibility)
export const DOMAIN_COLORS: Record<FacetName, string> = FACET_COLORS;

// Function to get HSL string for text, icons, etc., from CSS variables
export function getFacetColorHsl(facetName?: FacetName | string): string {
  if (!facetName || !FACETS[facetName as FacetName]) {
    return `hsl(var(--foreground))`;
  }
  const facetConfig = FACETS[facetName as FacetName];
  if (
    !facetConfig.colorVariable ||
    !facetConfig.colorVariable.startsWith("--domain-")
  ) {
    return `hsl(var(--foreground))`;
  }
  return `hsl(var(${facetConfig.colorVariable.slice(2)}))`;
}

// Bipolar labels for spectrums
export const SPECTRUM_LABELS: Record<
  FacetName,
  { left: string; right: string }
> = {
  Ontology: { left: "Materialism", right: "Idealism" },
  Epistemology: { left: "Empirical", right: "Revelatory" },
  Praxeology: { left: "Hierarchical", right: "Egalitarian" },
  Axiology: { left: "Individualism", right: "Collectivism" },
  Mythology: { left: "Linear", right: "Cyclical" },
  Cosmology: { left: "Mechanistic", right: "Holistic" },
  Teleology: { left: "Existential", right: "Divine" },
};

// Helper function to get the dominant facet based on scores
export const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || !Array.isArray(scores) || scores.length === 0) {
    return Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
      ? FACET_NAMES[0]
      : "Ontology"; // Default to the first facet name if no scores
  }
  const validScores = scores.filter(
    (s) =>
      s &&
      s.facetName &&
      typeof s.score === "number" &&
      FACET_NAMES.includes(s.facetName as FacetName)
  );
  if (validScores.length === 0) {
    return FACET_NAMES[0]; // Default if no valid scores found
  }
  // Find the score object with the highest score
  const dominantScoreObject = validScores.reduce((prev, current) =>
    current.score > prev.score ? current : prev
  );
  return (dominantScoreObject.facetName as FacetName) || FACET_NAMES[0]; // Return its facetName, or default
};
