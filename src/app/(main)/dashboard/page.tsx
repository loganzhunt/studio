
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES, FacetName } from "@/config/facets";
import type { DomainScore, CodexEntry, LocalUser, WorldviewProfile } from "@/types";
import React, { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetColorHsl, DOMAIN_COLORS, SPECTRUM_LABELS } from '@/lib/colors';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FacetIcon } from "@/components/facet-icon";

// --- Archetype Data & Helpers ---
// This should ideally be fetched or imported from a shared location if data grows significantly.
// For now, keeping it here for dashboard-specific logic.
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
    "title": "The Transcendent Mystic", // Updated name from "The Mystic Pilgrim"
    "summary": "Sees all of existence as sacred and interconnected, guided by direct spiritual insight. Values self-transcendence, unity, and surrender to higher meaning.",
    "scores": { "ontology": 0.90, "epistemology": 0.85, "praxeology": 0.30, "axiology": 0.90, "mythology": 0.90, "cosmology": 0.85, "teleology": 1.0 }, // Updated teleology from 0.00 to 1.00
    "facetDescriptions": { "ontology": "Sees reality as fundamentally ideal or spiritual, rooted in unity or consciousness.", "epistemology": "Gains knowledge through revelation, intuition, or mystical insight.", "praxeology": "Prefers non-hierarchical, contemplative, or surrender-based action.", "axiology": "Values selfless love, devotion, and sacred ideals over individual gain.", "mythology": "Finds resonance in cyclical, mythic, and transpersonal stories.", "cosmology": "Views the universe as holistic and interconnected.", "teleology": "Sees life’s highest purpose in the Divine, transcendence, or unity." }
  },
  {
    "title": "The Scientific Humanist", // Updated name from "The Humanist"
    "summary": "Grounded in rational ethics, scientific method, and belief in human progress.", // Kept summary
    "scores": { "ontology": 0.20, "epistemology": 0.25, "praxeology": 0.40, "axiology": 0.55, "mythology": 0.25, "cosmology": 0.25, "teleology": 0.15 }, // Updated scores
    "facetDescriptions": { "ontology": "Leans materialist, seeing people and relationships as the core of reality.", "epistemology": "Values evidence, critical thinking, and reasoned dialogue.", "praxeology": "Prefers systems that are merit-based but support collective good.", "axiology": "Blends individual dignity with social compassion and justice.", "mythology": "Draws meaning from human stories and cultural narratives.", "cosmology": "Views the universe as understandable and shaped by human inquiry.", "teleology": "Sees meaning as constructed, existential, and rooted in this world." }
  },
  {
    "title": "The Archetypal Traditionalist",
    "summary": "Upholds sacred order, divine authority, and moral duty rooted in religious tradition.",
    "scores": { "ontology": 0.4, "epistemology": 0.3, "praxeology": 0.5, "axiology": 0.75, "mythology": 0.9, "cosmology": 0.8, "teleology": 0.9 },
    "facetDescriptions": { "ontology": "Reality is ordered by tradition and divine principles.", "epistemology": "Knowledge comes from sacred texts and lineage.", "praxeology": "Action is guided by established duties and rituals.", "axiology": "Values heritage, obedience, and communal harmony.", "mythology": "Upholds foundational myths and religious narratives.", "cosmology": "Universe is seen as divinely structured and meaningful.", "teleology": "Purpose is to live according to divine law and tradition." }
  },
  {
    "title": "The Earth-Centered Animist", // Updated name from "The Cosmic Animist"
    "summary": "Views the world as alive, reciprocal, and sacred; values ecological harmony and ancestral continuity.", // Kept summary
    "scores": { "ontology": 0.85, "epistemology": 0.60, "praxeology": 0.40, "axiology": 0.65, "mythology": 0.70, "cosmology": 0.90, "teleology": 0.80 }, // Updated scores
    "facetDescriptions": { "ontology": "Sees reality as inherently alive, relational, and animated by spirit.", "epistemology": "Balances observation with revelatory ways of knowing (dream, vision).", "praxeology": "Values egalitarian, reciprocal, and collective practices.", "axiology": "Prioritizes interdependence, respect, and stewardship.", "mythology": "Meaning is found in cyclical, living, and place-based stories.", "cosmology": "Views cosmos as holistic and animate.", "teleology": "Purpose is to participate in the living web of existence." }
  },
  {
    "title": "The Existential Individualist", // Updated name from "The Existential Explorer"
    "summary": "Asserts self-determined meaning, embraces uncertainty, and rejects cosmic absolutes.", // Kept summary
    "scores": { "ontology": 0.40, "epistemology": 0.40, "praxeology": 0.45, "axiology": 0.35, "mythology": 0.40, "cosmology": 0.35, "teleology": 0.05 }, // Updated scores
    "facetDescriptions": { "ontology": "Balances between material and ideal, questioning fixed reality.", "epistemology": "Explores both empirical and revelatory ways of knowing.", "praxeology": "Resists rigid hierarchy; favors flexible, individual action.", "axiology": "Values personal meaning and creative expression.", "mythology": "Draws from diverse stories, often in cyclical or disrupted form.", "cosmology": "Views cosmos as open, uncertain, and in flux.", "teleology": "Sees purpose as existential, chosen, and ambiguous." }
  },
  {
    "title": "The Stoic Rationalist",
    "summary": "Sees life as ordered by reason and fate, values virtue, and emphasizes inner discipline.",
    "scores": { "ontology": 0.4, "epistemology": 0.5, "praxeology": 0.8, "axiology": 0.75, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.7 },
    "facetDescriptions": { "ontology": "Materialist or dualist; reason is part of nature.", "epistemology": "Reasoned reflection; self-examination.", "praxeology": "Virtuous action, self-control, resilience.", "axiology": "Values wisdom, virtue, equanimity.", "mythology": "Draws from Greco-Roman myths for exemplars.", "cosmology": "Universe as rational, ordered whole.", "teleology": "Purpose is to live in harmony with nature and reason." }
  },
  {
    "title": "The Contemplative Realist",
    "summary": "Grounded in realism but open to mystery, this archetype values awareness, modesty, and interior clarity.",
    "scores": { "ontology": 0.5, "epistemology": 0.6, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.5, "cosmology": 0.5, "teleology": 0.6 },
    "facetDescriptions": { "ontology": "Reality is what is, but also includes subjective depth.", "epistemology": "Balances empirical observation with introspective awareness.", "praxeology": "Acts mindfully and with consideration for nuance.", "axiology": "Values clarity, peace, and authentic understanding.", "mythology": "Interprets myths for psychological or spiritual insight.", "cosmology": "Universe is real, and our perception of it matters.", "teleology": "Purpose is found in awareness and living authentically." }
  },
  { // From the "Ethical Altruist"
    "title": "The Ethical Altruist",
    "summary": "Pursues the greatest good for the greatest number, prioritizing compassion, justice, and the welfare of all beings.",
    "scores": { "ontology": 0.45, "epistemology": 0.50, "praxeology": 0.50, "axiology": 0.85, "mythology": 0.45, "cosmology": 0.55, "teleology": 0.50 },
    "facetDescriptions": { "ontology": "Holds reality as interdependent, blending material and relational perspectives.", "epistemology": "Combines reasoned evidence with empathy and moral imagination.", "praxeology": "Prefers egalitarian, participatory action; collective service.", "axiology": "Values compassion, justice, and altruistic ideals.", "mythology": "Sees meaning in stories of cooperation and shared purpose.", "cosmology": "Cosmos is holistic, shaped by interconnectedness.", "teleology": "Purpose is ethical flourishing and collective well-being."}
  }
];


