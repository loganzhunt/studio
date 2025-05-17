
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
import { getBandColor } from '@/lib/colors'; // For coloring title and drawer facets

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
];
// The `mapRawDataToCodexEntries` function handles the merging of `existingRawCodexData` and `newRawCodexDataBatch`.
// It also ensures that `domainScores` are correctly formatted as `DomainScore[]` and `facetSummaries` keys are capitalized.


// Function to calculate dominant facet for coloring title
const getDominantFacet = (scores: DomainScore[]): FacetName | null => {
  if (!scores || scores.length === 0) return null;
  let dominantFacet = scores[0].facetName;
  let maxScore = scores[0].score;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i].score > maxScore) {
      maxScore = scores[i].score;
      dominantFacet = scores[i].facetName;
    }
  }
  return dominantFacet;
};

// Helper to get HSL color string for a facet
const getFacetColorHsl = (facetName: FacetName | null): string => {
  if (!facetName) return `hsl(var(--foreground))`;
  const facetConfig = FACETS[facetName];
  return facetConfig ? `hsl(var(${facetConfig.colorVariable.slice(2)}))` : `hsl(var(--foreground))`;
};


// CodexCard component
function CodexCard({ entry, onOpenDrawer }: { entry: CodexEntry, onOpenDrawer: (entry: CodexEntry) => void }) {
  const dominantFacet = getDominantFacet(entry.domainScores);
  const titleColor = getFacetColorHsl(dominantFacet);

  return (
    <Card 
      className="codex-card-compact glassmorphic-card flex flex-col overflow-hidden hover:shadow-primary/20 transition-shadow duration-300"
      tabIndex={0}
      onClick={() => onOpenDrawer(entry)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenDrawer(entry)}
      role="button"
      aria-label={`View details for ${entry.title}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-xl" style={{ color: titleColor }}>{entry.title}</CardTitle>
        <CardDescription className="text-xs capitalize">{entry.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{entry.summary}</p>
        <TriangleChart 
          scores={entry.domainScores} 
          width={180} // Slightly smaller for card
          height={156} // Adjusted height for aspect ratio
          className="mx-auto mb-2 !p-0 !bg-transparent !shadow-none !backdrop-blur-none" // Override default TriangleChart styles
        />
         {/* Tags are hidden as per previous request */}
      </CardContent>
      <CardFooter className="pt-3 border-t border-border/20">
        <Button variant="link" size="sm" className="text-primary p-0 w-full justify-start">
          Facet Details <Icons.chevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function CodexPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const dummyCodexEntries = useMemo(() => {
    // Merge and map data inside useMemo
    const existingNames = new Set(existingRawCodexData.map(e => e.name ? e.name.toLowerCase() : ''));
    const uniqueNewEntries = newRawCodexDataBatch.filter(ne => 
        ne.name && typeof ne.name === 'string' && !existingNames.has(ne.name.toLowerCase())
    );
    const currentRawCodexData = [...existingRawCodexData, ...uniqueNewEntries];
    return mapRawDataToCodexEntries(currentRawCodexData);
  }, []);


  const handleOpenDrawer = (entry: CodexEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  const filteredAndSortedEntries = useMemo(() => {
    let entries = [...dummyCodexEntries];

    // Filter by search term
    if (searchTerm) {
      entries = entries.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by category
    if (activeCategory) {
      entries = entries.filter(entry => entry.category === activeCategory);
    }
    
    // Sort
    switch (sortBy) {
      case 'alphabetical':
        entries.sort((a, b) => a.title.localeCompare(b.title));
        break;
      // Add more sort cases here if needed (e.g., by dominant facet)
      default:
        break;
    }
    return entries;
  }, [dummyCodexEntries, searchTerm, sortBy, activeCategory]);
  
  const dominantFacetForDrawer = selectedEntry ? getDominantFacet(selectedEntry.domainScores) : null;
  const drawerTitleColor = getFacetColorHsl(dominantFacetForDrawer);


  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">The Codex</h1>
        <p className="text-xl text-muted-foreground text-center">
          Explore a library of worldviews, philosophies, and archetypes.
        </p>
      </header>

      {/* Filter and Sort Controls */}
      <Card className="mb-8 glassmorphic-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="search"
            placeholder="Search Codex (titles, summaries, tags...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-background/70"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] bg-background/70">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
              <SelectItem value="dominant_facet_todo">By Dominant Facet (TODO)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant={activeCategory === null ? "default" : "outline"} onClick={() => setActiveCategory(null)}>All</Button>
          <Button variant={activeCategory === "philosophical" ? "default" : "outline"} onClick={() => setActiveCategory("philosophical")}>Philosophical</Button>
          <Button variant={activeCategory === "religious" ? "default" : "outline"} onClick={() => setActiveCategory("religious")}>Religious</Button>
          <Button variant={activeCategory === "archetypal" ? "default" : "outline"} onClick={() => setActiveCategory("archetypal")}>Archetypal</Button>
          <Button variant={activeCategory === "custom" ? "default" : "outline"} onClick={() => setActiveCategory("custom")}>Custom</Button>
          {/* Add more category filters if needed */}
        </div>
      </Card>

      {/* Codex Grid */}
      {filteredAndSortedEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedEntries.map(entry => (
            <CodexCard key={entry.id} entry={entry} onOpenDrawer={handleOpenDrawer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <Icons.search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No entries match your criteria.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}


      {/* Details Drawer (Sheet) */}
      {selectedEntry && (
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-full max-w-md sm:max-w-lg bg-card/80 backdrop-blur-xl p-0 flex flex-col">
            <SheetHeader className="p-6 pb-4 border-b border-border/30">
              <div className="flex justify-between items-start">
                <div>
                  <SheetTitle className="text-2xl" style={{color: drawerTitleColor}}>{selectedEntry.title}</SheetTitle>
                  <SheetDescription className="capitalize">{selectedEntry.category}</SheetDescription>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon"><Icons.close className="h-5 w-5"/></Button>
                </SheetClose>
              </div>
            </SheetHeader>
            <ScrollArea className="flex-grow">
              <div className="p-6 space-y-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedEntry.summary}</p>
                
                <h4 className="text-lg font-semibold text-foreground pt-2 border-t border-border/20">Facet Breakdown:</h4>
                {FACET_NAMES.map(facetName => {
                  const scoreEntry = selectedEntry.domainScores.find(ds => ds.facetName === facetName);
                  const score = scoreEntry ? scoreEntry.score : 0;
                  const facetConfig = FACETS[facetName];
                  const summary = selectedEntry.facetSummaries?.[facetName] || `Exploring ${selectedEntry.title}'s perspective on ${facetName}.`;
                  
                  return (
                    <div key={facetName} className="p-3 rounded-md border border-border/30 bg-background/30">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-semibold" style={{color: getFacetColorHsl(facetName)}}>
                          {facetName}
                        </h5>
                        <span className="text-xs font-bold" style={{color: getFacetColorHsl(facetName)}}>
                          {Math.round(score * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{summary}</p>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-6 border-t border-border/30 mt-auto">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/codex/${selectedEntry.id}`}>
                  View Full Deep-Dive <Icons.chevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

// Helper Function to map raw data - outside component for clarity, called by useMemo
const mapRawDataToCodexEntries = (rawData: any[]): CodexEntry[] => {
  return rawData.map((item: any) => {
    const facetScoresObject = item.domainScores || item.facetScores;
    const domainScores: DomainScore[] = FACET_NAMES.map(facetName => {
      let scoreValue = 0;
      if (facetScoresObject) {
        if (facetScoresObject[facetName] !== undefined) { // Check capitalized key first
          scoreValue = facetScoresObject[facetName];
        } else if (facetScoresObject[facetName.toLowerCase()] !== undefined) { // Then lowercase
          scoreValue = facetScoresObject[facetName.toLowerCase()];
        }
      }
      return { facetName, score: typeof scoreValue === 'number' ? scoreValue : 0 };
    });

    let category: CodexEntry['category'] = 'custom';
    const tags: string[] = Array.isArray(item.tags) ? item.tags.map(String) : [];
    
    const categoryKeywords: Record<string, CodexEntry['category']> = {
      "philosophical": "philosophical", "philosophy": "philosophical",
      "religious": "religious", "religion": "religious",
      "archetypal": "archetypal", "archetype": "archetypal",
      "mystical": "philosophical", // Or 'spiritual' if that becomes a category
      "scientific": "philosophical",
      "cultural": "custom", // Or another relevant category
      "indigenous": "custom", // Or 'spiritual'
      "eastern": "philosophical", // Or 'religious'/'spiritual'
      "western": "philosophical", // Or 'religious'/'spiritual'
      "modern": "philosophical",
      "classical": "philosophical",
      "ethics": "philosophical",
      "epistemology": "philosophical",
    };

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (categoryKeywords[lowerTag]) {
        category = categoryKeywords[lowerTag];
        break; 
      }
    }
    
    const facetSummaries: Partial<Record<FacetName, string>> = {};
    if (item.facetSummary || item.facetSummaries) {
        const rawSummaries = item.facetSummary || item.facetSummaries;
        for (const rawKey in rawSummaries) {
            // Try to match rawKey (potentially lowercase) to a capitalized FacetName
            const capitalizedKey = rawKey.charAt(0).toUpperCase() + rawKey.slice(1) as FacetName;
            if (FACET_NAMES.includes(capitalizedKey)) {
                facetSummaries[capitalizedKey] = rawSummaries[rawKey];
            } else {
                // Fallback for keys that don't directly match after simple capitalization (e.g. 'praxology')
                const matchedFacetName = FACET_NAMES.find(fn => fn.toLowerCase() === rawKey.toLowerCase());
                if (matchedFacetName) {
                    facetSummaries[matchedFacetName] = rawSummaries[rawKey];
                }
            }
        }
    }

    return {
      id: item.id || (item.name ? item.name.toLowerCase().replace(/\s+/g, '_') : `entry_${Math.random().toString(36).substr(2, 9)}`),
      title: item.name || "Untitled Entry",
      summary: item.summary || "No summary available.",
      domainScores,
      category,
      tags,
      isArchetype: tags.includes("archetypal"),
      createdAt: item.createdAt || new Date().toISOString(),
      facetSummaries: facetSummaries as Record<FacetName, string>,
    };
  });
};

