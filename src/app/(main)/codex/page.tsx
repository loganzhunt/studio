
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
import { Badge } from '@/components/ui/badge'; 
import { getFacetColorHsl } from '@/lib/colors'; 
import { useWorldview } from '@/hooks/use-worldview';
import { useToast } from '@/hooks/use-toast';

// --- Data Definitions ---

// Base set of worldviews, might be overridden by later batches if names match.
const BASE_CODEX_DATA: any[] = [
  {
    "name": "Taoism",
    "summary": "A spiritual tradition rooted in the Tao, the ineffable source of all. Emphasizes harmony, non-action, and flowing with nature.",
    "domainScores": { "ontology": 0.65, "epistemology": 0.7, "praxeology": 0.55, "axiology": 0.8, "mythology": 0.75, "cosmology": 0.8, "teleology": 0.65 },
    "facetSummaries": { "ontology": "Ultimate reality is the Tao.", "epistemology": "Wisdom arises from attunement, not analysis.", "praxeology": "Wu wei (non-action) and flexibility.", "axiology": "Harmony is the supreme value.", "mythology": "Rich in cosmological myth and parable.", "cosmology": "Cosmos flows as a spontaneous order.", "teleology": "Purpose is spontaneous unfolding." },
    "tags": ["spiritual", "eastern", "nature"]
  },
  {
    "name": "Scientific Materialism",
    "summary": "A worldview grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    "domainScores": { "ontology": 0.95, "epistemology": 0.9, "praxeology": 0.6, "axiology": 0.6, "mythology": 0.15, "cosmology": 0.85, "teleology": 0.2 },
    "facetSummaries": { "ontology": "Only physical matter truly exists.", "epistemology": "Knowledge is gained through observation and experiment.", "praxeology": "Actions should be evidence-based.", "axiology": "Value arises from outcomes and utility.", "mythology": "Skeptical of myth and legend.", "cosmology": "The universe is physical and governed by laws.", "teleology": "No inherent purpose beyond survival." },
    "tags": ["scientific", "empirical", "modern"]
  },
  {
    "name": "Mystical Sufism", // Renamed to avoid direct clash if "Sufism" is added later
    "summary": "A mystical Islamic tradition seeking direct experience of the Divine through love, devotion, and spiritual practice.",
    "domainScores": { "ontology": 0.75, "epistemology": 0.75, "praxeology": 0.8, "axiology": 0.85, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.95 },
    "facetSummaries": { "ontology": "God is immanent and transcendent.", "epistemology": "Inner knowing (gnosis) and revelation.", "praxeology": "Love and devotion as practice.", "axiology": "Union with God is the highest value.", "mythology": "Sufi poetry and parables.", "cosmology": "Creation as reflection of the Divine.", "teleology": "Purpose is return to the Beloved." },
    "tags": ["mystical", "islamic", "spiritual"]
  }
];

// Latest batch, takes precedence over BASE_CODEX_DATA and ADDITIONAL_CODEX_DATA if titles match
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
    "facetDescriptions": { "ontology": "Strongly materialist; what is real is what can be sensed.", "epistemology": "Radically empirical; all knowledge begins with experience.", "praxeology": "Moderate individualism; action guided by evidence.", "axiology": "Values truth, clarity, and observational reliability.", "mythology": "Rejects myth; trusts only observed reality.", "cosmology": "Mechanistic; reality is a lawful, observable system.", "teleology": "Purpose is emergent, not predetermined." }
  }
];

