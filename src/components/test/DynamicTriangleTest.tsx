'use client';

import React from 'react';
import TriangleChart from '@/components/visualization/TriangleChart';
import type { DomainScore, FacetName } from '@/types';
import { FACET_NAMES } from '@/config/facets';

// Test worldview data with different score patterns
const testWorldviews = {
  // High scoring worldview (vivid, saturated colors)
  HighScorer: Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map((facetName): DomainScore => ({
    facetName,
    score: Math.random() * 0.3 + 0.7, // 0.7-1.0 range
  })) : [],

  // Medium scoring worldview (enhanced center boost)
  Balanced: Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map((facetName): DomainScore => ({
    facetName,
    score: Math.random() * 0.4 + 0.4, // 0.4-0.8 range
  })) : [],

  // Low scoring worldview (washed out, desaturated)
  LowScorer: Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map((facetName): DomainScore => ({
    facetName,
    score: Math.random() * 0.4 + 0.1, // 0.1-0.5 range
  })) : [],

  // Mixed profile (dramatic contrast)
  MixedProfile: [
    { facetName: 'Ontology' as FacetName, score: 0.9 },      // Very high
    { facetName: 'Epistemology' as FacetName, score: 0.1 },  // Very low
    { facetName: 'Praxeology' as FacetName, score: 0.6 },    // Medium (center boost)
    { facetName: 'Axiology' as FacetName, score: 0.95 },     // Maximum
    { facetName: 'Mythology' as FacetName, score: 0.3 },     // Low (yellow special handling)
    { facetName: 'Cosmology' as FacetName, score: 0.7 },     // Medium-high
    { facetName: 'Teleology' as FacetName, score: 0.05 },    // Minimum
  ],
};

export default function DynamicTriangleTest() {
  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">🌈 Dynamic Triangle Color System Test</h1>
        <p className="text-center text-gray-600 mb-8">
          Testing ROYGBIV hues with score-based lightness, chroma, and opacity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {Object.entries(testWorldviews).map(([name, scores]) => (
            <div key={name} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-center mb-4">{name}</h3>
              
              <div className="flex justify-center mb-4">
                <TriangleChart
                  scores={scores}
                  worldviewName={name}
                  width={200}
                  height={173}
                  interactive={true}
                />
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-gray-700">Score Details:</h4>
                {scores.map((score) => (
                  <div key={score.facetName} className="flex justify-between">
                    <span>{score.facetName}:</span>
                    <span className="font-mono">{(score.score * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🎨 Color System Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">ROYGBIV Hue Mapping</h3>
              <ul className="space-y-1 text-sm">
                <li><span className="inline-block w-4 h-4 rounded mr-2" style={{backgroundColor: '#8B5CF6'}}></span>Ontology: 305° (Violet)</li>
                <li><span className="inline-block w-4 h-4 rounded mr-2" style={{backgroundColor: '#6366F1'}}></span>Epistemology: 275° (Indigo)</li>
                <li><span className="inline-block w-4 h-4 rounded mr-2" style={{backgroundColor: '#3B82F6'}}></span>Praxeology: 250° (Blue)</li>
                <li><span className="inline-block w-4 h-4 rounded mr-2" style={{backgroundColor: '#10B981'}}></span>Axiology: 145° (Green)</li>
                <li><span className="inline-block w-4 h-4 rounded mr-2" style={{backgroundColor: '#F59E0B'}}></span>Mythology: 100° (Yellow)</li>
                <li><span className="inline-block w-4 h-4 rounded mr-2" style={{backgroundColor: '#F97316'}}></span>Cosmology: 55° (Orange)</li>
                <li><span className="inline-block w-4 h-4 rounded mr-2" style={{backgroundColor: '#EF4444'}}></span>Teleology: 25° (Red)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Dynamic Properties</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Lightness:</strong> High scores → Lower lightness (vivid)</li>
                <li><strong>Chroma:</strong> High scores → Higher chroma (saturated)</li>
                <li><strong>Opacity:</strong> High scores → Full opacity (1.0)</li>
                <li><strong>Center Boost:</strong> Scores 0.5-0.7 get +15 chroma</li>
                <li><strong>Yellow Special:</strong> Mythology uses adjusted ranges</li>
                <li><strong>Visual Impact:</strong> Each triangle looks unique</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
