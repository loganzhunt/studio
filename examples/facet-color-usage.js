/**
 * Meta-Prism Facet Color System - Usage Examples
 * Comprehensive guide for using the muted ROYGBIV facet colors
 */

// ==========================================
// 1. SECTION/CARD HEADINGS
// ==========================================

// Primary facet headings (using DEFAULT colors)
const facetHeadings = {
  ontology: 'text-facet-ontology border-b border-facet-ontology/20',
  epistemology: 'text-facet-epistemology border-b border-facet-epistemology/20',
  praxeology: 'text-facet-praxeology border-b border-facet-praxeology/20',
  axiology: 'text-facet-axiology border-b border-facet-axiology/20',
  mythology: 'text-facet-mythology border-b border-facet-mythology/20',
  cosmology: 'text-facet-cosmology border-b border-facet-cosmology/20',
  teleology: 'text-facet-teleology border-b border-facet-teleology/20',
};

// Secondary headings (using lighter shades)
const secondaryHeadings = {
  ontology: 'text-facet-ontology-600 hover:text-facet-ontology',
  epistemology: 'text-facet-epistemology-600 hover:text-facet-epistemology',
  praxeology: 'text-facet-praxeology-600 hover:text-facet-praxeology',
  axiology: 'text-facet-axiology-600 hover:text-facet-axiology',
  mythology: 'text-facet-mythology-600 hover:text-facet-mythology',
  cosmology: 'text-facet-cosmology-600 hover:text-facet-cosmology',
  teleology: 'text-facet-teleology-600 hover:text-facet-teleology',
};

// ==========================================
// 2. SPECTRUM BARS & PROGRESS INDICATORS
// ==========================================

// Full spectrum gradient bar
const spectrumBar = 'bg-gradient-facet-spectrum h-2 rounded-full';

// Individual facet progress bars
const progressBars = {
  ontology: 'bg-gradient-to-r from-facet-ontology-200 to-facet-ontology-600',
  epistemology: 'bg-gradient-to-r from-facet-epistemology-200 to-facet-epistemology-600',
  praxeology: 'bg-gradient-to-r from-facet-praxeology-200 to-facet-praxeology-600',
  axiology: 'bg-gradient-to-r from-facet-axiology-200 to-facet-axiology-600',
  mythology: 'bg-gradient-to-r from-facet-mythology-200 to-facet-mythology-600',
  cosmology: 'bg-gradient-to-r from-facet-cosmology-200 to-facet-cosmology-600',
  teleology: 'bg-gradient-to-r from-facet-teleology-200 to-facet-teleology-600',
};

// Adjacent facet transitions
const adjacentBars = {
  'ontology-epistemology': 'bg-gradient-ontology-epistemology',
  'epistemology-praxeology': 'bg-gradient-epistemology-praxeology',
  'praxeology-axiology': 'bg-gradient-praxeology-axiology',
  'axiology-mythology': 'bg-gradient-axiology-mythology',
  'mythology-cosmology': 'bg-gradient-mythology-cosmology',
  'cosmology-teleology': 'bg-gradient-cosmology-teleology',
  'teleology-ontology': 'bg-gradient-teleology-ontology',
};

// ==========================================
// 3. GRADIENT BACKGROUNDS
// ==========================================

// Hero section gradients
const heroGradients = {
  spectrum: 'bg-gradient-facet-spectrum-radial opacity-20',
  conic: 'bg-gradient-facet-spectrum-conic opacity-15',
  subtle: 'bg-gradient-to-br from-facet-ontology-50 via-facet-praxeology-50 to-facet-teleology-50',
};

