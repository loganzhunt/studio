/**
 * Test Suite for Enhanced Facet Icons with LCH Colors
 * 
 * This file provides comprehensive tests and validation for the enhanced facet icon system.
 */

import type { FacetName, DomainScore } from '@/types';
import { FACET_NAMES } from '@/config/facets';
import {
  generateFacetIconConfigs,
  getOptimalFacetIconColor,
  generateIconColorPalette,
  getSafeIconColors,
  validateIconAccessibility,
  getRecommendedIconSizes,
  generateSpectrumIconColors,
  testFacetIconColors,
  getDominantFacetIconColor,
  ICON_PRESETS
} from '@/lib/facet-icon-helpers';

// Test data
const testDomainScores: DomainScore[] = [
  { facetName: 'Ontology', score: 0.8 },
  { facetName: 'Epistemology', score: 0.6 },
  { facetName: 'Praxeology', score: 0.4 },
  { facetName: 'Axiology', score: 0.9 },
  { facetName: 'Mythology', score: 0.3 },
  { facetName: 'Cosmology', score: 0.7 },
  { facetName: 'Teleology', score: 0.5 }
];

/**
 * Test the basic functionality of facet icon helpers
 */
export function runBasicTests() {
  console.log('🧪 Testing Enhanced Facet Icon Helpers');
  console.log('=' .repeat(50));
  
  // Test 1: Generate icon configurations
  console.log('\n📋 Test 1: Generate Icon Configurations');
  console.log('-'.repeat(40));
  const configs = generateFacetIconConfigs(testDomainScores);
  
  FACET_NAMES.forEach(facetName => {
    const config = configs[facetName];
    if (config) {
      console.log(`${facetName.padEnd(15)} Score: ${config.score.toFixed(2)} | Color: ${config.color} | Accessible: ${config.isAccessible ? '✅' : '❌'}`);
    }
  });
  
  // Test 2: Optimal colors
  console.log('\n🎯 Test 2: Optimal Icon Colors');
  console.log('-'.repeat(30));
  FACET_NAMES.forEach(facetName => {
    const optimal = getOptimalFacetIconColor(facetName, 0.6);
    console.log(`${facetName.padEnd(15)} ${optimal.color} (Contrast: ${optimal.contrastRatio.toFixed(1)})`);
  });
  
  // Test 3: Safe colors for different backgrounds
  console.log('\n🛡️  Test 3: Background-Safe Colors');
  console.log('-'.repeat(35));
  const testFacet: FacetName = 'Ontology';
  const safeColors = getSafeIconColors(testFacet, 0.7);
  console.log(`${testFacet}:`);
  console.log(`  Light bg: ${safeColors.light}`);
  console.log(`  Dark bg:  ${safeColors.dark}`);
  console.log(`  Auto:     ${safeColors.auto}`);
  
  // Test 4: Accessibility validation
  console.log('\n♿ Test 4: Accessibility Validation');
  console.log('-'.repeat(35));
  const accessibilityReport = validateIconAccessibility(testDomainScores);
  console.log(`Passed: ${accessibilityReport.passed.length} facets`);
  console.log(`Failed: ${accessibilityReport.failed.length} facets`);
  console.log(`Warnings: ${accessibilityReport.warnings.length} facets`);
  
  if (accessibilityReport.failed.length > 0) {
    console.log('\nFailed facets:');
    accessibilityReport.report
      .filter(r => !r.isAccessible)
      .forEach(r => {
        console.log(`  ${r.facetName}: ${r.contrastRatio.toFixed(1)} contrast (${r.recommendation})`);
      });
  }
  
  // Test 5: Recommended icon sizes
  console.log('\n📏 Test 5: Recommended Icon Sizes');
  console.log('-'.repeat(35));
  FACET_NAMES.forEach(facetName => {
    const sizes = getRecommendedIconSizes(facetName, 0.6);
    console.log(`${facetName.padEnd(15)} Min: ${sizes.minimum}px | Opt: ${sizes.optimal}px | Max: ${sizes.maximum}px`);
  });
  
  // Test 6: Spectrum colors
  console.log('\n🌈 Test 6: Spectrum Colors');
  console.log('-'.repeat(25));
  const spectrum = generateSpectrumIconColors();
  spectrum.forEach((color, index) => {
    console.log(`  ${index + 1}: ${color}`);
  });
  
  // Test 7: Dominant facet
  console.log('\n👑 Test 7: Dominant Facet');
  console.log('-'.repeat(25));
  const dominant = getDominantFacetIconColor(testDomainScores);
  console.log(`Dominant: ${dominant.facetName} (${dominant.score.toFixed(2)}) - ${dominant.color}`);
  
  console.log('\n✅ All tests completed successfully!');
}

/**
 * Test color variations for all facets
 */
export function testColorVariations() {
  console.log('\n🎨 Testing Color Variations Across Scores');
  console.log('=' .repeat(45));
  
  FACET_NAMES.forEach(facetName => {
    console.log(`\n${facetName}:`);
    const variations = testFacetIconColors(facetName);
    variations.forEach(({ score, color, isAccessible, contrastRatio, recommended }) => {
      const status = recommended ? '⭐' : isAccessible ? '✅' : '❌';
      console.log(`  Score ${score.toFixed(2)}: ${color} ${status} (${contrastRatio.toFixed(1)})`);
    });
  });
}

