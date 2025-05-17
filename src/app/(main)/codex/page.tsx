
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
import type { CodexEntry, FacetName } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';

// Dummy data for Codex entries
const dummyCodexEntries: CodexEntry[] = [
  {
    id: "stoicism",
    title: "Stoicism",
    summary: "A philosophy of personal ethics informed by its system of logic and its views on the natural world. Emphasizes virtue, reason, and living in accordance with nature.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
    category: "philosophical",
    createdAt: new Date().toISOString(),
    tags: ["Ethics", "Virtue", "Reason"]
  },
  {
    id: "buddhism",
    title: "Buddhism",
    summary: "A path of practice and spiritual development leading to Insight into the true nature of reality. Practices like meditation are means of changing yourself in order to develop the qualities of awareness, kindness, and wisdom.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
    category: "religious",
    createdAt: new Date().toISOString(),
    tags: ["Spiritual", "Meditation", "Enlightenment"]
  },
  {
    id: "existentialism",
    title: "Existentialism",
    summary: "A form of philosophical inquiry that explores the problem of human existence and centers on the lived experience of the thinking, feeling, acting individual.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
    category: "philosophical",
    createdAt: new Date().toISOString(),
    tags: ["Freedom", "Responsibility", "Meaning"]
  },
  {
    id: "the_hero",
    title: "The Hero Archetype",
    summary: "Represents the drive for mastery and competence. The Hero strives to prove their worth through courageous acts.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
    tags: ["Courage", "Strength", "Mastery"]
  }
];


function CodexCard({ entry, onOpenDrawer }: { entry: CodexEntry; onOpenDrawer: (entry: CodexEntry) => void }) {
  const dominantScoreEntry = entry.domainScores.length > 0 
    ? entry.domainScores.reduce((max, current) => current.score > max.score ? current : max, entry.domainScores[0])
    : { facetName: FACET_NAMES[0], score: 0 }; // Fallback if no scores
  
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
  const [activeCategory, setActiveCategory] = useState<"All" | "philosophical" | "religious" | "archetypal">('All');
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = (entry: CodexEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  const filteredAndSortedEntries = useMemo(() => {
    let entries = [...dummyCodexEntries]; // Create a copy to sort

    // Apply search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      entries = entries.filter(entry =>
        entry.title.toLowerCase().includes(lowerSearchTerm) ||
        entry.summary.toLowerCase().includes(lowerSearchTerm) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Apply category filter
    if (activeCategory !== 'All') {
      entries = entries.filter(entry => entry.category === activeCategory);
    }

    // Apply sort
    if (sortBy === 'az') {
      entries.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      entries.sort((a,b) => (a.category || "").localeCompare(b.category || "") || a.title.localeCompare(b.title));
    } else if (sortBy === 'dominant_facet') {
      // Placeholder for dominant_facet sorting - requires calculating dominant facet for each entry
      entries.sort((a, b) => {
        const aDominant = a.domainScores.length > 0 ? a.domainScores.reduce((max, curr) => curr.score > max.score ? curr : max).facetName : "";
        const bDominant = b.domainScores.length > 0 ? b.domainScores.reduce((max, curr) => curr.score > max.score ? curr : max).facetName : "";
        return aDominant.localeCompare(bDominant) || a.title.localeCompare(b.title);
      });
    }
    // Default/Relevance sort could be by created date or a predefined order if available

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

      {/* Filter and Search Section */}
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
        </div>
      </Card>

      {/* Codex Grid */}
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
       {/* Pagination Placeholder */}
      {/* <div className="mt-12 flex justify-center">
        <Button variant="outline" className="mr-2">Previous</Button>
        <span className="p-2 text-muted-foreground">Page 1 of X</span>
        <Button variant="outline" className="ml-2">Next</Button>
      </div> */}

      {/* Facet Details Drawer */}
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
                        {/* Placeholder for facet-specific summary for this worldview */}
                        Exploring {selectedEntry.title}'s perspective on {facetName.toLowerCase()} often reveals themes of... 
                        {/* Replace with actual data or AI-generated summary later */}
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

    