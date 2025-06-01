import type { FacetName } from '@/types';
import { FACETS, DEFAULT_FACET_ICON } from '@/config/facets';
import type { LucideProps } from 'lucide-react';
import { calculateBandColor, validateColorContrast, getFacetColorInfo } from '@/lib/lch-colors';

interface FacetIconProps extends LucideProps {
  facetName: FacetName | string; // Allow string for flexibility, but map to FacetName
  score?: number; // Optional score for dynamic LCH colors (0-1)
  showAccessibilityText?: boolean; // Whether to include accessible text colors
  variant?: 'default' | 'vivid' | 'muted'; // Color intensity variants
}

export function FacetIcon({ 
  facetName, 
  score, 
  showAccessibilityText = false,
  variant = 'default',
  className, 
  style: propStyle,
  ...props 
}: FacetIconProps) {
  const facet = FACETS[facetName as FacetName];
  const IconComponent = facet ? facet.icon : DEFAULT_FACET_ICON;
  
  // Generate dynamic style based on score or fall back to CSS variables
  const getDynamicStyle = () => {
    if (score !== undefined && facet && typeof score === 'number' && score >= 0 && score <= 1) {
      // Use dynamic LCH colors based on score
      let dynamicColor = calculateBandColor(facet.name, score);
      
      // Apply variant modifications
      if (variant === 'muted') {
        // Reduce saturation for muted variant
        const colorInfo = getFacetColorInfo(facet.name, score);
        const { l, c, h } = colorInfo.lch;
        dynamicColor = `lch(${l}% ${Math.max(20, c * 0.6)} ${h})`;
      } else if (variant === 'vivid') {
        // Use maximum saturation for vivid variant
        dynamicColor = calculateBandColor(facet.name, Math.min(1, score + 0.2));
      }
      
      const baseStyle = { color: dynamicColor };
      
      // Add accessibility-aware text color if requested
      if (showAccessibilityText) {
        const contrast = validateColorContrast(dynamicColor);
        return {
          ...baseStyle,
          '--icon-text-color': contrast.textColor,
          '--icon-accessible': contrast.isAccessible ? 'true' : 'false'
        };
      }
      
      return baseStyle;
    }
    
    // Fall back to static CSS variable behavior
    return facet ? { color: `hsl(var(${facet.colorVariable.slice(2)}))` } : {};
  };

  const combinedStyle = {
    ...getDynamicStyle(),
    ...propStyle
  };

  return <IconComponent className={className} style={combinedStyle} {...props} />;
}

// Utility function for common use cases
export function ScoreBasedFacetIcon({ facetName, score, ...props }: { facetName: FacetName; score: number } & Omit<FacetIconProps, 'facetName' | 'score'>) {
  return <FacetIcon facetName={facetName} score={score} {...props} />;
}

// Utility function for vivid icons
export function VividFacetIcon({ facetName, score = 0.8, ...props }: { facetName: FacetName; score?: number } & Omit<FacetIconProps, 'facetName' | 'variant'>) {
  return <FacetIcon facetName={facetName} score={score} variant="vivid" {...props} />;
}

// Utility function for muted icons
export function MutedFacetIcon({ facetName, score = 0.5, ...props }: { facetName: FacetName; score?: number } & Omit<FacetIconProps, 'facetName' | 'variant'>) {
  return <FacetIcon facetName={facetName} score={score} variant="muted" {...props} />;
}

// Utility function for getting facet icon color information
export function getFacetIconColorInfo(facetName: FacetName, score?: number) {
  if (score !== undefined && typeof score === 'number' && score >= 0 && score <= 1) {
    return getFacetColorInfo(facetName, score);
  }
  
  const facet = FACETS[facetName];
  return {
    hex: facet ? `hsl(var(${facet.colorVariable.slice(2)}))` : '#6b7280',
    lch: { l: 70, c: 50, h: 0 }, // Default values
    score: score || 0.5
  };
}
