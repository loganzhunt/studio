
// src/data/codex/additional-codex-data.ts
// Contains subsequently added batches of Codex entries.

export const ADDITIONAL_CODEX_DATA: any[] = [
  // Batch 1 (Empiricism to Taoism from previous prompts) - Note: Empiricism is also in LATEST_CODEX_UPDATE_BATCH and will be superseded
  // { // This Empiricism entry will be superseded by the one in LATEST_CODEX_UPDATE_BATCH
  //   "name": "Empiricism",
  //   "summary": "A philosophical stance that asserts knowledge comes primarily from sensory experience and observation.",
  //   "facetScores": { "ontology": 0.3, "epistemology": 1.0, "praxeology": 0.7, "axiology": 0.5, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.1 },
  //   "facetSummaries": { "ontology": "Reality is material and can be directly observed.", "epistemology": "All knowledge is derived from sensory input and experiment.", "praxeology": "Actions are guided by outcomes observed in the world.", "axiology": "Values are shaped by what can be empirically verified.", "mythology": "Traditional stories are analyzed for factual accuracy.", "cosmology": "The universe is explained through scientific investigation.", "teleology": "Purpose is considered an emergent or constructed category." }
  // },
  {
    "title": "Epicureanism",
    "category": "philosophical - Worldview",
    "summary": "An ancient philosophy prioritizing the pursuit of pleasure and avoidance of pain through modest living and rational thought.",
    "icon": "\u2698",  // ⚘ (Flower, still appropriate)
    "scores": { "ontology": 0.25, "epistemology": 0.15, "praxeology": 0.40, "axiology": 0.45, "mythology": 0.20, "cosmology": 0.20, "teleology": 0.20 },
    "facetDescriptions": { "ontology": "Materialist-leaning; reality is physical, pleasure and pain are bodily.", "epistemology": "Radically empirical; knowledge from sensation and experience.", "praxeology": "Moderate individualism; seeks personal tranquility and prudence.", "axiology": "Values ataraxia (peace of mind), friendship, and absence of pain.", "mythology": "Minimal mythos; challenges superstitions and fears.", "cosmology": "Mechanistic and naturalistic; no intervention by gods.", "teleology": "Purpose is self-directed happiness, not divine destiny." }
  },
  { // Note: Existentialism is also in BASE_CODEX_DATA, this one from ADDITIONAL_CODEX_DATA might take precedence depending on exact title match
    "title": "Existentialism",
    "category": "philosophical - Worldview",
    "summary": "A modern philosophy focusing on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    "icon": "\u2203",  // ∃ (Logical existential quantifier)
    "scores": { "ontology": 0.30, "epistemology": 0.30, "praxeology": 0.55, "axiology": 0.35, "mythology": 0.25, "cosmology": 0.25, "teleology": 0.05 },
    "facetDescriptions": { "ontology": "Materialist and existential; reality is brute fact, not essence.", "epistemology": "Leans empirical; values personal experience over dogma.", "praxeology": "Emphasizes individual freedom, authenticity, and responsibility.", "axiology": "Values subjective meaning, authenticity, and self-definition.", "mythology": "Skeptical of traditional myths; embraces existential narrative.", "cosmology": "Mechanistic and indifferent; cosmos lacks intrinsic order.", "teleology": "Existential; meaning and purpose are self-created." }
  },
  {
    "title": "Gnosticism",
    "category": "religious - Worldview",
    "summary": "A mystical and dualistic tradition emphasizing secret knowledge (gnosis) and inner spiritual awakening.",
    "icon": "\u25B3",  // ⟁ (White up-pointing triangle)
    "scores": { "ontology": 0.90, "epistemology": 0.80, "praxeology": 0.50, "axiology": 0.60, "mythology": 0.95, "cosmology": 0.75, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Idealist; spiritual reality is primary, material world is shadow.", "epistemology": "Highly revelatory; true knowledge is inner and secret.", "praxeology": "Balancing individual ascent with esoteric community.", "axiology": "Values liberation, spiritual truth, and transcendence.", "mythology": "Rich in cosmological myth and allegory.", "cosmology": "Dualistic; cosmic battle of light and darkness.", "teleology": "Divine purpose is return to the source, spiritual union." }
  },
  {
    "title": "Hinduism",
    "category": "religious - Worldview",
    "summary": "A diverse religious tradition rooted in India, focusing on dharma, karma, reincarnation, and the pursuit of liberation (moksha).",
    "icon": "\u0950",  // ॐ (Om, still appropriate)
    "scores": { "ontology": 0.85, "epistemology": 0.80, "praxeology": 0.50, "axiology": 0.80, "mythology": 0.90, "cosmology": 0.90, "teleology": 0.95 },
    "facetDescriptions": { "ontology": "Idealist; all forms are expressions of ultimate consciousness (Brahman).", "epistemology": "Blends revelatory scripture (Veda) with personal realization.", "praxeology": "Balances individual and communal dharma (duty/ethics).", "axiology": "Values liberation, devotion, and spiritual harmony.", "mythology": "Rich and multi-layered, full of gods, avatars, and epics.", "cosmology": "Holistic and cyclical; creation and dissolution are infinite.", "teleology": "Ultimate purpose is moksha—liberation and union with the divine." }
  },
  {
    "title": "Humanism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical and ethical stance that values human agency, rationality, and well-being, often without reliance on the supernatural.",
    "icon": "\u26A4",  // ⚤ (Interlocked male and female signs)
    "scores": { "ontology": 0.30, "epistemology": 0.20, "praxeology": 0.45, "axiology": 0.45, "mythology": 0.15, "cosmology": 0.20, "teleology": 0.10 },
    "facetDescriptions": { "ontology": "Materialist; reality is human-centered and empirical.", "epistemology": "Leans empirical, values science and critical inquiry.", "praxeology": "Values individual agency and collective progress.", "axiology": "Prioritizes dignity, ethics, and human flourishing.", "mythology": "Rejects supernatural myth; may use secular narratives.", "cosmology": "Mechanistic; universe is knowable and non-personal.", "teleology": "Purpose is human-created and existential." }
  },
  {
    "title": "Islam",
    "category": "religious - Worldview",
    "summary": "A monotheistic Abrahamic faith rooted in the revelation to Muhammad, emphasizing submission to God (Allah) and the unity of creation.",
    "icon": "\u262A",  // ☪ (Star and Crescent, unchanged)
    "scores": { "ontology": 0.70, "epistemology": 0.75, "praxeology": 0.60, "axiology": 0.65, "mythology": 0.80, "cosmology": 0.85, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist; Allah is the ultimate reality, creation is meaningful.", "epistemology": "Strongly revelatory; the Qur’an and prophetic tradition.", "praxeology": "Moderately hierarchical; guided by Sharia and tradition.", "axiology": "Centers on submission, justice, and mercy.", "mythology": "Rich mythos—prophets, angels, creation, judgment.", "cosmology": "Holistic; universe is ordered and purposeful.", "teleology": "Ultimate purpose is to submit to God and attain paradise." }
  },
  {
    "title": "Jainism",
    "category": "religious - Worldview",
    "summary": "An ancient Indian religion emphasizing non-violence (ahimsa), karma, and the liberation of the soul through self-discipline.",
    "icon": "\u534D",  // 卍 (Jain swastika)
    "scores": { "ontology": 0.80, "epistemology": 0.70, "praxeology": 0.45, "axiology": 0.85, "mythology": 0.60, "cosmology": 0.70, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist; consciousness (jiva) is the core of reality.", "epistemology": "Revelatory and experiential; emphasizes inner purity.", "praxeology": "Balance between strict discipline and communal harmony.", "axiology": "Prioritizes non-violence, self-restraint, and compassion.", "mythology": "Stories of tirthankaras and cosmic cycles.", "cosmology": "Cyclical universe with moral causality.", "teleology": "Purpose is spiritual liberation from karma." }
  },
  {
    "title": "Judaism",
    "category": "religious - Worldview",
    "summary": "An ancient monotheistic tradition centered on covenant, law (Torah), and the ongoing relationship between God and the Jewish people.",
    "icon": "\u2721",  // ✡ (Star of David, unchanged)
    "scores": { "ontology": 0.60, "epistemology": 0.70, "praxeology": 0.60, "axiology": 0.65, "mythology": 0.85, "cosmology": 0.75, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Idealist; God is ultimate reality, covenant is foundational.", "epistemology": "Blends revelation (Torah) and communal interpretation.", "praxeology": "Moderate hierarchy; follows halakha (Jewish law).", "axiology": "Values justice, community, and remembrance.", "mythology": "Rich stories—Exodus, prophets, exile, return.", "cosmology": "Holistic, with sacred time and divine order.", "teleology": "Purpose is tikkun olam (repairing the world) and covenantal faithfulness." }
  },
  {
    "title": "Kabbalah",
    "category": "religious - Worldview",
    "summary": "A mystical tradition within Judaism that explores the hidden dimensions of God, creation, and the human soul.",
    "icon": "\u05CE",  // ֎ (Hebrew symbol)
    "scores": { "ontology": 0.80, "epistemology": 0.80, "praxeology": 0.60, "axiology": 0.70, "mythology": 0.90, "cosmology": 0.90, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist and mystical; reality is multi-layered and symbolic.", "epistemology": "Revelatory and esoteric; knowledge through mystical insight.", "praxeology": "Ritual and symbolic acts connect microcosm and macrocosm.", "axiology": "Values spiritual transformation and alignment with divine.", "mythology": "Complex mythos—sefirot, emanations, and cosmic repair.", "cosmology": "Holistic and interwoven; all creation reflects divine order.", "teleology": "Purpose is mystical union and tikkun (healing the world)." }
  },
  {
    "title": "Mahayana Buddhism",
    "category": "religious - Worldview",
    "summary": "A broad Buddhist tradition emphasizing universal compassion, the bodhisattva path, and emptiness (shunyata).",
    "icon": "\u06DE",  // ۞ (Auspicious star symbol)
    "scores": { "ontology": 0.55, "epistemology": 0.55, "praxeology": 0.65, "axiology": 0.80, "mythology": 0.75, "cosmology": 0.70, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Middle way; reality is empty, relational, and compassionate.", "epistemology": "Balances empirical practice and revelatory wisdom.", "praxeology": "Focus on universal compassion (bodhisattva ideal).", "axiology": "Values selflessness, compassion, and liberation for all.", "mythology": "Expansive mythos—Buddhas, bodhisattvas, cosmic Buddhalands.", "cosmology": "Cyclical worlds and realms; interconnectedness.", "teleology": "Purpose is universal awakening (Buddhahood) for all beings." }
  },
  // Batch 2 (Manichaeism to Platonism)
  {
    "title": "Manichaeism",
    "category": "religious - Worldview",
    "summary": "A dualistic religion founded by Mani, teaching the cosmic struggle between light and darkness.",
    "icon": "\u25D2",  // ◒ (Circle with left half black)
    "scores": { "ontology": 0.85, "epistemology": 0.75, "praxeology": 0.45, "axiology": 0.70, "mythology": 0.95, "cosmology": 0.80, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Dualist; reality is split between forces of light and darkness.", "epistemology": "Revelatory; emphasizes revealed, esoteric knowledge.", "praxeology": "Balance of asceticism and communal discipline.", "axiology": "Values purity, spiritual light, and the battle against evil.", "mythology": "Extensive dualistic myths and cosmic history.", "cosmology": "Cosmos is battleground; cyclical battles and restoration.", "teleology": "Purpose is liberation of light/soul from matter/darkness." }
  },
  {
    "title": "Materialism",
    "category": "philosophical - Worldview",
    "summary": "A worldview holding that matter is the fundamental substance of reality and all phenomena can be explained by material interactions.",
    "icon": "\u2B20",  // ⬠ (Solid hexagon)
    "scores": { "ontology": 0.05, "epistemology": 0.10, "praxeology": 0.30, "axiology": 0.20, "mythology": 0.05, "cosmology": 0.15, "teleology": 0.05 },
    "facetDescriptions": { "ontology": "Strongly materialist; only matter and energy are real.", "epistemology": "Empirical; prioritizes observation, science, and reason.", "praxeology": "Leans individualist; values action and progress.", "axiology": "Values tangible achievement, utility, and material well-being.", "mythology": "Low on myth; skeptical of the supernatural.", "cosmology": "Mechanistic universe governed by physical laws.", "teleology": "Existential or pragmatic; no ultimate purpose beyond nature." }
  },
  {
    "title": "Modernism",
    "category": "philosophical - Worldview",
    "summary": "A cultural and philosophical movement prioritizing progress, rationality, and mastery over nature through science and technology.",
    "icon": "\u232C",  // ⌬ (Benzene ring)
    "scores": { "ontology": 0.20, "epistemology": 0.10, "praxeology": 0.35, "axiology": 0.40, "mythology": 0.15, "cosmology": 0.20, "teleology": 0.20 },
    "facetDescriptions": { "ontology": "Primarily materialist but open to progress and innovation.", "epistemology": "Strongly empirical; rationality and science dominate.", "praxeology": "Emphasizes agency, progress, and individual achievement.", "axiology": "Values advancement, mastery, and efficiency.", "mythology": "Skeptical of myth; uses narrative of progress.", "cosmology": "Mechanistic; universe is understandable and improvable.", "teleology": "Purpose is constructed; focus on progress and mastery." }
  },
  { // Note: Mystical Sufism is also in BASE_CODEX_DATA, this one from ADDITIONAL_CODEX_DATA might take precedence
    "title": "Mystical Sufism",
    "category": "religious - Worldview",
    "summary": "A mystical Islamic tradition seeking direct experience of the Divine through love, devotion, and spiritual practice.",
    "icon": "\u262B",  // ☫ (Farsi symbol)
    "scores": { "ontology": 0.90, "epistemology": 0.85, "praxeology": 0.60, "axiology": 0.80, "mythology": 0.90, "cosmology": 0.80, "teleology": 0.95 },
    "facetDescriptions": { "ontology": "Idealist; divine presence pervades all reality.", "epistemology": "Revelatory and experiential; knowledge through love and spiritual practice.", "praxeology": "Balances devotion, discipline, and community.", "axiology": "Values love, surrender, and spiritual intimacy.", "mythology": "Rich poetic and symbolic stories of union.", "cosmology": "Holistic; everything is a mirror of the divine.", "teleology": "Purpose is union with the divine beloved." }
  },
  {
    "title": "Mysticism",
    "category": "religious - Worldview",
    "summary": "A spiritual orientation focused on direct experience of the divine, transcending ordinary perception and dogma.",
    "icon": "\u2727",  // ✧ (Sparkle)
    "scores": { "ontology": 0.85, "epistemology": 0.90, "praxeology": 0.70, "axiology": 0.90, "mythology": 0.80, "cosmology": 0.85, "teleology": 0.95 },
    "facetDescriptions": { "ontology": "Idealist; reality is spiritual and unified.", "epistemology": "Purely revelatory; truth comes from mystical insight.", "praxeology": "Focuses on inner practice, ritual, and contemplation.", "axiology": "Values direct experience, unity, and transcendence.", "mythology": "Uses myth as metaphor for spiritual ascent.", "cosmology": "Holistic; everything points to oneness.", "teleology": "Purpose is direct union with the sacred." }
  },
  {
    "title": "Naturalism",
    "category": "philosophical - Worldview",
    "summary": "A worldview asserting that everything arises from natural properties and causes, excluding supernatural explanations.",
    "icon": "\u2698",  // ⚘ (Flower)
    "scores": { "ontology": 0.10, "epistemology": 0.15, "praxeology": 0.35, "axiology": 0.30, "mythology": 0.10, "cosmology": 0.20, "teleology": 0.10 },
    "facetDescriptions": { "ontology": "Materialist; nature is all that exists.", "epistemology": "Strongly empirical; science is primary.", "praxeology": "Focus on practical action and rational inquiry.", "axiology": "Values knowledge, evidence, and progress.", "mythology": "Minimal; avoids supernatural or mythic explanations.", "cosmology": "Mechanistic and lawful; cosmos is self-organizing.", "teleology": "Existential; purpose is self-defined, not transcendent." }
  },
  {
    "title": "Neoplatonism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical tradition teaching that all reality emanates from a single source (the One), emphasizing spiritual ascent.",
    "icon": "\u29BE",  // ⦾ (Circled white bullet)
    "scores": { "ontology": 0.90, "epistemology": 0.80, "praxeology": 0.55, "axiology": 0.75, "mythology": 0.85, "cosmology": 0.90, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist; all things emanate from the One.", "epistemology": "Revelatory; knowledge through contemplation and hierarchy.", "praxeology": "Ascent through disciplines, ethics, and community.", "axiology": "Values ascent, contemplation, and the Good.", "mythology": "Uses myth and allegory for spiritual teaching.", "cosmology": "Holistic; cosmos is hierarchical and interrelated.", "teleology": "Ultimate purpose is return to unity with the One." }
  },
  {
    "title": "Nihilism",
    "category": "philosophical - Worldview",
    "summary": "A worldview that rejects inherent meaning, purpose, or value in life, often as a response to the collapse of previous certainties.",
    "icon": "\u25CC",  // ◌ (Dotted circle)
    "scores": { "ontology": 0.10, "epistemology": 0.10, "praxeology": 0.15, "axiology": 0.05, "mythology": 0.00, "cosmology": 0.05, "teleology": 0.00 },
    "facetDescriptions": { "ontology": "Materialist or skeptical; denies higher realities.", "epistemology": "Empirical, skeptical of all dogmas and certainty.", "praxeology": "Often non-committal or individualistic; can be passive.", "axiology": "No ultimate values or sources of meaning.", "mythology": "Absence of narrative; skeptical of myth.", "cosmology": "Mechanistic or arbitrary; cosmos lacks intrinsic order.", "teleology": "No ultimate purpose; existential indifference." }
  },
  {
    "title": "Panpsychism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical view that consciousness or mind is a fundamental and ubiquitous aspect of reality.",
    "icon": "\u2738",  // ✸ (Eight pointed star)
    "scores": { "ontology": 0.65, "epistemology": 0.50, "praxeology": 0.45, "axiology": 0.50, "mythology": 0.55, "cosmology": 0.60, "teleology": 0.55 },
    "facetDescriptions": { "ontology": "Relational/idealist; all things possess some degree of mind or experience.", "epistemology": "Balances empirical and revelatory approaches.", "praxeology": "Focus on holistic and respectful engagement with the world.", "axiology": "Values interconnectedness, diversity, and awareness.", "mythology": "Uses narrative to bridge science and spirit.", "cosmology": "Holistic; universe is alive and sentient at all levels.", "teleology": "Purpose is evolving self-awareness and participation in reality." }
  },
  {
    "title": "Pantheism",
    "category": "philosophical - Worldview",
    "summary": "A doctrine identifying the universe itself with the divine—God is all, and all is God.",
    "icon": "\u273A",  // ✺ (Twelve pointed star)
    "scores": { "ontology": 0.95, "epistemology": 0.70, "praxeology": 0.55, "axiology": 0.80, "mythology": 0.85, "cosmology": 0.95, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist; the universe and the divine are identical.", "epistemology": "Revelatory; intuition and holistic insight are valued.", "praxeology": "Holistic; harmonious engagement with all things.", "axiology": "Values sacredness of nature, unity, and belonging.", "mythology": "Uses cosmic myths of unity and creation.", "cosmology": "Holistic; universe is divine order and process.", "teleology": "Purpose is realization and celebration of divine unity." }
  },
  { // Note: Platonism is also in BASE_CODEX_DATA, this one from ADDITIONAL_CODEX_DATA might take precedence
    "title": "Platonism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical tradition centered on transcendent forms and the pursuit of the Good. Emphasizes reason, idealism, and the distinction between appearances and true reality.",
    "icon": "\u03A6",  // Φ (Greek capital letter phi)
    "scores": { "ontology": 0.90, "epistemology": 0.80, "praxeology": 0.45, "axiology": 0.65, "mythology": 0.70, "cosmology": 0.80, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Idealist; reality is grounded in transcendent forms.", "epistemology": "Rationalist; knowledge through dialectic, contemplation.", "praxeology": "Emphasizes virtue, alignment with the Good.", "axiology": "Values truth, beauty, and harmony.", "mythology": "Allegories and myths point to metaphysical truths.", "cosmology": "Orderly, rational cosmos shaped by ideal patterns.", "teleology": "Purpose is ascent toward the Good and intellectual/spiritual perfection." }
  },
  // Batch 3 (Postmodernism to Shinto)
  {
    "title": "Postmodernism",
    "category": "philosophical - Worldview",
    "summary": "A skeptical and critical orientation challenging grand narratives, objectivity, and stable meaning.",
    "icon": "\u2307",  // ⌇ (Wavy line)
    "scores": { "ontology": 0.30, "epistemology": 0.70, "praxeology": 0.45, "axiology": 0.35, "mythology": 0.50, "cosmology": 0.30, "teleology": 0.30 },
    "facetDescriptions": { "ontology": "Fluid; reality is constructed, not fixed.", "epistemology": "Relativist; knowledge is context-dependent.", "praxeology": "Critical, open-ended, often egalitarian.", "axiology": "Values diversity, pluralism, critique of authority.", "mythology": "Deconstructs grand narratives and meta-myths.", "cosmology": "Rejects fixed cosmic order; emphasizes contingency.", "teleology": "Purpose is provisional, self-chosen, or ironic." }
  },
  {
    "title": "Process Philosophy",
    "category": "philosophical - Worldview",
    "summary": "A metaphysical approach emphasizing becoming, change, and relationality as more fundamental than substance.",
    "icon": "\u2942",  // ⥂ (Rightwards arrow with loop)
    "scores": { "ontology": 0.65, "epistemology": 0.55, "praxeology": 0.50, "axiology": 0.60, "mythology": 0.60, "cosmology": 0.70, "teleology": 0.65 },
    "facetDescriptions": { "ontology": "Relational; process and change are fundamental.", "epistemology": "Dynamic blend of empirical and intuitive insight.", "praxeology": "Emphasizes adaptation and interconnected action.", "axiology": "Values creativity, novelty, mutuality.", "mythology": "Narratives of evolution, emergence, and transformation.", "cosmology": "Holistic; universe as an unfolding process.", "teleology": "Purpose evolves in dynamic, co-creative fashion." }
  },
  {
    "title": "Quakerism",
    "category": "religious - Worldview",
    "summary": "A Christian tradition emphasizing direct inner experience, simplicity, pacifism, and equality.",
    "icon": "\u26AD",  // ⚭ (Marriage symbol)
    "scores": { "ontology": 0.45, "epistemology": 0.65, "praxeology": 0.65, "axiology": 0.80, "mythology": 0.55, "cosmology": 0.50, "teleology": 0.65 },
    "facetDescriptions": { "ontology": "Balanced; recognizes both inner light and outward world.", "epistemology": "Revelatory; truth comes from inner experience.", "praxeology": "Egalitarian, pacifist, consensus-based.", "axiology": "Values simplicity, peace, justice, equality.", "mythology": "Focuses on testimony and lived story over dogma.", "cosmology": "Holistic; sees spirit at work in the world.", "teleology": "Purpose is living in accord with inner light and community." }
  },
  {
    "title": "Rationalism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical approach emphasizing reason and logic as the primary source of knowledge.",
    "icon": "\u222B",  // ∫ (Integral)
    "scores": { "ontology": 0.30, "epistemology": 0.05, "praxeology": 0.35, "axiology": 0.45, "mythology": 0.20, "cosmology": 0.30, "teleology": 0.25 },
    "facetDescriptions": { "ontology": "Materialist or dualist; world apprehended through intellect.", "epistemology": "Rational; reason is the supreme guide.", "praxeology": "Analytical, often individualist.", "axiology": "Values truth, coherence, clarity.", "mythology": "Skeptical of myth; values philosophical allegory.", "cosmology": "Universe as an ordered, rational structure.", "teleology": "Purpose is intellectual mastery or comprehension." }
  },
  {
    "title": "Romanticism",
    "category": "custom - Worldview",
    "summary": "A cultural and philosophical movement emphasizing emotion, nature, and the creative imagination.",
    "icon": "\u10E6",  // ღ (Heart, poetic/romantic)
    "scores": { "ontology": 0.50, "epistemology": 0.60, "praxeology": 0.60, "axiology": 0.75, "mythology": 0.70, "cosmology": 0.60, "teleology": 0.60 },
    "facetDescriptions": { "ontology": "Relational; reality is infused with emotion and spirit.", "epistemology": "Valued intuition, imagination, and subjective experience.", "praxeology": "Creative, expressive, and often rebellious.", "axiology": "Values beauty, authenticity, emotion.", "mythology": "Rich in legend, poetic myth, and symbolism.", "cosmology": "Nature as living, mysterious, and sublime.", "teleology": "Purpose is self-realization and creative fulfillment." }
  },
  {
    "title": "Rosicrucianism",
    "category": "religious - Worldview",
    "summary": "A Western esoteric movement blending alchemy, mysticism, and the pursuit of hidden wisdom.",
    "icon": "\u2720",  // ✠ (Maltese cross)
    "scores": { "ontology": 0.75, "epistemology": 0.85, "praxeology": 0.50, "axiology": 0.75, "mythology": 0.80, "cosmology": 0.80, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Idealist; spirit is primary, matter as transformation.", "epistemology": "Revelatory; wisdom through mystical insight and symbolism.", "praxeology": "Ritual, discipline, and initiatory practice.", "axiology": "Values wisdom, purity, transformation.", "mythology": "Alchemy, spiritual journeys, symbolic stories.", "cosmology": "Esoteric; cosmos as layered and mysterious.", "teleology": "Purpose is spiritual ascent and universal harmony." }
  },
  {
    "title": "Scientific Materialism",
    "category": "philosophical - Worldview",
    "summary": "A worldview grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    "icon": "\u23DA",  // ⏚ (Earth ground)
    "scores": { "ontology": 0.05, "epistemology": 0.05, "praxeology": 0.35, "axiology": 0.20, "mythology": 0.05, "cosmology": 0.10, "teleology": 0.05 },
    "facetDescriptions": { "ontology": "Strong materialism; everything is reducible to matter.", "epistemology": "Empirical; only verifiable facts count.", "praxeology": "Applied, rational, technologically oriented.", "axiology": "Values scientific progress, truth, skepticism.", "mythology": "Myth seen as narrative, not truth.", "cosmology": "Mechanistic, governed by physical law.", "teleology": "No transcendent purpose; focus on scientific mastery." }
  },
  {
    "title": "Secular Humanism",
    "category": "philosophical - Worldview",
    "summary": "A worldview prioritizing human welfare, ethics, and rationality without reference to the supernatural.",
    "icon": "\u26A4",  // ⚤ (Interlocked male and female signs)
    "scores": { "ontology": 0.20, "epistemology": 0.15, "praxeology": 0.55, "axiology": 0.65, "mythology": 0.20, "cosmology": 0.20, "teleology": 0.20 },
    "facetDescriptions": { "ontology": "Naturalist; humanity as part of the natural world.", "epistemology": "Rational and empirical; skeptical of revelation.", "praxeology": "Human-centered; values agency, education, and progress.", "axiology": "Values dignity, autonomy, and human flourishing.", "mythology": "Appreciates myth for metaphor, not literal truth.", "cosmology": "Materialist; universe explained by science.", "teleology": "Purpose is self-chosen, human welfare." }
  },
  {
    "title": "Shamanism",
    "category": "religious - Worldview",
    "summary": "A range of animistic traditions emphasizing the healer’s journey between worlds for wisdom and transformation.",
    "icon": "\u269A",  // ⚚ (Staff of Hermes)
    "scores": { "ontology": 0.75, "epistemology": 0.85, "praxeology": 0.60, "axiology": 0.75, "mythology": 0.85, "cosmology": 0.90, "teleology": 0.85 },
    "facetDescriptions": { "ontology": "Spirit-infused; all things are alive and interconnected.", "epistemology": "Experiential and revelatory; knowledge gained through journeying.", "praxeology": "Healer’s path; transformative rituals and acts.", "axiology": "Values harmony, healing, and respect for all life.", "mythology": "Rich tradition of cosmological journeys and stories.", "cosmology": "Holistic; layered worlds and energies.", "teleology": "Purpose is maintaining balance, harmony, and transformation." }
  },
  {
    "title": "Shinto",
    "category": "religious - Worldview",
    "summary": "The indigenous spirituality of Japan, centering on reverence for kami (spirits) in nature and ancestral tradition.",
    "icon": "\u273E",  // ✾ (Six petalled florette)
    "scores": { "ontology": 0.75, "epistemology": 0.70, "praxeology": 0.60, "axiology": 0.70, "mythology": 0.80, "cosmology": 0.80, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Animist; reality is alive with kami (spirits).", "epistemology": "Tradition and direct, ritual experience.", "praxeology": "Community ritual, respect, seasonal celebration.", "axiology": "Values purity, harmony, gratitude, and nature.", "mythology": "Myths of the kami, creation, and ancestors.", "cosmology": "Nature-based; world as sacred landscape.", "teleology": "Purpose is living in accord with nature and ancestors." }
  },
  // Batch 4 (Sikhism to Zoroastrianism)
  {
    "title": "Sikhism",
    "category": "religious - Worldview",
    "summary": "A monotheistic Indian religion founded by Guru Nanak, teaching devotion, equality, and service.",
    "icon": "\u262C",  // ☬ (Khanda)
    "scores": { "ontology": 0.65, "epistemology": 0.65, "praxeology": 0.75, "axiology": 0.85, "mythology": 0.70, "cosmology": 0.65, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Unified; one transcendent reality, present in all.", "epistemology": "Revelatory and devotional; knowledge through scripture and experience.", "praxeology": "Service (seva), equality, honest living.", "axiology": "Values compassion, justice, humility.", "mythology": "Stories of gurus and martyrs, unity of faith.", "cosmology": "Creation as divine manifestation.", "teleology": "Purpose is union with the Divine through devotion and service." }
  },
  {
    "title": "Stoicism",
    "category": "philosophical - Worldview",
    "summary": "A philosophy of rational resilience and self-mastery, emphasizing the cultivation of virtue and acceptance of nature.",
    "icon": "\u221D",  // ∝ (Proportional to)
    "scores": { "ontology": 0.30, "epistemology": 0.20, "praxeology": 0.65, "axiology": 0.75, "mythology": 0.30, "cosmology": 0.40, "teleology": 0.30 },
    "facetDescriptions": { "ontology": "Materialist or dualist; reason is part of nature.", "epistemology": "Reasoned reflection; self-examination.", "praxeology": "Virtuous action, self-control, resilience.", "axiology": "Values wisdom, virtue, equanimity.", "mythology": "Draws from Greco-Roman myths for exemplars.", "cosmology": "Universe as rational, ordered whole.", "teleology": "Purpose is to live in harmony with nature and reason." }
  },
  {
    "title": "Sufism",
    "category": "religious - Worldview",
    "summary": "The mystical dimension of Islam, focusing on direct experience of God through love and devotion.",
    "icon": "\u06E9",  // ۩ (Place of sajdah)
    "scores": { "ontology": 0.80, "epistemology": 0.90, "praxeology": 0.70, "axiology": 0.90, "mythology": 0.80, "cosmology": 0.80, "teleology": 0.95 },
    "facetDescriptions": { "ontology": "Unity of all being; Divine presence in all.", "epistemology": "Revelatory; knowledge through love, poetry, and ecstatic practice.", "praxeology": "Devotional acts, dance, and ritual.", "axiology": "Values love, compassion, annihilation of ego.", "mythology": "Stories of saints, union with the Beloved.", "cosmology": "Cosmic love and unity.", "teleology": "Purpose is union with God, annihilation in Divine." }
  },
  {
    "title": "Taoism",
    "category": "religious - Worldview",
    "summary": "A spiritual tradition rooted in the Tao, the ineffable source of all. Emphasizes harmony, non-action, and flowing with nature.",
    "icon": "\u2635",  // ☵ (I Ching trigram for water)
    "scores": { "ontology": 0.70, "epistemology": 0.70, "praxeology": 0.60, "axiology": 0.65, "mythology": 0.70, "cosmology": 0.85, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Relational; Tao as underlying reality.", "epistemology": "Intuitive, mystical, natural wisdom.", "praxeology": "Wu-wei (non-action), living in flow.", "axiology": "Values harmony, humility, spontaneity.", "mythology": "Taoist classics, mythic immortals, cosmic cycles.", "cosmology": "Natural cycles, yin-yang balance.", "teleology": "Purpose is attunement to Tao, spiritual immortality." }
  },
  {
    "title": "Theosophy",
    "category": "religious - Worldview",
    "summary": "A mystical movement synthesizing Eastern and Western traditions, teaching spiritual evolution, karma, and hidden wisdom.",
    "icon": "\u25EC",  // ◬ (Triangle with dot)
    "scores": { "ontology": 0.80, "epistemology": 0.80, "praxeology": 0.55, "axiology": 0.80, "mythology": 0.85, "cosmology": 0.80, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Spiritualist; multi-layered worlds, hidden realities.", "epistemology": "Esoteric; knowledge through study and inner revelation.", "praxeology": "Initiatory, service, meditation.", "axiology": "Values evolution, spiritual growth, altruism.", "mythology": "Synthesis of East and West, cosmic myth.", "cosmology": "Emanations, cosmic cycles, hidden laws.", "teleology": "Purpose is spiritual evolution and unity." }
  },
  {
    "title": "Theravada Buddhism",
    "category": "religious - Worldview",
    "summary": "The earliest form of Buddhism, emphasizing individual enlightenment through ethical conduct, meditation, and insight.",
    "icon": "\u29BF",  // ⦿ (Circled bullet)
    "scores": { "ontology": 0.45, "epistemology": 0.55, "praxeology": 0.60, "axiology": 0.65, "mythology": 0.60, "cosmology": 0.50, "teleology": 0.65 },
    "facetDescriptions": { "ontology": "Emptiness, impermanence, conditioned arising.", "epistemology": "Direct meditative insight (vipassana).", "praxeology": "Eightfold Path, monastic discipline.", "axiology": "Values non-harm, equanimity, clarity.", "mythology": "Stories of Buddha and arahants.", "cosmology": "Cycle of samsara, karma, and rebirth.", "teleology": "Purpose is liberation (nirvana)." }
  },
  {
    "title": "Transcendentalism",
    "category": "philosophical - Worldview",
    "summary": "A 19th-century American movement emphasizing the inherent goodness of people and nature, and the primacy of intuition.",
    "icon": "\u2732",  // ✲ (Open center asterisk)
    "scores": { "ontology": 0.65, "epistemology": 0.70, "praxeology": 0.60, "axiology": 0.75, "mythology": 0.65, "cosmology": 0.65, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Nature is infused with spirit; all is interconnected.", "epistemology": "Intuitive, individual revelation.", "praxeology": "Self-reliance, living simply and authentically.", "axiology": "Values self-trust, harmony with nature, idealism.", "mythology": "Nature and individual as sacred symbols.", "cosmology": "Unity of all beings, nature as expression of spirit.", "teleology": "Purpose is self-realization and communion with nature." }
  },
  {
    "title": "Transhumanism",
    "category": "philosophical - Worldview",
    "summary": "A movement advocating for transforming the human condition via advanced technology, reason, and science.",
    "icon": "\u238B",  // ⎋ (Broken circle with northwest arrow)
    "scores": { "ontology": 0.15, "epistemology": 0.15, "praxeology": 0.80, "axiology": 0.70, "mythology": 0.30, "cosmology": 0.30, "teleology": 0.20 },
    "facetDescriptions": { "ontology": "Materialist; reality as programmable, upgradable.", "epistemology": "Empirical, scientific, technophilic.", "praxeology": "Innovation, adaptation, enhancement.", "axiology": "Values progress, autonomy, mastery.", "mythology": "Futurist, technological utopias.", "cosmology": "Universe as modifiable, open-ended.", "teleology": "Purpose is transcendence of limitation, self-evolution." }
  },
  {
    "title": "Unitarian Universalism",
    "category": "religious - Worldview",
    "summary": "A pluralistic faith embracing wisdom from all traditions and affirming freedom of belief and conscience.",
    "icon": "\u222A",  // ∪ (Union symbol)
    "scores": { "ontology": 0.50, "epistemology": 0.65, "praxeology": 0.65, "axiology": 0.80, "mythology": 0.65, "cosmology": 0.60, "teleology": 0.65 },
    "facetDescriptions": { "ontology": "Pluralist; embraces many metaphysical views.", "epistemology": "Open, dialogical, eclectic.", "praxeology": "Inclusive, community-oriented.", "axiology": "Values freedom, dignity, compassion.", "mythology": "Draws from many religious and philosophical stories.", "cosmology": "Cosmos as diverse and evolving.", "teleology": "Purpose is to seek truth and meaning freely." }
  },
  {
    "title": "Vedanta",
    "category": "religious - Worldview",
    "summary": "A major school of Hindu philosophy teaching the unity of Atman (self) and Brahman (absolute reality).",
    "icon": "\u0905",  // अ (Devanagari A)
    "scores": { "ontology": 0.95, "epistemology": 0.85, "praxeology": 0.65, "axiology": 0.80, "mythology": 0.80, "cosmology": 0.90, "teleology": 0.95 },
    "facetDescriptions": { "ontology": "Non-dual; self and ultimate reality are one.", "epistemology": "Direct realization, scriptural study, meditation.", "praxeology": "Discipline, devotion, renunciation.", "axiology": "Values liberation, knowledge, surrender.", "mythology": "Vedic stories, cosmic cycles.", "cosmology": "Universe as manifestation of Brahman.", "teleology": "Purpose is moksha—liberation from illusion." }
  },
  {
    "title": "Wicca",
    "category": "religious - Worldview",
    "summary": "A modern pagan religion honoring nature, cycles, and the divine feminine and masculine.",
    "icon": "\u263D",  // ☽ (Crescent moon)
    "scores": { "ontology": 0.80, "epistemology": 0.80, "praxeology": 0.70, "axiology": 0.85, "mythology": 0.90, "cosmology": 0.90, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Spirit and matter are interwoven, nature is alive.", "epistemology": "Intuitive, ritual, experiential.", "praxeology": "Ritual magic, cycles of the moon, seasonal rites.", "axiology": "Values harmony, balance, sacredness of nature.", "mythology": "Goddess and god, mythic cycles.", "cosmology": "World as enchanted and cyclical.", "teleology": "Purpose is attunement with cycles, self-actualization." }
  },
  {
    "title": "Zen Buddhism",
    "category": "religious - Worldview",
    "summary": "A school of Mahayana Buddhism emphasizing direct, wordless experience and sudden enlightenment.",
    "icon": "\u29BE",  // ⦾ (Circled white bullet)
    "scores": { "ontology": 0.65, "epistemology": 0.80, "praxeology": 0.80, "axiology": 0.80, "mythology": 0.70, "cosmology": 0.60, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Emptiness, non-duality, radical presence.", "epistemology": "Direct experience, beyond words or concepts.", "praxeology": "Meditation (zazen), spontaneous action.", "axiology": "Values mindfulness, simplicity, compassion.", "mythology": "Koans, teaching stories, paradox.", "cosmology": "All is Buddha-nature, reality is just as it is.", "teleology": "Purpose is awakening here and now." }
  },
  {
    "title": "Zoroastrianism",
    "category": "religious - Worldview",
    "summary": "An ancient Persian religion centering on the cosmic struggle between truth and falsehood, light and darkness.",
    "icon": "\u29CA",  // ⧊ (Triangle with two dots above)
    "scores": { "ontology": 0.55, "epistemology": 0.65, "praxeology": 0.70, "axiology": 0.75, "mythology": 0.80, "cosmology": 0.60, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Dualistic; world of good and evil, light and dark.", "epistemology": "Scriptural, ritual, moral discernment.", "praxeology": "Truth-telling, purity, fire ritual.", "axiology": "Values honesty, righteousness, order.", "mythology": "Myths of Ahura Mazda, Angra Mainyu, cosmic struggle.", "cosmology": "Order (asha) vs. chaos (druj), cosmic history.", "teleology": "Purpose is to aid truth and light, achieve renewal." }
  }
]