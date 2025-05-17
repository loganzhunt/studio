
"use client";

import { useState, useMemo } from 'react';
import { TriangleChart } from "@/components/visualization/TriangleChart"; // Updated import
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { CodexEntry, FacetName, DomainScore } from "@/types"; // CodexEntry can represent an Archetype too
import { FACETS, FACET_NAMES } from "@/config/facets";
import Link from "next/link";
import { useWorldview } from "@/hooks/use-worldview";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetColorHsl } from '@/lib/colors'; // For coloring titles and labels

// --- Helper Functions (can be moved to a lib if used elsewhere) ---
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0]; // Default
  return scores.reduce((prev, current) => (prev.score > current.score) ? prev : current).facetName || FACET_NAMES[0];
};

// Dummy data for Archetypes - ensure it matches CodexEntry structure for consistency
// Added facetSummaries (optional) and tags for better drawer display
const dummyArchetypes: CodexEntry[] = [
  {
    id: "the_sage",
    title: "The Sage",
    summary: "Represents wisdom, knowledge, and truth. The Sage seeks understanding and enlightenment through introspection and learning.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === "Epistemology" ? 0.9 : (name === "Ontology" ? 0.8 : Math.random() * 0.5 + 0.2) })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
    tags: ["wisdom", "knowledge", "truth"],
    facetSummaries: FACET_NAMES.reduce((acc, name) => {
      acc[name] = `The Sage's approach to ${name.toLowerCase()} emphasizes deep understanding and rational inquiry.`;
      if (name === "Epistemology") acc[name] = "Knowledge is pursued through rigorous study and reflection.";
      if (name === "Ontology") acc[name] = "Reality is understood through layers of meaning and insight.";
      return acc;
    }, {} as Record<FacetName, string>),
  },
  {
    id: "the_explorer",
    title: "The Explorer",
    summary: "Embodies freedom, adventure, and discovery. The Explorer seeks new experiences and pushes boundaries to find authenticity.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === "Praxeology" ? 0.85 : (name === "Cosmology" ? 0.75 : Math.random() * 0.5 + 0.2) })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
    tags: ["freedom", "adventure", "discovery"],
    facetSummaries: FACET_NAMES.reduce((acc, name) => {
      acc[name] = `The Explorer engages ${name.toLowerCase()} with a spirit of curiosity and boundary-pushing.`;
      if (name === "Praxeology") acc[name] = "Action is driven by the pursuit of new horizons and experiences.";
      if (name === "Cosmology") acc[name] = "The universe is a vast territory waiting to be charted and understood.";
      return acc;
    }, {} as Record<FacetName, string>),
  },
  {
    id: "the_lover",
    title: "The Lover",
    summary: "Represents connection, intimacy, and passion. The Lover seeks harmony in relationships and appreciates beauty and sensuality.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === "Axiology" ? 0.9 : (name === "Mythology" ? 0.8 : Math.random() * 0.5 + 0.2) })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
    tags: ["connection", "intimacy", "passion"],
    facetSummaries: FACET_NAMES.reduce((acc, name) => {
      acc[name] = `The Lover values ${name.toLowerCase()} through connection, empathy, and aesthetic appreciation.`;
      if (name === "Axiology") acc[name] = "The highest values are found in love, beauty, and harmonious relationships.";
      if (name === "Mythology") acc[name] = "Stories of deep connection and union resonate with the Lover archetype.";
      return acc;
    }, {} as Record<FacetName, string>),
  },
   {
    id: "the_creator",
    title: "The Creator",
    summary: "Driven by imagination and the desire to innovate. The Creator seeks to bring something new into existence and values self-expression.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === "Mythology" ? 0.88 : (name === "Teleology" ? 0.78 : Math.random() * 0.5 + 0.2) })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
    tags: ["imagination", "innovation", "expression"],
    facetSummaries: FACET_NAMES.reduce((acc, name) => {
      acc[name] = `The Creator manifests new forms and ideas within the realm of ${name.toLowerCase()}.`;
      if (name === "Mythology") acc[name] = "New narratives and symbolic forms are brought forth through creative acts.";
      if (name === "Teleology") acc[name] = "Purpose is found in the act of creation and leaving a unique mark on the world.";
      return acc;
    }, {} as Record<FacetName, string>),
  }
];

// Placeholder for similarity calculation
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

  return (dotProduct / (userMagnitude * archetypeMagnitude)) * 100;
};


