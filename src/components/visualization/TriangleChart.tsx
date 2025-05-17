
'use client';

import type { DomainScore, FacetName } from '@/types';
import { FACET_NAMES } from '@/config/facets'; // FACETS import removed as not directly used
import { cn } from '@/lib/utils';
import { getBandColor } from '@/lib/colors';
import React, { useState, useEffect } from 'react'; // For entrance animation

interface TriangleChartProps {
  scores?: DomainScore[]; // Scores from 0 to 1 for each facet
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  onLayerClick?: (facetName: FacetName) => void;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 260; // approx for equilateral triangle with base W=300
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
    // Trigger fade-in animation shortly after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const bandSegmentHeight = height / NUM_BANDS;

  const scoreMap = new Map<FacetName, number>();
  if (scores) {
    scores.forEach(score => scoreMap.set(score.facetName, score.score));
  } else {
    // Default scores if none provided (e.g., for placeholder visuals)
    FACET_NAMES.forEach(name => scoreMap.set(name, 0.5)); // Default to 0.5 for base color
  }

  const getBandPath = (index: number) => {
    const y1 = index * bandSegmentHeight;
    const y2 = (index + 1) * bandSegmentHeight;

    // Upright Isosceles Triangle: Apex at (width/2, 0), Base from (0, height) to (width, height)
    const x1_offset = (y1 / height) * (width / 2);
    const x2_offset = (y2 / height) * (width / 2);

    const p1x = x1_offset;
    const p1y = y1;
    const p2x = width - x1_offset;
    const p2y = y1;
    const p3x = width - x2_offset;
    const p3y = y2;
    const p4x = x2_offset;
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
            const score = scoreMap.get(facetName) ?? 0; // Default to 0 for darkest shade if score missing
            const bandColor = getBandColor(facetName, score);

            return (
              <path
                key={facetName}
                d={getBandPath(index)}
                fill={bandColor}
                // No opacity based on score
                stroke="hsl(var(--card-foreground) / 0.1)" // Subtle border between bands
                strokeWidth="0.5"
                className={cn(
                  "transition-colors duration-300 ease-in-out", // For color changes if scores update
                  interactive && "cursor-pointer group outline-none",
                  interactive && "hover:stroke-white/70 hover:stroke-[1.5px] focus-visible:stroke-white/70 focus-visible:stroke-[1.5px]"
                )}
                onClick={interactive && onLayerClick ? () => onLayerClick(facetName) : undefined}
                tabIndex={interactive ? 0 : -1}
                aria-label={`${facetName}: ${Math.round(score * 100)}%`}
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
