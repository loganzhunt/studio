'use client';

import type { DomainScore, FacetName } from '@/types';
import { FACETS, FACET_NAMES } from '@/config/facets';
import { cn } from '@/lib/utils';

interface TriangleChartProps {
  scores?: DomainScore[]; // Scores from 0 to 1 for each facet
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  onLayerClick?: (facetName: FacetName) => void;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 260; // approx for equilateral triangle

export function TriangleChart({
  scores,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className,
  interactive = false,
  onLayerClick,
}: TriangleChartProps) {
  const numBands = FACET_NAMES.length;
  const bandHeight = height / numBands;

  // Create a mapping of FacetName to score for quick lookup
  const scoreMap = new Map<FacetName, number>();
  if (scores) {
    scores.forEach(score => scoreMap.set(score.facetName, score.score));
  } else {
    // Default scores if none provided (e.g., for placeholder visuals)
    FACET_NAMES.forEach(name => scoreMap.set(name, 0.75)); // Default to 75% filled
  }

  const getBandPath = (index: number) => {
    const y1 = index * bandHeight;
    const y2 = (index + 1) * bandHeight;

    // Calculate width of the triangle at y1 and y2
    // For an equilateral triangle with point at top:
    // width at y = 2 * y / sqrt(3)
    // For a triangle with base at bottom:
    // width at y = base_width * (1 - y / H)
    // Let's use a simple isosceles triangle for now, point up.
    // Triangle tip at (width/2, 0), base from (0, height) to (width, height)
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
        className="overflow-visible"
      >
        <defs>
          {FACET_NAMES.map((facetName) => {
            const facetConfig = FACETS[facetName];
            return (
              <linearGradient key={`${facetName}-gradient`} id={`${facetName}-gradient`}>
                <stop offset="0%" stopColor={`hsl(var(${facetConfig.colorVariable.slice(2)}), 0.7)`} />
                <stop offset="100%" stopColor={`hsl(var(${facetConfig.colorVariable.slice(2)}), 0.9)`} />
              </linearGradient>
            );
          })}
        </defs>
        <g>
          {FACET_NAMES.map((facetName, index) => {
            const facetConfig = FACETS[facetName];
            const score = scoreMap.get(facetName) ?? 0.5; // Default score if not found
            const bandOpacity = 0.5 + score * 0.5; // Vary opacity based on score

            return (
              <path
                key={facetName}
                d={getBandPath(index)}
                fill={`url(#${facetName}-gradient)`}
                stroke="hsl(var(--card-foreground) / 0.2)"
                strokeWidth="0.5"
                style={{ opacity: bandOpacity }}
                className={cn(
                  "transition-opacity duration-300 ease-in-out",
                  interactive && "cursor-pointer hover:opacity-100"
                )}
                onClick={interactive && onLayerClick ? () => onLayerClick(facetName) : undefined}
                aria-label={`${facetName} score: ${Math.round(score * 100)}%`}
              >
                <title>{`${facetName}: ${Math.round(score * 100)}%`}</title>
              </path>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
