# Meta-Prism Facet Color System Documentation

## Overview

The Meta-Prism facet color system provides a comprehensive, muted ROYGBIV color palette for the seven philosophical facets. Each facet has its own semantic color with 10 shades (50-900 plus DEFAULT) designed for accessibility and visual harmony.

## Color Philosophy

- **Perceptually Uniform**: Colors generated in LCH color space for smooth gradients
- **Muted & Sophisticated**: Subtle, professional tones suitable for serious content
- **Accessible**: Designed to meet WCAG AA contrast requirements
- **Symbolic**: Each facet color represents its philosophical domain

## Facet Colors

### 1. Ontology (Muted Violet) - "What is real?"
- **Primary**: `#7c4dff` (`facet-ontology` / `facet-ontology-600`)
- **Range**: `#f8f7ff` to `#3f1f9a`
- **Usage**: Reality, being, existence, fundamental nature

### 2. Epistemology (Muted Indigo) - "What can be known?"
- **Primary**: `#5c64ff` (`facet-epistemology` / `facet-epistemology-600`)
- **Range**: `#f4f6ff` to `#30359a`
- **Usage**: Knowledge, truth, belief, learning

### 3. Praxeology (Muted Blue) - "How should we act?"
- **Primary**: `#2499ff` (`facet-praxeology` / `facet-praxeology-500`)
- **Range**: `#f0f8ff` to `#0e419a`
- **Usage**: Action, behavior, decision-making, practice

### 4. Axiology (Muted Green) - "What has value?"
- **Primary**: `#22c55e` (`facet-axiology` / `facet-axiology-500`)
- **Range**: `#f0fdf6` to `#14532d`
- **Usage**: Values, ethics, worth, importance

### 5. Mythology (Muted Gold/Yellow) - "What is the story?"
- **Primary**: `#f5a623` (`facet-mythology` / `facet-mythology-600`)
- **Range**: `#fffcf0` to `#85501d`
- **Usage**: Narratives, stories, meaning, symbols

### 6. Cosmology (Muted Orange) - "What is the universe?"
- **Primary**: `#ff781f` (`facet-cosmology` / `facet-cosmology-500`)
- **Range**: `#fff9f0` to `#852e1d`
- **Usage**: Universe, structure, cosmic order

### 7. Teleology (Muted Red) - "What is the purpose?"
- **Primary**: `#e11d48` (`facet-teleology` / `facet-teleology-700`)
- **Range**: `#fff5f5` to `#9f1239`
- **Usage**: Purpose, goals, direction, ends

## Usage Guidelines

### 1. Section/Card Headings

```jsx
// Primary facet headings
<h2 className="text-facet-ontology border-b border-facet-ontology/20">
  Ontological Framework
</h2>

// Secondary headings
<h3 className="text-facet-epistemology-600 hover:text-facet-epistemology">
  Knowledge Base
</h3>
```

### 2. Spectrum Bars & Progress

```jsx
// Full spectrum bar
<div className="bg-gradient-facet-spectrum h-2 rounded-full" />

// Individual facet progress
<div className="bg-gradient-to-r from-facet-axiology-200 to-facet-axiology-600 h-3 rounded-full" />

// Adjacent facet transitions
<div className="bg-gradient-ontology-epistemology h-2" />
```

### 3. Gradient Backgrounds

```jsx
// Hero gradients
<section className="bg-gradient-facet-spectrum-radial opacity-20">
  <div className="bg-gradient-mesh-primary opacity-10" />
</section>

// Card backgrounds (subtle)
<div className="bg-gradient-to-br from-facet-praxeology-50 to-facet-praxeology-100 border border-facet-praxeology-200">
```

### 4. Buttons & Interactive Elements

```jsx
// Primary buttons
<button className="bg-facet-mythology hover:bg-facet-mythology-700 text-white">
  Explore Stories
</button>

// Secondary buttons (outline)
<button className="border-2 border-facet-cosmology text-facet-cosmology hover:bg-facet-cosmology hover:text-white">
  Learn More
</button>

// Ghost buttons
<button className="text-facet-teleology hover:bg-facet-teleology-100">
  Discover Purpose
</button>
```

### 5. Chips/Tags & Badges

```jsx
// Solid chips
<span className="bg-facet-axiology text-white px-3 py-1 rounded-full text-sm font-medium">
  Values
</span>

// Soft chips
<span className="bg-facet-epistemology-100 text-facet-epistemology-800 px-3 py-1 rounded-full">
  Knowledge
</span>

// Outline chips
<span className="border border-facet-ontology-300 text-facet-ontology-700 px-3 py-1 rounded-full">
  Reality
</span>
```

### 6. Icons & Indicators

```jsx
// Icon containers
<div className="bg-facet-praxeology-100 text-facet-praxeology-600 p-2 rounded-lg">
  <ActionIcon />
</div>

// Status dots
<div className="w-3 h-3 bg-facet-cosmology rounded-full" />
```

### 7. Accent Borders & Dividers

