
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
import { FACETS, FACET_NAMES } from "@/config/facets"; // Ensure FACETS is imported
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { getFacetColorHsl } from '@/lib/colors'; // Ensure getFacetColorHsl is imported
import { useWorldview } from '@/hooks/use-worldview';
import { useToast } from '@/hooks/use-toast';

// --- Data Definitions ---
const existingRawCodexData: any[] = [
  {
    "name": "Platonism",
    "summary": "A philosophical tradition centered on transcendent forms and the pursuit of the Good. Emphasizes reason, idealism, and the distinction between appearances and true reality.",
    "domainScores": { "Ontology": 0.85, "Epistemology": 0.9, "Praxeology": 0.55, "Axiology": 0.85, "Mythology": 0.7, "Cosmology": 0.8, "Teleology": 0.8 },
    "facetSummary": { "Ontology": "Reality is ultimately composed of ideal Forms.", "Epistemology": "True knowledge is apprehended through reason.", "Praxeology": "Right action aligns with the Form of the Good.", "Axiology": "The Good is the supreme value.", "Mythology": "Uses allegory and myth for teaching.", "Cosmology": "The cosmos reflects perfect order.", "Teleology": "Life’s purpose is to ascend toward the Good." },
    "tags": ["philosophical", "idealism", "classical"]
  },
  {
    "name": "Aristotelianism",
    "summary": "A naturalist and teleological philosophy grounded in empirical observation, virtue ethics, and the inherent order of nature.",
    "domainScores": { "Ontology": 0.75, "Epistemology": 0.75, "Praxeology": 0.8, "Axiology": 0.7, "Mythology": 0.3, "Cosmology": 0.75, "Teleology": 0.85 },
    "facetSummary": { "Ontology": "Reality is substance and form.", "Epistemology": "Knowledge is gained through empirical study.", "Praxeology": "Ethical action fulfills one’s purpose.", "Axiology": "Virtue is cultivated by habit.", "Mythology": "Limited use of myth.", "Cosmology": "Nature has intrinsic order.", "Teleology": "Everything has a natural end." },
    "tags": ["philosophical", "naturalism", "classical"]
  },
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
  {
    "name": "Christianity",
    "summary": "A monotheistic religious tradition centered on Jesus Christ, emphasizing love, redemption, and eternal purpose.",
    "domainScores": { "Ontology": 0.8, "Epistemology": 0.65, "Praxeology": 0.8, "Axiology": 0.95, "Mythology": 0.85, "Cosmology": 0.85, "Teleology": 0.95 },
    "facetSummary": { "Ontology": "God is the ultimate reality.", "Epistemology": "Faith and revelation as sources of truth.", "Praxeology": "Live according to Christ’s example.", "Axiology": "Love and redemption are central values.", "Mythology": "Scripture rich in myth and symbol.", "Cosmology": "Creation is divinely ordered.", "Teleology": "Life’s purpose is communion with God." },
    "tags": ["religious", "monotheistic", "western"]
  },
  {
    "name": "Buddhism",
    "summary": "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering through the Eightfold Path.",
    "domainScores": { "Ontology": 0.4, "Epistemology": 0.8, "Praxeology": 0.9, "Axiology": 0.75, "Mythology": 0.7, "Cosmology": 0.7, "Teleology": 0.85 },
    "facetSummary": { "Ontology": "All phenomena are impermanent and interdependent.", "Epistemology": "Direct experience and insight.", "Praxeology": "Ethical conduct and meditation.", "Axiology": "Compassion and wisdom are highest values.", "Mythology": "Buddhist cosmology and Jataka tales.", "Cosmology": "Cyclic universes, realms, and karma.", "Teleology": "Purpose is liberation from suffering." },
    "tags": ["spiritual", "eastern", "awakening"]
  },
  {
    "name": "Existentialism", // This was updated in a later batch, keeping first for now.
    "summary": "A modern philosophy focusing on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    "domainScores": { "ontology": 0.5, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.65, "mythology": 0.25, "cosmology": 0.4, "teleology": 0.6 },
    "facetSummary": { "ontology": "Reality is ambiguous and contingent.", "epistemology": "Truth emerges from subjective experience.", "praxeology": "Authentic action defines existence.", "axiology": "Value is self-created.", "mythology": "Rejects inherited myth; values story.", "cosmology": "The universe is indifferent.", "teleology": "Purpose is made, not given." },
    "tags": ["philosophical", "modern", "authenticity"]
  },
  {
    "name": "Mystical Sufism", 
    "summary": "A mystical Islamic tradition seeking direct experience of the Divine through love, devotion, and spiritual practice.",
    "domainScores": { "Ontology": 0.75, "Epistemology": 0.75, "Praxeology": 0.8, "Axiology": 0.85, "Mythology": 0.8, "Cosmology": 0.7, "Teleology": 0.95 },
    "facetSummary": { "Ontology": "God is immanent and transcendent.", "Epistemology": "Inner knowing (gnosis) and revelation.", "Praxeology": "Love and devotion as practice.", "Axiology": "Union with God is the highest value.", "Mythology": "Sufi poetry and parables.", "Cosmology": "Creation as reflection of the Divine.", "Teleology": "Purpose is return to the Beloved." },
    "tags": ["mystical", "islamic", "spiritual"]
  },
  {
    "name": "Animism",
    "summary": "A worldview that sees spirit or consciousness as present in all beings, places, and phenomena. Emphasizes relationship and reciprocity.",
    "domainScores": { "Ontology": 0.8, "Epistemology": 0.6, "Praxeology": 0.7, "Axiology": 0.7, "Mythology": 0.9, "Cosmology": 0.75, "Teleology": 0.6 },
    "facetSummary": { "Ontology": "All things possess spirit.", "Epistemology": "Knowledge is relational and experiential.", "Praxeology": "Reciprocity with the more-than-human world.", "Axiology": "Balance and respect are highest values.", "Mythology": "Stories of spirits, ancestors, and place.", "Cosmology": "The world is alive and interconnected.", "Teleology": "Purpose is right relationship." },
    "tags": ["indigenous", "spiritual", "nature"]
  }
];