// Card background gradients (subtle)
const cardGradients = {
  ontology: 'bg-gradient-to-br from-facet-ontology-50 to-facet-ontology-100 border border-facet-ontology-200',
  epistemology: 'bg-gradient-to-br from-facet-epistemology-50 to-facet-epistemology-100 border border-facet-epistemology-200',
  praxeology: 'bg-gradient-to-br from-facet-praxeology-50 to-facet-praxeology-100 border border-facet-praxeology-200',
  axiology: 'bg-gradient-to-br from-facet-axiology-50 to-facet-axiology-100 border border-facet-axiology-200',
  mythology: 'bg-gradient-to-br from-facet-mythology-50 to-facet-mythology-100 border border-facet-mythology-200',
  cosmology: 'bg-gradient-to-br from-facet-cosmology-50 to-facet-cosmology-100 border border-facet-cosmology-200',
  teleology: 'bg-gradient-to-br from-facet-teleology-50 to-facet-teleology-100 border border-facet-teleology-200',
};

// ==========================================
// 4. BUTTONS & INTERACTIVE ELEMENTS
// ==========================================

// Primary buttons
const primaryButtons = {
  ontology: 'bg-facet-ontology hover:bg-facet-ontology-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
  epistemology: 'bg-facet-epistemology hover:bg-facet-epistemology-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
  praxeology: 'bg-facet-praxeology hover:bg-facet-praxeology-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
  axiology: 'bg-facet-axiology hover:bg-facet-axiology-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
  mythology: 'bg-facet-mythology hover:bg-facet-mythology-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
  cosmology: 'bg-facet-cosmology hover:bg-facet-cosmology-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
  teleology: 'bg-facet-teleology hover:bg-facet-teleology-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
};

// Secondary buttons (outline style)
const secondaryButtons = {
  ontology: 'border-2 border-facet-ontology text-facet-ontology hover:bg-facet-ontology hover:text-white transition-all duration-300 ease-in-out',
  epistemology: 'border-2 border-facet-epistemology text-facet-epistemology hover:bg-facet-epistemology hover:text-white transition-all duration-300 ease-in-out',
  praxeology: 'border-2 border-facet-praxeology text-facet-praxeology hover:bg-facet-praxeology hover:text-white transition-all duration-300 ease-in-out',
  axiology: 'border-2 border-facet-axiology text-facet-axiology hover:bg-facet-axiology hover:text-white transition-all duration-300 ease-in-out',
  mythology: 'border-2 border-facet-mythology text-facet-mythology hover:bg-facet-mythology hover:text-white transition-all duration-300 ease-in-out',
  cosmology: 'border-2 border-facet-cosmology text-facet-cosmology hover:bg-facet-cosmology hover:text-white transition-all duration-300 ease-in-out',
  teleology: 'border-2 border-facet-teleology text-facet-teleology hover:bg-facet-teleology hover:text-white transition-all duration-300 ease-in-out',
};

// Ghost buttons (subtle)
const ghostButtons = {
  ontology: 'text-facet-ontology hover:bg-facet-ontology-100 transition-all duration-300 ease-in-out',
  epistemology: 'text-facet-epistemology hover:bg-facet-epistemology-100 transition-all duration-300 ease-in-out',
  praxeology: 'text-facet-praxeology hover:bg-facet-praxeology-100 transition-all duration-300 ease-in-out',
  axiology: 'text-facet-axiology hover:bg-facet-axiology-100 transition-all duration-300 ease-in-out',
  mythology: 'text-facet-mythology hover:bg-facet-mythology-100 transition-all duration-300 ease-in-out',
  cosmology: 'text-facet-cosmology hover:bg-facet-cosmology-100 transition-all duration-300 ease-in-out',
  teleology: 'text-facet-teleology hover:bg-facet-teleology-100 transition-all duration-300 ease-in-out',
};

// ==========================================
// 5. CHIPS/TAGS & BADGES
// ==========================================

// Solid chips
const solidChips = {
  ontology: 'bg-facet-ontology text-white px-3 py-1 rounded-full text-sm font-medium',
  epistemology: 'bg-facet-epistemology text-white px-3 py-1 rounded-full text-sm font-medium',
  praxeology: 'bg-facet-praxeology text-white px-3 py-1 rounded-full text-sm font-medium',
  axiology: 'bg-facet-axiology text-white px-3 py-1 rounded-full text-sm font-medium',
  mythology: 'bg-facet-mythology text-white px-3 py-1 rounded-full text-sm font-medium',
  cosmology: 'bg-facet-cosmology text-white px-3 py-1 rounded-full text-sm font-medium',
  teleology: 'bg-facet-teleology text-white px-3 py-1 rounded-full text-sm font-medium',
};

