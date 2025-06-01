"use client";

import { useWorldview } from "@/hooks/use-worldview";
import TriangleChart from "@/components/visualization/TriangleChart";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES } from "@/config/facets";
import type { FacetName } from "@/types";
import type { DomainScore, CodexEntry } from "@/types";
import React, { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetClass, FACET_INFO } from '@/lib/facet-colors';
import { SPECTRUM_LABELS, getDominantFacet } from '@/lib/colors';
import { Badge } from '@/components/ui/badge';
import { FacetIcon } from "@/components/facet-icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GlassCard, GlassPanel, PrismButton, SpectrumBar } from '@/components/glass-components';
import { SpectrumSlider } from '@/components/spectrum-slider';

// Archetype Data & Helpers (copied from archetypes/page.tsx for now)
const rawArchetypeData: any[] = [
  {
    "title": "The Rational Skeptic",
    "summary": "Grounded in evidence and logic, the Rational Skeptic seeks truth through reasoned inquiry and is wary of metaphysical speculation.",
    "scores": { "ontology": 0.15, "epistemology": 0.05, "praxeology": 0.80, "axiology": 0.30, "mythology": 0.10, "cosmology": 0.20, "teleology": 0.10 },
    "facetDescriptions": { "ontology": "Sees reality as fundamentally material; trusts in what can be measured.", "epistemology": "Strongly favors empirical observation and skepticism over revelation.", "praxeology": "Prefers structured, hierarchical systems and established authority.", "axiology": "Values personal autonomy and achievement over collective or spiritual ideals.", "mythology": "Views history and experience as linear progress.", "cosmology": "Explains the universe in mechanistic, scientific terms.", "teleology": "Sees purpose as self-determined, existential, and grounded in this life." }
  },
  {
    "title": "The Integral Synthesizer",
    "summary": "Bridges and integrates diverse perspectives, holding paradox and complexity as necessary for a whole worldview.",
    "scores": { "ontology": 0.55, "epistemology": 0.50, "praxeology": 0.50, "axiology": 0.55, "mythology": 0.55, "cosmology": 0.55, "teleology": 0.55 },
    "facetDescriptions": { "ontology": "Holds reality as a balance of material and ideal; integrates multiple layers.", "epistemology": "Values both empirical and revelatory sources; open to complexity.", "praxeology": "Balances respect for authority with egalitarian participation.", "axiology": "Blends personal and collective values for a humanistic ethic.", "mythology": "Sees meaning as cyclical and evolving, embracing stories from many sources.", "cosmology": "Perceives the cosmos as both holistic and open to scientific understanding.", "teleology": "Purpose is found in harmonizing self and world, with openness to mystery." }
  },
  {
    "title": "The Transcendent Mystic", // Changed from "The Mystic Pilgrim" to match data if needed
    "summary": "Sees all of existence as sacred and interconnected, guided by direct spiritual insight. Values self-transcendence, unity, and surrender to higher meaning.",
    "scores": { "ontology": 0.90, "epistemology": 0.85, "praxeology": 0.30, "axiology": 0.90, "mythology": 0.90, "cosmology": 0.85, "teleology": 1.0 },
    "facetDescriptions": { "ontology": "Sees reality as fundamentally ideal or spiritual, rooted in unity or consciousness.", "epistemology": "Gains knowledge through revelation, intuition, or mystical insight.", "praxeology": "Prefers non-hierarchical, contemplative, or surrender-based action.", "axiology": "Values selfless love, devotion, and sacred ideals over individual gain.", "mythology": "Finds resonance in cyclical, mythic, and transpersonal stories.", "cosmology": "Views the universe as holistic and interconnected.", "teleology": "Sees life’s highest purpose in the Divine, transcendence, or unity." }
  },
  {
    "title": "The Scientific Humanist", // Changed from "The Humanist"
    "summary": "Grounded in rational ethics, scientific method, and belief in human progress.",
    "scores": { "ontology": 0.20, "epistemology": 0.25, "praxeology": 0.40, "axiology": 0.55, "mythology": 0.25, "cosmology": 0.25, "teleology": 0.15 },
    "facetDescriptions": { "ontology": "Leans materialist, seeing people and relationships as the core of reality.", "epistemology": "Values evidence, critical thinking, and reasoned dialogue.", "praxeology": "Prefers systems that are merit-based but support collective good.", "axiology": "Blends individual dignity with social compassion and justice.", "mythology": "Draws meaning from human stories and cultural narratives.", "cosmology": "Views the universe as understandable and shaped by human inquiry.", "teleology": "Sees meaning as constructed, existential, and rooted in this world." }
  },
   {
    "title": "The Earth-Centered Animist", // Changed from "The Cosmic Animist"
    "summary": "Views the world as alive, reciprocal, and sacred; values ecological harmony and ancestral continuity.",
    "scores": { "ontology": 0.85, "epistemology": 0.60, "praxeology": 0.40, "axiology": 0.65, "mythology": 0.70, "cosmology": 0.90, "teleology": 0.80 },
    "facetDescriptions": { "ontology": "Sees reality as inherently alive, relational, and animated by spirit.", "epistemology": "Balances observation with revelatory ways of knowing (dream, vision).", "praxeology": "Values egalitarian, reciprocal, and collective practices.", "axiology": "Prioritizes interdependence, respect, and stewardship.", "mythology": "Meaning is found in cyclical, living, and place-based stories.", "cosmology": "Views cosmos as holistic and animate.", "teleology": "Purpose is to participate in the living web of existence." }
  },
  {
    "title": "The Archetypal Traditionalist", // Added "The Pragmatic Modernist" as this one.
    "summary": "Upholds sacred order, divine authority, and moral duty rooted in religious tradition.",
    "scores": { "ontology": 0.4, "epistemology": 0.3, "praxeology": 0.5, "axiology": 0.75, "mythology": 0.9, "cosmology": 0.8, "teleology": 0.9 },
    "facetDescriptions": { "ontology": "Reality is ordered by tradition and divine principles.", "epistemology": "Knowledge comes from sacred texts and lineage.", "praxeology": "Action is guided by established duties and rituals.", "axiology": "Values heritage, obedience, and communal harmony.", "mythology": "Upholds foundational myths and religious narratives.", "cosmology": "Universe is seen as divinely structured and meaningful.", "teleology": "Purpose is to live according to divine law and tradition." }
  },
  {
    "title": "The Existential Individualist", // Changed from "The Existential Explorer"
    "summary": "Asserts self-determined meaning, embraces uncertainty, and rejects cosmic absolutes.",
    "scores": { "ontology": 0.40, "epistemology": 0.40, "praxeology": 0.45, "axiology": 0.35, "mythology": 0.40, "cosmology": 0.35, "teleology": 0.05 },
    "facetDescriptions": { "ontology": "Balances between material and ideal, questioning fixed reality.", "epistemology": "Explores both empirical and revelatory ways of knowing.", "praxeology": "Resists rigid hierarchy; favors flexible, individual action.", "axiology": "Values personal meaning and creative expression.", "mythology": "Draws from diverse stories, often in cyclical or disrupted form.", "cosmology": "Views cosmos as open, uncertain, and in flux.", "teleology": "Sees purpose as existential, chosen, and ambiguous." }
  },
  {
    "title": "The Stoic Rationalist", // Changed from "The Ethical Altruist"
    "summary": "Sees life as ordered by reason and fate, values virtue, and emphasizes inner discipline.",
    "scores": { "ontology": 0.4, "epistemology": 0.5, "praxeology": 0.8, "axiology": 0.75, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.7 },
    "facetDescriptions": { "ontology": "Materialist or dualist; reason is part of nature.", "epistemology": "Reasoned reflection; self-examination.", "praxeology": "Virtuous action, self-control, resilience.", "axiology": "Values wisdom, virtue, equanimity.", "mythology": "Draws from Greco-Roman myths for exemplars.", "cosmology": "Universe as rational, ordered whole.", "teleology": "Purpose is to live in harmony with nature and reason." }
  },
  {
    "title": "The Visionary Idealist",
    "summary": "Imagines higher possibilities, pursuing beauty, truth, and the Good as guiding ideals for self and society.",
    "scores": { "ontology": 0.80, "epistemology": 0.75, "praxeology": 0.60, "axiology": 0.80, "mythology": 0.80, "cosmology": 0.75, "teleology": 0.85 },
    "facetDescriptions": { "ontology": "Sees reality as rooted in ideals, archetypes, and higher patterns.", "epistemology": "Trusts intuition, vision, and philosophical reflection.", "praxeology": "Balances individual striving with service to the whole.", "axiology": "Prioritizes beauty, truth, and transcendent values.", "mythology": "Finds meaning in mythic cycles and symbolic stories.", "cosmology": "Cosmos is holistic, harmonious, and purposeful.", "teleology": "Purpose is to realize the Good and contribute to higher meaning." }
  },
  {
    "title": "The Contemplative Realist", // Changed from "The Relational Steward"
    "summary": "Grounded in realism but open to mystery, this archetype values awareness, modesty, and interior clarity.",
    "scores": { "ontology": 0.5, "epistemology": 0.6, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.5, "cosmology": 0.5, "teleology": 0.6 },
    "facetDescriptions": { "ontology": "Reality is what is, but also includes subjective depth.", "epistemology": "Balances empirical observation with introspective awareness.", "praxeology": "Acts mindfully and with consideration for nuance.", "axiology": "Values clarity, peace, and authentic understanding.", "mythology": "Interprets myths for psychological or spiritual insight.", "cosmology": "Universe is real, and our perception of it matters.", "teleology": "Purpose is found in awareness and living authentically." }
  }
];

