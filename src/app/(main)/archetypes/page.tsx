
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetColorHsl } from '@/lib/colors';
import { useToast } from '@/hooks/use-toast';

// Helper Functions
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0]; // Default
  const validScores = scores.filter(s => s && typeof s.score === 'number');
  if (validScores.length === 0) return FACET_NAMES[0];
  return validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev).facetName || FACET_NAMES[0];
};

// Define the 10 specific archetypes to keep
const rawArchetypeData: any[] = [
  {
    "title": "The Rational Skeptic",
    "summary": "Grounded in evidence and logic, the Rational Skeptic seeks truth through reasoned inquiry and is wary of metaphysical speculation.",
    "scores": { "ontology": 0.15, "epistemology": 0.05, "praxeology": 0.80, "axiology": 0.30, "mythology": 0.10, "cosmology": 0.20, "teleology": 0.10 },
    "facetDescriptions": { "ontology": "Sees reality as fundamentally material; trusts in what can be measured.", "epistemology": "Strongly favors empirical observation and skepticism over revelation.", "praxeology": "Prefers structured, hierarchical systems and established authority.", "axiology": "Values personal autonomy and achievement over collective or spiritual ideals.", "mythology": "Views history and experience as linear progress.", "cosmology": "Explains the universe in mechanistic, scientific terms.", "teleology": "Sees purpose as self-determined, existential, and grounded in this life." }
  },
  {
    "name": "The Transcendent Mystic", // Note: Using "name" here as per original data
    "summary": "Sees all of existence as sacred and interconnected, guided by direct spiritual insight.",
    "facetScores": { "ontology": 0.95, "epistemology": 0.9, "praxeology": 0.8, "axiology": 0.95, "mythology": 0.95, "cosmology": 0.95, "teleology": 1.0 },
    "facetDescriptions": { "ontology": "Sees reality as fundamentally ideal or spiritual, rooted in unity or consciousness.", "epistemology": "Gains knowledge through revelation, intuition, or mystical insight.", "praxeology": "Prefers non-hierarchical, contemplative, or surrender-based action.", "axiology": "Values selfless love, devotion, and sacred ideals over individual gain.", "mythology": "Finds resonance in cyclical, mythic, and transpersonal stories.", "cosmology": "Views the universe as holistic and interconnected.", "teleology": "Sees life’s highest purpose in the Divine, transcendence, or unity." }
  },
  {
    "name": "The Postmodern Pluralist",
    "summary": "Holds reality and truth to be perspectival, with value placed on diversity, story, and context.",
    "facetScores": { "ontology": 0.6, "epistemology": 0.7, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.8, "cosmology": 0.6, "teleology": 0.5 },
    "facetDescriptions": { "ontology": "Balances between material and ideal, questioning fixed reality. Reality is constructed, not fixed.", "epistemology": "Explores both empirical and revelatory ways of knowing. Knowledge is contextual.", "praxeology": "Resists rigid hierarchy; favors flexible, individual action. Critical, open-ended.", "axiology": "Values personal meaning and creative expression. Values diversity, pluralism.", "mythology": "Draws from diverse stories, often in cyclical or disrupted form. Deconstructs grand narratives.", "cosmology": "Views cosmos as open, uncertain, and in flux. Rejects fixed cosmic order.", "teleology": "Sees purpose as existential, chosen, and ambiguous. Purpose is provisional or ironic." }
  },
  {
    "name": "The Scientific Humanist",
    "summary": "Grounded in rational ethics, scientific method, and belief in human progress.",
    "facetScores": { "ontology": 0.1, "epistemology": 0.2, "praxeology": 0.4, "axiology": 0.6, "mythology": 0.4, "cosmology": 0.5, "teleology": 0.6 },
    "facetDescriptions": { "ontology": "Leans materialist, seeing people and relationships as the core of reality.", "epistemology": "Values evidence, critical thinking, and reasoned dialogue.", "praxeology": "Prefers systems that are merit-based but support collective good.", "axiology": "Blends individual dignity with social compassion and justice.", "mythology": "Draws meaning from human stories and cultural narratives.", "cosmology": "Views the universe as understandable and shaped by human inquiry.", "teleology": "Sees meaning as constructed, existential, and rooted in this world." }
  },
  {
    "name": "The Archetypal Traditionalist",
    "summary": "Upholds sacred order, divine authority, and moral duty rooted in religious tradition.",
    "facetScores": { "ontology": 0.4, "epistemology": 0.3, "praxeology": 0.5, "axiology": 0.75, "mythology": 0.9, "cosmology": 0.8, "teleology": 0.9 },
    "facetDescriptions": { "ontology": "Reality is ordered by tradition and divine principles.", "epistemology": "Knowledge comes from sacred texts and lineage.", "praxeology": "Action is guided by established duties and rituals.", "axiology": "Values heritage, obedience, and communal harmony.", "mythology": "Upholds foundational myths and religious narratives.", "cosmology": "Universe is seen as divinely structured and meaningful.", "teleology": "Purpose is to live according to divine law and tradition." }
  },
  {
    "name": "The Earth-Centered Animist",
    "summary": "Views the world as alive, reciprocal, and sacred; values ecological harmony and ancestral continuity.",
    "facetScores": { "ontology": 0.9, "epistemology": 0.8, "praxeology": 0.7, "axiology": 0.85, "mythology": 0.85, "cosmology": 0.9, "teleology": 0.85 },
    "facetDescriptions": { "ontology": "Sees reality as inherently alive, relational, and animated by spirit.", "epistemology": "Balances observation with revelatory ways of knowing (dream, vision).", "praxeology": "Values egalitarian, reciprocal, and collective practices.", "axiology": "Prioritizes interdependence, respect, and stewardship.", "mythology": "Meaning is found in cyclical, living, and place-based stories.", "cosmology": "Views cosmos as holistic and animate.", "teleology": "Purpose is to participate in the living web of existence." }
  },
  {
    "name": "The Existential Individualist",
    "summary": "Asserts self-determined meaning, embraces uncertainty, and rejects cosmic absolutes.",
    "facetScores": { "ontology": 0.3, "epistemology": 0.4, "praxeology": 0.6, "axiology": 0.5, "mythology": 0.4, "cosmology": 0.3, "teleology": 0.2 },
    "facetDescriptions": { "ontology": "Materialist and existential; reality is brute fact, not essence.", "epistemology": "Leans empirical; values personal experience over dogma.", "praxeology": "Emphasizes individual freedom, authenticity, and responsibility.", "axiology": "Values subjective meaning, authenticity, and self-definition.", "mythology": "Skeptical of traditional myths; embraces existential narrative.", "cosmology": "Mechanistic and indifferent; cosmos lacks intrinsic order.", "teleology": "Existential; meaning and purpose are self-created." }
  },
  {
    "title": "The Integral Synthesizer", // Using "title" to match previous entry
    "summary": "Bridges and integrates diverse perspectives, holding paradox and complexity as necessary for a whole worldview.",
    "scores": { "ontology": 0.55, "epistemology": 0.50, "praxeology": 0.50, "axiology": 0.55, "mythology": 0.55, "cosmology": 0.55, "teleology": 0.55 },
    "facetDescriptions": { "ontology": "Holds reality as a balance of material and ideal; integrates multiple layers.", "epistemology": "Values both empirical and revelatory sources; open to complexity.", "praxeology": "Balances respect for authority with egalitarian participation.", "axiology": "Blends personal and collective values for a humanistic ethic.", "mythology": "Sees meaning as cyclical and evolving, embracing stories from many sources.", "cosmology": "Perceives the cosmos as both holistic and open to scientific understanding.", "teleology": "Purpose is found in harmonizing self and world, with openness to mystery." }
  },
  {
    "name": "The Stoic Rationalist",
    "summary": "Sees life as ordered by reason and fate, values virtue, and emphasizes inner discipline.",
    "facetScores": { "ontology": 0.4, "epistemology": 0.5, "praxeology": 0.8, "axiology": 0.75, "mythology": 0.6, "cosmology": 0.6, "teleology": 0.7 },
    "facetDescriptions": { "ontology": "Materialist or dualist; reason is part of nature.", "epistemology": "Reasoned reflection; self-examination.", "praxeology": "Virtuous action, self-control, resilience.", "axiology": "Values wisdom, virtue, equanimity.", "mythology": "Draws from Greco-Roman myths for exemplars.", "cosmology": "Universe as rational, ordered whole.", "teleology": "Purpose is to live in harmony with nature and reason." }
  },
  {
    "name": "The Contemplative Realist",
    "summary": "Grounded in realism but open to mystery, this archetype values awareness, modesty, and interior clarity.",
    "facetScores": { "ontology": 0.5, "epistemology": 0.6, "praxeology": 0.5, "axiology": 0.7, "mythology": 0.5, "cosmology": 0.5, "teleology": 0.6 },
    "facetDescriptions": { "ontology": "Reality is what is, but also includes subjective depth.", "epistemology": "Balances empirical observation with introspective awareness.", "praxeology": "Acts mindfully and with consideration for nuance.", "axiology": "Values clarity, peace, and authentic understanding.", "mythology": "Interprets myths for psychological or spiritual insight.", "cosmology": "Universe is real, and our perception of it matters.", "teleology": "Purpose is found in awareness and living authentically." }
  }
];

