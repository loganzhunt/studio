
'use client';

import type { DomainScore, FacetName } from '@/types';
import { FACET_NAMES, FACETS } from '@/config/facets';
import { cn } from '@/lib/utils';
import { getFacetScoreColor } from '@/lib/colors'; // Updated import
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
    scores.forEach(score => scoreMap.set(score.facetName, Math.max(0, Math.min(1, score.score)))); // Clamp scores
  } else {
    FACET_NAMES.forEach(name => scoreMap.set(name, 0.5)); // Default neutral scores
  }

  // Apex-up triangle geometry:
  // Apex is at (width/2, 0)
  // Base is from (0, height) to (width, height)
  const getBandPath = (index: number) => {
    const y1 = index * bandSegmentHeight;
    const y2 = (index + 1) * bandSegmentHeight;

    // X-coordinate of the left edge of the triangle at a given y
    const xLeftAtY = (y: number) => (width / 2) * (y / height);
    // X-coordinate of the right edge of the triangle at a given y
    const xRightAtY = (y: number) => width - (width / 2) * (y / height);

    const p1x = xLeftAtY(y1);
    const p2x = xRightAtY(y1);
    const p3x = xRightAtY(y2);
    const p4x = xLeftAtY(y2);

    return `M ${p1x},${y1} L ${p2x},${y1} L ${p3x},${y2} L ${p4x},${y2} Z`;
  };


  return (
    <div className={cn("p-0", className)}> {/* Removed default p-4 for more control by parent */}
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
            const score = scoreMap.get(facetName) ?? 0.5; // Default score if not found
            const bandColor = getFacetScoreColor(facetName, score); // Use new color function

            return (
              <path
                key={facetName}
                d={getBandPath(index)}
                fill={bandColor} // Use dynamically calculated color
                stroke="hsl(var(--card-foreground) / 0.1)" // Subtle border
                strokeWidth="0.5"
                // Opacity is now fixed at 1, color intensity handles the score representation
                className={cn(
                  "transition-all duration-300 ease-in-out", // transition for potential future color changes
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
