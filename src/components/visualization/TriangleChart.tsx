
'use client';

import type { DomainScore, FacetName } from '@/types';
import { FACET_NAMES } from '@/config/facets';
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
const DEFAULT_HEIGHT = 260; // Adjusted for a more equilateral feel with W=300
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
    FACET_NAMES.forEach(name => scoreMap.set(name, 0.5)); // Default if no scores
  }

  const getBandPath = (index: number) => {
    const y1 = index * bandSegmentHeight;
    const y2 = (index + 1) * bandSegmentHeight;

    // Apex-up triangle:
    // Apex is at (width / 2, 0)
    // Base is from (0, height) to (width, height)
    // For a band segment from y1 to y2:
    // Top-left: ((width / 2) * (1 - y1 / height), y1)
    // Top-right: ((width / 2) * (1 + y1 / height), y1)
    // Bottom-right: ((width / 2) * (1 + y2 / height), y2)
    // Bottom-left: ((width / 2) * (1 - y2 / height), y2)
    
    const p1x = (width / 2) * (1 - (y1 / height));
    const p1y = y1;
    const p2x = (width / 2) * (1 + (y1 / height));
    const p2y = y1;
    const p3x = (width / 2) * (1 + (y2 / height));
    const p3y = y2;
    const p4x = (width / 2) * (1 - (y2 / height));
    const p4y = y2;
    
    return `M ${p1x},${p1y} L ${p2x},${p2y} L ${p3x},${p3y} L ${p4x},${p4y} Z`;
  };

  return (
    <div className={cn("glassmorphic-card p-4", className)}>
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

            return (
              <path
                key={facetName}
                d={getBandPath(index)}
                fill={bandColor}
                stroke="hsl(var(--card-foreground) / 0.1)"
                strokeWidth="0.5"
                className={cn(
                  "transition-colors duration-300 ease-in-out",
                  interactive && "cursor-pointer group outline-none",
                  interactive && "hover:stroke-primary/70 hover:stroke-[1.5px] focus-visible:stroke-primary/70 focus-visible:stroke-[1.5px]"
                )}
                onClick={interactive && onLayerClick ? () => onLayerClick(facetName) : undefined}
                tabIndex={interactive ? 0 : -1}
                aria-label={`${facetName}: Score ${Math.round(score * 100)}%`}
                onKeyDown={interactive && onLayerClick ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
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
