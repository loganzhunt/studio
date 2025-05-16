import type { Facet, FacetName } from '@/types';
import { Atom, Brain, Zap, Heart, BookOpen, Globe, Target, HelpCircle } from 'lucide-react';
import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

// Helper to ensure all props are passed to LucideIcon if it's used directly.
// This is mostly for type consistency if we mix LucideIcon and custom SVGs.
const IconWrapper = (IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>)
  : React.FC<React.SVGProps<SVGSVGElement>> =>
{
  const WrappedComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    // Changed to React.createElement to avoid JSX parsing issues in .ts file
    return React.createElement(IconComponent, props);
  };

  // Set a display name for better debugging in React DevTools
  const componentName = (IconComponent as any).displayName || (IconComponent as any).name || 'Component';
  WrappedComponent.displayName = `IconWrapper(${componentName})`;

  return WrappedComponent;
};


export const FACET_NAMES: FacetName[] = [
  "Ontology", 
  "Epistemology", 
  "Praxeology", 
  "Axiology", 
  "Mythology", 
  "Cosmology", 
  "Teleology"
];

export const FACETS: Record<FacetName, Facet> = {
  Ontology: {
    name: "Ontology",
    icon: IconWrapper(Atom),
    colorVariable: "--domain-ontology",
    tagline: "What is real?",
    description: "Explores the nature of being, reality, and existence. It questions what constitutes fundamental reality and the classification of entities.",
    questions: Array(10).fill("Sample Ontology Question: To what extent do you agree..."),
  },
  Epistemology: {
    name: "Epistemology",
    icon: IconWrapper(Brain),
    colorVariable: "--domain-epistemology",
    tagline: "How do we know?",
    description: "Concerns the theory of knowledge. It investigates the origin, nature, methods, and limits of human knowledge and belief.",
    questions: Array(10).fill("Sample Epistemology Question: To what extent do you agree..."),
  },
  Praxeology: {
    name: "Praxeology",
    icon: IconWrapper(Zap),
    colorVariable: "--domain-praxeology",
    tagline: "How should we act?",
    description: "Focuses on human action and conduct. It studies the process of purposeful behavior and the logic of choice in human endeavors.",
    questions: Array(10).fill("Sample Praxeology Question: To what extent do you agree..."),
  },
  Axiology: {
    name: "Axiology",
    icon: IconWrapper(Heart),
    colorVariable: "--domain-axiology",
    tagline: "What is valuable?",
    description: "Deals with the nature of value and valuation. It encompasses ethics (moral value) and aesthetics (artistic value).",
    questions: Array(10).fill("Sample Axiology Question: To what extent do you agree..."),
  },
  Mythology: {
    name: "Mythology",
    icon: IconWrapper(BookOpen),
    colorVariable: "--domain-mythology",
    tagline: "What are our stories?",
    description: "Examines the narratives, symbols, and belief systems that shape cultural understanding and provide meaning and coherence.",
    questions: Array(10).fill("Sample Mythology Question: To what extent do you agree..."),
  },
  Cosmology: {
    name: "Cosmology",
    icon: IconWrapper(Globe),
    colorVariable: "--domain-cosmology",
    tagline: "What is the universe?",
    description: "Studies the origin, evolution, and ultimate fate of the universe. It seeks to understand the cosmos at the largest scales.",
    questions: Array(10).fill("Sample Cosmology Question: To what extent do you agree..."),
  },
  Teleology: {
    name: "Teleology",
    icon: IconWrapper(Target),
    colorVariable: "--domain-teleology",
    tagline: "What is our purpose?",
    description: "Investigates purpose, design, and final causes in nature and human actions. It explores the concept of goals and ends.",
    questions: Array(10).fill("Sample Teleology Question: To what extent do you agree..."),
  },
};

export const getFacetByName = (name: FacetName): Facet => FACETS[name];

// Ensuring DEFAULT_FACET_ICON also uses the IconWrapper and is typed correctly.
// LucideIcon type might be more specific than React.FC, so we use React.FC for the type here.
export const DEFAULT_FACET_ICON: React.FC<React.SVGProps<SVGSVGElement>> = IconWrapper(HelpCircle as LucideIcon);
