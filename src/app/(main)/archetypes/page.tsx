
"use client";

import { useState, useMemo } from 'react';
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { CodexEntry, FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import Link from "next/link";
import { useWorldview } from "@/hooks/use-worldview";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetColorHsl } from '@/lib/colors';
import { Badge } from '@/components/ui/badge';

// --- Helper Functions (can be moved to a lib if used elsewhere) ---
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0]; // Default
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
  }
];

const mapRawArchetypeToCodexEntry = (raw: any): CodexEntry => {
  const domainScoresArray: DomainScore[] = FACET_NAMES.map(facetKey => {
    const score = (raw.facetScores && typeof raw.facetScores === 'object' && typeof raw.facetScores[facetKey.toLowerCase()] === 'number')
      ? raw.facetScores[facetKey.toLowerCase()]
      : 0.5; // Default score
    return { facetName: facetKey, score: Math.max(0, Math.min(1, Number(score))) };
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
    summary: raw.summary,
    domainScores: domainScoresArray,
    facetSummaries: processedFacetSummaries,
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
    tags: [raw.name.toLowerCase().replace(/\s+/g, '_'), "archetype"],
  };
};

const dummyArchetypes: CodexEntry[] = rawArchetypeData.map(mapRawArchetypeToCodexEntry);


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
           {archetype.tags && archetype.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {archetype.tags.slice(0, 2).map(tag => ( // Show max 2 tags
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
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
                    const facetConfig = FACETS[facetName];
                    const facetSummary = selectedArchetype.facetSummaries?.[facetName] || `Insights into how ${selectedArchetype.title} relates to ${facetName.toLowerCase()}...`;
                    
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
