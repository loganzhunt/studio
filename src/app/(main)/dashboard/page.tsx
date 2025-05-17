
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES } from "@/config/facets";
import type { DomainScore, FacetName, CodexEntry, WorldviewProfile } from "@/types";
import React, { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetColorHsl } from '@/lib/colors';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// --- Helper Functions (copied/adapted from archetypes/page.tsx) ---
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0];
  return scores.reduce((prev, current) => (prev.score > current.score) ? prev : current).facetName || FACET_NAMES[0];
};

const rawArchetypeData = [
  {
    "name": "The Philosopher",
    "summary": "Seeker of wisdom, driven to question, analyze, and understand the world in depth.",
    "facetScores": { "ontology": 0.8, "epistemology": 1.0, "praxeology": 0.7, "axiology": 0.7, "mythology": 0.6, "cosmology": 0.7, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Ponders the nature of existence and reality.", "epistemology": "Values reason, inquiry, and deep questioning.", "praxeology": "Acts through contemplation and intellectual exploration.", "axiology": "Prioritizes truth and understanding.", "mythology": "Finds meaning in stories of wisdom seekers.", "cosmology": "Sees the cosmos as a realm for discovery.", "teleology": "Purpose is lifelong learning and enlightenment." }
  },
  {
    "name": "The Mystic",
    "summary": "Seeks union with the transcendent through direct experience, intuition, and spiritual practice.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.7, "axiology": 0.8, "mythology": 0.8, "cosmology": 0.7, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Reality is ultimately spiritual and unified.", "epistemology": "Direct experience and inner knowing are trusted.", "praxeology": "Practice is devotion, meditation, contemplation.", "axiology": "Values unity, compassion, transcendence.", "mythology": "Draws inspiration from mystical stories.", "cosmology": "Sees the cosmos as alive with spirit.", "teleology": "Purpose is awakening to divine union." }
  },
  {
    "name": "The Scientist",
    "summary": "Explores the world through observation, experiment, and logical analysis.",
    "facetScores": { "ontology": 0.2, "epistemology": 1.0, "praxeology": 0.8, "axiology": 0.6, "mythology": 0.2, "cosmology": 0.6, "teleology": 0.5 },
    "facetSummaries": { "ontology": "Assumes a material, testable reality.", "epistemology": "Values empirical evidence above all.", "praxeology": "Experiments and theorizes to uncover truth.", "axiology": "Finds value in discovery and progress.", "mythology": "Sees myth as metaphor for human inquiry.", "cosmology": "Explores a vast, natural universe.", "teleology": "Purpose is expanding knowledge." }
  },
  {
    "name": "The Sage",
    "summary": "Seeks timeless wisdom and inner peace, often serving as a guide for others.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.9, "praxeology": 0.7, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Sees reality as ultimately unified and knowable.", "epistemology": "Knowledge is attained through study and self-mastery.", "praxeology": "Acts with restraint and careful consideration.", "axiology": "Wisdom and benevolence are highest values.", "mythology": "Connects to archetypal stories of wise elders.", "cosmology": "Finds harmony in the cosmic order.", "teleology": "Purpose is sharing wisdom for the greater good." }
  },
  {
    "name": "The Hero",
    "summary": "Embraces challenge, transformation, and the quest for meaning through courageous action.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 1.0, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.6, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Reality is shaped through struggle and transformation.", "epistemology": "Learning comes from experience and adversity.", "praxeology": "Acts with bravery and resolve.", "axiology": "Honor, integrity, and sacrifice are key values.", "mythology": "Inspired by the hero’s journey archetype.", "cosmology": "Sees the cosmos as a stage for meaningful quests.", "teleology": "Purpose is overcoming obstacles and actualizing potential." }
  },
  {
    "name": "The Alchemist",
    "summary": "Transmutes the ordinary into the extraordinary, seeking transformation and integration.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.7, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Reality is ever-changing and transformable.", "epistemology": "Seeks hidden knowledge and correspondences.", "praxeology": "Engages in symbolic acts of transformation.", "axiology": "Integration, balance, and growth are valued.", "mythology": "Guided by symbols of death and rebirth.", "cosmology": "Finds cosmic cycles reflected in all things.", "teleology": "Purpose is to achieve inner and outer wholeness." }
  },
  {
    "name": "The Rebel",
    "summary": "Questions authority and the status quo, seeking freedom, authenticity, and new possibilities.",
    "facetScores": { "ontology": 0.5, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.7, "mythology": 0.8, "cosmology": 0.4, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Challenges accepted views of reality.", "epistemology": "Seeks alternative ways of knowing.", "praxeology": "Acts independently and disrupts norms.", "axiology": "Values freedom, autonomy, and truth.", "mythology": "Draws inspiration from trickster figures.", "cosmology": "Sees the cosmos as open to change.", "teleology": "Purpose is to challenge and catalyze transformation." }
  },
  {
    "name": "The Healer",
    "summary": "Devoted to restoration, wholeness, and alleviating suffering in self and others.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Sees all beings as interconnected.", "epistemology": "Intuitive and experiential ways of knowing.", "praxeology": "Acts with compassion and skill.", "axiology": "Values empathy, healing, and service.", "mythology": "Guided by stories of healers and wounded ones.", "cosmology": "Cosmos as a field for restoration.", "teleology": "Purpose is the restoration of balance." }
  },
  {
    "name": "The Pilgrim",
    "summary": "Journeys through life seeking meaning, spiritual growth, and transformative experiences.",
    "facetScores": { "ontology": 0.6, "epistemology": 0.7, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Sees life as a sacred journey.", "epistemology": "Learns from diverse experiences and cultures.", "praxeology": "Embraces change and new directions.", "axiology": "Values discovery, humility, and openness.", "mythology": "Inspired by pilgrimage and quest stories.", "cosmology": "Cosmos as a path of unfolding.", "teleology": "Purpose is to grow and evolve." }
  },
  {
    "name": "The Visionary",
    "summary": "Imagines new possibilities and inspires others toward transformation and collective growth.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.6, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Sees reality as open to creative change.", "epistemology": "Trusts in intuition, imagination, and foresight.", "praxeology": "Acts to inspire, envision, and lead.", "axiology": "Values progress, hope, and transformation.", "mythology": "Draws on myths of prophecy and renaissance.", "cosmology": "Cosmos as a canvas for creation.", "teleology": "Purpose is to realize a better future." }
  },
  {
    "name": "The Caregiver",
    "summary": "Nurtures, protects, and supports others, embodying compassion and selfless service.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 0.9, "axiology": 1.0, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Sees life as interconnected and worthy of care.", "epistemology": "Understands through empathy and relationship.", "praxeology": "Acts through nurturing, supporting, and healing.", "axiology": "Values love, compassion, and generosity.", "mythology": "Guided by stories of caretakers and protectors.", "cosmology": "World as a family or community.", "teleology": "Purpose is to alleviate suffering and foster well-being." }
  },
  {
    "name": "The Trickster",
    "summary": "Disrupts patterns, exposes assumptions, and brings hidden truths to light through humor and subversion.",
    "facetScores": { "ontology": 0.5, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.6, "mythology": 1.0, "cosmology": 0.4, "teleology": 0.7 },
    "facetSummaries": { "ontology": "Reality is flexible and unpredictable.", "epistemology": "Questions certainty and reveals blind spots.", "praxeology": "Acts through play, subversion, and improvisation.", "axiology": "Values wit, freedom, and transformation.", "mythology": "Embodies the archetype of the cosmic joker.", "cosmology": "World as a theater of surprise.", "teleology": "Purpose is to provoke awakening and growth." }
  },
  {
    "name": "The Guardian",
    "summary": "Protects and preserves what is valued, upholding order, tradition, and responsibility.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 1.0, "axiology": 0.8, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Sees reality as structured and worthy of stewardship.", "epistemology": "Learns from history, tradition, and authority.", "praxeology": "Acts to defend and maintain stability.", "axiology": "Values duty, loyalty, and responsibility.", "mythology": "Guided by stories of protectors and saviors.", "cosmology": "World as a domain of trust and duty.", "teleology": "Purpose is to safeguard the good." }
  },
  {
    "name": "The Creator",
    "summary": "Expresses originality, imagination, and artistry, shaping new realities from inspiration.",
    "facetScores": { "ontology": 0.6, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.6, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Reality is a medium for creative expression.", "epistemology": "Trusts imagination, intuition, and the muse.", "praxeology": "Acts through art, invention, and innovation.", "axiology": "Values beauty, originality, and self-expression.", "mythology": "Inspired by myths of creation and invention.", "cosmology": "Cosmos as an evolving masterpiece.", "teleology": "Purpose is to manifest the new." }
  },
  {
    "name": "The Explorer",
    "summary": "Seeks discovery, adventure, and new frontiers—physical, intellectual, or spiritual.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.7, "mythology": 0.8, "cosmology": 0.8, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Sees reality as a vast domain to discover.", "epistemology": "Values curiosity and open-minded inquiry.", "praxeology": "Acts by venturing into the unknown.", "axiology": "Values novelty, freedom, and learning.", "mythology": "Inspired by journeys of explorers and pioneers.", "cosmology": "World as a landscape of possibility.", "teleology": "Purpose is to expand horizons." }
  },
  {
    "name": "The Judge",
    "summary": "Upholds justice, discernment, and ethical balance, weighing evidence and motives impartially.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.8, "axiology": 1.0, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Reality is governed by laws and principles.", "epistemology": "Seeks clarity, objectivity, and evidence.", "praxeology": "Acts by weighing and deciding justly.", "axiology": "Values fairness, integrity, and justice.", "mythology": "Inspired by myths of wise judges.", "cosmology": "World as a court of consequence.", "teleology": "Purpose is to maintain balance." }
  },
  {
    "name": "The Seeker",
    "summary": "Pursues truth, enlightenment, and transcendence, often traveling between worlds and paradigms.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.9, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.7, "cosmology": 0.7, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Sees reality as mysterious and layered.", "epistemology": "Values wisdom from diverse sources.", "praxeology": "Acts through inquiry, travel, and growth.", "axiology": "Values authenticity, growth, and openness.", "mythology": "Guided by stories of seekers and wanderers.", "cosmology": "World as a path to greater awareness.", "teleology": "Purpose is ultimate self-realization." }
  },
  {
    "name": "The Sage-King",
    "summary": "Combines wisdom with leadership, governing self and society in accordance with deeper principles.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.9, "praxeology": 1.0, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.8, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Reality is ordered and intelligible.", "epistemology": "Combines knowledge and insight for wise rule.", "praxeology": "Acts to harmonize and lead.", "axiology": "Values justice, harmony, and benevolence.", "mythology": "Inspired by philosopher-kings and wise rulers.", "cosmology": "World as a kingdom to be governed wisely.", "teleology": "Purpose is to establish a just order." }
  },
  {
    "name": "The Builder",
    "summary": "Manifests vision through practical action, structure, and perseverance—turning ideas into reality.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.7, "praxeology": 1.0, "axiology": 0.8, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Reality as foundation for constructive effort.", "epistemology": "Learns through hands-on engagement.", "praxeology": "Acts by building, shaping, and organizing.", "axiology": "Values stability, achievement, and order.", "mythology": "Guided by myths of founders and architects.", "cosmology": "World as a structure to be improved.", "teleology": "Purpose is to create lasting impact." }
  },
  {
    "name": "The Oracle",
    "summary": "Serves as a conduit for intuition, prophecy, and the mysteries beyond the rational mind.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.6, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.8, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Reality is layered with hidden meaning.", "epistemology": "Trusts inner vision and synchronicity.", "praxeology": "Acts through divination and guidance.", "axiology": "Values wisdom, insight, and mystery.", "mythology": "Embodying the seer, prophet, or sibyl.", "cosmology": "World as an oracle’s mirror.", "teleology": "Purpose is to reveal destiny." }
  },
  {
    "name": "The Warrior",
    "summary": "Embraces conflict, challenge, and adversity to defend, conquer, or uphold a cause.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.6, "praxeology": 1.0, "axiology": 0.7, "mythology": 0.8, "cosmology": 0.5, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Reality is a field for contest and valor.", "epistemology": "Learns from challenge and testing.", "praxeology": "Acts through strategy and strength.", "axiology": "Values courage, honor, and loyalty.", "mythology": "Guided by hero and battle myths.", "cosmology": "World as an arena of conflict.", "teleology": "Purpose is to overcome and defend." }
  },
  {
    "name": "The Artist",
    "summary": "Channels inspiration into beauty, meaning, and novel forms of expression.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.8, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Reality is a canvas for creativity.", "epistemology": "Learns through imagination and observation.", "praxeology": "Acts by creating and expressing.", "axiology": "Values beauty, originality, and authenticity.", "mythology": "Inspired by muses, poets, and creators.", "cosmology": "World as a theater of inspiration.", "teleology": "Purpose is to give form to the ineffable." }
  },
  {
    "name": "The Shaman",
    "summary": "Bridges worlds, heals, and brings back wisdom from the unseen and the archetypal.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.9, "cosmology": 0.8, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Sees layers of reality—seen and unseen.", "epistemology": "Knows through journeying and vision.", "praxeology": "Acts as healer, guide, and mediator.", "axiology": "Values balance, connection, and wisdom.", "mythology": "Embodies the medicine person or dream-walker.", "cosmology": "World as a web of interconnection.", "teleology": "Purpose is to heal, restore, and initiate." }
  },
  {
    "name": "The Merchant",
    "summary": "Navigates the world of exchange, value, and negotiation—creating abundance and opportunity.",
    "facetScores": { "ontology": 0.6, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.8, "mythology": 0.7, "cosmology": 0.5, "teleology": 0.7 },
    "facetSummaries": { "ontology": "Reality as a marketplace of possibility.", "epistemology": "Learns from deals, trends, and patterns.", "praxeology": "Acts by trading, connecting, and negotiating.", "axiology": "Values opportunity, prosperity, and fairness.", "mythology": "Guided by the archetype of the trader or broker.", "cosmology": "World as a network of exchange.", "teleology": "Purpose is to generate abundance." }
  },
  {
    "name": "The Explorer of Consciousness",
    "summary": "Seeks new frontiers of perception, mind, and experience—pioneering the inner world.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.9, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Reality is multi-layered and experiential.", "epistemology": "Values introspection, meditation, and altered states.", "praxeology": "Acts through experimentation with consciousness.", "axiology": "Values novelty, insight, and personal evolution.", "mythology": "Inspired by mythic journeys and psychonauts.", "cosmology": "World as a field of infinite mind.", "teleology": "Purpose is to expand awareness." }
  },
  {
    "name": "The Lover",
    "summary": "Embodies connection, passion, and the drive to unite self with others and with life itself.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.7, "praxeology": 0.8, "axiology": 1.0, "mythology": 0.9, "cosmology": 0.8, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Reality as a web of relationships.", "epistemology": "Knows through feeling, empathy, and intimacy.", "praxeology": "Acts through loving, connecting, and merging.", "axiology": "Values love, unity, and acceptance.", "mythology": "Guided by the archetype of the beloved or muse.", "cosmology": "World as a field of attraction and union.", "teleology": "Purpose is union and belonging." }
  },
  {
    "name": "The Outlaw",
    "summary": "Rebels against conventions, breaks boundaries, and seeks to redefine what is possible.",
    "facetScores": { "ontology": 0.5, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.6, "mythology": 0.8, "cosmology": 0.4, "teleology": 0.7 },
    "facetSummaries": { "ontology": "Reality is up for challenge and change.", "epistemology": "Questions all authority and dogma.", "praxeology": "Acts by defying rules and limitations.", "axiology": "Values freedom, rebellion, and authenticity.", "mythology": "Inspired by antiheroes and tricksters.", "cosmology": "World as an open system for disruption.", "teleology": "Purpose is to catalyze revolution." }
  },
  {
    "name": "The Rationalist Skeptic",
    "summary": "Believes reality is material, truth comes from reason and science, and meaning is self-created.",
    "facetScores": { "ontology": 0.1, "epistemology": 0.2, "praxeology": 0.3, "axiology": 0.5, "mythology": 0.3, "cosmology": 0.4, "teleology": 0.2 }
  },
  {
    "name": "The Transcendent Mystic",
    "summary": "Sees all of existence as sacred and interconnected, guided by direct spiritual insight.",
    "facetScores": { "ontology": 0.95, "epistemology": 0.9, "praxeology": 0.8, "axiology": 0.95, "mythology": 0.95, "cosmology": 0.95, "teleology": 1.0 }
  },
  {
    "name": "The Postmodern Pluralist",
    "summary": "Holds reality and truth to be perspectival, with value placed on diversity, story, and context.",
    "facetScores": { "ontology": 0.6, "epistemology": 0.7, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.8, "cosmology": 0.6, "teleology": 0.5 }
  },
  {
    "name": "The Scientific Humanist",
    "summary": "Grounded in rational ethics, scientific method, and belief in human progress.",
    "facetScores": { "ontology": 0.1, "epistemology": 0.2, "praxeology": 0.4, "axiology": 0.6, "mythology": 0.4, "cosmology": 0.5, "teleology": 0.6 }
  },
  {
    "name": "The Archetypal Traditionalist",
    "summary": "Upholds sacred order, divine authority, and moral duty rooted in religious tradition.",
    "facetScores": { "ontology": 0.4, "epistemology": 0.3, "praxeology": 0.5, "axiology": 0.75, "mythology": 0.9, "cosmology": 0.8, "teleology": 0.9 }
  },
  {
    "name": "The Earth-Centered Animist",
    "summary": "Views the world as alive, reciprocal, and sacred; values ecological harmony and ancestral continuity.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.7, "axiology": 0.85, "mythology": 0.85, "cosmology": 0.9, "teleology": 0.85 }
  },
  {
    "name": "The Existential Individualist",
    "summary": "Asserts self-determined meaning, embraces uncertainty, and rejects cosmic absolutes.",
    "facetScores": { "ontology": 0.3, "epistemology": 0.4, "praxeology": 0.6, "axiology": 0.5, "mythology": 0.4, "cosmology": 0.3, "teleology": 0.2 }
  },
  {
    "name": "The Integral Synthesizer",
    "summary": "Integrates science and spirituality, development and depth, autonomy and wholeness.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.7, "praxeology": 0.6, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.85, "teleology": 0.9 }
  },
  {
    "name": "The Stoic Rationalist",
    "summary": "Sees life as ordered by reason and fate, values virtue, and emphasizes inner discipline.",
    "facetScores": { "ontology": 0.4, "epistemology": 0.5, "praxeology": 0.8, "axiology": 0.75, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.7 }
  },
  {
    "name": "The Contemplative Realist",
    "summary": "Grounded in realism but open to mystery, this archetype values awareness, modesty, and interior clarity.",
    "facetScores": { "ontology": 0.5, "epistemology": 0.6, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.5, "cosmology": 0.5, "teleology": 0.6 }
  },
  {
    "name": "The Teacher",
    "summary": "Imparts knowledge, mentors others, and lights the way toward understanding and growth.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.9, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.7, "cosmology": 0.6, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Sees reality as knowable and sharable.", "epistemology": "Values knowledge, clarity, and explanation.", "praxeology": "Acts through teaching and demonstration.", "axiology": "Values wisdom, growth, and empowerment.", "mythology": "Inspired by sages, mentors, and guides.", "cosmology": "World as a classroom of learning.", "teleology": "Purpose is to inspire and uplift others." }
  },
  {
    "name": "The Steward",
    "summary": "Cares for the land, resources, and community—promoting sustainability and harmony.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.9, "axiology": 1.0, "mythology": 0.7, "cosmology": 0.8, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Reality is an interconnected ecosystem.", "epistemology": "Learns from nature and tradition.", "praxeology": "Acts with care, responsibility, and foresight.", "axiology": "Values sustainability, health, and cooperation.", "mythology": "Inspired by caretakers, elders, and guardians.", "cosmology": "World as a garden to be tended.", "teleology": "Purpose is preservation and flourishing." }
  },
  {
    "name": "The Priest/Priestess",
    "summary": "Connects the human and the sacred, leading rituals, holding space, and invoking transformation.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.9, "mythology": 1.0, "cosmology": 0.9, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Reality is suffused with the sacred.", "epistemology": "Trusts in revelation, tradition, and mystical insight.", "praxeology": "Acts through ritual, invocation, and service.", "axiology": "Values sanctity, devotion, and meaning.", "mythology": "Embodying the hierophant, priestess, or ritual leader.", "cosmology": "World as temple and altar.", "teleology": "Purpose is spiritual transformation and service." }
  },
  {
    "name": "The Innocent",
    "summary": "Trusts in goodness, beauty, and possibility—living with openness, wonder, and hope.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.7, "praxeology": 0.7, "axiology": 1.0, "mythology": 0.9, "cosmology": 0.9, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Sees reality as fundamentally good and safe.", "epistemology": "Learns through experience and play.", "praxeology": "Acts with openness and trust.", "axiology": "Values purity, joy, and hope.", "mythology": "Inspired by the child, fool, or holy innocent.", "cosmology": "World as a place of wonder.", "teleology": "Purpose is happiness and peace." }
  },
  {
    "name": "The Sage Fool",
    "summary": "Blends wisdom and playfulness—challenging convention while modeling radical openness.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.8, "praxeology": 0.9, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.6, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Reality is paradoxical and full of surprises.", "epistemology": "Learns from curiosity and questioning.", "praxeology": "Acts with humor, unpredictability, and play.", "axiology": "Values humility, laughter, and insight.", "mythology": "Guided by trickster, clown, and holy fool myths.", "cosmology": "World as a stage for cosmic play.", "teleology": "Purpose is to awaken through paradox." }
  },
  {
    "name": "The Magician",
    "summary": "Works with symbol, will, and intention to shift consciousness and manifest new realities.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.8, "axiology": 0.8, "mythology": 1.0, "cosmology": 0.9, "teleology": 1.0 },
    "facetSummaries": { "ontology": "Sees reality as malleable and interconnected.", "epistemology": "Learns through gnosis, practice, and revelation.", "praxeology": "Acts by ritual, intention, and transformation.", "axiology": "Values mastery, creativity, and alignment.", "mythology": "Inspired by magicians, wizards, and occultists.", "cosmology": "World as a matrix of potential.", "teleology": "Purpose is conscious evolution and realization." }
  },
  {
    "name": "The Pilgrim-Sage",
    "summary": "Journeys with humility and wisdom, gathering insight and sharing it for the benefit of all.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.9, "praxeology": 0.8, "axiology": 0.9, "mythology": 0.8, "cosmology": 0.7, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Sees reality as unfolding through experience.", "epistemology": "Values learning, reflection, and integration.", "praxeology": "Acts through journey, dialogue, and teaching.", "axiology": "Values wisdom, compassion, and openness.", "mythology": "Guided by wandering sages and traveling teachers.", "cosmology": "World as a path and story.", "teleology": "Purpose is wisdom-sharing and service." }
  },
  {
    "name": "The Witness",
    "summary": "Observes reality with equanimity, cultivating presence, clarity, and deep understanding.",
    "facetScores": { "ontology": 0.8, "epistemology": 0.9, "praxeology": 0.8, "axiology": 0.8, "mythology": 0.7, "cosmology": 0.7, "teleology": 0.9 },
    "facetSummaries": { "ontology": "Sees reality as what is—just so.", "epistemology": "Values direct awareness and mindfulness.", "praxeology": "Acts through presence and acceptance.", "axiology": "Values clarity, peace, and understanding.", "mythology": "Inspired by hermits and silent sages.", "cosmology": "World as a field for contemplation.", "teleology": "Purpose is liberation through seeing." }
  },
  {
    "name": "The Diplomat",
    "summary": "Mediates conflict, builds bridges, and seeks harmony among differences.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.6, "cosmology": 0.7, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Reality is complex and interconnected.", "epistemology": "Learns from dialogue and negotiation.", "praxeology": "Acts through mediation and bridge-building.", "axiology": "Values harmony, balance, and respect.", "mythology": "Guided by peacemakers and mediators.", "cosmology": "World as a field of relationship.", "teleology": "Purpose is unity and reconciliation." }
  }
]