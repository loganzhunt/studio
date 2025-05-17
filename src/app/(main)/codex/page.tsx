
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

// Raw data for Codex entries (existing + new batch, merged)
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
  // Note: Existentialism is already present, will be skipped by merge logic if name matches exactly
  // Updated Existentialism entry from new batch:
  {
    "name": "Existentialism", // Name is the same, so it will be skipped if exact match by merge
    "summary": "A philosophical movement emphasizing individual existence, freedom, and the search for authentic meaning in an indifferent universe.",
    "domainScores": {
      "ontology": 0.4, "epistemology": 0.5, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.5, "cosmology": 0.2, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "Existence precedes essence; reality is absurd, contingent.", "epistemology": "Truth emerges through subjective, lived experience.", "praxeology": "Freedom requires personal responsibility and authentic action.", "axiology": "Values are created through choices and commitments.", "mythology": "Mythic motifs reflect the individual’s struggle for meaning.", "cosmology": "The universe is indifferent to human concerns.", "teleology": "Purpose must be constructed by the individual."
    },
    "tags": ["philosophical", "modern", "authenticity"]
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
  // Platonism is already present
  {
    "name": "Platonism", // This is a duplicate name, merge logic should handle it (prefer existing one)
    "summary": "A worldview centered on the existence of eternal Forms or Ideas as the ultimate reality.",
    "domainScores": {
      "ontology": 1.0, "epistemology": 0.8, "praxeology": 0.7, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.9, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "Eternal Forms or Ideas are the ultimate reality.", "epistemology": "Knowledge is recollection of the Forms.", "praxeology": "Virtue is alignment with the Good.", "axiology": "Truth, beauty, and goodness are supreme values.", "mythology": "Myths veil metaphysical truths.", "cosmology": "Cosmos mirrors the world of Forms.", "teleology": "Goal is ascent to the vision of the Good."
    },
    "tags": ["philosophical", "idealism", "classical"]
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
  // Stoicism is already present
  {
    "name": "Stoicism", // This is a duplicate name
    "summary": "An ancient philosophy teaching acceptance of fate, virtue as the only good, and living in accord with nature’s order.",
    "domainScores": {
      "ontology": 0.7, "epistemology": 0.8, "praxeology": 1.0, "axiology": 1.0, "mythology": 0.2, "cosmology": 0.7, "teleology": 0.9
    },
    "facetSummary": {
      "ontology": "The cosmos is rational and governed by logos.", "epistemology": "Wisdom is understanding what is and isn’t in our control.", "praxeology": "Virtue is living in accord with nature.", "axiology": "Virtue is the sole good.", "mythology": "Myths serve as moral exemplars.", "cosmology": "The world is a living organism.", "teleology": "Aim is ataraxia—serene acceptance."
    },
    "tags": ["philosophical", "ethics", "resilience"]
  },
  {
    "name": "Sufism", // Already present as "Mystical Sufism", new one has different scores/summary but same name "Sufism"
    "summary": "The mystical dimension of Islam, focused on the direct experience of divine love and unity.",
    "domainScores": {
      "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.8, "teleology": 1.0
    },
    "facetSummary": {
      "ontology": "Reality is unity—God alone is real.", "epistemology": "Knowledge is attained by unveiling the heart.", "praxeology": "Practice is remembrance (dhikr) and love.", "axiology": "Love and surrender are supreme values.", "mythology": "Myth and poetry express mystical truths.", "cosmology": "The universe is a reflection of divine beauty.", "teleology": "Purpose is reunion with the Beloved."
    },
    "tags": ["mystical", "islamic", "love"]
  },
  // Taoism is already present
  {
    "name": "Taoism", // This is a duplicate name
    "summary": "An ancient Chinese tradition teaching harmony with the Tao—the natural way of the universe.",
    "domainScores": {
      "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.7, "cosmology": 0.9, "teleology": 0.8
    },
    "facetSummary": {
      "ontology": "All arises from and returns to the Tao.", "epistemology": "Wisdom is intuitive, non-conceptual.", "praxeology": "Non-action (wu wei) achieves harmony.", "axiology": "Simplicity, humility, and balance are valued.", "mythology": "Myth guides action without force.", "cosmology": "Nature is an unfolding process.", "teleology": "Aim is effortless alignment with the Tao."
    },
    "tags": ["spiritual", "eastern", "nature"]
  }
]