
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES, type FacetName } from "@/config/facets";
import type { DomainScore, CodexEntry } from "@/types";
import React, { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetColorHsl, DOMAIN_COLORS, SPECTRUM_LABELS, getDominantFacet, DOMAIN_SCALES, getFacetScoreColor } from '@/lib/colors';
import { Badge } from '@/components/ui/badge';
import { FacetIcon } from "@/components/facet-icon";
import chroma from 'chroma-js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
    const scoresSource = raw.scores || raw.facetScores;

    if (scoresSource && typeof scoresSource === 'object') {
      domainScoresArray = FACET_NAMES.map(facetKey => {
        const scoreKeyLower = facetKey.toLowerCase() as keyof typeof scoresSource;
        const scoreKeyOriginal = facetKey as keyof typeof scoresSource;
        let scoreValue = 0.5;

        if (scoresSource.hasOwnProperty(scoreKeyLower) && typeof scoresSource[scoreKeyLower] === 'number') {
          scoreValue = scoresSource[scoreKeyLower];
        } else if (scoresSource.hasOwnProperty(scoreKeyOriginal) && typeof scoresSource[scoreKeyOriginal] === 'number') {
          scoreValue = scoresSource[scoreKeyOriginal];
        }
        return { facetName: facetKey, score: Math.max(0, Math.min(1, Number(scoreValue))) };
      });
    } else {
      // console.warn(`Scores missing or invalid for archetype: ${titleToUse}. Defaulting all to 0.5.`);
      domainScoresArray = FACET_NAMES.map(name => ({ facetName: name, score: 0.5 }));
    }

    const facetSummariesSource = raw.facetDescriptions || raw.facetSummaries;
    const processedFacetSummaries: { [K_FacetName in FacetName]?: string } = {};

    if (facetSummariesSource && typeof facetSummariesSource === 'object') {
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
    } else {
      FACET_NAMES.forEach(name => {
          processedFacetSummaries[name] = `Details for ${name} not available for ${titleToUse}.`;
      });
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
  if (!userScores || userScores.length !== FACET_NAMES.length || !archetypeScores || archetypeScores.length !== FACET_NAMES.length) {
    return 0;
  }
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

  const defaultNeutralScores: DomainScore[] = useMemo(() => FACET_NAMES.map(name => ({ facetName: name, score: 0.5 })), []);

  const scoresForMainTriangle = useMemo(() => {
    return hasAssessmentBeenRun && userDomainScores && userDomainScores.length > 0 ? userDomainScores : defaultNeutralScores;
  }, [userDomainScores, hasAssessmentBeenRun, defaultNeutralScores]);

  const topThreeMatches = useMemo(() => {
    if (!hasAssessmentBeenRun || !userDomainScores || userDomainScores.length === 0 || !Array.isArray(mappedArchetypes) || mappedArchetypes.length === 0) {
      return [];
    }
    try {
      return mappedArchetypes
        .map(archetype => {
          if (!archetype || !archetype.domainScores) {
            return { ...archetype, similarity: 0 };
          }
          return {
            ...archetype,
            similarity: calculateSimilarity(userDomainScores, archetype.domainScores),
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

    return FACET_NAMES.map(facetName => {
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
    });
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
    <div className="container mx-auto py-8 space-y-12">
      <Card className="glassmorphic-card text-center p-6">
        {currentUser ? (
          <>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {currentUser.displayName || "User"}!</h1>
            <p className="text-muted-foreground mt-1">This is your Meta-Prism dashboard.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-foreground">Welcome to Meta-Prism!</h1>
            <p className="text-muted-foreground mt-1">Sign in or take the assessment to explore your worldview.</p>
            <Button onClick={openAuthModal} className="mt-4">
              <Icons.user className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </>
        )}
      </Card>

      <Card className="glassmorphic-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary roygbiv-gradient-underline pb-2">Your Worldview Signature</CardTitle>
          {!hasAssessmentBeenRun && <CardDescription>Complete the assessment to reveal your unique pattern.</CardDescription>}
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[280px] p-0">
          <TriangleChart
            scores={scoresForMainTriangle}
            interactive={hasAssessmentBeenRun}
            onLayerClick={handleTriangleLayerClick}
            width={320}
            height={277}
          />
        </CardContent>
        {!hasAssessmentBeenRun && (
          <CardFooter className="flex-col items-center gap-3 pt-4 border-t border-border/20">
            <p className="text-sm text-muted-foreground text-center">Your results will appear here once you complete the assessment.</p>
            <Button asChild>
              <Link href="/assessment"><Icons.assessment className="mr-2 h-4 w-4" /> Begin Assessment</Link>
            </Button>
          </CardFooter>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl">Facet Breakdown</CardTitle>
            <CardDescription>
              {hasAssessmentBeenRun
                ? "Your scores across the 7 worldview dimensions, with labels indicating primary alignment."
                : "Showing neutral baseline scores. Complete an assessment to see your breakdown."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderDomainFeedbackBars()}
          </CardContent>
        </Card>

        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl">Quick Insights</CardTitle>
             <CardDescription className="text-xs">Reflections on your dominant facet alignment.</CardDescription>
          </CardHeader>
          <CardContent>
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
                    Your dominant facet appears to be <span className="font-semibold" style={{color: getFacetColorHsl(dominantFacetName)}}>{dominantFacetName}</span>.
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
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphic-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary roygbiv-gradient-underline pb-2">Closest Archetype Matches</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasAssessmentBeenRun ? (
            <div className="text-center py-8">
              <TriangleChart scores={defaultNeutralScores} width={200} height={173} interactive={false} />
              <p className="mt-4 text-muted-foreground">Take the Assessment to Discover Your Archetypal Matches.</p>
              <Button asChild className="mt-4">
                <Link href="/assessment"><Icons.assessment className="mr-2 h-4 w-4" /> Begin Assessment</Link>
              </Button>
            </div>
          ) : topThreeMatches.length > 0 ? (
            <div className="space-y-6">
              {topThreeMatches[0] && topThreeMatches[0].domainScores && (
                <Card className="bg-card/50 border-primary/30 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl" style={{ color: getFacetColorHsl(getDominantFacet(topThreeMatches[0].domainScores)) }}>
                          Top Match: {topThreeMatches[0].title}
                        </CardTitle>
                        <CardDescription>Similarity: {Math.round(topThreeMatches[0].similarity)}%</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleOpenArchetypeDrawer(topThreeMatches[0])}>Details</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-1 flex justify-center">
                      <TriangleChart scores={topThreeMatches[0].domainScores} width={180} height={156} />
                    </div>
                    <p className="md:col-span-2 text-sm text-muted-foreground line-clamp-4">{topThreeMatches[0].summary}</p>
                  </CardContent>
                </Card>
              )}
              {(topThreeMatches[1] || topThreeMatches[2]) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {topThreeMatches.slice(1).map((match) => match && match.domainScores && (
                    <Card key={match.id} className="bg-card/40">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg" style={{ color: getFacetColorHsl(getDominantFacet(match.domainScores)) }}>
                            {match.title}
                          </CardTitle>
                          <Badge variant="secondary">{Math.round(match.similarity)}% Similar</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center">
                        <TriangleChart scores={match.domainScores} width={150} height={130} className="mb-3" />
                        <Button size="xs" variant="ghost" className="w-full mt-2" onClick={() => handleOpenArchetypeDrawer(match)}>View Details</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
               <div className="text-center mt-6">
                <Button asChild variant="outline">
                  <Link href="/archetypes">Explore All Archetypes <Icons.chevronRight className="ml-1 h-4 w-4"/></Link>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Could not determine archetype matches. Ensure assessment is complete.</p>
          )}
        </CardContent>
      </Card>

      {selectedArchetypeForDrawer && (
        <Sheet open={isArchetypeDrawerOpen} onOpenChange={setIsArchetypeDrawerOpen}>
          <SheetContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl" side="right">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SheetHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <SheetTitle className="text-3xl mb-1" style={{color: getFacetColorHsl(getDominantFacet(selectedArchetypeForDrawer.domainScores))}}>
                        {selectedArchetypeForDrawer.title}
                      </SheetTitle>
                      <SheetDescription className="text-base capitalize">{selectedArchetypeForDrawer.category} Profile</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                <p className="mb-6 text-muted-foreground leading-relaxed">{selectedArchetypeForDrawer.summary}</p>
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border/30 pb-2">Facet Breakdown</h3>
                  {FACET_NAMES.map(facetName => {
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
                          <h4 className="text-lg font-semibold" style={{color: getFacetColorHsl(facetName)}}>
                            {facetName}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground italic mb-1">{facetConfig?.tagline || "..."}</p>
                        <p className="text-sm text-muted-foreground">{facetSummary}</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                           <div 
                              className="w-full h-10 p-1 rounded-xl bg-slate-800/40 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl border border-slate-700/50 dark:border-slate-600/50 relative mt-2 group overflow-hidden flex items-center"
                              aria-label={`${facetName} spectrum: ${spectrumPoleLabels.left} to ${spectrumPoleLabels.right}. Score: ${Math.round(score * 100)}%`}
                            >
                              <div
                                className="h-full w-full rounded-lg"
                                style={{
                                  background: `linear-gradient(to right, ${DOMAIN_SCALES[facetName](0).hex()}, ${DOMAIN_SCALES[facetName](1).hex()})`,
                                  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                                  maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                                }}
                              />
                              <div
                                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-transform duration-200 group-hover:scale-125"
                                style={{
                                  left: `${score * 100}%`,
                                  zIndex: 10,
                                  pointerEvents: 'none',
                                }}
                              >
                                <div className="px-2 py-0.5 text-[10px] font-semibold bg-slate-900/80 dark:bg-black/70 backdrop-blur-md text-white rounded-full shadow-xl border border-white/20 dark:border-slate-400/30 whitespace-nowrap">
                                  {Math.round(score * 100)}%
                                </div>
                                <svg width="14" height="10" viewBox="0 0 14 10" className="fill-slate-900/80 dark:fill-black/70 drop-shadow-md mx-auto mt-px" style={{ transform: 'translateY(-2px)'}}>
                                  <path d="M7 0L0 10H14L7 0Z" />
                                </svg>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg text-xs">
                            <p>{spectrumPoleLabels.left} <span className="font-bold mx-1">← {Math.round(score * 100)}% →</span> {spectrumPoleLabels.right}</p>
                             <p className="text-xs text-muted-foreground/80">Color: {getFacetScoreColor(facetName, score)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  })}
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
                <SheetHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <FacetIcon facetName={currentSelectedFacetData.name} className="h-10 w-10" />
                      <div>
                        <SheetTitle className="text-3xl mb-0" style={{color: getFacetColorHsl(currentSelectedFacetData.name)}}>
                          {currentSelectedFacetData.name}
                        </SheetTitle>
                        <SheetDescription className="text-sm -mt-1">{currentSelectedFacetData.tagline}</SheetDescription>
                      </div>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-5">
                  <Card className="bg-background/40 p-4">
                    <h3 className="text-lg font-semibold mb-1">Your Score</h3>
                    <p className="text-2xl font-bold" style={{color: getFacetColorHsl(currentSelectedFacetData.name)}}>
                      {currentUserScoreForSelectedFacet !== undefined ? `${Math.round(currentUserScoreForSelectedFacet * 100)}%` : "N/A"}
                    </p>
                    {currentUserScoreForSelectedFacet !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        {getQualitativeScoreDescription(currentUserScoreForSelectedFacet, currentSelectedFacetData.name)}
                      </p>
                    )}
                  </Card>

                  <Card className="bg-background/40 p-4">
                    <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-1">
                      {getDetailedInterpretation(currentUserScoreForSelectedFacet, currentSelectedFacetData.name)}
                    </p>
                  </Card>

                  {currentSelectedFacetData.deepDive?.strengthsPlaceholder && (
                    <Card className="bg-background/40 p-4">
                      <h3 className="text-lg font-semibold mb-2">Potential Strengths</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentSelectedFacetData.deepDive.strengthsPlaceholder}
                      </p>
                    </Card>
                  )}

                  {(currentSelectedFacetData.deepDive?.tensionsPlaceholder || currentSelectedFacetData.deepDive?.blindSpotsPlaceholder) && (
                    <Card className="bg-background/40 p-4">
                      <h3 className="text-lg font-semibold mb-2">Possible Tensions / Blind Spots</h3>
                      {currentSelectedFacetData.deepDive.tensionsPlaceholder && <p className="text-sm text-muted-foreground">{currentSelectedFacetData.deepDive.tensionsPlaceholder}</p>}
                      {currentSelectedFacetData.deepDive.blindSpotsPlaceholder && <p className="text-sm text-muted-foreground mt-1">{currentSelectedFacetData.deepDive.blindSpotsPlaceholder}</p>}
                    </Card>
                  )}

                  {currentSelectedFacetData.deepDive?.reflectionPrompts && currentSelectedFacetData.deepDive.reflectionPrompts.length > 0 && (
                    <Card className="bg-background/40 p-4">
                      <h3 className="text-lg font-semibold mb-2">Reflection Prompts</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {currentSelectedFacetData.deepDive.reflectionPrompts.map((prompt, idx) => (
                          <li key={idx}>{prompt}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/facet/${currentSelectedFacetData.name.toLowerCase()}`}>
                      Deep Dive into {currentSelectedFacetData.name} <Icons.chevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
      <section className="glassmorphic-card p-6 md:p-8 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground roygbiv-gradient-underline pb-2">About the Meta-Prism Worldview Assessment Tool</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutContent.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out bg-card/50 hover:bg-card/70 border"
              style={{ borderColor: getFacetColorHsl(item.accentFacet) }}
            >
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="h-7 w-7" style={{ color: getFacetColorHsl(item.accentFacet) }} />
                <strong className="text-lg font-semibold" style={{ color: getFacetColorHsl(item.accentFacet) }}>{item.title}</strong>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="mt-12 pt-8 border-t border-border/30 text-center">
        <Link href="/about" className="text-sm text-primary hover:underline">
          Learn More About the Meta-Prism Model
        </Link>
      </footer>
    </div>
    </TooltipProvider>
  );
}

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

  return (
    <div className="mb-6 p-3 rounded-md border border-border/30 bg-background/40">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium" style={{ color: getFacetColorHsl(facetName) }}>{facetConfig.name}</span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="w-full h-10 p-1 rounded-xl bg-slate-800/40 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl border border-slate-700/50 dark:border-slate-600/50 relative mt-2 group overflow-hidden flex items-center"
            aria-label={`${facetName} spectrum: ${spectrumPoleLabels.left} to ${spectrumPoleLabels.right}. Score: ${Math.round(score * 100)}%`}
          >
            <div
              className="h-full w-full rounded-lg"
              style={{
                background: `linear-gradient(to right, ${DOMAIN_SCALES[facetName](0).hex()}, ${DOMAIN_SCALES[facetName](1).hex()})`,
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
              }}
            />
            <div
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-transform duration-200 group-hover:scale-125"
              style={{
                left: `${score * 100}%`,
                zIndex: 10,
                pointerEvents: 'none', 
              }}
            >
              <div className="px-2 py-0.5 text-[10px] font-semibold bg-slate-900/80 dark:bg-black/70 backdrop-blur-md text-white rounded-full shadow-xl border border-white/20 dark:border-slate-400/30 whitespace-nowrap">
                {Math.round(score * 100)}%
              </div>
              <svg width="14" height="10" viewBox="0 0 14 10" className="fill-slate-900/80 dark:fill-black/70 drop-shadow-md mx-auto mt-px" style={{ transform: 'translateY(-2px)'}}>
                <path d="M7 0L0 10H14L7 0Z" />
              </svg>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg text-xs">
          <p>{spectrumPoleLabels.left} <span className="font-bold mx-1">← {Math.round(score * 100)}% →</span> {spectrumPoleLabels.right}</p>
          <p className="text-xs text-muted-foreground/80">Color: {getFacetScoreColor(facetName, score)}</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
        <span className="font-semibold">{anchorLeft}</span>
        <span className="font-semibold">{anchorRight}</span>
      </div>
    </div>
  );
}

    