const newRawCodexDataBatch: any[] = [
  { "name": "Empiricism", "summary": "A philosophical stance that asserts knowledge comes primarily from sensory experience and observation.", "domainScores": { "ontology": 0.3, "epistemology": 1.0, "praxeology": 0.7, "axiology": 0.5, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.1 }, "facetSummaries": { "ontology": "Reality is material and can be directly observed.", "epistemology": "All knowledge is derived from sensory input and experiment.", "praxeology": "Actions are guided by outcomes observed in the world.", "axiology": "Values are shaped by what can be empirically verified.", "mythology": "Traditional stories are analyzed for factual accuracy.", "cosmology": "The universe is explained through scientific investigation.", "teleology": "Purpose is considered an emergent or constructed category." }, tags: ["philosophical", "epistemology"]},
  { "name": "Epicureanism", "summary": "An ancient philosophy prioritizing the pursuit of pleasure and avoidance of pain through modest living and rational thought.", "domainScores": { "ontology": 0.5, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.4 }, "facetSummaries": { "ontology": "Reality consists of atoms and void; the material world is primary.", "epistemology": "Knowledge is attained through sensory experience and logical inference.", "praxeology": "Wise action seeks the highest pleasure and lowest pain.", "axiology": "Pleasure is the greatest good, especially intellectual and social pleasure.", "mythology": "Myths are allegories or projections of natural phenomena.", "cosmology": "The cosmos operates according to natural laws.", "teleology": "Life’s goal is a tranquil mind and body." }, tags: ["philosophical", "ethics", "hedonism"]},
  // Existentialism was already in existingRawCodexData, newer version here:
  // { "name": "Existentialism", "summary": "A philosophical movement emphasizing individual existence, freedom, and the search for authentic meaning in an indifferent universe.", "domainScores": { "ontology": 0.4, "epistemology": 0.5, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.5, "cosmology": 0.2, "teleology": 0.9 }, "facetSummaries": { "ontology": "Existence precedes essence; reality is absurd, contingent.", "epistemology": "Truth emerges through subjective, lived experience.", "praxeology": "Freedom requires personal responsibility and authentic action.", "axiology": "Values are created through choices and commitments.", "mythology": "Mythic motifs reflect the individual’s struggle for meaning.", "cosmology": "The universe is indifferent to human concerns.", "teleology": "Purpose must be constructed by the individual." }, tags: ["philosophical", "modern", "authenticity"]},
  { "name": "Gnosticism", "summary": "A mystical and dualistic tradition emphasizing secret knowledge (gnosis) and inner spiritual awakening.", "domainScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.5, "axiology": 0.6, "mythology": 0.9, "cosmology": 0.8, "teleology": 0.7 }, "facetSummaries": { "ontology": "The material world is an illusion; true reality is spiritual.", "epistemology": "Knowledge is gained through inner revelation.", "praxeology": "Action is oriented toward liberation from material bondage.", "axiology": "Spiritual knowledge and purity are highest values.", "mythology": "Myths encode hidden truths and cosmological mysteries.", "cosmology": "The cosmos is a drama of light and darkness.", "teleology": "The goal is reunification with the divine source." }, tags: ["mystical", "dualism", "spiritual"]},
  { "name": "Hinduism", "summary": "A diverse religious tradition rooted in India, focusing on dharma, karma, reincarnation, and the pursuit of liberation (moksha).", "domainScores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.8, "teleology": 0.9 }, "facetSummaries": { "ontology": "All is Brahman—reality is one, manifest in many forms.", "epistemology": "Knowledge arises from scripture, guru, and direct realization.", "praxeology": "Dharma prescribes right action according to role and stage of life.", "axiology": "Value is placed on harmony, non-harm, and spiritual growth.", "mythology": "Myths narrate cosmic cycles, gods, and divine play.", "cosmology": "The universe is cyclic and endlessly recreated.", "teleology": "The soul’s aim is liberation from the cycle of rebirth." }, tags: ["religious", "eastern", "dharma"]},
  { "name": "Humanism", "summary": "A philosophical and ethical stance that values human agency, rationality, and well-being, often without reliance on the supernatural.", "domainScores": { "ontology": 0.4, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.4 }, "facetSummaries": { "ontology": "Reality is best understood through science and reason.", "epistemology": "Knowledge is derived from critical inquiry and evidence.", "praxeology": "Ethical action supports human dignity and flourishing.", "axiology": "Human well-being is the ultimate value.", "mythology": "Myths are seen as cultural products, not truths.", "cosmology": "The universe is a natural system open to investigation.", "teleology": "Meaning is created through human endeavor." }, tags: ["philosophical", "ethics", "secular"]},
  { "name": "Islam", "summary": "A monotheistic Abrahamic faith rooted in the revelation to Muhammad, emphasizing submission to God (Allah) and the unity of creation.", "domainScores": { "ontology": 0.8, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 1.0 }, "facetSummaries": { "ontology": "All reality is created by and dependent upon God.", "epistemology": "Knowledge comes from divine revelation and rational reflection.", "praxeology": "Life is to be lived in accordance with God’s guidance (Sharia).", "axiology": "Justice, mercy, and faithfulness are highest values.", "mythology": "Stories of prophets teach moral and spiritual lessons.", "cosmology": "The cosmos is ordered, purposeful, and created.", "teleology": "Life’s aim is fulfillment of God’s will and paradise." }, tags: ["religious", "monotheistic", "abrahamic"]},
  { "name": "Jainism", "summary": "An ancient Indian religion emphasizing non-violence (ahimsa), karma, and the liberation of the soul through self-discipline.", "domainScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 1.0, "axiology": 1.0, "mythology": 0.6, "cosmology": 0.8, "teleology": 1.0 }, "facetSummaries": { "ontology": "Reality is eternal, with countless individual souls (jiva).", "epistemology": "Knowledge comes from scripture, reason, and intuition.", "praxeology": "Non-violence in thought, word, and deed is essential.", "axiology": "Compassion and truthfulness are supreme values.", "mythology": "Tirthankara stories model spiritual discipline.", "cosmology": "The universe is uncreated, eternal, and cyclical.", "teleology": "Soul’s aim is liberation from karma and rebirth." }, tags: ["religious", "eastern", "ahimsa"]},
  { "name": "Judaism", "summary": "An ancient monotheistic tradition centered on covenant, law (Torah), and the ongoing relationship between God and the Jewish people.", "domainScores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.8 }, "facetSummaries": { "ontology": "God is the creator and sustainer of all.", "epistemology": "Knowledge is received through revelation and study.", "praxeology": "Lawful action fulfills the covenant and expresses holiness.", "axiology": "Justice, mercy, and study are core values.", "mythology": "Biblical narratives shape collective memory.", "cosmology": "The cosmos is ordered and purposeful.", "teleology": "History moves toward redemption and peace." }, tags: ["religious", "monotheistic", "abrahamic"]},
  { "name": "Kabbalah", "summary": "A mystical tradition within Judaism that explores the hidden dimensions of God, creation, and the human soul.", "domainScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.9 }, "facetSummaries": { "ontology": "Divine reality underlies the physical world.", "epistemology": "Knowledge is received through mystical contemplation.", "praxeology": "Rituals align the microcosm with the macrocosm.", "axiology": "Spiritual ascent and repair (tikkun) are key values.", "mythology": "Myths unveil the structure of the divine.", "cosmology": "Creation unfolds through divine emanations.", "teleology": "Purpose is reunion with the divine source." }, tags: ["mystical", "jewish", "esoteric"]},
  { "name": "Mahayana Buddhism", "summary": "A broad Buddhist tradition emphasizing universal compassion, the bodhisattva path, and emptiness (shunyata).", "domainScores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.8, "teleology": 1.0 }, "facetSummaries": { "ontology": "All phenomena are empty of fixed nature.", "epistemology": "Wisdom is direct insight into emptiness.", "praxeology": "Compassionate action for all beings is central.", "axiology": "Selflessness and wisdom are highest values.", "mythology": "Stories of Buddhas and bodhisattvas inspire practice.", "cosmology": "Worlds arise and dissolve in interdependent cycles.", "teleology": "Aim is universal liberation (Buddhahood)." }, tags: ["spiritual", "buddhist", "compassion"]},
  { "name": "Materialism", "summary": "A worldview holding that matter is the fundamental substance of reality and all phenomena can be explained by material interactions.", "domainScores": { "ontology": 0.0, "epistemology": 1.0, "praxeology": 0.5, "axiology": 0.6, "mythology": 0.1, "cosmology": 0.3, "teleology": 0.2 }, "facetSummaries": { "ontology": "Only physical matter is real.", "epistemology": "Truth is discovered through empirical science.", "praxeology": "Action is shaped by physical necessity and utility.", "axiology": "Values are emergent from human nature and society.", "mythology": "Myths are seen as imaginative stories.", "cosmology": "The universe is governed by physical laws.", "teleology": "Purpose is a human construct." }, tags: ["philosophical", "scientific", "physicalism"]},
  { "name": "Modernism", "summary": "A cultural and philosophical movement prioritizing progress, rationality, and mastery over nature through science and technology.", "domainScores": { "ontology": 0.3, "epistemology": 0.9, "praxeology": 0.9, "axiology": 0.8, "mythology": 0.2, "cosmology": 0.4, "teleology": 0.5 }, "facetSummaries": { "ontology": "Reality is knowable and improvable.", "epistemology": "Rational inquiry and evidence build knowledge.", "praxeology": "Human action shapes the future.", "axiology": "Progress and innovation are valued.", "mythology": "Myth gives way to reason and critique.", "cosmology": "The universe is subject to human understanding.", "teleology": "Purpose is self-determined and future-oriented." }, tags: ["philosophical", "cultural", "progress"]},
  { "name": "Mysticism", "summary": "A spiritual orientation focused on direct experience of the divine, transcending ordinary perception and dogma.", "domainScores": { "ontology": 1.0, "epistemology": 0.9, "praxeology": 0.7, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.9 }, "facetSummaries": { "ontology": "All is divine; the world is a manifestation of Spirit.", "epistemology": "Knowledge is gained through inner illumination.", "praxeology": "Practice seeks direct union with the divine.", "axiology": "Unity and transcendence are highest values.", "mythology": "Myth points to ineffable truths.", "cosmology": "The universe is an emanation of Spirit.", "teleology": "Purpose is union with the Absolute." }, tags: ["spiritual", "experiential", "transcendent"]},
  { "name": "Naturalism", "summary": "A worldview asserting that everything arises from natural properties and causes, excluding supernatural explanations.", "domainScores": { "ontology": 0.1, "epistemology": 1.0, "praxeology": 0.8, "axiology": 0.6, "mythology": 0.2, "cosmology": 0.3, "teleology": 0.2 }, "facetSummaries": { "ontology": "Only the natural world exists.", "epistemology": "Science is the path to knowledge.", "praxeology": "Ethics are grounded in natural consequences.", "axiology": "Value is found in natural flourishing.", "mythology": "Myth is cultural narrative, not truth.", "cosmology": "The cosmos is entirely natural.", "teleology": "Purpose is emergent, not imposed." }, tags: ["philosophical", "scientific", "empirical"]},
  { "name": "Neoplatonism", "summary": "A philosophical tradition teaching that all reality emanates from a single source (the One), emphasizing spiritual ascent.", "domainScores": { "ontology": 1.0, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.9, "teleology": 1.0 }, "facetSummaries": { "ontology": "All derives from the One; spiritual reality is supreme.", "epistemology": "Knowledge is ascent from opinion to the divine intellect.", "praxeology": "Contemplative practice leads to union with the source.", "axiology": "Goodness is participation in the divine.", "mythology": "Myth encodes spiritual realities.", "cosmology": "The cosmos is an ordered hierarchy of emanations.", "teleology": "Purpose is return to the One." }, tags: ["philosophical", "mystical", "classical"]},
  { "name": "Nihilism", "summary": "A worldview that rejects inherent meaning, purpose, or value in life, often as a response to the collapse of previous certainties.", "domainScores": { "ontology": 0.0, "epistemology": 0.2, "praxeology": 0.3, "axiology": 0.0, "mythology": 0.0, "cosmology": 0.1, "teleology": 0.0 }, "facetSummaries": { "ontology": "Nothing has ultimate substance or permanence.", "epistemology": "Certainty is impossible.", "praxeology": "No action is intrinsically meaningful.", "axiology": "There are no objective values.", "mythology": "All narratives are arbitrary.", "cosmology": "The universe is indifferent.", "teleology": "Purpose is nonexistent." }, tags: ["philosophical", "skepticism", "meaninglessness"]},
  { "name": "Panpsychism", "summary": "A philosophical view that consciousness or mind is a fundamental and ubiquitous aspect of reality.", "domainScores": { "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.6, "cosmology": 0.8, "teleology": 0.5 }, "facetSummaries": { "ontology": "Mind is a universal property of matter.", "epistemology": "Understanding comes from introspection and science.", "praxeology": "Action acknowledges mind in all beings.", "axiology": "Value is found in universal sentience.", "mythology": "Myths may reflect the pervasiveness of spirit.", "cosmology": "The cosmos is suffused with consciousness.", "teleology": "Purpose is evolutionary and open-ended." }, tags: ["philosophical", "consciousness", "metaphysics"]},
  { "name": "Pantheism", "summary": "A doctrine identifying the universe itself with the divine—God is all, and all is God.", "domainScores": { "ontology": 1.0, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.8, "cosmology": 1.0, "teleology": 0.8 }, "facetSummaries": { "ontology": "God and the universe are identical.", "epistemology": "Intuitive and scientific knowing are both valued.", "praxeology": "Action aligns with the natural order.", "axiology": "All is worthy, as all is divine.", "mythology": "Nature myths point to the divine in all things.", "cosmology": "The cosmos is sacred, infinite, and interconnected.", "teleology": "Purpose is realization of unity." }, tags: ["spiritual", "philosophical", "divinity"]},
  // Platonism was already in existingRawCodexData, newer version here (summary, scores, summaries differ):
  // { "name": "Platonism", "summary": "A worldview centered on the existence of eternal Forms or Ideas as the ultimate reality.", "domainScores": { "ontology": 1.0, "epistemology": 0.8, "praxeology": 0.7, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.9, "teleology": 0.9 }, "facetSummaries": { "ontology": "Eternal Forms or Ideas are the ultimate reality.", "epistemology": "Knowledge is recollection of the Forms.", "praxeology": "Virtue is alignment with the Good.", "axiology": "Truth, beauty, and goodness are supreme values.", "mythology": "Myths veil metaphysical truths.", "cosmology": "Cosmos mirrors the world of Forms.", "teleology": "Goal is ascent to the vision of the Good." } },
  { "name": "Postmodernism", "summary": "A skeptical and critical orientation challenging grand narratives, objectivity, and stable meaning.", "domainScores": { "ontology": 0.3, "epistemology": 0.2, "praxeology": 0.5, "axiology": 0.4, "mythology": 0.8, "cosmology": 0.2, "teleology": 0.1 }, "facetSummaries": { "ontology": "Reality is fragmented and constructed.", "epistemology": "Knowledge is contextual and contingent.", "praxeology": "Action resists fixed identities and power structures.", "axiology": "Values are plural and unstable.", "mythology": "Myth is deconstructed and reinterpreted.", "cosmology": "Cosmos lacks inherent order or purpose.", "teleology": "Purpose is an illusion." }, tags: ["philosophical", "cultural", "critique"]},
  { "name": "Process Philosophy", "summary": "A metaphysical approach emphasizing becoming, change, and relationality as more fundamental than substance.", "domainScores": { "ontology": 0.6, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.4, "cosmology": 0.7, "teleology": 0.7 }, "facetSummaries": { "ontology": "Reality is process and event, not fixed substance.", "epistemology": "Truth unfolds dynamically.", "praxeology": "Ethics is responsive to novelty and context.", "axiology": "Creativity and harmony are valued.", "mythology": "Myths model transformation.", "cosmology": "The cosmos is in perpetual becoming.", "teleology": "Aim is creative advance into novelty." }, tags: ["philosophical", "metaphysics", "relationality"]},
  { "name": "Rationalism", "summary": "A philosophical approach emphasizing reason and logic as the primary source of knowledge.", "domainScores": { "ontology": 0.7, "epistemology": 1.0, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.2, "cosmology": 0.5, "teleology": 0.6 }, "facetSummaries": { "ontology": "Reality is knowable through reason.", "epistemology": "Reason and intuition are supreme sources of knowledge.", "praxeology": "Action follows rational principle.", "axiology": "Values are discoverable by logic.", "mythology": "Myths are interpreted rationally.", "cosmology": "The universe is logically ordered.", "teleology": "Purpose is deduced from first principles." }, tags: ["philosophical", "epistemology", "reason"]},
  { "name": "Romanticism", "summary": "A cultural and philosophical movement emphasizing emotion, nature, and the creative imagination.", "domainScores": { "ontology": 0.8, "epistemology": 0.5, "praxeology": 0.6, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.7, "teleology": 0.7 }, "facetSummaries": { "ontology": "Nature and spirit are entwined.", "epistemology": "Intuition and feeling are valid sources of knowledge.", "praxeology": "Creative self-expression is valued.", "axiology": "Emotion, beauty, and the sublime are highest values.", "mythology": "Mythic imagination shapes experience.", "cosmology": "The world is alive and meaningful.", "teleology": "Aim is self-realization and unity with nature." }, tags: ["cultural", "artistic", "emotion"]},
  { "name": "Shamanism", "summary": "A range of animistic traditions emphasizing the healer’s journey between worlds for wisdom and transformation.", "domainScores": { "ontology": 0.9, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.7, "mythology": 1.0, "cosmology": 0.9, "teleology": 0.8 }, "facetSummaries": { "ontology": "Spirits and worlds interpenetrate reality.", "epistemology": "Knowledge is gained through visionary experience.", "praxeology": "Ritual and journey are methods of healing.", "axiology": "Balance and reciprocity are core values.", "mythology": "Myth guides the healer’s journey.", "cosmology": "The universe is populated by many spirits.", "teleology": "Purpose is harmony and restoration." }, tags: ["spiritual", "indigenous", "healing"]},
  // Stoicism was already in existingRawCodexData, newer version here:
  // { "name": "Stoicism", "summary": "An ancient philosophy teaching acceptance of fate, virtue as the only good, and living in accord with nature’s order.", "domainScores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 1.0, "axiology": 1.0, "mythology": 0.2, "cosmology": 0.7, "teleology": 0.9 }, "facetSummaries": { "ontology": "The cosmos is rational and governed by logos.", "epistemology": "Wisdom is understanding what is and isn’t in our control.", "praxeology": "Virtue is living in accord with nature.", "axiology": "Virtue is the sole good.", "mythology": "Myths serve as moral exemplars.", "cosmology": "The world is a living organism.", "teleology": "Aim is ataraxia—serene acceptance." } },
  // Sufism was "Mystical Sufism" in existingRawCodexData, newer version here:
  // { "name": "Sufism", "summary": "The mystical dimension of Islam, focused on the direct experience of divine love and unity.", "domainScores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.8, "teleology": 1.0 }, "facetSummaries": { "ontology": "Reality is unity—God alone is real.", "epistemology": "Knowledge is attained by unveiling the heart.", "praxeology": "Practice is remembrance (dhikr) and love.", "axiology": "Love and surrender are supreme values.", "mythology": "Myth and poetry express mystical truths.", "cosmology": "The universe is a reflection of divine beauty.", "teleology": "Purpose is reunion with the Beloved." } },
  // Taoism was already in existingRawCodexData, newer version here:
  // { "name": "Taoism", "summary": "An ancient Chinese tradition teaching harmony with the Tao—the natural way of the universe.", "domainScores": { "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.7, "cosmology": 0.9, "teleology": 0.8 }, "facetSummaries": { "ontology": "All arises from and returns to the Tao.", "epistemology": "Wisdom is intuitive, non-conceptual.", "praxeology": "Non-action (wu wei) achieves harmony.", "axiology": "Simplicity, humility, and balance are valued.", "mythology": "Myth guides action without force.", "cosmology": "Nature is an unfolding process.", "teleology": "Aim is effortless alignment with the Tao." } },
  { "name": "Theosophy", "summary": "A mystical movement synthesizing Eastern and Western traditions, teaching spiritual evolution, karma, and hidden wisdom.", "domainScores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.6, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.9, "teleology": 1.0 }, "facetSummaries": { "ontology": "Spiritual planes underlie material reality.", "epistemology": "Intuition and esoteric study reveal hidden truths.", "praxeology": "Actions influence karma and spiritual evolution.", "axiology": "Wisdom, altruism, and service are highest values.", "mythology": "Myth encodes perennial teachings.", "cosmology": "The cosmos is a hierarchy of evolving worlds.", "teleology": "Purpose is spiritual ascent and union with the divine." }, tags: ["mystical", "esoteric", "synthesis"]},
  { "name": "Theravada Buddhism", "summary": "The earliest form of Buddhism, emphasizing individual enlightenment through ethical conduct, meditation, and insight.", "domainScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 1.0, "axiology": 0.8, "mythology": 0.6, "cosmology": 0.7, "teleology": 1.0 }, "facetSummaries": { "ontology": "All phenomena are impermanent and non-self.", "epistemology": "Knowledge arises from direct meditative insight.", "praxeology": "Ethical conduct and meditation are the path.", "axiology": "Wisdom and compassion guide action.", "mythology": "Myth provides context for ethical practice.", "cosmology": "The universe cycles through endless rebirths.", "teleology": "Purpose is liberation from suffering (nirvana)." }, tags: ["spiritual", "buddhist", "meditation"]},
  { "name": "Transcendentalism", "summary": "A 19th-century American movement emphasizing the inherent goodness of people and nature, and the primacy of intuition.", "domainScores": { "ontology": 0.8, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.7, "cosmology": 0.6, "teleology": 0.7 }, "facetSummaries": { "ontology": "Spirit pervades all nature and humanity.", "epistemology": "Intuition and self-reliance are paths to truth.", "praxeology": "Nonconformity and individual action are prized.", "axiology": "Truth and authenticity are highest values.", "mythology": "Nature is the living symbol of Spirit.", "cosmology": "Nature is harmonious and interconnected.", "teleology": "Aim is self-cultivation and spiritual realization." }, tags: ["philosophical", "american", "nature", "intuition"]},
  { "name": "Unitarian Universalism", "summary": "A pluralistic faith embracing wisdom from all traditions and affirming freedom of belief and conscience.", "domainScores": { "ontology": 0.5, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.5, "cosmology": 0.5, "teleology": 0.7 }, "facetSummaries": { "ontology": "Reality is open to diverse interpretations.", "epistemology": "Truth is sought through reason, experience, and tradition.", "praxeology": "Action pursues justice and compassion.", "axiology": "Dignity, equity, and community are core values.", "mythology": "Wisdom is found in many stories.", "cosmology": "Cosmos is explored through many lenses.", "teleology": "Purpose is self-actualization and service." }, tags: ["religious", "pluralistic", "liberal"]},
  { "name": "Vedanta", "summary": "A major school of Hindu philosophy teaching the unity of Atman (self) and Brahman (absolute reality).", "domainScores": { "ontology": 1.0, "epistemology": 0.8, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.9, "teleology": 1.0 }, "facetSummaries": { "ontology": "Only Brahman is ultimately real; the world is appearance.", "epistemology": "Direct realization leads to knowledge of unity.", "praxeology": "Spiritual practice removes ignorance.", "axiology": "Liberation is the highest value.", "mythology": "Myth reveals the divine play (lila).", "cosmology": "The cosmos is cyclical, an expression of Brahman.", "teleology": "The goal is moksha—union with the Absolute." }, tags: ["spiritual", "hindu", "nonduality"]},
  { "name": "Zen Buddhism", "summary": "A school of Mahayana Buddhism emphasizing direct, wordless experience and sudden enlightenment.", "domainScores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.6, "cosmology": 0.7, "teleology": 0.8 }, "facetSummaries": { "ontology": "All is empty, interdependent, and immediate.", "epistemology": "Intuitive, direct experience transcends concepts.", "praxeology": "Practice is zazen (sitting meditation) and daily mindfulness.", "axiology": "Simplicity, presence, and compassion are valued.", "mythology": "Koans and stories prompt insight, not dogma.", "cosmology": "The world is always already complete.", "teleology": "Goal is awakening to original nature." }, tags: ["spiritual", "buddhist", "zen", "meditation"]},
  { "name": "Zoroastrianism", "summary": "An ancient Persian religion centering on the cosmic struggle between truth and falsehood, light and darkness.", "domainScores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.9 }, "facetSummaries": { "ontology": "Duality of truth (asha) and falsehood (druj) defines reality.", "epistemology": "Revelation and reason are paths to knowledge.", "praxeology": "Good thoughts, words, and deeds are essential.", "axiology": "Truth and purity are supreme values.", "mythology": "Myth narrates the cosmic drama of light vs. darkness.", "cosmology": "Cosmos is a battleground for order and chaos.", "teleology": "Purpose is the ultimate triumph of light." }, tags: ["religious", "ancient", "persian", "dualism"]},
  { "name": "Agnosticism", "summary": "A position of suspended belief about the existence of deities or ultimate reality, prioritizing uncertainty or open inquiry.", "domainScores": { "ontology": 0.4, "epistemology": 0.5, "praxeology": 0.5, "axiology": 0.5, "mythology": 0.2, "cosmology": 0.2, "teleology": 0.3 }, "facetSummaries": { "ontology": "Reality is possibly unknowable.", "epistemology": "Knowledge of ultimate things is suspended.", "praxeology": "Actions are provisional and open-minded.", "axiology": "Values are tentative and plural.", "mythology": "Myth is seen as speculation.", "cosmology": "The cosmos may be mysterious.", "teleology": "Purpose is an open question." }, tags: ["philosophical", "skepticism", "uncertainty"]},
  { "name": "Atheism", "summary": "The absence of belief in deities, often grounded in skepticism, rationalism, or naturalism.", "domainScores": { "ontology": 0.1, "epistemology": 0.9, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.0, "cosmology": 0.2, "teleology": 0.1 }, "facetSummaries": { "ontology": "No supernatural beings exist.", "epistemology": "Reason and evidence are supreme.", "praxeology": "Ethics and actions are human-centered.", "axiology": "Value is grounded in human concerns.", "mythology": "Myth is metaphor or fiction.", "cosmology": "Cosmos is natural, not divinely ordered.", "teleology": "Purpose is individually determined." }, tags: ["philosophical", "secular", "naturalism"]},
  { "name": "Catholicism", "summary": "The largest Christian tradition, emphasizing the sacraments, apostolic succession, and the universal church.", "domainScores": { "ontology": 0.8, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.8, "teleology": 1.0 }, "facetSummaries": { "ontology": "Creation is real, but God is its foundation.", "epistemology": "Scripture, tradition, and reason guide knowledge.", "praxeology": "Sacraments and works express faith.", "axiology": "Love, faith, and charity are supreme.", "mythology": "Myths are sacred history and mystery.", "cosmology": "Cosmos is purposeful, ordered by God.", "teleology": "Purpose is union with God in eternal life." }, tags: ["religious", "christian", "western"]},
  { "name": "Deism", "summary": "A belief in a creator God who does not intervene in the universe, emphasizing reason and observation of the natural world.", "domainScores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.6, "axiology": 0.7, "mythology": 0.3, "cosmology": 0.7, "teleology": 0.6 }, "facetSummaries": { "ontology": "God is a distant creator, not immanent.", "epistemology": "Reason and observation reveal truth.", "praxeology": "Ethics are based on natural law.", "axiology": "Virtue, rationality, and autonomy are valued.", "mythology": "Myth is instructive but not authoritative.", "cosmology": "Universe runs on consistent laws.", "teleology": "Purpose is found in fulfilling natural potential." }, tags: ["philosophical", "reason", "creator"]},
  { "name": "Druze Faith", "summary": "A secretive Middle Eastern tradition blending elements of Islam, Gnosticism, Neoplatonism, and more.", "domainScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.8, "cosmology": 0.8, "teleology": 0.9 }, "facetSummaries": { "ontology": "Reality is layered and esoteric.", "epistemology": "Knowledge is revealed to the initiated.", "praxeology": "Action reflects secret teachings.", "axiology": "Wisdom and loyalty are prized.", "mythology": "Myths conceal hidden truths.", "cosmology": "The cosmos reflects divine unity.", "teleology": "Purpose is spiritual return and perfection." }, tags: ["religious", "esoteric", "middle-eastern"]},
  { "name": "Manichaeism", "summary": "A dualistic religion founded by Mani, teaching the cosmic struggle between light and darkness.", "domainScores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.7, "axiology": 0.7, "mythology": 1.0, "cosmology": 0.7, "teleology": 0.8 }, "facetSummaries": { "ontology": "Reality is divided into spiritual light and material darkness.", "epistemology": "Revelation and ascetic practice yield knowledge.", "praxeology": "Ethical action separates light from darkness.", "axiology": "Purity and detachment are prized.", "mythology": "Myth details the struggle of light in matter.", "cosmology": "Cosmos is the battleground of dual forces.", "teleology": "Purpose is liberation of light from darkness." }, tags: ["religious", "dualism", "ancient"]},
  { "name": "Quakerism", "summary": "A Christian tradition emphasizing direct inner experience, simplicity, pacifism, and equality.", "domainScores": { "ontology": 0.7, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.5, "cosmology": 0.6, "teleology": 0.7 }, "facetSummaries": { "ontology": "Divine light dwells within all.", "epistemology": "Truth comes through inward experience.", "praxeology": "Action is guided by conscience and peace.", "axiology": "Equality, integrity, and nonviolence are valued.", "mythology": "Bible is interpreted in the light of experience.", "cosmology": "World is sacred, guided by Spirit.", "teleology": "Purpose is realization of the Inner Light." }, tags: ["religious", "christian", "pacifism", "equality"]},
  { "name": "Rosicrucianism", "summary": "A Western esoteric movement blending alchemy, mysticism, and the pursuit of hidden wisdom.", "domainScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.7, "teleology": 0.9 }, "facetSummaries": { "ontology": "Nature is alive with spiritual correspondences.", "epistemology": "Knowledge is sought through both reason and mystic revelation.", "praxeology": "Practice is self-transformation and service.", "axiology": "Wisdom and harmony are highest values.", "mythology": "Myth encodes allegorical truths.", "cosmology": "Cosmos is a web of interconnected forces.", "teleology": "Purpose is the perfection of self and world." }, tags: ["mystical", "esoteric", "western"]},
  { "name": "Secular Humanism", "summary": "A worldview prioritizing human welfare, ethics, and rationality without reference to the supernatural.", "domainScores": { "ontology": 0.2, "epistemology": 0.9, "praxeology": 0.9, "axiology": 1.0, "mythology": 0.1, "cosmology": 0.2, "teleology": 0.3 }, "facetSummaries": { "ontology": "Only the natural world exists.", "epistemology": "Reason and science guide knowledge.", "praxeology": "Action pursues human flourishing.", "axiology": "Human welfare and autonomy are highest values.", "mythology": "Myth is cultural heritage.", "cosmology": "The universe is natural and knowable.", "teleology": "Purpose is human-created." }, tags: ["philosophical", "secular", "ethics", "humanism"]},
  { "name": "Shinto", "summary": "The indigenous spirituality of Japan, centering on reverence for kami (spirits) in nature and ancestral tradition.", "facetScores": { "ontology": 0.7, "epistemology": 0.5, "praxeology": 0.8, "axiology": 0.7, "mythology": 0.9, "cosmology": 0.6, "teleology": 0.6 }, "facetSummaries": { "ontology": "World inhabited by kami (sacred presences) in all things.", "epistemology": "Knowledge comes from tradition and ritual experience.", "praxeology": "Practice is honoring kami and preserving purity.", "axiology": "Respect, purity, and harmony are core values.", "mythology": "Myth shapes the spiritual and social order.", "cosmology": "Cosmos is interconnected and animated.", "teleology": "Purpose is harmonious living with nature and ancestors." }, tags: ["religious", "indigenous", "japanese"]},
  { "name": "Sikhism", "summary": "A monotheistic Indian religion founded by Guru Nanak, teaching devotion, equality, and service.", "facetScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.9 }, "facetSummaries": { "ontology": "One divine reality pervades all.", "epistemology": "Truth revealed by Guru and selfless living.", "praxeology": "Service, justice, and devotion are central practices.", "axiology": "Equality and compassion guide ethics.", "mythology": "Stories of Gurus guide moral vision.", "cosmology": "Creation as divine play (lila).", "teleology": "Union with God is life’s goal." }, tags: ["religious", "monotheistic", "indian"]},
  // Stoicism, Sufism, Taoism: Newer versions of these with different data were provided here.
  // The current de-duplication logic (if names match exactly or case-insensitively) would favor
  // the versions already present in `existingRawCodexData`.
  // If these new versions are preferred, the de-duplication logic or the base data would need adjustment.
  // For this update, I'm just adding them to the `newRawCodexDataBatch`.
  { "name": "Stoicism", "summary": "A Greco-Roman philosophy teaching virtue, self-control, and alignment with nature's order.", "facetScores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.3, "cosmology": 0.8, "teleology": 1.0 }, "facetSummaries": { "ontology": "Nature is rational and ordered.", "epistemology": "Wisdom comes through reason and reflection.", "praxeology": "Virtue is practiced through self-mastery.", "axiology": "Virtue is the highest good.", "mythology": "Myth is subordinate to philosophy.", "cosmology": "World is a living, rational organism.", "teleology": "Goal is to live in harmony with nature." }, tags: ["philosophical", "ethics", "resilience"]}, // Note: Stoicism already exists
  { "name": "Sufism", "summary": "The mystical dimension of Islam, focusing on direct experience of God through love and devotion.", "facetScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.9, "cosmology": 0.8, "teleology": 1.0 }, "facetSummaries": { "ontology": "God is the only true reality.", "epistemology": "Truth found in direct mystical experience.", "praxeology": "Practice is remembrance (dhikr) and love.", "axiology": "Love and selfless devotion are highest values.", "mythology": "Poetry and parable express divine realities.", "cosmology": "Creation is a reflection of God’s beauty.", "teleology": "Aim is annihilation of the self in God (fana)." }, tags: ["mystical", "islamic", "spiritual"]}, // Note: Mystical Sufism exists
  { "name": "Taoism", "summary": "An ancient Chinese tradition emphasizing harmony with the Tao (the Way), simplicity, and naturalness.", "facetScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.8, "cosmology": 0.8, "teleology": 0.8 }, "facetSummaries": { "ontology": "Reality is a dynamic, living process (Tao).", "epistemology": "Wisdom comes from contemplation and experience.", "praxeology": "Action flows from non-action (wu wei).", "axiology": "Simplicity, spontaneity, and humility are valued.", "mythology": "Myths illustrate cosmic order and paradox.", "cosmology": "Yin and yang structure all phenomena.", "teleology": "Goal is harmony and balance with Tao." }, tags: ["spiritual", "eastern", "nature"]}, // Note: Taoism already exists
  { "name": "Transhumanism", "summary": "A movement advocating for transforming the human condition via advanced technology, reason, and science.", "domainScores": { "ontology": 0.3, "epistemology": 0.9, "praxeology": 0.9, "axiology": 0.7, "mythology": 0.2, "cosmology": 0.5, "teleology": 0.9 }, "facetSummaries": { "ontology": "Reality is material and technologically malleable.", "epistemology": "Knowledge expands through science and innovation.", "praxeology": "Ethics guide responsible enhancement.", "axiology": "Human flourishing and intelligence are values.", "mythology": "Myth is repurposed for scientific narrative.", "cosmology": "Universe is a frontier for exploration.", "teleology": "Aim is transcending biological limitations." }, tags: ["philosophical", "futurism", "technology"]},
  // Unitarian Universalism was already in the previous batch.
  { "name": "Wicca", "summary": "A modern pagan religion honoring nature, cycles, and the divine feminine and masculine.", "domainScores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.7, "teleology": 0.7 }, "facetSummaries": { "ontology": "Nature is sacred and divine.", "epistemology": "Knowledge arises from experience and ritual.", "praxeology": "Practice involves ritual, magic, and attunement.", "axiology": "Balance, harm none, and celebrate life.", "mythology": "Myth cycles (Wheel of the Year) guide practice.", "cosmology": "World is cyclical and interconnected.", "teleology": "Purpose is harmony with nature’s cycles." }, tags: ["pagan", "nature", "spiritual"]},
  // Zoroastrianism was already in the previous batch.
  // Animism was already in existingRawCodexData.
];

// --- Helper Functions ---
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0];
  const validScores = scores.filter(s => s && typeof s.score === 'number');
  if (validScores.length === 0) return FACET_NAMES[0];
  return validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev).facetName || FACET_NAMES[0];
};

const mapRawDataToCodexEntries = (rawData: any[]): CodexEntry[] => {
  return rawData.map((rawItem): CodexEntry | null => {
    if (!rawItem || typeof rawItem.name !== 'string') {
      console.error("mapRawDataToCodexEntries: Invalid raw data item", rawItem);
      return null; // Skip invalid items
    }

    const domainScoresArray: DomainScore[] = [];
    if (rawItem.domainScores && typeof rawItem.domainScores === 'object') {
      FACET_NAMES.forEach(facetKey => {
        // Check for both capitalized and lowercase keys from raw data
        const score = rawItem.domainScores[facetKey] ?? rawItem.domainScores[facetKey.toLowerCase()];
        domainScoresArray.push({
          facetName: facetKey,
          score: (typeof score === 'number' && !isNaN(score)) ? Math.max(0, Math.min(1, score)) : 0.5 // Default to 0.5 if score is invalid/missing
        });
      });
    } else {
      // Fallback: If domainScores is missing or not an object, create neutral scores
      FACET_NAMES.forEach(facetKey => {
        domainScoresArray.push({ facetName: facetKey, score: 0.5 });
      });
    }
    
    const facetSummariesProcessed: { [K_FacetName in FacetName]?: string } = {};
    const rawSummaries = rawItem.facetSummaries || rawItem.facetSummary; // Accept both keys
    if (rawSummaries && typeof rawSummaries === 'object') {
      for (const facetKey of FACET_NAMES) {
        const summary = rawSummaries[facetKey] ?? rawSummaries[facetKey.toLowerCase()];
        if (typeof summary === 'string') {
          facetSummariesProcessed[facetKey] = summary;
        }
      }
    }

    const tags = Array.isArray(rawItem.tags) ? rawItem.tags.map(String) : [];
    let category: CodexEntry['category'] = "custom";
    if (tags.includes("philosophical") || tags.includes("philosophy")) category = "philosophical";
    else if (tags.includes("religious") || tags.includes("religion") || tags.includes("spiritual")) category = "religious";
    else if (tags.includes("archetypal") || tags.includes("archetype")) category = "archetypal";
    else if (tags.includes("mystical")) category = "religious"; // Mystical often aligns with religious/spiritual
    else if (tags.includes("scientific")) category = "philosophical"; // Scientific often aligns with philosophical
    else if (tags.includes("cultural")) category = "custom"; 
    else if (tags.includes("indigenous")) category = "religious";


    return {
      id: rawItem.name.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, ''),
      title: rawItem.name,
      summary: rawItem.summary || "No summary available.",
      domainScores: domainScoresArray,
      category: category,
      isArchetype: tags.includes("archetypal") || tags.includes("archetype"),
      createdAt: new Date().toISOString(),
      tags: tags,
      facetSummaries: facetSummariesProcessed,
    };
  }).filter(entry => entry !== null) as CodexEntry[]; // Filter out any nulls from invalid raw items
};


export default function CodexPage() {
  console.log("CodexPage component function invoked"); // For debugging module load

  const { addSavedWorldview, savedWorldviews } = useWorldview();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title_asc");
  const [activeCategory, setActiveCategory] = useState<CodexEntry['category'] | "all">("all");
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Defer data processing to useMemo to avoid issues during module initialization
  const initialMappedEntries = useMemo(() => {
    try {
      // Combine existing and new raw data, ensuring no duplicates by name (case-insensitive)
      const combinedRawData = [...existingRawCodexData];
      const existingNamesLower = new Set(existingRawCodexData.map(item => item.name.toLowerCase()));

      newRawCodexDataBatch.forEach(newItem => {
        if (newItem && typeof newItem.name === 'string' && !existingNamesLower.has(newItem.name.toLowerCase())) {
          combinedRawData.push(newItem);
          existingNamesLower.add(newItem.name.toLowerCase());
        }
      });
      return mapRawDataToCodexEntries(combinedRawData);
    } catch (error) {
      console.error("Error processing raw Codex data:", error);
      return []; // Fallback to empty array on error
    }
  }, []); // Empty dependency array means this runs once on component mount

  const filteredAndSortedEntries = useMemo(() => {
    if (!initialMappedEntries) return [];
    let entries = initialMappedEntries;

    // Filter by category
    if (activeCategory !== "all") {
      entries = entries.filter(entry => entry.category === activeCategory);
    }

    // Filter by search term (title or summary)
    if (searchTerm) {
      entries = entries.filter(entry =>
        (entry.title && entry.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.summary && entry.summary.toLowerCase().includes(searchTerm.toLowerCase()))
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
    addSavedWorldview(entryToSave); // Context handles the toast for successful save
  };

  // Card component defined inside CodexPage
  const CodexCard = ({ entry }: { entry: CodexEntry }) => {
    const dominantFacet = getDominantFacet(entry.domainScores);
    const titleColor = getFacetColorHsl(dominantFacet);
    const isSaved = savedWorldviews.some(sw => sw.id === entry.id && sw.title === entry.title);

    return (
      <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl md:text-lg line-clamp-1" style={{ color: titleColor }}>{entry.title}</CardTitle>
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

      {/* Filters and Search Bar */}
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

      {/* Codex Grid */}
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

      {/* Details Drawer */}
      {selectedEntry && (
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl" side="right">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SheetHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <SheetTitle className="text-3xl mb-1" style={{color: getFacetColorHsl(getDominantFacet(selectedEntry.domainScores))}}>
                        {selectedEntry.title}
                      </SheetTitle>
                      <SheetDescription className="text-base capitalize">
                        {selectedEntry.category} {selectedEntry.isArchetype ? "Archetype" : "Profile"}
                      </SheetDescription>
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
