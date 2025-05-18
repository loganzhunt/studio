
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
    // Ensure visibility is triggered after mount for animation
    const timer = setTimeout(() => setIsVisible(true), 100); // Small delay for CSS transition
    return () => clearTimeout(timer);
  }, []);

  const bandSegmentHeight = height / NUM_BANDS;

  const scoreMap = new Map<FacetName, number>();
  if (scores) {
    scores.forEach(score => scoreMap.set(score.facetName, score.score));
  } else {
    // Default scores if none provided (e.g., for placeholder visuals)
    FACET_NAMES.forEach(name => scoreMap.set(name, 0.5)); // Default to 0.5 for neutral
  }

  const getBandPath = (index: number) => {
    const y1 = index * bandSegmentHeight;
    const y2 = (index + 1) * bandSegmentHeight;
    
    // Apex-up triangle: width of band increases with y
    // x-offset from center for y1: (width / 2) * (y1 / height)
    // x-coordinate: (width / 2) - x-offset for left, (width/2) + x-offset for right
    // Simplified: left x = (width/2) * (1 - y/height) and right x = (width/2) * (1 + y/height) for apex-down
    // For apex-up: left x = (width/2) * (y/height) and right x = width - (width/2) * (y/height)
    
    const p1x = (width / 2) * (y1 / height); 
    const p1y = y1;
    const p2x = width - p1x; 
    const p2y = y1;

    const p4x = (width / 2) * (y2 / height); 
    const p4y = y2;
    const p3x = width - p4x;
    const p3y = y2;
    
    return `M ${p1x},${p1y} L ${p2x},${p2y} L ${p3x},${p3y} L ${p4x},${p4y} Z`;
  };

  return (
    <div className={cn("p-4", className)}> {/* Removed default glassmorphic class */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-label="Triangle chart representing worldview facets"
        className={cn(
          "overflow-visible transition-opacity duration-700 ease-in-out",
          isVisible ? "opacity-100" : "opacity-0" // Fade-in animation
        )}
      >
        <g>
          {FACET_NAMES.map((facetName, index) => {
            const score = scoreMap.get(facetName) ?? 0; // Default to 0 if score not found
            const bandColor = getBandColor(facetName, score);
            // const facetConfig = FACETS[facetName];
            // const strokeColorVar = facetConfig ? facetConfig.colorVariable : '--foreground'; // Example for dynamic stroke

            return (
              <path
                key={facetName}
                d={getBandPath(index)}
                fill={bandColor}
                stroke="hsl(var(--card-foreground) / 0.1)" // Default subtle stroke
                strokeWidth="0.5"
                className={cn(
                  "transition-all duration-300 ease-in-out", // Added 'all' for stroke transition
                  interactive && "cursor-pointer group outline-none",
                  interactive && "hover:stroke-[hsl(var(--card-foreground)_/_0.7)] hover:stroke-[1.5px] focus-visible:stroke-[hsl(var(--card-foreground)_/_0.7)] focus-visible:stroke-[1.5px]"
                )}
                onClick={interactive && onLayerClick ? () => onLayerClick(facetName) : undefined}
                tabIndex={interactive ? 0 : -1} // Make interactive bands focusable
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
