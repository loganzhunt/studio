# Meta-Prism Design System

A comprehensive, mobile-first design system built with Tailwind CSS and the Geist font family, featuring glassmorphic aesthetics and spectrum-inspired theming.

## 🎨 Design Philosophy

- **Mobile-First**: Optimized for mobile devices with progressive enhancement
- **Glassmorphic**: Translucent elements with backdrop blur effects
- **Prismatic**: Color system based on the 7 facets of worldview (ROYGBIV spectrum)
- **Accessible**: WCAG AA compliant with proper contrast and focus states
- **Semantic**: Component classes that express intent and meaning

## 📱 Typography System (Geist Font)

### Font Stack
```css
font-family: var(--font-geist-sans), 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Heading Hierarchy
| Element | Classes | Weight | Mobile | Desktop | Use Case |
|---------|---------|--------|--------|---------|----------|
| H1 | `text-4xl md:text-5xl lg:text-6xl font-extrabold` | 800 | 36px | 72px | Hero titles |
| H2 | `text-3xl md:text-4xl lg:text-5xl font-bold` | 700 | 30px | 60px | Section headers |
| H3 | `text-2xl md:text-3xl lg:text-4xl font-semibold` | 600 | 24px | 48px | Subsection headers |
| H4 | `text-xl md:text-2xl lg:text-3xl font-semibold` | 600 | 20px | 36px | Card titles |
| H5 | `text-lg md:text-xl lg:text-2xl font-medium` | 500 | 18px | 24px | Minor headings |
| H6 | `text-base md:text-lg lg:text-xl font-medium` | 500 | 16px | 20px | Labels |

### Body Text
```css
/* Optimized paragraph text */
.prose p {
  @apply text-base md:text-lg leading-relaxed text-muted-foreground;
  max-width: 75ch; /* Optimal reading length */
}
```

### Letter Spacing
- Extra Large Headings: `-0.04em` to `-0.06em`
- Large Headings: `-0.025em` to `-0.035em`  
- Body Text: `0` (normal)
- Small Text: `0.025em`

## 🏗️ Layout System

### Container Widths (Mobile-First)
```typescript
container: {
  center: true,
  padding: {
    DEFAULT: '1rem',    // Mobile: 16px
    sm: '1.5rem',       // 640px+: 24px
    lg: '2rem',         // 1024px+: 32px
    xl: '2.5rem',       // 1280px+: 40px
    '2xl': '3rem',      // 1400px+: 48px
  },
  screens: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
}
```

### Component Classes

#### Main Layout
```html
<!-- App Container -->
<div class="app-container">
  <!-- Section with responsive padding -->
  <section class="section-container">
    <!-- Content wrapper -->
    <div class="content-wrapper">
      <!-- Your content -->
    </div>
  </section>
</div>
```

#### Header
```html
<header class="app-header">
  <div class="header-content">
    <nav><!-- Navigation --></nav>
  </div>
</header>
```

#### Card Grids
```html
<!-- Responsive card layouts -->
<div class="card-grid">          <!-- 1 column -->
<div class="card-grid-2">        <!-- 1→2 columns -->
<div class="card-grid-3">        <!-- 1→2→3 columns -->
<div class="card-grid-4">        <!-- 1→2→4 columns -->
```

## 🪟 Glassmorphic Components

### Glass Cards
```html
<!-- Basic glass card -->
<div class="glass-card p-6">
  <!-- Content -->
</div>

<!-- Large glass card -->
<div class="glass-card-lg p-8">
  <!-- Content -->
</div>

<!-- Feature card with hover effects -->
<div class="feature-card">
  <div class="feature-card-icon">
    <!-- Icon -->
  </div>
  <!-- Content -->
</div>
```

### Glass Buttons
```html
<button class="glass-button focus-ring">
  Click me
</button>
```

### CSS Properties
```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

## 🌈 Facet Color System

### Symbolic Colors (ROYGBIV)
```typescript
facet: {
  ontology: '#8b5cf6',      // Violet - What is real?
  epistemology: '#6366f1',  // Indigo - What can be known?
  praxeology: '#3b82f6',    // Blue - How should we act?
  axiology: '#10b981',      // Green - What has value?
  mythology: '#eab308',     // Yellow - What is the story?
  cosmology: '#f97316',     // Orange - What is the universe?
  teleology: '#ef4444',     // Red - What is the purpose?
}
```

### Gradient Utilities
```html
<!-- Full spectrum gradient -->
<div class="bg-gradient-facet-spectrum">

<!-- Adjacent facet transitions -->
<div class="bg-gradient-ontology-epistemology">
<div class="bg-gradient-epistemology-praxeology">
<!-- etc... -->

<!-- Text gradients -->
<h1 class="text-gradient-spectrum">Spectrum Title</h1>
<h2 class="text-gradient-primary">Primary Title</h2>
```

### Facet-Themed Components
```html
<!-- Facet accent container -->
<div class="facet-accent" style="--facet-gradient: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))">
  <!-- Content gets subtle facet-colored overlay on hover -->
</div>

<!-- Dynamic facet classes (programmatically generated) -->
<div class="bg-facet-ontology-50 text-facet-ontology-700 border-facet-ontology-300">
```

