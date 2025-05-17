
"use client";

import { useState, useMemo } from 'react';
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import type { CodexEntry, FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';

const rawCodexData = [
  {
    "name": "Platonism",
    "summary": "A philosophical tradition centered on transcendent forms and the pursuit of the Good. Emphasizes reason, idealism, and the distinction between appearances and true reality.",
    "domainScores": {
      "Ontology": 0.85, "Epistemology": 0.9, "Praxeology": 0.55, "Axiology": 0.85, "Mythology": 0.7, "Cosmology": 0.8, "Teleology": 0.8
    },
    "facetSummary": {
      "Ontology": "Reality is ultimately composed of ideal Forms.", "Epistemology": "True knowledge is apprehended through reason.", "Praxeology": "Right action aligns with the Form of the Good.", "Axiology": "The Good is the supreme value.", "Mythology": "Uses allegory and myth for teaching.", "Cosmology": "The cosmos reflects perfect order.", "Teleology": "Life’s purpose is to ascend toward the Good."
    },
    "tags": ["philosophical", "idealism", "classical"]
  },
  {
    "name": "Aristotelianism",
    "summary": "A naturalist and teleological philosophy grounded in empirical observation, virtue ethics, and the inherent order of nature.",
    "domainScores": {
      "Ontology": 0.75, "Epistemology": 0.75, "Praxeology": 0.8, "Axiology": 0.7, "Mythology": 0.3, "Cosmology": 0.75, "Teleology": 0.85
    },
    "facetSummary": {
      "Ontology": "Reality is substance and form.", "Epistemology": "Knowledge is gained through empirical study.", "Praxeology": "Ethical action fulfills one’s purpose.", "Axiology": "Virtue is cultivated by habit.", "Mythology": "Limited use of myth.", "Cosmology": "Nature has intrinsic order.", "Teleology": "Everything has a natural end."
    },
    "tags": ["philosophical", "naturalism", "classical"]
  },
  {
    "name": "Stoicism",
    "summary": "A philosophy of rational resilience and self-mastery, emphasizing the cultivation of virtue and acceptance of nature.",
    "domainScores": {
      "Ontology": 0.65, "Epistemology": 0.7, "Praxeology": 0.9, "Axiology": 0.85, "Mythology": 0.4, "Cosmology": 0.7, "Teleology": 0.7
    },
    "facetSummary": {
      "Ontology": "Reality is rational and ordered.", "Epistemology": "Truth is discerned through reason.", "Praxeology": "Act in accordance with nature.", "Axiology": "Virtue is the highest good.", "Mythology": "Myth used for ethical teaching.", "Cosmology": "The cosmos is governed by Logos.", "Teleology": "Purpose is acceptance of fate."
    },
    "tags": ["philosophical", "ethics", "resilience"]
  },
  {
    "name": "Taoism",
    "summary": "A spiritual tradition rooted in the Tao, the ineffable source of all. Emphasizes harmony, non-action, and flowing with nature.",
    "domainScores": {
      "Ontology": 0.65, "Epistemology": 0.7, "Praxeology": 0.55, "Axiology": 0.8, "Mythology": 0.75, "Cosmology": 0.8, "Teleology": 0.65
    },
    "facetSummary": {
      "Ontology": "Ultimate reality is the Tao.", "Epistemology": "Wisdom arises from attunement, not analysis.", "Praxeology": "Wu wei (non-action) and flexibility.", "Axiology": "Harmony is the supreme value.", "Mythology": "Rich in cosmological myth and parable.", "Cosmology": "Cosmos flows as a spontaneous order.", "Teleology": "Purpose is spontaneous unfolding."
    },
    "tags": ["spiritual", "eastern", "nature"]
  },
  {
    "name": "Scientific Materialism",
    "summary": "A worldview grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    "domainScores": {
      "Ontology": 0.95, "Epistemology": 0.9, "Praxeology": 0.6, "Axiology": 0.6, "Mythology": 0.15, "Cosmology": 0.85, "Teleology": 0.2
    },
    "facetSummary": {
      "Ontology": "Only physical matter truly exists.", "Epistemology": "Knowledge is gained through observation and experiment.", "Praxeology": "Actions should be evidence-based.", "Axiology": "Value arises from outcomes and utility.", "Mythology": "Skeptical of myth and legend.", "Cosmology": "The universe is physical and governed by laws.", "Teleology": "No inherent purpose beyond survival."
    },
    "tags": ["scientific", "empirical", "modern"]
  },
  {
    "name": "Christianity",
    "summary": "A monotheistic religious tradition centered on Jesus Christ, emphasizing love, redemption, and eternal purpose.",
    "domainScores": {
      "Ontology": 0.8, "Epistemology": 0.65, "Praxeology": 0.8, "Axiology": 0.95, "Mythology": 0.85, "Cosmology": 0.85, "Teleology": 0.95
    },
    "facetSummary": {
      "Ontology": "God is the ultimate reality.", "Epistemology": "Faith and revelation as sources of truth.", "Praxeology": "Live according to Christ’s example.", "Axiology": "Love and redemption are central values.", "Mythology": "Scripture rich in myth and symbol.", "Cosmology": "Creation is divinely ordered.", "Teleology": "Life’s purpose is communion with God."
    },
    "tags": ["religious", "monotheistic", "western"]
  },
  {
    "name": "Buddhism",
    "summary": "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering through the Eightfold Path.",
    "domainScores": {
      "Ontology": 0.4, "Epistemology": 0.8, "Praxeology": 0.9, "Axiology": 0.75, "Mythology": 0.7, "Cosmology": 0.7, "Teleology": 0.85
    },
    "facetSummary": {
      "Ontology": "All phenomena are impermanent and interdependent.", "Epistemology": "Direct experience and insight.", "Praxeology": "Ethical conduct and meditation.", "Axiology": "Compassion and wisdom are highest values.", "Mythology": "Buddhist cosmology and Jataka tales.", "Cosmology": "Cyclic universes, realms, and karma.", "Teleology": "Purpose is liberation from suffering."
    },
    "tags": ["spiritual", "eastern", "awakening"]
  },
  {
    "name": "Existentialism",
    "summary": "A modern philosophy focusing on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    "domainScores": {
      "Ontology": 0.5, "Epistemology": 0.6, "Praxeology": 0.8, "Axiology": 0.65, "Mythology": 0.25, "Cosmology": 0.4, "Teleology": 0.6
    },
    "facetSummary": {
      "Ontology": "Reality is ambiguous and contingent.", "Epistemology": "Truth emerges from subjective experience.", "Praxeology": "Authentic action defines existence.", "Axiology": "Value is self-created.", "Mythology": "Rejects inherited myth; values story.", "Cosmology": "The universe is indifferent.", "Teleology": "Purpose is made, not given."
    },
    "tags": ["philosophical", "modern", "authenticity"]
  },
  {
    "name": "Mystical Sufism",
    "summary": "A mystical Islamic tradition seeking direct experience of the Divine through love, devotion, and spiritual practice.",
    "domainScores": {
      "Ontology": 0.75, "Epistemology": 0.75, "Praxeology": 0.8, "Axiology": 0.85, "Mythology": 0.8, "Cosmology": 0.7, "Teleology": 0.95
    },
    "facetSummary": {
      "Ontology": "God is immanent and transcendent.", "Epistemology": "Inner knowing (gnosis) and revelation.", "Praxeology": "Love and devotion as practice.", "Axiology": "Union with God is the highest value.", "Mythology": "Sufi poetry and parables.", "Cosmology": "Creation as reflection of the Divine.", "Teleology": "Purpose is return to the Beloved."
    },
    "tags": ["mystical", "islamic", "spiritual"]
  },
  {
    "name": "Animism",
    "summary": "A worldview that sees spirit or consciousness as present in all beings, places, and phenomena. Emphasizes relationship and reciprocity.",
    "domainScores": {
      "Ontology": 0.8, "Epistemology": 0.6, "Praxeology": 0.7, "Axiology": 0.7, "Mythology": 0.9, "Cosmology": 0.75, "Teleology": 0.6
    },
    "facetSummary": {
      "Ontology": "All things possess spirit.", "Epistemology": "Knowledge is relational and experiential.", "Praxeology": "Reciprocity with the more-than-human world.", "Axiology": "Balance and respect are highest values.", "Mythology": "Stories of spirits, ancestors, and place.", "Cosmology": "The world is alive and interconnected.", "Teleology": "Purpose is right relationship."
    },
    "tags": ["indigenous", "spiritual", "nature"]
  },
  // Adding some of the original dummy archetypes for variety, formatted to new structure
  {
    "name": "The Sage Archetype",
    "summary": "Represents wisdom, knowledge, and truth. The Sage seeks understanding and enlightenment through introspection and learning.",
    "domainScores": FACET_NAMES.reduce((acc, name) => {
        acc[name] = name === "Epistemology" ? 0.9 : (name === "Ontology" ? 0.8 : Math.random() * 0.5 + 0.2);
        return acc;
    }, {} as Record<FacetName, number>),
    "facetSummary": FACET_NAMES.reduce((acc, name) => {
        acc[name] = `The Sage's approach to ${name.toLowerCase()} emphasizes deep understanding.`;
        return acc;
    }, {} as Record<FacetName, string>),
    "tags": ["archetypal", "wisdom", "knowledge"]
  },
  {
    "name": "The Hero Archetype",
    "summary": "Represents the drive for mastery and competence. The Hero strives to prove their worth through courageous acts.",
     "domainScores": FACET_NAMES.reduce((acc, name) => {
        acc[name] = name === "Praxeology" ? 0.9 : (name === "Teleology" ? 0.8 : Math.random() * 0.5 + 0.2);
        return acc;
    }, {} as Record<FacetName, number>),
    "facetSummary": FACET_NAMES.reduce((acc, name) => {
        acc[name] = `The Hero's path in ${name.toLowerCase()} involves decisive action and overcoming challenges.`;
        return acc;
    }, {} as Record<FacetName, string>),
    "tags": ["archetypal", "courage", "strength", "mastery"]
  }
];