const mapRawArchetypeToCodexEntry = (raw: any): CodexEntry | null => {
  try {
    if (!raw || typeof raw !== 'object' || (typeof raw.title !== 'string' && typeof raw.name !== 'string')) {
      console.warn("mapRawArchetypeToCodexEntry: Skipping invalid raw data item", raw);
      return null;
    }

    const titleToUse = raw.title || raw.name;
    const id = titleToUse.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');

    let domainScoresArray: DomainScore[] = [];
    const scoresSource = raw.scores || raw.facetScores;    if (scoresSource && typeof scoresSource === 'object') {
      if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
        domainScoresArray = Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(facetKey => {
          const scoreKeyLower = facetKey.toLowerCase() as keyof typeof scoresSource;
          const scoreKeyOriginal = facetKey as keyof typeof scoresSource;
          let scoreValue = 0.5;
          if (scoresSource.hasOwnProperty(scoreKeyLower) && typeof scoresSource[scoreKeyLower] === 'number') {
            scoreValue = scoresSource[scoreKeyLower];
          } else if (scoresSource.hasOwnProperty(scoreKeyOriginal) && typeof scoresSource[scoreKeyOriginal] === 'number') {
            scoreValue = scoresSource[scoreKeyOriginal];
          }
          return { facetName: facetKey, score: Math.max(0, Math.min(1, Number(scoreValue))) };
        }) : [];
      } else {
        domainScoresArray = [];
      }
    } else {
      // console.warn(`Scores missing or invalid for archetype: ${titleToUse}. Defaulting all to 0.5.`);
      if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
        domainScoresArray = Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(name => ({ facetName: name, score: 0.5 })) : [];
      } else {
        domainScoresArray = [];
      }
    }

    const facetSummariesSource = raw.facetDescriptions || raw.facetSummaries;
    const processedFacetSummaries: { [K_FacetName in FacetName]?: string } = {};

    if (facetSummariesSource && typeof facetSummariesSource === 'object') {
      if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
        for (const facetKey of FACET_NAMES) {
          const summaryKeyLower = facetKey.toLowerCase() as keyof typeof facetSummariesSource;
          const summaryKeyOriginal = facetKey as keyof typeof facetSummariesSource;
          let summary = `Details for ${facetKey} not available for ${titleToUse}.`;

          if (facetSummariesSource.hasOwnProperty(summaryKeyLower) && typeof facetSummariesSource[summaryKeyLower] === 'string') {
            summary = facetSummariesSource[summaryKeyLower];
          } else if (facetSummariesSource.hasOwnProperty(summaryKeyOriginal) && typeof facetSummariesSource[summaryKeyOriginal] === 'string') {
            summary = facetSummariesSource[summaryKeyOriginal];
          }
          processedFacetSummaries[facetKey] = summary;
        }
      }
    } else {
      if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
        FACET_NAMES.forEach(name => {
          processedFacetSummaries[name] = `Details for ${name} not available for ${titleToUse}.`;
        });
      }
    }

    return {
      id,
      title: titleToUse,
      summary: raw.summary || "No summary available.",
      domainScores: domainScoresArray,
      facetSummaries: processedFacetSummaries,
      category: "archetypal",
      isArchetype: true,
      createdAt: raw.createdAt || new Date().toISOString(),
      tags: raw.tags || [id],
    };
  } catch (error) {
    console.error("Error in mapRawArchetypeToCodexEntry for item:", raw, error);
    return null;
  }
};

