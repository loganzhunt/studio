
import * as React from 'react';
import type { Facet, FacetName, FacetDeepDive } from '@/types'; // Ensure FacetDeepDive is imported
import { Atom, Brain, Zap, Heart, BookOpen, Globe, Target, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Helper to ensure all props are passed to LucideIcon if it's used directly.
const IconWrapper = (IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>)
  : React.FC<React.SVGProps<SVGSVGElement>> =>
{
  const WrappedComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return React.createElement(IconComponent, props);
  };
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

// Default Deep Dive content
const getDefaultDeepDive = (facetName: string): FacetDeepDive => ({
  introduction: `This is the deep dive introduction for ${facetName}. It explores the fundamental questions and concepts related to how we perceive and understand this dimension of reality.`,
  spectrumExplanation: `The spectrum of ${facetName} ranges from one pole (e.g., purely materialistic views) to another (e.g., highly idealistic or spiritual views), with many nuanced positions in between. Understanding where one orients on this spectrum can reveal much about their underlying assumptions.`,
  spectrumAnchors: ["Materialistic/Literal", "Balanced/Pragmatic", "Idealistic/Symbolic"],
  exampleWorldviews: [
    { title: `Example ${facetName} Worldview 1 (Low)`, summary: `This worldview emphasizes a concrete, often empirical approach to ${facetName}.`, exampleScore: 0.2, type: 'codex', id: 'scientific_materialism' },
    { title: `Example ${facetName} Worldview 2 (Mid)`, summary: `This worldview balances different perspectives on ${facetName}, often integrating practical and theoretical aspects.`, exampleScore: 0.5, type: 'codex', id: 'stoicism' },
    { title: `Example ${facetName} Worldview 3 (High)`, summary: `This worldview explores the more abstract, often intuitive or transcendent aspects of ${facetName}.`, exampleScore: 0.8, type: 'archetype', id: 'the_mystic' }
  ],
  reflectionPrompts: [
    `How do your current beliefs about ${facetName} influence your daily decisions?`,
    `What experiences have most shaped your understanding of ${facetName}?`
  ],
  strengthsPlaceholder: `Potential strengths related to your ${facetName} score include a clear perspective on [aspect] and an ability to [action].`,
  tensionsPlaceholder: `Possible tensions might arise when your ${facetName} view interacts with perspectives that strongly emphasize [opposing_aspect].`,
  blindSpotsPlaceholder: `Consider if your ${facetName} orientation might lead to overlooking the value of [alternative_viewpoint] or its implications.`,
});


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
    deepDive: {
      introduction: "Ontology grapples with the fundamental question: What is real? It's the branch of metaphysics dealing with the nature of being, existence, and reality itself. This facet explores your assumptions about what constitutes the world and everything in it.",
      spectrumExplanation: "The ontological spectrum ranges from strict Materialism (only physical matter and energy are real) to various forms of Idealism (mind or spirit is primary) or Dualism (mind and matter are distinct). Panpsychism (consciousness is fundamental and ubiquitous) and Process Philosophy (reality is fundamentally dynamic becoming) offer other perspectives. Your score reflects your leaning along this spectrum.",
      spectrumAnchors: ["Strict Materialism", "Physicalism + Emergence", "Dualism", "Idealism/Panpsychism"],
      exampleWorldviews: [
        { title: "Scientific Materialism", summary: "Asserts that only physical matter and its interactions constitute reality. Consciousness is an emergent property of complex physical systems.", exampleScore: 0.1, type: 'codex', id: 'scientific_materialism' },
        { title: "Interactive Dualism (Classical)", summary: "Posits that mind (or soul) and matter are two distinct and irreducible substances that can causally interact.", exampleScore: 0.6, type: 'codex', id: 'platonism' }, // Placeholder ID
        { title: "Objective Idealism", summary: "Believes reality is fundamentally mental or spiritual, and the physical world is a manifestation or appearance of this underlying consciousness.", exampleScore: 0.9, type: 'codex', id: 'mysticism' } // Placeholder ID
      ],
      reflectionPrompts: [
        "If you believe reality is only physical, how do you account for subjective experience like thoughts and emotions?",
        "If mind or spirit is primary, what is the role or nature of the physical world?"
      ],
      strengthsPlaceholder: "Clarity on physical laws, or appreciation for subjective depth.",
      tensionsPlaceholder: "Explaining consciousness from matter, or matter from consciousness.",
      blindSpotsPlaceholder: "Overlooking non-material aspects, or underestimating physical constraints."
    }
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
    deepDive: {
      introduction: "Epistemology asks: How do we know what we know? It explores the nature of knowledge, justification, and the rationality of belief. This facet examines your primary ways of acquiring and validating knowledge.",
      spectrumExplanation: "The epistemological spectrum spans from strict Empiricism (knowledge comes only from sensory experience) and Rationalism (reason is the chief source) to views that embrace Intuition, Revelation, or Constructivism (knowledge is actively created). Your score indicates your reliance on these different sources.",
      spectrumAnchors: ["Strict Empiricism", "Rationalism/Logic", "Intuition/Experience", "Revelation/Gnosis"],
      exampleWorldviews: [
        { title: "Radical Empiricism", summary: "All knowledge is derived from sensory experience; ideas without empirical basis are suspect.", exampleScore: 0.1, type: 'codex', id: 'empiricism' },
        { title: "Critical Rationalism", summary: "Knowledge is advanced through bold conjectures and severe criticism, valuing logic and falsifiability.", exampleScore: 0.4, type: 'codex', id: 'rationalism' },
        { title: "Intuitive Gnosticism", summary: "True knowledge (gnosis) is attained through direct, intuitive, or mystical insight, often transcending reason or senses.", exampleScore: 0.9, type: 'codex', id: 'gnosticism' }
      ],
      reflectionPrompts: [
        "What sources of information do you trust most, and why?",
        "How do you handle situations where your beliefs are challenged by new evidence or perspectives?"
      ],
      strengthsPlaceholder: "Rigorous analysis, or openness to diverse ways of knowing.",
      tensionsPlaceholder: "Certainty vs. fallibility, objective vs. subjective truth.",
      blindSpotsPlaceholder: "Over-reliance on one method, or discounting data that contradicts intuition."
    }
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
    deepDive: {
      introduction: "Praxeology is about the 'how' of human action. It explores the logic of purposeful behavior, decision-making, and ethics. This facet looks at the principles and motivations that guide your conduct and choices.",
      spectrumExplanation: "Praxeological approaches range from Consequentialism (judging actions by their outcomes, e.g., Utilitarianism) to Deontology (actions are right or wrong based on rules or duties, e.g., Kantian ethics) to Virtue Ethics (focusing on moral character). Your score reflects your inclination towards these frameworks.",
      spectrumAnchors: ["Outcome-Focused (Consequentialist)", "Principle/Duty-Focused (Deontological)", "Character-Focused (Virtue Ethics)"],
      exampleWorldviews: [
        { title: "Utilitarianism", summary: "Actions are right if they promote happiness for the greatest number; consequences are paramount.", exampleScore: 0.2, type: 'codex', id: 'humanism' }, // ID needs to map to a consequentialist system
        { title: "Kantian Deontology", summary: "Moral actions are those done from duty, following universalizable maxims, irrespective of outcomes.", exampleScore: 0.5, type: 'codex', id: 'stoicism' }, // Stoicism has strong deontological elements
        { title: "Aristotelian Virtue Ethics", summary: "Right action flows from a virtuous character, cultivated through habit and aimed at human flourishing (eudaimonia).", exampleScore: 0.8, type: 'codex', id: 'aristotelianism' }
      ],
      reflectionPrompts: [
        "When making a difficult decision, what weighs more heavily: potential outcomes, your principles, or the kind of person you want to be?",
        "Are there universal moral rules, or is ethical action always context-dependent?"
      ],
      strengthsPlaceholder: "Effective goal-achievement, or unwavering integrity.",
      tensionsPlaceholder: "Ends vs. means, individual rights vs. greater good.",
      blindSpotsPlaceholder: "Unforeseen consequences, or rigidity in applying rules."
    }
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
    deepDive: {
      introduction: "Axiology explores what is valuable. It's the philosophical study of value, encompassing ethics (what is good/bad, right/wrong) and aesthetics (what is beautiful/ugly). This facet reflects your core values and what you deem most important.",
      spectrumExplanation: "Values can range from Hedonistic (pleasure is the ultimate good) to Humanistic (human flourishing and dignity) to Transpersonal or Sacred (spiritual realization, connection to divine). Your score indicates where your primary values lie along this range.",
      spectrumAnchors: ["Personal Pleasure/Material", "Social Good/Humanism", "Transcendental/Sacred"],
      exampleWorldviews: [
        { title: "Ethical Hedonism", summary: "The pursuit of pleasure and avoidance of pain are the highest aims of human life.", exampleScore: 0.1, type: 'codex', id: 'epicureanism' },
        { title: "Secular Humanism", summary: "Values human reason, ethics, social justice, and philosophical naturalism, rejecting religious dogma and pseudoscience.", exampleScore: 0.5, type: 'codex', id: 'humanism' },
        { title: "Mystical Axiology (e.g., Sufism)", summary: "The highest value is love for and union with the Divine, or ultimate reality, leading to selfless service and compassion.", exampleScore: 0.9, type: 'codex', id: 'mystical_sufism' }
      ],
      reflectionPrompts: [
        "What are the 3-5 things you value most in life, and how do these values show up in your actions?",
        "If you had to choose between personal happiness and upholding a core moral principle, which would you prioritize?"
      ],
      strengthsPlaceholder: "Strong sense of purpose, or deep empathy and compassion.",
      tensionsPlaceholder: "Personal desires vs. collective well-being, relative vs. absolute values.",
      blindSpotsPlaceholder: "Difficulty understanding others' values, or sacrificing personal well-being excessively."
    }
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
    deepDive: {
      introduction: "Mythology explores the foundational stories, symbols, and narratives that shape our understanding of ourselves and the world. These aren't just ancient tales; they include the cultural scripts and archetypal patterns that give meaning to our lives.",
      spectrumExplanation: "Perspectives on mythology range from Literalism (myths are historical fact) to Demystification (myths are primitive explanations superseded by science) to Symbolic/Archetypal (myths convey timeless psychological or spiritual truths). Your score reflects your engagement with the symbolic power of myth.",
      spectrumAnchors: ["Literal/Historical", "Rational/Demystified", "Symbolic/Archetypal"],
      exampleWorldviews: [
        { title: "Fundamentalist Literalism", summary: "Sacred texts and myths are interpreted as literal historical and scientific truth.", exampleScore: 0.1, type: 'codex', id: 'archetypal_traditionalist' }, // Example ID
        { title: "Secular Rationalism", summary: "Myths are seen as pre-scientific attempts to explain the world, now largely irrelevant or purely metaphorical.", exampleScore: 0.4, type: 'codex', id: 'scientific_materialism' },
        { title: "Jungian Psychology", summary: "Myths and symbols are expressions of the collective unconscious, revealing universal archetypes and patterns of human experience.", exampleScore: 0.9, type: 'archetype', id: 'the_alchemist' } // Example ID
      ],
      reflectionPrompts: [
        "What are the most powerful stories or symbols that have shaped your life or worldview?",
        "Do you see recurring archetypal patterns (like the hero, mentor, or trickster) in your own life or in society?"
      ],
      strengthsPlaceholder: "Deep connection to cultural roots, or capacity for symbolic insight.",
      tensionsPlaceholder: "Literal truth vs. metaphorical meaning, tradition vs. individual interpretation.",
      blindSpotsPlaceholder: "Dismissing symbolic value, or being overly attached to one narrative."
    }
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
    deepDive: {
      introduction: "Cosmology considers the nature, origin, and structure of the universe. It addresses questions about the vastness of space and time, our place within it, and the fundamental laws that govern it.",
      spectrumExplanation: "Cosmological views range from purely scientific models (e.g., Big Bang, Inflationary Universe) to philosophies of an ordered, intelligent cosmos (e.g., Logos, Tao) or those positing multiple dimensions or spiritual realities. Your score indicates your perspective on the universe's nature and origins.",
      spectrumAnchors: ["Scientific/Material", "Ordered/Intelligible", "Living/Spiritual"],
      exampleWorldviews: [
        { title: "Standard Model Cosmology", summary: "The universe originated in a Big Bang and is governed by physical laws, expanding and evolving over billions of years.", exampleScore: 0.2, type: 'codex', id: 'scientific_materialism' },
        { title: "Stoic Cosmology", summary: "The cosmos is a single, rational, living being (God or Logos), a divine fire that cyclically creates and reabsorbs the universe.", exampleScore: 0.6, type: 'codex', id: 'stoicism' },
        { title: "Animistic Cosmology", summary: "The universe is alive, a community of interconnected beings and spirits, where all parts have consciousness and influence each other.", exampleScore: 0.9, type: 'codex', id: 'animism' }
      ],
      reflectionPrompts: [
        "When you contemplate the universe, what feelings or questions arise for you (e.g., awe, insignificance, curiosity)?",
        "Do you believe the universe has an inherent order or intelligence, or is it primarily random and impersonal?"
      ],
      strengthsPlaceholder: "Awe at cosmic scale, or sense of interconnectedness.",
      tensionsPlaceholder: "Randomness vs. order, scientific models vs. spiritual meaning.",
      blindSpotsPlaceholder: "Anthropocentrism, or difficulty grasping vast scales/abstract concepts."
    }
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
    deepDive: {
      introduction: "Teleology is the study of purpose, ends, or final causes, both in human life and in the cosmos. It asks: Is there an ultimate meaning or goal to existence? If so, what is it, and how do we align with it?",
      spectrumExplanation: "Teleological views vary from Nihilism (no inherent purpose) to Existentialism (purpose is self-created) to views positing intrinsic or divinely ordained purposes (e.g., spiritual evolution, fulfilling a cosmic plan). Your score reflects your belief about the nature and source of purpose.",
      spectrumAnchors: ["No Inherent Purpose (Nihilism)", "Self-Created Purpose (Existentialism)", "Intrinsic/Divine Purpose"],
      exampleWorldviews: [
        { title: "Philosophical Nihilism", summary: "Denies the existence of any inherent meaning, purpose, or objective value in the universe or human life.", exampleScore: 0.1, type: 'codex', id: 'nihilism' },
        { title: "Existentialism", summary: "Emphasizes individual freedom and responsibility for creating one's own meaning and purpose in an apparently meaningless universe.", exampleScore: 0.4, type: 'codex', id: 'existentialism' },
        { title: "Theistic Teleology (e.g., Christianity)", summary: "Posits that human life and the cosmos have a purpose ordained by God, often involving spiritual fulfillment and communion with the divine.", exampleScore: 0.9, type: 'codex', id: 'christianity' }
      ],
      reflectionPrompts: [
        "What gives your life meaning and purpose? Is this something you feel you discovered or created?",
        "Do you believe there's an ultimate goal or direction for humanity or the universe as a whole?"
      ],
      strengthsPlaceholder: "Strong sense of direction, or freedom to define own path.",
      tensionsPlaceholder: "Predetermined destiny vs. free will, finding meaning in suffering.",
      blindSpotsPlaceholder: "Imposing purpose where none exists, or despair if inherent purpose is doubted."
    }
  },
};

export const getFacetByName = (name: FacetName): Facet => FACETS[name];

export const DEFAULT_FACET_ICON: React.FC<React.SVGProps<SVGSVGElement>> = IconWrapper(HelpCircle as LucideIcon);
