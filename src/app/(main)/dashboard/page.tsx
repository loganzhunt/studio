
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES } from "@/config/facets";
import type { DomainScore, FacetName, CodexEntry, WorldviewProfile, LocalUser } from "@/types";
import React, { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetColorHsl } from '@/lib/colors';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// --- Helper Functions (copied/adapted from archetypes/page.tsx) ---
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0];
  const validScores = scores.filter(s => s && typeof s.score === 'number');
  if (validScores.length === 0) return FACET_NAMES[0];
  return validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev).facetName || FACET_NAMES[0];
};

// Archetype Data (should ideally be shared or fetched, copied for now)
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
    "name": "The Diplomat",
    "summary": "Mediates conflict, builds bridges, and seeks harmony among differences.",
    "facetScores": { "ontology": 0.7, "epistemology": 0.7, "praxeology": 0.9, "axiology": 0.9, "mythology": 0.6, "cosmology": 0.7, "teleology": 0.8 },
    "facetSummaries": { "ontology": "Reality is complex and interconnected.", "epistemology": "Learns from dialogue and negotiation.", "praxeology": "Acts through mediation and bridge-building.", "axiology": "Values harmony, balance, and respect.", "mythology": "Guided by peacemakers and mediators.", "cosmology": "World as a field of relationship.", "teleology": "Purpose is unity and reconciliation." }
  }
  // ... (Ensure ALL archetypes from archetypes/page.tsx are eventually copied here for full comparison functionality)
];


const mapRawArchetypeToCodexEntry = (raw: any): CodexEntry => {
    if (!raw || typeof raw.name !== 'string') {
      console.error("mapRawArchetypeToCodexEntry: Invalid raw data item", raw);
      // Return a placeholder or throw an error, depending on desired handling
      return {
        id: `invalid_archetype_${Date.now()}`,
        title: "Invalid Archetype Data",
        summary: "This archetype data could not be processed.",
        domainScores: FACET_NAMES.map(name => ({ facetName: name, score: 0 })),
        facetSummaries: {},
        category: "custom",
        isArchetype: true,
        createdAt: new Date().toISOString(),
        tags: ["error"],
      };
    }

    const domainScoresArray: DomainScore[] = FACET_NAMES.map(facetKey => {
      let score = 0.5; // Default score
      if (raw.facetScores && typeof raw.facetScores === 'object') {
        const rawScore = raw.facetScores[facetKey.toLowerCase()];
        if (typeof rawScore === 'number') {
          score = Math.max(0, Math.min(1, Number(rawScore)));
        }
      }
      return { facetName: facetKey, score };
    });
  
    const processedFacetSummaries: { [K_FacetName in FacetName]?: string } = {};
    if (raw.facetSummaries && typeof raw.facetSummaries === 'object') {
      for (const facetKey of FACET_NAMES) {
        const summary = raw.facetSummaries[facetKey.toLowerCase()];
        if (typeof summary === 'string') {
          processedFacetSummaries[facetKey] = summary;
        }
      }
    }
  
    return {
      id: raw.name.toLowerCase().replace(/\s+/g, '_'),
      title: raw.name,
      summary: raw.summary || "No summary available.",
      domainScores: domainScoresArray,
      facetSummaries: processedFacetSummaries,
      category: "archetypal",
      isArchetype: true,
      createdAt: new Date().toISOString(),
      tags: raw.tags || [raw.name.toLowerCase().replace(/\s+/g, '_'), "archetype"],
    };
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
  return Math.max(0, Math.min(100, similarity)); // Clamp between 0 and 100
};


const defaultNeutralScores: DomainScore[] = FACET_NAMES.map(name => ({ facetName: name, score: 0.5 }));