const calculateSimilarity = (userScores: DomainScore[], archetypeScores: DomainScore[]): number => {
  if (!Array.isArray(FACET_NAMES) || FACET_NAMES.length === 0 ||
      !Array.isArray(userScores) || userScores.length !== FACET_NAMES.length || 
      !Array.isArray(archetypeScores) || archetypeScores.length !== FACET_NAMES.length) {
    return 0;
  }
  
  try {
    const userMap = new Map(userScores.map(s => [s.facetName, s.score]));
    const archetypeMap = new Map(archetypeScores.map(s => [s.facetName, s.score]));
    let dotProduct = 0;
    let userMagnitude = 0;
    let archetypeMagnitude = 0;
    for (const facetName of FACET_NAMES) {
      const userScore = userMap.get(facetName) || 0;
      const archetypeScore = archetypeMap.get(facetName) || 0;
      dotProduct += userScore * archetypeScore;
      userMagnitude += userScore * userScore;
      archetypeMagnitude += archetypeScore * archetypeScore;
    }
    userMagnitude = Math.sqrt(userMagnitude);
    archetypeMagnitude = Math.sqrt(archetypeMagnitude);
    if (userMagnitude === 0 || archetypeMagnitude === 0) return 0;
    const similarity = (dotProduct / (userMagnitude * archetypeMagnitude)) * 100;
    return Math.max(0, Math.min(100, similarity));
  } catch (error) {
    console.error("Error in calculateSimilarity:", error);
    return 0;
  }
};

