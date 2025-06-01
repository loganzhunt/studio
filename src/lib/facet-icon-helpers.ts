/**
 * Facet Icon LCH Color Helpers
 * 
 * This module provides utility functions for working with facet icons and LCH colors.
 * It bridges the gap between the LCH color system and practical icon usage throughout the app.
 */

import type { FacetName, DomainScore } from '@/types';
import { FACETS, FACET_NAMES } from '@/config/facets';
import { 
  calculateBandColor, 
  getFacetColorInfo, 
  validateColorContrast,
  generateROYGBIVSpectrum,
  testFacetColorRange
} from '@/lib/lch-colors';

export interface FacetIconColorConfig {
  facetName: FacetName;
  color: string;
  textColor: string;
  isAccessible: boolean;
  contrastRatio: number;
  score: number;
  lch: {
    l: number;
    c: number;
    h: number;
  };
}

export interface FacetIconGridConfig {
  [key: string]: FacetIconColorConfig;
}

/**
 * Generate color configurations for all facets based on scores
 * Perfect for creating consistent icon grids or lists
 */
export function generateFacetIconConfigs(domainScores: DomainScore[]): FacetIconGridConfig {
  const configs: FacetIconGridConfig = {};
  
  // Create a score map for quick lookup
  const scoreMap = new Map<FacetName, number>();
  domainScores.forEach(score => {
    if (score.facetName && typeof score.score === 'number') {
      scoreMap.set(score.facetName as FacetName, score.score);
    }
  });
  
  // Generate config for each facet
  FACET_NAMES.forEach(facetName => {
    const score = scoreMap.get(facetName) ?? 0.5;
    const color = calculateBandColor(facetName, score);
    const colorInfo = getFacetColorInfo(facetName, score);
    const contrast = validateColorContrast(color);
    
    configs[facetName] = {
      facetName,
      color,
      textColor: contrast.textColor,
      isAccessible: contrast.isAccessible,
      contrastRatio: contrast.contrastRatio,
      score,
      lch: colorInfo.lch
    };
  });
  
  return configs;
}

/**
 * Get the optimal icon color for a specific facet and score
 * Includes accessibility considerations
 */
export function getOptimalFacetIconColor(facetName: FacetName, score: number = 0.6): FacetIconColorConfig {
  const color = calculateBandColor(facetName, score);
  const colorInfo = getFacetColorInfo(facetName, score);
  const contrast = validateColorContrast(color);
  
  return {
    facetName,
    color,
    textColor: contrast.textColor,
    isAccessible: contrast.isAccessible,
    contrastRatio: contrast.contrastRatio,
    score,
    lch: colorInfo.lch
  };
}

/**
 * Generate a color palette specifically optimized for icon usage
 * Returns slightly more saturated colors that work well for small icon sizes
 */
export function generateIconColorPalette(domainScores: DomainScore[]): Record<FacetName, string> {
  const scoreMap = new Map<FacetName, number>();
  domainScores.forEach(score => {
    if (score.facetName && typeof score.score === 'number') {
      scoreMap.set(score.facetName as FacetName, score.score);
    }
  });
  
  const palette: Record<FacetName, string> = {} as Record<FacetName, string>;
  
  FACET_NAMES.forEach(facetName => {
    const score = scoreMap.get(facetName) ?? 0.5;
    // Boost the score slightly for icons to ensure good visibility
    const iconScore = Math.min(1, score + 0.15);
    palette[facetName] = calculateBandColor(facetName, iconScore);
  });
  
  return palette;
}

/**
 * Get icon-safe colors that ensure visibility against common backgrounds
 * Returns variants for light and dark backgrounds
 */
export function getSafeIconColors(facetName: FacetName, score: number = 0.6): {
  light: string; // Safe for light backgrounds
  dark: string;  // Safe for dark backgrounds
  auto: string;  // Automatically chosen based on contrast
} {
  const baseColor = calculateBandColor(facetName, score);
  const colorInfo = getFacetColorInfo(facetName, score);
  
  // Generate lighter variant for dark backgrounds
  const lightVariant = calculateBandColor(facetName, Math.min(1, score + 0.3));
  
  // Generate darker variant for light backgrounds  
  const darkVariant = calculateBandColor(facetName, Math.max(0, score - 0.2));
  
  return {
    light: darkVariant,  // Darker color for light backgrounds
    dark: lightVariant,  // Lighter color for dark backgrounds
    auto: baseColor      // Standard color
  };
}

/**
 * Create CSS custom properties for facet icons
 * Useful for dynamic theming
 */
export function generateIconCSSProperties(domainScores: DomainScore[]): Record<string, string> {
  const configs = generateFacetIconConfigs(domainScores);
  const cssProps: Record<string, string> = {};
  
  Object.values(configs).forEach(config => {
    const facetKey = config.facetName.toLowerCase();
    cssProps[`--icon-${facetKey}`] = config.color;
    cssProps[`--icon-${facetKey}-text`] = config.textColor;
    cssProps[`--icon-${facetKey}-accessible`] = config.isAccessible ? '1' : '0';
  });
  
  return cssProps;
}

