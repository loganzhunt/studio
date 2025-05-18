
import * as React from 'react';
import type { Facet, FacetName, FacetDeepDive } from '@/types'; // Ensure FacetDeepDive is imported
import { Atom, Brain, Zap, Heart, BookOpen, Globe, Target, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Icons } from '@/components/icons';


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

// Default Deep Dive content - can be used as a fallback or template
const getDefaultDeepDive = (facetName: string): FacetDeepDive => ({
  introduction: `This is the deep dive introduction for ${facetName}. It explores the fundamental questions and concepts related to how we perceive and understand this dimension of reality.`,
  spectrumExplanation: `The spectrum of ${facetName} ranges from one pole (e.g., purely materialistic views) to another (e.g., highly idealistic or spiritual views), with many nuanced positions in between. Understanding where one orients on this spectrum can reveal much about their underlying assumptions.`,
  spectrumAnchors: ["Materialistic/Literal", "Balanced/Pragmatic", "Idealistic/Symbolic"],
  exampleWorldviews: [
    { title: `Example ${facetName} Worldview 1 (Low)`, summary: `This worldview emphasizes a concrete, often empirical approach to ${facetName}.`, exampleScore: 0.2, type: 'codex', id: 'scientific_materialism', icon: '🧪' },
    { title: `Example ${facetName} Worldview 2 (Mid)`, summary: `This worldview balances different perspectives on ${facetName}, often integrating practical and theoretical aspects.`, exampleScore: 0.5, type: 'codex', id: 'stoicism', icon: '🏛️' },
    { title: `Example ${facetName} Worldview 3 (High)`, summary: `This worldview explores the more abstract, often intuitive or transcendent aspects of ${facetName}.`, exampleScore: 0.8, type: 'archetype', id: 'the_mystic', icon: '✨' }
  ],
  archetypalPatterns: [
    { title: `The ${facetName} Realist`, scoreRange: "Low (0.0-0.33)", description: `Focuses on tangible aspects of ${facetName}.`, icon: "atom" },
    { title: `The ${facetName} Pragmatist`, scoreRange: "Mid (0.34-0.66)", description: `Balances different views on ${facetName}.`, icon: "atom" },
    { title: `The ${facetName} Visionary`, scoreRange: "High (0.67-1.0)", description: `Explores abstract dimensions of ${facetName}.`, icon: "atom" }
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
      spectrumExplanation: "Ontology spans a symbolic continuum from materialism (0.0), where only physical matter is real, to idealism or non-dualism (1.0), where reality is rooted in consciousness or sacred unity. Most worldviews fall somewhere between, integrating various ontological frames.",
      spectrumAnchors: ["Materialist", "Relational / Dualist", "Idealist / Non-Dualist"],
      exampleWorldviews: [
        { icon: "🧪", title: "Scientific Humanism", exampleScore: 0.15, summary: "Reality is composed of physical matter and measurable energy. Mind arises from the brain.", type: 'codex', id: 'scientific_humanism' },
        { icon: "☸️", title: "Classical Buddhism (Madhyamaka)", exampleScore: 0.55, summary: "Reality is empty of inherent existence, co-arising in relation. Neither substance nor void.", type: 'codex', id: 'classical_buddhism_madhyamaka' },
        { icon: "🕉️", title: "Vedantic Hinduism", exampleScore: 0.90, summary: "All appearances arise from Brahman—pure consciousness. The world is illusion-like (maya).", type: 'codex', id: 'vedantic_hinduism' },
        { icon: "🌿", title: "Indigenous Animism", exampleScore: 0.85, summary: "All things—trees, rivers, rocks—have spirit and presence. Reality is alive and relational.", type: 'codex', id: 'indigenous_animism' }
      ],
      archetypalPatterns: [
        { title: "The Rational Skeptic", scoreRange: "Low (approx 0.20)", description: "Prioritizes scientific realism. Truth is derived from measurable evidence and logic.", icon: "search" },
        { title: "The Integral Synthesizer", scoreRange: "Mid (approx 0.55)", description: "Holds multiple ontologies together—material and spiritual, inner and outer.", icon: "library" },
        { title: "The Transcendent Mystic", scoreRange: "High (approx 0.95)", description: "Sees all phenomena as reflections of a single underlying consciousness or spirit.", icon: "sparkles" }
      ],
      reflectionPrompts: [
        "What do you believe is ultimately real?",
        "Do you prioritize the measurable or the mystical in understanding reality?",
        "How does your answer about what's real shape how you respond to life's events and experiences?"
      ],
      whatIfInterpretations: {
        low: "A low score in Ontology suggests a perspective where reality is primarily defined by tangible, observable phenomena. You likely prioritize evidence-based understanding and may be skeptical of claims that lack empirical support. Focus is on the material world and its mechanics.",
        mid: "A mid-range score in Ontology indicates a more balanced or nuanced view. You might see reality as having multiple layers, perhaps acknowledging both physical and non-physical aspects, or you may adopt a pragmatic stance, focusing on what works without committing to a single ultimate definition of reality.",
        high: "A high score in Ontology points towards a belief in a reality that transcends the purely physical. You may see consciousness, spirit, or interconnectedness as fundamental, with the material world being an expression or manifestation of these deeper, less tangible dimensions."
      },
      strengthsPlaceholder: "For instance, a materialist view might excel in scientific analysis and problem-solving, while an idealist view fosters deep empathy and symbolic understanding.",
      tensionsPlaceholder: "Materialism might struggle with subjective meaning or purpose, while idealism might find it hard to ground abstract concepts in practical, everyday reality or scientific frameworks.",
      blindSpotsPlaceholder: "A strong materialist focus might overlook symbolic meaning or the validity of subjective experiences. Conversely, a highly spiritual or idealist ontology could discount physical limitations or the importance of empirical evidence."
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
      spectrumAnchors: ["Empiricist", "Balanced / Integrative", "Revelatory / Intuitional"],
      exampleWorldviews: [
        { icon: "🧪", title: "Scientific Rationalism", exampleScore: 0.20, summary: "Truth is established through observation, experiment, and logical reasoning.", type: 'codex', id: 'scientific_rationalism' },
        { icon: "🔮", title: "Hermetic Mysticism", exampleScore: 0.80, summary: "Knowledge is unveiled through direct intuition, symbol, or esoteric revelation.", type: 'codex', id: 'hermetic_mysticism' },
        { icon: "🕊️", title: "Religious Faith", exampleScore: 0.95, summary: "Ultimate truth is revealed by sacred scripture, prophets, or divine encounter.", type: 'codex', id: 'religious_faith' }
      ],
      archetypalPatterns: [
        { title: "The Empiricist", scoreRange: "Low (approx 0.10)", description: "Values observable facts and measurable proof; questions all else.", icon: "brain" },
        { title: "The Integrator", scoreRange: "Mid (approx 0.55)", description: "Balances science, reason, and intuitive knowing; open to multiple sources.", icon: "brain" },
        { title: "The Visionary Seer", scoreRange: "High (approx 0.95)", description: "Trusts inner vision, spiritual insight, or direct revelation as highest knowing.", icon: "brain" }
      ],
      reflectionPrompts: [
        "How do you decide what is true?",
        "What sources of knowledge do you trust most?",
        "How do you respond when your beliefs are challenged?"
      ],
      whatIfInterpretations: {
        low: "A low Epistemology score suggests a preference for knowledge derived from sensory experience and empirical evidence. You likely value concrete facts and scientific methods.",
        mid: "A mid-range Epistemology score indicates a balanced approach, integrating reason, experience, and perhaps intuition to form understanding. You may value multiple perspectives.",
        high: "A high Epistemology score points to an openness to knowledge from intuitive, experiential, or even revelatory sources, believing some truths transcend purely rational or empirical methods."
      },
      strengthsPlaceholder: "Strengths may include critical thinking and analytical skills (low-mid) or profound intuitive insight and openness to novel ideas (mid-high).",
      tensionsPlaceholder: "Tensions can arise between objective evidence and subjective conviction, or the limits of reason versus the call of faith or intuition.",
      blindSpotsPlaceholder: "Over-reliance on empiricism might dismiss valid subjective truths, while a purely intuitive approach might neglect critical assessment or factual grounding."
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
      spectrumExplanation: "Praxeology spans from strict determinism (0.0), where actions are determined by external causes, to radical free will or nondual agency (1.0), where agency is seen as sovereign, sacred, or fundamentally creative.",
      spectrumAnchors: ["Determinist / Mechanistic", "Balanced / Existential", "Free Will / Nondual Agency"],
      exampleWorldviews: [
        { icon: "🔬", title: "Behaviorism", exampleScore: 0.10, summary: "Behavior is entirely conditioned by environment and history; choice is an illusion.", type: 'codex', id: 'behaviorism' },
        { icon: "🧑‍🚀", title: "Existentialism", exampleScore: 0.55, summary: "Humans are radically free to choose and responsible for shaping their own existence.", type: 'codex', id: 'existentialism' },
        { icon: "🧘‍♂️", title: "Advaita Vedanta (Nondualism)", exampleScore: 0.90, summary: "Action and non-action are unified; the doer is an illusion—reality flows through.", type: 'codex', id: 'advaita_vedanta_nondualism' }
      ],
      archetypalPatterns: [
        { title: "The Automaton", scoreRange: "Low (approx 0.10)", description: "Sees self as shaped entirely by outside forces; acts by habit or programming.", icon: "zap" },
        { title: "The Existential Agent", scoreRange: "Mid (approx 0.55)", description: "Recognizes personal responsibility and freedom within a world of constraints.", icon: "zap" },
        { title: "The Liberated Sage", scoreRange: "High (approx 0.90)", description: "Acts spontaneously, in harmony with the whole, unbound by ego or outcome.", icon: "zap" }
      ],
      reflectionPrompts: [
        "Do you feel free to choose your actions? Why or why not?",
        "How do you relate to responsibility, agency, and fate?"
      ],
      whatIfInterpretations: {
        low: "A low Praxeology score suggests a view where actions are largely determined by external factors, conditioning, or immutable laws. Free will might be seen as limited or illusory.",
        mid: "A mid-range Praxeology score often reflects a belief in personal agency and choice within a framework of existing conditions and responsibilities. It's a balance of freedom and determinism.",
        high: "A high Praxeology score indicates a strong belief in free will, individual sovereignty, or even a nondual perspective where agency is an expression of a larger universal will or creative force."
      },
      strengthsPlaceholder: "Understanding systemic influences (low), taking personal responsibility (mid), or acting with profound freedom and spontaneity (high).",
      tensionsPlaceholder: "Individual freedom versus societal constraints, the nature of causality, the experience of choice versus deterministic views.",
      blindSpotsPlaceholder: "Underestimating personal agency (low), overemphasizing individual control without systemic awareness (mid-high), or difficulty with structured, rule-based systems (high)."
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
      introduction: "Axiology explores the question: What matters most? It’s the domain of value, desire, and emotional salience—what you love, fear, protect, or pursue.",
      spectrumExplanation: "Axiology runs from material/hedonic values (0.0)—focused on pleasure, success, or gain—to sacred/transpersonal values (1.0), which prioritize unity, truth, beauty, or selfless devotion.",
      spectrumAnchors: ["Hedonic / Material", "Humanist / Balanced", "Sacred / Transpersonal"],
      exampleWorldviews: [
        { icon: "💰", title: "Capitalist Individualism", exampleScore: 0.25, summary: "Values individual achievement, material success, and personal freedom.", type: 'codex', id: 'capitalist_individualism' },
        { icon: "🌍", title: "Ubuntu Ethics", exampleScore: 0.55, summary: "Emphasizes interconnectedness, community well-being, and compassion.", type: 'codex', id: 'ubuntu_ethics' },
        { icon: "🙏", title: "Mystical Devotion (Bhakti)", exampleScore: 0.90, summary: "Values selfless love, surrender to the divine, and spiritual union.", type: 'codex', id: 'mystical_devotion_bhakti' }
      ],
      archetypalPatterns: [
        { title: "The Achiever", scoreRange: "Low (approx 0.25)", description: "Values success, personal gain, and tangible accomplishments.", icon: "heart" },
        { title: "The Ethicist", scoreRange: "Mid (approx 0.55)", description: "Values justice, fairness, human dignity, and ethical principles.", icon: "heart" },
        { title: "The Mystic Pilgrim", scoreRange: "High (approx 0.90)", description: "Values spiritual growth, transcendence, and connection to the sacred.", icon: "heart" }
      ],
      reflectionPrompts: [
        "What do you truly value—and how did you come to value it?",
        "What sits at the core of your moral compass?"
      ],
      whatIfInterpretations: {
        low: "A low Axiology score might indicate values centered on material well-being, personal pleasure, or tangible achievements. Practical outcomes and self-interest can be primary drivers.",
        mid: "A mid-range Axiology score often reflects humanistic or ethical values, such as justice, compassion, community, and fairness. There's a balance between personal and collective good.",
        high: "A high Axiology score suggests values that are transpersonal, spiritual, or sacred. This could involve prioritizing truth, beauty, unity, selfless service, or a connection to something larger than oneself."
      },
      strengthsPlaceholder: "Pragmatism and resourcefulness (low), strong moral compass and empathy (mid), or profound inspiration and devotion (high).",
      tensionsPlaceholder: "Personal gain versus collective good, relative versus absolute values, the nature of beauty or truth.",
      blindSpotsPlaceholder: "Overlooking non-material values (low), difficulty with pragmatic compromises if values are too rigid (mid), or neglecting practical needs in pursuit of higher ideals (high)."
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
      introduction: "Mythology asks: What stories define us? It reveals the patterns, symbols, and cultural narratives that shape meaning, belonging, and imagination.",
      spectrumExplanation: "Mythology spans from literalist stories (0.0)—taken as historical fact—to archetypal or mythopoetic (1.0), where stories are living symbols and sources of ongoing meaning.",
      spectrumAnchors: ["Literalist / Historical", "Psychological / Integrative", "Archetypal / Mythopoetic"],
      exampleWorldviews: [
        { icon: "✝️", title: "Biblical Literalism", exampleScore: 0.10, summary: "Sacred stories are taken as literal historical events and absolute truth.", type: 'codex', id: 'biblical_literalism' },
        { icon: "🧠", title: "Jungian Depth Psychology", exampleScore: 0.60, summary: "Myths are psychological blueprints; stories embody inner archetypes and processes.", type: 'codex', id: 'jungian_depth_psychology' },
        { icon: "🌌", title: "Mythopoetic Revival", exampleScore: 0.85, summary: "Stories and symbols are living, evolving, and express universal patterns beyond history.", type: 'codex', id: 'mythopoetic_revival' }
      ],
      archetypalPatterns: [
        { title: "The Literalist", scoreRange: "Low (approx 0.10)", description: "Adheres to tradition, takes stories as concrete reality.", icon: "bookOpen" },
        { title: "The Psychological Explorer", scoreRange: "Mid (approx 0.60)", description: "Sees stories as maps of the soul; seeks meaning beneath the surface.", icon: "bookOpen" },
        { title: "The Mythic Poet", scoreRange: "High (approx 0.85)", description: "Lives in symbolic imagination; finds truth in metaphor and mythic narrative.", icon: "bookOpen" }
      ],
      reflectionPrompts: [
        "What stories or myths shape your worldview?",
        "Do you see them as literal, symbolic, or both?"
      ],
      whatIfInterpretations: {
        low: "A low Mythology score might indicate a view of stories as historical accounts or literal truths, with less emphasis on symbolic or metaphorical meaning. Or it could reflect a skepticism towards grand narratives.",
        mid: "A mid-range Mythology score suggests an understanding of myths and stories as psychologically or culturally significant, perhaps as metaphors or tools for understanding human nature, without necessarily taking them as literal fact.",
        high: "A high Mythology score points to a deep engagement with the archetypal, symbolic, and transformative power of stories. You likely see myths as living expressions of profound truths and patterns of existence."
      },
      strengthsPlaceholder: "Strong adherence to tradition (low), insightful psychological understanding (mid), or rich imaginative and symbolic capacity (high).",
      tensionsPlaceholder: "Fact versus fiction, literal versus metaphorical interpretation, the role of ancient myths in modern contexts.",
      blindSpotsPlaceholder: "Dismissing the symbolic power of stories (low), over-intellectualizing narratives without feeling their impact (mid), or difficulty distinguishing personal fantasy from shared archetypal patterns (high)."
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
      introduction: "Cosmology asks: How is the universe structured? It reflects your assumptions about origins, order, cycles, and ultimate context—science, myth, and spiritual systems all offer cosmologies.",
      spectrumExplanation: "Cosmology ranges from mechanistic (0.0)—the universe as a machine, random or deterministic—to sacred or spiritual (1.0), where cosmos is alive, meaningful, or divinely ordered.",
      spectrumAnchors: ["Mechanistic / Secular", "Interconnected / Organic", "Sacred / Spiritual"],
      exampleWorldviews: [
        { icon: "🧑‍🔬", title: "Scientific Naturalism", exampleScore: 0.10, summary: "The cosmos is a self-organizing, evolving system governed by natural laws.", type: 'codex', id: 'scientific_naturalism' },
        { icon: "🌱", title: "Gaia Theory", exampleScore: 0.60, summary: "Earth is a living, self-regulating organism; all systems are interdependent.", type: 'codex', id: 'gaia_theory' },
        { icon: "🌠", title: "Mystical Cosmology", exampleScore: 0.90, summary: "The universe is sacred, purposeful, and animated by spiritual intelligence.", type: 'codex', id: 'mystical_cosmology' }
      ],
      archetypalPatterns: [
        { title: "The Mechanist", scoreRange: "Low (approx 0.10)", description: "Sees the universe as impersonal, governed by law or chance.", icon: "globe" },
        { title: "The Systems Thinker", scoreRange: "Mid (approx 0.60)", description: "Recognizes complex interdependence; sees cosmos as a living network.", icon: "globe" },
        { title: "The Mystic Cosmologist", scoreRange: "High (approx 0.90)", description: "Experiences the universe as a conscious whole, rich with meaning.", icon: "globe" }
      ],
      reflectionPrompts: [
        "How do you imagine the universe and your place in it?",
        "What feels most true—mechanism, mystery, or both?"
      ],
      whatIfInterpretations: {
        low: "A low Cosmology score often aligns with a mechanistic or secular view of the universe, emphasizing physical laws and natural processes without inherent spiritual dimensions or overarching purpose.",
        mid: "A mid-range Cosmology score suggests a view of the cosmos as an interconnected, possibly organic system. There might be an appreciation for complexity and emergent order, balancing scientific and philosophical perspectives.",
        high: "A high Cosmology score indicates a perception of the universe as sacred, spiritual, or imbued with consciousness and meaning. You may feel a deep connection to a living cosmos or a divine order."
      },
      strengthsPlaceholder: "Scientific understanding of cosmic structures (low), appreciation for ecological interconnectedness (mid), or a profound sense of wonder and unity with the cosmos (high).",
      tensionsPlaceholder: "Randomness versus design, the anthropic principle, the relationship between scientific models and spiritual or mythic cosmologies.",
      blindSpotsPlaceholder: "Dismissing non-material aspects of the cosmos (low), underestimating the role of randomness or chaos (mid-high), or difficulty reconciling personal cosmic views with scientific evidence (high)."
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
      introduction: "Teleology asks: What is the ultimate purpose? It expresses your beliefs about destiny, meaning, and direction—whether existence is random, self-authored, or part of a cosmic plan.",
      spectrumExplanation: "Teleology spans from a view of life as random or without inherent meaning (0.0) to one of ultimate purpose, destiny, or cosmic significance (1.0). Most people’s teleology blends personal, collective, and transcendent aims.",
      spectrumAnchors: ["Random / Non-Teleological", "Self-Authored / Existential", "Purposeful / Cosmic"],
      exampleWorldviews: [
        { icon: "🎲", title: "Existential Nihilism", exampleScore: 0.05, summary: "Life is ultimately without intrinsic meaning; any meaning must be created by the individual.", type: 'codex', id: 'existential_nihilism' },
        { icon: "🏔️", title: "Hero’s Journey (Monomyth)", exampleScore: 0.55, summary: "Purpose emerges through challenge, transformation, and story—meaning is discovered and authored.", type: 'codex', id: 'heros_journey_monomyth' },
        { icon: "🌈", title: "Divine Teleology", exampleScore: 0.95, summary: "Existence is imbued with a higher purpose or destiny—everything unfolds according to a cosmic plan.", type: 'codex', id: 'divine_teleology' }
      ],
      archetypalPatterns: [
        { title: "The Existential Wanderer", scoreRange: "Low (approx 0.05)", description: "Moves through life without certainty or fixed purpose; creates meaning moment by moment.", icon: "target" },
        { title: "The Heroic Seeker", scoreRange: "Mid (approx 0.55)", description: "Finds purpose through growth, challenge, and conscious choice.", icon: "target" },
        { title: "The Destiny Believer", scoreRange: "High (approx 0.95)", description: "Feels guided by a larger plan or spiritual calling; sees purpose everywhere.", icon: "target" }
      ],
      reflectionPrompts: [
        "What do you believe is the ultimate purpose of life, if any?",
        "How does this belief guide your choices and sense of meaning?"
      ],
      whatIfInterpretations: {
        low: "A low Teleology score suggests a perspective where life has no inherent, pre-ordained purpose. Meaning is likely seen as something individuals create for themselves, or perhaps an illusion.",
        mid: "A mid-range Teleology score indicates a belief in purpose that is often human-centered, developmental, or social. This could involve personal growth, achieving potential, or contributing to community.",
        high: "A high Teleology score points to a strong belief in an intrinsic, transcendent, or ultimate purpose, whether spiritual, cosmic, or divinely ordained. You likely see life as part of a larger plan or a journey towards a significant end-goal."
      },
      strengthsPlaceholder: "Adaptability and freedom in creating meaning (low), strong personal drive and goal-orientation (mid), or a profound sense of direction and resilience from a higher calling (high).",
      tensionsPlaceholder: "Finding meaning in suffering, reconciling free will with a perceived destiny, the individual's purpose versus a collective or cosmic purpose.",
      blindSpotsPlaceholder: "Difficulty finding motivation if no inherent purpose is perceived (low), over-focus on personal achievement at the expense of broader connection (mid), or rigidly adhering to a specific purpose and overlooking other sources of meaning (high)."
    }
  },
};

