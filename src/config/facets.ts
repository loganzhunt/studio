
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
    { title: `The ${facetName} Realist`, scoreRange: "Low (0.0-0.33)", description: `Focuses on tangible aspects of ${facetName}.` },
    { title: `The ${facetName} Pragmatist`, scoreRange: "Mid (0.34-0.66)", description: `Balances different views on ${facetName}.` },
    { title: `The ${facetName} Visionary`, scoreRange: "High (0.67-1.0)", description: `Explores abstract dimensions of ${facetName}.` }
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
        { title: "Scientific Humanism", summary: "Reality is composed of physical matter and measurable energy. Mind arises from the brain.", exampleScore: 0.15, type: 'codex', id: 'humanism', icon: '🧪' },
        { title: "Classical Buddhism (Madhyamaka)", summary: "Reality is empty of inherent existence, co-arising in relation. Neither substance nor void.", exampleScore: 0.55, type: 'codex', id: 'buddhism', icon: '☸️' },
        { title: "Vedantic Hinduism", summary: "All appearances arise from Brahman—pure consciousness. The world is illusion-like (maya).", exampleScore: 0.90, type: 'codex', id: 'hinduism', icon: '🕉️' },
        { title: "Indigenous Animism", summary: "All things—trees, rivers, rocks—have spirit and presence. Reality is alive and relational.", exampleScore: 0.85, type: 'codex', id: 'animism', icon: '🌿' }
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
      strengthsPlaceholder: "For instance, a materialist view might excel in scientific analysis, while an idealist view fosters deep empathy.",
      tensionsPlaceholder: "Materialism might struggle with subjective experience, while idealism might find it hard to ground abstract concepts practically.",
      blindSpotsPlaceholder: "A strong materialist focus might overlook symbolic meaning, while a highly spiritual ontology could discount physical limitations."
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
      introduction: "Epistemology asks: How do we know what we know? It explores the nature of knowledge, justification, and the rationality of belief. This facet examines your primary ways of acquiring and validating knowledge, from empirical observation and logical reasoning to intuition and experiential insight.",
      spectrumExplanation: "The epistemological spectrum spans from strict Empiricism (knowledge comes only from sensory experience) and Rationalism (reason is the chief source) to views that embrace Intuition, Revelation, or Constructivism (knowledge is actively created or culturally relative). Your score indicates your reliance on these different sources and methods of knowing.",
      spectrumAnchors: ["Empiricism/Skepticism", "Rationalism/Logic", "Intuition/Experiential", "Gnosis/Revelation"],
      exampleWorldviews: [
        { title: "Logical Positivism", summary: "Only statements verifiable through direct observation or logical proof are meaningful. Strong emphasis on scientific method.", exampleScore: 0.1, type: 'codex', id: 'empiricism', icon: '🔬' },
        { title: "Kantian Constructivism", summary: "Knowledge is structured by innate categories of mind interacting with sensory data. We know appearances, not things-in-themselves.", exampleScore: 0.5, type: 'codex', id: 'rationalism', icon: '🤔' }, // Placeholder ID
        { title: "Mystical Intuitionism", summary: "True knowledge (gnosis) is attained through direct, intuitive, or mystical insight, often transcending reason or senses.", exampleScore: 0.9, type: 'codex', id: 'gnosticism', icon: '🔮' }
      ],
      archetypalPatterns: [
        { title: "The Investigator", scoreRange: "Low (0.0-0.33)", description: "Relies on evidence, data, and methodical inquiry. Skeptical of claims without proof.", icon: "search"},
        { title: "The Synthesizer", scoreRange: "Mid (0.34-0.66)", description: "Integrates various ways of knowing—reason, experience, and intuition—to form a holistic understanding.", icon: "library"},
        { title: "The Seer", scoreRange: "High (0.67-1.0)", description: "Trusts inner vision, direct experience, and non-rational insights as primary sources of truth.", icon: "eye"}
      ],
      reflectionPrompts: [
        "What sources of information do you trust most, and why?",
        "How do you handle situations where your beliefs are challenged by new evidence or perspectives?",
        "Is there a 'truth' independent of human perception, or is all knowledge contextual?"
      ],
      whatIfInterpretations: {
        low: "A low score in Epistemology suggests a reliance on concrete evidence and empirical data. You likely value scientific methods and may be cautious about claims based on intuition or subjective experience alone.",
        mid: "A mid-range score indicates a balanced approach to knowledge, valuing both empirical evidence and rational thought, perhaps also incorporating personal experience and intuition as valid, albeit potentially secondary, sources.",
        high: "A high score points to an openness to diverse ways of knowing, including intuition, direct experience, or even mystical insight. You might believe that not all truths are accessible through purely rational or empirical means."
      },
      strengthsPlaceholder: "Rigorous analysis and critical thinking, or openness to novel insights and paradigm shifts.",
      tensionsPlaceholder: "Certainty vs. fallibility, balancing objective data with subjective experience.",
      blindSpotsPlaceholder: "Over-reliance on one method (e.g., pure logic) might discount valid experiential knowledge, or vice versa."
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
      introduction: "Praxeology is about the 'how' of human action – our methods, ethics, and decision-making processes. It explores whether actions are guided by outcomes (consequentialism), duties and principles (deontology), character and virtue (virtue ethics), or other frameworks like divine command or natural law.",
      spectrumExplanation: "The praxeological spectrum considers various drivers of action. One end might emphasize pragmatic, results-oriented behavior. The middle could represent adherence to established principles or duties. The other end might focus on spontaneous, intuitive, or virtue-driven action that aligns with inner character or a higher calling.",
      spectrumAnchors: ["Consequentialist/Pragmatic", "Deontological/Principled", "Virtue-Based/Authentic"],
      exampleWorldviews: [
        { title: "Effective Altruism", summary: "Focuses on using evidence and reason to determine the most effective ways to benefit others, prioritizing outcomes.", exampleScore: 0.2, type: 'codex', id: 'humanism', icon: '💡' }, // ID needs to map to a consequentialist system
        { title: "Stoic Ethics", summary: "Moral actions are those done from duty and in accordance with nature and reason, regardless of personal comfort or external outcomes.", exampleScore: 0.5, type: 'codex', id: 'stoicism', icon: '🛡️' },
        { title: "Taoist Wu Wei", summary: "Emphasizes effortless action, or non-coercive action, that aligns spontaneously with the natural flow of the Tao.", exampleScore: 0.8, type: 'codex', id: 'taoism', icon: '🌊' }
      ],
      archetypalPatterns: [
        { title: "The Strategist", scoreRange: "Low (0.0-0.33)", description: "Calculates actions based on achieving desired outcomes and efficiency. Focuses on results.", icon: "settings"},
        { title: "The Law-Abider", scoreRange: "Mid (0.34-0.66)", description: "Adheres to rules, duties, and established moral principles. Values consistency and order.", icon: "scroll-text"},
        { title: "The Virtuoso", scoreRange: "High (0.67-1.0)", description: "Acts from a place of cultivated inner character and integrity. Strives for excellence and authenticity in action.", icon: "sparkles"}
      ],
      reflectionPrompts: [
        "When making a difficult decision, what weighs more heavily: potential outcomes, your principles, or the kind of person you want to be?",
        "Are there universal moral rules, or is ethical action always context-dependent?",
        "How do you balance personal desires with responsibilities to others or a larger community?"
      ],
      whatIfInterpretations: {
        low: "A low score in Praxeology suggests a pragmatic, outcome-oriented approach. You likely prioritize effectiveness and results, making decisions based on what works best to achieve your goals.",
        mid: "A mid-range score indicates a balanced approach to action, likely guided by a combination of principles, duties, and consideration of consequences. You may value fairness and established ethical frameworks.",
        high: "A high score points towards actions driven by inner values, authenticity, or a sense of virtue. You might prioritize acting in alignment with your deepest character or a higher calling, even if it's not the most pragmatic path."
      },
      strengthsPlaceholder: "Effective problem-solving and goal-achievement, or unwavering integrity and principled action.",
      tensionsPlaceholder: "The conflict between achieving a good end versus using questionable means, or individual freedom vs. societal rules.",
      blindSpotsPlaceholder: "A purely results-focus might overlook ethical implications, while strict adherence to rules might miss contextual nuances."
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
      introduction: "Axiology explores what is valuable. It's the philosophical study of value, encompassing ethics (what is good/bad, right/wrong) and aesthetics (what is beautiful/ugly). This facet reflects your core values, what you deem most important, and the source of those values.",
      spectrumExplanation: "Values can range from Hedonistic or Materialistic (valuing pleasure, comfort, possessions) to Humanistic (valuing human flourishing, reason, compassion, social justice) to Transpersonal or Sacred (valuing spiritual realization, connection to the divine, universal love, or ecological harmony). Your score indicates where your primary values lie along this range.",
      spectrumAnchors: ["Material/Hedonic", "Humanistic/Ethical", "Sacred/Transpersonal"],
      exampleWorldviews: [
        { title: "Ethical Hedonism (Classical)", summary: "The pursuit of refined pleasures (ataraxia - peace of mind, aponia - absence of pain) and avoidance of suffering are the highest aims of human life.", exampleScore: 0.2, type: 'codex', id: 'epicureanism', icon: '🍇' },
        { title: "Secular Humanism", summary: "Values human reason, ethics, social justice, and philosophical naturalism, deriving values from human needs and experience rather than divine revelation.", exampleScore: 0.5, type: 'codex', id: 'humanism', icon: '🤝' },
        { title: "Deep Ecology/Pantheism", summary: "The highest value is the well-being and intrinsic worth of all life and the planet itself, often seeing the sacred in nature.", exampleScore: 0.9, type: 'codex', id: 'pantheism', icon: '🌳' }
      ],
      archetypalPatterns: [
        { title: "The Epicure", scoreRange: "Low (0.0-0.33)", description: "Prioritizes personal well-being, comfort, and the enjoyment of sensory or intellectual pleasures.", icon: "gem" }, // Placeholder icon
        { title: "The Advocate", scoreRange: "Mid (0.34-0.66)", description: "Values justice, fairness, compassion, and human dignity. Works for the betterment of society.", icon: "users" },
        { title: "The Saint/Bodhisattva", scoreRange: "High (0.67-1.0)", description: "Dedicated to universal love, selfless service, spiritual liberation, or the sacredness of all existence.", icon: "heart" }
      ],
      reflectionPrompts: [
        "What are the 3-5 things you value most in life? How do these values manifest in your daily choices and actions?",
        "If you had to choose between personal happiness and upholding a core moral principle, which would you prioritize and why?",
        "Where do you believe your deepest values originate from (e.g., culture, reason, experience, spirituality)?"
      ],
      whatIfInterpretations: {
        low: "A low score in Axiology might suggest a focus on practical, material, or personal well-being as primary values. You may prioritize concrete benefits and comforts in life.",
        mid: "A mid-range score often indicates a strong ethical compass rooted in humanistic ideals like justice, fairness, compassion, and reason. You likely value social harmony and the well-being of others.",
        high: "A high score points towards values that transcend the personal or purely material, such as spiritual growth, connection to the sacred, universal love, or dedication to a higher purpose."
      },
      strengthsPlaceholder: "A clear focus on personal well-being and enjoyment, or a deep sense of justice and compassion for others, or a profound connection to spiritual or transcendent values.",
      tensionsPlaceholder: "Personal desires vs. collective well-being, relative vs. absolute moral values, material success vs. spiritual fulfillment.",
      blindSpotsPlaceholder: "Difficulty understanding or appreciating values different from your own, or potentially neglecting one sphere of value (e.g., material needs) due to strong focus on another (e.g., spiritual pursuits)."
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
      introduction: "Mythology explores the foundational stories, symbols, and narratives that shape our understanding of ourselves, our culture, and the cosmos. These aren't just ancient tales; they include the cultural scripts, archetypal patterns, and personal narratives that give meaning, coherence, and direction to our lives.",
      spectrumExplanation: "Perspectives on mythology range from Literalism (myths are historical or factual accounts) to Rational Demystification (myths are primitive explanations superseded by science) to Symbolic/Archetypal interpretation (myths convey timeless psychological, spiritual, or cultural truths encoded in narrative form). Your score reflects your engagement with the power and meaning of these guiding stories.",
      spectrumAnchors: ["Literal/Historical", "Rational/Metaphorical", "Archetypal/Symbolic"],
      exampleWorldviews: [
        { title: "Creationism (Literal)", summary: "Sacred texts describing creation and history are interpreted as literal, factual accounts of past events.", exampleScore: 0.1, type: 'codex', id: 'archetypal_traditionalist', icon: '📖' }, // Example ID
        { title: "Secular Humanism (Myth as Metaphor)", summary: "Myths are seen as cultural artifacts, often metaphorical, but not as literal truth. Scientific narratives are prioritized for explaining reality.", exampleScore: 0.4, type: 'codex', id: 'humanism', icon: '💬' },
        { title: "Jungian Depth Psychology", summary: "Myths and symbols are profound expressions of the collective unconscious, revealing universal archetypes and patterns crucial for psychological integration and meaning.", exampleScore: 0.9, type: 'archetype', id: 'the_alchemist', icon: '🎭' } // Example ID
      ],
      archetypalPatterns: [
        { title: "The Historian/Literalist", scoreRange: "Low (0.0-0.33)", description: "Focuses on the factual accuracy or historical basis of stories. May see myths as records of the past or literal truths.", icon: "scroll-text"},
        { title: "The Storyteller/Analyst", scoreRange: "Mid (0.34-0.66)", description: "Appreciates narratives for their cultural significance, moral lessons, or metaphorical insights, often separating story from literal belief.", icon: "book-open"},
        { title: "The Mythopoet/Dreamer", scoreRange: "High (0.67-1.0)", description: "Engages deeply with the symbolic, archetypal, and transformative power of myths and dreams as windows into deeper realities.", icon: "wand-2"}
      ],
      reflectionPrompts: [
        "What are the most powerful stories or symbols that have shaped your life or worldview? Are they personal, cultural, or religious?",
        "Do you see recurring archetypal patterns (like the hero's journey, the wise old mentor, or the trickster) in your own life or in society?",
        "How do the 'myths' of your culture (e.g., the American Dream, progress through technology) influence your beliefs and actions?"
      ],
      whatIfInterpretations: {
        low: "A low score in Mythology might suggest a preference for literal, factual, or scientific explanations. You may view myths primarily as historical accounts or as stories without deeper, intrinsic truth.",
        mid: "A mid-range score indicates an appreciation for stories and narratives as culturally significant or metaphorically insightful, while perhaps distinguishing between symbolic truth and literal fact.",
        high: "A high score points to a deep engagement with the symbolic, archetypal, and transformative power of myths. You likely see stories as vital for understanding human nature, cultural patterns, and spiritual realities."
      },
      strengthsPlaceholder: "A strong foundation in established narratives, critical analysis of stories, or a rich capacity for symbolic insight and meaning-making.",
      tensionsPlaceholder: "Literal truth vs. metaphorical meaning, traditional narratives vs. individual interpretation, the role of myth in a scientific age.",
      blindSpotsPlaceholder: "Dismissing the symbolic value or psychological power of myths, or conversely, becoming overly attached to one set of narratives to the exclusion of others."
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
      introduction: "Cosmology considers the nature, origin, structure, and ultimate fate of the universe. It addresses questions about the vastness of space and time, our place within it, the fundamental laws that govern it, and whether it possesses inherent order or meaning.",
      spectrumExplanation: "Cosmological views range from purely scientific models (e.g., Big Bang theory, inflationary universe, multiverse hypotheses) that emphasize physical laws and empirical observation, to philosophies of an ordered, intelligent, or living cosmos (e.g., Logos, Tao, Gaia hypothesis), to those positing multiple dimensions, spiritual realities, or a universe imbued with consciousness. Your score indicates your perspective on the universe's nature and our relationship to it.",
      spectrumAnchors: ["Scientific/Mechanistic", "Ordered/Interconnected", "Living/Conscious/Spiritual"],
      exampleWorldviews: [
        { title: "Standard Model Cosmology (Big Bang)", summary: "The universe originated from an extremely hot, dense state and has been expanding and cooling ever since, governed by fundamental physical laws.", exampleScore: 0.2, type: 'codex', id: 'scientific_materialism', icon: '🔭' },
        { title: "Stoic Cosmology", summary: "The cosmos is a single, rational, living being (identified with God or Logos), a divine creative fire that cyclically creates and reabsorbs the universe.", exampleScore: 0.6, type: 'codex', id: 'stoicism', icon: '🌌' },
        { title: "Animistic/Panpsychist Cosmology", summary: "The universe and all its constituents are alive, imbued with spirit or consciousness. Reality is a web of interconnected, sentient beings and forces.", exampleScore: 0.9, type: 'codex', id: 'animism', icon: '🌠' }
      ],
      archetypalPatterns: [
        { title: "The Cosmographer", scoreRange: "Low (0.0-0.33)", description: "Focuses on mapping the physical structure and laws of the universe through scientific observation and mathematical models.", icon: "compass" }, // Placeholder icon
        { title: "The Harmonizer", scoreRange: "Mid (0.34-0.66)", description: "Seeks to understand the interconnectedness and underlying order of the cosmos, often finding patterns and relationships between different scales or systems.", icon: "network"},
        { title: "The Cosmic Mystic", scoreRange: "High (0.67-1.0)", description: "Experiences the universe as a living, conscious, or spiritual entity, often feeling a profound sense of unity or participation with the whole.", icon: "milky-way"} // Placeholder icon
      ],
      reflectionPrompts: [
        "When you contemplate the universe, what feelings or questions arise for you (e.g., awe, insignificance, curiosity, connection)?",
        "Do you believe the universe has an inherent order or intelligence, or is it primarily random and impersonal?",
        "How does your understanding of the cosmos influence your sense of self and your place in the grand scheme of things?"
      ],
      whatIfInterpretations: {
        low: "A low score in Cosmology suggests a view of the universe primarily through a scientific or mechanistic lens. You likely focus on physical laws, empirical evidence, and models that explain its origins and structure without inherent purpose or consciousness.",
        mid: "A mid-range score indicates a perspective that acknowledges the physical universe but may also perceive an underlying order, interconnectedness, or intelligibility. You might see patterns and systems at play, perhaps balancing scientific understanding with philosophical inquiry.",
        high: "A high score points to a cosmology where the universe is seen as living, conscious, spiritual, or deeply interconnected in ways that transcend purely physical explanations. You may feel a strong sense of participation or unity with the cosmos."
      },
      strengthsPlaceholder: "A strong grasp of scientific cosmological models, an ability to perceive intricate patterns and interconnections, or a profound sense of awe and connection with the universe.",
      tensionsPlaceholder: "Randomness vs. order, scientific models vs. spiritual meaning, the anthropic principle, the nature of cosmic origins.",
      blindSpotsPlaceholder: "Overlooking the limitations of current scientific models, dismissing non-material interpretations, or conversely, not grounding cosmic insights in observable reality."
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
      introduction: "Teleology is the study of purpose, ends, or final causes, both in individual human life and potentially in the cosmos as a whole. It asks: Is there an ultimate meaning or goal to existence? If so, what is it, and how do we discover or align with it? Or is purpose something we must create for ourselves?",
      spectrumExplanation: "Teleological views vary widely. One end of the spectrum might include Nihilism (no inherent purpose) or pure Existentialism (purpose is entirely self-created). The middle ground could involve humanistic purposes like flourishing or societal contribution. The other end might posit intrinsic, cosmic, or divinely ordained purposes, such as spiritual evolution, fulfilling a universal plan, or achieving union with a higher reality.",
      spectrumAnchors: ["No Inherent Purpose/Self-Created", "Humanistic/Developmental", "Intrinsic/Spiritual/Cosmic"],
      exampleWorldviews: [
        { title: "Philosophical Nihilism", summary: "Denies the existence of any inherent meaning, purpose, or objective value in the universe or human life. Purpose is an illusion.", exampleScore: 0.1, type: 'codex', id: 'nihilism', icon: '🚫' },
        { title: "Secular Existentialism", summary: "Emphasizes individual freedom and responsibility for creating one's own meaning and purpose in an apparently meaningless or indifferent universe.", exampleScore: 0.3, type: 'codex', id: 'existentialism', icon: '✍️' },
        { title: "Theistic Teleology (e.g., Abrahamic Faiths)", summary: "Posits that human life and the cosmos have a purpose ordained by a divine creator, often involving obedience, spiritual fulfillment, and an ultimate destiny.", exampleScore: 0.9, type: 'codex', id: 'christianity', icon: '🙏' } // Example ID
      ],
      archetypalPatterns: [
        { title: "The Absurdist/Creator", scoreRange: "Low (0.0-0.33)", description: "Finds no inherent purpose but embraces the freedom to create personal meaning or revel in the meaninglessness.", icon: "palette" }, // Placeholder icon
        { title: "The Developer/Achiever", scoreRange: "Mid (0.34-0.66)", description: "Focuses on personal growth, achieving goals, contributing to society, or leaving a legacy as sources of purpose.", icon: "trending-up"},
        { title: "The Pilgrim/Visionary", scoreRange: "High (0.67-1.0)", description: "Seeks to align with a perceived transcendent, spiritual, or cosmic purpose, often involving service, awakening, or transformation.", icon: "mountain-snow"} // Placeholder icon
      ],
      reflectionPrompts: [
        "What gives your life meaning and purpose? Is this something you feel you discovered, created, or was given?",
        "Do you believe there's an ultimate goal or direction for humanity or the universe as a whole? If so, what might it be?",
        "How does your understanding of purpose (or lack thereof) affect your motivation, resilience, and life choices?"
      ],
      whatIfInterpretations: {
        low: "A low score in Teleology suggests a view that life has no inherent, pre-ordained purpose. Meaning is likely seen as something individuals create for themselves, or perhaps an illusion altogether. Focus might be on immediate experience or self-determination.",
        mid: "A mid-range score indicates a belief in purpose that is often human-centered, developmental, or social. This could involve personal growth, achieving potential, contributing to community, or finding meaning through relationships and actions in the world.",
        high: "A high score points to a strong belief in an intrinsic, transcendent, or ultimate purpose, whether spiritual, cosmic, or divinely ordained. You likely see life as part of a larger plan or a journey towards a significant end-goal."
      },
      strengthsPlaceholder: "Freedom to define one's own path and adapt to change, or a strong sense of direction and resilience derived from a clear purpose, or a deep connection to a mission larger than oneself.",
      tensionsPlaceholder: "Finding meaning in suffering, reconciling free will with a perceived destiny, the individual's purpose versus a collective or cosmic purpose.",
      blindSpotsPlaceholder: "Difficulty finding motivation if no inherent purpose is perceived, or rigidly adhering to a specific purpose and overlooking other sources of meaning or new possibilities."
    }
  },
};

export const getFacetByName = (name: FacetName): Facet => FACETS[name];

export const DEFAULT_FACET_ICON: React.FC<React.SVGProps<SVGSVGElement>> = IconWrapper(HelpCircle as LucideIcon);