// Additional batches of data, takes precedence over BASE_CODEX_DATA if titles match.
const ADDITIONAL_CODEX_DATA: any[] = [
  {
    "title": "Epicureanism",
    "category": "philosophical - Worldview",
    "summary": "An ancient philosophy prioritizing the pursuit of pleasure and avoidance of pain through modest living and rational thought.",
    "icon": "\u2698",  // ⚘ (Flower, still appropriate)
    "scores": { "ontology": 0.25, "epistemology": 0.15, "praxeology": 0.40, "axiology": 0.45, "mythology": 0.20, "cosmology": 0.20, "teleology": 0.20 },
    "facetDescriptions": { "ontology": "Materialist-leaning; reality is physical, pleasure and pain are bodily.", "epistemology": "Radically empirical; knowledge from sensation and experience.", "praxeology": "Moderate individualism; seeks personal tranquility and prudence.", "axiology": "Values ataraxia (peace of mind), friendship, and absence of pain.", "mythology": "Minimal mythos; challenges superstitions and fears.", "cosmology": "Mechanistic and naturalistic; no intervention by gods.", "teleology": "Purpose is self-directed happiness, not divine destiny." },
    "tags": ["philosophical", "ethics", "hedonism"]
  },
  {
    "title": "Existentialism",
    "category": "philosophical - Worldview",
    "summary": "A modern philosophy focusing on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    "icon": "\u2203",  // ∃ (Logical existential quantifier)
    "scores": { "ontology": 0.30, "epistemology": 0.30, "praxeology": 0.55, "axiology": 0.35, "mythology": 0.25, "cosmology": 0.25, "teleology": 0.05 },
    "facetDescriptions": { "ontology": "Materialist and existential; reality is brute fact, not essence.", "epistemology": "Leans empirical; values personal experience over dogma.", "praxeology": "Emphasizes individual freedom, authenticity, and responsibility.", "axiology": "Values subjective meaning, authenticity, and self-definition.", "mythology": "Skeptical of traditional myths; embraces existential narrative.", "cosmology": "Mechanistic and indifferent; cosmos lacks intrinsic order.", "teleology": "Existential; meaning and purpose are self-created." },
    "tags": ["philosophical", "modern", "authenticity"]
  },
  {
    "title": "Gnosticism",
    "category": "religious - Worldview",
    "summary": "A mystical and dualistic tradition emphasizing secret knowledge (gnosis) and inner spiritual awakening.",
    "icon": "\u25B3",  // ⟁ (White up-pointing triangle) 
    "scores": { "ontology": 0.90, "epistemology": 0.80, "praxeology": 0.50, "axiology": 0.60, "mythology": 0.95, "cosmology": 0.75, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Idealist; spiritual reality is primary, material world is shadow.", "epistemology": "Highly revelatory; true knowledge is inner and secret.", "praxeology": "Balancing individual ascent with esoteric community.", "axiology": "Values liberation, spiritual truth, and transcendence.", "mythology": "Rich in cosmological myth and allegory.", "cosmology": "Dualistic; cosmic battle of light and darkness.", "teleology": "Divine purpose is return to the source, spiritual union." },
    "tags": ["mystical", "dualism", "spiritual"]
  },
  {
    "title": "Hinduism",
    "category": "religious - Worldview",
    "summary": "A diverse religious tradition rooted in India, focusing on dharma, karma, reincarnation, and the pursuit of liberation (moksha).",
    "icon": "\u0950",  // ॐ (Om, still appropriate)
    "scores": { "ontology": 0.85, "epistemology": 0.80, "praxeology": 0.50, "axiology": 0.80, "mythology": 0.90, "cosmology": 0.90, "teleology": 0.95 },
    "facetDescriptions": { "ontology": "Idealist; all forms are expressions of ultimate consciousness (Brahman).", "epistemology": "Blends revelatory scripture (Veda) with personal realization.", "praxeology": "Balances individual and communal dharma (duty/ethics).", "axiology": "Values liberation, devotion, and spiritual harmony.", "mythology": "Rich and multi-layered, full of gods, avatars, and epics.", "cosmology": "Holistic and cyclical; creation and dissolution are infinite.", "teleology": "Ultimate purpose is moksha—liberation and union with the divine." },
    "tags": ["religious", "eastern", "dharma"]
  },
  {
    "title": "Humanism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical and ethical stance that values human agency, rationality, and well-being, often without reliance on the supernatural.",
    "icon": "\u26A4",  // ⚤ (Interlocked male and female signs)
    "scores": { "ontology": 0.30, "epistemology": 0.20, "praxeology": 0.45, "axiology": 0.45, "mythology": 0.15, "cosmology": 0.20, "teleology": 0.10 },
    "facetDescriptions": { "ontology": "Materialist; reality is human-centered and empirical.", "epistemology": "Leans empirical, values science and critical inquiry.", "praxeology": "Values individual agency and collective progress.", "axiology": "Prioritizes dignity, ethics, and human flourishing.", "mythology": "Rejects supernatural myth; may use secular narratives.", "cosmology": "Mechanistic; universe is knowable and non-personal.", "teleology": "Purpose is human-created and existential." },
    "tags": ["philosophical", "ethics", "secular"]
  },
  {
    "title": "Islam",
    "category": "religious - Worldview",
    "summary": "A monotheistic Abrahamic faith rooted in the revelation to Muhammad, emphasizing submission to God (Allah) and the unity of creation.",
    "icon": "\u262A",  // ☪ (Star and Crescent, unchanged)
    "scores": { "ontology": 0.70, "epistemology": 0.75, "praxeology": 0.60, "axiology": 0.65, "mythology": 0.80, "cosmology": 0.85, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist; Allah is the ultimate reality, creation is meaningful.", "epistemology": "Strongly revelatory; the Qur’an and prophetic tradition.", "praxeology": "Moderately hierarchical; guided by Sharia and tradition.", "axiology": "Centers on submission, justice, and mercy.", "mythology": "Rich mythos—prophets, angels, creation, judgment.", "cosmology": "Holistic; universe is ordered and purposeful.", "teleology": "Ultimate purpose is to submit to God and attain paradise." },
    "tags": ["religious", "monotheistic", "abrahamic"]
  },
  {
    "title": "Jainism",
    "category": "religious - Worldview",
    "summary": "An ancient Indian religion emphasizing non-violence (ahimsa), karma, and the liberation of the soul through self-discipline.",
    "icon": "\u534D",  // 卍 (Jain swastika)
    "scores": { "ontology": 0.80, "epistemology": 0.70, "praxeology": 0.45, "axiology": 0.85, "mythology": 0.60, "cosmology": 0.70, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist; consciousness (jiva) is the core of reality.", "epistemology": "Revelatory and experiential; emphasizes inner purity.", "praxeology": "Balance between strict discipline and communal harmony.", "axiology": "Prioritizes non-violence, self-restraint, and compassion.", "mythology": "Stories of tirthankaras and cosmic cycles.", "cosmology": "Cyclical universe with moral causality.", "teleology": "Purpose is spiritual liberation from karma." },
    "tags": ["religious", "eastern", "ahimsa"]
  },
  {
    "title": "Judaism",
    "category": "religious - Worldview",
    "summary": "An ancient monotheistic tradition centered on covenant, law (Torah), and the ongoing relationship between God and the Jewish people.",
    "icon": "\u2721",  // ✡ (Star of David, unchanged)
    "scores": { "ontology": 0.60, "epistemology": 0.70, "praxeology": 0.60, "axiology": 0.65, "mythology": 0.85, "cosmology": 0.75, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Idealist; God is ultimate reality, covenant is foundational.", "epistemology": "Blends revelation (Torah) and communal interpretation.", "praxeology": "Moderate hierarchy; follows halakha (Jewish law).", "axiology": "Values justice, community, and remembrance.", "mythology": "Rich stories—Exodus, prophets, exile, return.", "cosmology": "Holistic, with sacred time and divine order.", "teleology": "Purpose is tikkun olam (repairing the world) and covenantal faithfulness." },
    "tags": ["religious", "monotheistic", "abrahamic"]
  },
  {
    "title": "Kabbalah",
    "category": "religious - Worldview",
    "summary": "A mystical tradition within Judaism that explores the hidden dimensions of God, creation, and the human soul.",
    "icon": "\u05CE",  // ֎ (Hebrew symbol)
    "scores": { "ontology": 0.80, "epistemology": 0.80, "praxeology": 0.60, "axiology": 0.70, "mythology": 0.90, "cosmology": 0.90, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Idealist and mystical; reality is multi-layered and symbolic.", "epistemology": "Revelatory and esoteric; knowledge through mystical insight.", "praxeology": "Ritual and symbolic acts connect microcosm and macrocosm.", "axiology": "Values spiritual transformation and alignment with divine.", "mythology": "Complex mythos—sefirot, emanations, and cosmic repair.", "cosmology": "Holistic and interwoven; all creation reflects divine order.", "teleology": "Purpose is mystical union and tikkun (healing the world)." },
    "tags": ["mystical", "jewish", "esoteric"]
  },
  {
    "title": "Mahayana Buddhism",
    "category": "religious - Worldview",
    "summary": "A broad Buddhist tradition emphasizing universal compassion, the bodhisattva path, and emptiness (shunyata).",
    "icon": "\u06DE",  // ۞ (Auspicious star symbol)
    "scores": { "ontology": 0.55, "epistemology": 0.55, "praxeology": 0.65, "axiology": 0.80, "mythology": 0.75, "cosmology": 0.70, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Middle way; reality is empty, relational, and compassionate.", "epistemology": "Balances empirical practice and revelatory wisdom.", "praxeology": "Focus on universal compassion (bodhisattva ideal).", "axiology": "Values selflessness, compassion, and liberation for all.", "mythology": "Expansive mythos—Buddhas, bodhisattvas, cosmic Buddhalands.", "cosmology": "Cyclical worlds and realms; interconnectedness.", "teleology": "Purpose is universal awakening (Buddhahood) for all beings." },
    "tags": ["spiritual", "buddhist", "compassion"]
  },
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
  {
    "title": "Mystical Sufism", // This might duplicate an earlier "Mystical Sufism" or just "Sufism"
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
  {
    "title": "Platonism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical tradition centered on transcendent forms and the pursuit of the Good. Emphasizes reason, idealism, and the distinction between appearances and true reality.",
    "icon": "\u03A6",  // Φ (Greek capital letter phi)
    "scores": { "ontology": 0.90, "epistemology": 0.80, "praxeology": 0.45, "axiology": 0.65, "mythology": 0.70, "cosmology": 0.80, "teleology": 0.75 },
    "facetDescriptions": { "ontology": "Idealist; reality is grounded in transcendent forms.", "epistemology": "Rationalist; knowledge through dialectic, contemplation.", "praxeology": "Emphasizes virtue, alignment with the Good.", "axiology": "Values truth, beauty, and harmony.", "mythology": "Allegories and myths point to metaphysical truths.", "cosmology": "Orderly, rational cosmos shaped by ideal patterns.", "teleology": "Purpose is ascent toward the Good and intellectual/spiritual perfection." }
  },
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
    "category": "custom - Worldview", // Note: category is "custom" for this example
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
  {
    "title": "Sikhism",
    "category": "religious - Worldview",
    "summary": "A monotheistic Indian religion founded by Guru Nanak, teaching devotion, equality, and service.",
    "icon": "\u262C",  // ☬ (Khanda)
    "scores": { "ontology": 0.90, "epistemology": 0.80, "praxeology": 0.90, "axiology": 0.90, "mythology": 0.70, "cosmology": 0.70, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "One divine reality pervades all.", "epistemology": "Truth revealed by Guru and selfless living.", "praxeology": "Service, justice, and devotion are central practices.", "axiology": "Equality and compassion guide ethics.", "mythology": "Stories of Gurus guide moral vision.", "cosmology": "Creation as divine play (lila).", "teleology": "Union with God is life’s goal." }
  },
  {
    "title": "Stoicism",
    "category": "philosophical - Worldview",
    "summary": "A Greco-Roman philosophy teaching virtue, self-control, and alignment with nature's order.",
    "icon": "\u2693",  // ⚓ (Anchor, symbolizing stability)
    "scores": { "ontology": 0.70, "epistemology": 0.80, "praxeology": 1.00, "axiology": 0.90, "mythology": 0.30, "cosmology": 0.80, "teleology": 1.00 },
    "facetDescriptions": { "ontology": "Nature is rational and ordered.", "epistemology": "Wisdom comes through reason and reflection.", "praxeology": "Virtue is practiced through self-mastery.", "axiology": "Virtue is the highest good.", "mythology": "Myth is subordinate to philosophy.", "cosmology": "World is a living, rational organism.", "teleology": "Goal is to live in harmony with nature." }
  },
  {
    "title": "Sufism",
    "category": "religious - Worldview",
    "summary": "The mystical dimension of Islam, focusing on direct experience of God through love and devotion.",
    "icon": "\u272A",  // ⟊ (Heart with point)
    "scores": { "ontology": 0.90, "epistemology": 0.80, "praxeology": 0.80, "axiology": 0.90, "mythology": 0.90, "cosmology": 0.80, "teleology": 1.00 },
    "facetDescriptions": { "ontology": "God is the only true reality.", "epistemology": "Truth found in direct mystical experience.", "praxeology": "Practice is remembrance (dhikr) and love.", "axiology": "Love and selfless devotion are highest values.", "mythology": "Poetry and parable express divine realities.", "cosmology": "Creation is a reflection of God’s beauty.", "teleology": "Aim is annihilation of the self in God (fana)." }
  },
  {
    "title": "Taoism",
    "category": "religious - Worldview",
    "summary": "An ancient Chinese tradition emphasizing harmony with the Tao (the Way), simplicity, and naturalness.",
    "icon": "\u262F",  // ☯ (Yin Yang)
    "scores": { "ontology": 0.80, "epistemology": 0.70, "praxeology": 0.80, "axiology": 0.80, "mythology": 0.80, "cosmology": 0.80, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Reality is a dynamic, living process (Tao).", "epistemology": "Wisdom comes from contemplation and experience.", "praxeology": "Action flows from non-action (wu wei).", "axiology": "Simplicity, spontaneity, and humility are valued.", "mythology": "Myths illustrate cosmic order and paradox.", "cosmology": "Yin and yang structure all phenomena.", "teleology": "Goal is harmony and balance with Tao." }
  },
  {
    "title": "Theosophy",
    "category": "religious - Worldview",
    "summary": "A mystical movement synthesizing Eastern and Western traditions, teaching spiritual evolution, karma, and hidden wisdom.",
    "icon": "\u262F\u2721", // Combining Yin Yang and Star of David for synthesis
    "scores": { "ontology": 0.90, "epistemology": 0.70, "praxeology": 0.60, "axiology": 0.80, "mythology": 0.90, "cosmology": 0.90, "teleology": 1.00 },
    "facetDescriptions": { "ontology": "Spiritual planes underlie material reality.", "epistemology": "Intuition and esoteric study reveal hidden truths.", "praxeology": "Actions influence karma and spiritual evolution.", "axiology": "Wisdom, altruism, and service are highest values.", "mythology": "Myth encodes perennial teachings.", "cosmology": "The cosmos is a hierarchy of evolving worlds.", "teleology": "Purpose is spiritual ascent and union with the divine." }
  },
  {
    "title": "Theravada Buddhism",
    "category": "religious - Worldview",
    "summary": "The earliest form of Buddhism, emphasizing individual enlightenment through ethical conduct, meditation, and insight.",
    "icon": "\uE00B",  // (Placeholder for a specific Theravada symbol like a simple Dhamma wheel)
    "scores": { "ontology": 0.80, "epistemology": 0.70, "praxeology": 1.00, "axiology": 0.80, "mythology": 0.60, "cosmology": 0.70, "teleology": 1.00 },
    "facetDescriptions": { "ontology": "All phenomena are impermanent and non-self.", "epistemology": "Knowledge arises from direct meditative insight.", "praxeology": "Ethical conduct and meditation are the path.", "axiology": "Wisdom and compassion guide action.", "mythology": "Myth provides context for ethical practice.", "cosmology": "The universe cycles through endless rebirths.", "teleology": "Purpose is liberation from suffering (nirvana)." }
  },
  {
    "title": "Transcendentalism",
    "category": "philosophical - Worldview",
    "summary": "A 19th-century American movement emphasizing the inherent goodness of people and nature, and the primacy of intuition.",
    "icon": "\u2747",  // ❄ (Snowflake, unique and natural)
    "scores": { "ontology": 0.80, "epistemology": 0.60, "praxeology": 0.70, "axiology": 0.80, "mythology": 0.70, "cosmology": 0.60, "teleology": 0.70 },
    "facetDescriptions": { "ontology": "Spirit pervades all nature and humanity.", "epistemology": "Intuition and self-reliance are paths to truth.", "praxeology": "Nonconformity and individual action are prized.", "axiology": "Truth and authenticity are highest values.", "mythology": "Nature is the living symbol of Spirit.", "cosmology": "Nature is harmonious and interconnected.", "teleology": "Aim is self-cultivation and spiritual realization." }
  },
  {
    "title": "Transhumanism",
    "category": "philosophical - Worldview",
    "summary": "A movement advocating for transforming the human condition via advanced technology, reason, and science.",
    "icon": "\u26A1",  // ⚡ (High voltage, technology)
    "scores": { "ontology": 0.30, "epistemology": 0.90, "praxeology": 0.90, "axiology": 0.70, "mythology": 0.20, "cosmology": 0.50, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Reality is material and technologically malleable.", "epistemology": "Knowledge expands through science and innovation.", "praxeology": "Ethics guide responsible enhancement.", "axiology": "Human flourishing and intelligence are values.", "mythology": "Myth is repurposed for scientific narrative.", "cosmology": "Universe is a frontier for exploration.", "teleology": "Aim is transcending biological limitations." }
  },
  {
    "title": "Unitarian Universalism",
    "category": "religious - Worldview",
    "summary": "A pluralistic, open faith affirming freedom of belief and valuing wisdom from all traditions.",
    "icon": "\u26E8",  // ⛨ (Chalioce with flame)
    "scores": { "ontology": 0.50, "epistemology": 0.70, "praxeology": 0.80, "axiology": 0.90, "mythology": 0.50, "cosmology": 0.50, "teleology": 0.70 },
    "facetDescriptions": { "ontology": "Reality is open to diverse interpretations.", "epistemology": "Truth is sought through reason, experience, and tradition.", "praxeology": "Action pursues justice and compassion.", "axiology": "Dignity, equity, and community are core values.", "mythology": "Wisdom is found in many stories.", "cosmology": "Many cosmologies coexist.", "teleology": "Purpose is self-actualization and service." }
  },
  {
    "title": "Wicca",
    "category": "religious - Worldview",
    "summary": "A modern pagan religion honoring nature, cycles, and the divine feminine and masculine.",
    "icon": "\u263E",  // ☾ (Crescent moon)
    "scores": { "ontology": 0.70, "epistemology": 0.60, "praxeology": 0.80, "axiology": 0.80, "mythology": 0.90, "cosmology": 0.70, "teleology": 0.70 },
    "facetDescriptions": { "ontology": "Nature is sacred and divine.", "epistemology": "Knowledge arises from experience and ritual.", "praxeology": "Practice involves ritual, magic, and attunement.", "axiology": "Balance, harm none, and celebrate life.", "mythology": "Myth cycles (Wheel of the Year) guide practice.", "cosmology": "World is cyclical and interconnected.", "teleology": "Purpose is harmony with nature’s cycles." }
  },
  {
    "title": "Zoroastrianism",
    "category": "religious - Worldview",
    "summary": "An ancient Persian faith centering on duality between truth and falsehood, light and darkness.",
    "icon": "\uE00A",  // (Placeholder for Faravahar symbol)
    "scores": { "ontology": 0.70, "epistemology": 0.60, "praxeology": 0.90, "axiology": 0.90, "mythology": 0.70, "cosmology": 0.70, "teleology": 0.90 },
    "facetDescriptions": { "ontology": "Duality of truth (asha) and falsehood (druj) defines reality.", "epistemology": "Revelation and reason are paths to knowledge.", "praxeology": "Ethical action upholds truth and order.", "axiology": "Purity and honesty are supreme values.", "mythology": "Myth narrates the cosmic drama of light vs. darkness.", "cosmology": "Cosmos is a battleground for order and chaos.", "teleology": "Purpose is the ultimate triumph of light." }
  }
]