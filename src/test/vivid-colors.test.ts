/**
 * Test file to verify the new vivid LCH color system
 * Demonstrates that all triangle bands use vivid, reference-quality colors
 */

import { calculateBandColor, testFacetColorRange, ROYGBIV_HUES } from '../lib/lch-colors';
import { FACET_NAMES } from '../config/facets';
import type { FacetName } from '../types';

console.log('🌈 Testing Vivid LCH Color System');
console.log('================================');

describe('Vivid LCH Color System', () => {
  test('should generate valid hex colors for all facets', () => {
    FACET_NAMES.forEach(facetName => {
      const color = calculateBandColor(facetName, 0.8);
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  test('should have distinct ROYGBIV hues for each facet', () => {
    const hues = Object.values(ROYGBIV_HUES);
    const uniqueHues = new Set(hues);
    expect(uniqueHues.size).toBe(hues.length);
  });

  test('should generate color range test data', () => {
    const testData = testFacetColorRange('Ontology');
    expect(testData).toHaveLength(5);
    expect(testData[0].score).toBe(0);
    expect(testData[4].score).toBe(1);
    
    testData.forEach(item => {
      expect(item).toHaveProperty('score');
      expect(item).toHaveProperty('color');
      expect(item.color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

// Test each facet with different score values
if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
  FACET_NAMES.forEach((facetName: FacetName) => {
    console.log(`\n${facetName} (Hue: ${ROYGBIV_HUES[facetName]}°):`);
    
    const colorRange = testFacetColorRange(facetName);
    colorRange.forEach(({ score, color }) => {
      console.log(`  Score ${score.toFixed(2)}: ${color}`);
    });
  });
}

// Test edge cases
console.log('\n🔬 Edge Cases:');
console.log(`Ontology Score 0.0: ${calculateBandColor('Ontology', 0.0)}`);
console.log(`Ontology Score 1.0: ${calculateBandColor('Ontology', 1.0)}`);
console.log(`Yellow Score 0.5: ${calculateBandColor('Mythology', 0.5)}`);
console.log(`Green Score 0.75: ${calculateBandColor('Axiology', 0.75)}`);

console.log('\n✅ All colors should be vivid and never use opacity!');
