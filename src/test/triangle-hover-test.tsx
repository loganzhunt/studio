"use client";

import React from "react";
import TriangleChart from "@/components/visualization/TriangleChart";
import type { DomainScore, FacetName } from "@/types";
import { FACET_NAMES } from "@/config/facets";
import { motion } from "framer-motion";

export default function TriangleHoverTest() {
  // Sample test data
  const sampleScores: DomainScore[] = [
    { facetName: "Ontology" as FacetName, score: 0.7 },
    { facetName: "Epistemology" as FacetName, score: 0.5 },
    { facetName: "Praxeology" as FacetName, score: 0.8 },
    { facetName: "Axiology" as FacetName, score: 0.3 },
    { facetName: "Mythology" as FacetName, score: 0.6 },
    { facetName: "Cosmology" as FacetName, score: 0.9 },
    { facetName: "Teleology" as FacetName, score: 0.4 },
  ];

  const handleFacetClick = (facetName: FacetName) => {
    console.log(`Clicked on facet: ${facetName}`);
    // In a real application, you would trigger some action here
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">
          Triangle Hover Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Interactive Triangle
            </h2>
            <p className="text-white/70 mb-6">
              Each band/facet is individually hoverable with the 'lift'
              animation and includes keyboard accessibility.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <TriangleChart
                scores={sampleScores}
                worldviewName="Test Worldview"
                interactive={true}
                onLayerClick={handleFacetClick}
                width={300}
                height={260}
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Non-Interactive Triangle
            </h2>
            <p className="text-white/70 mb-6">
              This triangle doesn't have interactive bands for comparison.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <TriangleChart
                scores={sampleScores}
                worldviewName="Test Worldview"
                interactive={false}
                width={300}
                height={260}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Keyboard Navigation Instructions
          </h2>
          <ul className="text-white/80 space-y-2 list-disc pl-5">
            <li>
              Use <kbd className="bg-white/10 px-2 py-0.5 rounded">Tab</kbd> to
              focus on each facet
            </li>
            <li>
              Use{" "}
              <kbd className="bg-white/10 px-2 py-0.5 rounded">Arrow Up</kbd> /{" "}
              <kbd className="bg-white/10 px-2 py-0.5 rounded">Arrow Down</kbd>{" "}
              to navigate between facets
            </li>
            <li>
              Press <kbd className="bg-white/10 px-2 py-0.5 rounded">Enter</kbd>{" "}
              or <kbd className="bg-white/10 px-2 py-0.5 rounded">Space</kbd> to
              select a facet
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
