/**
 * Example usage of Enhanced Facet Icons with LCH Colors
 * 
 * This file demonstrates various ways to use the enhanced FacetIcon component
 * and the facet icon helper functions.
 */

import React from 'react';
import type { FacetName, DomainScore } from '@/types';
import { FACET_NAMES } from '@/config/facets';
import { 
  FacetIcon, 
  ScoreBasedFacetIcon, 
  VividFacetIcon, 
  MutedFacetIcon,
  getFacetIconColorInfo 
} from '@/components/facet-icon';
import {
  generateFacetIconConfigs,
  getOptimalFacetIconColor,
  generateIconColorPalette,
  getSafeIconColors,
  validateIconAccessibility,
  getRecommendedIconSizes,
  ICON_PRESETS
} from '@/lib/facet-icon-helpers';

// Sample domain scores for demonstration
const sampleDomainScores: DomainScore[] = [
  { facetName: 'Ontology', score: 0.8 },
  { facetName: 'Epistemology', score: 0.6 },
  { facetName: 'Praxeology', score: 0.4 },
  { facetName: 'Axiology', score: 0.9 },
  { facetName: 'Mythology', score: 0.3 },
  { facetName: 'Cosmology', score: 0.7 },
  { facetName: 'Teleology', score: 0.5 }
];

/**
 * Basic icon usage examples
 */
