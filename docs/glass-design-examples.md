# Alive Glass Meta-Prism Design Language - Class Examples

## Quick Usage Guide

Copy and paste these className strings directly into your components for instant "alive glass" effects.

### Glass Cards

```typescript
// Basic Glass Card
"backdrop-blur-glass bg-white/10 border border-white/20 rounded-glass shadow-glass p-6 transition-all duration-300 ease-in-out hover:bg-white/15 hover:border-white/30 hover:shadow-beautiful hover:-translate-y-1"

// Large Glass Card
"backdrop-blur-crystal bg-white/10 border border-white/20 rounded-glass-lg shadow-glass-lg p-8 transition-all duration-300 ease-in-out hover:bg-white/15 hover:border-white/30 hover:shadow-prism hover:-translate-y-2"

// Interactive Glass Card with Spectrum Border
"backdrop-blur-glass bg-white/10 border-2 border-transparent bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-glass shadow-glass p-6 transition-all duration-300 ease-in-out hover:bg-white/15 hover:shadow-spectrum cursor-pointer"

// Floating Glass Card
"backdrop-blur-glass bg-white/10 border border-white/20 rounded-glass shadow-glass p-6 animate-float-gentle"
```

### Prismatic Buttons

```typescript
// Primary Prism Button
"px-6 py-3 rounded-prism font-medium backdrop-blur-glass bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-beautiful transition-all duration-300 ease-in-out hover:shadow-prism hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden"

// Secondary Prism Button
"px-6 py-3 rounded-prism font-medium backdrop-blur-glass bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-beautiful transition-all duration-300 ease-in-out hover:shadow-spectrum hover:scale-105"

// Ghost Glass Button
"px-6 py-3 rounded-prism font-medium backdrop-blur-glass bg-white/5 border border-white/20 text-foreground transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white/30"

// Icon Button with Spectrum Glow
"w-12 h-12 rounded-orb backdrop-blur-glass bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-white/15 hover:shadow-glow-purple"
```

### Animated Selectors

```typescript
// Spectrum Selector (Inactive)
"backdrop-blur-glass bg-white/10 border border-white/20 rounded-orb w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out relative"

// Spectrum Selector (Active)
"backdrop-blur-glass bg-white/10 border-2 border-transparent rounded-orb w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out relative shadow-spectrum animate-glow-pulse bg-gradient-to-r from-purple-500/20 to-blue-500/20"

// Tab Selector
"px-4 py-2 rounded-glass backdrop-blur-glass bg-white/5 border border-white/20 text-muted-foreground transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-foreground data-[state=active]:bg-white/15 data-[state=active]:text-foreground data-[state=active]:shadow-spectrum"
```

### Glass Input Fields

```typescript
// Standard Glass Input
"backdrop-blur-glass bg-white/5 border border-white/20 rounded-glass px-4 py-3 text-foreground placeholder-muted-foreground transition-all duration-300 ease-in-out focus:outline-none focus:bg-white/10 focus:border-purple-500/50 focus:shadow-spectrum"

// Search Input with Icon
"backdrop-blur-glass bg-white/5 border border-white/20 rounded-glass pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground transition-all duration-300 ease-in-out focus:outline-none focus:bg-white/10 focus:border-purple-500/50"

// Textarea Glass
"backdrop-blur-glass bg-white/5 border border-white/20 rounded-glass px-4 py-3 text-foreground placeholder-muted-foreground transition-all duration-300 ease-in-out focus:outline-none focus:bg-white/10 focus:border-purple-500/50 resize-none"
```

### Modal and Overlay

```typescript
// Modal Backdrop
"fixed inset-0 z-modal backdrop-blur-prism bg-black/20 flex items-center justify-center p-4"

// Modal Content
"backdrop-blur-crystal bg-card/80 border border-white/20 rounded-glass-lg shadow-glass-lg max-w-lg w-full p-6 animate-fade-in-up"

// Popover Content
"backdrop-blur-glass bg-card/90 border border-white/20 rounded-glass shadow-spectrum p-4 animate-fade-in-up"

// Tooltip
"backdrop-blur-glass bg-black/80 border border-white/20 rounded text-white px-2 py-1 text-sm"
```

