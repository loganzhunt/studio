
// src/data/codex/base-codex-data.ts
// Contains the initial, base set of Codex entries.

export const BASE_CODEX_DATA: any[] = [
  {
    "name": "Platonism",
    "summary": "A philosophical tradition centered on transcendent forms and the pursuit of the Good. Emphasizes reason, idealism, and the distinction between appearances and true reality.",
    "domainScores": { "ontology": 0.85, "epistemology": 0.9, "praxeology": 0.55, "axiology": 0.85, "mythology": 0.7, "cosmology": 0.8, "teleology": 0.8 },
    "facetSummary": { "ontology": "Reality is ultimately composed of ideal Forms.", "epistemology": "True knowledge is apprehended through reason.", "praxeology": "Right action aligns with the Form of the Good.", "axiology": "The Good is the supreme value.", "mythology": "Uses allegory and myth for teaching.", "cosmology": "The cosmos reflects perfect order.", "teleology": "Life’s purpose is to ascend toward the Good." },
    "tags": ["philosophical", "idealism", "classical"]
  },
  {
    "name": "Aristotelianism",
    "summary": "A naturalist and teleological philosophy grounded in empirical observation, virtue ethics, and the inherent order of nature.",
    "domainScores": { "ontology": 0.75, "epistemology": 0.75, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.3, "cosmology": 0.75, "teleology": 0.85 },
    "facetSummary": { "ontology": "Reality is substance and form.", "epistemology": "Knowledge is gained through empirical study.", "praxeology": "Ethical action fulfills one’s purpose.", "axiology": "Virtue is cultivated by habit.", "mythology": "Limited use of myth.", "cosmology": "Nature has intrinsic order.", "teleology": "Everything has a natural end." },
    "tags": ["philosophical", "naturalism", "classical"]
  },
  {
    "name": "Stoicism",
    "summary": "A philosophy of rational resilience and self-mastery, emphasizing the cultivation of virtue and acceptance of nature.",
    "domainScores": { "ontology": 0.65, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.85, "mythology": 0.4, "cosmology": 0.7, "teleology": 0.7 },
    "facetSummary": { "ontology": "Reality is rational and ordered.", "epistemology": "Truth is discerned through reason.", "praxeology": "Act in accordance with nature.", "axiology": "Virtue is the highest good.", "mythology": "Myth used for ethical teaching.", "cosmology": "The cosmos is governed by Logos.", "teleology": "Purpose is acceptance of fate." },
    "tags": ["philosophical", "ethics", "resilience"]
  },
  {
    "name": "Taoism",
    "summary": "A spiritual tradition rooted in the Tao, the ineffable source of all. Emphasizes harmony, non-action, and flowing with nature.",
    "domainScores": { "ontology": 0.65, "epistemology": 0.7, "praxeology": 0.55, "axiology": 0.8, "mythology": 0.75, "cosmology": 0.8, "teleology": 0.65 },
    "facetSummary": { "ontology": "Ultimate reality is the Tao.", "epistemology": "Wisdom arises from attunement, not analysis.", "praxeology": "Wu wei (non-action) and flexibility.", "axiology": "Harmony is the supreme value.", "mythology": "Rich in cosmological myth and parable.", "cosmology": "Cosmos flows as a spontaneous order.", "teleology": "Purpose is spontaneous unfolding." },
    "tags": ["spiritual", "eastern", "nature"]
  },
  {
    "name": "Scientific Materialism",
    "summary": "A worldview grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    "domainScores": { "ontology": 0.95, "epistemology": 0.9, "praxeology": 0.6, "axiology": 0.6, "mythology": 0.15, "cosmology": 0.85, "teleology": 0.2 },
    "facetSummary": { "ontology": "Only physical matter truly exists.", "epistemology": "Knowledge is gained through observation and experiment.", "praxeology": "Actions should be evidence-based.", "axiology": "Value arises from outcomes and utility.", "mythology": "Skeptical of myth and legend.", "cosmology": "The universe is physical and governed by laws.", "teleology": "No inherent purpose beyond survival." },
    "tags": ["scientific", "empirical", "modern"]
  },
  {
    "name": "Christianity",
    "summary": "A monotheistic religious tradition centered on Jesus Christ, emphasizing love, redemption, and eternal purpose.",
    "domainScores": { "ontology": 0.8, "epistemology": 0.65, "praxeology": 0.8, "axiology": 0.95, "mythology": 0.85, "cosmology": 0.85, "teleology": 0.95 },
    "facetSummary": { "ontology": "God is the ultimate reality.", "epistemology": "Faith and revelation as sources of truth.", "praxeology": "Live according to Christ’s example.", "axiology": "Love and redemption are central values.", "mythology": "Scripture rich in myth and symbol.", "cosmology": "Creation is divinely ordered.", "teleology": "Life’s purpose is communion with God." },
    "tags": ["religious", "monotheistic", "western"]
  },
  {
    "name": "Buddhism",
    "summary": "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering through the Eightfold Path.",
    "domainScores": { "ontology": 0.4, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.75, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.85 },
    "facetSummary": { "ontology": "All phenomena are impermanent and interdependent.", "epistemology": "Direct experience and insight.", "praxeology": "Ethical conduct and meditation.", "axiology": "Compassion and wisdom are highest values.", "mythology": "Buddhist cosmology and Jataka tales.", "cosmology": "Cyclic universes, realms, and karma.", "teleology": "Purpose is liberation from suffering." },
    "tags": ["spiritual", "eastern", "awakening"]
  },
  {
    "name": "Existentialism",
    "summary": "A modern philosophy focusing on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    "domainScores": { "ontology": 0.5, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.65, "mythology": 0.25, "cosmology": 0.4, "teleology": 0.6 },
    "facetSummary": { "ontology": "Reality is ambiguous and contingent.", "epistemology": "Truth emerges from subjective experience.", "praxeology": "Authentic action defines existence.", "axiology": "Value is self-created.", "mythology": "Rejects inherited myth; values story.", "cosmology": "The universe is indifferent.", "teleology": "Purpose is made, not given." },
    "tags": ["philosophical", "modern", "authenticity"]
  },
  {
    "name": "Mystical Sufism",
    "summary": "A mystical Islamic tradition seeking direct experience of the Divine through love, devotion, and spiritual practice.",
    "domainScores": { "ontology": 0.75, "epistemology": 0.75, "praxeology": 0.8, "axiology": 0.85, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.95 },
    "facetSummary": { "ontology": "God is immanent and transcendent.", "epistemology": "Inner knowing (gnosis) and revelation.", "praxeology": "Love and devotion as practice.", "axiology": "Union with God is the highest value.", "mythology": "Sufi poetry and parables.", "cosmology": "Creation as reflection of the Divine.", "teleology": "Purpose is return to the Beloved." },
    "tags": ["mystical", "islamic", "spiritual"]
  },
  {
    "name": "Animism",
    "summary": "A worldview that sees spirit or consciousness as present in all beings, places, and phenomena. Emphasizes relationship and reciprocity.",
    "domainScores": { "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.9, "cosmology": 0.75, "teleology": 0.6 },
    "facetSummary": { "ontology": "All things possess spirit.", "epistemology": "Knowledge is relational and experiential.", "praxeology": "Reciprocity with the more-than-human world.", "axiology": "Balance and respect are highest values.", "mythology": "Stories of spirits, ancestors, and place.", "cosmology": "The world is alive and interconnected.", "teleology": "Purpose is right relationship." },
    "tags": ["indigenous", "spiritual", "nature"]
  }
];

    