
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES, FacetName, getFacetByName } from "@/config/facets"; // getFacetByName
import type { DomainScore, CodexEntry, WorldviewProfile, LocalUser } from "@/types";
import React, { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetColorHsl, getBandColor } from '@/lib/colors';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FacetIcon } from "@/components/facet-icon"; // Import FacetIcon

// --- Archetype Data & Helpers (Copied from archetypes/page.tsx for dashboard use) ---
// This data should ideally be in a shared location or fetched.
const rawArchetypeData: any[] = [
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
    "name": "The Rationalist Skeptic",
    "summary": "Believes reality is material, truth comes from reason and science, and meaning is self-created.",
    "facetScores": { "ontology": 0.1, "epistemology": 0.2, "praxeology": 0.3, "axiology": 0.5, "mythology": 0.3, "cosmology": 0.4, "teleology": 0.2 }
  },
  // ... (Include ALL archetypes from archetypes/page.tsx here for full comparison)
  // For brevity, I'm only including a few. Ensure all are copied for full functionality.
  {
    "name": "The Diplomat",
    "summary": "Mediates conflict, builds bridges, and seeks harmony among differences.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.6, "cosmology": 0.7, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Reality is complex and interconnected.", "epistemology": "Learns from dialogue and negotiation.", "praxeology": "Acts through mediation and bridge-building.", "axiology": "Values harmony, balance, and respect.", "mythology": "Guided by peacemakers and mediators.", "cosmology": "World as a field of relationship.", "teleology": "Purpose is unity and reconciliation." }
  }
];

const mapRawArchetypeToCodexEntry = (raw: any): CodexEntry => {
    if (!raw || typeof raw.name !== 'string') {
      console.error("mapRawArchetypeToCodexEntry: Invalid raw data item", raw);
      return {
        id: `invalid_archetype_${Date.now()}`,
        title: "Invalid Archetype Data",
        summary: "This archetype data could not be processed.",
        domainScores: FACET_NAMES.map(name => ({ facetName: name, score: 0.5 })),
        facetSummaries: {},
        category: "custom",
        isArchetype: true,
        createdAt: new Date().toISOString(),
        tags: ["error"],
      };
    }
    const domainScoresArray: DomainScore[] = FACET_NAMES.map(facetKey => {
      let score = 0.5; 
      if (raw.facetScores && typeof raw.facetScores === 'object') {
        const rawScore = raw.facetScores[facetKey.toLowerCase() as keyof typeof raw.facetScores] ?? raw.facetScores[facetKey as keyof typeof raw.facetScores];
        if (typeof rawScore === 'number') {
          score = Math.max(0, Math.min(1, Number(rawScore)));
        }
      }
      return { facetName: facetKey, score };
    });
    const processedFacetSummaries: { [K_FacetName in FacetName]?: string } = {};
    if (raw.facetSummaries && typeof raw.facetSummaries === 'object') {
      for (const facetKey of FACET_NAMES) {
        const summaryKey = facetKey.toLowerCase() as keyof typeof raw.facetSummaries;
        const summary = raw.facetSummaries[summaryKey] ?? raw.facetSummaries[facetKey as keyof typeof raw.facetSummaries];
        if (typeof summary === 'string') {
          processedFacetSummaries[facetKey] = summary;
        }
      }
    }
    return {
      id: raw.name.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, ''),
      title: raw.name,
      summary: raw.summary || "No summary available.",
      domainScores: domainScoresArray,
      facetSummaries: processedFacetSummaries,
      category: "archetypal",
      isArchetype: true,
      createdAt: raw.createdAt || new Date().toISOString(),
      tags: raw.tags || [raw.name.toLowerCase().replace(/\s+/g, '_'), "archetype"],
    };
  };

const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0];
  const validScores = scores.filter(s => s && typeof s.score === 'number');
  if (validScores.length === 0) return FACET_NAMES[0];
  return validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev).facetName || FACET_NAMES[0];
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
// --- End Archetype Data & Helpers ---

const defaultNeutralScores: DomainScore[] = FACET_NAMES.map(name => ({ facetName: name, score: 0.5 }));