export default function ArchetypesPage() {
  const { domainScores: userDomainScores } = useWorldview();
  const [selectedArchetype, setSelectedArchetype] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { closestArchetype, highestSimilarity } = useMemo(() => {
    let closest: CodexEntry | null = null;
    let highestSim = 0;

    if (userDomainScores && userDomainScores.length > 0) {
      for (const archetype of dummyArchetypes) {
        const similarity = calculateSimilarity(userDomainScores, archetype.domainScores);
        if (similarity > highestSim) {
          highestSim = similarity;
          closest = archetype;
        }
      }
    }
    return { closestArchetype: closest, highestSimilarity: highestSim };
  }, [userDomainScores]);

  const handleOpenDrawer = (archetype: CodexEntry) => {
    setSelectedArchetype(archetype);
    setIsDrawerOpen(true);
  };

  // ArchetypeCard component defined inside ArchetypesPage
  const ArchetypeCard = ({ archetype }: { archetype: CodexEntry }) => {
    const dominantFacet = getDominantFacet(archetype.domainScores);
    const titleColor = getFacetColorHsl(dominantFacet);
    
    return (
      <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300 h-full">
        <CardHeader>
          <CardTitle className="text-xl" style={{ color: titleColor }}>{archetype.title}</CardTitle>
          <CardDescription className="h-16 line-clamp-3 text-xs">{archetype.summary}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center items-center">
          <TriangleChart scores={archetype.domainScores} width={180} height={156} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none mb-3" />
        </CardContent>
        <CardFooter className="p-4 border-t border-border/30 mt-auto">
          <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenDrawer(archetype)}>
            View Details <Icons.chevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Archetypes</h1>
        <p className="text-xl text-muted-foreground">
          Explore predefined symbolic profiles and see how your worldview aligns.
        </p>
      </header>

      {closestArchetype && userDomainScores && userDomainScores.length > 0 && (
        <Card className="mb-12 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">Your Closest Archetype Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Your Signature</h3>
                <TriangleChart scores={userDomainScores} width={200} height={173} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
              </div>
              <div className="flex flex-col items-center text-center">
                <Icons.sparkles className="w-10 h-10 text-primary mb-2" />
                <p className="text-2xl font-bold text-primary">{Math.round(highestSimilarity)}%</p>
                <p className="text-muted-foreground">Exploratory Alignment</p>
                {/* <Button variant="link" size="sm" className="mt-2">How is this calculated?</Button> */}
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">{closestArchetype.title}</h3>
                 <TriangleChart scores={closestArchetype.domainScores} width={200} height={173} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h4 className="text-xl font-semibold">{closestArchetype.title}</h4>
              <p className="text-muted-foreground max-w-md mx-auto">{closestArchetype.summary}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => handleOpenDrawer(closestArchetype)}>
                Explore {closestArchetype.title} Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="text-3xl font-semibold mb-6 text-center">Browse Archetypal Profiles</h2>
      {dummyArchetypes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dummyArchetypes.map((archetype) => (
            <ArchetypeCard key={archetype.id} archetype={archetype} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icons.users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No archetypes available at the moment.</p>
          <p className="text-sm text-muted-foreground">Check back later for new profiles!</p>
        </div>
      )}

      {/* Details Drawer */}
      {selectedArchetype && (
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl" side="right">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SheetHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <SheetTitle className="text-3xl mb-1" style={{color: getFacetColorHsl(getDominantFacet(selectedArchetype.domainScores))}}>
                        {selectedArchetype.title}
                      </SheetTitle>
                      <SheetDescription className="text-base capitalize">{selectedArchetype.category} Profile</SheetDescription>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Icons.close className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                
                <p className="mb-6 text-muted-foreground leading-relaxed">{selectedArchetype.summary}</p>

                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border/30 pb-2">Facet Breakdown</h3>
                  {FACET_NAMES.map(facetName => {
                    const scoreObj = selectedArchetype.domainScores.find(ds => ds.facetName === facetName);
                    const score = scoreObj ? scoreObj.score : 0;
                    const facetSummary = selectedArchetype.facetSummaries?.[facetName] || `Insights into how ${selectedArchetype.title} relates to ${facetName.toLowerCase()}...`;
                    
                    return (
                      <div key={facetName} className="p-4 rounded-md border border-border/30 bg-background/40">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-lg font-semibold" style={{color: getFacetColorHsl(facetName)}}>
                            {facetName}
                          </h4>
                          <span className="text-sm font-bold" style={{color: getFacetColorHsl(facetName)}}>{Math.round(score * 100)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic mb-1">{FACETS[facetName].tagline}</p>
                        <p className="text-sm text-muted-foreground">{facetSummary}</p>
                      </div>
                    );
                  })}
                </div>
                
                {/* Archetypes might not have a unique deep-dive page like codex entries, so this link can be conditional or removed */}
                {/* <Button variant="link" asChild className="p-0 text-primary">
                  <Link href={`/codex/${selectedArchetype.id}`}> 
                    View Full Deep-Dive (if applicable) <Icons.chevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button> */}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}


    