const mapRawArchetypeToCodexEntry = (raw: any): CodexEntry | null => {
  try {
    if (!raw || typeof raw !== 'object' || (typeof raw.title !== 'string' && typeof raw.name !== 'string')) {
      console.error("mapRawArchetypeToCodexEntry: Invalid raw data item, skipping:", raw);
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
      console.warn(`Scores missing for archetype: ${titleToUse}. Defaulting all to 0.5.`);
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
    return null; // Return null if any error occurs during mapping
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

  if (userMagnitude === 0 || archetypeMagnitude === 0) {
    return 0;
  }
  const similarity = (dotProduct / (userMagnitude * archetypeMagnitude)) * 100;
  return Math.max(0, Math.min(100, similarity));
};

const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0]; 
  const validScores = scores.filter(s => s && typeof s.score === 'number');
  if (validScores.length === 0) return FACET_NAMES[0];
  return validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev).facetName || FACET_NAMES[0];
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

  const mappedArchetypes = useMemo(() => {
    try {
      if (!Array.isArray(rawArchetypeData)) {
        console.error("rawArchetypeData is not an array in Dashboard:", rawArchetypeData);
        return []; 
      }
      return rawArchetypeData
        .map(item => mapRawArchetypeToCodexEntry(item))
        .filter(item => item !== null) as CodexEntry[]; // Filter out nulls from failed mappings
    } catch (error) {
      console.error("Error mapping archetypes in Dashboard:", error);
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
          if (!archetype || !archetype.domainScores) { // Add a check for archetype and its domainScores
            console.warn("Skipping archetype with missing domainScores:", archetype);
            return { ...archetype, similarity: 0 }; // Assign 0 similarity if domainScores are missing
          }
          return {
            ...archetype,
            similarity: calculateSimilarity(userDomainScores, archetype.domainScores),
          };
        })
        .filter(archetype => archetype !== null) // Ensure nulls are filtered if mapRawArchetypeToCodexEntry returns null
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);
    } catch (error) {
      console.error("Error calculating top three matches:", error);
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

  const getQualitativeScoreDescription = (score: number | undefined, facetName: FacetName | undefined): string => {
    if (score === undefined || !facetName || !FACETS[facetName]) return "A balanced perspective.";
    const facetConfig = FACETS[facetName];
    if (!facetConfig.deepDive?.spectrumAnchors || facetConfig.deepDive.spectrumAnchors.length === 0) {
      return "Perspective interpretation not available.";
    }
    const anchors = facetConfig.deepDive.spectrumAnchors;

    if (anchors.length === 3) {
      if (score < 0.34) return `Primarily aligns with: ${anchors[0]}`;
      if (score <= 0.66) return `Suggests a perspective of: ${anchors[1]}`;
      return `Primarily aligns with: ${anchors[2]}`;
    } else if (anchors.length === 2) {
      return score < 0.5 ? `Aligns more with: ${anchors[0]}` : `Aligns more with: ${anchors[1]}`;
    } else if (anchors.length === 1) {
      return `Aligns with: ${anchors[0]}`;
    }
    return "Perspective noted.";
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

  const renderDomainFeedbackBars = () => {
    const scoresToDisplay = hasAssessmentBeenRun && userDomainScores && userDomainScores.length > 0 ? userDomainScores : defaultNeutralScores;

    return scoresToDisplay.map(ds => {
      const facetConfig = FACETS[ds.facetName];
      if (!facetConfig) {
        console.warn(`Facet configuration not found for: ${ds.facetName} in Facet Breakdown`);
        return (
          <DomainFeedbackBar
            key={ds.facetName}
            facetName={ds.facetName}
            score={ds.score}
            anchorLeft="Error"
            anchorRight="Error"
          />
        );
      }
      const labels = SPECTRUM_LABELS[ds.facetName];
      let anchorLeftText = labels ? labels.left : "Spectrum Low";
      let anchorRightText = labels ? labels.right : "Spectrum High";
      
      return (
        <DomainFeedbackBar
          key={ds.facetName}
          facetName={ds.facetName}
          score={ds.score}
          anchorLeft={anchorLeftText}
          anchorRight={anchorRightText}
        />
      );
    });
  };


  return (
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
            className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none"
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

                const qualitativeDesc = getQualitativeScoreDescription(dominantScore, dominantFacetName);

                return (
                  <p className="text-muted-foreground text-sm">
                    Your dominant facet appears to be <span className="font-semibold" style={{color: getFacetColorHsl(dominantFacetName)}}>{dominantFacetName}</span>.
                    {` Your alignment (${Math.round(dominantScore*100)}%) ${qualitativeDesc.toLowerCase()}.`}
                    Consider exploring the implications of this emphasis.
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
              <TriangleChart scores={defaultNeutralScores} width={200} height={173} interactive={false} className="mx-auto mb-4 opacity-50 !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
              <p className="text-muted-foreground">Take the Assessment to Discover Your Archetypal Matches.</p>
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
                      <TriangleChart scores={topThreeMatches[0].domainScores} width={180} height={156} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
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
                        <TriangleChart scores={match.domainScores} width={150} height={130} className="mb-3 !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
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
    </div>
  );
}

// Helper Component for Domain Feedback Bars

function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: FacetName, score: number, anchorLeft: string, anchorRight: string }) {
  const facetConfig = FACETS[facetName];
  if (!facetConfig) {
    console.warn(`Facet configuration not found for: ${facetName} in DomainFeedbackBar`);
    return (
      <div className="mb-4 p-3 rounded-md border border-destructive/50 bg-destructive/10">
        <p className="text-destructive text-sm">Configuration error for facet: {facetName}</p>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 rounded-md border border-border/30 bg-background/40">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: getFacetColorHsl(facetName) }}>{facetConfig.name}</span>
        <span className="text-xs font-semibold" style={{ color: getFacetColorHsl(facetName) }}>{Math.round(score * 100)}%</span>
      </div>
      <Progress value={score * 100} className="h-3" indicatorStyle={{ backgroundColor: getFacetColorHsl(facetName) }} />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span className="font-semibold">{anchorLeft}</span>
        <span className="font-semibold">{anchorRight}</span>
      </div>
    </div>
  );
}

    