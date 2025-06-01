/**
 * Meta-Prism Facet Color Values
 * The exact color values used in the Tailwind configuration
 */

console.log('Meta-Prism Facet Color System');
console.log('=============================');

const facetColors = {
  ontology: {
    name: 'Ontology (Muted Violet)',
    question: 'What is real?',
    colors: {
      '50': '#f8f7ff',
      '100': '#f0edff', 
      '200': '#e4ddff',
      '300': '#d2c2ff',
      '400': '#b79eff',
      '500': '#9870ff',
      '600': '#7c4dff',
      '700': '#6339e6',
      '800': '#4f2bbd',
      '900': '#3f1f9a',
      'DEFAULT': '#7c4dff',
    }
  },
  epistemology: {
    name: 'Epistemology (Muted Indigo)',
    question: 'What can be known?',
    colors: {
      '50': '#f4f6ff',
      '100': '#ebf0ff',
      '200': '#d9e2ff',
      '300': '#bcc9ff',
      '400': '#9aa6ff',
      '500': '#7b85ff',
      '600': '#5c64ff',
      '700': '#4a50e6',
      '800': '#3c42bd',
      '900': '#30359a',
      'DEFAULT': '#5c64ff',
    }
  },
  praxeology: {
    name: 'Praxeology (Muted Blue)',
    question: 'How should we act?',
    colors: {
      '50': '#f0f8ff',
      '100': '#e0f2ff',
      '200': '#bae6ff',
      '300': '#85d3ff',
      '400': '#4fb8ff',
      '500': '#2499ff',
      '600': '#0f7bff',
      '700': '#0762e6',
      '800': '#0a4fbd',
      '900': '#0e419a',
      'DEFAULT': '#2499ff',
    }
  },
  axiology: {
    name: 'Axiology (Muted Green)',
    question: 'What has value?',
    colors: {
      '50': '#f0fdf6',
      '100': '#dcfce9',
      '200': '#bbf7d2',
      '300': '#86efad',
      '400': '#4ade80',
      '500': '#22c55e',
      '600': '#16a34a',
      '700': '#15803d',
      '800': '#166534',
      '900': '#14532d',
      'DEFAULT': '#22c55e',
    }
  },
  mythology: {
    name: 'Mythology (Muted Gold/Yellow)',
    question: 'What is the story?',
    colors: {
      '50': '#fffcf0',
      '100': '#fff8db',
      '200': '#ffefb8',
      '300': '#ffe385',
      '400': '#ffd24a',
      '500': '#ffbb1f',
      '600': '#f5a623',
      '700': '#cc7a1f',
      '800': '#a3601f',
      '900': '#85501d',
      'DEFAULT': '#f5a623',
    }
  },
  cosmology: {
    name: 'Cosmology (Muted Orange)',
    question: 'What is the universe?',
    colors: {
      '50': '#fff9f0',
      '100': '#ffefe0',
      '200': '#ffdbb8',
      '300': '#ffc085',
      '400': '#ff9a4a',
      '500': '#ff781f',
      '600': '#f5611f',
      '700': '#cc461f',
      '800': '#a3371f',
      '900': '#852e1d',
      'DEFAULT': '#ff781f',
    }
  },
  teleology: {
    name: 'Teleology (Muted Red)',
    question: 'What is the purpose?',
    colors: {
      '50': '#fff5f5',
      '100': '#ffe8e8',
      '200': '#ffd6d6',
      '300': '#ffb8b8',
      '400': '#ff8a8a',
      '500': '#ff5757',
      '600': '#f53333',
      '700': '#e11d48',
      '800': '#be123c',
      '900': '#9f1239',
      'DEFAULT': '#e11d48',
    }
  },
};

// Print color information
Object.entries(facetColors).forEach(([key, facet]) => {
  console.log(`\n${facet.name} - ${facet.question}`);
  console.log('─'.repeat(50));
  Object.entries(facet.colors).forEach(([shade, color]) => {
    console.log(`  ${shade.padEnd(7)}: ${color}`);
  });
});

// Print gradient values
console.log('\n\nGradient Values');
console.log('===============');

const defaultColors = Object.values(facetColors).map(f => f.colors.DEFAULT);
console.log(`Full Spectrum: ${defaultColors.join(', ')}`);

console.log('\nAdjacent Pairs:');
const facetKeys = Object.keys(facetColors);
facetKeys.forEach((facet, index) => {
  const nextFacet = facetKeys[(index + 1) % facetKeys.length];
  const currentColor = facetColors[facet].colors.DEFAULT;
  const nextColor = facetColors[nextFacet].colors.DEFAULT;
  console.log(`  ${facet} → ${nextFacet}: ${currentColor} → ${nextColor}`);
});

// Print usage examples
console.log('\n\nTailwind Class Examples');
console.log('=======================');

console.log('\n1. Text Colors:');
Object.keys(facetColors).forEach(facet => {
  console.log(`   text-facet-${facet} (${facetColors[facet].colors.DEFAULT})`);
});

console.log('\n2. Background Colors:');
Object.keys(facetColors).forEach(facet => {
  console.log(`   bg-facet-${facet}-100 (${facetColors[facet].colors['100']})`);
});

console.log('\n3. Border Colors:');
Object.keys(facetColors).forEach(facet => {
  console.log(`   border-facet-${facet}-300 (${facetColors[facet].colors['300']})`);
});

console.log('\n4. Gradient Classes:');
console.log('   bg-gradient-facet-spectrum');
console.log('   bg-gradient-ontology-epistemology');
console.log('   bg-gradient-praxeology-axiology');
console.log('   bg-gradient-mythology-cosmology');

console.log('\n5. Sample Component Classes:');
console.log('   <!-- Ontology Card Header -->');
console.log('   <div class="bg-gradient-to-r from-facet-ontology-500 to-facet-ontology-600 text-white">');
console.log('\n   <!-- Epistemology Button -->');
console.log('   <button class="bg-facet-epistemology hover:bg-facet-epistemology-700 text-white">');
console.log('\n   <!-- Axiology Chip -->');
console.log('   <span class="bg-facet-axiology-100 text-facet-axiology-800 px-3 py-1 rounded-full">');
console.log('\n   <!-- Spectrum Progress Bar -->');
console.log('   <div class="bg-gradient-facet-spectrum h-2 rounded-full">');

module.exports = facetColors;
