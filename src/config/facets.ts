import type { Facet, FacetName, FacetDeepDive } from "@/types";
import {
  Atom,
  Brain,
  Zap,
  Heart,
  BookOpen,
  Globe,
  Target,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icons } from "@/components/icons"; // Added this import
import React from "react"; // Added for JSX types used by LucideIcon

const IconWrapper = (
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>
): React.FC<React.SVGProps<SVGSVGElement>> => {
  const WrappedComponent: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return React.createElement(IconComponent, props);
  };
  const componentName =
    (IconComponent as any).displayName ||
    (IconComponent as any).name ||
    "Component";
  WrappedComponent.displayName = `IconWrapper(${componentName})`;
  return WrappedComponent;
};

// Ensure FACET_NAMES is always available with a frozen constant
const FACET_NAMES_CONST = [
  "Ontology",
  "Epistemology",
  "Praxeology",
  "Axiology",
  "Mythology",
  "Cosmology",
  "Teleology",
] as const;

export const FACET_NAMES: FacetName[] = [...FACET_NAMES_CONST];

/**
 * Helper to safely use FACET_NAMES without repetitive type checks
 * @returns True if FACET_NAMES is a valid, non-empty array
 */
export const isValidFacetNames = (): boolean => {
  return Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0;
};

/**
 * Execute a callback only if FACET_NAMES is valid
 * @param callback Function to execute with FACET_NAMES
 * @param fallback Optional fallback value if FACET_NAMES is invalid
 * @returns Result of callback or fallback
 */
export function withValidFacetNames<T>(
  callback: (facetNames: FacetName[]) => T,
  fallback?: T
): T {
  return isValidFacetNames() ? callback(FACET_NAMES) : (fallback as T);
}

