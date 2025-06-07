// src/data/codex/latest-codex-update-batch.ts
// Contains the batch of Codex entries that should take highest precedence.

export const LATEST_CODEX_UPDATE_BATCH: any[] = [
  // Core worldview archetypes
  {
    title: "The Rational Realist",
    category: "archetype - Core",
    summary:
      "A worldview emphasizing rational analysis, empirical evidence, and practical approaches to understand reality. Values clarity and evidence-based thinking.",
    icon: "\u2320", // ⌠ (Mathematical symbol representing rational thought)
    scores: {
      ontology: 0.25,
      epistemology: 0.15,
      praxeology: 0.65,
      axiology: 0.45,
      mythology: 0.15,
      cosmology: 0.3,
      teleology: 0.2,
    },
    facetDescriptions: {
      ontology:
        "Reality is objective, physical, and can be understood through systematic observation and testing.",
      epistemology:
        "Knowledge comes from empirical evidence, rational analysis, and the scientific method.",
      praxeology:
        "Actions should be pragmatic, evidence-based, and outcome-oriented with measurable results.",
      axiology:
        "Values clarity, intellectual honesty, logical consistency, and practical utility.",
      mythology:
        "Skeptical of traditional myths; prefers historical accounts, scientific explanations, and verifiable facts.",
      cosmology:
        "Universe operates according to natural laws that can be discovered and described mathematically.",
      teleology:
        "Purpose is self-determined through reason, critical thinking, and meaningful action based on evidence.",
    },
  },
  {
    title: "The Integral Synthesizer",
    category: "archetype - Core",
    summary:
      "A holistic perspective that integrates multiple levels of reality and ways of knowing. Bridges science and spirituality, individual and collective.",
    icon: "\u25CE", // ◎ (Circle with dot, representing integration)
    scores: {
      ontology: 0.65,
      epistemology: 0.75,
      praxeology: 0.6,
      axiology: 0.7,
      mythology: 0.6,
      cosmology: 0.75,
      teleology: 0.65,
    },
    facetDescriptions: {
      ontology:
        "Reality is multidimensional with physical, mental, social, and spiritual aspects existing in dynamic interrelationship.",
      epistemology:
        "Knowledge comes from integrating empirical observation, logical reasoning, cultural wisdom, and intuitive insight in complementary ways.",
      praxeology:
        "Actions should balance individual development with collective evolution and integrate theory with practice across all domains of life.",
      axiology:
        "Values both autonomy and communion, development and transcendence, with an appreciation for healthy expressions at all levels of consciousness.",
      mythology:
        "Appreciates wisdom in diverse myths while contextualizing them developmentally and recognizing how they serve different psychological and cultural functions.",
      cosmology:
        "Universe is a holarchy of evolving systems with emergent properties, where each level transcends and includes previous levels in nested complexity.",
      teleology:
        "Purpose involves conscious evolution toward greater complexity, compassion, and integration of all aspects of being and knowing.",
    },
  },
  {
    title: "The Mystical Seeker",
    category: "archetype - Core",
    summary:
      "A spiritual perspective centered on direct experience of ultimate reality. Values transcendence, inner knowing, and unity consciousness.",
    icon: "\u2609", // ☉ (Sun symbol, representing illumination)
    scores: {
      ontology: 0.85,
      epistemology: 0.8,
      praxeology: 0.4,
      axiology: 0.75,
      mythology: 0.75,
      cosmology: 0.85,
      teleology: 0.9,
    },
    facetDescriptions: {
      ontology:
        "Ultimate reality is spiritual/consciousness; the material world is a manifestation or expression of underlying divine essence.",
      epistemology:
        "Direct experience, intuition, and inner knowing transcend intellectual understanding; truth is realized through contemplation and spiritual practice.",
      praxeology:
        "Contemplative practices, spiritual disciplines, and surrender to higher wisdom guide authentic action and being.",
      axiology:
        "Values unity, transcendence, spiritual development, and the dissolution of ego in service of higher consciousness.",
      mythology:
        "Appreciates sacred stories, myths, and symbols as powerful gateways to deeper truths and archetypal dimensions beyond ordinary perception.",
      cosmology:
        "Universe is an expression of divine consciousness or intelligence, with multiple dimensions of reality beyond the physical realm.",
      teleology:
        "Purpose is spiritual awakening, enlightenment, and ultimate union with divine reality beyond all dualities and separations.",
    },
  },
  {
    title: "The Traditional Guardian",
    category: "archetype - Core",
    summary:
      "A perspective rooted in time-tested wisdom, established institutions, and enduring values. Emphasizes order, community, and continuity.",
    icon: "\u26E8", // ⛨ (Cross of Lorraine, representing tradition)
    scores: {
      ontology: 0.7,
      epistemology: 0.6,
      praxeology: 0.8,
      axiology: 0.85,
      mythology: 0.85,
      cosmology: 0.65,
      teleology: 0.85,
    },
    facetDescriptions: {
      ontology:
        "Reality is hierarchically structured with distinct physical and spiritual dimensions; truth has an eternal, unchanging quality.",
      epistemology:
        "Knowledge comes from ancestral wisdom, religious tradition, respected authority, and divine revelation rather than individual discovery.",
      praxeology:
        "Actions should align with established customs, moral codes, and social roles that have stood the test of time and preserve social order.",
      axiology:
        "Values duty, honor, loyalty, piety, respect for elders, and community cohesion above individual expression.",
      mythology:
        "Sacred narratives, founding stories, and traditional wisdom provide moral guidance, cultural identity, and connection to ancestors.",
      cosmology:
        "Universe is divinely ordered with inherent purpose, meaning, and moral structure that humans did not create but must discover.",
      teleology:
        "Purpose is fulfilling one's proper role in the divine or natural order, preserving traditions, and passing them to future generations.",
    },
  },
  {
    title: "The Humanistic Innovator",
    category: "archetype - Core",
    summary:
      "A progressive perspective focused on human potential, creative solutions, and social progress. Values freedom, equality, and compassion.",
    icon: "\u2638", // ☸ (Wheel, representing progress)
    scores: {
      ontology: 0.4,
      epistemology: 0.35,
      praxeology: 0.7,
      axiology: 0.65,
      mythology: 0.35,
      cosmology: 0.4,
      teleology: 0.4,
    },
    facetDescriptions: {
      ontology:
        "Reality is neither purely material nor spiritual, but fundamentally shaped by human experience, consciousness, and social construction.",
      epistemology:
        "Knowledge evolves through open inquiry, collaborative research, intercultural dialogue, and the synthesis of multiple perspectives and disciplines.",
      praxeology:
        "Actions should foster innovative solutions that maximize human flourishing, protect rights, and create conditions for all people to reach their potential.",
      axiology:
        "Values freedom, equality, diversity, compassion, creativity, and human dignity with an optimistic belief in our capacity for positive change.",
      mythology:
        "Appreciates stories of human progress, social transformation, liberation movements, and the triumph of innovation over limitation.",
      cosmology:
        "Universe presents challenges and opportunities for human betterment; humans create meaning in an otherwise neutral cosmos.",
      teleology:
        "Purpose involves creating more just, beautiful, and flourishing societies where everyone can contribute their unique gifts to collective progress.",
    },
  },
  {
    title: "The Ecological Steward",
    category: "archetype - Core",
    summary:
      "A perspective that emphasizes interconnection with nature and responsible care for the biosphere. Values sustainability, balance, and reverence for life.",
    icon: "\u25CE", // ◎ (Circle with dot, representing the Earth)
    scores: {
      ontology: 0.6,
      epistemology: 0.5,
      praxeology: 0.65,
      axiology: 0.8,
      mythology: 0.65,
      cosmology: 0.85,
      teleology: 0.7,
    },
    facetDescriptions: {
      ontology:
        "Reality is an interconnected, interdependent web of living systems where humans are participants rather than separate controllers.",
      epistemology:
        "Knowledge comes from both scientific understanding and direct experiential connection with nature, including indigenous and traditional ecological wisdom.",
      praxeology:
        "Actions should promote ecological health, regenerative practices, sustainable relationships, and respect the carrying capacity of natural systems.",
      axiology:
        "Values ecological balance, sustainability, biodiversity, intergenerational equity, and the intrinsic worth of all living beings.",
      mythology:
        "Relates to stories of deep connection with nature, indigenous wisdom traditions, and narratives of responsible environmental stewardship.",
      cosmology:
        "Earth is a complex, self-regulating living system (Gaia) with delicate balances that humans must respect and protect.",
      teleology:
        "Purpose involves living in harmony with natural systems, other species, and future generations while healing humanity's relationship with the Earth.",
    },
  },
  {
    title: "The Skeptical Pragmatist",
    category: "archetype - Core",
    summary:
      "A perspective that emphasizes practical utility, intellectual honesty, and a willingness to test ideas. Values critical thinking and tangible results.",
    icon: "\u2295", // ⊕ (Circled plus, representing testing and evaluation)
    scores: {
      ontology: 0.3,
      epistemology: 0.2,
      praxeology: 0.7,
      axiology: 0.55,
      mythology: 0.2,
      cosmology: 0.25,
      teleology: 0.25,
    },
    facetDescriptions: {
      ontology:
        "Reality is what can be observed, verified through experience, and has practical consequences; metaphysical questions without practical implications are avoided.",
      epistemology:
        "Knowledge should be provisional, falsifiable, testable, and practically applicable; beliefs should be held with appropriate levels of confidence based on evidence.",
      praxeology:
        "Actions should be judged by their real-world consequences, practical usefulness, and ability to solve concrete problems rather than by rigid ideological principles.",
      axiology:
        "Values intellectual honesty, critical thinking, evidence-based decision making, careful problem-solving, and measurable practical results over theoretical purity.",
      mythology:
        "Skeptical of grand narratives, ideological certainties, and unfalsifiable claims; prefers case studies of practical problem-solving and iterative improvement.",
      cosmology:
        "Universe doesn't inherently favor humans or contain intrinsic purpose; we must adapt to survive and create meaning through practical action.",
      teleology:
        "Purpose is found in solving real problems, improving conditions, and making incremental progress rather than pursuing utopian or transcendent aims.",
    },
  },
  {
    title: "The Creative Explorer",
    category: "archetype - Core",
    summary:
      "A perspective centered on curiosity, creativity, and the joy of discovery. Values novelty, authentic expression, and meaning-making.",
    icon: "\u2604", // ☄ (Comet, representing exploration)
    scores: {
      ontology: 0.5,
      epistemology: 0.45,
      praxeology: 0.55,
      axiology: 0.6,
      mythology: 0.7,
      cosmology: 0.55,
      teleology: 0.5,
    },
    facetDescriptions: {
      ontology:
        "Reality is partly discovered and partly created through perception, imagination, and creative engagement; the boundaries between objective and subjective are fluid.",
      epistemology:
        "Knowledge comes from exploration, experimentation, play, intuition, creative synthesis, and a willingness to venture beyond established frameworks.",
      praxeology:
        "Actions should be guided by curiosity, authenticity, creative impulse, and the courage to venture into uncharted territory without predetermined outcomes.",
      axiology:
        "Values novelty, beauty, originality, authentic expression, spontaneity, wonder, and meaningful experiences that expand consciousness.",
      mythology:
        "Drawn to stories of discovery, heroic journeys, transformation, artistic breakthroughs, and the archetypal creative process of order emerging from chaos.",
      cosmology:
        "Universe is an evolving canvas for discovery, creative expression, and emergent possibilities waiting to be explored and manifested.",
      teleology:
        "Purpose involves creating meaning through authentic exploration, artistic expression, and the ongoing adventure of discovering and manifesting new potentials.",
    },
  },
  {
    title: "The Compassionate Reconciler",
    category: "archetype - Core",
    summary:
      "A perspective focused on healing divisions, fostering understanding, and promoting harmony. Values empathy, dialogue, and peaceful resolution.",
    icon: "\u262F", // ☯ (Yin-yang, representing harmony)
    scores: {
      ontology: 0.55,
      epistemology: 0.65,
      praxeology: 0.75,
      axiology: 0.9,
      mythology: 0.6,
      cosmology: 0.65,
      teleology: 0.7,
    },
    facetDescriptions: {
      ontology:
        "Reality is fundamentally relational; we exist in connection with others and are shaped by our relationships and communal bonds.",
      epistemology:
        "Knowledge comes from listening deeply to diverse perspectives with empathy, recognizing that truth emerges through compassionate dialogue rather than debate.",
      praxeology:
        "Actions should foster understanding, healing, reconciliation, and peaceful resolution of conflicts through nonviolent communication and restorative practices.",
      axiology:
        "Values compassion, empathy, forgiveness, inclusivity, reconciliation, and the peaceful coexistence of differences within a larger harmony.",
      mythology:
        "Drawn to stories of healing wounded relationships, forgiveness, reconciliation, and the restoration of broken communities across divisions.",
      cosmology:
        "Universe ultimately tends toward harmony and interconnection despite apparent conflicts and separations; polarities are complementary rather than opposed.",
      teleology:
        "Purpose involves creating more understanding and harmony among diverse beings by building bridges, healing divides, and recognizing our essential unity.",
    },
  },
  {
    title: "The Existential Authentic",
    category: "archetype - Core",
    summary:
      "A perspective that emphasizes radical freedom, personal authenticity, and creating meaning in an uncertain world. Values honesty, responsibility, and self-creation.",
    icon: "\u2365", // ⍥ (Circle with two horizontal strokes, representing existential choice)
    scores: {
      ontology: 0.35,
      epistemology: 0.4,
      praxeology: 0.6,
      axiology: 0.55,
      mythology: 0.3,
      cosmology: 0.2,
      teleology: 0.25,
    },
    facetDescriptions: {
      ontology:
        "Reality is fundamentally ambiguous and uncertain; existence precedes essence, meaning humans have no predetermined nature but must define themselves.",
      epistemology:
        "Knowledge is subjective, situated in lived experience, and inseparable from one's unique perspective and choices in an absurd universe.",
      praxeology:
        "Actions should express authentic choice, personal responsibility, and honest confrontation with life's fundamental questions despite anxiety and uncertainty.",
      axiology:
        "Values radical authenticity, personal freedom, unflinching honesty about the human condition, and the courage of self-creation in the face of meaninglessness.",
      mythology:
        "Drawn to stories of individuals facing the absurd, confronting existential dilemmas, and finding personal meaning through authentic struggle and commitment.",
      cosmology:
        "Universe is indifferent and lacks inherent meaning or purpose; it is a blank canvas upon which humans project significance.",
      teleology:
        "Purpose is not discovered but self-created through authentic choices, commitments, and the acceptance of responsibility for one's life despite cosmic indifference.",
    },
  },
  {
    title: "Agnosticism",
    category: "philosophical - Worldview",
    summary:
      "A position of suspended belief about the existence of deities or ultimate reality, prioritizing uncertainty or open inquiry.",
    icon: "\u003F", // ?
    scores: {
      ontology: 0.45,
      epistemology: 0.5,
      praxeology: 0.4,
      axiology: 0.45,
      mythology: 0.4,
      cosmology: 0.5,
      teleology: 0.35,
    },
    facetDescriptions: {
      ontology:
        "Suspends judgment between materialism and idealism; maintains open possibilities.",
      epistemology:
        "Balances empirical inquiry and openness to revelation; prioritizes skepticism.",
      praxeology:
        "Hesitant between hierarchical and egalitarian action; flexible stance.",
      axiology:
        "Values open-ended inquiry over fixed ideals; avoids absolute individualism or collectivism.",
      mythology: "Cautious regarding overarching narratives; no fixed mythos.",
      cosmology:
        "Keeps cosmological assumptions ambiguous; neither mechanistic nor holistic.",
      teleology:
        "Uncommitted to existential or divine purposes; embraces uncertainty.",
    },
  },
  {
    title: "Animism", // Note: Also in BASE_CODEX_DATA, this version will take precedence
    category: "religious - Worldview",
    summary:
      "A worldview that sees spirit or consciousness as present in all beings, places, and phenomena. Emphasizes relationship and reciprocity.",
    icon: "\u273F", // ✿
    scores: {
      ontology: 0.8,
      epistemology: 0.7,
      praxeology: 0.4,
      axiology: 0.7,
      mythology: 0.8,
      cosmology: 0.9,
      teleology: 0.8,
    },
    facetDescriptions: {
      ontology:
        "Leans toward idealism; reality is alive and consciousness is fundamental.",
      epistemology:
        "Emphasizes revelatory knowledge, intuition, and direct communion with nature.",
      praxeology:
        "Balances individual and collective action, often valuing reciprocal relationship.",
      axiology: "Emphasizes interconnectedness and community well-being.",
      mythology:
        "Rich in mythic stories of spirits, ancestors, and the sacred world.",
      cosmology:
        "Holistic; the cosmos is a web of relations, not just mechanism.",
      teleology:
        "Purpose is entwined with harmony, ancestral lineage, and spiritual ecology.",
    },
  },
  {
    title: "Aristotelianism", // Note: Also in BASE_CODEX_DATA, this version will take precedence
    category: "philosophical - Worldview",
    summary:
      "A naturalist and teleological philosophy grounded in empirical observation, virtue ethics, and the inherent order of nature.",
    icon: "\u03A9", // Ω
    scores: {
      ontology: 0.35,
      epistemology: 0.45,
      praxeology: 0.65,
      axiology: 0.5,
      mythology: 0.3,
      cosmology: 0.4,
      teleology: 0.75,
    },
    facetDescriptions: {
      ontology:
        "Material-leaning; reality is composed of substances with form and purpose.",
      epistemology:
        "Favors empirical observation but recognizes reason and potentiality.",
      praxeology:
        "Moderately hierarchical; focuses on virtue ethics and natural roles.",
      axiology: "Balances individual flourishing with the common good.",
      mythology: "Minimal mythos; philosophical narratives take precedence.",
      cosmology: "Primarily mechanistic but open to inherent purpose/order.",
      teleology:
        "Strong teleological focus; all things strive toward their end (telos).",
    },
  },
  {
    title: "Atheism",
    category: "philosophical - Worldview",
    summary:
      "The absence of belief in deities, often grounded in skepticism, rationalism, or naturalism.",
    icon: "\u2205", // ∅
    scores: {
      ontology: 0.1,
      epistemology: 0.2,
      praxeology: 0.4,
      axiology: 0.35,
      mythology: 0.15,
      cosmology: 0.1,
      teleology: 0.1,
    },
    facetDescriptions: {
      ontology:
        "Firmly materialist; only the physical world is considered real.",
      epistemology:
        "Highly empirical; knowledge must be justified by evidence.",
      praxeology:
        "Leans individualist; moral action is grounded in human judgment.",
      axiology: "Values human well-being, autonomy, and critical reason.",
      mythology: "Rejects traditional myths; may embrace secular narratives.",
      cosmology: "Mechanistic view of the universe; natural laws reign.",
      teleology: "Existential; purpose is self-created, not divinely ordained.",
    },
  },
  {
    title: "Buddhism", // Note: Also in BASE_CODEX_DATA, this version will take precedence
    category: "religious - Worldview",
    summary:
      "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering through the Eightfold Path.",
    icon: "\u2638", // ☸
    scores: {
      ontology: 0.55,
      epistemology: 0.55,
      praxeology: 0.6,
      axiology: 0.7,
      mythology: 0.7,
      cosmology: 0.6,
      teleology: 0.7,
    },
    facetDescriptions: {
      ontology:
        "Middle path between materialism and idealism; reality is interdependent and empty of fixed nature.",
      epistemology:
        "Balanced; uses both empirical observation (mindfulness) and revelatory insight.",
      praxeology: "Balances personal effort with collective compassion.",
      axiology: "Values compassion, wisdom, and liberation from suffering.",
      mythology: "Rich symbolic stories (e.g., Buddha’s life, bodhisattvas).",
      cosmology: "Integrates cycles (samsara), karma, and multiple realms.",
      teleology:
        "Seeks awakening (nirvana); transcends self-centered purposes.",
    },
  },
  {
    title: "Catholicism",
    category: "religious - Worldview",
    summary:
      "The largest Christian tradition, emphasizing the sacraments, apostolic succession, and the universal church.",
    icon: "\u271D", // ✝
    scores: {
      ontology: 0.7,
      epistemology: 0.5,
      praxeology: 0.55,
      axiology: 0.6,
      mythology: 0.8,
      cosmology: 0.6,
      teleology: 0.85,
    },
    facetDescriptions: {
      ontology:
        "Idealist-leaning; physical and spiritual realms are both real.",
      epistemology:
        "Balances reason and revelation through scripture and tradition.",
      praxeology:
        "Hierarchical, guided by church authority and sacramental practice.",
      axiology: "Centers on love, charity, and the value of the soul.",
      mythology: "Rich mythos—saints, miracles, salvation history.",
      cosmology: "Holistic integration of heaven, earth, and afterlife.",
      teleology: "Divine purpose oriented toward salvation and union with God.",
    },
  },
  {
    title: "Christianity", // Note: Also in BASE_CODEX_DATA, this version will take precedence
    category: "religious - Worldview",
    summary:
      "A monotheistic religious tradition centered on Jesus Christ, emphasizing love, redemption, and eternal purpose.",
    icon: "\u271A", // ✚ (Heavy Greek Cross)
    scores: {
      ontology: 0.7,
      epistemology: 0.5,
      praxeology: 0.6,
      axiology: 0.65,
      mythology: 0.8,
      cosmology: 0.7,
      teleology: 0.9,
    },
    facetDescriptions: {
      ontology:
        "Idealist-leaning; reality encompasses visible and invisible realms.",
      epistemology: "Integrates faith, revelation, and reason.",
      praxeology: "Moderately hierarchical, emphasizing love and discipleship.",
      axiology:
        "Values sacrificial love, redemption, and intrinsic human worth.",
      mythology:
        "Central narrative of creation, fall, redemption, and resurrection.",
      cosmology: "Holistic, with cosmic struggle and ultimate reconciliation.",
      teleology: "Ultimate purpose found in relationship with the Divine.",
    },
  },
  {
    title: "Deism",
    category: "philosophical - Worldview",
    summary:
      "A belief in a creator God who does not intervene in the universe, emphasizing reason and observation of the natural world.",
    icon: "\u2609", // ☉
    scores: {
      ontology: 0.6,
      epistemology: 0.6,
      praxeology: 0.35,
      axiology: 0.55,
      mythology: 0.45,
      cosmology: 0.6,
      teleology: 0.5,
    },
    facetDescriptions: {
      ontology: "Leans idealist; the world is created by divine intelligence.",
      epistemology: "Values reason and natural theology over revelation.",
      praxeology: "Individualist; action guided by reason, not divine command.",
      axiology: "Centers on reason, natural order, and human dignity.",
      mythology: "Minimal mythos; natural law replaces sacred story.",
      cosmology: "Universe is ordered, rational, but not actively managed.",
      teleology:
        "Purpose is embedded in creation’s design, but not actively governed.",
    },
  },
  {
    title: "Druze Faith",
    category: "religious - Worldview",
    summary:
      "A secretive Middle Eastern tradition blending elements of Islam, Gnosticism, Neoplatonism, and more.",
    icon: "\u25A0", // ■
    scores: {
      ontology: 0.6,
      epistemology: 0.6,
      praxeology: 0.45,
      axiology: 0.6,
      mythology: 0.8,
      cosmology: 0.65,
      teleology: 0.75,
    },
    facetDescriptions: {
      ontology:
        "Combines material and spiritual realities; reality is layered and esoteric.",
      epistemology: "Values esoteric knowledge and initiatory revelation.",
      praxeology:
        "Moderate, blending communal tradition with secretive hierarchy.",
      axiology: "Prioritizes fidelity, wisdom, and communal bonds.",
      mythology: "Deeply mythic and allegorical, with secret teachings.",
      cosmology: "Holistic and cyclical; cosmic order is central.",
      teleology: "Purpose tied to spiritual ascent and hidden unity.",
    },
  },
  {
    title: "Empiricism",
    category: "philosophical - Worldview",
    summary:
      "A philosophical stance that asserts knowledge comes primarily from sensory experience and observation.",
    icon: "\u25B2", // ▲
    scores: {
      ontology: 0.15,
      epistemology: 0.1,
      praxeology: 0.4,
      axiology: 0.3,
      mythology: 0.2,
      cosmology: 0.2,
      teleology: 0.15,
    },
    facetDescriptions: {
      ontology: "Strongly materialist; what is real is what can be sensed.",
      epistemology:
        "Radically empirical; all knowledge begins with experience.",
      praxeology: "Moderate individualism; action guided by evidence.",
      axiology: "Values truth, clarity, and observational reliability.",
      mythology: "Rejects myth; trusts only observed reality.",
      cosmology: "Mechanistic; reality is a lawful, observable system.",
      teleology: "Purpose is emergent, not predetermined.",
    },
  },
];