/**
 * Validate icon color accessibility across all facets
 * Returns a report of accessibility issues
 */
export function validateIconAccessibility(domainScores: DomainScore[]): {
  passed: FacetName[];
  failed: FacetName[];
  warnings: FacetName[];
  report: Array<{
    facetName: FacetName;
    score: number;
    color: string;
    contrastRatio: number;
    isAccessible: boolean;
    recommendation?: string;
  }>;
} {
  const configs = generateFacetIconConfigs(domainScores);
  const passed: FacetName[] = [];
  const failed: FacetName[] = [];
  const warnings: FacetName[] = [];
  const report = Object.values(configs).map(config => {
    const result = {
      facetName: config.facetName,
      score: config.score,
      color: config.color,
      contrastRatio: config.contrastRatio,
      isAccessible: config.isAccessible,
      recommendation: undefined as string | undefined
    };
    
    if (config.isAccessible) {
      passed.push(config.facetName);
    } else {
      failed.push(config.facetName);
      result.recommendation = `Consider increasing score to improve contrast. Target: ${(config.score + 0.2).toFixed(2)}`;
    }
    
    if (config.contrastRatio < 3) {
      warnings.push(config.facetName);
      result.recommendation = 'Very low contrast - consider alternative styling';
    }
    
    return result;
  });
  
  return { passed, failed, warnings, report };
}

/**
 * Get recommended icon sizes based on facet color intensity
 * More vibrant colors can work at smaller sizes
 */
export function getRecommendedIconSizes(facetName: FacetName, score: number): {
  minimum: number;   // Minimum size in pixels
  optimal: number;   // Optimal size in pixels
  maximum: number;   // Maximum recommended size
} {
  const colorInfo = getFacetColorInfo(facetName, score);
  const { c } = colorInfo.lch; // Chroma determines intensity
  
  // Higher chroma = can work at smaller sizes
  const chromaFactor = c / 100; // Normalize to 0-1
  
  return {
    minimum: Math.max(12, 16 - (chromaFactor * 4)),
    optimal: Math.max(16, 24 - (chromaFactor * 6)),
    maximum: Math.max(32, 48 - (chromaFactor * 8))
  };
}

/**
 * Generate spectrum-based icon colors for gradients or transitions
 * Perfect for animated icons or spectrum displays
 */
export function generateSpectrumIconColors(steps: number = 7): string[] {
  return generateROYGBIVSpectrum(0.7); // Use optimal score for icon visibility
}

/**
 * Test color variations for a specific facet
 * Useful for finding the best score for specific use cases
 */
export function testFacetIconColors(facetName: FacetName): Array<{
  score: number;
  color: string;
  isAccessible: boolean;
  contrastRatio: number;
  recommended: boolean;
}> {
  const colorRange = testFacetColorRange(facetName);
  
  return colorRange.map(({ score, color }) => {
    const contrast = validateColorContrast(color);
    return {
      score,
      color,
      isAccessible: contrast.isAccessible,
      contrastRatio: contrast.contrastRatio,
      recommended: contrast.contrastRatio >= 4.5 && score >= 0.4 && score <= 0.8
    };
  });
}

/**
 * Get the dominant facet color for mixed/combined displays
 * Useful when showing multiple facets together
 */
export function getDominantFacetIconColor(domainScores: DomainScore[]): {
  facetName: FacetName;
  color: string;
  score: number;
} {
  // Find the facet with the highest score
  const dominant = domainScores.reduce((max, current) => 
    current.score > max.score ? current : max
  );
  
  return {
    facetName: dominant.facetName as FacetName,
    color: calculateBandColor(dominant.facetName as FacetName, dominant.score),
    score: dominant.score
  };
}

/**
 * Generate icon color classes for Tailwind CSS
 * Returns utility classes that can be used with Tailwind
 */
export function generateIconTailwindClasses(domainScores: DomainScore[]): Record<FacetName, {
  text: string;
  bg: string;
  border: string;
  ring: string;
}> {
  const configs = generateFacetIconConfigs(domainScores);
  const classes: Record<FacetName, any> = {} as Record<FacetName, any>;
  
  Object.values(configs).forEach(config => {
    const facetKey = config.facetName.toLowerCase();
    classes[config.facetName] = {
      text: `text-facet-${facetKey}`,
      bg: `bg-facet-${facetKey}`,
      border: `border-facet-${facetKey}`,
      ring: `ring-facet-${facetKey}`
    };
  });
  
  return classes;
}

// Export commonly used preset configurations
export const ICON_PRESETS = {
  // High contrast for accessibility
  accessible: (facetName: FacetName) => getOptimalFacetIconColor(facetName, 0.8),
  
  // Subtle for backgrounds
  subtle: (facetName: FacetName) => getOptimalFacetIconColor(facetName, 0.3),
  
  // Vivid for attention-grabbing
  vivid: (facetName: FacetName) => getOptimalFacetIconColor(facetName, 0.9),
  
  // Balanced for general use
  balanced: (facetName: FacetName) => getOptimalFacetIconColor(facetName, 0.6)
};
