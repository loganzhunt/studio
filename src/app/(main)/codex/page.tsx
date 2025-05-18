
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
  // Platonism is in ADDITIONAL_CODEX_DATA now to be potentially overridden
  // Aristotelianism removed as it's in LATEST_CODEX_UPDATE_BATCH
  // Stoicism is in ADDITIONAL_CODEX_DATA now to be potentially overridden
  {
    "name": "Taoism", // or title
    "summary": "A spiritual tradition rooted in the Tao, the ineffable source of all. Emphasizes harmony, non-action, and flowing with nature.",
    "scores": { "ontology": 0.65, "epistemology": 0.7, "praxeology": 0.55, "axiology": 0.8, "mythology": 0.75, "cosmology": 0.8, "teleology": 0.65 },
    "facetDescriptions": { "ontology": "Ultimate reality is the Tao.", "epistemology": "Wisdom arises from attunement, not analysis.", "praxeology": "Wu wei (non-action) and flexibility.", "axiology": "Harmony is the supreme value.", "mythology": "Rich in cosmological myth and parable.", "cosmology": "Cosmos flows as a spontaneous order.", "teleology": "Purpose is spontaneous unfolding." },
    "tags": ["spiritual", "eastern", "nature"]
  },
  {
    "name": "Scientific Materialism", // or title
    "summary": "A worldview grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    "scores": { "ontology": 0.95, "epistemology": 0.9, "praxeology": 0.6, "axiology": 0.6, "mythology": 0.15, "cosmology": 0.85, "teleology": 0.2 },
    "facetDescriptions": { "ontology": "Only physical matter truly exists.", "epistemology": "Knowledge is gained through observation and experiment.", "praxeology": "Actions should be evidence-based.", "axiology": "Value arises from outcomes and utility.", "mythology": "Skeptical of myth and legend.", "cosmology": "The universe is physical and governed by laws.", "teleology": "No inherent purpose beyond survival." },
    "tags": ["scientific", "empirical", "modern"]
  },
  // Christianity removed as it's in LATEST_CODEX_UPDATE_BATCH
  // Buddhism removed as it's in LATEST_CODEX_UPDATE_BATCH
  // Existentialism is in ADDITIONAL_CODEX_DATA
  {
    "name": "Mystical Sufism", // or title
    "summary": "A mystical Islamic tradition seeking direct experience of the Divine through love, devotion, and spiritual practice.",
    "scores": { "ontology": 0.75, "epistemology": 0.75, "praxeology": 0.8, "axiology": 0.85, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.95 },
    "facetDescriptions": { "ontology": "God is immanent and transcendent.", "epistemology": "Inner knowing (gnosis) and revelation.", "praxeology": "Love and devotion as practice.", "axiology": "Union with God is the highest value.", "mythology": "Sufi poetry and parables.", "cosmology": "Creation as reflection of the Divine.", "teleology": "Purpose is return to the Beloved." },
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
    "scores": { "ontology": 0.25, "epistemology": 0.15, "praxeology": 0.40, "axiology": 0.45, "mythology": 0.20, "cosmology": 0.20, "teleology": 0.20 },
    "facetDescriptions": { "ontology": "Materialist-leaning; reality is physical, pleasure and pain are bodily.", "epistemology": "Radically empirical; knowledge from sensation and experience.", "praxeology": "Moderate individualism; seeks personal tranquility and prudence.", "axiology": "Values ataraxia (peace of mind), friendship, and absence of pain.", "mythology": "Minimal mythos; challenges superstitions and fears.", "cosmology": "Mechanistic and naturalistic; no intervention by gods.", "teleology": "Purpose is self-directed happiness, not divine destiny." },
    "tags": ["philosophical", "ethics", "hedonism"]
  },
  {
    "title": "Existentialism",
    "category": "philosophical - Worldview",
    "summary": "A philosophical movement emphasizing individual existence, freedom, and the search for authentic meaning in an indifferent universe.",
    "icon": "\u2203",  // ∃ (Logical existential quantifier)
    "scores": { "ontology": 0.30, "epistemology": 0.30, "praxeology": 0.55, "axiology": 0.35, "mythology": 0.25, "cosmology": 0.25, "teleology": 0.05 },
    "facetDescriptions": { "ontology": "Materialist and existential; reality is brute fact, not essence.", "epistemology": "Leans empirical; values personal experience over dogma.", "praxeology": "Emphasizes individual freedom, authenticity, and responsibility.", "axiology": "Values subjective meaning, authenticity, and self-definition.", "mythology": "Skeptical of traditional myths; embraces existential narrative.", "cosmology": "Mechanistic and indifferent; cosmos lacks intrinsic order.", "teleology": "Existential; meaning and purpose are self-created." },
    "tags": ["philosophical", "modern", "authenticity"]
  },
  {
    "title": "Gnosticism",
    "category": "religious - Worldview",
    "summary": "A mystical and dualistic tradition emphasizing secret knowledge (gnosis) and inner spiritual awakening.",
    "icon": "\u25B3",  // ⟁ (White up-pointing triangle) - Note: This might not render consistently across all systems, consider alternative simple icon.
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
    "icon": "\u26A4",  // ⚤ (Interlocked male and female signs) - Consider if this icon is most appropriate.
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
    "title": "Mystical Sufism",
    "category": "religious - Worldview", // Corrected from 'mystical - Worldview' to be consistent
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
  }
]