## ✨ Animations & Interactions

### Animation Classes
```html
<!-- Floating animation -->
<div class="animate-float">

<!-- Fade in from bottom -->
<div class="animate-fade-in-up">

<!-- Spectrum color shifting -->
<div class="animate-spectrum-shift">

<!-- Interactive hover effects -->
<div class="interactive">           <!-- Scale + cursor -->
<div class="interactive-card">      <!-- Scale + glow -->
```

### Keyframes Available
- `spectrum-shift`: 8s infinite color cycling
- `glass-shimmer`: 2s shimmer effect
- `facet-glow`: 3s pulsing glow
- `fade-in-up`: 0.6s entrance animation
- `float`: 3s floating motion

## 📊 Shadow System

### Glass Shadows
```css
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
```

### Utility Classes
```html
<div class="shadow-glass">      <!-- Standard glass shadow -->
<div class="shadow-glass-lg">   <!-- Large glass shadow -->
<div class="shadow-glow">       <!-- Primary color glow -->
<div class="shadow-facet-glow"> <!-- Dynamic facet glow -->
```

## 🎯 Accessibility Features

### Focus States
```html
<button class="focus-ring">
  <!-- Gets proper focus outline -->
</button>
```

### Screen Reader Support
```html
<span class="sr-only">Hidden text for screen readers</span>
```

### Mobile Optimization
- Minimum 44px tap targets
- Optimized font sizes (16px base)
- Safe area adjustments for notched devices
- Proper contrast ratios (WCAG AA)

## 📋 Usage Examples

### Hero Section
```html
<section class="section-container text-center">
  <div class="content-wrapper">
    <h1 class="hero-title mb-6">
      Meta-Prism
    </h1>
    <p class="hero-subtitle mb-8">
      Explore your worldview through the prismatic lens of consciousness
    </p>
    <button class="glass-button text-lg px-8 py-4">
      Begin Assessment
    </button>
  </div>
</section>
```

### Feature Grid
```html
<section class="section-container">
  <div class="content-wrapper">
    <h2 class="section-title">
      The Seven Facets
    </h2>
    <p class="section-subtitle">
      Explore each dimension of worldview construction
    </p>
    
    <div class="card-grid-3">
      <div class="feature-card">
        <div class="feature-card-icon bg-facet-ontology-100 text-facet-ontology-600">
          <!-- Icon -->
        </div>
        <h3 class="text-xl font-semibold mb-3">Ontology</h3>
        <p class="text-muted-foreground">What is real?</p>
      </div>
      <!-- More cards... -->
    </div>
  </div>
</section>
```

### Navigation Bar
```html
<header class="app-header">
  <div class="header-content">
    <div class="flex items-center space-x-4">
      <div class="text-xl font-bold text-gradient-primary">
        Meta-Prism
      </div>
    </div>
    
    <nav class="hidden md:flex space-x-1">
      <a href="#" class="nav-link">About</a>
      <a href="#" class="nav-link-active">Assessment</a>
      <a href="#" class="nav-link">Results</a>
    </nav>
    
    <button class="glass-button md:hidden">
      Menu
    </button>
  </div>
</header>
```

### Responsive Card
```html
<div class="glass-card p-6 md:p-8 interactive-card">
  <div class="mobile-spacing">
    <h3 class="text-2xl font-semibold mobile-center">
      Card Title
    </h3>
    <p class="text-muted-foreground">
      Card description that's optimized for mobile reading.
    </p>
    <div class="mobile-stack space-y-4 md:space-y-0 md:space-x-4">
      <button class="glass-button mobile-full">
        Primary Action
      </button>
      <button class="glass-button mobile-full bg-transparent">
        Secondary
      </button>
    </div>
  </div>
</div>
```

## 🔧 Customization

### Adding Facet Themes
```typescript
// In your component
const facetTheme = {
  ontology: {
    bg: 'bg-facet-ontology-50',
    text: 'text-facet-ontology-700',
    border: 'border-facet-ontology-300',
    gradient: 'bg-gradient-ontology-epistemology'
  }
  // ... other facets
}
```

### Custom CSS Properties
```css
.my-component {
  --facet-glow-color: rgba(139, 92, 246, 0.4);
  --glass-bg: rgba(255, 255, 255, 0.08);
}
```

## 📱 Mobile-First Responsive Strategy

1. **Base Styles**: Designed for 320px+ mobile screens
2. **Breakpoint Enhancement**: Progressive enhancement at each breakpoint
3. **Touch Targets**: Minimum 44px for all interactive elements
4. **Content Hierarchy**: Clear visual hierarchy for small screens
5. **Performance**: Optimized for mobile networks and devices

## 🎨 Brand Consistency

The design system ensures brand consistency through:
- Consistent use of Geist font family
- Glassmorphic aesthetic throughout
- Facet color system for thematic coherence
- Standardized spacing and typography scales
- Unified animation and interaction patterns

---

This design system provides a comprehensive foundation for building beautiful, accessible, and mobile-optimized interfaces that reflect the Meta-Prism brand values of clarity, depth, and prismatic exploration.