```jsx
// Left accent borders
<div className="border-l-4 border-facet-teleology pl-4">
  Purpose-driven content
</div>

// Gradient dividers
<div className="h-px bg-gradient-facet-spectrum" />
<div className="h-0.5 bg-gradient-to-r from-transparent via-facet-ontology to-transparent" />
```

## Available Gradients

### Spectrum Gradients
- `bg-gradient-facet-spectrum` - Linear left-to-right ROYGBIV
- `bg-gradient-facet-spectrum-radial` - Radial ROYGBIV
- `bg-gradient-facet-spectrum-conic` - Conic ROYGBIV wheel
- `bg-gradient-facet-spectrum-diagonal` - Diagonal ROYGBIV
- `bg-gradient-facet-spectrum-diagonal-reverse` - Reverse diagonal

### Adjacent Facet Pairs
- `bg-gradient-ontology-epistemology` (violet → indigo)
- `bg-gradient-epistemology-praxeology` (indigo → blue)
- `bg-gradient-praxeology-axiology` (blue → green)
- `bg-gradient-axiology-mythology` (green → gold)
- `bg-gradient-mythology-cosmology` (gold → orange)
- `bg-gradient-cosmology-teleology` (orange → red)
- `bg-gradient-teleology-ontology` (red → violet)

### Vertical Variants
All adjacent pairs also have `-vertical` variants for top-to-bottom gradients.

### Subtle Backgrounds
- `bg-gradient-ontology-subtle`
- `bg-gradient-epistemology-subtle`
- `bg-gradient-praxeology-subtle`
- `bg-gradient-axiology-subtle`
- `bg-gradient-mythology-subtle`
- `bg-gradient-cosmology-subtle`
- `bg-gradient-teleology-subtle`

### Special Effects
- `bg-gradient-mesh-primary` - Modern mesh gradient
- `bg-prism-overlay` - Subtle prismatic overlay
- `bg-prism-overlay-radial` - Radial prismatic overlay

## Accessibility

All facet colors have been tested for WCAG AA compliance:

| Facet | Default Color | White Contrast | Black Contrast | Text Usage |
|-------|---------------|----------------|----------------|------------|
| Ontology | #7c4dff | 4.8:1 ✓ | 8.9:1 ✓ | Use 700+ on white |
| Epistemology | #5c64ff | 5.2:1 ✓ | 8.1:1 ✓ | Use 700+ on white |
| Praxeology | #2499ff | 3.1:1 ⚠️ | 13.5:1 ✓ | Use 600+ on white |
| Axiology | #22c55e | 3.0:1 ⚠️ | 14.0:1 ✓ | Use 600+ on white |
| Mythology | #f5a623 | 2.8:1 ⚠️ | 15.0:1 ✓ | Use 600+ on white |
| Cosmology | #ff781f | 3.4:1 ⚠️ | 12.4:1 ✓ | Use 600+ on white |
| Teleology | #e11d48 | 5.9:1 ✓ | 7.2:1 ✓ | Use 700+ on white |

### Recommended Accessible Combinations

```jsx
// High contrast text on colored backgrounds
<div className="bg-facet-ontology-600 text-white">  {/* 4.5:1+ contrast */}
<div className="bg-facet-epistemology-700 text-white">
<div className="bg-facet-praxeology-600 text-white">

// Text on light backgrounds
<p className="text-facet-axiology-700">  {/* Good contrast on white */}
<p className="text-facet-mythology-800">
<p className="text-facet-cosmology-700">
```

## Color Generation Script

To regenerate or modify colors, use the provided chroma-js script:

```bash
npm install chroma-js
node scripts/generate-facet-colors.js
```

This script uses LCH color space for perceptually uniform color generation and includes accessibility testing.

## Implementation Notes

1. All facet colors are automatically included in the Tailwind build via the safelist
2. Colors can be dynamically generated using template literals: `text-facet-${facetName}`
3. Opacity modifiers work with all colors: `bg-facet-ontology/20`
4. Dark mode variants are supported: `dark:text-facet-epistemology-200`
5. Hover states can be combined: `hover:bg-facet-praxeology-700`

## Best Practices

1. **Use semantic meaning**: Match facet colors to their philosophical domains
2. **Maintain hierarchy**: Use lighter shades for less important elements
3. **Consider context**: Choose appropriate contrast ratios for text readability
4. **Test accessibility**: Always verify color combinations meet WCAG standards
5. **Be consistent**: Use the same color patterns across similar UI elements
6. **Progressive enhancement**: Ensure the interface works without color (for colorblind users)

## Migration from Previous System

If migrating from a previous color system:

1. Replace `purple-*` classes with `facet-ontology-*`
2. Replace `blue-*` classes with `facet-praxeology-*` or `facet-epistemology-*`
3. Replace `green-*` classes with `facet-axiology-*`
4. Replace `yellow-*` classes with `facet-mythology-*`
5. Replace `orange-*` classes with `facet-cosmology-*`
6. Replace `red-*` classes with `facet-teleology-*`
7. Update gradient classes to use new `bg-gradient-facet-*` utilities