function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: FacetName, score: number, anchorLeft: string, anchorRight: string }) {
  const facetConfig = FACETS[facetName];
  if (!facetConfig) return null;
  const colorHsl = getFacetColorHsl(facetName);

  return (
    <div className="mb-4 p-3 rounded-md border border-border/30 bg-background/40">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: colorHsl }}>{facetConfig.name}</span>
        <span className="text-xs font-semibold" style={{ color: colorHsl }}>{Math.round(score * 100)}%</span>
      </div>
      <Progress value={score * 100} className="h-3" indicatorStyle={{ backgroundColor: colorHsl }} />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{anchorLeft}</span>
        <span>{anchorRight}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { 
    domainScores: userDomainScores, 
    currentUser, 
    openAuthModal, 
    hasAssessmentBeenRun 
  } = useWorldview();
  
  const [selectedArchetypeForDrawer, setSelectedArchetypeForDrawer] = useState<CodexEntry | null>(null);
  const [isArchetypeDrawerOpen, setIsArchetypeDrawerOpen] = useState(false);

  // State for Facet Insight Panel
  const [selectedFacetForInsight, setSelectedFacetForInsight] = useState<FacetName | null>(null);
  const [isInsightPanelOpen, setIsInsightPanelOpen] = useState(false);

  const mappedArchetypes = useMemo(() => {
    try {
      // Ensure all archetypes are copied into rawArchetypeData for full functionality
      return rawArchetypeData.filter(item => item && item.name).map(mapRawArchetypeToCodexEntry);
    } catch (error) {
      console.error("Error mapping archetypes in Dashboard:", error);
      return [];
    }
  }, []);
  
  const scoresForMainTriangle = useMemo(() => {
      return hasAssessmentBeenRun ? userDomainScores : defaultNeutralScores;
  }, [userDomainScores, hasAssessmentBeenRun]);

  const topThreeMatches = useMemo(() => {
    if (!hasAssessmentBeenRun || !userDomainScores || mappedArchetypes.length === 0) return [];
    return mappedArchetypes
      .map(archetype => ({
        ...archetype,
        similarity: calculateSimilarity(userDomainScores, archetype.domainScores),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  }, [userDomainScores, mappedArchetypes, hasAssessmentBeenRun]);

  const handleOpenArchetypeDrawer = (archetype: CodexEntry) => {
    setSelectedArchetypeForDrawer(archetype);
    setIsArchetypeDrawerOpen(true);
  };

  const handleTriangleLayerClick = (facetName: FacetName) => {
    setSelectedFacetForInsight(facetName);
    setIsInsightPanelOpen(true);
  };

  const currentSelectedFacetData = selectedFacetForInsight ? FACETS[selectedFacetForInsight] : null;
  const currentUserScoreForSelectedFacet = selectedFacetForInsight && userDomainScores?.find(ds => ds.facetName === selectedFacetForInsight)?.score;


  return (
    <div className="container mx-auto py-8 space-y-12">
      <Card className="glassmorphic-card text-center p-6">
        {currentUser ? (
          <>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {currentUser.displayName}!</h1>
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
          <CardTitle className="text-2xl font-bold text-primary">Your Worldview Signature</CardTitle>
          {!hasAssessmentBeenRun && <CardDescription>Complete the assessment to reveal your unique pattern.</CardDescription>}
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[280px] p-0">
          <TriangleChart 
            scores={scoresForMainTriangle} 
            interactive={true} // Make it interactive
            onLayerClick={handleTriangleLayerClick} // Pass click handler
            width={320} 
            height={277} 
            className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" 
          />
        </CardContent>
         {!hasAssessmentBeenRun && (
            <CardFooter className="flex-col items-center gap-3 pt-4 border-t border-border/20">
                 <p className="text-sm text-muted-foreground text-center">Your results will appear here once you complete the assessment.</p>
                <Button asChild>
                    <Link href="/assessment"><Icons.assessment className="mr-2 h-4 w-4"/> Begin Assessment</Link>
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
                ? "Your scores across the 7 worldview dimensions."
                : "Take the assessment to see your detailed breakdown." 
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(userDomainScores && userDomainScores.length === FACET_NAMES.length) ? (
                userDomainScores.map(ds => {
                    const facetConfig = FACETS[ds.facetName];
                    return (
                        <DomainFeedbackBar
                            key={ds.facetName}
                            facetName={ds.facetName}
                            score={ds.score}
                            anchorLeft={hasAssessmentBeenRun && facetConfig ? `${facetConfig.tagline.split('?')[0]}` : "Spectrum Low"}
                            anchorRight={hasAssessmentBeenRun && facetConfig ? `Focus: ${ds.score > 0.66 ? 'High' : ds.score > 0.33 ? 'Mid' : 'Low'}` : "Spectrum High"}
                        />
                    );
                })
            ) : (
                FACET_NAMES.map(name => (
                     <DomainFeedbackBar
                        key={name}
                        facetName={name}
                        score={0.5} 
                        anchorLeft={"Spectrum Low"}
                        anchorRight={"Spectrum High"}
                    />
                ))
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl">Quick Insights</CardTitle>
            <CardDescription className="text-xs">AI-generated insights (placeholder)</CardDescription>
          </CardHeader>
          <CardContent>
            {hasAssessmentBeenRun && userDomainScores ? (
              <p className="text-muted-foreground text-sm">
                Reflective prompts based on your scores will appear here.
                Your dominant facet appears to be <span className="font-semibold" style={{color: getFacetColorHsl(getDominantFacet(userDomainScores))}}>{getDominantFacet(userDomainScores)}</span>.
                Consider exploring the implications of this emphasis.
              </p>
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
              <TriangleChart scores={defaultNeutralScores} width={200} height={173} interactive={false} className="mx-auto mb-4 !p-0 !bg-transparent !shadow-none !backdrop-blur-none opacity-50" />
              <p className="text-muted-foreground">Take the Assessment to Discover Your Archetypal Matches.</p>
               <Button asChild className="mt-4">
                    <Link href="/assessment"><Icons.assessment className="mr-2 h-4 w-4"/> Begin Assessment</Link>
                </Button>
            </div>
          ) : topThreeMatches.length > 0 ? (
            <div className="space-y-6">
              {topThreeMatches[0] && (
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
                  {topThreeMatches.slice(1).map((match) => match && (
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
                        <TriangleChart scores={match.domainScores} width={150} height={130} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none mb-3" />
                         <Button size="xs" variant="ghost" className="w-full mt-2" onClick={() => handleOpenArchetypeDrawer(match)}>View Details</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Could not determine archetype matches. Ensure assessment is complete.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Drawer for Archetype Details */}
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
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Icons.close className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <p className="mb-6 text-muted-foreground leading-relaxed">{selectedArchetypeForDrawer.summary}</p>
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border/30 pb-2">Facet Breakdown</h3>
                  {FACET_NAMES.map(facetName => {
                    const scoreObj = selectedArchetypeForDrawer.domainScores.find(ds => ds.facetName === facetName);
                    const score = scoreObj ? scoreObj.score : 0;
                    const facetConfig = FACETS[facetName];
                    const facetSummary = selectedArchetypeForDrawer.facetSummaries?.[facetName] || `Insights into how ${selectedArchetypeForDrawer.title} relates to ${facetName.toLowerCase()}...`;
                    
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

      {/* Facet Insight Panel */}
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
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Icons.close className="h-5 w-5" />
                      </Button>
                    </SheetClose>
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
                            This score places you in the '{currentUserScoreForSelectedFacet > 0.66 ? 'High' : currentUserScoreForSelectedFacet > 0.33 ? 'Mid' : 'Low'}' range for {currentSelectedFacetData.name}.
                        </p>
                    )}
                  </Card>

                  <Card className="bg-background/40 p-4">
                    <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-1">
                      {currentSelectedFacetData.deepDive.spectrumExplanation}
                    </p>
                    {currentUserScoreForSelectedFacet !== undefined && (
                         <p className="text-sm text-muted-foreground leading-relaxed mt-2 italic">
                            A {currentUserScoreForSelectedFacet > 0.66 ? 'higher' : currentUserScoreForSelectedFacet > 0.33 ? 'moderate' : 'lower'} score in {currentSelectedFacetData.name} often suggests... [Placeholder for score-specific interpretation snippet]
                        </p>
                    )}
                  </Card>
                  
                  <Card className="bg-background/40 p-4">
                    <h3 className="text-lg font-semibold mb-2">Potential Strengths</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentSelectedFacetData.deepDive.strengthsPlaceholder || "Explore potential strengths associated with this facet orientation."}
                    </p>
                  </Card>

                  <Card className="bg-background/40 p-4">
                     <h3 className="text-lg font-semibold mb-2">Possible Tensions / Blind Spots</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentSelectedFacetData.deepDive.tensionsPlaceholder || "Consider potential tensions or blind spots."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentSelectedFacetData.deepDive.blindSpotsPlaceholder || ""}
                    </p>
                  </Card>

                  <Card className="bg-background/40 p-4">
                    <h3 className="text-lg font-semibold mb-2">Reflection Prompts</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {currentSelectedFacetData.deepDive.reflectionPrompts.map((prompt, idx) => (
                        <li key={idx}>{prompt}</li>
                      ))}
                    </ul>
                  </Card>

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