// Soft chips (lighter backgrounds)
const softChips = {
  ontology: 'bg-facet-ontology-100 text-facet-ontology-800 px-3 py-1 rounded-full text-sm font-medium',
  epistemology: 'bg-facet-epistemology-100 text-facet-epistemology-800 px-3 py-1 rounded-full text-sm font-medium',
  praxeology: 'bg-facet-praxeology-100 text-facet-praxeology-800 px-3 py-1 rounded-full text-sm font-medium',
  axiology: 'bg-facet-axiology-100 text-facet-axiology-800 px-3 py-1 rounded-full text-sm font-medium',
  mythology: 'bg-facet-mythology-100 text-facet-mythology-800 px-3 py-1 rounded-full text-sm font-medium',
  cosmology: 'bg-facet-cosmology-100 text-facet-cosmology-800 px-3 py-1 rounded-full text-sm font-medium',
  teleology: 'bg-facet-teleology-100 text-facet-teleology-800 px-3 py-1 rounded-full text-sm font-medium',
};

// Outline chips
const outlineChips = {
  ontology: 'border border-facet-ontology-300 text-facet-ontology-700 px-3 py-1 rounded-full text-sm font-medium',
  epistemology: 'border border-facet-epistemology-300 text-facet-epistemology-700 px-3 py-1 rounded-full text-sm font-medium',
  praxeology: 'border border-facet-praxeology-300 text-facet-praxeology-700 px-3 py-1 rounded-full text-sm font-medium',
  axiology: 'border border-facet-axiology-300 text-facet-axiology-700 px-3 py-1 rounded-full text-sm font-medium',
  mythology: 'border border-facet-mythology-300 text-facet-mythology-700 px-3 py-1 rounded-full text-sm font-medium',
  cosmology: 'border border-facet-cosmology-300 text-facet-cosmology-700 px-3 py-1 rounded-full text-sm font-medium',
  teleology: 'border border-facet-teleology-300 text-facet-teleology-700 px-3 py-1 rounded-full text-sm font-medium',
};

// ==========================================
// 6. FACET ICONS & INDICATORS
// ==========================================

// Icon containers with colored backgrounds
const iconContainers = {
  ontology: 'bg-facet-ontology-100 text-facet-ontology-600 p-2 rounded-lg',
  epistemology: 'bg-facet-epistemology-100 text-facet-epistemology-600 p-2 rounded-lg',
  praxeology: 'bg-facet-praxeology-100 text-facet-praxeology-600 p-2 rounded-lg',
  axiology: 'bg-facet-axiology-100 text-facet-axiology-600 p-2 rounded-lg',
  mythology: 'bg-facet-mythology-100 text-facet-mythology-600 p-2 rounded-lg',
  cosmology: 'bg-facet-cosmology-100 text-facet-cosmology-600 p-2 rounded-lg',
  teleology: 'bg-facet-teleology-100 text-facet-teleology-600 p-2 rounded-lg',
};

// Status indicators (dots)
const statusDots = {
  ontology: 'w-3 h-3 bg-facet-ontology rounded-full',
  epistemology: 'w-3 h-3 bg-facet-epistemology rounded-full',
  praxeology: 'w-3 h-3 bg-facet-praxeology rounded-full',
  axiology: 'w-3 h-3 bg-facet-axiology rounded-full',
  mythology: 'w-3 h-3 bg-facet-mythology rounded-full',
  cosmology: 'w-3 h-3 bg-facet-cosmology rounded-full',
  teleology: 'w-3 h-3 bg-facet-teleology rounded-full',
};

// ==========================================
// 7. ACCENT BORDERS & DIVIDERS
// ==========================================

