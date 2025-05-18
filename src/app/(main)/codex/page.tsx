
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
  { "name": "Epicureanism", "summary": "An ancient philosophy prioritizing the pursuit of pleasure and avoidance of pain through modest living and rational thought.", "scores": { "ontology": 0.5, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.4 }, "facetDescriptions": { "ontology": "Reality consists of atoms and void; the material world is primary.", "epistemology": "Knowledge is attained through sensory experience and logical inference.", "praxeology": "Wise action seeks the highest pleasure and lowest pain.", "axiology": "Pleasure is the greatest good, especially intellectual and social pleasure.", "mythology": "Myths are allegories or projections of natural phenomena.", "cosmology": "The cosmos operates according to natural laws.", "teleology": "Life’s goal is a tranquil mind and body." }, tags: ["philosophical", "ethics", "hedonism"]},
  { "name": "Gnosticism", "summary": "A mystical and dualistic tradition emphasizing secret knowledge (gnosis) and inner spiritual awakening.", "scores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.5, "axiology": 0.6, "mythology": 0.9, "cosmology": 0.8, "teleology": 0.7 }, "facetDescriptions": { "ontology": "The material world is an illusion; true reality is spiritual.", "epistemology": "Knowledge is gained through inner revelation.", "praxeology": "Action is oriented toward liberation from material bondage.", "axiology": "Spiritual knowledge and purity are highest values.", "mythology": "Myths encode hidden truths and cosmological mysteries.", "cosmology": "The cosmos is a drama of light and darkness.", "teleology": "The goal is reunification with the divine source." }, tags: ["mystical", "dualism", "spiritual"]},
  { "name": "Hinduism", "summary": "A diverse religious tradition rooted in India, focusing on dharma, karma, reincarnation, and the pursuit of liberation (moksha).", "scores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.8, "teleology": 0.9 }, "facetDescriptions": { "ontology": "All is Brahman—reality is one, manifest in many forms.", "epistemology": "Knowledge arises from scripture, guru, and direct realization.", "praxeology": "Dharma prescribes right action according to role and stage of life.", "axiology": "Value is placed on harmony, non-harm, and spiritual growth.", "mythology": "Myths narrate cosmic cycles, gods, and divine play.", "cosmology": "The universe is cyclic and endlessly recreated.", "teleology": "The soul’s aim is liberation from the cycle of rebirth." }, tags: ["religious", "eastern", "dharma"]},
  { "name": "Humanism", "summary": "A philosophical and ethical stance that values human agency, rationality, and well-being, often without reliance on the supernatural.", "scores": { "ontology": 0.4, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.4 }, "facetDescriptions": { "ontology": "Reality is best understood through science and reason.", "epistemology": "Knowledge is derived from critical inquiry and evidence.", "praxeology": "Ethical action supports human dignity and flourishing.", "axiology": "Human well-being is the ultimate value.", "mythology": "Myths are seen as cultural products, not truths.", "cosmology": "The universe is a natural system open to investigation.", "teleology": "Meaning is created through human endeavor." }, tags: ["philosophical", "ethics", "secular"]},
  { "name": "Islam", "summary": "A monotheistic Abrahamic faith rooted in the revelation to Muhammad, emphasizing submission to God (Allah) and the unity of creation.", "scores": { "ontology": 0.8, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 1.0 }, "facetDescriptions": { "ontology": "All reality is created by and dependent upon God.", "epistemology": "Knowledge comes from divine revelation and rational reflection.", "praxeology": "Life is to be lived in accordance with God’s guidance (Sharia).", "axiology": "Justice, mercy, and faithfulness are highest values.", "mythology": "Stories of prophets teach moral and spiritual lessons.", "cosmology": "The cosmos is ordered, purposeful, and created.", "teleology": "Life’s aim is fulfillment of God’s will and paradise." }, tags: ["religious", "monotheistic", "abrahamic"]},
  { "name": "Jainism", "summary": "An ancient Indian religion emphasizing non-violence (ahimsa), karma, and the liberation of the soul through self-discipline.", "scores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 1.0, "axiology": 1.0, "mythology": 0.6, "cosmology": 0.8, "teleology": 1.0 }, "facetDescriptions": { "ontology": "Reality is eternal, with countless individual souls (jiva).", "epistemology": "Knowledge comes from scripture, reason, and intuition.", "praxeology": "Non-violence in thought, word, and deed is essential.", "axiology": "Compassion and truthfulness are supreme values.", "mythology": "Tirthankara stories model spiritual discipline.", "cosmology": "The universe is uncreated, eternal, and cyclical.", "teleology": "Soul’s aim is liberation from karma and rebirth." }, tags: ["religious", "eastern", "ahimsa"]},
  { "name": "Judaism", "summary": "An ancient monotheistic tradition centered on covenant, law (Torah), and the ongoing relationship between God and the Jewish people.", "scores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.8 }, "facetDescriptions": { "ontology": "God is the creator and sustainer of all.", "epistemology": "Knowledge is received through revelation and study.", "praxeology": "Lawful action fulfills the covenant and expresses holiness.", "axiology": "Justice, mercy, and study are core values.", "mythology": "Biblical narratives shape collective memory.", "cosmology": "The cosmos is ordered and purposeful.", "teleology": "History moves toward redemption and peace." }, tags: ["religious", "monotheistic", "abrahamic"]},
  { "name": "Kabbalah", "summary": "A mystical tradition within Judaism that explores the hidden dimensions of God, creation, and the human soul.", "scores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.9 }, "facetDescriptions": { "ontology": "Divine reality underlies the physical world.", "epistemology": "Knowledge is received through mystical contemplation.", "praxeology": "Rituals align the microcosm with the macrocosm.", "axiology": "Spiritual ascent and repair (tikkun) are key values.", "mythology": "Myths unveil the structure of the divine.", "cosmology": "Creation unfolds through divine emanations.", "teleology": "Purpose is reunion with the divine source." }, tags: ["mystical", "jewish", "esoteric"]},
  { "name": "Mahayana Buddhism", "summary": "A broad Buddhist tradition emphasizing universal compassion, the bodhisattva path, and emptiness (shunyata).", "scores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.8, "teleology": 1.0 }, "facetDescriptions": { "ontology": "All phenomena are empty of fixed nature.", "epistemology": "Wisdom is direct insight into emptiness.", "praxeology": "Compassionate action for all beings is central.", "axiology": "Selflessness and wisdom are highest values.", "mythology": "Stories of Buddhas and bodhisattvas inspire practice.", "cosmology": "Worlds arise and dissolve in interdependent cycles.", "teleology": "Aim is universal liberation (Buddhahood)." }, tags: ["spiritual", "buddhist", "compassion"]},
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
  // Stoicism removed as it's in BASE_CODEX_DATA and LATEST_CODEX_UPDATE_BATCH should take precedence
  // Sufism removed for same reason (Mystical Sufism in BASE_CODEX_DATA)
  // Taoism removed for same reason
  { "name": "Theosophy", "summary": "A mystical movement synthesizing Eastern and Western traditions, teaching spiritual evolution, karma, and hidden wisdom.", "scores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.6, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.9, "teleology": 1.0 }, "facetDescriptions": { "ontology": "Spiritual planes underlie material reality.", "epistemology": "Intuition and esoteric study reveal hidden truths.", "praxeology": "Actions influence karma and spiritual evolution.", "axiology": "Wisdom, altruism, and service are highest values.", "mythology": "Myth encodes perennial teachings.", "cosmology": "The cosmos is a hierarchy of evolving worlds.", "teleology": "Purpose is spiritual ascent and union with the divine." }, tags: ["mystical", "esoteric", "synthesis"]},
  { "name": "Theravada Buddhism", "summary": "The earliest form of Buddhism, emphasizing individual enlightenment through ethical conduct, meditation, and insight.", "scores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 1.0, "axiology": 0.8, "mythology": 0.6, "cosmology": 0.7, "teleology": 1.0 }, "facetDescriptions": { "ontology": "All phenomena are impermanent and non-self.", "epistemology": "Knowledge arises from direct meditative insight.", "praxeology": "Ethical conduct and meditation are the path.", "axiology": "Wisdom and compassion guide action.", "mythology": "Myth provides context for ethical practice.", "cosmology": "The universe cycles through endless rebirths.", "teleology": "Purpose is liberation from suffering (nirvana)." }, tags: ["spiritual", "buddhist", "meditation"]},
  { "name": "Transcendentalism", "summary": "A 19th-century American movement emphasizing the inherent goodness of people and nature, and the primacy of intuition.", "scores": { "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.7, "cosmology": 0.6, "teleology": 0.7 }, "facetDescriptions": { "ontology": "Spirit pervades all nature and humanity.", "epistemology": "Intuition and self-reliance are paths to truth.", "praxeology": "Nonconformity and individual action are prized.", "axiology": "Truth and authenticity are highest values.", "mythology": "Nature is the living symbol of Spirit.", "cosmology": "Nature is harmonious and interconnected.", "teleology": "Aim is self-cultivation and spiritual realization." }, tags: ["philosophical", "american", "nature", "intuition"]},
  { "name": "Unitarian Universalism", "summary": "A pluralistic faith embracing wisdom from all traditions and affirming freedom of belief and conscience.", "scores": { "ontology": 0.5, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.5, "cosmology": 0.5, "teleology": 0.7 }, "facetDescriptions": { "ontology": "Reality is open to diverse interpretations.", "epistemology": "Truth is sought through reason, experience, and tradition.", "praxeology": "Action pursues justice and compassion.", "axiology": "Dignity, equity, and community are core values.", "mythology": "Wisdom is found in many stories.", "cosmology": "Cosmos is explored through many lenses.", "teleology": "Purpose is self-actualization and service." }, tags: ["religious", "pluralistic", "liberal"]},
  { "name": "Vedanta", "summary": "A major school of Hindu philosophy teaching the unity of Atman (self) and Brahman (absolute reality).", "scores": { "ontology": 1.0, "epistemology": 0.8, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.9, "teleology": 1.0 }, "facetDescriptions": { "ontology": "Only Brahman is ultimately real; the world is appearance.", "epistemology": "Direct realization leads to knowledge of unity.", "praxeology": "Spiritual practice removes ignorance.", "axiology": "Liberation is the highest value.", "mythology": "Myth reveals the divine play (lila).", "cosmology": "The cosmos is cyclical, an expression of Brahman.", "teleology": "The goal is moksha—union with the Absolute." }, tags: ["spiritual", "hindu", "nonduality"]},
  { "name": "Zen Buddhism", "summary": "A school of Mahayana Buddhism emphasizing direct, wordless experience and sudden enlightenment.", "scores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.6, "cosmology": 0.7, "teleology": 0.8 }, "facetDescriptions": { "ontology": "All is empty, interdependent, and immediate.", "epistemology": "Intuitive, direct experience transcends concepts.", "praxeology": "Practice is zazen (sitting meditation) and daily mindfulness.", "axiology": "Simplicity, presence, and compassion are valued.", "mythology": "Koans and stories prompt insight, not dogma.", "cosmology": "The world is always already complete.", "teleology": "Goal is awakening to original nature." }, tags: ["spiritual", "buddhist", "zen", "meditation"]},
  { "name": "Zoroastrianism", "summary": "An ancient Persian religion centering on the cosmic struggle between truth and falsehood, light and darkness.", "scores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.9 }, "facetDescriptions": { "ontology": "Duality of truth (asha) and falsehood (druj) defines reality.", "epistemology": "Revelation and reason are paths to knowledge.", "praxeology": "Good thoughts, words, and deeds are essential.", "axiology": "Truth and purity are supreme values.", "mythology": "Myth narrates the cosmic drama of light vs. darkness.", "cosmology": "Cosmos is a battleground for order and chaos.", "teleology": "Purpose is the ultimate triumph of light." }, tags: ["religious", "ancient", "persian", "dualism"]},
  { "name": "Shinto", "summary": "The indigenous spirituality of Japan, centering on reverence for kami (spirits) in nature and ancestral tradition.", "scores": { "ontology": 0.7, "epistemology": 0.5, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.9, "cosmology": 0.6, "teleology": 0.6 }, "facetDescriptions": { "ontology": "World inhabited by kami (sacred presences) in all things.", "epistemology": "Knowledge comes from tradition and ritual experience.", "praxeology": "Practice is honoring kami and preserving purity.", "axiology": "Respect, purity, and harmony are core values.", "mythology": "Myth shapes the spiritual and social order.", "cosmology": "Cosmos is interconnected and animated.", "teleology": "Purpose is harmonious living with nature and ancestors." }, tags: ["religious", "indigenous", "japanese"]},
  { "name": "Sikhism", "summary": "A monotheistic Indian religion founded by Guru Nanak, teaching devotion, equality, and service.", "scores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.9 }, "facetDescriptions": { "ontology": "One divine reality pervades all.", "epistemology": "Truth revealed by Guru and selfless living.", "praxeology": "Service, justice, and devotion are central practices.", "axiology": "Equality and compassion guide ethics.", "mythology": "Stories of Gurus guide moral vision.", "cosmology": "Creation as divine play (lila).", "teleology": "Union with God is life’s goal." }, tags: ["religious", "monotheistic", "indian"]},
  { "name": "Transhumanism", "summary": "A movement advocating for transforming the human condition via advanced technology, reason, and science.", "scores": { "ontology": 0.3, "epistemology": 0.9, "praxeology": 0.9, "axiology": 0.7, "mythology": 0.2, "cosmology": 0.5, "teleology": 0.9 }, "facetDescriptions": { "ontology": "Reality is material and technologically malleable.", "epistemology": "Knowledge expands through science and innovation.", "praxeology": "Ethics guide responsible enhancement.", "axiology": "Human flourishing and intelligence are values.", "mythology": "Myth is repurposed for scientific narrative.", "cosmology": "Universe is a frontier for exploration.", "teleology": "Aim is transcending biological limitations." }, tags: ["philosophical", "futurism", "technology"]},
  { "name": "Wicca", "summary": "A modern pagan religion honoring nature, cycles, and the divine feminine and masculine.", "scores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.7, "teleology": 0.7 }, "facetDescriptions": { "ontology": "Nature is sacred and divine.", "epistemology": "Knowledge arises from experience and ritual.", "praxeology": "Practice involves ritual, magic, and attunement.", "axiology": "Balance, harm none, and celebrate life.", "mythology": "Myth cycles (Wheel of the Year) guide practice.", "cosmology": "World is cyclical and interconnected.", "teleology": "Purpose is harmony with nature’s cycles." }, tags: ["pagan", "nature", "spiritual"]},
];

// --- Helper Functions ---
// (Keep getDominantFacet as is)
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0];
  const validScores = scores.filter(s => s && typeof s.score === 'number');
  if (validScores.length === 0) return FACET_NAMES[0];
  return validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev).facetName || FACET_NAMES[0];
};

const mapRawDataToCodexEntries = (rawData: any[]): CodexEntry[] => {
  return rawData.map((rawItem): CodexEntry | null => {
    const title = rawItem.title || rawItem.name; // Prioritize title, fallback to name
    if (!rawItem || typeof title !== 'string') {
      console.error("mapRawDataToCodexEntries: Invalid raw data item (missing title/name)", rawItem);
      return null; 
    }

    const domainScoresArray: DomainScore[] = [];
    const rawScores = rawItem.scores || rawItem.domainScores; // Accept 'scores' or 'domainScores'
    
    if (rawScores && typeof rawScores === 'object') {
      FACET_NAMES.forEach(facetKey => {
        const score = rawScores[facetKey.toLowerCase() as keyof typeof rawScores] ?? rawScores[facetKey as keyof typeof rawScores];
        domainScoresArray.push({
          facetName: facetKey,
          score: (typeof score === 'number' && !isNaN(score)) ? Math.max(0, Math.min(1, score)) : 0.5 
        });
      });
    } else {
      FACET_NAMES.forEach(facetKey => {
        domainScoresArray.push({ facetName: facetKey, score: 0.5 });
      });
    }
    
    const facetSummariesProcessed: { [K_FacetName in FacetName]?: string } = {};
    // Use facetDescriptions first, then facetSummaries, then facetSummary as fallbacks
    const rawSummariesSource = rawItem.facetDescriptions || rawItem.facetSummaries || rawItem.facetSummary;
    if (rawSummariesSource && typeof rawSummariesSource === 'object') {
      for (const facetKey of FACET_NAMES) {
        const summary = rawSummariesSource[facetKey.toLowerCase() as keyof typeof rawSummariesSource] ?? rawSummariesSource[facetKey as keyof typeof rawSummariesSource];
        if (typeof summary === 'string') {
          facetSummariesProcessed[facetKey] = summary;
        }
      }
    }

    const tags = Array.isArray(rawItem.tags) ? rawItem.tags.map(String) : [];
    let categoryFromTags: CodexEntry['category'] = "custom"; // Default to custom
    
    const categoryString = typeof rawItem.category === 'string' ? rawItem.category.toLowerCase() : "";

    if (categoryString.includes("philosophical")) categoryFromTags = "philosophical";
    else if (categoryString.includes("religious")) categoryFromTags = "religious";
    else if (categoryString.includes("archetypal")) categoryFromTags = "archetypal";
    else if (tags.includes("philosophical") || tags.includes("philosophy")) categoryFromTags = "philosophical";
    else if (tags.includes("religious") || tags.includes("religion") || tags.includes("spiritual") || tags.includes("mystical") || tags.includes("indigenous") || tags.includes("pagan") ) categoryFromTags = "religious";
    else if (tags.includes("archetypal") || tags.includes("archetype")) categoryFromTags = "archetypal";
    else if (tags.includes("scientific")) categoryFromTags = "philosophical";
    else if (tags.includes("cultural")) categoryFromTags = "custom";

    return {
      id: title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, ''),
      title: title,
      summary: rawItem.summary || "No summary available.",
      domainScores: domainScoresArray,
      category: categoryFromTags,
      isArchetype: categoryFromTags === "archetypal" || tags.includes("archetypal") || tags.includes("archetype"),
      createdAt: rawItem.createdAt || new Date().toISOString(),
      tags: tags,
      icon: rawItem.icon, 
      facetSummaries: facetSummariesProcessed,
    };
  }).filter(entry => entry !== null) as CodexEntry[]; 
};


export default function CodexPage() {
  // console.log("CodexPage component function invoked"); 

  const { addSavedWorldview, savedWorldviews } = useWorldview();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title_asc");
  const [activeCategory, setActiveCategory] = useState<CodexEntry['category'] | "all">("all");
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const initialMappedEntries = useMemo(() => {
    // console.log("Processing raw Codex data in useMemo...");
    try {
      const allRawDataSources = [
        ...LATEST_CODEX_UPDATE_BATCH, 
        ...ADDITIONAL_CODEX_DATA,    
        ...BASE_CODEX_DATA,         
      ];

      const uniqueEntriesData: any[] = [];
      const processedTitles = new Set<string>();

      for (const item of allRawDataSources) {
        const effectiveTitle = item?.title || item?.name; 
        if (effectiveTitle && typeof effectiveTitle === 'string') {
          const lowerCaseTitle = effectiveTitle.toLowerCase();
          if (!processedTitles.has(lowerCaseTitle)) {
            const standardizedItem = {...item, title: effectiveTitle }; // Ensure 'title' field exists
            uniqueEntriesData.push(standardizedItem);
            processedTitles.add(lowerCaseTitle);
          }
        } else {
          // console.warn("Skipping item due to missing or invalid title/name:", item);
        }
      }
      // console.log("Unique raw entries count:", uniqueEntriesData.length);
      const mapped = mapRawDataToCodexEntries(uniqueEntriesData);
      // console.log("Mapped entries count:", mapped.length);
      return mapped;
    } catch (error) {
      console.error("Error processing raw Codex data in useMemo:", error);
      return []; 
    }
  }, []); 

  const filteredAndSortedEntries = useMemo(() => {
    if (!initialMappedEntries) return [];
    let entries = [...initialMappedEntries]; // Create a new array to avoid mutating the memoized one

    // Filter by category
    if (activeCategory !== "all") {
      entries = entries.filter(entry => entry.category === activeCategory);
    }

    // Filter by search term (title or summary)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      entries = entries.filter(entry =>
        (entry.title && entry.title.toLowerCase().includes(lowerSearchTerm)) ||
        (entry.summary && entry.summary.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Sort
    switch (sortBy) {
      case "title_asc":
        entries.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        entries.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "date_asc":
        entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "date_desc":
        entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      // Add more sort options if needed (e.g., by dominant facet)
    }
    return entries;
  }, [initialMappedEntries, searchTerm, sortBy, activeCategory]);

  const handleOpenDrawer = (entry: CodexEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleSaveCodexEntry = (entryToSave: CodexEntry) => {
    if (savedWorldviews.some(sw => sw.id === entryToSave.id && sw.title === entryToSave.title)) {
      toast({ title: "Already Saved", description: `"${entryToSave.title}" is already in your saved worldviews.` });
      return;
    }
    addSavedWorldview(entryToSave); 
  };

  const CodexCard = ({ entry }: { entry: CodexEntry }) => {
    const dominantFacet = getDominantFacet(entry.domainScores);
    const titleColor = getFacetColorHsl(dominantFacet);
    
    return (
      <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {entry.icon && <span className="text-2xl mr-1">{entry.icon}</span>}
            <CardTitle className="text-xl md:text-lg line-clamp-1" style={{ color: titleColor }}>{entry.title}</CardTitle>
          </div>
          <CardDescription className="text-xs capitalize">{entry.category} - {entry.isArchetype ? "Archetype" : "Worldview"}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3 h-16">{entry.summary}</p>
          <div className="flex justify-center mb-3">
             <TriangleChart scores={entry.domainScores} width={150} height={130} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-border/30 mt-auto">
          <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenDrawer(entry)}>
            View Details <Icons.chevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const categories: (CodexEntry['category'] | "all")[] = ["all", "philosophical", "religious", "archetypal", "custom"];


  if (!initialMappedEntries) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Icons.loader className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading Codex entries...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3">The Codex</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore a library of diverse worldviews, philosophical systems, religious traditions, and archetypal patterns.
        </p>
      </header>

      <Card className="mb-8 p-4 sm:p-6 glassmorphic-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search-codex" className="block text-sm font-medium text-muted-foreground mb-1">Search Codex</label>
            <Input
              id="search-codex"
              type="text"
              placeholder="Search by title or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div>
            <label htmlFor="sort-codex" className="block text-sm font-medium text-muted-foreground mb-1">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-codex" className="bg-background/50">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                <SelectItem value="date_desc">Date Added (Newest)</SelectItem>
                <SelectItem value="date_asc">Date Added (Oldest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Filter by Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {filteredAndSortedEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedEntries.map((entry) => (
            <CodexCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icons.search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No Codex entries match your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}

      {selectedEntry && (
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl" side="right">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SheetHeader className="mb-6">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-3">
                      {selectedEntry.icon && <span className="text-3xl">{selectedEntry.icon}</span>}
                      <div>
                        <SheetTitle className="text-3xl mb-1" style={{color: getFacetColorHsl(getDominantFacet(selectedEntry.domainScores))}}>
                          {selectedEntry.title}
                        </SheetTitle>
                        <SheetDescription className="text-base capitalize">
                          {selectedEntry.category} {selectedEntry.isArchetype ? "Archetype" : "Profile"}
                        </SheetDescription>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Icons.close className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                
                <p className="mb-6 text-muted-foreground leading-relaxed">{selectedEntry.summary}</p>

                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border/30 pb-2">Facet Breakdown</h3>
                  {FACET_NAMES.map(facetName => {
                    const scoreObj = selectedEntry.domainScores.find(ds => ds.facetName === facetName);
                    const score = scoreObj ? scoreObj.score : 0;
                    const facetConfig = FACETS[facetName];
                    const facetSummary = selectedEntry.facetSummaries?.[facetName] || `Exploring ${selectedEntry.title}'s perspective on ${facetName.toLowerCase()}...`;
                    
                    return (
                      <div key={facetName} className="p-4 rounded-md border border-border/30 bg-background/40">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-lg font-semibold" style={{color: getFacetColorHsl(facetName)}}>
                            {facetName}
                          </h4>
                          <span className="text-sm font-bold" style={{color: getFacetColorHsl(facetName)}}>{Math.round(score * 100)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic mb-1">{facetConfig?.tagline || "..."}</p>
                        <p className="text-sm text-muted-foreground">{facetSummary}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => handleSaveCodexEntry(selectedEntry)} 
                    disabled={savedWorldviews.some(sw => sw.id === selectedEntry.id && sw.title === selectedEntry.title)}
                    className="flex-1"
                  >
                    <Icons.saved className="mr-2 h-4 w-4" /> 
                    {savedWorldviews.some(sw => sw.id === selectedEntry.id && sw.title === selectedEntry.title) ? "Already Saved" : "Save to Library"}
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href={`/codex/${selectedEntry.id}`}>
                      <Icons.codex className="mr-2 h-4 w-4" /> View Full Deep-Dive
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