export default function DashboardPage() {
  const { domainScores: userDomainScores, currentUser, openAuthModal, savedWorldviews } = useWorldview();
  const [selectedArchetypeForDrawer, setSelectedArchetypeForDrawer] = useState<CodexEntry | null>(null);
  const [isArchetypeDrawerOpen, setIsArchetypeDrawerOpen] = useState(false);

  const [selectedSourceAId, setSelectedSourceAId] = useState<string>('latest_results');
  const [selectedSourceBId, setSelectedSourceBId] = useState<string>('none');
  const [comparisonProfileA, setComparisonProfileA] = useState<WorldviewProfile | CodexEntry | null>(null);
  const [comparisonProfileB, setComparisonProfileB] = useState<WorldviewProfile | CodexEntry | null>(null);
  const [sortFacetComparisonByDifference, setSortFacetComparisonByDifference] = useState(false);

  const hasAssessmentData = useMemo(() => {
    return userDomainScores && userDomainScores.some(ds => ds.score !== 0.5); 
  }, [userDomainScores]);

  const mappedArchetypes = useMemo(() => {
    try {
      return rawArchetypeData.filter(item => item && item.name).map(mapRawArchetypeToCodexEntry);
    } catch (error) {
      console.error("Error mapping archetypes in Dashboard:", error);
      return [];
    }
  }, []);

  const topThreeMatches = useMemo(() => {
    if (!hasAssessmentData || !userDomainScores || mappedArchetypes.length === 0) return [];
    return mappedArchetypes
      .map(archetype => ({
        ...archetype,
        similarity: calculateSimilarity(userDomainScores, archetype.domainScores),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  }, [userDomainScores, mappedArchetypes, hasAssessmentData]);

  const comparisonProfileOptions = useMemo(() => {
    const options: { id: string; title: string; profile: WorldviewProfile | CodexEntry | null }[] = [
      { id: 'latest_results', title: 'My Latest Results', profile: hasAssessmentData && userDomainScores ? { id: 'latest', title: 'My Latest Results', domainScores: userDomainScores, createdAt: new Date().toISOString() } : null },
      { id: 'neutral_placeholder', title: 'Neutral Baseline (All 50%)', profile: { id: 'neutral', title: 'Neutral Baseline', domainScores: defaultNeutralScores, createdAt: new Date().toISOString() }}
    ];
    if (Array.isArray(savedWorldviews)) {
        savedWorldviews.forEach(sw => options.push({ id: `saved::${sw.id}`, title: `Saved: ${sw.title}`, profile: sw }));
    }
    if (Array.isArray(mappedArchetypes)) {
        mappedArchetypes.forEach(arch => {
            if (arch && arch.id) { // Ensure arch and arch.id are defined
                 options.push({ id: `archetype::${arch.id}`, title: `Archetype: ${arch.title}`, profile: arch })
            }
        });
    }
    options.push({ id: 'none', title: 'None (Compare to Neutral)', profile: null });
    return options;
  }, [hasAssessmentData, userDomainScores, savedWorldviews, mappedArchetypes]);


  useEffect(() => {
    const selectedA = comparisonProfileOptions.find(opt => opt.id === selectedSourceAId);
    setComparisonProfileA(selectedA?.profile || { id: 'neutral_a', title: 'Profile A (Neutral)', domainScores: defaultNeutralScores, createdAt: new Date().toISOString() });
  }, [selectedSourceAId, comparisonProfileOptions]);

  useEffect(() => {
    const selectedB = comparisonProfileOptions.find(opt => opt.id === selectedSourceBId);
    setComparisonProfileB(selectedB?.profile || { id: 'neutral_b', title: 'Profile B (Neutral)', domainScores: defaultNeutralScores, createdAt: new Date().toISOString() });
  }, [selectedSourceBId, comparisonProfileOptions]);

  const facetComparisonDisplayData = useMemo(() => {
    if (!comparisonProfileA || !comparisonProfileA.domainScores || !comparisonProfileB || !comparisonProfileB.domainScores) return [];

    let data = FACET_NAMES.map(facetName => {
      const facetConfig = FACETS[facetName];
      const scoreA = comparisonProfileA.domainScores.find(s => s.facetName === facetName)?.score ?? 0.5;
      const scoreB = comparisonProfileB.domainScores.find(s => s.facetName === facetName)?.score ?? 0.5;
      return {
        facetName,
        facetConfig,
        scoreA,
        scoreB,
        difference: Math.abs(scoreA - scoreB),
      };
    });

    if (sortFacetComparisonByDifference) {
      data.sort((a, b) => b.difference - a.difference);
    }
    return data;
  }, [comparisonProfileA, comparisonProfileB, sortFacetComparisonByDifference]);


  const handleOpenArchetypeDrawer = (archetype: CodexEntry) => {
    setSelectedArchetypeForDrawer(archetype);
    setIsArchetypeDrawerOpen(true);
  };

  const renderDomainFeedbackBars = () => {
    const scoresToDisplay = hasAssessmentData && userDomainScores ? userDomainScores : defaultNeutralScores;
    return scoresToDisplay.map(ds => (
      <DomainFeedbackBar
        key={ds.facetName}
        facetName={ds.facetName}
        score={ds.score}
        anchorLeft={hasAssessmentData ? `${FACETS[ds.facetName]?.name || ds.facetName} Low` : "Spectrum Low"}
        anchorRight={hasAssessmentData ? `${FACETS[ds.facetName]?.name || ds.facetName} High` : "Spectrum High"}
      />
    ));
  };

  return (
    <div className="container mx-auto py-8 space-y-12">
      <Card className="glassmorphic-card text-center p-6">
        {currentUser ? (
          <>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {currentUser.displayName}!</h1>
            <p className="text-muted-foreground mt-1">This is your Meta-Prism dashboard (Local Demo Mode).</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-foreground">Welcome to Meta-Prism!</h1>
            <p className="text-muted-foreground mt-1">Sign in to explore your worldview.</p>
            <Button onClick={openAuthModal} className="mt-4">
              <Icons.user className="mr-2 h-4 w-4" /> Sign In (Local Demo)
            </Button>
          </>
        )}
      </Card>

      <Card className="glassmorphic-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Your Worldview Signature</CardTitle>
          {!hasAssessmentData && <CardDescription>Complete the assessment to reveal your unique pattern.</CardDescription>}
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[280px] p-0">
          <TriangleChart scores={hasAssessmentData ? userDomainScores : defaultNeutralScores} interactive={false} width={320} height={277} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
        </CardContent>
         {!hasAssessmentData && (
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
              {hasAssessmentData 
                ? "Your scores across the 7 worldview dimensions."
                : "Neutral placeholder scores. Complete the assessment to see your breakdown."
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
            <CardDescription className="text-xs">Powered by AI (placeholder)</CardDescription>
          </CardHeader>
          <CardContent>
            {hasAssessmentData && userDomainScores ? (
              <p className="text-muted-foreground text-sm">
                Reflective prompts based on your scores will appear here.
                Your dominant facet appears to be <span className="font-semibold" style={{color: getFacetColorHsl(getDominantFacet(userDomainScores))}}>{getDominantFacet(userDomainScores)}</span>.
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
          {!hasAssessmentData ? (
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
      
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary roygbiv-gradient-underline pb-2">Facet Comparison Tool</CardTitle>
          <CardDescription>Select two profiles to compare their facet scores side-by-side.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="sourceA" className="text-sm font-medium">Compare (Source A):</Label>
              <Select value={selectedSourceAId} onValueChange={setSelectedSourceAId}>
                <SelectTrigger id="sourceA" className="bg-background/50 mt-1">
                  <SelectValue placeholder="Select Profile A" />
                </SelectTrigger>
                <SelectContent>
                  {comparisonProfileOptions.map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sourceB" className="text-sm font-medium">With (Source B):</Label>
              <Select value={selectedSourceBId} onValueChange={setSelectedSourceBId}>
                <SelectTrigger id="sourceB" className="bg-background/50 mt-1">
                  <SelectValue placeholder="Select Profile B" />
                </SelectTrigger>
                <SelectContent>
                  {comparisonProfileOptions.map(opt => (
                    <SelectItem key={opt.id} value={opt.id} disabled={opt.id === selectedSourceAId && opt.id !== 'none' && opt.id !== 'neutral_placeholder'}>{opt.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="sort-difference"
              checked={sortFacetComparisonByDifference}
              onCheckedChange={setSortFacetComparisonByDifference}
            />
            <Label htmlFor="sort-difference" className="text-sm">Sort by largest difference</Label>
          </div>

          <div className="space-y-4">
            {facetComparisonDisplayData.map(({ facetName, facetConfig, scoreA, scoreB }) => (
              <div key={facetName} className="p-4 rounded-md border border-border/30 bg-background/40">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold" style={{ color: getFacetColorHsl(facetName) }}>
                    {facetConfig.name}
                    <span className="text-xs text-muted-foreground font-normal ml-2 italic">({facetConfig.tagline})</span>
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs items-center">
                  <div className="sm:col-span-1">
                    <div className="flex justify-between mb-0.5">
                      <span className="font-medium text-muted-foreground truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">{comparisonProfileA?.title || "Source A"}</span>
                      <span style={{ color: getFacetColorHsl(facetName) }} className="font-semibold">{Math.round(scoreA * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded">
                      <div style={{ width: `${scoreA * 100}%`, backgroundColor: getFacetColorHsl(facetName) }} className="h-3 rounded transition-all"></div>
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                     <div className="flex justify-between mb-0.5">
                      <span className="font-medium text-muted-foreground truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">{comparisonProfileB?.title || "Source B"}</span>
                      <span style={{ color: getFacetColorHsl(facetName) }} className="font-semibold">{Math.round(scoreB * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded">
                      <div style={{ width: `${scoreB * 100}%`, backgroundColor: getFacetColorHsl(facetName) }} className="h-3 rounded transition-all"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!hasAssessmentData && comparisonProfileA?.id === 'latest' && (
            <p className="text-center text-muted-foreground text-sm pt-4">
              Complete the assessment to compare your results with other profiles.
            </p>
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
                        <p className="text-xs text-muted-foreground italic mb-1">{facetConfig.tagline}</p>
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

    </div>
  );
}

// Helper for domain feedback bars
function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: FacetName, score: number, anchorLeft: string, anchorRight: string }) {
  const facetConfig = FACETS[facetName];
  if (!facetConfig) return null; // Safety check
  const colorHsl = getFacetColorHsl(facetName);

  return (
    <div className="mb-4 p-3 rounded-md border border-border/30 bg-background/40">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: colorHsl }}>{facetName}</span>
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

// Ensure Progress component can take indicatorClassName
// This declaration might be better in a global .d.ts file or next to the component itself if it's a common pattern
// For now, keeping it here to satisfy TypeScript in this context.
declare module "@/components/ui/progress" {
  interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    indicatorClassName?: string;
    indicatorStyle?: React.CSSProperties;
  }
}