// Helper function to ensure consistent `CodexEntry` structure for archetypes
const mapRawArchetypeToCodexEntry = (raw: any): CodexEntry => {
  const titleToUse = raw.title || raw.name;

  if (!titleToUse || typeof titleToUse !== 'string') {
    return {
        id: `invalid-archetype-${Date.now()}`,
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
    const scoreSource = raw.scores || raw.facetScores;
    let score = 0.5;
    if (scoreSource && typeof scoreSource === 'object') {
        const rawScore = scoreSource[facetKey.toLowerCase() as keyof typeof scoreSource] ?? scoreSource[facetKey as keyof typeof scoreSource];
        if (typeof rawScore === 'number') {
            score = Math.max(0, Math.min(1, Number(rawScore)));
        }
    }
    return { facetName: facetKey, score };
  });

  const facetSummariesSource = raw.facetDescriptions || raw.facetSummaries;
  const processedFacetSummaries: { [K_FacetName in FacetName]?: string } = {};
  if (facetSummariesSource && typeof facetSummariesSource === 'object') {
    for (const facetKey of FACET_NAMES) {
      const summary = facetSummariesSource[facetKey.toLowerCase() as keyof typeof facetSummariesSource] ?? facetSummariesSource[facetKey as keyof typeof facetSummariesSource];
      if (typeof summary === 'string') {
        processedFacetSummaries[facetKey] = summary;
      } else {
        processedFacetSummaries[facetKey] = `Details for ${facetKey} not available for ${titleToUse}.`;
      }
    }
  } else {
    FACET_NAMES.forEach(name => {
        processedFacetSummaries[name] = `Details for ${name} not available for ${titleToUse}.`;
    });
  }

  return {
    id: titleToUse.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, ''),
    title: titleToUse,
    summary: raw.summary || "No summary available.",
    domainScores: domainScoresArray,
    facetSummaries: processedFacetSummaries,
    category: "archetypal",
    isArchetype: true,
    createdAt: raw.createdAt || new Date().toISOString(),
    tags: raw.tags || [titleToUse.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '')],
  };
};

