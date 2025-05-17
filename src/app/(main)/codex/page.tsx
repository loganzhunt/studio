
"use client";

import { useState, useMemo } from 'react';
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
import { getFacetColorHsl } from '@/lib/colors'; // For coloring title and drawer facets

// Raw data for Codex entries
const existingRawCodexData = [
  {
    "name": "Platonism",
    "summary": "A philosophical tradition centered on transcendent forms and the pursuit of the Good. Emphasizes reason, idealism, and the distinction between appearances and true reality.",
    "domainScores": {
      "Ontology": 0.85, "Epistemology": 0.9, "Praxeology": 0.55, "Axiology": 0.85, "Mythology": 0.7, "Cosmology": 0.8, "Teleology": 0.8
    },
    "facetSummary": {
      "Ontology": "Reality is ultimately composed of ideal Forms.", "Epistemology": "True knowledge is apprehended through reason.", "Praxeology": "Right action aligns with the Form of the Good.", "Axiology": "The Good is the supreme value.", "Mythology": "Uses allegory and myth for teaching.", "Cosmology": "The cosmos reflects perfect order.", "Teleology": "Life’s purpose is to ascend toward the Good."
    },
    "tags": ["philosophical", "idealism", "classical"]
  },
  {
    "name": "Aristotelianism",
    "summary": "A naturalist and teleological philosophy grounded in empirical observation, virtue ethics, and the inherent order of nature.",
    "domainScores": {
      "Ontology": 0.75, "Epistemology": 0.75, "Praxeology": 0.8, "Axiology": 0.7, "Mythology": 0.3, "Cosmology": 0.75, "Teleology": 0.85
    },
    "facetSummary": {
      "Ontology": "Reality is substance and form.", "Epistemology": "Knowledge is gained through empirical study.", "Praxeology": "Ethical action fulfills one’s purpose.", "Axiology": "Virtue is cultivated by habit.", "Mythology": "Limited use of myth.", "Cosmology": "Nature has intrinsic order.", "Teleology": "Everything has a natural end."
    },
    "tags": ["philosophical", "naturalism", "classical"]
  },
  {
    "name": "Stoicism",
    "summary": "A philosophy of rational resilience and self-mastery, emphasizing the cultivation of virtue and acceptance of nature.",
    "domainScores": {
      "Ontology": 0.65, "Epistemology": 0.7, "Praxeology": 0.9, "Axiology": 0.85, "Mythology": 0.4, "Cosmology": 0.7, "Teleology": 0.7
    },
    "facetSummary": {
      "Ontology": "Reality is rational and ordered.", "Epistemology": "Truth is discerned through reason.", "Praxeology": "Act in accordance with nature.", "Axiology": "Virtue is the highest good.", "Mythology": "Myth used for ethical teaching.", "Cosmology": "The cosmos is governed by Logos.", "Teleology": "Purpose is acceptance of fate."
    },
    "tags": ["philosophical", "ethics", "resilience"]
  },
  {
    "name": "Taoism",
    "summary": "A spiritual tradition rooted in the Tao, the ineffable source of all. Emphasizes harmony, non-action, and flowing with nature.",
    "domainScores": {
      "Ontology": 0.65, "Epistemology": 0.7, "Praxeology": 0.55, "Axiology": 0.8, "Mythology": 0.75, "Cosmology": 0.8, "Teleology": 0.65
    },
    "facetSummary": {
      "Ontology": "Ultimate reality is the Tao.", "Epistemology": "Wisdom arises from attunement, not analysis.", "Praxeology": "Wu wei (non-action) and flexibility.", "Axiology": "Harmony is the supreme value.", "Mythology": "Rich in cosmological myth and parable.", "Cosmology": "Cosmos flows as a spontaneous order.", "Teleology": "Purpose is spontaneous unfolding."
    },
    "tags": ["spiritual", "eastern", "nature"]
  },
  {
    "name": "Scientific Materialism",
    "summary": "A worldview grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    "domainScores": {
      "Ontology": 0.95, "Epistemology": 0.9, "Praxeology": 0.6, "Axiology": 0.6, "Mythology": 0.15, "Cosmology": 0.85, "Teleology": 0.2
    },
    "facetSummary": {
      "Ontology": "Only physical matter truly exists.", "Epistemology": "Knowledge is gained through observation and experiment.", "Praxeology": "Actions should be evidence-based.", "Axiology": "Value arises from outcomes and utility.", "Mythology": "Skeptical of myth and legend.", "Cosmology": "The universe is physical and governed by laws.", "Teleology": "No inherent purpose beyond survival."
    },
    "tags": ["scientific", "empirical", "modern"]
  },
  {
    "name": "Christianity",
    "summary": "A monotheistic religious tradition centered on Jesus Christ, emphasizing love, redemption, and eternal purpose.",
    "domainScores": {
      "Ontology": 0.8, "Epistemology": 0.65, "Praxeology": 0.8, "Axiology": 0.95, "Mythology": 0.85, "Cosmology": 0.85, "Teleology": 0.95
    },
    "facetSummary": {
      "Ontology": "God is the ultimate reality.", "Epistemology": "Faith and revelation as sources of truth.", "Praxeology": "Live according to Christ’s example.", "Axiology": "Love and redemption are central values.", "Mythology": "Scripture rich in myth and symbol.", "Cosmology": "Creation is divinely ordered.", "Teleology": "Life’s purpose is communion with God."
    },
    "tags": ["religious", "monotheistic", "western"]
  },
  {
    "name": "Buddhism",
    "summary": "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering through the Eightfold Path.",
    "domainScores": {
      "Ontology": 0.4, "Epistemology": 0.8, "Praxeology": 0.9, "Axiology": 0.75, "Mythology": 0.7, "Cosmology": 0.7, "Teleology": 0.85
    },
    "facetSummary": {
      "Ontology": "All phenomena are impermanent and interdependent.", "Epistemology": "Direct experience and insight.", "Praxeology": "Ethical conduct and meditation.", "Axiology": "Compassion and wisdom are highest values.", "Mythology": "Buddhist cosmology and Jataka tales.", "Cosmology": "Cyclic universes, realms, and karma.", "Teleology": "Purpose is liberation from suffering."
    },
    "tags": ["spiritual", "eastern", "awakening"]
  },
  {
    "name": "Existentialism",
    "summary": "A modern philosophy focusing on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    "domainScores": {
      "Ontology": 0.5, "Epistemology": 0.6, "Praxeology": 0.8, "Axiology": 0.65, "Mythology": 0.25, "Cosmology": 0.4, "Teleology": 0.6
    },
    "facetSummary": {
      "Ontology": "Reality is ambiguous and contingent.", "Epistemology": "Truth emerges from subjective experience.", "Praxeology": "Authentic action defines existence.", "Axiology": "Value is self-created.", "Mythology": "Rejects inherited myth; values story.", "Cosmology": "The universe is indifferent.", "Teleology": "Purpose is made, not given."
    },
    "tags": ["philosophical", "modern", "authenticity"]
  },
  {
    "name": "Mystical Sufism",
    "summary": "A mystical Islamic tradition seeking direct experience of the Divine through love, devotion, and spiritual practice.",
    "domainScores": {
      "Ontology": 0.75, "Epistemology": 0.75, "Praxeology": 0.8, "Axiology": 0.85, "Mythology": 0.8, "Cosmology": 0.7, "Teleology": 0.95
    },
    "facetSummary": {
      "Ontology": "God is immanent and transcendent.", "Epistemology": "Inner knowing (gnosis) and revelation.", "Praxeology": "Love and devotion as practice.", "Axiology": "Union with God is the highest value.", "Mythology": "Sufi poetry and parables.", "Cosmology": "Creation as reflection of the Divine.", "Teleology": "Purpose is return to the Beloved."
    },
    "tags": ["mystical", "islamic", "spiritual"]
  },
  {
    "name": "Animism",
    "summary": "A worldview that sees spirit or consciousness as present in all beings, places, and phenomena. Emphasizes relationship and reciprocity.",
    "domainScores": {
      "Ontology": 0.8, "Epistemology": 0.6, "Praxeology": 0.7, "Axiology": 0.7, "Mythology": 0.9, "Cosmology": 0.75, "Teleology": 0.6
    },
    "facetSummary": {
      "Ontology": "All things possess spirit.", "Epistemology": "Knowledge is relational and experiential.", "Praxeology": "Reciprocity with the more-than-human world.", "Axiology": "Balance and respect are highest values.", "Mythology": "Stories of spirits, ancestors, and place.", "Cosmology": "The world is alive and interconnected.", "Teleology": "Purpose is right relationship."
    },
    "tags": ["indigenous", "spiritual", "nature"]
  },
   {
    "name": "The Sage Archetype",
    "summary": "Represents wisdom, knowledge, and truth. The Sage seeks understanding and enlightenment through introspection and learning.",
    "domainScores": FACET_NAMES.reduce((acc, name) => {
        acc[name as FacetName] = name === "Epistemology" ? 0.9 : (name === "Ontology" ? 0.8 : Math.random() * 0.5 + 0.2);
        return acc;
    }, {} as Record<FacetName, number>),
    "facetSummary": FACET_NAMES.reduce((acc, name) => {
        acc[name as FacetName] = `The Sage's approach to ${name.toLowerCase()} emphasizes deep understanding.`;
        return acc;
    }, {} as Record<FacetName, string>),
    "tags": ["archetypal", "wisdom", "knowledge"]
  },
  {
    "name": "The Hero Archetype",
    "summary": "Represents the drive for mastery and competence. The Hero strives to prove their worth through courageous acts.",
     "domainScores": FACET_NAMES.reduce((acc, name) => {
        acc[name as FacetName] = name === "Praxeology" ? 0.9 : (name === "Teleology" ? 0.8 : Math.random() * 0.5 + 0.2);
        return acc;
    }, {} as Record<FacetName, number>),
    "facetSummary": FACET_NAMES.reduce((acc, name) => {
        acc[name as FacetName] = `The Hero's path in ${name.toLowerCase()} involves decisive action and overcoming challenges.`;
        return acc;
    }, {} as Record<FacetName, string>),
    "tags": ["archetypal", "courage", "strength", "mastery"]
  }
];