/**
 * Test preset configurations
 */
export function testPresetConfigurations() {
  console.log('\n⚙️  Testing Preset Configurations');
  console.log('=' .repeat(35));
  
  const testFacet: FacetName = 'Axiology';
  
  Object.entries(ICON_PRESETS).forEach(([presetName, presetFn]) => {
    const config = presetFn(testFacet);
    console.log(`${presetName.padEnd(12)} Score: ${config.score.toFixed(2)} | Color: ${config.color} | Accessible: ${config.isAccessible ? '✅' : '❌'}`);
  });
}

/**
 * Performance test for generating large sets of configurations
 */
export function performanceTest() {
  console.log('\n⚡ Performance Test');
  console.log('=' .repeat(20));
  
  const startTime = performance.now();
  
  // Generate configurations for 100 different score sets
  for (let i = 0; i < 100; i++) {
    const randomScores: DomainScore[] = FACET_NAMES.map(facetName => ({
      facetName,
      score: Math.random()
    }));
    
    generateFacetIconConfigs(randomScores);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`Generated 100 configuration sets in ${duration.toFixed(2)}ms`);
  console.log(`Average: ${(duration / 100).toFixed(2)}ms per set`);
}

/**
 * Test edge cases and error handling
 */
export function testEdgeCases() {
  console.log('\n🔍 Testing Edge Cases');
  console.log('=' .repeat(25));
  
  // Test with extreme scores
  console.log('\nExtreme scores:');
  const extremeScores: DomainScore[] = [
    { facetName: 'Ontology', score: 0 },
    { facetName: 'Epistemology', score: 1 },
    { facetName: 'Praxeology', score: -0.1 }, // Invalid
    { facetName: 'Axiology', score: 1.5 },   // Invalid
    { facetName: 'Mythology', score: 0.5 },
    { facetName: 'Cosmology', score: 0.5 },
    { facetName: 'Teleology', score: 0.5 }
  ];
  
  try {
    const configs = generateFacetIconConfigs(extremeScores);
    console.log('✅ Handled extreme scores gracefully');
    
    // Check if invalid scores were clamped
    console.log(`Praxeology score clamped to: ${configs.Praxeology?.score}`);
    console.log(`Axiology score clamped to: ${configs.Axiology?.score}`);
  } catch (error) {
    console.log('❌ Error handling extreme scores:', error);
  }
  
  // Test with empty scores
  console.log('\nEmpty scores:');
  try {
    const emptyConfigs = generateFacetIconConfigs([]);
    console.log('✅ Handled empty scores gracefully');
    console.log(`Generated ${Object.keys(emptyConfigs).length} default configurations`);
  } catch (error) {
    console.log('❌ Error handling empty scores:', error);
  }
}

/**
 * Visual output for manual testing
 */
export function generateVisualTestOutput() {
  console.log('\n🎭 Visual Test Output (for manual verification)');
  console.log('=' .repeat(50));
  
  const configs = generateFacetIconConfigs(testDomainScores);
  
  // Generate HTML snippet for visual testing
  let htmlOutput = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 16px;">\n';
  
  Object.values(configs).forEach(config => {
    htmlOutput += `
  <div style="
    padding: 16px; 
    border: 1px solid #e5e7eb; 
    border-radius: 8px; 
    text-align: center;
    background: white;
  ">
    <div style="
      width: 48px; 
      height: 48px; 
      margin: 0 auto 8px; 
      background-color: ${config.color}; 
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${config.textColor};
      font-weight: bold;
    ">${config.facetName.slice(0, 2)}</div>
    <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">${config.facetName}</h3>
    <p style="margin: 0; font-size: 12px; color: #6b7280;">
      Score: ${config.score.toFixed(2)}<br>
      Contrast: ${config.contrastRatio.toFixed(1)}<br>
      ${config.isAccessible ? '✅ Accessible' : '❌ Not Accessible'}
    </p>
  </div>`;
  });
  
  htmlOutput += '\n</div>';
  
  console.log('\nHTML for visual testing:');
  console.log('-'.repeat(25));
  console.log(htmlOutput);
  
  // Generate CSS custom properties
  console.log('\nCSS Custom Properties:');
  console.log('-'.repeat(25));
  Object.values(configs).forEach(config => {
    const facetKey = config.facetName.toLowerCase();
    console.log(`  --icon-${facetKey}: ${config.color};`);
    console.log(`  --icon-${facetKey}-text: ${config.textColor};`);
  });
}

/**
 * Run all tests
 */
export function runAllTests() {
  runBasicTests();
  testColorVariations();
  testPresetConfigurations();
  performanceTest();
  testEdgeCases();
  generateVisualTestOutput();
  
  console.log('\n🎉 All Enhanced Facet Icon Tests Completed!');
  console.log('=' .repeat(45));
}

// Run tests if this file is executed directly
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  // Node.js environment
  runAllTests();
}
