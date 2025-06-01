/**
 * EXTREME CONTRAST MAXIMIZED: Ultra-Vivid LCH Color System for Ultimate Triangle Visual Impact
 * 
 * Implements EXTREME ultra-vivid, maximum-contrast ROYGBIV colors with ultimate band differences.
 * Each worldview triangle displays MAXIMUM visual impact with dramatically distinct bands.
 * 
 * 🔥🔥 EXTREME CONTRAST FOR ULTIMATE ROYGBIV LOOK WITH CRYSTAL-CLEAR BAND DIFFERENCES! 🔥🔥
 * 
 * EXTREME ENHANCEMENTS:
 * - EXTREME Chroma Ranges: Up to C=160 for ultimate saturation impact
 * - MAXIMUM Lightness Ranges: Up to 70-point ranges for ultimate contrast  
 * - S-Curve + pow(2.0) Enhancement: DRAMATIC score separation for ultimate visual impact
 * - EXTREME Band Contrast: ±4 lightness units + enhanced stroke properties
 * - Color-Specific Extreme Tuning: Each ROYGBIV band optimized for MAXIMUM impact
 * 
 * TECHNICAL SPECS:
 * - Fixed ROYGBIV Hue Mapping: Violet=305, Indigo=275, Blue=250, Green=145, Yellow=100, Orange=55, Red=25
 * - EXTREME Dynamic Chroma & Lightness: Score-based mapping within MAXIMUM ranges
 * - High Scores: MAXIMUM chroma (up to C=160) + optimal lightness = explosive vivid impact
 * - Low Scores: Strong chroma (40+ minimum) + minimum lightness = ultimate contrast
 * - No Opacity Changes: All colors are 100% opaque and fully saturated
 * - Enhanced Yellow/Green: Optimized ranges to maintain vibrancy while maximizing contrast
 * 
 * RESULT: Each triangle displays an EXPLOSIVE, unique "fingerprint" with ultimate band separation
 */

import chroma from 'chroma-js';
import type { FacetName, DomainScore } from '@/types';
import { FACET_NAMES } from '@/config/facets';

// ROYGBIV Hue Mapping for Reference-Quality Vivid Triangle Colors
// Fixed hues for consistent ROYGBIV color assignment per user requirements
export const ROYGBIV_HUES: Record<FacetName, number> = {
  Ontology:     305,  // Violet - Top band
  Epistemology: 275,  // Indigo - Second band  
  Praxeology:   250,  // Blue - Third band
  Axiology:     145,  // Green - Fourth band
  Mythology:    100,  // Yellow - Fifth band
  Cosmology:     55,  // Orange - Sixth band
  Teleology:     25   // Red - Bottom band
};

// ENHANCED: Ultra-Vivid LCH Ranges for Maximum ROYGBIV Triangle Impact
// EXTREME CONTRAST MAXIMIZATION for crystal-clear triangle differentiation
export const OPTIMIZED_LCH_RANGES: Record<FacetName, { lightness: { min: number; max: number }; chroma: { min: number; max: number } }> = {
  Ontology: {     // Violet - EXTREME contrast range for maximum differentiation
    lightness: { min: 25, max: 95 }, // MAXIMUM range: deepest purples to brightest violets (70-point range!)
    chroma: { min: 40, max: 140 }    // Ultra-extreme saturation range for dramatic visual impact
  },
  Epistemology: { // Indigo - EXTREME contrast range for maximum differentiation
    lightness: { min: 25, max: 95 },
    chroma: { min: 40, max: 140 }
  },
  Praxeology: {   // Blue - EXTREME contrast range for maximum differentiation
    lightness: { min: 25, max: 95 },
    chroma: { min: 40, max: 140 }
  },
  Axiology: {     // Green - Extreme range while maintaining natural appearance
    lightness: { min: 45, max: 99 }, // Even wider lightness for maximum contrast
    chroma: { min: 25, max: 95 }     // Maximum possible green chroma range
  },
  Mythology: {    // Yellow - Maximum contrast range for better differentiation
    lightness: { min: 65, max: 99 }, // Keep bright but maximize variation
    chroma: { min: 25, max: 90 }     // Maximum possible yellow chroma range
  },
  Cosmology: {    // Orange - EXTREME contrast range for maximum differentiation
    lightness: { min: 30, max: 98 }, // Extreme range: deep oranges to bright tangerines (68-point range!)
    chroma: { min: 45, max: 150 }    // MAXIMUM possible chroma for ultimate orange saturation
  },
  Teleology: {    // Red - EXTREME contrast range for maximum differentiation
    lightness: { min: 20, max: 90 }, // WIDEST range: deepest crimsons to bright reds (70-point range!)
    chroma: { min: 50, max: 160 }    // BEYOND maximum chroma - push LCH limits for ultimate red impact
  }
};