// Left accent borders
const accentBorders = {
  ontology: 'border-l-4 border-facet-ontology pl-4',
  epistemology: 'border-l-4 border-facet-epistemology pl-4',
  praxeology: 'border-l-4 border-facet-praxeology pl-4',
  axiology: 'border-l-4 border-facet-axiology pl-4',
  mythology: 'border-l-4 border-facet-mythology pl-4',
  cosmology: 'border-l-4 border-facet-cosmology pl-4',
  teleology: 'border-l-4 border-facet-teleology pl-4',
};

// Gradient dividers
const gradientDividers = {
  spectrum: 'h-px bg-gradient-facet-spectrum',
  horizontal: 'h-0.5 bg-gradient-to-r from-transparent via-facet-ontology to-transparent',
};

// ==========================================
// 8. ACCESSIBILITY & CONTRAST
// ==========================================

// High contrast combinations for accessibility
const accessibleCombinations = {
  ontology: {
    primary: 'bg-facet-ontology-600 text-white', // WCAG AA compliant
    secondary: 'bg-facet-ontology-50 text-facet-ontology-900',
    text: 'text-facet-ontology-700', // Good contrast on white background
  },
  epistemology: {
    primary: 'bg-facet-epistemology-600 text-white',
    secondary: 'bg-facet-epistemology-50 text-facet-epistemology-900',
    text: 'text-facet-epistemology-700',
  },
  praxeology: {
    primary: 'bg-facet-praxeology-600 text-white',
    secondary: 'bg-facet-praxeology-50 text-facet-praxeology-900',
    text: 'text-facet-praxeology-700',
  },
  axiology: {
    primary: 'bg-facet-axiology-600 text-white',
    secondary: 'bg-facet-axiology-50 text-facet-axiology-900',
    text: 'text-facet-axiology-700',
  },
  mythology: {
    primary: 'bg-facet-mythology-600 text-white',
    secondary: 'bg-facet-mythology-50 text-facet-mythology-900',
    text: 'text-facet-mythology-700',
  },
  cosmology: {
    primary: 'bg-facet-cosmology-600 text-white',
    secondary: 'bg-facet-cosmology-50 text-facet-cosmology-900',
    text: 'text-facet-cosmology-700',
  },
  teleology: {
    primary: 'bg-facet-teleology-600 text-white',
    secondary: 'bg-facet-teleology-50 text-facet-teleology-900',
    text: 'text-facet-teleology-700',
  },
};

// ==========================================
// 9. SAMPLE COMPONENT USAGE
// ==========================================

// Example React component using facet colors
const FacetCard = `
<div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
  {/* Header with facet color */}
  <div className="bg-gradient-to-r from-facet-ontology-500 to-facet-ontology-600 px-6 py-4">
    <h3 className="text-white font-semibold text-lg">Ontology</h3>
    <p className="text-facet-ontology-100 text-sm">What is real?</p>
  </div>
  
  {/* Content with subtle accent */}
  <div className="p-6 border-l-4 border-facet-ontology-200">
    <p className="text-gray-700 mb-4">Content exploring the nature of reality...</p>
    
    {/* Progress bar */}
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div className="bg-gradient-to-r from-facet-ontology-400 to-facet-ontology-600 h-2 rounded-full" style={{width: '75%'}}></div>
    </div>
    
    {/* Tags */}
    <div className="flex gap-2 mb-4">
      <span className="bg-facet-ontology-100 text-facet-ontology-800 px-3 py-1 rounded-full text-sm">Being</span>
      <span className="bg-facet-ontology-100 text-facet-ontology-800 px-3 py-1 rounded-full text-sm">Existence</span>
    </div>
    
    {/* Action button */}
    <button className="bg-facet-ontology hover:bg-facet-ontology-700 text-white px-4 py-2 rounded-lg transition-colors">
      Explore Further
    </button>
  </div>
</div>
`;

// Export all utilities for easy import
module.exports = {
  facetHeadings,
  secondaryHeadings,
  spectrumBar,
  progressBars,
  adjacentBars,
  heroGradients,
  cardGradients,
  primaryButtons,
  secondaryButtons,
  ghostButtons,
  solidChips,
  softChips,
  outlineChips,
  iconContainers,
  statusDots,
  accentBorders,
  gradientDividers,
  accessibleCombinations,
  FacetCard
};
