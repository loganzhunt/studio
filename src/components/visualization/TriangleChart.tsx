
'use client';

import type { DomainScore, FacetName } from '@/types';
import { FACET_NAMES, FACETS } from '@/config/facets';
import { cn } from '@/lib/utils';
import { getFacetScoreColor } from '@/lib/colors'; 
import React, { useState, useEffect } from 'react';

interface TriangleChartProps {
  scores?: DomainScore[];
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  onLayerClick?: (facetName: FacetName) => void;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 260; // approx for equilateral triangle
const NUM_BANDS = FACET_NAMES.length;

// Change to default export
export default function TriangleChart({
  scores,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className,
  interactive = false,
  onLayerClick,
}: TriangleChartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const bandSegmentHeight = height / NUM_BANDS;

  const scoreMap = new Map<FacetName, number>();
  if (scores) {
    scores.forEach(score => scoreMap.set(score.facetName, Math.max(0, Math.min(1, score.score ?? 0.5))));
  } else {
    FACET_NAMES.forEach(name => scoreMap.set(name, 0.5)); // Default neutral scores
  }

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
          {FACET_NAMES.map((facetName, index) => {
            const score = scoreMap.get(facetName) ?? 0.5; 
            const bandColor = getFacetScoreColor(facetName, score);

            return (
              <path
                key={facetName}
                d={getBandPath(index)}
                fill={bandColor}
                stroke="hsl(var(--card-foreground) / 0.1)"
                strokeWidth="0.5"
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  interactive && "cursor-pointer group outline-none",
                  interactive && "hover:stroke-[hsl(var(--card-foreground)_/_0.7)] hover:stroke-[1.5px] focus-visible:stroke-[hsl(var(--card-foreground)_/_0.7)] focus-visible:stroke-[1.5px]"
                )}
                onClick={interactive && onLayerClick ? () => onLayerClick(facetName) : undefined}
                tabIndex={interactive ? 0 : -1}
                aria-label={`${facetName}: Score ${Math.round(score * 100)}%`}
                onKeyDown={interactive && onLayerClick ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onLayerClick(facetName);
                  }
                } : undefined}
              >
                <title>{`${facetName}: Score ${Math.round(score * 100)}%`}</title>
              </path>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
