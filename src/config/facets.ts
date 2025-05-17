
import * as React from 'react';
import type { Facet, FacetName } from '@/types';
import { Atom, Brain, Zap, Heart, BookOpen, Globe, Target, HelpCircle } from 'lucide-react';
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
    questions: [
      "Reality consists entirely of physical matter and energy.",
      "Objective reality exists independently of perception.",
      "What is real can be observed and measured.",
      "Consciousness emerges from complex material systems.",
      "Reality includes inner experience and subjective awareness.",
      "Mind and matter are equally fundamental to existence.",
      "Intuition can reveal aspects of reality not accessible to reason.",
      "Some aspects of reality may be beyond human understanding.",
      "Reality is fundamentally interconnected at all levels.",
      "Symbols and archetypes reveal truths about the nature of reality."
    ],
  },
  Epistemology: {
    name: "Epistemology",
    icon: IconWrapper(Brain),
    colorVariable: "--domain-epistemology",
    tagline: "How do we know?",
    description: "Concerns the theory of knowledge. It investigates the origin, nature, methods, and limits of human knowledge and belief.",
    questions: [
      "Knowledge is gained primarily through sensory experience.",
      "Science is the most reliable way to acquire knowledge.",
      "Objective truth can be discovered through reason.",
      "Personal experience is a valid source of knowledge.",
      "Intuition plays a role in understanding complex truths.",
      "Different cultures can have equally valid ways of knowing.",
      "Knowledge is always filtered through interpretation.",
      "It is possible to be certain about some things.",
      "Mystical insight can lead to genuine understanding.",
      "All knowledge is provisional and open to revision."
    ],
  },
  Praxeology: {
    name: "Praxeology",
    icon: IconWrapper(Zap),
    colorVariable: "--domain-praxeology",
    tagline: "How should we act?",
    description: "Focuses on human action and conduct. It studies the process of purposeful behavior and the logic of choice in human endeavors.",
    questions: [
      "Human behavior is shaped by incentives and consequences.",
      "Right action is determined by its results.",
      "Intentions are more important than outcomes.",
      "Ethical decisions should be guided by universal principles.",
      "Each person must decide how to live for themselves.",
      "Rituals and traditions provide a foundation for action.",
      "There is a natural order that should guide behavior.",
      "Acting authentically is more important than following rules.",
      "Society benefits when people pursue their own self-interest.",
      "Moral action requires awareness of context and complexity."
    ],
  },
  Axiology: {
    name: "Axiology",
    icon: IconWrapper(Heart),
    colorVariable: "--domain-axiology",
    tagline: "What is valuable?",
    description: "Deals with the nature of value and valuation. It encompasses ethics (moral value) and aesthetics (artistic value).",
    questions: [
      "Happiness is the highest good.",
      "Truth is more important than comfort.",
      "Beauty reveals something essential about the world.",
      "Justice should be prioritized over personal gain.",
      "Freedom is more valuable than security.",
      "Love is the most important force in human life.",
      "Suffering has value when it leads to growth.",
      "What is valuable is determined by culture.",
      "Value comes from the sacredness of life itself.",
      "Goodness exists independently of human opinion."
    ],
  },
  Mythology: {
    name: "Mythology",
    icon: IconWrapper(BookOpen),
    colorVariable: "--domain-mythology",
    tagline: "What are our stories?",
    description: "Examines the narratives, symbols, and belief systems that shape cultural understanding and provide meaning and coherence.",
    questions: [
      "Myths carry psychological and symbolic truths.",
      "Stories shape how people understand their place in the world.",
      "The hero's journey reflects an inner developmental process.",
      "Religious texts contain metaphorical wisdom.",
      "Modern society lacks meaningful shared stories.",
      "Ancient myths can still be relevant today.",
      "Fictional narratives can reveal deep truths.",
      "Archetypes like the trickster or sage are universally meaningful.",
      "Rituals reenact symbolic stories that structure meaning.",
      "The myths we live by shape our personal identities."
    ],
  },
  Cosmology: {
    name: "Cosmology",
    icon: IconWrapper(Globe),
    colorVariable: "--domain-cosmology",
    tagline: "What is the universe?",
    description: "Studies the origin, evolution, and ultimate fate of the universe. It seeks to understand the cosmos at the largest scales.",
    questions: [
      "The universe began with a singular moment of creation.",
      "All things are governed by natural laws.",
      "The cosmos has an underlying intelligence or order.",
      "Human beings are a small part of a vast system.",
      "The universe is fundamentally random and chaotic.",
      "The stars and planets influence life on Earth.",
      "Consciousness may be a fundamental feature of the cosmos.",
      "Everything in the universe is interconnected.",
      "Spiritual realms exist beyond physical reality.",
      "Science and spirituality can both inform cosmology."
    ],
  },
  Teleology: {
    name: "Teleology",
    icon: IconWrapper(Target),
    colorVariable: "--domain-teleology",
    tagline: "What is our purpose?",
    description: "Investigates purpose, design, and final causes in nature and human actions. It explores the concept of goals and ends.",
    questions: [
      "Life has a built-in purpose or direction.",
      "Each person has a unique role to fulfill.",
      "Meaning is something we create, not discover.",
      "Spiritual development is the purpose of human life.",
      "History is moving toward a specific goal or destiny.",
      "Suffering can be meaningful in a larger context.",
      "The universe unfolds according to a divine plan.",
      "Purpose is found in service to others.",
      "There is no ultimate meaning to existence.",
      "Love and awareness are the highest purposes of life."
    ],
  },
};

export const getFacetByName = (name: FacetName): Facet => FACETS[name];

// Ensuring DEFAULT_FACET_ICON also uses the IconWrapper and is typed correctly.
// LucideIcon type might be more specific than React.FC, so we use React.FC for the type here.
export const DEFAULT_FACET_ICON: React.FC<React.SVGProps<SVGSVGElement>> = IconWrapper(HelpCircle as LucideIcon);