const newRawCodexDataBatch = [
  {
    "name": "Empiricism",
    "summary": "A philosophical stance that asserts knowledge comes primarily from sensory experience and observation.",
    "domainScores": {
      "ontology": 0.3, "epistemology": 1.0, "praxeology": 0.7, "axiology": 0.5, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.1
    },
    "facetSummary": {
      "ontology": "Reality is material and can be directly observed.", "epistemology": "All knowledge is derived from sensory input and experiment.", "praxeology": "Actions are guided by outcomes observed in the world.", "axiology": "Values are shaped by what can be empirically verified.", "mythology": "Traditional stories are analyzed for factual accuracy.", "cosmology": "The universe is explained through scientific investigation.", "teleology": "Purpose is considered an emergent or constructed category."
    },
    "tags": ["philosophical", "epistemology"]
  },
  {
    "name": "Epicureanism",
    "summary": "An ancient philosophy prioritizing the pursuit of pleasure and avoidance of pain through modest living and rational thought.",
    "domainScores": {
      "ontology": 0.5, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.4
    },
    "facetSummary": {
      "ontology": "Reality consists of atoms and void; the material world is primary.", "epistemology": "Knowledge is attained through sensory experience and logical inference.", "praxeology": "Wise action seeks the highest pleasure and lowest pain.", "axiology": "Pleasure is the greatest good, especially intellectual and social pleasure.", "mythology": "Myths are allegories or projections of natural phenomena.", "cosmology": "The cosmos operates according to natural laws.", "teleology": "Life’s goal is a tranquil mind and body."
    },
    "tags": ["philosophical", "ethics", "hedonism"]
  },
  {
    "name": "Gnosticism",
    "summary": "A mystical and dualistic tradition emphasizing secret knowledge (gnosis) and inner spiritual awakening.",
    "domainScores": {
      "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.5, "axiology": 0.6, "mythology": 0.9, "cosmology": 0.8, "teleology": 0.7
    },
    "facetSummary": {
      "ontology": "The material world is an illusion; true reality is spiritual.", "epistemology": "Knowledge is gained through inner revelation.", "praxeology": "Action is oriented toward liberation from material bondage.", "axiology": "Spiritual knowledge and purity are highest values.", "mythology": "Myths encode hidden truths and cosmological mysteries.", "cosmology": "The cosmos is a drama of light and darkness.", "teleology": "The goal is reunification with the divine source."
    },
    "tags": ["mystical", "dualism", "spiritual"]
  },
  {
    "name": "Hinduism",
    "summary": "A diverse religious tradition rooted in India, focusing on dharma, karma, reincarnation, and the pursuit of liberation (moksha).",
    "domainScores": {
      "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.8, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "All is Brahman—reality is one, manifest in many forms.", "epistemology": "Knowledge arises from scripture, guru, and direct realization.", "praxeology": "Dharma prescribes right action according to role and stage of life.", "axiology": "Value is placed on harmony, non-harm, and spiritual growth.", "mythology": "Myths narrate cosmic cycles, gods, and divine play.", "cosmology": "The universe is cyclic and endlessly recreated.", "teleology": "The soul’s aim is liberation from the cycle of rebirth."
    },
    "tags": ["religious", "eastern", "dharma"]
  },
  {
    "name": "Humanism",
    "summary": "A philosophical and ethical stance that values human agency, rationality, and well-being, often without reliance on the supernatural.",
    "domainScores": {
      "ontology": 0.4, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.4
    },
    "facetSummary": {
      "ontology": "Reality is best understood through science and reason.", "epistemology": "Knowledge is derived from critical inquiry and evidence.", "praxeology": "Ethical action supports human dignity and flourishing.", "axiology": "Human well-being is the ultimate value.", "mythology": "Myths are seen as cultural products, not truths.", "cosmology": "The universe is a natural system open to investigation.", "teleology": "Meaning is created through human endeavor."
    },
    "tags": ["philosophical", "ethics", "secular"]
  },
  {
    "name": "Islam",
    "summary": "A monotheistic Abrahamic faith rooted in the revelation to Muhammad, emphasizing submission to God (Allah) and the unity of creation.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "All reality is created by and dependent upon God.", "epistemology": "Knowledge comes from divine revelation and rational reflection.", "praxeology": "Life is to be lived in accordance with God’s guidance (Sharia).", "axiology": "Justice, mercy, and faithfulness are highest values.", "mythology": "Stories of prophets teach moral and spiritual lessons.", "cosmology": "The cosmos is ordered, purposeful, and created.", "teleology": "Life’s aim is fulfillment of God’s will and paradise."
    },
    "tags": ["religious", "monotheistic", "abrahamic"]
  },
  {
    "name": "Jainism",
    "summary": "An ancient Indian religion emphasizing non-violence (ahimsa), karma, and the liberation of the soul through self-discipline.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.7, "praxeology": 1.0, "axiology": 1.0, "mythology": 0.6, "cosmology": 0.8, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "Reality is eternal, with countless individual souls (jiva).", "epistemology": "Knowledge comes from scripture, reason, and intuition.", "praxeology": "Non-violence in thought, word, and deed is essential.", "axiology": "Compassion and truthfulness are supreme values.", "mythology": "Tirthankara stories model spiritual discipline.", "cosmology": "The universe is uncreated, eternal, and cyclical.", "teleology": "Soul’s aim is liberation from karma and rebirth."
    },
    "tags": ["religious", "eastern", "ahimsa"]
  },
  {
    "name": "Judaism",
    "summary": "An ancient monotheistic tradition centered on covenant, law (Torah), and the ongoing relationship between God and the Jewish people.",
    "domainScores": {
      "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.8
    },
    "facetSummary": {
      "ontology": "God is the creator and sustainer of all.", "epistemology": "Knowledge is received through revelation and study.", "praxeology": "Lawful action fulfills the covenant and expresses holiness.", "axiology": "Justice, mercy, and study are core values.", "mythology": "Biblical narratives shape collective memory.", "cosmology": "The cosmos is ordered and purposeful.", "teleology": "History moves toward redemption and peace."
    },
    "tags": ["religious", "monotheistic", "abrahamic"]
  },
  {
    "name": "Kabbalah",
    "summary": "A mystical tradition within Judaism that explores the hidden dimensions of God, creation, and the human soul.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "Divine reality underlies the physical world.", "epistemology": "Knowledge is received through mystical contemplation.", "praxeology": "Rituals align the microcosm with the macrocosm.", "axiology": "Spiritual ascent and repair (tikkun) are key values.", "mythology": "Myths unveil the structure of the divine.", "cosmology": "Creation unfolds through divine emanations.", "teleology": "Purpose is reunion with the divine source."
    },
    "tags": ["mystical", "jewish", "esoteric"]
  },
  {
    "name": "Mahayana Buddhism",
    "summary": "A broad Buddhist tradition emphasizing universal compassion, the bodhisattva path, and emptiness (shunyata).",
    "domainScores": {
      "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.8, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "All phenomena are empty of fixed nature.", "epistemology": "Wisdom is direct insight into emptiness.", "praxeology": "Compassionate action for all beings is central.", "axiology": "Selflessness and wisdom are highest values.", "mythology": "Stories of Buddhas and bodhisattvas inspire practice.", "cosmology": "Worlds arise and dissolve in interdependent cycles.", "teleology": "Aim is universal liberation (Buddhahood)."
    },
    "tags": ["spiritual", "buddhist", "compassion"]
  },
  {
    "name": "Materialism",
    "summary": "A worldview holding that matter is the fundamental substance of reality and all phenomena can be explained by material interactions.",
    "domainScores": {
      "ontology": 0.0, "epistemology": 1.0, "praxeology": 0.5, "axiology": 0.6, "mythology": 0.1, "cosmology": 0.3, "teleology": 0.2
    },
    "facetSummary": {
      "ontology": "Only physical matter is real.", "epistemology": "Truth is discovered through empirical science.", "praxeology": "Action is shaped by physical necessity and utility.", "axiology": "Values are emergent from human nature and society.", "mythology": "Myths are seen as imaginative stories.", "cosmology": "The universe is governed by physical laws.", "teleology": "Purpose is a human construct."
    },
    "tags": ["philosophical", "scientific", "physicalism"]
  },
  {
    "name": "Modernism",
    "summary": "A cultural and philosophical movement prioritizing progress, rationality, and mastery over nature through science and technology.",
    "domainScores": {
      "ontology": 0.3, "epistemology": 0.9, "praxeology": 0.9, "axiology": 0.8, "mythology": 0.2, "cosmology": 0.4, "teleology": 0.5
    },
    "facetSummary": {
      "ontology": "Reality is knowable and improvable.", "epistemology": "Rational inquiry and evidence build knowledge.", "praxeology": "Human action shapes the future.", "axiology": "Progress and innovation are valued.", "mythology": "Myth gives way to reason and critique.", "cosmology": "The universe is subject to human understanding.", "teleology": "Purpose is self-determined and future-oriented."
    },
    "tags": ["philosophical", "cultural", "progress"]
  },
  {
    "name": "Mysticism",
    "summary": "A spiritual orientation focused on direct experience of the divine, transcending ordinary perception and dogma.",
    "domainScores": {
      "ontology": 1.0, "epistemology": 0.9, "praxeology": 0.7, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "All is divine; the world is a manifestation of Spirit.", "epistemology": "Knowledge is gained through inner illumination.", "praxeology": "Practice seeks direct union with the divine.", "axiology": "Unity and transcendence are highest values.", "mythology": "Myth points to ineffable truths.", "cosmology": "The universe is an emanation of Spirit.", "teleology": "Purpose is union with the Absolute."
    },
    "tags": ["spiritual", "experiential", "transcendent"]
  },
  {
    "name": "Naturalism",
    "summary": "A worldview asserting that everything arises from natural properties and causes, excluding supernatural explanations.",
    "domainScores": {
      "ontology": 0.1, "epistemology": 1.0, "praxeology": 0.8, "axiology": 0.6, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.2
    },
    "facetSummary": {
      "ontology": "Only the natural world exists.", "epistemology": "Science is the path to knowledge.", "praxeology": "Ethics are grounded in natural consequences.", "axiology": "Value is found in natural flourishing.", "mythology": "Myth is cultural narrative, not truth.", "cosmology": "The cosmos is entirely natural.", "teleology": "Purpose is emergent, not imposed."
    },
    "tags": ["philosophical", "scientific", "empirical"]
  },
  {
    "name": "Neoplatonism",
    "summary": "A philosophical tradition teaching that all reality emanates from a single source (the One), emphasizing spiritual ascent.",
    "domainScores": {
      "ontology": 1.0, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.9, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "All derives from the One; spiritual reality is supreme.", "epistemology": "Knowledge is ascent from opinion to the divine intellect.", "praxeology": "Contemplative practice leads to union with the source.", "axiology": "Goodness is participation in the divine.", "mythology": "Myth encodes spiritual realities.", "cosmology": "The cosmos is an ordered hierarchy of emanations.", "teleology": "Purpose is return to the One."
    },
    "tags": ["philosophical", "mystical", "classical"]
  },
  {
    "name": "Nihilism",
    "summary": "A worldview that rejects inherent meaning, purpose, or value in life, often as a response to the collapse of previous certainties.",
    "domainScores": {
      "ontology": 0.0, "epistemology": 0.2, "praxeology": 0.3, "axiology": 0.0, "mythology": 0.0, "cosmology": 0.1, "teleology": 0.0
    },
    "facetSummary": {
      "ontology": "Nothing has ultimate substance or permanence.", "epistemology": "Certainty is impossible.", "praxeology": "No action is intrinsically meaningful.", "axiology": "There are no objective values.", "mythology": "All narratives are arbitrary.", "cosmology": "The universe is indifferent.", "teleology": "Purpose is nonexistent."
    },
    "tags": ["philosophical", "skepticism", "meaninglessness"]
  },
  {
    "name": "Panpsychism",
    "summary": "A philosophical view that consciousness or mind is a fundamental and ubiquitous aspect of reality.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.6, "cosmology": 0.8, "teleology": 0.5
    },
    "facetSummary": {
      "ontology": "Mind is a universal property of matter.", "epistemology": "Understanding comes from introspection and science.", "praxeology": "Action acknowledges mind in all beings.", "axiology": "Value is found in universal sentience.", "mythology": "Myths may reflect the pervasiveness of spirit.", "cosmology": "The cosmos is suffused with consciousness.", "teleology": "Purpose is evolutionary and open-ended."
    },
    "tags": ["philosophical", "consciousness", "metaphysics"]
  },
  {
    "name": "Pantheism",
    "summary": "A doctrine identifying the universe itself with the divine—God is all, and all is God.",
    "domainScores": {
      "ontology": 1.0, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.8, "cosmology": 1.0, "teleology": 0.8
    },
    "facetSummary": {
      "ontology": "God and the universe are identical.", "epistemology": "Intuitive and scientific knowing are both valued.", "praxeology": "Action aligns with the natural order.", "axiology": "All is worthy, as all is divine.", "mythology": "Nature myths point to the divine in all things.", "cosmology": "The cosmos is sacred, infinite, and interconnected.", "teleology": "Purpose is realization of unity."
    },
    "tags": ["spiritual", "philosophical", "divinity"]
  },
  {
    "name": "Postmodernism",
    "summary": "A skeptical and critical orientation challenging grand narratives, objectivity, and stable meaning.",
    "domainScores": {
      "ontology": 0.3, "epistemology": 0.2, "praxeology": 0.5, "axiology": 0.4, "mythology": 0.8, "cosmology": 0.2, "teleology": 0.1
    },
    "facetSummary": {
      "ontology": "Reality is fragmented and constructed.", "epistemology": "Knowledge is contextual and contingent.", "praxeology": "Action resists fixed identities and power structures.", "axiology": "Values are plural and unstable.", "mythology": "Myth is deconstructed and reinterpreted.", "cosmology": "Cosmos lacks inherent order or purpose.", "teleology": "Purpose is an illusion."
    },
    "tags": ["philosophical", "cultural", "critique"]
  },
  {
    "name": "Process Philosophy",
    "summary": "A metaphysical approach emphasizing becoming, change, and relationality as more fundamental than substance.",
    "domainScores": {
      "ontology": 0.6, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.4, "cosmology": 0.7, "teleology": 0.7
    },
    "facetSummary": {
      "ontology": "Reality is process and event, not fixed substance.", "epistemology": "Truth unfolds dynamically.", "praxeology": "Ethics is responsive to novelty and context.", "axiology": "Creativity and harmony are valued.", "mythology": "Myths model transformation.", "cosmology": "The cosmos is in perpetual becoming.", "teleology": "Aim is creative advance into novelty."
    },
    "tags": ["philosophical", "metaphysics", "relationality"]
  },
  {
    "name": "Rationalism",
    "summary": "A philosophical approach emphasizing reason and logic as the primary source of knowledge.",
    "domainScores": {
      "ontology": 0.7, "epistemology": 1.0, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.2, "cosmology": 0.5, "teleology": 0.6
    },
    "facetSummary": {
      "ontology": "Reality is knowable through reason.", "epistemology": "Reason and intuition are supreme sources of knowledge.", "praxeology": "Action follows rational principle.", "axiology": "Values are discoverable by logic.", "mythology": "Myths are interpreted rationally.", "cosmology": "The universe is logically ordered.", "teleology": "Purpose is deduced from first principles."
    },
    "tags": ["philosophical", "epistemology", "reason"]
  },
  {
    "name": "Romanticism",
    "summary": "A cultural and philosophical movement emphasizing emotion, nature, and the creative imagination.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.5, "praxeology": 0.6, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.7, "teleology": 0.7
    },
    "facetSummary": {
      "ontology": "Nature and spirit are entwined.", "epistemology": "Intuition and feeling are valid sources of knowledge.", "praxeology": "Creative self-expression is valued.", "axiology": "Emotion, beauty, and the sublime are highest values.", "mythology": "Mythic imagination shapes experience.", "cosmology": "The world is alive and meaningful.", "teleology": "Aim is self-realization and unity with nature."
    },
    "tags": ["cultural", "artistic", "emotion"]
  },
  {
    "name": "Shamanism",
    "summary": "A range of animistic traditions emphasizing the healer’s journey between worlds for wisdom and transformation.",
    "domainScores": {
      "ontology": 0.9, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.7, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.8
    },
    "facetSummary": {
      "ontology": "Spirits and worlds interpenetrate reality.", "epistemology": "Knowledge is gained through visionary experience.", "praxeology": "Ritual and journey are methods of healing.", "axiology": "Balance and reciprocity are core values.", "mythology": "Myth guides the healer’s journey.", "cosmology": "The universe is populated by many spirits.", "teleology": "Purpose is harmony and restoration."
    },
    "tags": ["spiritual", "indigenous", "healing"]
  },
  {
    "name": "Theosophy",
    "summary": "A mystical movement synthesizing Eastern and Western traditions, teaching spiritual evolution, karma, and hidden wisdom.",
    "domainScores": {
      "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.6, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.9, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "Spiritual planes underlie material reality.", "epistemology": "Intuition and esoteric study reveal hidden truths.", "praxeology": "Actions influence karma and spiritual evolution.", "axiology": "Wisdom, altruism, and service are highest values.", "mythology": "Myth encodes perennial teachings.", "cosmology": "The cosmos is a hierarchy of evolving worlds.", "teleology": "Purpose is spiritual ascent and union with the divine."
    },
    "tags": ["mystical", "esoteric", "synthesis"]
  },
  {
    "name": "Theravada Buddhism",
    "summary": "The earliest form of Buddhism, emphasizing individual enlightenment through ethical conduct, meditation, and insight.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.7, "praxeology": 1.0, "axiology": 0.8, "mythology": 0.6, "cosmology": 0.7, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "All phenomena are impermanent and non-self.", "epistemology": "Knowledge arises from direct meditative insight.", "praxeology": "Ethical conduct and meditation are the path.", "axiology": "Wisdom and compassion guide action.", "mythology": "Myth provides context for ethical practice.", "cosmology": "The universe cycles through endless rebirths.", "teleology": "Purpose is liberation from suffering (nirvana)."
    },
    "tags": ["buddhist", "spiritual", "meditation"]
  },
  {
    "name": "Transcendentalism",
    "summary": "A 19th-century American movement emphasizing the inherent goodness of people and nature, and the primacy of intuition.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.7, "cosmology": 0.6, "teleology": 0.7
    },
    "facetSummary": {
      "ontology": "Spirit pervades all nature and humanity.", "epistemology": "Intuition and self-reliance are paths to truth.", "praxeology": "Nonconformity and individual action are prized.", "axiology": "Truth and authenticity are highest values.", "mythology": "Nature is the living symbol of Spirit.", "cosmology": "Nature is harmonious and interconnected.", "teleology": "Aim is self-cultivation and spiritual realization."
    },
    "tags": ["philosophical", "american", "nature", "intuition"]
  },
  {
    "name": "Unitarian Universalism",
    "summary": "A pluralistic faith embracing wisdom from all traditions and affirming freedom of belief and conscience.",
    "domainScores": {
      "ontology": 0.5, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.5, "cosmology": 0.5, "teleology": 0.7
    },
    "facetSummary": {
      "ontology": "Reality is open to diverse interpretations.", "epistemology": "Truth is sought through reason, experience, and tradition.", "praxeology": "Action pursues justice and compassion.", "axiology": "Dignity, equity, and community are core values.", "mythology": "Wisdom is found in many stories.", "cosmology": "Cosmos is explored through many lenses.", "teleology": "Purpose is self-actualization and service."
    },
    "tags": ["religious", "pluralistic", "liberal"]
  },
  {
    "name": "Vedanta",
    "summary": "A major school of Hindu philosophy teaching the unity of Atman (self) and Brahman (absolute reality).",
    "domainScores": {
      "ontology": 1.0, "epistemology": 0.8, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.9, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "Only Brahman is ultimately real; the world is appearance.", "epistemology": "Direct realization leads to knowledge of unity.", "praxeology": "Spiritual practice removes ignorance.", "axiology": "Liberation is the highest value.", "mythology": "Myth reveals the divine play (lila).", "cosmology": "The cosmos is cyclical, an expression of Brahman.", "teleology": "The goal is moksha—union with the Absolute."
    },
    "tags": ["hindu", "philosophical", "monism"]
  },
  {
    "name": "Zen Buddhism",
    "summary": "A school of Mahayana Buddhism emphasizing direct, wordless experience and sudden enlightenment.",
    "domainScores": {
      "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.6, "cosmology": 0.7, "teleology": 0.8
    },
    "facetSummary": {
      "ontology": "All is empty, interdependent, and immediate.", "epistemology": "Intuitive, direct experience transcends concepts.", "praxeology": "Practice is zazen (sitting meditation) and daily mindfulness.", "axiology": "Simplicity, presence, and compassion are valued.", "mythology": "Koans and stories prompt insight, not dogma.", "cosmology": "The world is always already complete.", "teleology": "Goal is awakening to original nature."
    },
    "tags": ["buddhist", "mahayana", "meditation", "direct experience"]
  },
  {
    "name": "Zoroastrianism",
    "summary": "An ancient Persian religion centering on the cosmic struggle between truth and falsehood, light and darkness.",
    "domainScores": {
      "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "Duality of truth (asha) and falsehood (druj) defines reality.", "epistemology": "Revelation and reason are paths to knowledge.", "praxeology": "Good thoughts, words, and deeds are essential.", "axiology": "Truth and purity are supreme values.", "mythology": "Myth narrates the cosmic drama of light vs. darkness.", "cosmology": "Cosmos is a battleground for order and chaos.", "teleology": "Purpose is the ultimate triumph of light."
    },
    "tags": ["religious", "ancient", "persian", "dualism"]
  },
  {
    "name": "Agnosticism",
    "summary": "A position of suspended belief about the existence of deities or ultimate reality, prioritizing uncertainty or open inquiry.",
    "domainScores": {
      "ontology": 0.4, "epistemology": 0.5, "praxeology": 0.5, "axiology": 0.5, "mythology": 0.2, "cosmology": 0.2, "teleology": 0.3
    },
    "facetSummary": {
      "ontology": "Reality is possibly unknowable.", "epistemology": "Knowledge of ultimate things is suspended.", "praxeology": "Actions are provisional and open-minded.", "axiology": "Values are tentative and plural.", "mythology": "Myth is seen as speculation.", "cosmology": "The cosmos may be mysterious.", "teleology": "Purpose is an open question."
    },
    "tags": ["philosophical", "skepticism", "uncertainty"]
  },
  {
    "name": "Atheism",
    "summary": "The absence of belief in deities, often grounded in skepticism, rationalism, or naturalism.",
    "domainScores": {
      "ontology": 0.1, "epistemology": 0.9, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.0, "cosmology": 0.2, "teleology": 0.1
    },
    "facetSummary": {
      "ontology": "No supernatural beings exist.", "epistemology": "Reason and evidence are supreme.", "praxeology": "Ethics and actions are human-centered.", "axiology": "Value is grounded in human concerns.", "mythology": "Myth is metaphor or fiction.", "cosmology": "Cosmos is natural, not divinely ordered.", "teleology": "Purpose is individually determined."
    },
    "tags": ["philosophical", "skepticism", "naturalism"]
  },
  {
    "name": "Catholicism",
    "summary": "The largest Christian tradition, emphasizing the sacraments, apostolic succession, and the universal church.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.8, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "Creation is real, but God is its foundation.", "epistemology": "Scripture, tradition, and reason guide knowledge.", "praxeology": "Sacraments and works express faith.", "axiology": "Love, faith, and charity are supreme.", "mythology": "Myths are sacred history and mystery.", "cosmology": "Cosmos is purposeful, ordered by God.", "teleology": "Purpose is union with God in eternal life."
    },
    "tags": ["christian", "religious", "sacraments"]
  },
  {
    "name": "Deism",
    "summary": "A belief in a creator God who does not intervene in the universe, emphasizing reason and observation of the natural world.",
    "domainScores": {
      "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.6, "axiology": 0.7, "mythology": 0.3, "cosmology": 0.7, "teleology": 0.6
    },
    "facetSummary": {
      "ontology": "God is a distant creator, not immanent.", "epistemology": "Reason and observation reveal truth.", "praxeology": "Ethics are based on natural law.", "axiology": "Virtue, rationality, and autonomy are valued.", "mythology": "Myth is instructive but not authoritative.", "cosmology": "Universe runs on consistent laws.", "teleology": "Purpose is found in fulfilling natural potential."
    },
    "tags": ["philosophical", "reason", "natural law"]
  },
  {
    "name": "Druze Faith",
    "summary": "A secretive Middle Eastern tradition blending elements of Islam, Gnosticism, Neoplatonism, and more.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.8, "cosmology": 0.8, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "Reality is layered and esoteric.", "epistemology": "Knowledge is revealed to the initiated.", "praxeology": "Action reflects secret teachings.", "axiology": "Wisdom and loyalty are prized.", "mythology": "Myths conceal hidden truths.", "cosmology": "The cosmos reflects divine unity.", "teleology": "Purpose is spiritual return and perfection."
    },
    "tags": ["religious", "esoteric", "middle eastern"]
  },
  {
    "name": "Manichaeism",
    "summary": "A dualistic religion founded by Mani, teaching the cosmic struggle between light and darkness.",
    "domainScores": {
      "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.7, "mythology": 1.0, "cosmology": 0.7, "teleology": 0.8
    },
    "facetSummary": {
      "ontology": "Reality is divided into spiritual light and material darkness.", "epistemology": "Revelation and ascetic practice yield knowledge.", "praxeology": "Ethical action separates light from darkness.", "axiology": "Purity and detachment are prized.", "mythology": "Myth details the struggle of light in matter.", "cosmology": "Cosmos is the battleground of dual forces.", "teleology": "Purpose is liberation of light from darkness."
    },
    "tags": ["religious", "dualism", "ancient"]
  },
  {
    "name": "Quakerism",
    "summary": "A Christian tradition emphasizing direct inner experience, simplicity, pacifism, and equality.",
    "domainScores": {
      "ontology": 0.7, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.5, "cosmology": 0.6, "teleology": 0.7
    },
    "facetSummary": {
      "ontology": "Divine light dwells within all.", "epistemology": "Truth comes through inward experience.", "praxeology": "Action is guided by conscience and peace.", "axiology": "Equality, integrity, and nonviolence are valued.", "mythology": "Bible is interpreted in the light of experience.", "cosmology": "World is sacred, guided by Spirit.", "teleology": "Purpose is realization of the Inner Light."
    },
    "tags": ["christian", "religious", "pacifism", "equality"]
  },
  {
    "name": "Rosicrucianism",
    "summary": "A Western esoteric movement blending alchemy, mysticism, and the pursuit of hidden wisdom.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.7, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "Nature is alive with spiritual correspondences.", "epistemology": "Knowledge is sought through both reason and mystic revelation.", "praxeology": "Practice is self-transformation and service.", "axiology": "Wisdom and harmony are highest values.", "mythology": "Myth encodes allegorical truths.", "cosmology": "Cosmos is a web of interconnected forces.", "teleology": "Purpose is the perfection of self and world."
    },
    "tags": ["esoteric", "mystical", "western"]
  },
  {
    "name": "Secular Humanism",
    "summary": "A worldview prioritizing human welfare, ethics, and rationality without reference to the supernatural.",
    "domainScores": {
      "ontology": 0.2, "epistemology": 0.9, "praxeology": 0.9, "axiology": 1.0, "mythology": 0.1, "cosmology": 0.2, "teleology": 0.3
    },
    "facetSummary": {
      "ontology": "Only the natural world exists.", "epistemology": "Reason and science guide knowledge.", "praxeology": "Action pursues human flourishing.", "axiology": "Human welfare and autonomy are highest values.", "mythology": "Myth is cultural heritage.", "cosmology": "The universe is natural and knowable.", "teleology": "Purpose is human-created."
    },
    "tags": ["philosophical", "secular", "ethics"]
  }
]