export function BasicIconExamples() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Basic Icon Usage</h2>
      
      {/* Static icons (original behavior) */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Static Icons (CSS Variables)</h3>
        <div className="flex gap-4">
          {FACET_NAMES.map(facetName => (
            <div key={facetName} className="flex flex-col items-center gap-1">
              <FacetIcon facetName={facetName} size={24} />
              <span className="text-xs">{facetName}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dynamic icons with scores */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Dynamic Icons (LCH Colors)</h3>
        <div className="flex gap-4">
          {sampleDomainScores.map(({ facetName, score }) => (
            <div key={facetName} className="flex flex-col items-center gap-1">
              <FacetIcon facetName={facetName} score={score} size={24} />
              <span className="text-xs">{facetName}</span>
              <span className="text-xs text-gray-500">{Math.round(score * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Icon variant examples
 */
export function IconVariantExamples() {
  const facetName: FacetName = 'Ontology';
  const score = 0.7;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Icon Variants</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-2 p-4 border rounded">
          <FacetIcon facetName={facetName} score={score} variant="default" size={32} />
          <span className="text-sm font-medium">Default</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 p-4 border rounded">
          <FacetIcon facetName={facetName} score={score} variant="vivid" size={32} />
          <span className="text-sm font-medium">Vivid</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 p-4 border rounded">
          <FacetIcon facetName={facetName} score={score} variant="muted" size={32} />
          <span className="text-sm font-medium">Muted</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 p-4 border rounded">
          <FacetIcon 
            facetName={facetName} 
            score={score} 
            showAccessibilityText={true} 
            size={32} 
          />
          <span className="text-sm font-medium">Accessible</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Utility component examples
 */
export function UtilityComponentExamples() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Utility Components</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2 p-4 border rounded">
          <ScoreBasedFacetIcon facetName="Axiology" score={0.8} size={32} />
          <span className="text-sm font-medium">Score-Based</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 p-4 border rounded">
          <VividFacetIcon facetName="Epistemology" size={32} />
          <span className="text-sm font-medium">Vivid</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 p-4 border rounded">
          <MutedFacetIcon facetName="Praxeology" size={32} />
          <span className="text-sm font-medium">Muted</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Advanced configuration examples
 */
export function AdvancedConfigExamples() {
  const iconConfigs = generateFacetIconConfigs(sampleDomainScores);
  const accessibilityReport = validateIconAccessibility(sampleDomainScores);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Advanced Configuration</h2>
      
      {/* Color configuration grid */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Generated Icon Configurations</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.values(iconConfigs).map(config => (
            <div key={config.facetName} className="flex items-center gap-3 p-2 border rounded">
              <FacetIcon facetName={config.facetName} score={config.score} size={20} />
              <div className="flex-1">
                <div className="font-medium">{config.facetName}</div>
                <div className="text-gray-500">
                  Score: {config.score.toFixed(2)} | 
                  Contrast: {config.contrastRatio.toFixed(1)} |
                  {config.isAccessible ? ' ✅' : ' ❌'}
                </div>
              </div>
              <div 
                className="w-4 h-4 rounded border" 
                style={{ backgroundColor: config.color }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Accessibility report */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Accessibility Report</h3>
        <div className="p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-green-600">Passed ({accessibilityReport.passed.length})</div>
              <div>{accessibilityReport.passed.join(', ')}</div>
            </div>
            <div>
              <div className="font-medium text-yellow-600">Warnings ({accessibilityReport.warnings.length})</div>
              <div>{accessibilityReport.warnings.join(', ')}</div>
            </div>
            <div>
              <div className="font-medium text-red-600">Failed ({accessibilityReport.failed.length})</div>
              <div>{accessibilityReport.failed.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive icon sizes example
 */
export function ResponsiveIconSizes() {
  const facetName: FacetName = 'Cosmology';
  const score = 0.6;
  const sizes = getRecommendedIconSizes(facetName, score);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Responsive Icon Sizes</h2>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <FacetIcon facetName={facetName} score={score} size={sizes.minimum} />
          <span className="text-xs">Minimum ({sizes.minimum}px)</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <FacetIcon facetName={facetName} score={score} size={sizes.optimal} />
          <span className="text-xs">Optimal ({sizes.optimal}px)</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <FacetIcon facetName={facetName} score={score} size={sizes.maximum} />
          <span className="text-xs">Maximum ({sizes.maximum}px)</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Background-safe icons example
 */
export function BackgroundSafeIcons() {
  const facetName: FacetName = 'Mythology';
  const score = 0.7;
  const safeColors = getSafeIconColors(facetName, score);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Background-Safe Icons</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2 p-6 bg-white border rounded">
          <div style={{ color: safeColors.light }}>
            <FacetIcon facetName={facetName} size={32} style={{ color: safeColors.light }} />
          </div>
          <span className="text-sm">Light Background</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 p-6 bg-gray-900 border rounded">
          <div style={{ color: safeColors.dark }}>
            <FacetIcon facetName={facetName} size={32} style={{ color: safeColors.dark }} />
          </div>
          <span className="text-sm text-white">Dark Background</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 p-6 bg-gray-500 border rounded">
          <div style={{ color: safeColors.auto }}>
            <FacetIcon facetName={facetName} size={32} style={{ color: safeColors.auto }} />
          </div>
          <span className="text-sm text-white">Auto</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Preset configurations example
 */
export function PresetConfigurationsExample() {
  const facetName: FacetName = 'Teleology';
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Preset Configurations</h2>
      
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(ICON_PRESETS).map(([presetName, presetFn]) => {
          const config = presetFn(facetName);
          return (
            <div key={presetName} className="flex flex-col items-center gap-2 p-4 border rounded">
              <div style={{ color: config.color }}>
                <FacetIcon facetName={facetName} size={32} style={{ color: config.color }} />
              </div>
              <span className="text-sm font-medium capitalize">{presetName}</span>
              <span className="text-xs text-gray-500">
                Score: {config.score.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Complete demo component
 */
export default function FacetIconDemo() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Enhanced Facet Icons with LCH Colors</h1>
        <p className="text-gray-600">
          Demonstrating dynamic, score-based facet icons with advanced color management
        </p>
      </div>
      
      <BasicIconExamples />
      <IconVariantExamples />
      <UtilityComponentExamples />
      <ResponsiveIconSizes />
      <BackgroundSafeIcons />
      <PresetConfigurationsExample />
      <AdvancedConfigExamples />
    </div>
  );
}
