
'use client';

import type { DomainScore, FacetName } from '@/types';
import { FACET_NAMES, FACETS } from '@/config/facets';
import { cn } from '@/lib/utils';
import { getBandColor } from '@/lib/colors';
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
const DEFAULT_HEIGHT = 260; 
const NUM_BANDS = FACET_NAMES.length;

export function TriangleChart({
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
    scores.forEach(score => scoreMap.set(score.facetName, score.score));
  } else {
    FACET_NAMES.forEach(name => scoreMap.set(name, 0.5)); 
  }

  const getBandPath = (index: number) => {
    const y1 = index * bandSegmentHeight;
    const y2 = (index + 1) * bandSegmentHeight;
    
    const p1x = (width / 2) * (y1 / height); // Adjusted for apex-up: width is 0 at y=0, max at y=height
    const p1y = y1;
    const p2x = width - p1x; // Symmetrical
    const p2y = y1;
    const p3x = width - (width / 2) * (y2 / height); // Symmetrical
    const p3y = y2;
    const p4x = (width / 2) * (y2 / height); // Adjusted for apex-up
    const p4y = y2;
    
    return `M ${p1x},${p1y} L ${p2x},${p2y} L ${p3x},${p3y} L ${p4x},${p4y} Z`;
  };

  return (
    <div className={cn("p-4", className)}> {/* Removed glassmorphic from default here, applied by parent if needed */}
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
            const score = scoreMap.get(facetName) ?? 0;
            const bandColor = getBandColor(facetName, score);
            // const facetConfig = FACETS[facetName];
            // const strokeColorVar = facetConfig ? facetConfig.colorVariable : '--foreground';

            return (
              <path
                key={facetName}
                d={getBandPath(index)}
                fill={bandColor}
                stroke="hsl(var(--card-foreground) / 0.2)" // Default subtle stroke
                strokeWidth="0.5"
                className={cn(
                  "transition-all duration-300 ease-in-out", // Added 'all' for stroke transition
                  interactive && "cursor-pointer group outline-none",
                  interactive && "hover:stroke-[hsl(var(--card-foreground)_/_0.7)] hover:stroke-[1.5px] focus-visible:stroke-[hsl(var(--card-foreground)_/_0.7)] focus-visible:stroke-[1.5px]"
                )}
                onClick={interactive && onLayerClick ? () => onLayerClick(facetName) : undefined}
                tabIndex={interactive ? 0 : -1}
                aria-label={`${facetName}: Score ${Math.round(score * 100)}%`}
                onKeyDown={interactive && onLayerClick ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent page scroll on space
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
