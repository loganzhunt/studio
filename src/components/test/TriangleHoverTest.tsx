"use client";

import React from "react";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { FACET_NAMES } from "@/config/facets";

/**
 * Test component for demonstrating and validating triangle hover functionality
 */
export default function TriangleHoverTest() {
  const handleLayerClick = (facet: any) => {
    console.log(`Band clicked: ${facet}`);
    // This could be expanded to show additional information or trigger other actions
  };

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold">Triangle Hover Test</h1>

      <div className="flex flex-wrap gap-12">
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl">Interactive Triangle</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs text-center">
            Each band is independently hoverable and keyboard navigable. Try
            using Tab, arrow keys, Enter or Space to interact.
          </p>
          <div className="border border-border bg-card/50 rounded-lg p-6">
            <TriangleChart
              width={280}
              height={240}
              interactive={true}
              onLayerClick={handleLayerClick}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl">Non-Interactive Triangle</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs text-center">
            For comparison, this triangle has no hover effects or interaction.
          </p>
          <div className="border border-border bg-card/50 rounded-lg p-6">
            <TriangleChart width={280} height={240} interactive={false} />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-md">
        <h3 className="text-lg font-medium mb-2">Keyboard Navigation</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <kbd className="px-1 py-0.5 bg-secondary text-secondary-foreground rounded">
              Tab
            </kbd>{" "}
            - Focus on triangle bands
          </li>
          <li>
            <kbd className="px-1 py-0.5 bg-secondary text-secondary-foreground rounded">
              ↑
            </kbd>{" "}
            /{" "}
            <kbd className="px-1 py-0.5 bg-secondary text-secondary-foreground rounded">
              ↓
            </kbd>{" "}
            - Navigate between bands
          </li>
          <li>
            <kbd className="px-1 py-0.5 bg-secondary text-secondary-foreground rounded">
              Home
            </kbd>{" "}
            /{" "}
            <kbd className="px-1 py-0.5 bg-secondary text-secondary-foreground rounded">
              End
            </kbd>{" "}
            - Go to first/last band
          </li>
          <li>
            <kbd className="px-1 py-0.5 bg-secondary text-secondary-foreground rounded">
              Enter
            </kbd>{" "}
            /{" "}
            <kbd className="px-1 py-0.5 bg-secondary text-secondary-foreground rounded">
              Space
            </kbd>{" "}
            - Select band
          </li>
        </ul>
      </div>
    </div>
  );
}