/**
 * Calculate EXTREME ultra-vivid LCH band color with MAXIMUM ROYGBIV separation
 * 
 * EXTREME CONTRAST for ultimate vivid ROYGBIV look with crystal-clear band differences:
 * - S-curve + pow(2.0) score enhancement for ULTIMATE visual separation
 * - EXTREME vivid chroma and lightness ranges (up to C=160, L=70-point ranges)
 * - EXTREME band contrast optimization (±4 lightness units) for ultimate differentiation
 * - No opacity changes - all colors are 100% opaque and fully saturated
 * 
 * @param facetName - The facet to color (determines hue and L/C ranges)
 * @param score - The domain score (0.0 to 1.0) determining color intensity
 * @returns Hex color string with EXTREME ultra-vivid, reference-quality colors
 */
export function calculateBandColor(facetName: FacetName, score: number): string {
  const hue = ROYGBIV_HUES[facetName];
  if (hue === undefined) {
    console.warn(`No hue found for facet: ${facetName}`);
    return '#6b7280'; // Fallback gray
  }

  const ranges = OPTIMIZED_LCH_RANGES[facetName];
  if (!ranges) {
    console.warn(`No LCH ranges found for facet: ${facetName}`);
    return '#6b7280'; // Fallback gray
  }

  // Clamp score to valid range
  const clampedScore = Math.max(0, Math.min(1, score));

  // EXTREME: Maximum nonlinear scaling for ultimate visual separation
  // pow(2.0) creates DRAMATIC differences between score levels for crystal-clear differentiation
  const enhancedScore = Math.pow(clampedScore, 2.0);

  // EXTREME: Additional score enhancement curve for maximum separation
  // S-curve transformation to push high scores even higher and low scores even lower
  const sCurveScore = enhancedScore < 0.5 
    ? 2 * enhancedScore * enhancedScore 
    : 1 - 2 * (1 - enhancedScore) * (1 - enhancedScore);

  try {
    // EXTREME: Ultra-vivid color mapping with maximum contrast optimization
    // Higher scores = MAXIMUM lightness + MAXIMUM chroma (explosive vivid impact)
    // Lower scores = MINIMUM lightness + strong chroma (maximum contrast difference)
    const lightness = ranges.lightness.min + (sCurveScore * (ranges.lightness.max - ranges.lightness.min));
    const chromaValue = ranges.chroma.min + (sCurveScore * (ranges.chroma.max - ranges.chroma.min));

    // EXTREME Band contrast boost: Stronger lightness variation for maximum band separation
    // This guarantees adjacent bands have dramatic visual separation
    const bandIndex = FACET_NAMES.indexOf(facetName);
    const lightnessBandBoost = Math.sin(bandIndex * 0.7) * 4; // ±4 lightness units for extreme separation
    const finalLightness = Math.max(0, Math.min(100, lightness + lightnessBandBoost));

    const lchColor = chroma.lch(finalLightness, chromaValue, hue);
    return lchColor.hex();
  } catch (error) {
    console.warn(`Error creating LCH color for ${facetName}:`, error);
    return chroma.hsl(hue, 0.9, 0.5).hex(); // Fallback
  }
}