const dummyArchetypes: CodexEntry[] = rawArchetypeData
  .filter(item => item && (item.name || item.title)) // Ensure item and name/title exist
  .map(mapRawArchetypeToCodexEntry);

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


export default function ArchetypesPage() {
  const { domainScores: userDomainScores, addSavedWorldview, savedWorldviews } = useWorldview();
  const [selectedArchetype, setSelectedArchetype] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();

  const { closestArchetype, highestSimilarity } = useMemo(() => {
    let closest: CodexEntry | null = null;
    let highestSim = 0;

    if (userDomainScores && userDomainScores.length > 0 && Array.isArray(dummyArchetypes)) {
      for (const archetype of dummyArchetypes) {
        if (!archetype || !archetype.domainScores) continue;
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

  const handleSaveArchetype = (archetypeToSave: CodexEntry) => {
    if (!archetypeToSave) return;
    const isAlreadySaved = savedWorldviews.some(p => p.id === archetypeToSave.id);
    if (isAlreadySaved) {
      toast({ title: "Already Saved", description: `"${archetypeToSave.title}" is already in your library.` });
      return;
    }
    addSavedWorldview(archetypeToSave);
    toast({ title: "Saved to Library", description: `"${archetypeToSave.title}" has been added to your saved worldviews.` });
  };

  const ArchetypeCard = ({ archetype }: { archetype: CodexEntry }) => {
    if (!archetype || !archetype.title || !archetype.domainScores) {
      return null;
    }
    const dominantFacet = getDominantFacet(archetype.domainScores);
    const titleColor = getFacetColorHsl(dominantFacet);

    return (
      <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300 h-full">
        <CardHeader>
          <CardTitle className="text-xl" style={{ color: titleColor }}>{archetype.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-xs">{archetype.summary}</CardDescription>
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
          {dummyArchetypes.map((archetype) => {
            if (!archetype || !archetype.id) return null;
            return <ArchetypeCard key={archetype.id} archetype={archetype} />;
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icons.users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No archetypes available at the moment.</p>
          <p className="text-sm text-muted-foreground">Check back later for new profiles!</p>
        </div>
      )}

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
                  </div>
                </SheetHeader>
                
                <div className="mb-6 flex justify-center">
                 <TriangleChart scores={selectedArchetype.domainScores} width={250} height={217} className="mx-auto !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
                </div>

                <div className="mb-4 space-y-2 border-t border-border/30 pt-4">
                  <Button
                    variant={savedWorldviews.some(p => p.id === selectedArchetype.id) ? "default" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleSaveArchetype(selectedArchetype)}
                    disabled={savedWorldviews.some(p => p.id === selectedArchetype.id)}
                  >
                    {savedWorldviews.some(p => p.id === selectedArchetype.id) ? <Icons.check className="mr-1 h-3 w-3" /> : <Icons.saved className="mr-1 h-3 w-3" />}
                    {savedWorldviews.some(p => p.id === selectedArchetype.id) ? "Saved to Library" : "Save to Library"}
                  </Button>
                </div>

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
                        <p className="text-xs text-muted-foreground italic mb-1">{facetConfig?.tagline || "..."}</p>
                        <p className="text-sm text-muted-foreground">{facetSummary}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mb-4 space-y-2 border-t border-border/30 pt-4">
                  <Button
                    variant={savedWorldviews.some(p => p.id === selectedArchetype.id) ? "default" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleSaveArchetype(selectedArchetype)}
                    disabled={savedWorldviews.some(p => p.id === selectedArchetype.id)}
                  >
                    {savedWorldviews.some(p => p.id === selectedArchetype.id) ? <Icons.check className="mr-1 h-3 w-3" /> : <Icons.saved className="mr-1 h-3 w-3" />}
                    {savedWorldviews.some(p => p.id === selectedArchetype.id) ? "Saved to Library" : "Save to Library"}
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

