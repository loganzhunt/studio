/**
 * Meta-Prism Facet Color Generator
 * Generates perceptually uniform, muted ROYGBIV colors using chroma-js in LCH space
 * 
 * To run this script:
 * npm install chroma-js
 * node scripts/generate-facet-colors.js
 */

const chroma = require('chroma-js');

// Base hues for each facet (muted ROYGBIV)
const facetHues = {
  ontology: 260,     // Muted Violet - What is real?
  epistemology: 240, // Muted Indigo - What can be known?
  praxeology: 210,   // Muted Blue - How should we act?
  axiology: 140,     // Muted Green - What has value?
  mythology: 45,     // Muted Gold/Yellow - What is the story?
  cosmology: 25,     // Muted Orange - What is the universe?
  teleology: 355     // Muted Red - What is the purpose?
};

// Generate color scales using LCH color space for perceptual uniformity
function generateFacetColorScale(hue, name) {
  const colors = {};
  
  // Use LCH space for perceptually uniform gradients
  // L (lightness): 15-95, C (chroma/saturation): 20-85
  const lightnessScale = [95, 90, 80, 65, 55, 50, 45, 35, 25, 15];
  const chromaScale = [20, 25, 35, 50, 65, 70, 75, 80, 85, 85];
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  shades.forEach((shade, index) => {
    const lightness = lightnessScale[index];
    const chromaValue = chromaScale[index];
    
    // Create color in LCH space then convert to hex
    const color = chroma.lch(lightness, chromaValue, hue).hex();
    colors[shade] = color;
  });
  
  // DEFAULT color (usually 500 or 600 for good contrast)
  colors.DEFAULT = colors[600];
  
  return colors;
}

// Generate all facet colors
const facetColors = {};
Object.entries(facetHues).forEach(([facet, hue]) => {
  facetColors[facet] = generateFacetColorScale(hue, facet);
});

// Print the generated colors in Tailwind format
console.log('// Generated Meta-Prism Facet Colors - Muted ROYGBIV palette');
console.log('facet: {');

Object.entries(facetColors).forEach(([facet, colors]) => {
  const descriptions = {
    ontology: 'What is real?',
    epistemology: 'What can be known?',
    praxeology: 'How should we act?',
    axiology: 'What has value?',
    mythology: 'What is the story?',
    cosmology: 'What is the universe?',
    teleology: 'What is the purpose?'
  };
  
  console.log(`  // ${facet.charAt(0).toUpperCase() + facet.slice(1)} (Muted ${facet === 'ontology' ? 'Violet' : facet === 'epistemology' ? 'Indigo' : facet === 'praxeology' ? 'Blue' : facet === 'axiology' ? 'Green' : facet === 'mythology' ? 'Gold/Yellow' : facet === 'cosmology' ? 'Orange' : 'Red'}) - ${descriptions[facet]}`);
  console.log(`  ${facet}: {`);
  
  Object.entries(colors).forEach(([shade, color]) => {
    console.log(`    '${shade}': '${color}',`);
  });
  
  console.log(`  },`);
});

console.log('},');

// Generate gradient utilities
console.log('\n// Gradient utilities using DEFAULT colors');
console.log('backgroundImage: {');

const defaultColors = Object.entries(facetColors).map(([facet, colors]) => colors.DEFAULT);
console.log(`  'gradient-facet-spectrum': 'linear-gradient(to right, ${defaultColors.join(', ')})',`);
console.log(`  'gradient-facet-spectrum-radial': 'radial-gradient(circle, ${defaultColors.join(', ')})',`);

// Adjacent pairs
const facetNames = Object.keys(facetColors);
facetNames.forEach((facet, index) => {
  const nextFacet = facetNames[(index + 1) % facetNames.length];
  const currentColor = facetColors[facet].DEFAULT;
  const nextColor = facetColors[nextFacet].DEFAULT;
  console.log(`  'gradient-${facet}-${nextFacet}': 'linear-gradient(to right, ${currentColor}, ${nextColor})',`);
});

console.log('},');

// Check accessibility - ensure good contrast ratios
console.log('\n// Accessibility check - contrast ratios against white/black:');
Object.entries(facetColors).forEach(([facet, colors]) => {
  const defaultColor = colors.DEFAULT;
  const contrastWhite = chroma.contrast(defaultColor, '#ffffff');
  const contrastBlack = chroma.contrast(defaultColor, '#000000');
  
  console.log(`// ${facet}: ${defaultColor} - White: ${contrastWhite.toFixed(2)} | Black: ${contrastBlack.toFixed(2)}`);
});

module.exports = { facetColors, facetHues };