### Iconography with Spectrum Effects

```typescript
// Spectrum Icon (Hover Effect)
"transition-all duration-300 ease-in-out hover:animate-pulse hover:text-purple-400"

// Rotating Spectrum Icon
"transition-all duration-300 ease-in-out hover:rotate-12 hover:scale-110 hover:text-purple-400"

// Floating Icon
"animate-float-gentle transition-colors duration-300 ease-in-out"

// Pulsing Indicator
"w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse-gentle"
```

### Layout Panels

```typescript
// Sidebar Panel
"backdrop-blur-glass bg-white/5 border-r border-white/20 h-full"

// Header with Glass
"sticky top-0 z-fixed backdrop-blur-glass bg-background/80 border-b border-white/20"

// Content Panel
"backdrop-blur-glass bg-white/5 border border-white/20 rounded-glass p-6 space-y-4"

// Hero Section with Shimmer
"relative backdrop-blur-glass bg-gradient-to-r from-purple-900/20 to-blue-900/20 overflow-hidden"
```

### Special Effects

```typescript
// Spectrum Border Animation
"border-2 border-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-border animate-border-flow rounded-glass"

// Shimmer Loading
"bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer"

// Pulse Glow
"shadow-glow-purple animate-glow-pulse"

// Floating Element
"animate-float-gentle"

// Spectrum Flow Background
"bg-gradient-facet-spectrum bg-[length:200%_200%] animate-spectrum-flow"
```

### Facet-Specific Styling

```typescript
// Ontology (Violet)
"border-facet-ontology/30 hover:border-facet-ontology/50 hover:shadow-glow-purple"

// Epistemology (Indigo)
"border-facet-epistemology/30 hover:border-facet-epistemology/50 hover:shadow-glow-blue"

// Praxeology (Blue)
"border-facet-praxeology/30 hover:border-facet-praxeology/50 hover:shadow-glow-cyan"

// Axiology (Green)
"border-facet-axiology/30 hover:border-facet-axiology/50 hover:shadow-glow-green"

// Mythology (Yellow)
"border-facet-mythology/30 hover:border-facet-mythology/50 hover:shadow-glow-yellow"

// Cosmology (Orange)
"border-facet-cosmology/30 hover:border-facet-cosmology/50 hover:shadow-glow-orange"

// Teleology (Red)
"border-facet-teleology/30 hover:border-facet-teleology/50 hover:shadow-glow-red"
```

## Animation Classes

```typescript
// Gentle animations for subtle movement
"animate-float-gentle"     // Gentle floating
"animate-pulse-gentle"     // Subtle pulsing
"animate-shimmer"          // Shimmer loading effect
"animate-spectrum-flow"    // Spectrum color flow
"animate-glow-pulse"       // Glowing pulse
"animate-border-flow"      // Animated spectrum border

// Transitions
"transition-prism"         // Standard 300ms transition
"transition-prism-slow"    // Slower 500ms transition

// Hover effects
"hover-lift"              // Lift on hover
"hover:-translate-y-1"    // Move up slightly
"hover:scale-105"         // Scale up slightly
```

## Complete Component Examples

### Glass Dashboard Card
```typescript
className="backdrop-blur-glass bg-white/10 border border-white/20 rounded-glass shadow-glass p-6 transition-all duration-300 ease-in-out hover:bg-white/15 hover:border-white/30 hover:shadow-beautiful hover:-translate-y-1 animate-float-gentle"
```

### Prismatic CTA Button
```typescript
className="px-8 py-4 text-lg rounded-prism font-medium backdrop-blur-glass bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-beautiful transition-all duration-300 ease-in-out hover:shadow-prism hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden"
```

### Interactive Navigation Item
```typescript
className="px-4 py-2 rounded-glass backdrop-blur-glass bg-white/5 border border-white/20 text-muted-foreground transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-foreground hover:border-white/30 hover:-translate-y-0.5 focus:outline-none focus:bg-white/15 focus:shadow-spectrum"
```

### Glass Form Container
```typescript
className="backdrop-blur-crystal bg-white/10 border border-white/20 rounded-glass-lg shadow-glass-lg p-8 space-y-6 animate-fade-in-up"
```