// Helper for qualitative score description based on 3 anchors
const getQualitativeScoreDescription = (score: number | undefined, facetName: FacetName | undefined): string => {
  if (score === undefined || !facetName || !FACETS[facetName]) return "Perspective noted.";
  const facetConfig = FACETS[facetName];
  const anchors = facetConfig.deepDive?.spectrumAnchors || [];

  if (anchors.length === 3) {
    if (score < 0.34) return `Primarily aligns with: ${anchors[0]}`;
    if (score <= 0.66) return `Suggests a perspective of: ${anchors[1]}`;
    return `Primarily aligns with: ${anchors[2]}`;
  } else if (anchors.length === 2) {
    return score < 0.5 ? `Aligns more with: ${anchors[0]}` : `Aligns more with: ${anchors[1]}`;
  } else if (anchors.length === 1) {
      return `Aligns with: ${anchors[0]}`;
  }
  // Fallback if anchors aren't 1, 2, or 3
  if (score < 0.34) return "Leans towards the lower end of the spectrum.";
  if (score <= 0.66) return "Suggests a balanced or mid-spectrum perspective.";
  return "Leans towards the higher end of the spectrum.";
};

const getDetailedInterpretation = (score: number | undefined, facetName: FacetName | undefined): string => {
    if (score === undefined || !facetName || !FACETS[facetName] || !FACETS[facetName].deepDive?.whatIfInterpretations) {
    return "Detailed interpretation will appear here based on your score.";
  }
  const interpretations = FACETS[facetName].deepDive.whatIfInterpretations;
  if (!interpretations) return "Interpretation data missing for this facet.";
  if (score < 0.34) return interpretations.low;
  if (score <= 0.66) return interpretations.mid;
  return interpretations.high;
};