export const getFacetByName = (name: FacetName): Facet => FACETS[name];

export const DEFAULT_FACET_ICON: React.FC<React.SVGProps<SVGSVGElement>> = IconWrapper(HelpCircle as LucideIcon);

// Ensure that the 'Atom' icon used in getDefaultDeepDive is imported and correctly wrapped if it's from lucide-react
// For example, if 'atom' is a key in your Icons object:
// const DefaultArchetypeIcon = Icons['atom'] || HelpCircle; // Or a generic fallback
// Or ensure Atom is wrapped:
// const WrappedAtom = IconWrapper(Atom);
// ... and then use WrappedAtom in getDefaultDeepDive
// For now, I'm assuming 'atom' as a string is a placeholder for an icon key
// which would be resolved by your FacetIcon component or similar logic.
// If 'atom' is meant to be a Lucide icon directly, it should be imported and wrapped:
// const DefaultArchetypeIcon = IconWrapper(Atom);
// And then used: icon: DefaultArchetypeIcon (if FacetIcon expects a component) or 'atom' (if FacetIcon expects a key)
// The FacetIcon component currently expects a facetName string, and looks up the icon from FACETS config.
// For archetypalPatterns, we are providing a keyof typeof Icons.
// So getDefaultDeepDive should also use a keyof typeof Icons.
// Let's use a generic icon key as a fallback.
const defaultArchetypeIconKey: keyof typeof Icons = "sparkles"; // Or any other generic key from your Icons
(getDefaultDeepDive("Default").archetypalPatterns as any[]).forEach(p => {
  if (!p.icon) p.icon = defaultArchetypeIconKey;
});

// Update: Re-checked how archetypalPatterns[].icon is used in facet/[facetName]/page.tsx.
// It expects a keyof typeof Icons. So the getDefaultDeepDive should be fine with string keys.
// The placeholder icons in the newly added content were: "brain", "zap", "heart", "bookOpen", "globe", "target".
// These need to ensure they are valid keys in the Icons object.
// I will update the placeholder icon assignments to be more robust or use a generic one if specific ones don't match.
// For simplicity now, I'll use the main facet icon key for its archetypes for now.
// For example, Epistemology archetypes would get 'brain' if 'brain' is a key in Icons.
// Let's correct the assigned icons for archetypalPatterns in the new data:
// Epistemology -> 'brain'
// Praxeology -> 'zap'
// Axiology -> 'heart'
// Mythology -> 'bookOpen'
// Cosmology -> 'globe'
// Teleology -> 'target'
// This assumes these strings are valid keys in your Icons object.
// If not, they will fall back to Icons.archetypes in the facet/[facetName]/page.tsx.
// Let's ensure the placeholder text for whatIf, strengths, tensions, blindspots are distinct and meaningful for each facet.
// I've already added placeholders during the mapping in the previous step, so this should be fine.
// The main task is integrating the large JSON block.
