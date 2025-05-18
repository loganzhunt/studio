
"use client";

// Always ensure a valid React component is exported as default.
// Large data blocks must be defined above the component or imported from separate files.

import React, { useState, useMemo, useEffect } from 'react';
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import type { CodexEntry, FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets"; 
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
// Badge removed as tags are hidden on cards, but keep if used elsewhere in drawer potentially
// import { Badge } from '@/components/ui/badge'; 
import { getFacetColorHsl } from '@/lib/colors'; 
import { useWorldview } from '@/hooks/use-worldview';
import { useToast } from '@/hooks/use-toast';

// --- Data Definitions ---

const LATEST_CODEX_UPDATE_BATCH: any[] = [
  {
    "title": "Agnosticism",
    "category": "philosophical - Worldview",
    "summary": "A position of suspended belief about the existence of deities or ultimate reality, prioritizing uncertainty or open inquiry.",
    "icon": "\u003F",  // ?
    "scores": { "ontology": 0.45, "epistemology": 0.50, "praxeology": 0.40, "axiology": 0.45, "mythology": 0.40, "cosmology": 0.50, "teleology": 0.35 },
    "facetDescriptions": { "ontology": "Suspends judgment between materialism and idealism; maintains open possibilities.", "epistemology": "Balances empirical inquiry and openness to revelation; prioritizes skepticism.", "praxeology": "Hesitant between hierarchical and egalitarian action; flexible stance.", "axiology": "Values open-ended inquiry over fixed ideals; avoids absolute individualism or collectivism.", "mythology": "Cautious regarding overarching narratives; no fixed mythos.", "cosmology": "Keeps cosmological assumptions ambiguous; neither mechanistic nor holistic.", "teleology": "Uncommitted to existential or divine purposes; embraces uncertainty." }
  },
  {
    "title": "Animism",
    "category": "religious - Worldview",
    "summary": "A worldview that sees spirit or consciousness as present in all beings, places, and phenomena. Emphasizes relationship and reciprocity.",
    "icon": "\u273F",  // ✿
    "scores": { "ontology": 0.80, "epistemology": 0.70, "praxeology": 0.40, "axiology": 0.70, "mythology": 0.80, "cosmology": 0.90, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Leans toward idealism; reality is alive and consciousness is fundamental.", "epistemology": "Emphasizes revelatory knowledge, intuition, and direct communion with nature.", "praxeology": "Balances individual and collective action, often valuing reciprocal relationship.", "axiology": "Emphasizes interconnectedness and community well-being.", "mythology": "Rich in mythic stories of spirits, ancestors, and the sacred world.", "cosmology": "Holistic; the cosmos is a web of relations, not just mechanism.", "teleology": "Purpose is entwined with harmony, ancestral lineage, and spiritual ecology." }
  },
  {
    "title": "Aristotelianism",
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
    "title": "Buddhism",
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
    "title": "Christianity",
    "category": "religious - Worldview",
    "summary": "A monotheistic religious tradition centered on Jesus Christ, emphasizing love, redemption, and eternal purpose.",
    "icon": "\u271A",  // ✚
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
    "facetDescriptions": { "ontology": "Strongly materialist; what is real is what can be sensed.", "epistemology": "Radically empirical; all knowledge begins with experience.", "praxeology": "Moderate individualism; action guided by evidence.", "axiology": "Values truth, clarity, and observational reliability.", "mythology": "Rejects myth; trusts only observed reality.", "cosmology": "Mechanistic; reality is a lawful, observable system.", "teleology": "Purpose is emergent, not predetermined." }
  }
];

const BASE_CODEX_DATA: any[] = [
  {
    "name": "Platonism",
    "summary": "A philosophical tradition centered on transcendent forms and the pursuit of the Good. Emphasizes reason, idealism, and the distinction between appearances and true reality.",
    "domainScores": { "Ontology": 0.85, "Epistemology": 0.9, "Praxeology": 0.55, "Axiology": 0.85, "Mythology": 0.7, "Cosmology": 0.8, "Teleology": 0.8 },
    "facetSummary": { "Ontology": "Reality is ultimately composed of ideal Forms.", "Epistemology": "True knowledge is apprehended through reason.", "Praxeology": "Right action aligns with the Form of the Good.", "Axiology": "The Good is the supreme value.", "Mythology": "Uses allegory and myth for teaching.", "Cosmology": "The cosmos reflects perfect order.", "Teleology": "Life’s purpose is to ascend toward the Good." },
    "tags": ["philosophical", "idealism", "classical"]
  },
  // Aristotelianism removed as it's in LATEST_CODEX_UPDATE_BATCH
  {
    "name": "Stoicism",
    "summary": "A philosophy of rational resilience and self-mastery, emphasizing the cultivation of virtue and acceptance of nature.",
    "domainScores": { "Ontology": 0.65, "Epistemology": 0.7, "Praxeology": 0.9, "Axiology": 0.85, "Mythology": 0.4, "Cosmology": 0.7, "Teleology": 0.7 },
    "facetSummary": { "Ontology": "Reality is rational and ordered.", "Epistemology": "Truth is discerned through reason.", "Praxeology": "Act in accordance with nature.", "Axiology": "Virtue is the highest good.", "Mythology": "Myth used for ethical teaching.", "Cosmology": "The cosmos is governed by Logos.", "Teleology": "Purpose is acceptance of fate." },
    "tags": ["philosophical", "ethics", "resilience"]
  },
  {
    "name": "Taoism",
    "summary": "A spiritual tradition rooted in the Tao, the ineffable source of all. Emphasizes harmony, non-action, and flowing with nature.",
    "domainScores": { "Ontology": 0.65, "Epistemology": 0.7, "Praxeology": 0.55, "Axiology": 0.8, "Mythology": 0.75, "Cosmology": 0.8, "Teleology": 0.65 },
    "facetSummary": { "Ontology": "Ultimate reality is the Tao.", "Epistemology": "Wisdom arises from attunement, not analysis.", "Praxeology": "Wu wei (non-action) and flexibility.", "Axiology": "Harmony is the supreme value.", "Mythology": "Rich in cosmological myth and parable.", "Cosmology": "Cosmos flows as a spontaneous order.", "Teleology": "Purpose is spontaneous unfolding." },
    "tags": ["spiritual", "eastern", "nature"]
  },
  {
    "name": "Scientific Materialism",
    "summary": "A worldview grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    "domainScores": { "Ontology": 0.95, "Epistemology": 0.9, "Praxeology": 0.6, "Axiology": 0.6, "Mythology": 0.15, "Cosmology": 0.85, "Teleology": 0.2 },
    "facetSummary": { "Ontology": "Only physical matter truly exists.", "Epistemology": "Knowledge is gained through observation and experiment.", "Praxeology": "Actions should be evidence-based.", "Axiology": "Value arises from outcomes and utility.", "Mythology": "Skeptical of myth and legend.", "Cosmology": "The universe is physical and governed by laws.", "Teleology": "No inherent purpose beyond survival." },
    "tags": ["scientific", "empirical", "modern"]
  },
  // Christianity removed as it's in LATEST_CODEX_UPDATE_BATCH
  // Buddhism removed as it's in LATEST_CODEX_UPDATE_BATCH
  {
    "name": "Existentialism", 
    "summary": "A modern philosophy focusing on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    "domainScores": { "ontology": 0.5, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.65, "mythology": 0.25, "cosmology": 0.4, "teleology": 0.6 }, // old scores
    "facetSummary": { "ontology": "Reality is ambiguous and contingent.", "epistemology": "Truth emerges from subjective experience.", "praxeology": "Authentic action defines existence.", "axiology": "Value is self-created.", "mythology": "Rejects inherited myth; values story.", "cosmology": "The universe is indifferent.", "teleology": "Purpose is made, not given." },
    "tags": ["philosophical", "modern", "authenticity"]
  },
  {
    "name": "Mystical Sufism", 
    "summary": "A mystical Islamic tradition seeking direct experience of the Divine through love, devotion, and spiritual practice.",
    "domainScores": { "Ontology": 0.75, "Epistemology": 0.75, "Praxeology": 0.8, "Axiology": 0.85, "Mythology": 0.8, "Cosmology": 0.7, "Teleology": 0.95 },
    "facetSummary": { "Ontology": "God is immanent and transcendent.", "Epistemology": "Inner knowing (gnosis) and revelation.", "Praxeology": "Love and devotion as practice.", "Axiology": "Union with God is the highest value.", "Mythology": "Sufi poetry and parables.", "Cosmology": "Creation as reflection of the Divine.", "Teleology": "Purpose is return to the Beloved." },
    "tags": ["mystical", "islamic", "spiritual"]
  }
  // Animism removed as it's in LATEST_CODEX_UPDATE_BATCH
];

const ADDITIONAL_CODEX_DATA: any[] = [
  // Empiricism removed as it's in LATEST_CODEX_UPDATE_BATCH
  {
    "title": "Epicureanism",
    "category": "philosophical - Worldview",
    "summary": "An ancient philosophy prioritizing the pursuit of pleasure and avoidance of pain through modest living and rational thought.",
    "icon": "\u2698",  // ⚘ (Flower, still appropriate)
    "scores": {
      "ontology": 0.25,
      "epistemology": 0.15,
      "praxeology": 0.40,
      "axiology": 0.45,
      "mythology": 0.20,
      "cosmology": 0.20,
      "teleology": 0.20
    },
    "facetDescriptions": {
      "ontology": "Materialist-leaning; reality is physical, pleasure and pain are bodily.",
      "epistemology": "Radically empirical; knowledge from sensation and experience.",
      "praxeology": "Moderate individualism; seeks personal tranquility and prudence.",
      "axiology": "Values ataraxia (peace of mind), friendship, and absence of pain.",
      "mythology": "Minimal mythos; challenges superstitions and fears.",
      "cosmology": "Mechanistic and naturalistic; no intervention by gods.",
      "teleology": "Purpose is self-directed happiness, not divine destiny."
    },
    "tags": ["philosophical", "ethics", "hedonism"]
  },
  {
    "title": "Existentialism", // Note: Duplicate name with different data than BASE_CODEX_DATA, LATEST_CODEX_UPDATE_BATCH will take precedence if same name.
    "category": "philosophical - Worldview",
    "summary": "A philosophical movement emphasizing individual existence, freedom, and the search for authentic meaning in an indifferent universe.",
    "icon": "\u2203",  // ∃ (Logical existential quantifier)
    "scores": {
      "ontology": 0.30,
      "epistemology": 0.30,
      "praxeology": 0.55,
      "axiology": 0.35,
      "mythology": 0.25,
      "cosmology": 0.25,
      "teleology": 0.05
    },
    "facetDescriptions": {
      "ontology": "Materialist and existential; reality is brute fact, not essence.",
      "epistemology": "Leans empirical; values personal experience over dogma.",
      "praxeology": "Emphasizes individual freedom, authenticity, and responsibility.",
      "axiology": "Values subjective meaning, authenticity, and self-definition.",
      "mythology": "Skeptical of traditional myths; embraces existential narrative.",
      "cosmology": "Mechanistic and indifferent; cosmos lacks intrinsic order.",
      "teleology": "Existential; meaning and purpose are self-created."
    },
    "tags": ["philosophical", "modern", "authenticity"]
  },
  {
    "title": "Gnosticism",
    "category": "religious - Worldview",
    "summary": "A mystical and dualistic tradition emphasizing secret knowledge (gnosis) and inner spiritual awakening.",
    "icon": "\u25B3",  // ⟁ (White up-pointing triangle)
    "scores": {
      "ontology": 0.90,
      "epistemology": 0.80,
      "praxeology": 0.50,
      "axiology": 0.60,
      "mythology": 0.95,
      "cosmology": 0.75,
      "teleology": 0.80
    },
    "facetDescriptions": {
      "ontology": "Idealist; spiritual reality is primary, material world is shadow.",
      "epistemology": "Highly revelatory; true knowledge is inner and secret.",
      "praxeology": "Balancing individual ascent with esoteric community.",
      "axiology": "Values liberation, spiritual truth, and transcendence.",
      "mythology": "Rich in cosmological myth and allegory.",
      "cosmology": "Dualistic; cosmic battle of light and darkness.",
      "teleology": "Divine purpose is return to the source, spiritual union."
    },
    "tags": ["mystical", "dualism", "spiritual"]
  },
  {
    "title": "Hinduism",
    "category": "religious - Worldview",
    "summary": "A diverse religious tradition rooted in India, focusing on dharma, karma, reincarnation, and the pursuit of liberation (moksha).",
    "icon": "\u0950",  // ॐ (Om, still appropriate)
    "scores": {
      "ontology": 0.85,
      "epistemology": 0.80,
      "praxeology": 0.50,
      "axiology": 0.80,
      "mythology": 0.90,
      "cosmology": 0.90,
      "teleology": 0.95
    },
    "facetDescriptions": {
      "ontology": "Idealist; all forms are expressions of ultimate consciousness (Brahman).",
      "epistemology": "Blends revelatory scripture (Veda) with personal realization.",
      "praxeology": "Balances individual and communal dharma (duty/ethics).",
      "axiology": "Values liberation, devotion, and spiritual harmony.",
      "mythology": "Rich and multi-layered, full of gods, avatars, and epics.",
      "cosmology": "Holistic and cyclical; creation and dissolution are infinite.",
      "teleology": "Ultimate purpose is moksha—liberation and union with the divine."
    },
    "tags": ["religious", "eastern", "dharma"]
  },
  {
    "title": "Humanism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical and ethical stance that values human agency, rationality, and well-being, often without reliance on the supernatural.",
    "icon": "\u26A4",  // ⚤ (Interlocked male and female signs)
    "scores": {
      "ontology": 0.30,
      "epistemology": 0.20,
      "praxeology": 0.45,
      "axiology": 0.45,
      "mythology": 0.15,
      "cosmology": 0.20,
      "teleology": 0.10
    },
    "facetDescriptions": {
      "ontology": "Materialist; reality is human-centered and empirical.",
      "epistemology": "Leans empirical, values science and critical inquiry.",
      "praxeology": "Values individual agency and collective progress.",
      "axiology": "Prioritizes dignity, ethics, and human flourishing.",
      "mythology": "Rejects supernatural myth; may use secular narratives.",
      "cosmology": "Mechanistic; universe is knowable and non-personal.",
      "teleology": "Purpose is human-created and existential."
    },
    "tags": ["philosophical", "ethics", "secular"]
  },
  {
    "title": "Islam",
    "category": "religious - Worldview",
    "summary": "A monotheistic Abrahamic faith rooted in the revelation to Muhammad, emphasizing submission to God (Allah) and the unity of creation.",
    "icon": "\u262A",  // ☪ (Star and Crescent, unchanged)
    "scores": {
      "ontology": 0.70,
      "epistemology": 0.75,
      "praxeology": 0.60,
      "axiology": 0.65,
      "mythology": 0.80,
      "cosmology": 0.85,
      "teleology": 0.90
    },
    "facetDescriptions": {
      "ontology": "Idealist; Allah is the ultimate reality, creation is meaningful.",
      "epistemology": "Strongly revelatory; the Qur’an and prophetic tradition.",
      "praxeology": "Moderately hierarchical; guided by Sharia and tradition.",
      "axiology": "Centers on submission, justice, and mercy.",
      "mythology": "Rich mythos—prophets, angels, creation, judgment.",
      "cosmology": "Holistic; universe is ordered and purposeful.",
      "teleology": "Ultimate purpose is to submit to God and attain paradise."
    },
    "tags": ["religious", "monotheistic", "abrahamic"]
  },
  {
    "title": "Jainism",
    "category": "religious - Worldview",
    "summary": "An ancient Indian religion emphasizing non-violence (ahimsa), karma, and the liberation of the soul through self-discipline.",
    "icon": "\u534D",  // 卍 (Jain swastika)
    "scores": {
      "ontology": 0.80,
      "epistemology": 0.70,
      "praxeology": 0.45,
      "axiology": 0.85,
      "mythology": 0.60,
      "cosmology": 0.70,
      "teleology": 0.90
    },
    "facetDescriptions": {
      "ontology": "Idealist; consciousness (jiva) is the core of reality.",
      "epistemology": "Revelatory and experiential; emphasizes inner purity.",
      "praxeology": "Balance between strict discipline and communal harmony.",
      "axiology": "Prioritizes non-violence, self-restraint, and compassion.",
      "mythology": "Stories of tirthankaras and cosmic cycles.",
      "cosmology": "Cyclical universe with moral causality.",
      "teleology": "Purpose is spiritual liberation from karma."
    },
    "tags": ["religious", "eastern", "ahimsa"]
  },
  {
    "title": "Judaism",
    "category": "religious - Worldview",
    "summary": "An ancient monotheistic tradition centered on covenant, law (Torah), and the ongoing relationship between God and the Jewish people.",
    "icon": "\u2721",  // ✡ (Star of David, unchanged)
    "scores": {
      "ontology": 0.60,
      "epistemology": 0.70,
      "praxeology": 0.60,
      "axiology": 0.65,
      "mythology": 0.85,
      "cosmology": 0.75,
      "teleology": 0.75
    },
    "facetDescriptions": {
      "ontology": "Idealist; God is ultimate reality, covenant is foundational.",
      "epistemology": "Blends revelation (Torah) and communal interpretation.",
      "praxeology": "Moderate hierarchy; follows halakha (Jewish law).",
      "axiology": "Values justice, community, and remembrance.",
      "mythology": "Rich stories—Exodus, prophets, exile, return.",
      "cosmology": "Holistic, with sacred time and divine order.",
      "teleology": "Purpose is tikkun olam (repairing the world) and covenantal faithfulness."
    },
    "tags": ["religious", "monotheistic", "abrahamic"]
  },
  {
    "title": "Kabbalah",
    "category": "religious - Worldview",
    "summary": "A mystical tradition within Judaism that explores the hidden dimensions of God, creation, and the human soul.",
    "icon": "\u05CE",  // ֎ (Hebrew symbol)
    "scores": {
      "ontology": 0.80,
      "epistemology": 0.80,
      "praxeology": 0.60,
      "axiology": 0.70,
      "mythology": 0.90,
      "cosmology": 0.90,
      "teleology": 0.90
    },
    "facetDescriptions": {
      "ontology": "Idealist and mystical; reality is multi-layered and symbolic.",
      "epistemology": "Revelatory and esoteric; knowledge through mystical insight.",
      "praxeology": "Ritual and symbolic acts connect microcosm and macrocosm.",
      "axiology": "Values spiritual transformation and alignment with divine.",
      "mythology": "Complex mythos—sefirot, emanations, and cosmic repair.",
      "cosmology": "Holistic and interwoven; all creation reflects divine order.",
      "teleology": "Purpose is mystical union and tikkun (healing the world)."
    },
    "tags": ["mystical", "jewish", "esoteric"]
  },
  {
    "title": "Mahayana Buddhism",
    "category": "religious - Worldview",
    "summary": "A broad Buddhist tradition emphasizing universal compassion, the bodhisattva path, and emptiness (shunyata).",
    "icon": "\u06DE",  // ۞ (Auspicious star symbol)
    "scores": {
      "ontology": 0.55,
      "epistemology": 0.55,
      "praxeology": 0.65,
      "axiology": 0.80,
      "mythology": 0.75,
      "cosmology": 0.70,
      "teleology": 0.80
    },
    "facetDescriptions": {
      "ontology": "Middle way; reality is empty, relational, and compassionate.",
      "epistemology": "Balances empirical practice and revelatory wisdom.",
      "praxeology": "Focus on universal compassion (bodhisattva ideal).",
      "axiology": "Values selflessness, compassion, and liberation for all.",
      "mythology": "Expansive mythos—Buddhas, bodhisattvas, cosmic Buddhalands.",
      "cosmology": "Cyclical worlds and realms; interconnectedness.",
      "teleology": "Purpose is universal awakening (Buddhahood) for all beings."
    },
    "tags": ["spiritual", "buddhist", "compassion"]
  },
  { "name": "Materialism", "summary": "A worldview holding that matter is the fundamental substance of reality and all phenomena can be explained by material interactions.", "scores": { "ontology": 0.0, "epistemology": 1.0, "praxeology": 0.5, "axiology": 0.6, "mythology": 0.1, "cosmology": 0.3, "teleology": 0.2 }, "facetDescriptions": { "ontology": "Only physical matter is real.", "epistemology": "Truth is discovered through empirical science.", "praxeology": "Action is shaped by physical necessity and utility.", "axiology": "Values are emergent from human nature and society.", "mythology": "Myths are seen as imaginative stories.", "cosmology": "The universe is governed by physical laws.", "teleology": "Purpose is a human construct." }, tags: ["philosophical", "scientific", "physicalism"]},
  { "name": "Modernism", "summary": "A cultural and philosophical movement prioritizing progress, rationality, and mastery over nature through science and technology.", "scores": { "ontology": 0.3, "epistemology": 0.9, "praxeology": 0.9, "axiology": 0.8, "mythology": 0.2, "cosmology": 0.4, "teleology": 0.5 }, "facetDescriptions": { "ontology": "Reality is knowable and improvable.", "epistemology": "Rational inquiry and evidence build knowledge.", "praxeology": "Human action shapes the future.", "axiology": "Progress and innovation are valued.", "mythology": "Myth gives way to reason and critique.", "cosmology": "The universe is subject to human understanding.", "teleology": "Purpose is self-determined and future-oriented." }, tags: ["philosophical", "cultural", "progress"]},
  { "name": "Mysticism", "summary": "A spiritual orientation focused on direct experience of the divine, transcending ordinary perception and dogma.", "scores": { "ontology": 1.0, "epistemology": 0.9, "praxeology": 0.7, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.9 }, "facetDescriptions": { "ontology": "All is divine; the world is a manifestation of Spirit.", "epistemology": "Knowledge is gained through inner illumination.", "praxeology": "Practice seeks direct union with the divine.", "axiology": "Unity and transcendence are highest values.", "mythology": "Myth points to ineffable truths.", "cosmology": "The universe is an emanation of Spirit.", "teleology": "Purpose is union with the Absolute." }, tags: ["spiritual", "experiential", "transcendent"]},
  { "name": "Naturalism", "summary": "A worldview asserting that everything arises from natural properties and causes, excluding supernatural explanations.", "scores": { "ontology": 0.1, "epistemology": 1.0, "praxeology": 0.8, "axiology": 0.6, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.2 }, "facetDescriptions": { "ontology": "Only the natural world exists.", "epistemology": "Science is the path to knowledge.", "praxeology": "Ethics are grounded in natural consequences.", "axiology": "Value is found in natural flourishing.", "mythology": "Myth is cultural narrative, not truth.", "cosmology": "The cosmos is entirely natural.", "teleology": "Purpose is emergent, not imposed." }, tags: ["philosophical", "scientific", "empirical"]},
  { "name": "Neoplatonism", "summary": "A philosophical tradition teaching that all reality emanates from a single source (the One), emphasizing spiritual ascent.", "scores": { "ontology": 1.0, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.9, "teleology": 1.0 }, "facetDescriptions": { "ontology": "All derives from the One; spiritual reality is supreme.", "epistemology": "Knowledge is ascent from opinion to the divine intellect.", "praxeology": "Contemplative practice leads to union with the source.", "axiology": "Goodness is participation in the divine.", "mythology": "Myth encodes spiritual realities.", "cosmology": "The cosmos is an ordered hierarchy of emanations.", "teleology": "Purpose is return to the One." }, tags: ["philosophical", "mystical", "classical"]},
  { "name": "Nihilism", "summary": "A worldview that rejects inherent meaning, purpose, or value in life, often as a response to the collapse of previous certainties.", "scores": { "ontology": 0.0, "epistemology": 0.2, "praxeology": 0.3, "axiology": 0.0, "mythology": 0.0, "cosmology": 0.1, "teleology": 0.0 }, "facetDescriptions": { "ontology": "Nothing has ultimate substance or permanence.", "epistemology": "Certainty is impossible.", "praxeology": "No action is intrinsically meaningful.", "axiology": "There are no objective values.", "mythology": "All narratives are arbitrary.", "cosmology": "The universe is indifferent.", "teleology": "Purpose is nonexistent." }, tags: ["philosophical", "skepticism", "meaninglessness"]},
  { "name": "Panpsychism", "summary": "A philosophical view that consciousness or mind is a fundamental and ubiquitous aspect of reality.", "scores": { "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.6, "cosmology": 0.8, "teleology": 0.5 }, "facetDescriptions": { "ontology": "Mind is a universal property of matter.", "epistemology": "Understanding comes from introspection and science.", "praxeology": "Action acknowledges mind in all beings.", "axiology": "Value is found in universal sentience.", "mythology": "Myths may reflect the pervasiveness of spirit.", "cosmology": "The cosmos is suffused with consciousness.", "teleology": "Purpose is evolutionary and open-ended." }, tags: ["philosophical", "consciousness", "metaphysics"]},
  { "name": "Pantheism", "summary": "A doctrine identifying the universe itself with the divine—God is all, and all is God.", "scores": { "ontology": 1.0, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.8, "cosmology": 1.0, "teleology": 0.8 }, "facetDescriptions": { "ontology": "God and the universe are identical.", "epistemology": "Intuitive and scientific knowing are both valued.", "praxeology": "Action aligns with the natural order.", "axiology": "All is worthy, as all is divine.", "mythology": "Nature myths point to the divine in all things.", "cosmology": "The cosmos is sacred, infinite, and interconnected.", "teleology": "Purpose is realization of unity." }, tags: ["spiritual", "philosophical", "divinity"]},
  // Platonism removed as it's in BASE_CODEX_DATA
  { "name": "Postmodernism", "summary": "A skeptical and critical orientation challenging grand narratives, objectivity, and stable meaning.", "scores": { "ontology": 0.3, "epistemology": 0.2, "praxeology": 0.5, "axiology": 0.4, "mythology": 0.8, "cosmology": 0.2, "teleology": 0.1 }, "facetDescriptions": { "ontology": "Reality is fragmented and constructed.", "epistemology": "Knowledge is contextual and contingent.", "praxeology": "Action resists fixed identities and power structures.", "axiology": "Values are plural and unstable.", "mythology": "Myth is deconstructed and reinterpreted.", "cosmology": "Cosmos lacks inherent order or purpose.", "teleology": "Purpose is an illusion." }, tags: ["philosophical", "cultural", "critique"]},
  { "name": "Process Philosophy", "summary": "A metaphysical approach emphasizing becoming, change, and relationality as more fundamental than substance.", "scores": { "ontology": 0.6, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.4, "cosmology": 0.7, "teleology": 0.7 }, "facetDescriptions": { "ontology": "Reality is process and event, not fixed substance.", "epistemology": "Truth unfolds dynamically.", "praxeology": "Ethics is responsive to novelty and context.", "axiology": "Creativity and harmony are valued.", "mythology": "Myths model transformation.", "cosmology": "The cosmos is in perpetual becoming.", "teleology": "Aim is creative advance into novelty." }, tags: ["philosophical", "metaphysics", "relationality"]},
  { "name": "Rationalism", "summary": "A philosophical approach emphasizing reason and logic as the primary source of knowledge.", "scores": { "ontology": 0.7, "epistemology": 1.0, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.2, "cosmology": 0.5, "teleology": 0.6 }, "facetDescriptions": { "ontology": "Reality is knowable through reason.", "epistemology": "Reason and intuition are supreme sources of knowledge.", "praxeology": "Action follows rational principle.", "axiology": "Values are discoverable by logic.", "mythology": "Myths are interpreted rationally.", "cosmology": "The universe is logically ordered.", "teleology": "Purpose is deduced from first principles." }, tags: ["philosophical", "epistemology", "reason"]},
  { "name": "Romanticism", "summary": "A cultural and philosophical movement emphasizing emotion, nature, and the creative imagination.", "scores": { "ontology": 0.8, "epistemology": 0.5, "praxeology": 0.6, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.7, "teleology": 0.7 }, "facetDescriptions": { "ontology": "Nature and spirit are entwined.", "epistemology": "Intuition and feeling are valid sources of knowledge.", "praxeology": "Creative self-expression is valued.", "axiology": "Emotion, beauty, and the sublime are highest values.", "mythology": "Mythic imagination shapes experience.", "cosmology": "The world is alive and meaningful.", "teleology": "Aim is self-realization and unity with nature." }, tags: ["cultural", "artistic", "emotion"]},
  { "name": "Shamanism", "summary": "A range of animistic traditions emphasizing the healer’s journey between worlds for wisdom and transformation.", "scores": { "ontology": 0.9, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.7, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.8 }, "facetDescriptions": { "ontology": "Spirits and worlds interpenetrate reality.", "epistemology": "Knowledge is gained through visionary experience.", "praxeology": "Ritual and journey are methods of healing.", "axiology": "Balance and reciprocity are core values.", "mythology": "Myth guides the healer’s journey.", "cosmology": "The universe is populated by many spirits.", "teleology": "Purpose is harmony and restoration." }, tags: ["spiritual", "indigenous", "healing"]},
  // Stoicism removed as it's in LATEST_CODEX_UPDATE_BATCH, and also in BASE_CODEX_DATA
  // Sufism removed for same reason (Mystical Sufism in BASE_CODEX_DATA)
  // Taoism removed for same reason
  {
    "title": "Theosophy",
    "category": "mystical - Worldview",
    "summary": "A mystical movement synthesizing Eastern and Western traditions, teaching spiritual evolution, karma, and hidden wisdom.",
    "icon": "\u262F",  // ☯ (Yin Yang, generic mystical)
    "scores": {
      "ontology": 0.9,
      "epistemology": 0.7,
      "praxeology": 0.6,
      "axiology": 0.8,
      "mythology": 0.9,
      "cosmology": 0.9,
      "teleology": 1.0
    },
    "facetDescriptions": {
      "ontology": "Spiritual planes underlie material reality.",
      "epistemology": "Intuition and esoteric study reveal hidden truths.",
      "praxeology": "Actions influence karma and spiritual evolution.",
      "axiology": "Wisdom, altruism, and service are highest values.",
      "mythology": "Myth encodes perennial teachings.",
      "cosmology": "The cosmos is a hierarchy of evolving worlds.",
      "teleology": "Purpose is spiritual ascent and union with the divine."
    },
    "tags": ["mystical", "esoteric", "synthesis"]
  },
  {
    "title": "Theravada Buddhism",
    "category": "religious - Worldview",
    "summary": "The earliest form of Buddhism, emphasizing individual enlightenment through ethical conduct, meditation, and insight.",
    "icon": "\uD83D\uDD4E", // 🕎 (Stupa icon)
    "scores": {
      "ontology": 0.8,
      "epistemology": 0.7,
      "praxeology": 1.0,
      "axiology": 0.8,
      "mythology": 0.6,
      "cosmology": 0.7,
      "teleology": 1.0
    },
    "facetDescriptions": {
      "ontology": "All phenomena are impermanent and non-self.",
      "epistemology": "Knowledge arises from direct meditative insight.",
      "praxeology": "Ethical conduct and meditation are the path.",
      "axiology": "Wisdom and compassion guide action.",
      "mythology": "Myth provides context for ethical practice.",
      "cosmology": "The universe cycles through endless rebirths.",
      "teleology": "Purpose is liberation from suffering (nirvana)."
    },
    "tags": ["spiritual", "buddhist", "meditation"]
  },
  {
    "title": "Transcendentalism",
    "category": "philosophical - Worldview",
    "summary": "A 19th-century American movement emphasizing the inherent goodness of people and nature, and the primacy of intuition.",
    "icon": "\uD83C\uDF3F", // 🌿 (Herb/Seedling)
    "scores": {
      "ontology": 0.8,
      "epistemology": 0.6,
      "praxeology": 0.7,
      "axiology": 0.8,
      "mythology": 0.7,
      "cosmology": 0.6,
      "teleology": 0.7
    },
    "facetDescriptions": {
      "ontology": "Spirit pervades all nature and humanity.",
      "epistemology": "Intuition and self-reliance are paths to truth.",
      "praxeology": "Nonconformity and individual action are prized.",
      "axiology": "Truth and authenticity are highest values.",
      "mythology": "Nature is the living symbol of Spirit.",
      "cosmology": "Nature is harmonious and interconnected.",
      "teleology": "Aim is self-cultivation and spiritual realization."
    },
    "tags": ["philosophical", "american", "nature", "intuition"]
  },
  {
    "title": "Unitarian Universalism",
    "category": "religious - Worldview",
    "summary": "A pluralistic faith embracing wisdom from all traditions and affirming freedom of belief and conscience.",
    "icon": "\uD83D\uDD6F️", // 🕯️ (Candle)
    "scores": {
      "ontology": 0.5,
      "epistemology": 0.7,
      "praxeology": 0.8,
      "axiology": 0.9,
      "mythology": 0.5,
      "cosmology": 0.5,
      "teleology": 0.7
    },
    "facetDescriptions": {
      "ontology": "Reality is open to diverse interpretations.",
      "epistemology": "Truth is sought through reason, experience, and tradition.",
      "praxeology": "Action pursues justice and compassion.",
      "axiology": "Dignity, equity, and community are core values.",
      "mythology": "Wisdom is found in many stories.",
      "cosmology": "Cosmos is explored through many lenses.",
      "teleology": "Purpose is self-actualization and service."
    },
    "tags": ["religious", "pluralistic", "liberal"]
  },
  {
    "title": "Vedanta",
    "category": "religious - Worldview",
    "summary": "A major school of Hindu philosophy teaching the unity of Atman (self) and Brahman (absolute reality).",
    "icon": "\uD83D\uDD4B", // 🕋 (Kaaba, though not directly Vedanta, can represent sacred place)
    "scores": {
      "ontology": 1.0,
      "epistemology": 0.8,
      "praxeology": 0.8,
      "axiology": 0.9,
      "mythology": 0.8,
      "cosmology": 0.9,
      "teleology": 1.0
    },
    "facetDescriptions": {
      "ontology": "Only Brahman is ultimately real; the world is appearance.",
      "epistemology": "Direct realization leads to knowledge of unity.",
      "praxeology": "Spiritual practice removes ignorance.",
      "axiology": "Liberation is the highest value.",
      "mythology": "Myth reveals the divine play (lila).",
      "cosmology": "The cosmos is cyclical, an expression of Brahman.",
      "teleology": "The goal is moksha—union with the Absolute."
    },
    "tags": ["spiritual", "hindu", "nonduality"]
  },
  {
    "title": "Zen Buddhism",
    "category": "religious - Worldview",
    "summary": "A school of Mahayana Buddhism emphasizing direct, wordless experience and sudden enlightenment.",
    "icon": "\u3030", // 〰️ (Wavy dash, Zen circle / Enso like)
    "scores": {
      "ontology": 0.9,
      "epistemology": 0.7,
      "praxeology": 0.8,
      "axiology": 0.7,
      "mythology": 0.6,
      "cosmology": 0.7,
      "teleology": 0.8
    },
    "facetDescriptions": {
      "ontology": "All is empty, interdependent, and immediate.",
      "epistemology": "Intuitive, direct experience transcends concepts.",
      "praxeology": "Practice is zazen (sitting meditation) and daily mindfulness.",
      "axiology": "Simplicity, presence, and compassion are valued.",
      "mythology": "Koans and stories prompt insight, not dogma.",
      "cosmology": "The world is always already complete.",
      "teleology": "Goal is awakening to original nature."
    },
    "tags": ["spiritual", "buddhist", "zen", "meditation"]
  },
  {
    "title": "Zoroastrianism",
    "category": "religious - Worldview",
    "summary": "An ancient Persian religion centering on the cosmic struggle between truth and falsehood, light and darkness.",
    "icon": "\uD83D\uDD49", // 🕉️ (Om, can be Faravahar like) -> Corrected to Faravahar Unicode if exists, otherwise a generic flame/light icon might be better if available. Using Om as per original data.
    "scores": {
      "ontology": 0.7,
      "epistemology": 0.6,
      "praxeology": 0.9,
      "axiology": 0.9,
      "mythology": 0.7,
      "cosmology": 0.7,
      "teleology": 0.9
    },
    "facetDescriptions": {
      "ontology": "Duality of truth (asha) and falsehood (druj) defines reality.",
      "epistemology": "Revelation and reason are paths to knowledge.",
      "praxeology": "Good thoughts, words, and deeds are essential.",
      "axiology": "Truth and purity are supreme values.",
      "mythology": "Myth narrates the cosmic drama of light vs. darkness.",
      "cosmology": "Cosmos is a battleground for order and chaos.",
      "teleology": "Purpose is the ultimate triumph of light."
    },
    "tags": ["religious", "ancient", "persian", "dualism"]
  },
  {
    "title": "Shinto",
    "category": "religious - Worldview",
    "summary": "The indigenous spirituality of Japan, centering on reverence for kami (spirits) in nature and ancestral tradition.",
    "icon": "\u26E9️", // ⛩️ (Shinto Shrine)
    "scores": {
      "ontology": 0.7,
      "epistemology": 0.5,
      "praxeology": 0.8,
      "axiology": 0.7,
      "mythology": 0.9,
      "cosmology": 0.6,
      "teleology": 0.6
    },
    "facetDescriptions": {
      "ontology": "World inhabited by kami (sacred presences) in all things.",
      "epistemology": "Knowledge comes from tradition and ritual experience.",
      "praxeology": "Practice is honoring kami and preserving purity.",
      "axiology": "Respect, purity, and harmony are core values.",
      "mythology": "Myth shapes the spiritual and social order.",
      "cosmology": "Cosmos is interconnected and animated.",
      "teleology": "Purpose is harmonious living with nature and ancestors."
    },
    "tags": ["religious", "indigenous", "japanese"]
  },
  {
    "title": "Sikhism",
    "category": "religious - Worldview",
    "summary": "A monotheistic Indian religion founded by Guru Nanak, teaching devotion, equality, and service.",
    "icon": "\u262C",  // ☬ (Khanda)
    "scores": {
      "ontology": 0.9,
      "epistemology": 0.8,
      "praxeology": 0.9,
      "axiology": 0.9,
      "mythology": 0.7,
      "cosmology": 0.7,
      "teleology": 0.9
    },
    "facetDescriptions": {
      "ontology": "One divine reality pervades all.",
      "epistemology": "Truth revealed by Guru and selfless living.",
      "praxeology": "Service, justice, and devotion are central practices.",
      "axiology": "Equality and compassion guide ethics.",
      "mythology": "Stories of Gurus guide moral vision.",
      "cosmology": "Creation as divine play (lila).",
      "teleology": "Union with God is life’s goal."
    },
    "tags": ["religious", "monotheistic", "indian"]
  },
  {
    "title": "Transhumanism",
    "category": "philosophical - Worldview",
    "summary": "A movement advocating for transforming the human condition via advanced technology, reason, and science.",
    "icon": "\uD83E\uDDBF", // 🦾 (Mechanical Arm)
    "scores": {
      "ontology": 0.3,
      "epistemology": 0.9,
      "praxeology": 0.9,
      "axiology": 0.7,
      "mythology": 0.2,
      "cosmology": 0.5,
      "teleology": 0.9
    },
    "facetDescriptions": {
      "ontology": "Reality is material and technologically malleable.",
      "epistemology": "Knowledge expands through science and innovation.",
      "praxeology": "Ethics guide responsible enhancement.",
      "axiology": "Human flourishing and intelligence are values.",
      "mythology": "Myth is repurposed for scientific narrative.",
      "cosmology": "Universe is a frontier for exploration.",
      "teleology": "Aim is transcending biological limitations."
    },
    "tags": ["philosophical", "futurism", "technology"]
  },
  {
    "title": "Wicca",
    "category": "religious - Worldview",
    "summary": "A modern pagan religion honoring nature, cycles, and the divine feminine and masculine.",
    "icon": "\uD83C\uDF19", // 🌙 (Crescent Moon)
    "scores": {
      "ontology": 0.7,
      "epistemology": 0.6,
      "praxeology": 0.8,
      "axiology": 0.8,
      "mythology": 0.9,
      "cosmology": 0.7,
      "teleology": 0.7
    },
    "facetDescriptions": {
      "ontology": "Nature is sacred and divine.",
      "epistemology": "Knowledge arises from experience and ritual.",
      "praxeology": "Practice involves ritual, magic, and attunement.",
      "axiology": "Balance, harm none, and celebrate life.",
      "mythology": "Myth cycles (Wheel of the Year) guide practice.",
      "cosmology": "World is cyclical and interconnected.",
      "teleology": "Purpose is harmony with nature’s cycles."
    },
    "tags": ["pagan", "nature", "spiritual"]
  }
]