const mapRawDataToCodexEntries = (rawData: any[]): CodexEntry[] => {
  return rawData.map(item => {
    const domainScoresArray: DomainScore[] = FACET_NAMES.map(facetName => ({
      facetName,
      score: item.domainScores[facetName] !== undefined ? item.domainScores[facetName] : 0.5 // Default score if missing
    }));

    let category: CodexEntry['category'] = "custom";
    if (item.tags && item.tags.length > 0) {
        if (item.tags.includes("philosophical")) category = "philosophical";
        else if (item.tags.includes("religious")) category = "religious";
        else if (item.tags.includes("archetypal")) category = "archetypal";
        else if (item.tags.includes("spiritual") && category === "custom") category = "philosophical"; // Many spiritual can be philosophical
    }
    
    return {
      id: item.name.toLowerCase().replace(/\s+/g, '_'),
      title: item.name,
      summary: item.summary,
      domainScores: domainScoresArray,
      facetSummaries: item.facetSummary,
      category,
      tags: item.tags,
      isArchetype: item.tags?.includes("archetypal") || false,
      createdAt: new Date().toISOString(),
    };
  });
};

const dummyCodexEntries: CodexEntry[] = mapRawDataToCodexEntries(rawCodexData);


function CodexCard({ entry, onOpenDrawer }: { entry: CodexEntry; onOpenDrawer: (entry: CodexEntry) => void }) {
  const dominantScoreEntry = entry.domainScores.length > 0 
    ? entry.domainScores.reduce((max, current) => current.score > max.score ? current : max, entry.domainScores[0])
    : { facetName: FACET_NAMES[0], score: 0 }; 
  
  const dominantFacetConfig = FACETS[dominantScoreEntry.facetName];
  const titleColorStyle = dominantFacetConfig ? { color: `hsl(var(${dominantFacetConfig.colorVariable.slice(2)}))` } : {};
  
  return (
    <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl" style={titleColorStyle}>{entry.title}</CardTitle>
        <CardDescription className="h-16 line-clamp-3">{entry.summary}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="mb-4 flex justify-center">
         <TriangleChart scores={entry.domainScores} width={180} height={156} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
        </div>
        {entry.tags && entry.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {entry.tags.slice(0,3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
              ))}
            </div>
          )}
      </CardContent>
      <CardFooter className="border-t border-border/30 pt-4 mt-auto">
        <Button variant="outline" size="sm" className="w-full" onClick={() => onOpenDrawer(entry)}>
          Facet Details <Icons.chevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function CodexPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [activeCategory, setActiveCategory] = useState<"All" | "philosophical" | "religious" | "archetypal" | "custom">('All');
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = (entry: CodexEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  const filteredAndSortedEntries = useMemo(() => {
    let entries = [...dummyCodexEntries]; 

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      entries = entries.filter(entry =>
        entry.title.toLowerCase().includes(lowerSearchTerm) ||
        entry.summary.toLowerCase().includes(lowerSearchTerm) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (activeCategory !== 'All') {
      entries = entries.filter(entry => entry.category === activeCategory);
    }

    if (sortBy === 'az') {
      entries.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      entries.sort((a,b) => (a.category || "").localeCompare(b.category || "") || a.title.localeCompare(b.title));
    } else if (sortBy === 'dominant_facet') {
      entries.sort((a, b) => {
        const aDominant = a.domainScores.length > 0 ? a.domainScores.reduce((max, curr) => curr.score > max.score ? curr : max).facetName : "";
        const bDominant = b.domainScores.length > 0 ? b.domainScores.reduce((max, curr) => curr.score > max.score ? curr : max).facetName : "";
        return aDominant.localeCompare(bDominant) || a.title.localeCompare(b.title);
      });
    }
    return entries;
  }, [searchTerm, sortBy, activeCategory]);

  const sheetTitleStyle = useMemo(() => {
    if (!selectedEntry || selectedEntry.domainScores.length === 0) return {};
    const dominantScoreEntry = selectedEntry.domainScores.reduce((max, current) => current.score > max.score ? current : max, selectedEntry.domainScores[0]);
    const dominantFacetConfig = FACETS[dominantScoreEntry.facetName];
    return dominantFacetConfig ? { color: `hsl(var(${dominantFacetConfig.colorVariable.slice(2)}))` } : {};
  }, [selectedEntry]);

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">The Codex</h1>
        <p className="text-xl text-muted-foreground">
          Explore a library of worldviews, philosophies, and archetypal patterns.
        </p>
      </header>

      <Card className="mb-8 p-6 glassmorphic-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Label htmlFor="search-codex" className="block text-sm font-medium mb-1">Search Codex</Label>
            <Input 
              id="search-codex" 
              placeholder="Search by keyword, title, or tag..." 
              className="bg-background/50" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sort-codex" className="block text-sm font-medium mb-1">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-codex" className="bg-background/50">
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="az">Alphabetical (A-Z)</SelectItem>
                <SelectItem value="dominant_facet">Dominant Facet</SelectItem>
                <SelectItem value="category">Tradition Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant={activeCategory === 'All' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveCategory('All')}><Icons.filter className="mr-1.5 h-4 w-4"/>All</Button>
          <Button variant={activeCategory === 'philosophical' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveCategory('philosophical')}>Philosophical</Button>
          <Button variant={activeCategory === 'religious' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveCategory('religious')}>Religious</Button>
          <Button variant={activeCategory === 'archetypal' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveCategory('archetypal')}>Archetypal</Button>
          <Button variant={activeCategory === 'custom' ? 'secondary' : 'ghost'} size="sm" onClick={() => setActiveCategory('custom')}>Custom</Button>
        </div>
      </Card>

      {filteredAndSortedEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedEntries.map((entry) => (
            <CodexCard key={entry.id} entry={entry} onOpenDrawer={handleOpenDrawer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icons.search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No entries match your criteria.</p>
        </div>
      )}

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 glassmorphic-card !bg-card/80 !backdrop-blur-xl" side="right">
          <ScrollArea className="h-full">
          {selectedEntry && (
            <>
              <SheetHeader className="p-6 pb-4 border-b border-border/50 sticky top-0 bg-card/80 backdrop-blur-md z-10">
                <SheetTitle className="text-2xl" style={sheetTitleStyle}>{selectedEntry.title}</SheetTitle>
                <SheetDescription className="capitalize">{selectedEntry.category}{selectedEntry.isArchetype ? " Archetype" : ""}</SheetDescription>
                 <SheetClose className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <Icons.close className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
              </SheetHeader>
              <div className="p-6 space-y-4">
                {FACET_NAMES.map(facetName => {
                  const facetConfig = FACETS[facetName];
                  const scoreData = selectedEntry.domainScores.find(ds => ds.facetName === facetName);
                  const score = scoreData ? scoreData.score : 0;
                  const summary = selectedEntry.facetSummaries && selectedEntry.facetSummaries[facetName] 
                                    ? selectedEntry.facetSummaries[facetName] 
                                    : `Exploring ${selectedEntry.title}'s perspective on ${facetName.toLowerCase()}...`;
                  return (
                    <div key={facetName} className="p-3 rounded-md border border-border/50 bg-background/30">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-md font-semibold" style={{ color: `hsl(var(${facetConfig.colorVariable.slice(2)}))` }}>
                          {facetName}
                        </h4>
                        <span className="text-sm font-bold" style={{ color: `hsl(var(${facetConfig.colorVariable.slice(2)}))` }}>
                          {Math.round(score * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{facetConfig.tagline}</p>
                      <p className="text-sm text-muted-foreground">
                        {summary}
                      </p>
                    </div>
                  );
                })}
                <Button variant="link" asChild className="w-full mt-4 justify-center text-primary">
                  <Link href={`/codex/${selectedEntry.id}`} onClick={() => setIsDrawerOpen(false)}>
                    View Full Deep-Dive for {selectedEntry.title} <Icons.chevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
