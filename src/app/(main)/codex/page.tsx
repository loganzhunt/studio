
"use client";

// Always ensure a valid React component is exported as default.
// Large data blocks must be defined above the component or imported from separate files.

import React, { useState, useMemo, useEffect } from 'react';
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import type { CodexEntry, FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { getFacetColorHsl } from '@/lib/colors';
import { useWorldview } from '@/hooks/use-worldview';
import { useToast } from '@/hooks/use-toast';

// Import data from separate files
import { BASE_CODEX_DATA } from "@/data/codex/base-codex-data";
import { LATEST_CODEX_UPDATE_BATCH } from "@/data/codex/latest-codex-update-batch";
import { ADDITIONAL_CODEX_DATA } from "@/data/codex/additional-codex-data";


// --- Helper Functions ---
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0]; // Default
  const validScores = scores.filter(s => s && typeof s.score === 'number');
  if (validScores.length === 0) return FACET_NAMES[0];
  return validScores.reduce((prev, current) => (current.score > prev.score) ? current : prev).facetName || FACET_NAMES[0];
};

export function mapRawDataToCodexEntries(rawItems: any[]): CodexEntry[] {
  if (!Array.isArray(rawItems)) {
    console.error("mapRawDataToCodexEntries received non-array input:", rawItems);
    return [];
  }
  return rawItems.map((item: any, index: number) => {
    const title = item.title || item.name;
    if (!item || (typeof title !== 'string' )) {
      // console.warn(`Skipping invalid item at index ${index} in rawCodexData (missing title/name):`, item);
      return null; // Filter this out later
    }

    const id = title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');

    let domainScoresArray: DomainScore[] = [];
    const scoresSource = item.scores || item.domainScores || item.facetScores;

    if (scoresSource && typeof scoresSource === 'object') {
      domainScoresArray = FACET_NAMES.map(facetKey => {
        const scoreKeyLower = facetKey.toLowerCase() as keyof typeof scoresSource;
        const scoreKeyOriginal = facetKey as keyof typeof scoresSource;
        let scoreValue = 0.5; // Default if no score found

        if (scoresSource.hasOwnProperty(scoreKeyLower) && typeof scoresSource[scoreKeyLower] === 'number') {
          scoreValue = scoresSource[scoreKeyLower];
        } else if (scoresSource.hasOwnProperty(scoreKeyOriginal) && typeof scoresSource[scoreKeyOriginal] === 'number') {
          scoreValue = scoresSource[scoreKeyOriginal];
        }
        return { facetName: facetKey, score: Math.max(0, Math.min(1, Number(scoreValue))) };
      });
    } else {
      // If no scores are provided at all, default all to 0.5
      domainScoresArray = FACET_NAMES.map(name => ({ facetName: name, score: 0.5 }));
    }

    const facetSummariesSource = item.facetDescriptions || item.facetSummaries || item.facetSummary;
    const processedFacetSummaries: { [K_FacetName in FacetName]?: string } = {};
    if (facetSummariesSource && typeof facetSummariesSource === 'object') {
      for (const facetKey of FACET_NAMES) {
        const summaryKeyLower = facetKey.toLowerCase() as keyof typeof facetSummariesSource;
        const summaryKeyOriginal = facetKey as keyof typeof facetSummariesSource;
        let summary = `Information for ${facetKey} is not available for this worldview.`; // Default summary

        if (facetSummariesSource.hasOwnProperty(summaryKeyLower) && typeof facetSummariesSource[summaryKeyLower] === 'string') {
          summary = facetSummariesSource[summaryKeyLower];
        } else if (facetSummariesSource.hasOwnProperty(summaryKeyOriginal) && typeof facetSummariesSource[summaryKeyOriginal] === 'string') {
          summary = facetSummariesSource[summaryKeyOriginal];
        }
        processedFacetSummaries[facetKey] = summary;
      }
    } else {
      FACET_NAMES.forEach(facetKey => {
        processedFacetSummaries[facetKey] = `Information for ${facetKey} is not available for ${title}.`;
      });
    }
    
    let category: CodexEntry['category'] = 'custom';
    const itemCategoryRaw = (item.category || '').toString();
    const itemCategoryMain = itemCategoryRaw.toLowerCase().split(' ')[0];

    const validCategories: CodexEntry['category'][] = ['philosophical', 'religious', 'archetypal', 'spiritual', 'custom', 'indigenous', 'mystical', 'scientific', 'cultural'];
    if (validCategories.includes(itemCategoryMain as CodexEntry['category'])) {
      category = itemCategoryMain as CodexEntry['category'];
    } else if (item.tags && Array.isArray(item.tags) && (item.tags as string[]).some(tag => validCategories.includes(tag.toLowerCase() as CodexEntry['category']))) {
      category = (item.tags as string[]).find(tag => validCategories.includes(tag.toLowerCase() as CodexEntry['category']))?.toLowerCase() as CodexEntry['category'] || 'custom';
    }


    const tags = Array.isArray(item.tags) ? item.tags.map(String) : (typeof item.tags === 'string' ? [item.tags] : (item.tags === undefined ? [] : []));
    if (category !== 'custom' && !tags.includes(category)) {
      tags.push(category); 
    }
    const idTag = title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');
    if (!tags.includes(idTag)) {
        tags.push(idTag);
    }


    return {
      id,
      title,
      summary: item.summary || "No summary available.",
      icon: item.icon || undefined,
      domainScores: domainScoresArray,
      category,
      isArchetype: category === 'archetypal' || (Array.isArray(item.tags) && (item.tags as string[]).map(t => t.toLowerCase()).includes('archetypal')),
      createdAt: item.createdAt || new Date().toISOString(),
      tags,
      facetSummaries: processedFacetSummaries, 
    };
  }).filter(item => item !== null) as CodexEntry[];
};