export default function DashboardPage() {
  const {
    currentUser,
    openAuthModal,
    userDomainScores,
    hasAssessmentBeenRun,
  } = useWorldview();

  const [selectedArchetypeForDrawer, setSelectedArchetypeForDrawer] = useState<CodexEntry | null>(null);
  const [isArchetypeDrawerOpen, setIsArchetypeDrawerOpen] = useState(false);
  const [selectedFacetForInsight, setSelectedFacetForInsight] = useState<FacetName | null>(null);
  const [isInsightPanelOpen, setIsInsightPanelOpen] = useState(false);

  const mappedArchetypes: CodexEntry[] = useMemo(() => {
    try {
      if (!Array.isArray(rawArchetypeData)) {
        // console.error("rawArchetypeData is not an array:", rawArchetypeData);
        return [];
      }
      return rawArchetypeData
        .map(item => mapRawArchetypeToCodexEntry(item))
        .filter(item => item !== null) as CodexEntry[];
    } catch (error) {
      console.error("Error mapping rawArchetypeData:", error);
      return [];
    }
  }, []);

  const defaultNeutralScores: DomainScore[] = useMemo(() => {
    return Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(name => ({ facetName: name, score: 0.5 })) : [];
  }, []);

  const scoresForMainTriangle = useMemo(() => {
    return hasAssessmentBeenRun && userDomainScores && userDomainScores.length > 0 ? userDomainScores : defaultNeutralScores;
  }, [userDomainScores, hasAssessmentBeenRun, defaultNeutralScores]);

  const topThreeMatches = useMemo(() => {
    if (!hasAssessmentBeenRun || !userDomainScores || userDomainScores.length === 0 || !Array.isArray(mappedArchetypes) || mappedArchetypes.length === 0) {
      return [];
    }
    try {
      return mappedArchetypes
        .filter(archetype => archetype && archetype.domainScores && Array.isArray(archetype.domainScores))
        .map(archetype => {
          return {
            ...archetype,
            similarity: calculateSimilarity(userDomainScores, archetype.domainScores || []),
          };
        })
        .filter(archetype => archetype !== null)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);
    } catch (error) {
      console.error("Error calculating topThreeMatches:", error);
      return [];
    }
  }, [userDomainScores, mappedArchetypes, hasAssessmentBeenRun]);

  const handleOpenArchetypeDrawer = (archetype: CodexEntry) => {
    setSelectedArchetypeForDrawer(archetype);
    setIsArchetypeDrawerOpen(true);
  };

  const handleTriangleLayerClick = (facetName: FacetName) => {
    if (!hasAssessmentBeenRun) return;
    setSelectedFacetForInsight(facetName);
    setIsInsightPanelOpen(true);
  };

  const currentSelectedFacetData = selectedFacetForInsight ? FACETS[selectedFacetForInsight] : null;
  const currentUserScoreForSelectedFacet = selectedFacetForInsight && userDomainScores?.find(ds => ds.facetName === selectedFacetForInsight)?.score;

  const renderDomainFeedbackBars = () => {
    const scoresToDisplay = hasAssessmentBeenRun && userDomainScores && userDomainScores.length > 0 ? userDomainScores : defaultNeutralScores;

    return Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(facetName => {
      const scoreObj = scoresToDisplay.find(ds => ds.facetName === facetName);
      const score = scoreObj ? scoreObj.score : 0.5; // Default to 0.5 if not found (e.g. for neutral state)
      const facetConfig = FACETS[facetName];
      if (!facetConfig) {
        return (
          <div key={facetName} className="mb-4 p-3 rounded-md border border-destructive/50 bg-destructive/10">
            <p className="text-destructive text-sm">Configuration error for facet: {facetName}</p>
          </div>
        );
      }
      
      const labels = SPECTRUM_LABELS[facetName];
      const anchorLeftText = labels.left;
      const anchorRightText = labels.right;
      
      return (
        <DomainFeedbackBar
          key={facetName}
          facetName={facetName}
          score={score}
          anchorLeft={anchorLeftText}
          anchorRight={anchorRightText}
        />
      );
    }) : [];
  };

  const aboutContent = [
    {
      title: "What Does It Measure?",
      icon: Icons.sliders,
      accentFacet: "Teleology" as FacetName,
      text: "The assessment helps uncover the symbolic architecture behind your worldview—how you interpret reality, knowledge, ethics, values, and meaning across seven key dimensions."
    },
    {
      title: "A Seven-Facet Model of Reality",
      icon: Icons.logo,
      accentFacet: "Mythology" as FacetName,
      text: "Each facet—Ontology, Epistemology, Praxeology, Axiology, Mythology, Cosmology, and Teleology—represents a domain of meaning-making. Together they form your personal prism of perception."
    },
    {
      title: "Why It Matters",
      icon: Icons.info,
      accentFacet: "Axiology" as FacetName,
      text: "Our assumptions are often unconscious—but they shape how we think, feel, and act. Mapping them makes it possible to reflect, realign, or intentionally redesign how you relate to the world."
    },
    {
      title: "Your Symbolic Signature",
      icon: Icons.facet,
      accentFacet: "Praxeology" as FacetName,
      text: "When you finish, your answers form a seven-layered triangle—a symbolic signature that visualizes your worldview across the spectrum of each domain."
    }
  ];

  return (
    <TooltipProvider>
    <div className="container mx-auto py-12 space-y-12">
      <GlassCard className="text-center" animated>
        {currentUser ? (
          <>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {currentUser.displayName || "User"}!</h1>
            <p className="text-muted-foreground mt-1">This is your Meta-Prism dashboard.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-foreground">Welcome to Meta-Prism!</h1>
            <p className="text-muted-foreground mt-1">Sign in or take the assessment to explore your worldview.</p>
            <PrismButton onClick={openAuthModal} className="mt-4">
              <Icons.user className="mr-2 h-4 w-4" /> Sign In
            </PrismButton>
          </>
        )}
      </GlassCard>

      <GlassCard variant="large" animated>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Your Worldview Signature</h2>
          <SpectrumBar className="mt-2 mx-auto w-32" />
          {!hasAssessmentBeenRun && <p className="text-muted-foreground mt-3">Complete the assessment to reveal your unique pattern.</p>}
        </div>
        <div className="flex justify-center items-center min-h-[280px]">
          <TriangleChart
            scores={scoresForMainTriangle}
            worldviewName="User Assessment"
            interactive={hasAssessmentBeenRun}
            onLayerClick={handleTriangleLayerClick}
            width={320}
            height={277}
          />
        </div>
        {!hasAssessmentBeenRun && (
          <div className="flex flex-col items-center gap-3 pt-6 border-t border-white/10 mt-6">
            <p className="text-sm text-muted-foreground text-center">Your results will appear here once you complete the assessment.</p>
            <PrismButton asChild>
              <Link href="/assessment">
                <Icons.assessment className="mr-2 h-4 w-4" />
                Begin Assessment
              </Link>
            </PrismButton>
          </div>
        )}
      </GlassCard>        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <GlassCard className="lg:col-span-2" animated>
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-foreground">Facet Breakdown</h3>
            <p className="text-muted-foreground text-sm mt-2">
              {hasAssessmentBeenRun
                ? "Your scores across the 7 worldview dimensions, with labels indicating primary alignment."
                : "Showing neutral baseline scores. Complete an assessment to see your breakdown."
              }
            </p>
          </div>
          {renderDomainFeedbackBars()}
        </GlassCard>

        <GlassCard animated>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground">Quick Insights</h3>
            <p className="text-muted-foreground text-xs">Reflections on your dominant facet alignment.</p>
          </div>
          <div>
            {hasAssessmentBeenRun && userDomainScores && userDomainScores.length > 0 ? (
              (() => {
                const dominantFacetName = getDominantFacet(userDomainScores);
                const dominantScoreObj = userDomainScores.find(s => s.facetName === dominantFacetName);
                const dominantScore = dominantScoreObj ? dominantScoreObj.score : undefined;

                if (dominantScore === undefined || !dominantFacetName) {
                   return <p className="text-muted-foreground text-sm">Could not determine dominant facet score.</p>;
                }
                const facetConfig = FACETS[dominantFacetName];
                const qualitativeDesc = getQualitativeScoreDescription(dominantScore, dominantFacetName);

                return (
                  <p className="text-muted-foreground text-sm">
                    Your dominant facet appears to be <span className={`font-semibold ${getFacetClass('text', dominantFacetName.toLowerCase() as any, '700')}`}>{dominantFacetName}</span>.
                    {` Your alignment (${Math.round(dominantScore*100)}%) ${qualitativeDesc.toLowerCase()}.`}
                     {facetConfig?.deepDive?.whatIfInterpretations ? (
                      <>
                        {" " + (dominantScore < 0.34 ? facetConfig.deepDive.whatIfInterpretations.low.split('.')[0] + '.' : 
                              dominantScore <= 0.66 ? facetConfig.deepDive.whatIfInterpretations.mid.split('.')[0] + '.' : 
                              facetConfig.deepDive.whatIfInterpretations.high.split('.')[0] + '.')}
                      </>
                    ) : " Consider exploring the implications of this emphasis."}
                  </p>
                );
              })()
            ) : (
              <p className="text-muted-foreground text-sm">Complete the assessment to unlock insights about your worldview.</p>
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard variant="large" animated>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Closest Archetype Matches</h2>
          <SpectrumBar className="mt-2 mx-auto w-32" />
        </div>
        <div>
          {!hasAssessmentBeenRun ? (
            <div className="text-center py-8">
              <TriangleChart scores={defaultNeutralScores} worldviewName="Default" width={200} height={173} interactive={false} />
              <p className="mt-4 text-muted-foreground">Take the Assessment to Discover Your Archetypal Matches.</p>
              <PrismButton asChild className="mt-4">
                <Link href="/assessment">
                  <Icons.assessment className="mr-2 h-4 w-4" />
                  Begin Assessment
                </Link>
              </PrismButton>
            </div>
          ) : topThreeMatches.length > 0 ? (
            <div className="space-y-6">
              {topThreeMatches[0] && topThreeMatches[0].domainScores && (
                <GlassCard className="border-primary/30 shadow-spectrum">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-semibold ${getFacetClass('text', getDominantFacet(topThreeMatches[0].domainScores).toLowerCase() as any, '700')}`}>
                        Top Match: {topThreeMatches[0].title}
                      </h3>
                      <p className="text-muted-foreground text-sm">Similarity: {Math.round(topThreeMatches[0].similarity)}%</p>
                    </div>
                    <PrismButton size="small" variant="secondary" onClick={() => handleOpenArchetypeDrawer(topThreeMatches[0])}>Details</PrismButton>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-1 flex justify-center">
                      <TriangleChart scores={topThreeMatches[0].domainScores} worldviewName={topThreeMatches[0].title} width={180} height={156} />
                    </div>
                    <p className="md:col-span-2 text-sm text-muted-foreground line-clamp-4">{topThreeMatches[0].summary}</p>
                  </div>
                </GlassCard>
              )}
              {(topThreeMatches[1] || topThreeMatches[2]) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  {topThreeMatches.slice(1).map((match) => match && match.domainScores && (
                    <GlassCard key={match.id} className="bg-card/40">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className={`text-lg font-semibold ${getFacetClass('text', getDominantFacet(match.domainScores).toLowerCase() as any, '700')}`}>
                          {match.title}
                        </h4>
                        <Badge variant="secondary">{Math.round(match.similarity)}% Similar</Badge>
                      </div>
                      <div className="flex flex-col items-center">
                        <TriangleChart scores={match.domainScores} worldviewName={match.title} width={150} height={130} className="mb-4" />
                        <PrismButton size="small" variant="ghost" className="w-full mt-2" onClick={() => handleOpenArchetypeDrawer(match)}>View Details</PrismButton>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
               <div className="text-center mt-8 max-w-xs mx-auto">
                <PrismButton asChild variant="secondary" className="relative">
                  <Link href="/archetypes" className="inline-flex items-center justify-center">
                    Explore All Archetypes
                    <Icons.chevronRight className="ml-1 h-4 w-4"/>
                  </Link>
                </PrismButton>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Could not determine archetype matches. Ensure assessment is complete.</p>
          )}
        </div>
      </GlassCard>

      {selectedArchetypeForDrawer && (
        <Sheet open={isArchetypeDrawerOpen} onOpenChange={setIsArchetypeDrawerOpen}>
          <SheetContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl" side="right">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SheetHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <SheetTitle className={`text-3xl mb-1 ${getFacetClass('text', getDominantFacet(selectedArchetypeForDrawer.domainScores).toLowerCase() as any, '700')}`}>
                        {selectedArchetypeForDrawer.title}
                      </SheetTitle>
                      <SheetDescription className="text-base capitalize">{selectedArchetypeForDrawer.category} Profile</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                <p className="mb-6 text-muted-foreground leading-relaxed">{selectedArchetypeForDrawer.summary}</p>
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border/30 pb-2">Facet Breakdown</h3>
                  {Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(facetName => {
                    if (!selectedArchetypeForDrawer.domainScores) return null;
                    const scoreObj = selectedArchetypeForDrawer.domainScores.find(ds => ds.facetName === facetName);
                    const score = scoreObj ? scoreObj.score : 0;
                    const facetConfig = FACETS[facetName];
                    let facetSummary = `Insights into how ${selectedArchetypeForDrawer.title} relates to ${facetName.toLowerCase()}...`;
                    if (selectedArchetypeForDrawer.facetSummaries && selectedArchetypeForDrawer.facetSummaries[facetName]) {
                        facetSummary = selectedArchetypeForDrawer.facetSummaries[facetName]!;
                    }
                    const spectrumPoleLabels = SPECTRUM_LABELS[facetName] || { left: 'Low', right: 'High' };

                    return (
                      <div key={facetName} className="p-4 rounded-md border border-border/30 bg-background/40 space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className={`text-lg font-semibold ${getFacetClass('text', facetName.toLowerCase() as any, '700')}`}>
                            {facetName}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground italic mb-1">{facetConfig?.tagline || "..."}</p>
                        <p className="text-sm text-muted-foreground">{facetSummary}</p>
                        <div className="relative mt-2">
                          <SpectrumBar
                            facet={facetName.toLowerCase() as any}
                            className="h-3 rounded-lg"
                            animated={false}
                          />
                          {/* Score indicator */}
                          <div
                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
                            style={{
                              left: `${score * 100}%`,
                            }}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full border-2 border-background shadow-lg",
                              "bg-white dark:bg-gray-900",
                              getFacetClass('border', facetName.toLowerCase() as any, '600')
                            )} />
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{spectrumPoleLabels.left}</span>
                          <span className={`font-semibold ${getFacetClass('text', facetName.toLowerCase() as any, '700')}`}>
                            {Math.round(score * 100)}%
                          </span>
                          <span>{spectrumPoleLabels.right}</span>
                        </div>
                      </div>
                    );
                  }) : null}
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}

      {currentSelectedFacetData && (
        <Sheet open={isInsightPanelOpen} onOpenChange={setIsInsightPanelOpen}>
          <SheetContent className="w-full max-w-md sm:max-w-lg md:max-w-xl p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl" side="right">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SheetHeader className="mb-8">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <FacetIcon facetName={currentSelectedFacetData.name} className="h-10 w-10" />
                      <div>
                        <SheetTitle className={`text-3xl mb-0 ${getFacetClass('text', currentSelectedFacetData.name.toLowerCase() as any, '700')}`}>
                          {currentSelectedFacetData.name}
                        </SheetTitle>
                        <SheetDescription className="text-sm -mt-1">{currentSelectedFacetData.tagline}</SheetDescription>
                      </div>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-8">
                  <GlassCard>
                    <h3 className="text-lg font-semibold mb-2">Your Score</h3>
                    <p className={`text-2xl font-bold ${getFacetClass('text', currentSelectedFacetData.name.toLowerCase() as any, '700')}`}>
                      {currentUserScoreForSelectedFacet !== undefined && currentUserScoreForSelectedFacet !== null ? `${Math.round(currentUserScoreForSelectedFacet * 100)}%` : "N/A"}
                    </p>
                    {currentUserScoreForSelectedFacet !== undefined && currentUserScoreForSelectedFacet !== null && (
                      <p className="text-xs text-muted-foreground">
                        {getQualitativeScoreDescription(currentUserScoreForSelectedFacet, currentSelectedFacetData.name)}
                      </p>
                    )}
                  </GlassCard>

                  <GlassCard>
                    <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {currentUserScoreForSelectedFacet !== undefined && currentUserScoreForSelectedFacet !== null 
                        ? getDetailedInterpretation(currentUserScoreForSelectedFacet, currentSelectedFacetData.name)
                        : "Complete the assessment to see your detailed interpretation."}
                    </p>
                  </GlassCard>

                  {currentSelectedFacetData.deepDive?.strengthsPlaceholder && (
                    <GlassCard>
                      <h3 className="text-lg font-semibold mb-2">Potential Strengths</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentSelectedFacetData.deepDive.strengthsPlaceholder}
                      </p>
                    </GlassCard>
                  )}

                  {(currentSelectedFacetData.deepDive?.tensionsPlaceholder || currentSelectedFacetData.deepDive?.blindSpotsPlaceholder) && (
                    <GlassCard>
                      <h3 className="text-lg font-semibold mb-2">Possible Tensions / Blind Spots</h3>
                      {currentSelectedFacetData.deepDive.tensionsPlaceholder && <p className="text-sm text-muted-foreground">{currentSelectedFacetData.deepDive.tensionsPlaceholder}</p>}
                      {currentSelectedFacetData.deepDive.blindSpotsPlaceholder && <p className="text-sm text-muted-foreground mt-2">{currentSelectedFacetData.deepDive.blindSpotsPlaceholder}</p>}
                    </GlassCard>
                  )}

                  {currentSelectedFacetData.deepDive?.reflectionPrompts && currentSelectedFacetData.deepDive.reflectionPrompts.length > 0 && (
                    <GlassCard>
                      <h3 className="text-lg font-semibold mb-2">Reflection Prompts</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {currentSelectedFacetData.deepDive.reflectionPrompts.map((prompt, idx) => (
                          <li key={idx}>{prompt}</li>
                        ))}
                      </ul>
                    </GlassCard>
                  )}

                  <PrismButton variant="secondary" asChild className="w-full">
                    <Link href={`/facet/${currentSelectedFacetData.name.toLowerCase()}`}>
                      Deep Dive into {currentSelectedFacetData.name}
                      <Icons.chevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </PrismButton>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
      <section className="glassmorphic-card p-6 md:p-8 mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center text-foreground roygbiv-gradient-underline pb-2">About the Meta-Prism Worldview Assessment Tool</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aboutContent.map((item, index) => {
            const facetKey = item.accentFacet.toLowerCase() as any;
            return (
              <div 
                key={index} 
                className={cn(
                  "flex flex-col p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out bg-card/50 hover:bg-card/70 border",
                  getFacetClass('border', facetKey, '400')
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <item.icon className={cn("h-7 w-7", getFacetClass('text', facetKey, '600'))} />
                  <strong className={cn("text-lg font-semibold", getFacetClass('text', facetKey, '700'))}>{item.title}</strong>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>
      <footer className="mt-16 pt-8 border-t border-border/30 text-center">
        <Link href="/about" className="text-sm text-primary hover:underline">
          Learn More About the Meta-Prism Model
        </Link>
      </footer>
    </div>
    </TooltipProvider>
  );
}

/**
 * Generate spectrum gradient using restored ROYGBIV Meta-Prism colors
 * Restored from original 5/19/2025 stable version
 */
const generateSpectrumGradient = (facet: FacetName): string => {
  // Facet-specific gradients using restored original ROYGBIV colors
  const facetGradients: Record<string, string> = {
    ontology: 'linear-gradient(to right, #f3f4f6, #8e6bf7)',     // Light gray to violet
    epistemology: 'linear-gradient(to right, #f3f4f6, #0082ff)', // Light gray to indigo
    praxeology: 'linear-gradient(to right, #f3f4f6, #00b8ff)',   // Light gray to blue
    axiology: 'linear-gradient(to right, #f3f4f6, #2df36c)',     // Light gray to green
    mythology: 'linear-gradient(to right, #f3f4f6, #f1e800)',    // Light gray to yellow
    cosmology: 'linear-gradient(to right, #f3f4f6, #ff9315)',    // Light gray to orange
    teleology: 'linear-gradient(to right, #f3f4f6, #ff0045)',    // Light gray to red
  };
  
  return facetGradients[facet.toLowerCase()] || facetGradients.ontology;
};

function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: FacetName, score: number, anchorLeft: string, anchorRight: string }) {
  const facetConfig = FACETS[facetName];
  if (!facetConfig) {
    return (
      <div className="mb-4 p-3 rounded-md border border-destructive/50 bg-destructive/10">
        <p className="text-destructive text-sm">Configuration error for facet: {facetName}</p>
      </div>
    );
  }
  const spectrumPoleLabels = SPECTRUM_LABELS[facetName] || { left: 'Low', right: 'High' };
  const facetKey = facetName.toLowerCase() as any;

  return (
    <div className="mb-8 p-4 rounded-md border border-border/30 bg-background/40 w-full">
      <div className="flex justify-between items-center mb-2">
        <span className={cn("text-sm font-medium", getFacetClass('text', facetKey, '700'))}>{facetConfig.name}</span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="w-full h-10 p-1 rounded-xl bg-slate-800/40 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl border border-slate-700/50 dark:border-slate-600/50 relative mt-2 group overflow-hidden flex items-center cursor-pointer"
            aria-label={`${facetName} spectrum: ${spectrumPoleLabels.left} to ${spectrumPoleLabels.right}. Score: ${Math.round(score * 100)}%`}
          >
            {/* Full-width spectrum background */}
            <div
              className="h-full w-full rounded-lg absolute inset-0 m-1"
              style={{
                background: generateSpectrumGradient(facetName),
                opacity: 0.9,
              }}
            />
            
            {/* Score indicator */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-transform duration-300 ease-in-out group-hover:scale-125 z-10"
              style={{
                left: `${score * 100}%`,
              }}
            >
              <div className="px-2 py-0.5 text-[10px] font-semibold bg-slate-900/90 dark:bg-black/80 backdrop-blur-md text-white rounded-full shadow-xl border border-white/30 dark:border-slate-400/40 whitespace-nowrap">
                {Math.round(score * 100)}%
              </div>
              <svg width="14" height="10" viewBox="0 0 14 10" className="fill-slate-900/90 dark:fill-black/80 drop-shadow-md mx-auto mt-px" style={{ transform: 'translateY(-2px)'}}>
                <path d="M7 0L0 10H14L7 0Z" />
              </svg>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg text-xs">
          <p>{spectrumPoleLabels.left} <span className="font-bold mx-1">← {Math.round(score * 100)}% →</span> {spectrumPoleLabels.right}</p>
          <p className="text-xs text-muted-foreground/80">Facet: {FACET_INFO[facetKey as keyof typeof FACET_INFO]?.name || facetName}</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span className="font-semibold">{anchorLeft}</span>
        <span className="font-semibold">{anchorRight}</span>
      </div>
    </div>
  );
}