export const FACETS: Record<FacetName, Facet> = {
  Ontology: {
    name: "Ontology",
    icon: IconWrapper(Atom),
    colorVariable: "--domain-ontology",
    tagline: "What is real?",
    description:
      "Explores the nature of being, reality, and existence. It questions what constitutes fundamental reality and the classification of entities.",
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
      "Symbols and archetypes reveal truths about the nature of reality.",
    ],
    deepDive: {
      introduction:
        "Ontology addresses the fundamental question: What is real? It is the facet that shapes your metaphysical assumptions—whether the universe is made of matter, mind, energy, spirit, illusion, or code. Every belief, every experience, passes through an ontological filter, whether it’s inherited, chosen, or unconscious.",
      spectrumExplanation:
        "Ontology spans a symbolic continuum from Materialism (where only physical matter is real) to Idealism or Non-Dualism (where reality is rooted in consciousness or sacred unity). Most worldviews fall somewhere between, integrating various ontological frames.",
      spectrumAnchors: [
        "Materialism",
        "Relational / Dualist",
        "Idealism / Non-Dualist",
      ],
      exampleWorldviews: [
        {
          icon: "🧪",
          title: "Scientific Humanism",
          exampleScore: 0.15,
          summary:
            "Reality is composed of physical matter and measurable energy. Mind arises from the brain.",
          type: "codex",
          id: "scientific_humanism",
        },
        {
          icon: "☸️",
          title: "Classical Buddhism (Madhyamaka)",
          exampleScore: 0.55,
          summary:
            "Reality is empty of inherent existence, co-arising in relation. Neither substance nor void.",
          type: "codex",
          id: "buddhism",
        },
        {
          icon: "🕉️",
          title: "Vedantic Hinduism",
          exampleScore: 0.9,
          summary:
            "All appearances arise from Brahman—pure consciousness. The world is illusion-like (maya).",
          type: "codex",
          id: "hinduism",
        },
        {
          icon: "🌿",
          title: "Indigenous Animism",
          exampleScore: 0.85,
          summary:
            "All things—trees, rivers, rocks—have spirit and presence. Reality is alive and relational.",
          type: "codex",
          id: "animism",
        },
      ],
      archetypalPatterns: [
        {
          name: "The Rational Skeptic",
          title: "The Rational Skeptic",
          scoreRange: "Aligns with Materialism (approx 0.20)",
          description:
            "Prioritizes scientific realism. Truth is derived from measurable evidence and logic.",
          icon: "atom",
        },
        {
          name: "The Integral Synthesizer",
          title: "The Integral Synthesizer",
          scoreRange: "Aligns with Relational / Dualist (approx 0.55)",
          description:
            "Holds multiple ontologies together—material and spiritual, inner and outer.",
          icon: "atom",
        },
        {
          name: "The Transcendent Mystic",
          title: "The Transcendent Mystic",
          scoreRange: "Aligns with Idealism / Non-Dualist (approx 0.95)",
          description:
            "Sees all phenomena as reflections of a single underlying consciousness or spirit.",
          icon: "atom",
        },
      ],
      reflectionPrompts: [
        "What do you believe is ultimately real?",
        "Do you prioritize the measurable or the mystical in understanding reality?",
        "How does your answer about what's real shape how you respond to life's events and experiences?",
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests a stronger alignment with Materialism. Reality is primarily understood through physical matter and observable phenomena. You likely prioritize empirical evidence and may be skeptical of claims that lack tangible proof.",
        mid: "A mid-range score in Ontology points to a more Relational or Dualist perspective. You might see reality as having multiple layers, perhaps acknowledging both physical and non-physical aspects, or you may adopt a pragmatic stance integrating various frameworks.",
        high: "A score in this range suggests a stronger alignment with Idealism or Non-Dualism. Reality is seen as fundamentally rooted in consciousness, spirit, or interconnected unity. The material world may be viewed as an expression of these deeper dimensions.",
      },
      strengthsPlaceholder:
        "Materialism can foster rigorous analysis, empirical grounding, and clear boundaries. A Relational/Dualist view excels at integrative thinking, appreciating complexity, and holding multiple perspectives. Idealism/Non-Dualism can nurture deep empathy, symbolic understanding, a sense of interconnectedness, and profound meaning.",
      tensionsPlaceholder:
        "Materialism might grapple with subjective meaning, consciousness, or non-empirical realities. Idealism could find it challenging to ground abstract concepts in practical application or to address physical limitations robustly. Relational views may need to clearly define how different orders of reality interact and resolve conflicts between them.",
      blindSpotsPlaceholder:
        "A strong Materialist focus might overlook the validity of subjective experience or symbolic meaning. A highly Idealist view might underemphasize physical well-being or discount empirical evidence where it conflicts with inner knowing. Relational views might struggle with decision-making when different realities present equally valid but contradictory claims.",
    },
  },
  Epistemology: {
    name: "Epistemology",
    icon: IconWrapper(Brain),
    colorVariable: "--domain-epistemology",
    tagline: "What can be known?",
    description:
      "Concerns the theory of knowledge. It investigates the origin, nature, methods, and limits of human knowledge and belief.",
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
      "All knowledge is provisional and open to revision.",
    ],
    deepDive: {
      introduction:
        "Epistemology asks: What can be known—and how? This facet governs your philosophy of knowledge, belief, and truth. It shapes what counts as evidence, whether you trust reason, intuition, tradition, revelation, or direct experience.",
      spectrumExplanation:
        "Epistemology ranges from strict empiricism (knowledge gained only through the senses) to intuitional or revelatory modes (where knowledge is direct, innate, or transmitted through sacred sources). Most worldviews blend empirical, rational, and mystical approaches to truth.",
      spectrumAnchors: [
        "Empirical",
        "Balanced / Integrative",
        "Revelatory / Intuitional",
      ],
      exampleWorldviews: [
        {
          icon: "🧪",
          title: "Scientific Rationalism",
          exampleScore: 0.2,
          summary:
            "Truth is established through observation, experiment, and logical reasoning.",
          type: "codex",
          id: "scientific_rationalism",
        },
        {
          icon: "🔮",
          title: "Hermetic Mysticism",
          exampleScore: 0.8,
          summary:
            "Knowledge is unveiled through direct intuition, symbol, or esoteric revelation.",
          type: "codex",
          id: "hermetic_mysticism",
        },
        {
          icon: "🕊️",
          title: "Religious Faith",
          exampleScore: 0.95,
          summary:
            "Ultimate truth is revealed by sacred scripture, prophets, or divine encounter.",
          type: "codex",
          id: "religious_faith",
        },
      ],
      archetypalPatterns: [
        {
          name: "The Empiricist",
          title: "The Empiricist",
          scoreRange: "Low (approx 0.10)",
          description:
            "Values observable facts and measurable proof; questions all else.",
          icon: "brain",
        },
        {
          name: "The Integrator",
          title: "The Integrator",
          scoreRange: "Mid (approx 0.55)",
          description:
            "Balances science, reason, and intuitive knowing; open to multiple sources.",
          icon: "brain",
        },
        {
          name: "The Visionary Seer",
          title: "The Visionary Seer",
          scoreRange: "High (approx 0.95)",
          description:
            "Trusts inner vision, spiritual insight, or direct revelation as highest knowing.",
          icon: "brain",
        },
      ],
      reflectionPrompts: [
        "How do you decide what is true?",
        "What sources of knowledge do you trust most?",
        "How do you respond when your beliefs are challenged?",
      ],
      whatIfInterpretations: {
        low: "An alignment with the Empirical pole suggests you primarily value knowledge derived from sensory experience, observation, and scientific methodology. Verifiable evidence is likely paramount in your truth-seeking.",
        mid: "A balanced/integrative epistemological stance suggests you value multiple ways of knowing. You might synthesize reason, experience, intuition, and trusted testimony to form understanding, remaining open to diverse perspectives on truth.",
        high: "An alignment with the Revelatory/Intuitional pole suggests you trust inner vision, direct insight, sacred texts, or spiritual experiences as primary paths to truth, sometimes valuing these above empirical evidence or pure logic.",
      },
      strengthsPlaceholder:
        "Empiricism fosters critical thinking and objectivity. An Integrative approach allows for holistic understanding and adaptability. A Revelatory/Intuitional stance can lead to profound personal insights and strong conviction.",
      tensionsPlaceholder:
        "Empirical approaches might struggle with purely subjective truths. Revelatory/Intuitional stances may conflict with empirical evidence. Integrative views must navigate how to weigh diverse sources.",
      blindSpotsPlaceholder:
        "Over-reliance on empiricism might dismiss non-scientific wisdom. A purely intuitive approach might neglect critical assessment. Integrative views may lack a consistent epistemological anchor.",
    },
  },
  Praxeology: {
    name: "Praxeology",
    icon: IconWrapper(Zap),
    colorVariable: "--domain-praxeology",
    tagline: "How should we act?",
    description:
      "Focuses on human action and conduct. It studies the process of purposeful behavior and the logic of choice in human endeavors.",
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
      "Moral action requires awareness of context and complexity.",
    ],
    deepDive: {
      introduction:
        "Praxeology asks: How should we act? This domain shapes your approach to will, action, and agency. It guides your sense of purpose, choice, and responsibility in the world.",
      spectrumExplanation:
        "Praxeology spans from Hierarchical approaches (emphasizing rules, duty, and established order) to Egalitarian ones (emphasizing individual autonomy, context, and emergent consensus).",
      spectrumAnchors: ["Hierarchical", "Balanced / Contextual", "Egalitarian"],
      exampleWorldviews: [
        {
          icon: "⚖️",
          title: "Traditional Conservatism",
          exampleScore: 0.2,
          summary:
            "Emphasizes established hierarchies, order, and adherence to proven principles and duties.",
          type: "codex",
          id: "traditional_conservatism",
        },
        {
          icon: "🤝",
          title: "Situational Ethics",
          exampleScore: 0.55,
          summary:
            "Moral judgments depend on the context; flexibility, empathy, and outcomes are key considerations.",
          type: "codex",
          id: "situational_ethics",
        },
        {
          icon: "🕊️",
          title: "Anarcho-Pacifism",
          exampleScore: 0.85,
          summary:
            "Rejects all coercive hierarchies, advocating for voluntary cooperation, individual autonomy, and non-violence.",
          type: "codex",
          id: "anarcho_pacifism",
        },
      ],
      archetypalPatterns: [
        {
          name: "The Lawkeeper",
          title: "The Lawkeeper",
          scoreRange: "Low (approx 0.20)",
          description:
            "Upholds established structures, rules, and duties; values order and tradition.",
          icon: "zap",
        },
        {
          name: "The Pragmatist",
          title: "The Pragmatist",
          scoreRange: "Mid (approx 0.55)",
          description:
            "Adapts actions to the situation, balancing principles with practical outcomes and individual needs.",
          icon: "zap",
        },
        {
          name: "The Liberator",
          title: "The Liberator",
          scoreRange: "High (approx 0.85)",
          description:
            "Challenges hierarchies, champions individual freedom and self-governance; acts from internal locus of control.",
          icon: "zap",
        },
      ],
      reflectionPrompts: [
        "Are your actions primarily guided by universal rules or by the specific context?",
        "How do you balance personal freedom with social responsibility?",
        "What role do authority and hierarchy play in your decision-making?",
      ],
      whatIfInterpretations: {
        low: "An alignment with the Hierarchical pole suggests you value clear structures, established principles, and adherence to duty. You may find comfort in tradition and defined roles when deciding how to act.",
        mid: "A balanced/contextual praxeological stance often reflects adaptability. You may base actions on the specific situation, considering both principles and practical consequences, weighing individual needs against broader norms.",
        high: "An alignment with the Egalitarian pole suggests you champion individual freedom, question authority, and prefer self-governance or consensus-based action. Authenticity in action is likely a high priority.",
      },
      strengthsPlaceholder:
        "A Hierarchical approach provides stability and clarity. A Contextual view allows for nuanced, adaptable solutions. An Egalitarian stance fosters innovation and individual empowerment.",
      tensionsPlaceholder:
        "Hierarchical systems may resist necessary change. Egalitarian approaches can struggle with large-scale coordination. Contextual ethics may lack consistent guiding principles.",
      blindSpotsPlaceholder:
        "Strong Hierarchical views might overlook individual needs. Strong Egalitarian views may discount the value of established wisdom. Contextual views can appear unpredictable if not grounded in deeper values.",
    },
  },
  Axiology: {
    name: "Axiology",
    icon: IconWrapper(Heart),
    colorVariable: "--domain-axiology",
    tagline: "What is valuable?",
    description:
      "Deals with the nature of value and valuation. It encompasses ethics (moral value) and aesthetics (artistic value).",
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
      "Goodness exists independently of human opinion.",
    ],
    deepDive: {
      introduction:
        "Axiology explores the question: What matters most? It’s the domain of value, desire, and emotional salience—what you love, fear, protect, or pursue. It defines your moral compass and sense of what is good, beautiful, and meaningful.",
      spectrumExplanation:
        "Axiology ranges from Individualism (where personal well-being, autonomy, and achievement are primary) to Collectivism (where group harmony, social justice, and shared well-being are paramount). Many value systems integrate both.",
      spectrumAnchors: [
        "Individualism",
        "Balanced / Relational",
        "Collectivism",
      ],
      exampleWorldviews: [
        {
          icon: "💰",
          title: "Capitalist Individualism",
          exampleScore: 0.25,
          summary:
            "Values individual achievement, material success, and personal freedom through free markets.",
          type: "codex",
          id: "capitalist_individualism",
        },
        {
          icon: "🌍",
          title: "Ubuntu Ethics",
          exampleScore: 0.55,
          summary:
            "Emphasizes interconnectedness, community well-being, and compassion: 'I am because we are.'",
          type: "codex",
          id: "ubuntu_ethics",
        },
        {
          icon: "🙏",
          title: "Mystical Devotion (Bhakti)",
          exampleScore: 0.9,
          summary:
            "Values selfless love, surrender to the divine, and spiritual union as the ultimate good.",
          type: "codex",
          id: "mystical_devotion_bhakti",
        },
      ],
      archetypalPatterns: [
        {
          name: "The Achiever",
          title: "The Achiever",
          scoreRange: "Low (approx 0.25)",
          description:
            "Values success, personal gain, and tangible accomplishments; self-reliance is key.",
          icon: "heart",
        },
        {
          name: "The Ethicist",
          title: "The Ethicist",
          scoreRange: "Mid (approx 0.55)",
          description:
            "Values justice, fairness, human dignity, and ethical principles; seeks balance between individual rights and community needs.",
          icon: "heart",
        },
        {
          name: "The Altruist",
          title: "The Altruist",
          scoreRange: "High (approx 0.90)",
          description:
            "Values collective well-being, service to others, and often transpersonal or sacred ideals over individual gain.",
          icon: "heart",
        },
      ],
      reflectionPrompts: [
        "What do you truly value—and how did you come to value it?",
        "What sits at the core of your moral compass?",
        "When individual desires conflict with group needs, which do you prioritize?",
      ],
      whatIfInterpretations: {
        low: "An alignment with Individualism suggests your values center on personal well-being, autonomy, freedom, and achievement. Self-reliance and individual rights are likely paramount.",
        mid: "A balanced/relational axiology indicates you seek to harmonize individual needs with the well-being of your community or relationships. You may value fairness, mutual respect, and interpersonal connections highly.",
        high: "An alignment with Collectivism suggests your values prioritize the well-being of the larger group, social justice, equality, and shared responsibilities. Transpersonal or sacred values may also be central.",
      },
      strengthsPlaceholder:
        "Individualism can foster innovation and personal responsibility. A Relational view promotes empathy and fair compromise. Collectivism drives social good and solidarity.",
      tensionsPlaceholder:
        "Individual freedoms can conflict with collective responsibilities. Defining 'the good' differs vastly between these poles. Relational views must balance personal needs with group demands.",
      blindSpotsPlaceholder:
        "Strong Individualism might overlook systemic inequalities. Strong Collectivism might undervalue individual dissent. Relational views may struggle when individual and collective needs are in sharp conflict.",
    },
  },
  Mythology: {
    name: "Mythology",
    icon: IconWrapper(BookOpen),
    colorVariable: "--domain-mythology",
    tagline: "What stories define us?",
    description:
      "Examines the narratives, symbols, and belief systems that shape cultural understanding and provide meaning and coherence.",
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
      "The myths we live by shape our personal identities.",
    ],
    deepDive: {
      introduction:
        "Mythology asks: What stories define us? It reveals the patterns, symbols, and cultural narratives that shape meaning, belonging, and imagination. It's about the grand narratives we live by, whether ancient or modern, sacred or secular.",
      spectrumExplanation:
        "Mythology spans from a Linear view (emphasizing historical progression, singular truths, and often one-time creation events) to a Cyclical view (emphasizing recurring patterns, eternal return, and interconnected cycles of time and existence). Many find meaning in archetypal patterns that bridge these.",
      spectrumAnchors: [
        "Linear / Singular",
        "Psychological / Integrative",
        "Cyclical / Eternal",
      ],
      exampleWorldviews: [
        {
          icon: "✝️",
          title: "Biblical Literalism",
          exampleScore: 0.1,
          summary:
            "Sacred stories are taken as literal historical events and absolute, singular truth.",
          type: "codex",
          id: "biblical_literalism",
        },
        {
          icon: "🧠",
          title: "Jungian Depth Psychology",
          exampleScore: 0.6,
          summary:
            "Myths are psychological blueprints; stories embody inner archetypes and timeless human processes.",
          type: "codex",
          id: "jungian_depth_psychology",
        },
        {
          icon: "🌌",
          title: "Mythopoetic Revival",
          exampleScore: 0.85,
          summary:
            "Stories and symbols are living, evolving expressions of universal patterns, connecting to cyclical and eternal truths.",
          type: "codex",
          id: "mythopoetic_revival",
        },
      ],
      archetypalPatterns: [
        {
          name: "The Literalist",
          title: "The Literalist",
          scoreRange: "Low (approx 0.10)",
          description:
            "Adheres to tradition; takes stories as concrete reality or historical fact.",
          icon: "bookOpen",
        },
        {
          name: "The Symbolist",
          title: "The Symbolist",
          scoreRange: "Mid (approx 0.60)",
          description:
            "Sees stories as maps of the soul or society; seeks meaning beneath the surface, finding universal patterns.",
          icon: "bookOpen",
        },
        {
          name: "The Mythic Weaver",
          title: "The Mythic Weaver",
          scoreRange: "High (approx 0.85)",
          description:
            "Lives in symbolic imagination; finds truth in metaphor, recurring cosmic cycles, and participates in creating new myths.",
          icon: "bookOpen",
        },
      ],
      reflectionPrompts: [
        "What core stories or myths (personal, cultural, religious) most shape your understanding of life?",
        "Do you see time and history as primarily linear or cyclical? How does this affect your worldview?",
        "How do you find or create meaning through narrative?",
      ],
      whatIfInterpretations: {
        low: "An alignment with Linear/Singular narratives suggests you find meaning in historical accounts, origin stories, and narratives with clear beginnings and unique, unfolding destinies. The truth of a story might be tied to its factual accuracy or singular revelation.",
        mid: "A Psychological/Integrative understanding of mythology implies you see stories as rich in symbolic meaning, reflecting universal human patterns, psychological truths, or archetypal journeys, often valuing their metaphorical content regardless of literal historicity.",
        high: "An alignment with Cyclical/Eternal narratives indicates you perceive time and existence through recurring patterns, seasons, and the idea of eternal return. Stories are seen as expressions of timeless, mythopoetic truths that re-embody in various forms.",
      },
      strengthsPlaceholder:
        "A Linear view provides direction and historical identity. A Psychological/Integrative view offers deep personal insight. A Cyclical/Eternal view fosters resilience and appreciation for enduring symbolic wisdom.",
      tensionsPlaceholder:
        "Literal historical accounts may conflict with symbolic interpretations. A sense of unique destiny (Linear) can clash with perceptions of timeless patterns (Cyclical/Eternal).",
      blindSpotsPlaceholder:
        "A strong Linear view might overlook symbolic depth. A Psychological view might reduce myths to internal states. A Cyclical view might underemphasize unique historical events.",
    },
  },
  Cosmology: {
    name: "Cosmology",
    icon: IconWrapper(Globe),
    colorVariable: "--domain-cosmology",
    tagline: "How is the universe structured?",
    description:
      "Studies the origin, evolution, and ultimate fate of the universe. It seeks to understand the cosmos at the largest scales.",
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
      "Science and spirituality can both inform cosmology.",
    ],
    deepDive: {
      introduction:
        "Cosmology asks: How is the universe structured? It reflects your assumptions about origins, order, cycles, and ultimate context—science, myth, and spiritual systems all offer cosmologies. It's your map of everything.",
      spectrumExplanation:
        "Cosmology ranges from a Mechanistic view (the universe as a machine, governed by impersonal laws, possibly random) to a Holistic view (the cosmos as an interconnected, living system, perhaps imbued with consciousness or spirit).",
      spectrumAnchors: [
        "Mechanistic / Secular",
        "Interconnected / Organic",
        "Sacred / Spiritual",
      ],
      exampleWorldviews: [
        {
          icon: "🧑‍🔬",
          title: "Scientific Naturalism",
          exampleScore: 0.1,
          summary:
            "The cosmos is a self-organizing, evolving system governed by natural laws, without inherent purpose.",
          type: "codex",
          id: "scientific_naturalism",
        },
        {
          icon: "🌱",
          title: "Gaia Theory",
          exampleScore: 0.6,
          summary:
            "Earth and its ecosystems are seen as a complex, interconnected living system requiring balance.",
          type: "codex",
          id: "gaia_theory",
        },
        {
          icon: "🌠",
          title: "Mystical Cosmology",
          exampleScore: 0.9,
          summary:
            "The universe is sacred, purposeful, and animated by spiritual intelligence or divine presence.",
          type: "codex",
          id: "mystical_cosmology",
        },
      ],
      archetypalPatterns: [
        {
          name: "The Rational Materialist",
          title: "The Rational Materialist",
          scoreRange: "Low (approx 0.10)",
          description:
            "Sees the universe as impersonal, governed by discoverable physical laws or chance; values empirical evidence.",
          icon: "globe",
        },
        {
          name: "The Ecological Systems Thinker",
          title: "The Ecological Systems Thinker",
          scoreRange: "Mid (approx 0.60)",
          description:
            "Recognizes complex interdependence; sees cosmos as a living network or evolving organism, often valuing balance and sustainability.",
          icon: "globe",
        },
        {
          name: "The Cosmic Mystic",
          title: "The Cosmic Mystic",
          scoreRange: "High (approx 0.90)",
          description:
            "Experiences the universe as a conscious whole, rich with meaning, and potentially guided by a divine or spiritual principle.",
          icon: "globe",
        },
      ],
      reflectionPrompts: [
        "How do you imagine the universe and your place in it?",
        "Do you perceive the cosmos as primarily material, energetic, or conscious?",
        "What feels most true—is the universe indifferent, purposeful, or a living entity?",
      ],
      whatIfInterpretations: {
        low: "An alignment with a Mechanistic/Secular cosmology suggests you view the universe as operating according to physical laws, without inherent spiritual dimensions or an overarching divine purpose. Order arises from natural processes and can be understood scientifically.",
        mid: "An Interconnected/Organic cosmology indicates you see the universe as a complex web of relationships and systems, possibly with emergent properties like life and consciousness. There's an appreciation for ecological balance and systemic wholeness.",
        high: "An alignment with a Sacred/Spiritual cosmology suggests you perceive the universe as a living entity, imbued with spirit, meaning, or a universal consciousness. The cosmos may be seen as divinely created, guided, or inherently intelligent.",
      },
      strengthsPlaceholder:
        "A Mechanistic view excels in scientific analysis. An Organic view fosters ecological awareness. A Sacred/Spiritual view can inspire reverence and ethical responsibility.",
      tensionsPlaceholder:
        "Scientific models may conflict with experiences of a conscious cosmos. Randomness in nature can challenge concepts of divine order.",
      blindSpotsPlaceholder:
        "A Mechanistic view might dismiss subjective cosmic connection. A Sacred/Spiritual view might struggle with cosmic indifference or suffering not fitting a benevolent design.",
    },
  },
  Teleology: {
    name: "Teleology",
    icon: IconWrapper(Target),
    colorVariable: "--domain-teleology",
    tagline: "What is our purpose?",
    description:
      "Investigates purpose, design, and final causes in nature and human actions. It explores the concept of goals and ends.",
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
      "Love and awareness are the highest purposes of life.",
    ],
    deepDive: {
      introduction:
        "Teleology asks: What is the ultimate purpose? It expresses your beliefs about destiny, meaning, and direction—whether existence is random, self-authored, or part of a cosmic plan. It is about the 'why' behind existence and action.",
      spectrumExplanation:
        "Teleology spans from a view where purpose is Existential or self-created in a universe without intrinsic goals (low scores), to one where purpose is Divinely ordained or inherent in the cosmos (high scores). Many find meaning in relational or emergent purposes that bridge these.",
      spectrumAnchors: [
        "Existential / Self-Created Purpose",
        "Relational / Emergent Purpose",
        "Divine / Cosmic Purpose",
      ],
      exampleWorldviews: [
        {
          icon: "🎲",
          title: "Existential Nihilism",
          exampleScore: 0.05,
          summary:
            "Life is ultimately without intrinsic meaning; any meaning must be created by the individual.",
          type: "codex",
          id: "existential_nihilism",
        },
        {
          icon: "🏔️",
          title: "Hero’s Journey (Monomyth)",
          exampleScore: 0.55,
          summary:
            "Purpose emerges through challenge, transformation, and story—meaning is discovered and authored.",
          type: "codex",
          id: "heros_journey_monomyth",
        },
        {
          icon: "🌈",
          title: "Divine Teleology",
          exampleScore: 0.95,
          summary:
            "Existence is imbued with a higher purpose or destiny—everything unfolds according to a cosmic plan.",
          type: "codex",
          id: "divine_teleology",
        },
      ],
      archetypalPatterns: [
        {
          name: "The Existential Wanderer",
          title: "The Existential Wanderer",
          scoreRange: "Low (approx 0.05)",
          description:
            "Aligns with self-created meaning; moves through life without certainty of fixed purpose, creating meaning moment by moment.",
          icon: "target",
        },
        {
          name: "The Purposeful Achiever",
          title: "The Purposeful Achiever",
          scoreRange: "Mid (approx 0.55)",
          description:
            "Aligns with relational or emergent purpose; finds meaning through growth, challenge, conscious choice, and often in relation to others or a larger community.",
          icon: "target",
        },
        {
          name: "The Destiny Believer",
          title: "The Destiny Believer",
          scoreRange: "High (approx 0.95)",
          description:
            "Aligns with divine or cosmic purpose; feels guided by a larger plan or spiritual calling, seeing purpose in all events.",
          icon: "target",
        },
      ],
      reflectionPrompts: [
        "What do you believe is the ultimate purpose of life, if any? Is it discovered or created?",
        "How does this belief guide your choices and sense of meaning?",
        "If you have a sense of purpose, where does it come from?",
      ],
      whatIfInterpretations: {
        low: "An alignment with Existential / Self-Created Purpose suggests you believe meaning is not inherent but is something individuals must forge for themselves in a universe without intrinsic goals. Freedom and responsibility are key.",
        mid: "A Relational / Emergent sense of purpose indicates you may find meaning through personal growth, connections with others, contributing to community, fulfilling a perceived potential, or through the unfolding of life's journey.",
        high: "An alignment with Divine / Cosmic Purpose suggests you believe life has an inherent, pre-ordained meaning or direction, possibly guided by a higher power, spiritual principle, or universal plan.",
      },
      strengthsPlaceholder:
        "An Existential view champions individual freedom and creativity. A Relational/Emergent view fosters community and adaptability. A Divine/Cosmic view can provide resilience and a sense of guidance.",
      tensionsPlaceholder:
        "The burden of total freedom (Existential) can conflict with the desire for inherent meaning (Divine). Individual purpose may clash with perceived collective destiny.",
      blindSpotsPlaceholder:
        "A strong Existential view might feel overwhelming without external guidance. A strong Divine/Cosmic view might struggle with ambiguity or events contradicting a benevolent plan.",
    },
  },
};

export const getFacetByName = (name: FacetName): Facet => FACETS[name];
export const DEFAULT_FACET_ICON: React.FC<React.SVGProps<SVGSVGElement>> =
  IconWrapper(HelpCircle as LucideIcon);

// Ensure placeholder icons for archetypal patterns are valid keys from Icons
const defaultArchetypeIconKey: keyof typeof Icons = "sparkles";
Object.values(FACETS).forEach((facet) => {
  if (facet.deepDive.archetypalPatterns) {
    facet.deepDive.archetypalPatterns.forEach((p) => {
      if (!p.icon || !Icons[p.icon as keyof typeof Icons]) {
        // Assign a more relevant default based on the facet's main icon, if possible
        const facetMainIconComponent = facet.icon;
        let potentialIconKey: keyof typeof Icons | undefined;

        // Attempt to find the key for the facet's main icon
        for (const key in Icons) {
          if (Icons[key as keyof typeof Icons] === facetMainIconComponent) {
            potentialIconKey = key as keyof typeof Icons;
            break;
          }
        }
        p.icon = potentialIconKey || defaultArchetypeIconKey;
      }
    });
  }
});