export default function CodexPage() {
  // console.log("CodexPage function definition reached");
  // console.log("Imported BASE_CODEX_DATA length:", BASE_CODEX_DATA?.length);
  // console.log("Imported LATEST_CODEX_UPDATE_BATCH length:", LATEST_CODEX_UPDATE_BATCH?.length);
  // console.log("Imported ADDITIONAL_CODEX_DATA length:", ADDITIONAL_CODEX_DATA?.length);


  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [activeCategory, setActiveCategory] = useState<CodexEntry['category'] | "all">("all");
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addSavedWorldview, savedWorldviews } = useWorldview();
  const { toast } = useToast();

  const initialMappedEntries = useMemo(() => {
    let combinedRawData: any[] = [];
    try {
      if (Array.isArray(LATEST_CODEX_UPDATE_BATCH)) combinedRawData = combinedRawData.concat(LATEST_CODEX_UPDATE_BATCH);
      if (Array.isArray(ADDITIONAL_CODEX_DATA)) combinedRawData = combinedRawData.concat(ADDITIONAL_CODEX_DATA);
      if (Array.isArray(BASE_CODEX_DATA)) combinedRawData = combinedRawData.concat(BASE_CODEX_DATA);
      
      const uniqueEntriesData: any[] = [];
      const uniqueTitles = new Set<string>();

      for (const item of combinedRawData) {
        if (typeof item !== 'object' || item === null) continue;
        const title = (item.title || item.name || '').toString().toLowerCase().trim();
        if (title && !uniqueTitles.has(title)) {
          const standardizedItem = { ...item, title: item.title || item.name };
          if (item.name && typeof item.name === 'string' && standardizedItem.title !== item.name) delete standardizedItem.name; 
          uniqueEntriesData.push(standardizedItem);
          uniqueTitles.add(title);
        }
      }
      return mapRawDataToCodexEntries(uniqueEntriesData); 
    } catch (error) {
      console.error("Error processing Codex data arrays in useMemo:", error);
      return []; 
    }
  }, []);


  const filteredAndSortedEntries = useMemo(() => {
    if (!Array.isArray(initialMappedEntries)) {
        console.error("initialMappedEntries is not an array:", initialMappedEntries);
        return [];
    }
    let entries = [...initialMappedEntries];

    if (activeCategory !== "all") {
      entries = entries.filter(entry => entry && entry.category === activeCategory);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      entries = entries.filter(entry =>
        entry && (
          (entry.title && entry.title.toLowerCase().includes(lowerSearchTerm)) ||
          (entry.summary && entry.summary.toLowerCase().includes(lowerSearchTerm)) ||
          (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
        )
      );
    }

    if (sortBy === "title") {
      entries.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "category") {
      entries.sort((a, b) => (a.category || "").localeCompare(b.category || "") || (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "dominantFacet") {
      entries.sort((a, b) => {
        const dominantA = getDominantFacet(a.domainScores || []);
        const dominantB = getDominantFacet(b.domainScores || []);
        return dominantA.localeCompare(dominantB) || (a.title || "").localeCompare(b.title || "");
      });
    }
    return entries.filter(entry => entry); 
  }, [initialMappedEntries, activeCategory, searchTerm, sortBy]);

  const allCategories = useMemo(() => {
    if (!Array.isArray(initialMappedEntries)) return ["all"];
    const categories = new Set(initialMappedEntries.map(entry => entry?.category).filter(Boolean));
    return ["all", ...Array.from(categories).sort()] as (CodexEntry['category'] | "all")[];
  }, [initialMappedEntries]);

  const handleOpenDrawer = (entry: CodexEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleSaveCodexEntry = (entryToSave: CodexEntry) => {
    if (!entryToSave) return;
    const isAlreadySaved = savedWorldviews.some(p => p.id === entryToSave.id || p.title.toLowerCase() === entryToSave.title.toLowerCase());
    if (isAlreadySaved) {
      toast({ title: "Already Saved", description: `"${entryToSave.title}" is already in your library.` });
      return;
    }
    addSavedWorldview({ ...entryToSave }); 
    toast({ title: "Saved to Library", description: `"${entryToSave.title}" has been added to your saved worldviews.` });
  };


  const CodexCard = ({ entry }: { entry: CodexEntry }) => {
    const dominantFacet = getDominantFacet(entry.domainScores);
    const titleColor = getFacetColorHsl(dominantFacet);

    return (
      <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300 h-full">
        <CardHeader className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {entry.icon && <span className="text-3xl" style={{ color: titleColor }}>{entry.icon}</span>}
            <CardTitle className="text-xl line-clamp-1" style={{ color: titleColor }}>
              {entry.title}
            </CardTitle>
          </div>
          <CardDescription className="line-clamp-2 text-xs pt-1 text-left">
            {entry.summary}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center items-center pt-2 pb-3">
          <TriangleChart scores={entry.domainScores} width={180} height={156} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none mb-2" />
        </CardContent>
        <CardFooter className="p-3 border-t border-border/30 mt-auto">
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => handleOpenDrawer(entry)}>
            View Details <Icons.chevronRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    );
  };


  return (
    <div className="container mx-auto py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">The Meta-Prism Codex</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          An evolving library of worldviews, philosophical systems, and archetypal profiles. Explore diverse ways of constructing reality.
        </p>
      </header>

      <Card className="mb-8 p-4 sm:p-6 glassmorphic-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search-codex" className="block text-sm font-medium text-muted-foreground mb-1">Search Codex</label>
            <Input
              id="search-codex"
              type="text"
              placeholder="Search by title, summary, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-muted-foreground mb-1">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by" className="bg-background/50">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="dominantFacet">Dominant Facet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Filter by Category:</p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="capitalize text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {filteredAndSortedEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedEntries.map((entry) => {
            if (!entry || typeof entry.id === 'undefined' || typeof entry.title === 'undefined' || !Array.isArray(entry.domainScores)) {
              console.warn("Skipping rendering of incomplete/invalid entry:", entry);
              return null; 
            }
            return <CodexCard key={entry.id} entry={entry} />;
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icons.search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No entries match your filters.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or category selection.</p>
        </div>
      )}

      {selectedEntry && (
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl" side="right">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SheetHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {selectedEntry.icon && <span className="text-4xl" style={{color: getFacetColorHsl(getDominantFacet(selectedEntry.domainScores))}}>{selectedEntry.icon}</span>}
                      <div>
                        <SheetTitle className="text-3xl mb-1" style={{color: getFacetColorHsl(getDominantFacet(selectedEntry.domainScores))}}>
                          {selectedEntry.title}
                        </SheetTitle>
                        <SheetDescription className="text-base capitalize">{selectedEntry.category} Profile</SheetDescription>
                      </div>
                    </div>
                  </div>
                </SheetHeader>
                
                <div className="mb-6 flex justify-center">
                   <TriangleChart scores={selectedEntry.domainScores} width={250} height={217} className="mx-auto !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
                </div>
                
                <div className="mb-4 space-y-2 border-t border-border/30 pt-4">
                  <Button
                    variant={savedWorldviews.some(p => p.id === selectedEntry.id) ? "default" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleSaveCodexEntry(selectedEntry)}
                    disabled={savedWorldviews.some(p => p.id === selectedEntry.id)}
                  >
                    {savedWorldviews.some(p => p.id === selectedEntry.id) ? <Icons.check className="mr-1 h-3 w-3" /> : <Icons.saved className="mr-1 h-3 w-3" />}
                    {savedWorldviews.some(p => p.id === selectedEntry.id) ? "Saved to Library" : "Save to Library"}
                  </Button>
                  <Button variant="outline" asChild className="w-full text-xs">
                    <Link href={`/codex/${selectedEntry.id}`}>
                      View Full Deep-Dive Page <Icons.chevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <p className="mb-6 text-muted-foreground leading-relaxed">{selectedEntry.summary}</p>


                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border/30 pb-2">Facet Breakdown</h3>
                  {FACET_NAMES.map(facetName => {
                    const scoreObj = selectedEntry.domainScores.find(ds => ds.facetName === facetName);
                    const score = scoreObj ? scoreObj.score : 0.5; 
                    const facetConfig = FACETS[facetName];
                    const facetSummary = selectedEntry.facetSummaries?.[facetName] || `Information for ${facetName} is not available for this worldview.`;

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
                    variant={savedWorldviews.some(p => p.id === selectedEntry.id) ? "default" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleSaveCodexEntry(selectedEntry)}
                    disabled={savedWorldviews.some(p => p.id === selectedEntry.id)}
                  >
                    {savedWorldviews.some(p => p.id === selectedEntry.id) ? <Icons.check className="mr-1 h-3 w-3" /> : <Icons.saved className="mr-1 h-3 w-3" />}
                    {savedWorldviews.some(p => p.id === selectedEntry.id) ? "Saved to Library" : "Save to Library"}
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

