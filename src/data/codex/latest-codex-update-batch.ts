
// src/data/codex/latest-codex-update-batch.ts
// Contains the batch of Codex entries that should take highest precedence.

export const LATEST_CODEX_UPDATE_BATCH: any[] = [
  {
    "title": "Agnosticism",
    "category": "philosophical - Worldview",
    "summary": "A position of suspended belief about the existence of deities or ultimate reality, prioritizing uncertainty or open inquiry.",
    "icon": "\u003F",  // ?
    "scores": { "ontology": 0.45, "epistemology": 0.50, "praxeology": 0.40, "axiology": 0.45, "mythology": 0.40, "cosmology": 0.50, "teleology": 0.35 },
    "facetDescriptions": { "ontology": "Suspends judgment between materialism and idealism; maintains open possibilities.", "epistemology": "Balances empirical inquiry and openness to revelation; prioritizes skepticism.", "praxeology": "Hesitant between hierarchical and egalitarian action; flexible stance.", "axiology": "Values open-ended inquiry over fixed ideals; avoids absolute individualism or collectivism.", "mythology": "Cautious regarding overarching narratives; no fixed mythos.", "cosmology": "Keeps cosmological assumptions ambiguous; neither mechanistic nor holistic.", "teleology": "Uncommitted to existential or divine purposes; embraces uncertainty." }
  },
  {
    "title": "Animism", // Note: Also in BASE_CODEX_DATA, this version will take precedence
    "category": "religious - Worldview",
    "summary": "A worldview that sees spirit or consciousness as present in all beings, places, and phenomena. Emphasizes relationship and reciprocity.",
    "icon": "\u273F",  // ✿
    "scores": { "ontology": 0.80, "epistemology": 0.70, "praxeology": 0.40, "axiology": 0.70, "mythology": 0.80, "cosmology": 0.90, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Leans toward idealism; reality is alive and consciousness is fundamental.", "epistemology": "Emphasizes revelatory knowledge, intuition, and direct communion with nature.", "praxeology": "Balances individual and collective action, often valuing reciprocal relationship.", "axiology": "Emphasizes interconnectedness and community well-being.", "mythology": "Rich in mythic stories of spirits, ancestors, and the sacred world.", "cosmology": "Holistic; the cosmos is a web of relations, not just mechanism.", "teleology": "Purpose is entwined with harmony, ancestral lineage, and spiritual ecology." }
  },
  {
    "title": "Aristotelianism", // Note: Also in BASE_CODEX_DATA, this version will take precedence
    "category": "philosophical - Worldview",
    "summary": "A naturalist and teleological philosophy grounded in empirical observation, virtue ethics, and the inherent order of nature.",
    "icon": "\u03A9",  // Ω
    "scores": { "ontology": 0.35, "epistemology": 0.45, "praxeology": 0.65, "axiology": 0.50, "mythology": 0.30, "cosmology": 0.40, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Material-leaning; reality is composed of substances with form and purpose.", "epistemology": "Favors empirical observation but recognizes reason and potentiality.", "praxeology": "Moderately hierarchical; focuses on virtue ethics and natural roles.", "axiology": "Balances individual flourishing with the common good.", "mythology": "Minimal mythos; philosophical narratives take precedence.", "cosmology": "Primarily mechanistic but open to inherent purpose/order.", "teleology": "Strong teleological focus; all things strive toward their end (telos)." }
  },
  {
    "title": "Atheism",
    "category": "philosophical - Worldview",
    "summary": "The absence of belief in deities, often grounded in skepticism, rationalism, or naturalism.",
    "icon": "\u2205",  // ∅
    "scores": { "ontology": 0.10, "epistemology": 0.20, "praxeology": 0.40, "axiology": 0.35, "mythology": 0.15, "cosmology": 0.10, "teleology": 0.10 },
    "facetDescriptions": { "ontology": "Firmly materialist; only the physical world is considered real.", "epistemology": "Highly empirical; knowledge must be justified by evidence.", "praxeology": "Leans individualist; moral action is grounded in human judgment.", "axiology": "Values human well-being, autonomy, and critical reason.", "mythology": "Rejects traditional myths; may embrace secular narratives.", "cosmology": "Mechanistic view of the universe; natural laws reign.", "teleology": "Existential; purpose is self-created, not divinely ordained." }
  },
  {
    "title": "Buddhism", // Note: Also in BASE_CODEX_DATA, this version will take precedence
    "category": "religious - Worldview",
    "summary": "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering through the Eightfold Path.",
    "icon": "\u2638",  // ☸
    "scores": { "ontology": 0.55, "epistemology": 0.55, "praxeology": 0.60, "axiology": 0.70, "mythology": 0.70, "cosmology": 0.60, "teleology": 0.70 },
    "facetDescriptions": { "ontology": "Middle path between materialism and idealism; reality is interdependent and empty of fixed nature.", "epistemology": "Balanced; uses both empirical observation (mindfulness) and revelatory insight.", "praxeology": "Balances personal effort with collective compassion.", "axiology": "Values compassion, wisdom, and liberation from suffering.", "mythology": "Rich symbolic stories (e.g., Buddha’s life, bodhisattvas).", "cosmology": "Integrates cycles (samsara), karma, and multiple realms.", "teleology": "Seeks awakening (nirvana); transcends self-centered purposes." }
  },
  {
    "title": "Catholicism",
    "category": "religious - Worldview",
    "summary": "The largest Christian tradition, emphasizing the sacraments, apostolic succession, and the universal church.",
    "icon": "\u271D",  // ✝
    "scores": { "ontology": 0.70, "epistemology": 0.50, "praxeology": 0.55, "axiology": 0.60, "mythology": 0.80, "cosmology": 0.60, "teleology": 0.85 },
    "facetDescriptions": { "ontology": "Idealist-leaning; physical and spiritual realms are both real.", "epistemology": "Balances reason and revelation through scripture and tradition.", "praxeology": "Hierarchical, guided by church authority and sacramental practice.", "axiology": "Centers on love, charity, and the value of the soul.", "mythology": "Rich mythos—saints, miracles, salvation history.", "cosmology": "Holistic integration of heaven, earth, and afterlife.", "teleology": "Divine purpose oriented toward salvation and union with God." }
  },
  {
    "title": "Christianity", // Note: Also in BASE_CODEX_DATA, this version will take precedence
    "category": "religious - Worldview",
    "summary": "A monotheistic religious tradition centered on Jesus Christ, emphasizing love, redemption, and eternal purpose.",
    "icon": "\u271A",  // ✚ (Heavy Greek Cross)
    "scores": { "ontology": 0.70, "epistemology": 0.50, "praxeology": 0.60, "axiology": 0.65, "mythology": 0.80, "cosmology": 0.70, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist-leaning; reality encompasses visible and invisible realms.", "epistemology": "Integrates faith, revelation, and reason.", "praxeology": "Moderately hierarchical, emphasizing love and discipleship.", "axiology": "Values sacrificial love, redemption, and intrinsic human worth.", "mythology": "Central narrative of creation, fall, redemption, and resurrection.", "cosmology": "Holistic, with cosmic struggle and ultimate reconciliation.", "teleology": "Ultimate purpose found in relationship with the Divine." }
  },
  {
    "title": "Deism",
    "category": "philosophical - Worldview",
    "summary": "A belief in a creator God who does not intervene in the universe, emphasizing reason and observation of the natural world.",
    "icon": "\u2609",  // ☉
    "scores": { "ontology": 0.60, "epistemology": 0.60, "praxeology": 0.35, "axiology": 0.55, "mythology": 0.45, "cosmology": 0.60, "teleology": 0.50 },
    "facetDescriptions": { "ontology": "Leans idealist; the world is created by divine intelligence.", "epistemology": "Values reason and natural theology over revelation.", "praxeology": "Individualist; action guided by reason, not divine command.", "axiology": "Centers on reason, natural order, and human dignity.", "mythology": "Minimal mythos; natural law replaces sacred story.", "cosmology": "Universe is ordered, rational, but not actively managed.", "teleology": "Purpose is embedded in creation’s design, but not actively governed." }
  },
  {
    "title": "Druze Faith",
    "category": "religious - Worldview",
    "summary": "A secretive Middle Eastern tradition blending elements of Islam, Gnosticism, Neoplatonism, and more.",
    "icon": "\u25A0",  // ■
    "scores": { "ontology": 0.60, "epistemology": 0.60, "praxeology": 0.45, "axiology": 0.60, "mythology": 0.80, "cosmology": 0.65, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Combines material and spiritual realities; reality is layered and esoteric.", "epistemology": "Values esoteric knowledge and initiatory revelation.", "praxeology": "Moderate, blending communal tradition with secretive hierarchy.", "axiology": "Prioritizes fidelity, wisdom, and communal bonds.", "mythology": "Deeply mythic and allegorical, with secret teachings.", "cosmology": "Holistic and cyclical; cosmic order is central.", "teleology": "Purpose tied to spiritual ascent and hidden unity." }
  },
  {
    "title": "Empiricism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical stance that asserts knowledge comes primarily from sensory experience and observation.",
    "icon": "\u25B2",  // ▲
    "scores": { "ontology": 0.15, "epistemology": 0.10, "praxeology": 0.40, "axiology": 0.30, "mythology": 0.20, "cosmology": 0.20, "teleology": 0.15 },
    "facetDescriptions": { "ontology": "Strongly materialist; what is real is what can be sensed.", "epistemology": "Radically empirical; all knowledge begins with experience.", "praxeology": "Moderate individualism; action guided by evidence.", "axiology": "Values truth, clarity, and observational reliability.", "mythology": "Rejects myth; trusts only observed reality.", "cosmology": "Mechan