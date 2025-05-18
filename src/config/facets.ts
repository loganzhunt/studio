
import type { Facet, FacetName, FacetDeepDive } from '@/types';
import { Atom, Brain, Zap, Heart, BookOpen, Globe, Target, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Icons } from '@/components/icons';
import React from 'react';

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

const getDefaultDeepDive = (facetName: string): FacetDeepDive => ({
  introduction: `This is the deep dive introduction for ${facetName}. It explores the fundamental questions and concepts related to how we perceive and understand this dimension of reality.`,
  spectrumExplanation: `The spectrum of ${facetName} ranges from one pole (e.g., purely materialistic views) to another (e.g., highly idealistic or spiritual views), with many nuanced positions in between. Understanding where one orients on this spectrum can reveal much about their underlying assumptions.`,
  spectrumAnchors: ["Materialistic/Literal", "Balanced/Pragmatic", "Idealistic/Symbolic"],
  exampleWorldviews: [
    { icon: "🧪", title: `Example ${facetName} Worldview 1 (Low)`, summary: `This worldview emphasizes a concrete, often empirical approach to ${facetName}.`, exampleScore: 0.2, type: 'codex', id: 'scientific_materialism' },
    { icon: "🏛️", title: `Example ${facetName} Worldview 2 (Mid)`, summary: `This worldview balances different perspectives on ${facetName}, often integrating practical and theoretical aspects.`, exampleScore: 0.5, type: 'codex', id: 'stoicism' },
    { icon: "✨", title: `Example ${facetName} Worldview 3 (High)`, summary: `This worldview explores the more abstract, often intuitive or transcendent aspects of ${facetName}.`, exampleScore: 0.8, type: 'archetype', id: 'the_mystic' }
  ],
  archetypalPatterns: [
    { title: `The ${facetName} Realist`, scoreRange: "Low (0.0-0.33)", description: `Focuses on tangible aspects of ${facetName}.`, icon: "atom" as keyof typeof Icons },
    { title: `The ${facetName} Pragmatist`, scoreRange: "Mid (0.34-0.66)", description: `Balances different views on ${facetName}.`, icon: "atom" as keyof typeof Icons },
    { title: `The ${facetName} Visionary`, scoreRange: "High (0.67-1.0)", description: `Explores abstract dimensions of ${facetName}.`, icon: "atom" as keyof typeof Icons }
  ],
  reflectionPrompts: [
    `How do your current beliefs about ${facetName} influence your daily decisions?`,
    `What experiences have most shaped your understanding of ${facetName}?`
  ],
  whatIfInterpretations: {
    low: `A low score in ${facetName} often suggests a focus on concrete realities or established methods.`,
    mid: `A mid-range score in ${facetName} typically indicates a balanced or pragmatic approach.`,
    high: `A high score in ${facetName} usually points to an emphasis on abstract, intuitive, or transcendent aspects.`
  },
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
      introduction: "Ontology addresses the fundamental question: What is real? It is the facet that shapes your metaphysical assumptions—whether the universe is made of matter, mind, energy, spirit, illusion, or code. Every belief, every experience, passes through an ontological filter, whether it’s inherited, chosen, or unconscious.",
      spectrumExplanation: "Ontology spans a symbolic continuum from Materialism (where only physical matter is real) to Idealism or Non-Dualism (where reality is rooted in consciousness or sacred unity). Most worldviews fall somewhere between, integrating various ontological frames.",
      spectrumAnchors: ["Materialism", "Relational / Dualist", "Idealism / Non-Dualist"],
      exampleWorldviews: [
        { icon: "🧪", title: "Scientific Humanism", exampleScore: 0.15, summary: "Reality is composed of physical matter and measurable energy. Mind arises from the brain.", type: 'codex', id: 'scientific_humanism' },
        { icon: "☸️", title: "Classical Buddhism (Madhyamaka)", exampleScore: 0.55, summary: "Reality is empty of inherent existence, co-arising in relation. Neither substance nor void.", type: 'codex', id: 'buddhism' }, // Assuming 'buddhism' is a valid ID in your codex
        { icon: "🕉️", title: "Vedantic Hinduism", exampleScore: 0.90, summary: "All appearances arise from Brahman—pure consciousness. The world is illusion-like (maya).", type: 'codex', id: 'hinduism' }, // Assuming 'hinduism' is a valid ID
        { icon: "🌿", title: "Indigenous Animism", exampleScore: 0.85, summary: "All things—trees, rivers, rocks—have spirit and presence. Reality is alive and relational.", type: 'codex', id: 'animism' }
      ],
      archetypalPatterns: [
        { title: "The Rational Skeptic", scoreRange: "Aligns with Materialism (approx 0.20)", description: "Prioritizes scientific realism. Truth is derived from measurable evidence and logic.", icon: "search" as keyof typeof Icons },
        { title: "The Integral Synthesizer", scoreRange: "Aligns with Relational / Dualist (approx 0.55)", description: "Holds multiple ontologies together—material and spiritual, inner and outer.", icon: "library" as keyof typeof Icons },
        { title: "The Transcendent Mystic", scoreRange: "Aligns with Idealism / Non-Dualist (approx 0.95)", description: "Sees all phenomena as reflections of a single underlying consciousness or spirit.", icon: "sparkles" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "What do you believe is ultimately real?",
        "Do you prioritize the measurable or the mystical in understanding reality?",
        "How does your answer about what's real shape how you respond to life's events and experiences?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests a stronger alignment with Materialism. Reality is primarily understood through physical matter and observable phenomena. You likely prioritize empirical evidence and may be skeptical of claims that lack tangible proof.",
        mid: "A mid-range score in Ontology points to a more Relational or Dualist perspective. You might see reality as having multiple layers, perhaps acknowledging both physical and non-physical aspects, or you may adopt a pragmatic stance integrating various frameworks.",
        high: "A score in this range suggests a stronger alignment with Idealism or Non-Dualism. Reality is seen as fundamentally rooted in consciousness, spirit, or interconnected unity. The material world may be viewed as an expression of these deeper dimensions."
      },
      strengthsPlaceholder: "Alignment with Materialism can foster rigorous scientific analysis. A Relational/Dualist view may excel at integrative thinking. Alignment with Idealism can nurture deep empathy and symbolic understanding.",
      tensionsPlaceholder: "Materialism might grapple with subjective meaning. Idealism might find it hard to ground concepts in practical reality. Relational views may need to clearly define interactions between distinct realities.",
      blindSpotsPlaceholder: "A strong Materialist focus might overlook symbolic meaning. A highly Idealist view could discount physical limitations. Relational views might struggle with defining clear boundaries or priorities."
    }
  },
  Epistemology: {
    name: "Epistemology",
    icon: IconWrapper(Brain),
    colorVariable: "--domain-epistemology",
    tagline: "What can be known?",
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
      introduction: "Epistemology asks: What can be known—and how? This facet governs your philosophy of knowledge, belief, and truth. It shapes what counts as evidence, whether you trust reason, intuition, tradition, revelation, or direct experience.",
      spectrumExplanation: "Epistemology ranges from a strictly Empirical approach (knowledge is gained only through the senses) to an Intuitional or Revelatory stance (where knowledge is direct, innate, or transmitted through sacred sources). Most worldviews blend these approaches.",
      spectrumAnchors: ["Empirical", "Balanced / Integrative", "Revelatory / Intuitional"],
      exampleWorldviews: [
        { icon: "🧪", title: "Scientific Rationalism", exampleScore: 0.20, summary: "Truth is established through observation, experiment, and logical reasoning.", type: 'codex', id: 'rationalism' }, // Assuming 'rationalism' or 'scientific_rationalism'
        { icon: "🔮", title: "Hermetic Mysticism", exampleScore: 0.80, summary: "Knowledge is unveiled through direct intuition, symbol, or esoteric revelation.", type: 'codex', id: 'gnosticism' }, // Example ID
        { icon: "🕊️", title: "Religious Faith", exampleScore: 0.95, summary: "Ultimate truth is revealed by sacred scripture, prophets, or divine encounter.", type: 'codex', id: 'christianity' } // Example ID
      ],
      archetypalPatterns: [
        { title: "The Empiricist", scoreRange: "Aligns with Empirical (approx 0.10)", description: "Values observable facts and measurable proof; questions all else.", icon: "brain" as keyof typeof Icons },
        { title: "The Integrator", scoreRange: "Aligns with Balanced / Integrative (approx 0.55)", description: "Balances science, reason, and intuitive knowing; open to multiple sources.", icon: "brain" as keyof typeof Icons },
        { title: "The Visionary Seer", scoreRange: "Aligns with Revelatory / Intuitional (approx 0.95)", description: "Trusts inner vision, spiritual insight, or direct revelation as highest knowing.", icon: "brain" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "How do you decide what is true?",
        "What sources of knowledge do you trust most?",
        "How do you respond when your beliefs are challenged?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests a stronger alignment with an Empirical approach to knowledge. You likely value truth derived from sensory experience, observation, and scientific methodology.",
        mid: "A mid-range score in Epistemology indicates a Balanced or Integrative view. You likely value multiple ways of knowing, including reason, experience, and perhaps intuition, to form understanding.",
        high: "A score in this range suggests a stronger alignment with Revelatory or Intuitional ways of knowing. You may trust inner vision, direct insight, or sacred sources as primary paths to truth."
      },
      strengthsPlaceholder: "An Empirical stance fosters critical thinking. An Integrative approach allows for holistic understanding. A Revelatory/Intuitional stance can lead to profound insights.",
      tensionsPlaceholder: "Tensions can arise between objective evidence (Empirical) and subjective conviction (Revelatory/Intuitional), or in synthesizing diverse knowledge sources (Integrative).",
      blindSpotsPlaceholder: "Over-reliance on empiricism might dismiss valid subjective truths. A purely intuitive approach might neglect critical assessment. Integrative views must navigate potential contradictions."
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
      introduction: "Praxeology asks: How should we act? This domain shapes your approach to will, action, and agency. It guides your sense of purpose, choice, and responsibility.",
      spectrumExplanation: "Praxeology spans from a Hierarchical or rule-based approach to ethics and action, to a more Egalitarian or context-driven approach. It explores whether actions are guided by universal principles or by individual autonomy and situational ethics.",
      spectrumAnchors: ["Hierarchical / Rule-Based", "Balanced / Contextual", "Egalitarian / Autonomous"],
      exampleWorldviews: [
        { icon: "⚖️", title: "Traditional Conservatism", exampleScore: 0.20, summary: "Emphasizes established hierarchies, order, and adherence to proven principles.", type: 'codex', id: 'traditionalism' }, // Example ID
        { icon: "🤝", title: "Situational Ethics", exampleScore: 0.55, summary: "Moral judgments depend on the context; flexibility and empathy are key.", type: 'codex', id: 'existentialism' }, // Example ID
        { icon: "🕊️", title: "Anarcho-Pacifism", exampleScore: 0.85, summary: "Rejects all coercive hierarchies, advocating for voluntary cooperation and non-violence.", type: 'codex', id: 'animism' } // Example ID, needs better fit.
      ],
      archetypalPatterns: [
        { title: "The Lawkeeper", scoreRange: "Aligns with Hierarchical / Rule-Based (approx 0.20)", description: "Upholds established structures, rules, and duties; values order and tradition.", icon: "zap" as keyof typeof Icons },
        { title: "The Pragmatist", scoreRange: "Aligns with Balanced / Contextual (approx 0.55)", description: "Adapts actions to the situation, balancing principles with practical outcomes.", icon: "zap" as keyof typeof Icons },
        { title: "The Liberator", scoreRange: "Aligns with Egalitarian / Autonomous (approx 0.85)", description: "Challenges hierarchies, champions individual freedom and self-governance.", icon: "zap" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "Are your actions primarily guided by universal rules or by the specific context?",
        "How do you balance personal freedom with social responsibility?",
        "What role do authority and hierarchy play in your decision-making?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests an alignment with a Hierarchical or Rule-Based approach to action. You likely value clear structures, established principles, and duty.",
        mid: "A mid-range score in Praxeology often reflects a Balanced or Contextual perspective. You may adapt your actions based on the situation, considering both principles and practical consequences.",
        high: "A score in this range suggests an alignment with an Egalitarian or Autonomous approach. You likely champion individual freedom, question authority, and prefer self-governance or consensus-based action."
      },
      strengthsPlaceholder: "A Hierarchical approach provides stability. A Contextual view allows for adaptable solutions. An Egalitarian stance fosters innovation and individual empowerment.",
      tensionsPlaceholder: "Tensions can arise between maintaining order (Hierarchical) and allowing for individual expression (Egalitarian), or between following rules and responding to unique situations (Contextual).",
      blindSpotsPlaceholder: "A Hierarchical view might be resistant to necessary change. An Egalitarian view might struggle with large-scale coordination. A Contextual view might lack consistent principles."
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
      introduction: "Axiology explores the question: What matters most? It’s the domain of value, desire, and emotional salience—what you love, fear, protect, or pursue. It defines your moral compass and sense of what is good, beautiful, and meaningful.",
      spectrumExplanation: "Axiology ranges from Individualism (where personal well-being, autonomy, and achievement are primary) to Collectivism (where group harmony, social justice, and shared well-being are paramount). Many value systems integrate both.",
      spectrumAnchors: ["Individualism", "Balanced / Relational", "Collectivism"],
      exampleWorldviews: [
        { icon: "💰", title: "Libertarianism", exampleScore: 0.15, summary: "Prioritizes individual liberty, free markets, and minimal government intervention.", type: 'codex', id: 'capitalist_individualism' }, // Using existing ID
        { icon: "🌍", title: "Communitarianism", exampleScore: 0.60, summary: "Emphasizes community bonds, shared values, and social responsibilities.", type: 'codex', id: 'ubuntu_ethics' }, // Using existing ID
        { icon: "🙏", title: "Engaged Buddhism", exampleScore: 0.85, summary: "Applies Buddhist principles to social and environmental justice, valuing universal compassion.", type: 'codex', id: 'mahayana_buddhism' } // Example ID
      ],
      archetypalPatterns: [
        { title: "The Self-Reliant Individual", scoreRange: "Aligns with Individualism (approx 0.25)", description: "Values personal achievement, autonomy, and self-interest as drivers of good.", icon: "heart" as keyof typeof Icons },
        { title: "The Harmonizer", scoreRange: "Aligns with Balanced / Relational (approx 0.55)", description: "Seeks to balance individual needs with the well-being of relationships and small groups.", icon: "heart" as keyof typeof Icons },
        { title: "The Global Citizen", scoreRange: "Aligns with Collectivism (approx 0.90)", description: "Prioritizes the welfare of the larger community, society, or even all sentient beings.", icon: "heart" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "What do you truly value—and how did you come to value it?",
        "When individual desires conflict with group needs, which do you prioritize?",
        "What does 'a good life' or 'a good society' mean to you?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests values aligning more with Individualism. Personal well-being, autonomy, freedom, and achievement are likely primary drivers.",
        mid: "A mid-range score in Axiology often reflects Balanced or Relational values. You may seek to harmonize individual needs with the well-being of your immediate community or relationships, valuing fairness and mutual respect.",
        high: "A score in this range suggests values aligning more with Collectivism. The well-being of the larger group, social justice, equality, and shared responsibilities are likely paramount."
      },
      strengthsPlaceholder: "Individualism can foster innovation and self-reliance. A Balanced/Relational view promotes strong interpersonal bonds. Collectivism can drive large-scale social good.",
      tensionsPlaceholder: "Tensions can arise between individual freedoms and collective responsibilities, or between personal ambition and the needs of the community.",
      blindSpotsPlaceholder: "Strong Individualism might overlook systemic inequalities. Strong Collectivism might undervalue individual dissent or uniqueness. A Balanced view may struggle with large-scale systemic issues."
    }
  },
  Mythology: {
    name: "Mythology",
    icon: IconWrapper(BookOpen),
    colorVariable: "--domain-mythology",
    tagline: "What stories define us?",
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
      introduction: "Mythology asks: What stories define us? It reveals the patterns, symbols, and cultural narratives that shape meaning, belonging, and imagination. It's about the grand narratives we live by, whether ancient or modern, sacred or secular.",
      spectrumExplanation: "Mythology spans from a Linear view (emphasizing historical progression, singular truths, and often one-time creation events) to a Cyclical view (emphasizing recurring patterns, eternal return, and interconnected cycles of time and existence).",
      spectrumAnchors: ["Linear / Singular", "Integrative / Archetypal", "Cyclical / Eternal"],
      exampleWorldviews: [
        { icon: "✝️", title: "Abrahamic Traditions (Linear History)", exampleScore: 0.15, summary: "History is often seen as a linear progression from creation towards a final judgment or redemption.", type: 'codex', id: 'christianity' }, // Example
        { icon: "🧠", title: "Jungian Psychology (Archetypal Patterns)", exampleScore: 0.50, summary: "Myths embody universal archetypes and recurring psychological patterns that are timeless.", type: 'codex', id: 'jungian_depth_psychology' }, // Using existing ID
        { icon: "🕉️", title: "Hindu Cosmology (Cyclical Time)", exampleScore: 0.85, summary: "Time is seen in vast, repeating cycles (Yugas); creation and destruction are ongoing.", type: 'codex', id: 'hinduism' } // Example
      ],
      archetypalPatterns: [
        { title: "The Chronicler", scoreRange: "Aligns with Linear / Singular (approx 0.15)", description: "Focuses on historical narratives, origin stories, and a sense of unique, unfolding destiny.", icon: "bookOpen" as keyof typeof Icons },
        { title: "The Symbolist", scoreRange: "Aligns with Integrative / Archetypal (approx 0.50)", description: "Sees myths as symbolic maps of the human psyche and timeless truths.", icon: "bookOpen" as keyof typeof Icons },
        { title: "The Weaver of Cycles", scoreRange: "Aligns with Cyclical / Eternal (approx 0.85)", description: "Perceives life and cosmos through recurring patterns, seasons, and the eternal return.", icon: "bookOpen" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "What core stories or myths (personal, cultural, religious) most shape your understanding of life?",
        "Do you see time and history as primarily linear or cyclical? How does this affect your worldview?",
        "How do you find or create meaning through narrative?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests an alignment with Linear or Singular narratives. You may find meaning in historical progression, unique events, and stories with clear beginnings and ends.",
        mid: "A mid-range score in Mythology indicates an Integrative or Archetypal understanding. You likely see stories as rich in symbolic meaning, reflecting universal human patterns or psychological truths.",
        high: "A score in this range points to an alignment with Cyclical or Eternal narratives. You may perceive time and existence through recurring patterns, seasons, and the idea of eternal return or interconnected cycles."
      },
      strengthsPlaceholder: "A Linear view can provide a strong sense of direction. An Archetypal view offers deep psychological insight. A Cyclical view fosters an appreciation for natural rhythms and resilience.",
      tensionsPlaceholder: "Tensions can arise between historical accounts and symbolic interpretations, or between a sense of unique destiny and the perception of recurring patterns.",
      blindSpotsPlaceholder: "A strong Linear view might overlook recurring themes. An Archetypal view might over-psychologize concrete events. A strong Cyclical view might underemphasize the significance of unique historical moments."
    }
  },
  Cosmology: {
    name: "Cosmology",
    icon: IconWrapper(Globe),
    colorVariable: "--domain-cosmology",
    tagline: "How is the universe structured?",
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
      introduction: "Cosmology asks: How is the universe structured? It reflects your assumptions about origins, order, cycles, and ultimate context—science, myth, and spiritual systems all offer cosmologies. It's your map of everything.",
      spectrumExplanation: "Cosmology ranges from a Mechanistic view (the universe as a machine, governed by impersonal laws, possibly random) to a Holistic view (the cosmos as an interconnected, living system, perhaps imbued with consciousness or spirit).",
      spectrumAnchors: ["Mechanistic", "Interconnected / Organic", "Holistic / Conscious"],
      exampleWorldviews: [
        { icon: "🧑‍🔬", title: "Scientific Naturalism", exampleScore: 0.10, summary: "The cosmos is a self-organizing, evolving system governed by physical laws, without inherent purpose.", type: 'codex', id: 'scientific_materialism' }, // Using existing ID
        { icon: "🌱", title: "Gaia Theory / Deep Ecology", exampleScore: 0.60, summary: "Earth and its ecosystems are seen as a complex, interconnected living system requiring balance.", type: 'codex', id: 'animism' }, // Example, could be refined
        { icon: "🌠", title: "Pantheism / Panentheism", exampleScore: 0.90, summary: "The universe itself is divine, or God is immanent in and transcendent to the cosmos; all is sacred.", type: 'codex', id: 'pantheism' } // Using existing ID
      ],
      archetypalPatterns: [
        { title: "The Cosmic Engineer", scoreRange: "Aligns with Mechanistic (approx 0.15)", description: "Sees the universe as a complex machine governed by discoverable physical laws.", icon: "globe" as keyof typeof Icons },
        { title: "The Web Weaver", scoreRange: "Aligns with Interconnected / Organic (approx 0.55)", description: "Perceives the cosmos as a vast network of relationships and interdependent systems.", icon: "globe" as keyof typeof Icons },
        { title: "The Universal Mystic", scoreRange: "Aligns with Holistic / Conscious (approx 0.85)", description: "Experiences the universe as a living, conscious whole, often feeling a profound sense of unity.", icon: "globe" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "How do you imagine the universe and your place in it?",
        "Do you perceive the cosmos as primarily material, energetic, or conscious?",
        "What feels most true—is the universe indifferent, purposeful, or a living entity?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests an alignment with a Mechanistic view of the cosmos. You likely see the universe as operating according to physical laws, without inherent spiritual dimensions or overarching purpose.",
        mid: "A mid-range score in Cosmology indicates an Interconnected or Organic view. You may see the universe as a complex web of relationships and systems, possibly with emergent properties like life and consciousness.",
        high: "A score in this range points to a Holistic or Conscious view of the cosmos. You might perceive the universe as a living entity, imbued with spirit, meaning, or a universal consciousness."
      },
      strengthsPlaceholder: "A Mechanistic view excels in scientific analysis. An Interconnected view fosters ecological awareness. A Holistic view can inspire a profound sense of wonder and unity.",
      tensionsPlaceholder: "Tensions can arise between scientific models of a material universe and experiences of a living or conscious cosmos, or between randomness and perceived order/design.",
      blindSpotsPlaceholder: "A strong Mechanistic view might dismiss subjective experiences of cosmic connection. A strong Holistic view might find it hard to reconcile with aspects of cosmic indifference or chaos."
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
      introduction: "Teleology asks: What is the ultimate purpose? It expresses your beliefs about destiny, meaning, and direction—whether existence is random, self-authored, or part of a cosmic plan. It is about the 'why' behind existence and action.",
      spectrumExplanation: "Teleology spans from a view where purpose is Divinely ordained or inherent in the cosmos, to one where purpose is entirely Existential, meaning it is self-created by individuals in a universe without intrinsic goals.",
      spectrumAnchors: ["Divine / Cosmic Purpose", "Relational / Emergent Purpose", "Existential / Self-Created Purpose"], // Reversed from original to match low=divine, high=existential logic
      exampleWorldviews: [
        { icon: "🙏", title: "Theistic Religions (e.g., Christianity, Islam)", exampleScore: 0.15, summary: "Human purpose is often seen as fulfilling God's will, achieving salvation, or communion with the Divine.", type: 'codex', id: 'christianity' }, // Example
        { icon: "🤝", title: "Humanistic Ethics", exampleScore: 0.50, summary: "Purpose is found in human flourishing, contributing to society, and realizing potential.", type: 'codex', id: 'humanism' }, // Example
        { icon: "🧑‍🚀", title: "Atheistic Existentialism", exampleScore: 0.90, summary: "There is no preordained purpose; individuals are radically free to create their own meaning and values.", type: 'codex', id: 'existentialism' } // Example
      ],
      archetypalPatterns: [
        { title: "The Disciple", scoreRange: "Aligns with Divine / Cosmic Purpose (approx 0.20)", description: "Believes in a preordained plan or higher calling; seeks to align with and fulfill this purpose.", icon: "target" as keyof typeof Icons },
        { title: "The Contributor", scoreRange: "Aligns with Relational / Emergent Purpose (approx 0.55)", description: "Finds meaning in personal growth, service to others, and contributing to a better world.", icon: "target" as keyof typeof Icons },
        { title: "The Self-Creator", scoreRange: "Aligns with Existential / Self-Created Purpose (approx 0.85)", description: "Asserts that meaning is not found but made; embraces freedom and responsibility to define one's own purpose.", icon: "target" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "What do you believe is the ultimate purpose of life, if any? Is it discovered or created?",
        "How does this belief guide your choices and sense of meaning, especially in challenging times?",
        "If you have a sense of purpose, where does it come from?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests an alignment with a Divine or Cosmic Purpose. You likely believe that life has an inherent, pre-ordained meaning or direction, possibly guided by a higher power or universal plan.",
        mid: "A mid-range score in Teleology indicates a Relational or Emergent Purpose. You may find meaning through personal growth, connections with others, contributing to community, or fulfilling a perceived potential within a broader context.",
        high: "A score in this range points to an Existential or Self-Created Purpose. You likely believe that meaning is not inherent but is something individuals must forge for themselves in a universe without intrinsic goals."
      },
      strengthsPlaceholder: "A Divine/Cosmic view can provide profound resilience. An Emergent view fosters strong community ties. An Existential view champions individual freedom and creativity.",
      tensionsPlaceholder: "Tensions can arise between a preordained plan (Divine) and personal free will (Existential), or between individual fulfillment and collective purpose (Relational).",
      blindSpotsPlaceholder: "A strong Divine/Cosmic view might struggle with ambiguity. An Existential view might feel overwhelming without external guidance. A Relational view might overlook broader systemic purposes or individual callings."
    }
  },
};

export const getFacetByName = (name: FacetName): Facet => FACETS[name];
export const DEFAULT_FACET_ICON: React.FC<React.SVGProps<SVGSVGElement>> = IconWrapper(HelpCircle as LucideIcon);

const defaultArchetypeIconKey: keyof typeof Icons = "sparkles"; 
Object.values(FACETS).forEach(facet => {
  if (facet.deepDive.archetypalPatterns) {
    facet.deepDive.archetypalPatterns.forEach(p => {
      if (!p.icon) {
        // Assign a more relevant default based on the facet's main icon, if possible
        const facetMainIconKey = Object.keys(Icons).find(
          key => Icons[key as keyof typeof Icons] === (facet.icon as any) // This comparison might be tricky
        );
        p.icon = (facetMainIconKey || defaultArchetypeIconKey) as keyof typeof Icons;
      }
    });
  }
});
