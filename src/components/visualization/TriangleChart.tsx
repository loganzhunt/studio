'use client';

import type { DomainScore, FacetName } from '@/types';
import { FACET_NAMES, FACETS } from '@/config/facets';
import { cn } from '@/lib/utils';
import { getFacetScoreColor, generateTriangleColors } from '@/lib/colors'; 
import { getFacetColorInfo } from '@/lib/lch-colors';
import React, { useState, useEffect, useMemo } from 'react';

interface TriangleChartProps {
  scores?: DomainScore[];
  worldviewName?: string;
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  onLayerClick?: (facetName: FacetName) => void;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 260; // approx for equilateral triangle
const NUM_BANDS = Array.isArray(FACET_NAMES) ? FACET_NAMES.length : 0;

export default function TriangleChart({
  scores,
  worldviewName,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className,
  interactive = false,
  onLayerClick,
}: TriangleChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBand, setHoveredBand] = useState<FacetName | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const bandSegmentHeight = height / NUM_BANDS;

  // Create score map with enhanced LCH color calculation
  const scoreMap = useMemo(() => {
    const map = new Map<FacetName, number>();
    if (scores) {
      scores.forEach(score => {
        const normalizedScore = Math.max(0, Math.min(1, score.score ?? 0.5));
        map.set(score.facetName, normalizedScore);
      });
    } else {
      if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
      if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
        FACET_NAMES.forEach(name => map.set(name, 0.5)); // Default neutral scores
      }
      }
    }
    return map;
  }, [scores]);

  // Generate dynamic color palette using vivid LCH color system
  // Each band uses reference-quality ROYGBIV colors with no opacity changes
  const triangleColors = useMemo(() => {
    if (scores) {
      return generateTriangleColors(scores);
    }
    // Default colors for when no scores provided
    return Object.fromEntries(
      (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES : []).map(facetName => [
        facetName, 
        getFacetScoreColor(facetName, 0.5)
      ])
    ) as Record<FacetName, string>;
  }, [scores]);

  // Apex-up triangle geometry:
  // Apex is at (width/2, 0)
  // Base is from (0, height) to (width, height)
  const getBandPath = (index: number) => {
    const y1 = index * bandSegmentHeight;
    const y2 = (index + 1) * bandSegmentHeight;

    // Half-width of the triangle at a given y (distance from apex)
    const halfWidthAtY1 = (y1 / height) * (width / 2);
    const halfWidthAtY2 = (y2 / height) * (width / 2);

    // X-coordinates for the band points
    const p1x = (width / 2) - halfWidthAtY1; // Top-left X
    const p2x = (width / 2) + halfWidthAtY1; // Top-right X
    const p3x = (width / 2) + halfWidthAtY2; // Bottom-right X
    const p4x = (width / 2) - halfWidthAtY2; // Bottom-left X

    return `M ${p1x},${y1} L ${p2x},${y1} L ${p3x},${y2} L ${p4x},${y2} Z`;
  };

  return (
    <div className={cn("p-0", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-label="Triangle chart representing worldview facets"
        className={cn(
          "overflow-visible transition-opacity duration-700 ease-in-out",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <g>
          {Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 && FACET_NAMES.map((facetName, index) => {
            const score = scoreMap.get(facetName) ?? 0.5; 
            const bandColor = triangleColors[facetName];
            const colorInfo = getFacetColorInfo(facetName, score);
            const isHovered = hoveredBand === facetName;
            
            // EXTREME CONTRAST ENHANCEMENT: Maximum band separation with multiple visual techniques
            // All bands are 100% opaque with ultra-vivid chroma values up to C=160
            // S-curve enhancement + pow(2.0) scoring + ±4 lightness band variation ensures ULTIMATE visual differences
            // Each band now displays MAXIMUM ROYGBIV impact with crystal-clear differentiation

            // Calculate dynamic stroke properties for additional separation
            const strokeWidth = isHovered ? "2" : "1";
            const strokeOpacity = score > 0.7 ? 0.3 : score > 0.4 ? 0.2 : 0.15;
            
            return (
              <g key={facetName}>
                <path
                  d={getBandPath(index)}
                  fill={bandColor}
                  stroke="hsl(var(--card-foreground))"
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    interactive && "cursor-pointer group outline-none",
                    interactive && "hover:stroke-[hsl(var(--card-foreground)_/_0.7)] hover:stroke-[1.5px] focus-visible:stroke-[hsl(var(--card-foreground)_/_0.7)] focus-visible:stroke-[1.5px]",
                    isHovered && "drop-shadow-lg"
                  )}
                  onClick={interactive && onLayerClick ? () => onLayerClick(facetName) : undefined}
                  onMouseEnter={() => interactive && setHoveredBand(facetName)}
                  onMouseLeave={() => interactive && setHoveredBand(null)}
                  tabIndex={interactive ? 0 : -1}
                  aria-label={`${facetName}: Score ${Math.round(score * 100)}% (LCH: L${Math.round(colorInfo.lch.l)}, C${Math.round(colorInfo.lch.c)}, H${Math.round(colorInfo.lch.h)})`}
                  onKeyDown={interactive && onLayerClick ? (e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onLayerClick(facetName);
                    }
                  } : undefined}
                >
                  <title>
                    {worldviewName ? `${worldviewName} - ` : ''}{facetName}: Score {Math.round(score * 100)}%
                    {interactive && (
                      ` (LCH: L${Math.round(colorInfo.lch.l)}, C${Math.round(colorInfo.lch.c)}, H${Math.round(colorInfo.lch.h)})`
                    )}
                  </title>
                </path>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export { TriangleChart };
