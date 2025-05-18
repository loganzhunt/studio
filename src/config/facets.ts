
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
        { icon: "☸️", title: "Classical Buddhism (Madhyamaka)", exampleScore: 0.55, summary: "Reality is empty of inherent existence, co-arising in relation. Neither substance nor void.", type: 'codex', id: 'buddhism' },
        { icon: "🕉️", title: "Vedantic Hinduism", exampleScore: 0.90, summary: "All appearances arise from Brahman—pure consciousness. The world is illusion-like (maya).", type: 'codex', id: 'hinduism' },
        { icon: "🌿", title: "Indigenous Animism", exampleScore: 0.85, summary: "All things—trees, rivers, rocks—have spirit and presence. Reality is alive and relational.", type: 'codex', id: 'animism' }
      ],
      archetypalPatterns: [
        { title: "The Rational Skeptic", scoreRange: "Aligns with Materialism (approx 0.20)", description: "Prioritizes scientific realism. Truth is derived from measurable evidence and logic.", icon: "atom" as keyof typeof Icons },
        { title: "The Integral Synthesizer", scoreRange: "Aligns with Relational / Dualist (approx 0.55)", description: "Holds multiple ontologies together—material and spiritual, inner and outer.", icon: "atom" as keyof typeof Icons },
        { title: "The Transcendent Mystic", scoreRange: "Aligns with Idealism / Non-Dualist (approx 0.95)", description: "Sees all phenomena as reflections of a single underlying consciousness or spirit.", icon: "atom" as keyof typeof Icons }
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
      strengthsPlaceholder: "Alignment with Materialism can foster rigorous scientific analysis and clear boundaries. A Relational/Dualist view may excel at integrative thinking and appreciating complexity. Alignment with Idealism can nurture deep empathy, symbolic understanding, and a sense of interconnectedness.",
      tensionsPlaceholder: "Materialism might grapple with subjective meaning or non-empirical realities. Idealism might find it challenging to ground abstract concepts in practical application or to address physical limitations. Relational views may need to clearly define how different orders of reality interact.",
      blindSpotsPlaceholder: "A strong Materialist focus might overlook symbolic meaning or the validity of subjective experience. A highly Idealist view could discount the importance of physical well-being or empirical evidence. Relational views might struggle with defining clear boundaries or priorities when different realities conflict."
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
      spectrumExplanation: "Epistemology ranges from strict empiricism (0.0)—knowledge is gained only through the senses—to intuitional or revelatory (1.0), where knowledge is direct, innate, or transmitted through sacred sources. Most worldviews blend empirical, rational, and mystical approaches to truth.",
      spectrumAnchors: ["Empirical", "Balanced / Integrative", "Revelatory / Intuitional"],
      exampleWorldviews: [
        { icon: "🧪", title: "Scientific Rationalism", exampleScore: 0.20, summary: "Truth is established through observation, experiment, and logical reasoning.", type: 'codex', id: 'scientific_rationalism' },
        { icon: "🔮", title: "Hermetic Mysticism", exampleScore: 0.80, summary: "Knowledge is unveiled through direct intuition, symbol, or esoteric revelation.", type: 'codex', id: 'hermetic_mysticism' },
        { icon: "🕊️", title: "Religious Faith", exampleScore: 0.95, summary: "Ultimate truth is revealed by sacred scripture, prophets, or divine encounter.", type: 'codex', id: 'religious_faith' }
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
        low: "A score in this range suggests a stronger alignment with an Empirical approach to knowledge. You likely value truth derived from sensory experience, observation, and scientific methodology. Certainty is often linked to verifiable evidence.",
        mid: "A mid-range score in Epistemology indicates a Balanced or Integrative view. You likely value multiple ways of knowing, integrating reason, experience, and perhaps intuition or trusted testimony to form understanding. You may be open to diverse perspectives on truth.",
        high: "A score in this range suggests a stronger alignment with Revelatory or Intuitional ways of knowing. You may trust inner vision, direct insight, sacred texts, or spiritual experiences as primary paths to truth, sometimes valuing these above empirical evidence or pure logic."
      },
      strengthsPlaceholder: "An Empirical stance fosters critical thinking and objectivity. An Integrative approach allows for holistic understanding and adaptability. A Revelatory/Intuitional stance can lead to profound personal insights and a strong sense of conviction.",
      tensionsPlaceholder: "Tensions can arise between the need for objective evidence (Empirical) and the validity of subjective conviction or faith (Revelatory/Intuitional). Integrative views must navigate how to weigh and synthesize potentially conflicting knowledge sources.",
      blindSpotsPlaceholder: "Over-reliance on empiricism might dismiss valid subjective truths or wisdom from non-scientific traditions. A purely intuitive or faith-based approach might neglect critical assessment or ignore contradictory evidence. Integrative views may struggle with finding a consistent epistemological anchor."
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
      spectrumExplanation: "Praxeology spans from a Hierarchical or rule-based approach to ethics and action, to a more Egalitarian or context-driven approach. It explores whether actions are guided by universal principles, established order, or by individual autonomy and situational ethics.",
      spectrumAnchors: ["Hierarchical / Rule-Based", "Balanced / Contextual", "Egalitarian / Autonomous"],
      exampleWorldviews: [
        { icon: "⚖️", title: "Traditional Conservatism", exampleScore: 0.20, summary: "Emphasizes established hierarchies, order, and adherence to proven principles and duties.", type: 'codex', id: 'traditional_conservatism' },
        { icon: "🤝", title: "Situational Ethics", exampleScore: 0.55, summary: "Moral judgments depend on the context; flexibility, empathy, and outcomes are key considerations.", type: 'codex', id: 'situational_ethics' },
        { icon: "🕊️", title: "Anarcho-Pacifism", exampleScore: 0.85, summary: "Rejects all coercive hierarchies, advocating for voluntary cooperation, individual autonomy, and non-violence.", type: 'codex', id: 'anarcho_pacifism' }
      ],
      archetypalPatterns: [
        { title: "The Lawkeeper", scoreRange: "Aligns with Hierarchical / Rule-Based (approx 0.20)", description: "Upholds established structures, rules, and duties; values order and tradition.", icon: "zap" as keyof typeof Icons },
        { title: "The Pragmatist", scoreRange: "Aligns with Balanced / Contextual (approx 0.55)", description: "Adapts actions to the situation, balancing principles with practical outcomes and individual needs.", icon: "zap" as keyof typeof Icons },
        { title: "The Liberator", scoreRange: "Aligns with Egalitarian / Autonomous (approx 0.85)", description: "Challenges hierarchies, champions individual freedom and self-governance; acts from internal locus of control.", icon: "zap" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "Are your actions primarily guided by universal rules or by the specific context?",
        "How do you balance personal freedom with social responsibility?",
        "What role do authority and hierarchy play in your decision-making?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests an alignment with a Hierarchical or Rule-Based approach to action. You likely value clear structures, established principles, adherence to duty, and may find comfort in tradition and defined roles.",
        mid: "A mid-range score in Praxeology often reflects a Balanced or Contextual perspective. You may adapt your actions based on the situation, considering both principles and practical consequences, often weighing individual needs against broader norms.",
        high: "A score in this range suggests an alignment with an Egalitarian or Autonomous approach. You likely champion individual freedom, question authority, prefer self-governance or consensus-based action, and prioritize authenticity in action."
      },
      strengthsPlaceholder: "A Hierarchical approach provides stability, clarity, and predictability. A Contextual view allows for adaptable, nuanced solutions and empathy. An Egalitarian stance fosters innovation, individual empowerment, and can challenge unjust systems.",
      tensionsPlaceholder: "Tensions can arise between maintaining order/tradition (Hierarchical) and allowing for individual expression/change (Egalitarian), or between consistently following rules and responding effectively to unique situations (Contextual).",
      blindSpotsPlaceholder: "A strong Hierarchical view might be resistant to necessary change or overlook individual needs. An Egalitarian view might struggle with large-scale coordination or maintaining stable structures. A Contextual view might lack consistent guiding principles or appear unpredictable."
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
        { icon: "💰", title: "Capitalist Individualism", exampleScore: 0.25, summary: "Values individual achievement, material success, and personal freedom through free markets.", type: 'codex', id: 'capitalist_individualism' },
        { icon: "🌍", title: "Ubuntu Ethics", exampleScore: 0.55, summary: "Emphasizes interconnectedness, community well-being, and compassion: 'I am because we are.'", type: 'codex', id: 'ubuntu_ethics' },
        { icon: "🙏", title: "Mystical Devotion (Bhakti)", exampleScore: 0.90, summary: "Values selfless love, surrender to the divine, and spiritual union as the ultimate good.", type: 'codex', id: 'mystical_devotion_bhakti' }
      ],
      archetypalPatterns: [
        { title: "The Achiever", scoreRange: "Aligns with Individualism (approx 0.25)", description: "Values success, personal gain, and tangible accomplishments; self-reliance is key.", icon: "heart" as keyof typeof Icons },
        { title: "The Ethicist", scoreRange: "Aligns with Balanced / Relational (approx 0.55)", description: "Values justice, fairness, human dignity, and ethical principles; seeks balance between individual rights and community needs.", icon: "heart" as keyof typeof Icons },
        { title: "The Mystic Pilgrim", scoreRange: "Aligns with Collectivism (approx 0.90)", description: "Values spiritual growth, transcendence, and connection to the sacred or universal good; often prioritizes collective well-being or service.", icon: "heart" as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "What do you truly value—and how did you come to value it?",
        "What sits at the core of your moral compass?",
        "When individual desires conflict with group needs, which do you prioritize?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests values aligning more with Individualism. Personal well-being, autonomy, freedom, and achievement are likely primary drivers. You may prioritize self-reliance and individual rights.",
        mid: "A mid-range score in Axiology often reflects Balanced or Relational values. You may seek to harmonize individual needs with the well-being of your immediate community or relationships, valuing fairness, mutual respect, and interpersonal connections.",
        high: "A score in this range suggests values aligning more with Collectivism. The well-being of the larger group, social justice, equality, shared responsibilities, and perhaps even transpersonal or sacred values are likely paramount."
      },
      strengthsPlaceholder: "Individualism can foster innovation, self-reliance, and personal responsibility. A Balanced/Relational view promotes strong interpersonal bonds, empathy, and fair compromise. Collectivism can drive large-scale social good, solidarity, and a sense of shared purpose.",
      tensionsPlaceholder: "Tensions can arise between individual freedoms and collective responsibilities, or between personal ambition and the needs of the community. Defining 'the good' can differ vastly between these poles.",
      blindSpotsPlaceholder: "Strong Individualism might overlook systemic inequalities or the importance of community support. Strong Collectivism might undervalue individual dissent or uniqueness. A Balanced view may struggle with prioritizing when individual and collective needs are in direct conflict on a larger scale."
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
      spectrumExplanation: "Mythology spans from a Linear view (emphasizing historical progression, singular truths, and often one-time creation events) to a Cyclical view (emphasizing recurring patterns, eternal return, and interconnected cycles of time and existence). Many find meaning in archetypal patterns that bridge these.",
      spectrumAnchors: ["Linear / Singular", "Psychological / Integrative", "Cyclical / Eternal"],
      exampleWorldviews: [
        { icon: "✝️", title: "Biblical Literalism", exampleScore: 0.10, summary: "Sacred stories are taken as literal historical events and absolute, singular truth.", type: 'codex', id: 'biblical_literalism' },
        { icon: "🧠", title: "Jungian Depth Psychology", exampleScore: 0.60, summary: "Myths are psychological blueprints; stories embody inner archetypes and timeless human processes.", type: 'codex', id: 'jungian_depth_psychology' },
        { icon: "🌌", title: "Mythopoetic Revival", exampleScore: 0.85, summary: "Stories and symbols are living, evolving expressions of universal patterns, connecting to cyclical and eternal truths.", type: 'codex', id: 'mythopoetic_revival' }
      ],
      archetypalPatterns: [
        { title: "The Literalist", scoreRange: "Aligns with Linear / Singular (approx 0.10)", description: "Adheres to tradition; takes stories as concrete reality or historical fact.", icon: 'bookOpen' as keyof typeof Icons },
        { title: "The Psychological Explorer", scoreRange: "Aligns with Psychological / Integrative (approx 0.60)", description: "Sees stories as maps of the soul; seeks meaning beneath the surface, finding universal patterns.", icon: 'bookOpen' as keyof typeof Icons },
        { title: "The Mythic Poet", scoreRange: "Aligns with Cyclical / Eternal (approx 0.85)", description: "Lives in symbolic imagination; finds truth in metaphor, mythic narrative, and recurring cosmic cycles.", icon: 'bookOpen' as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "What core stories or myths (personal, cultural, religious) most shape your understanding of life?",
        "Do you see time and history as primarily linear or cyclical? How does this affect your worldview?",
        "How do you find or create meaning through narrative?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests an alignment with Linear or Singular narratives. You may find meaning in historical accounts, origin stories, and narratives with clear beginnings and unique, unfolding destinies. The truth of a story might be tied to its factual accuracy.",
        mid: "A mid-range score in Mythology indicates a Psychological or Integrative understanding. You likely see stories as rich in symbolic meaning, reflecting universal human patterns, psychological truths, or archetypal journeys, regardless of literal historicity.",
        high: "A score in this range points to an alignment with Cyclical or Eternal narratives. You may perceive time and existence through recurring patterns, seasons, and the idea of eternal return. Stories are seen as expressions of timeless, mythopoetic truths."
      },
      strengthsPlaceholder: "A Linear view can provide a strong sense of direction and historical identity. A Psychological/Integrative view offers deep personal insight and understanding of human nature. A Cyclical/Eternal view fosters an appreciation for natural rhythms, resilience, and enduring symbolic wisdom.",
      tensionsPlaceholder: "Tensions can arise between literal historical accounts and symbolic interpretations, or between a sense of unique destiny (Linear) and the perception of recurring, timeless patterns (Cyclical/Eternal).",
      blindSpotsPlaceholder: "A strong Linear view might overlook recurring themes or symbolic depth. A Psychological view might over-interpret or reduce myths to mere internal states. A strong Cyclical view might underemphasize the significance of unique historical events or individual agency."
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
      spectrumAnchors: ["Mechanistic / Secular", "Interconnected / Organic", "Sacred / Spiritual"],
      exampleWorldviews: [
        { icon: "🧑‍🔬", title: "Scientific Naturalism", exampleScore: 0.10, summary: "The cosmos is a self-organizing, evolving system governed by natural laws, without inherent purpose.", type: 'codex', id: 'scientific_naturalism' },
        { icon: "🌱", title: "Gaia Theory", exampleScore: 0.60, summary: "Earth and its ecosystems are seen as a complex, interconnected living system requiring balance.", type: 'codex', id: 'gaia_theory' },
        { icon: "🌠", title: "Mystical Cosmology", exampleScore: 0.90, summary: "The universe is sacred, purposeful, and animated by spiritual intelligence or divine presence.", type: 'codex', id: 'mystical_cosmology' }
      ],
      archetypalPatterns: [
        { title: "The Mechanist", scoreRange: "Aligns with Mechanistic / Secular (approx 0.10)", description: "Sees the universe as impersonal, governed by discoverable physical laws or chance.", icon: 'globe' as keyof typeof Icons },
        { title: "The Systems Thinker", scoreRange: "Aligns with Interconnected / Organic (approx 0.60)", description: "Recognizes complex interdependence; sees cosmos as a living network or evolving organism.", icon: 'globe' as keyof typeof Icons },
        { title: "The Mystic Cosmologist", scoreRange: "Aligns with Sacred / Spiritual (approx 0.90)", description: "Experiences the universe as a conscious whole, rich with meaning, and potentially guided by a divine or spiritual principle.", icon: 'globe' as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "How do you imagine the universe and your place in it?",
        "Do you perceive the cosmos as primarily material, energetic, or conscious?",
        "What feels most true—is the universe indifferent, purposeful, or a living entity?"
      ],
      whatIfInterpretations: {
        low: "A score in this range suggests an alignment with a Mechanistic or Secular view of the cosmos. You likely see the universe as operating according to physical laws, without inherent spiritual dimensions or an overarching divine purpose. Order arises from natural processes.",
        mid: "A mid-range score in Cosmology indicates an Interconnected or Organic view. You may see the universe as a complex web of relationships and systems, possibly with emergent properties like life and consciousness. There's an appreciation for ecological balance and systemic wholeness.",
        high: "A score in this range points to a Sacred or Spiritual view of the cosmos. You might perceive the universe as a living entity, imbued with spirit, meaning, or a universal consciousness. The cosmos may be seen as divinely created or guided."
      },
      strengthsPlaceholder: "A Mechanistic view excels in scientific analysis and understanding physical laws. An Interconnected/Organic view fosters ecological awareness and systemic thinking. A Sacred/Spiritual view can inspire a profound sense of wonder, reverence, and ethical responsibility towards creation.",
      tensionsPlaceholder: "Tensions can arise between scientific models of a material universe and experiences of a living or conscious cosmos, or between perceived randomness in nature and concepts of divine order or design.",
      blindSpotsPlaceholder: "A strong Mechanistic view might dismiss subjective experiences of cosmic connection or meaning. A strong Sacred/Spiritual view might find it hard to reconcile with aspects of cosmic indifference or suffering that don't fit a benevolent design. An Organic view might struggle with defining agency or purpose in non-sentient systems."
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
      spectrumExplanation: "Teleology spans from a view where purpose is primarily Existential or self-created in a universe without intrinsic goals (score closer to 0.0), to one where purpose is Divinely ordained or inherent in the cosmos (score closer to 1.0). Many find meaning in relational or emergent purposes that bridge these.",
      spectrumAnchors: ["Existential / Self-Created Purpose", "Relational / Emergent Purpose", "Divine / Cosmic Purpose"],
      exampleWorldviews: [
        { icon: "🎲", title: "Existential Nihilism", exampleScore: 0.05, summary: "Life is ultimately without intrinsic meaning; any meaning must be created by the individual.", type: 'codex', id: 'existential_nihilism' },
        { icon: "🏔️", title: "Hero’s Journey (Monomyth)", exampleScore: 0.55, summary: "Purpose emerges through challenge, transformation, and story—meaning is discovered and authored.", type: 'codex', id: 'heros_journey_monomyth' },
        { icon: "🌈", title: "Divine Teleology", exampleScore: 0.95, summary: "Existence is imbued with a higher purpose or destiny—everything unfolds according to a cosmic plan.", type: 'codex', id: 'divine_teleology' }
      ],
      archetypalPatterns: [
        { title: "The Existential Wanderer", scoreRange: "Aligns with Existential / Self-Created (approx 0.05)", description: "Moves through life without certainty or fixed purpose; creates meaning moment by moment.", icon: 'target' as keyof typeof Icons },
        { title: "The Heroic Seeker", scoreRange: "Aligns with Relational / Emergent (approx 0.55)", description: "Finds purpose through growth, challenge, conscious choice, and often in relation to others or a larger community.", icon: 'target' as keyof typeof Icons },
        { title: "The Destiny Believer", scoreRange: "Aligns with Divine / Cosmic (approx 0.95)", description: "Feels guided by a larger plan or spiritual calling; sees purpose in all events and strives to align with it.", icon: 'target' as keyof typeof Icons }
      ],
      reflectionPrompts: [
        "What do you believe is the ultimate purpose of life, if any? Is it discovered or created?",
        "How does this belief guide your choices and sense of meaning?",
        "If you have a sense of purpose, where does it come from?"
      ],
      whatIfInterpretations: {
        low: "A score in this range points to an Existential or Self-Created Purpose. You likely believe that meaning is not inherent but is something individuals must forge for themselves in a universe without intrinsic goals. Freedom and responsibility are key.",
        mid: "A mid-range score in Teleology indicates a Relational or Emergent Purpose. You may find meaning through personal growth, connections with others, contributing to community, fulfilling a perceived potential, or through the unfolding of life's journey.",
        high: "A score in this range suggests an alignment with a Divine or Cosmic Purpose. You likely believe that life has an inherent, pre-ordained meaning or direction, possibly guided by a higher power, spiritual principle, or universal plan."
      },
      strengthsPlaceholder: "An Existential view champions individual freedom, creativity, and responsibility. A Relational/Emergent view fosters strong community ties, adaptability, and meaning in shared human experience. A Divine/Cosmic view can provide profound resilience, a sense of guidance, and comfort in a larger order.",
      tensionsPlaceholder: "Tensions can arise between the burden of total freedom (Existential) and the desire for inherent meaning (Divine), or between individual purpose and a perceived collective or cosmic destiny (Relational).",
      blindSpotsPlaceholder: "A strong Existential view might feel overwhelming without external guidance or a sense of ultimate meaning. A strong Divine/Cosmic view might struggle with ambiguity, suffering, or events that seem to contradict a benevolent plan. A Relational/Emergent view might overlook broader systemic purposes or individual transcendent callings."
    }
  },
};

export const getFacetByName = (name: FacetName): Facet => FACETS[name];
export const DEFAULT_FACET_ICON: React.FC<React.SVGProps<SVGSVGElement>> = IconWrapper(HelpCircle as LucideIcon);

// Ensure placeholder icons for archetypal patterns are valid keys from Icons
const defaultArchetypeIconKey: keyof typeof Icons = "sparkles";
Object.values(FACETS).forEach(facet => {
  if (facet.deepDive.archetypalPatterns) {
    facet.deepDive.archetypalPatterns.forEach(p => {
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