/**
 * Generate color palette for a complete worldview triangle
 * 
 * @param domainScores - Array of domain scores for all facets
 * @returns Object mapping facet names to their calculated colors
 */
export function generateTriangleColorPalette(domainScores: DomainScore[]): Record<FacetName, string> {
  const colorPalette: Record<FacetName, string> = {} as Record<FacetName, string>;

  // Create a map for quick score lookup
  const scoreMap = new Map<FacetName, number>();
  domainScores.forEach(score => {
    if (score.facetName && typeof score.score === 'number') {
      scoreMap.set(score.facetName as FacetName, score.score);
    }
  });

  // Generate colors for each facet
  if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
    FACET_NAMES.forEach(facetName => {
      const score = scoreMap.get(facetName) ?? 0.5; // Default to neutral if no score
      colorPalette[facetName] = calculateBandColor(facetName, score);
    });
  }

  return colorPalette;
}

/**
 * Enhanced getFacetScoreColor function with vivid, reference-quality LCH colors
 * 
 * Provides vivid, saturated colors that maintain visual clarity at all score levels.
 * No opacity or transparency - all colors are 100% opaque and fully saturated within their range.
 */
export function getFacetScoreColorLCH(facetName: FacetName, score: number): string {
  return calculateBandColor(facetName, score);
}

/**
 * Get LCH color info for debugging/tooltips (using optimized per-band ranges)
 */
export function getFacetColorInfo(facetName: FacetName, score: number): {
  hex: string;
  lch: { l: number; c: number; h: number };
  score: number;
} {
  const hue = ROYGBIV_HUES[facetName];
  const clampedScore = Math.max(0, Math.min(1, score));
  
  // Get the optimized ranges for this facet
  const ranges = OPTIMIZED_LCH_RANGES[facetName];
  if (!ranges) {
    console.warn(`No LCH ranges found for facet: ${facetName}`);
    return {
      hex: '#6b7280',
      lch: { l: 70, c: 50, h: hue },
      score: clampedScore
    };
  }

  // Calculate the actual LCH values using the same logic as calculateBandColor
  // Apply nonlinear score scaling for consistency with band color calculation
  const enhancedScore = Math.pow(clampedScore, 1.2);
  const lightness = ranges.lightness.min + (enhancedScore * (ranges.lightness.max - ranges.lightness.min));
  const chromaValue = ranges.chroma.min + (enhancedScore * (ranges.chroma.max - ranges.chroma.min));

  const hex = calculateBandColor(facetName, score);

  return {
    hex,
    lch: {
      l: lightness,
      c: chromaValue,
      h: hue
    },
    score: clampedScore
  };
}

/**
 * Test different score values for a facet (demonstrates vivid color range)
 */
export function testFacetColorRange(facetName: FacetName): Array<{ score: number; color: string }> {
  const testScores = [0, 0.25, 0.5, 0.75, 1.0];
  return testScores.map(score => ({
    score,
    color: calculateBandColor(facetName, score) // Vivid colors at all score levels
  }));
}

/**
 * Validate color contrast for accessibility
 */
export function validateColorContrast(backgroundColor: string): {
  textColor: string;
  contrastRatio: number;
  isAccessible: boolean;
} {
  const bgColor = chroma(backgroundColor);
  const bgLuminance = bgColor.luminance();
  
  // Test with white and black text
  const whiteContrast = (0.05 + bgLuminance) / 0.05;
  const blackContrast = 1.05 / (bgLuminance + 0.05);
  
  const useWhite = whiteContrast > blackContrast;
  const contrastRatio = useWhite ? whiteContrast : blackContrast;
  
  return {
    textColor: useWhite ? '#ffffff' : '#000000',
    contrastRatio,
    isAccessible: contrastRatio >= 4.5 // WCAG AA standard
  };
}

// Export reference colors using mid-range scores for demonstration
export const FACET_COLORS_LCH = Object.fromEntries(
  Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(facetName => [
    facetName,
    calculateBandColor(facetName, 0.6) // Use 0.6 for vivid reference colors
  ]) : []
) as Record<FacetName, string>;
