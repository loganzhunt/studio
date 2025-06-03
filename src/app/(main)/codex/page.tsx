"use client";

// Always ensure a valid React component is exported as default.
// Large data blocks must be defined above the component or imported from separate files.

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TriangleChart from "@/components/visualization/TriangleChart";
import type { CodexEntry, FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFacetClass, FACET_INFO } from "@/lib/facet-colors";
import { SPECTRUM_LABELS } from "@/lib/colors";
import { useWorldview } from "@/hooks/use-worldview";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import centralized data utilities
import {
  mapRawDataToCodexEntries,
  getCombinedCodexData,
} from "@/lib/codex-utils";

// --- Helper Functions ---
const getDominantFacet = (scores: DomainScore[]): FacetName => {
  if (!scores || scores.length === 0) return FACET_NAMES[0]; // Default
  const validScores = scores.filter((s) => s && typeof s.score === "number");
  if (validScores.length === 0) return FACET_NAMES[0];
  return (
    validScores.reduce((prev, current) =>
      current.score > prev.score ? current : prev
    ).facetName || FACET_NAMES[0]
  );
};

export default function CodexPage() {
  // console.log("CodexPage function definition reached");
  // console.log('BASE_CODEX_DATA length:', BASE_CODEX_DATA?.length);
  // console.log('LATEST_CODEX_UPDATE_BATCH length:', LATEST_CODEX_UPDATE_BATCH?.length);
  // console.log('ADDITIONAL_CODEX_DATA length:', ADDITIONAL_CODEX_DATA?.length);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [activeCategory, setActiveCategory] = useState<
    CodexEntry["category"] | "all"
  >("all");
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addSavedWorldview, savedWorldviews } = useWorldview();
  const { toast } = useToast();

  const initialMappedEntries = useMemo(() => {
    try {
      // Use centralized data loading function
      const combinedRawData = getCombinedCodexData();

      // Remove duplicates based on title
      const uniqueEntriesData: any[] = [];
      const uniqueTitles = new Set<string>();

      for (const item of combinedRawData) {
        if (typeof item !== "object" || item === null) {
          continue;
        }
        const title = (item.title || item.name || "")
          .toString()
          .toLowerCase()
          .trim();
        if (title && !uniqueTitles.has(title)) {
          const standardizedItem = { ...item, title: item.title || item.name };
          if (
            item.name &&
            typeof item.name === "string" &&
            standardizedItem.title !== item.name
          ) {
            delete standardizedItem.name;
          }
          uniqueEntriesData.push(standardizedItem);
          uniqueTitles.add(title);
        }
      }

      // Use centralized mapping function
      return mapRawDataToCodexEntries(uniqueEntriesData);
    } catch (error) {
      console.error("Error processing Codex data arrays in useMemo:", error);
      return [];
    }
  }, []);

  const filteredAndSortedEntries = useMemo(() => {
    if (!Array.isArray(initialMappedEntries)) {
      // console.error("initialMappedEntries is not an array:", initialMappedEntries);
      return [];
    }
    let entries = [...initialMappedEntries];

    if (activeCategory !== "all") {
      entries = entries.filter(
        (entry) => entry && entry.category === activeCategory
      );
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      entries = entries.filter(
        (entry) =>
          entry &&
          ((entry.title &&
            entry.title.toLowerCase().includes(lowerSearchTerm)) ||
            (entry.summary &&
              entry.summary.toLowerCase().includes(lowerSearchTerm)) ||
            (entry.tags &&
              entry.tags.some((tag) =>
                tag.toLowerCase().includes(lowerSearchTerm)
              )))
      );
    }

    if (sortBy === "title") {
      entries.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "category") {
      entries.sort(
        (a, b) =>
          (a.category || "").localeCompare(b.category || "") ||
          (a.title || "").localeCompare(b.title || "")
      );
    } else if (sortBy === "dominantFacet") {
      entries.sort((a, b) => {
        const dominantA = getDominantFacet(a.domainScores || []);
        const dominantB = getDominantFacet(b.domainScores || []);
        return (
          dominantA.localeCompare(dominantB) ||
          (a.title || "").localeCompare(b.title || "")
        );
      });
    }
    return entries.filter((entry) => entry);
  }, [initialMappedEntries, activeCategory, searchTerm, sortBy]);

  const allCategories = useMemo(() => {
    if (!Array.isArray(initialMappedEntries)) return ["all"];
    const categories = new Set(
      initialMappedEntries.map((entry) => entry?.category).filter(Boolean)
    );
    return ["all", ...Array.from(categories).sort()] as (
      | CodexEntry["category"]
      | "all"
    )[];
  }, [initialMappedEntries]);

  const handleOpenDrawer = (entry: CodexEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleSaveCodexEntry = (entryToSave: CodexEntry) => {
    if (!entryToSave) return;
    const isAlreadySaved = savedWorldviews.some(
      (p) =>
        p.id === entryToSave.id ||
        p.title.toLowerCase() === entryToSave.title.toLowerCase()
    );
    if (isAlreadySaved) {
      toast({
        title: "Already Saved",
        description: `"${entryToSave.title}" is already in your library.`,
      });
      return;
    }
    addSavedWorldview({ ...entryToSave });
    toast({
      title: "Saved to Library",
      description: `"${entryToSave.title}" has been added to your saved worldviews.`,
    });
  };

  const CodexCard = ({ entry }: { entry: CodexEntry }) => {
    const dominantFacet = getDominantFacet(entry.domainScores);

    return (
      <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300 ease-in-out h-full">
        <CardHeader className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {entry.icon && (
              <span
                className={`text-3xl ${getFacetClass(
                  "text",
                  dominantFacet.toLowerCase() as any,
                  "600"
                )}`}
              >
                {entry.icon}
              </span>
            )}
            <CardTitle
              className={`text-xl line-clamp-1 ${getFacetClass(
                "text",
                dominantFacet.toLowerCase() as any,
                "700"
              )}`}
            >
              {entry.title}
            </CardTitle>
          </div>
          <CardDescription className="line-clamp-2 text-xs pt-2 text-left">
            {entry.summary}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center items-center pt-2 pb-4">
          <TriangleChart
            scores={entry.domainScores}
            worldviewName={entry.title}
            width={180}
            height={156}
            className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none mb-4"
          />
        </CardContent>
        <CardFooter className="p-4 border-t border-border/30 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => handleOpenDrawer(entry)}
          >
            View Details <Icons.chevronRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">The Meta-Prism Codex</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          An evolving library of worldviews, philosophical systems, and
          archetypal profiles. Explore diverse ways of constructing reality.
        </p>
      </header>

      <Card className="mb-8 p-4 sm:p-6 glassmorphic-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label
              htmlFor="search-codex"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Search Codex
            </label>
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
            <label
              htmlFor="sort-by"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                id="sort-by"
                className="bg-muted/80 border-border/60 hover:bg-muted/90"
              >
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
        <div className="mt-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Filter by Category:
          </p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setActiveCategory(cat as CodexEntry["category"] | "all")
                }
                className="capitalize text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {filteredAndSortedEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedEntries.map((entry) => {
            if (
              !entry ||
              typeof entry.id === "undefined" ||
              typeof entry.title === "undefined" ||
              !Array.isArray(entry.domainScores)
            ) {
              // console.warn("Skipping rendering of incomplete/invalid entry:", entry);
              return null;
            }
            return <CodexCard key={entry.id} entry={entry} />;
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Icons.search className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <p className="text-xl text-muted-foreground">
            No entries match your filters.
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or category selection.
          </p>
        </div>
      )}

      {selectedEntry && (
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent
            className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl"
            side="right"
          >
            <ScrollArea className="h-full">
              <TooltipProvider>
                <div className="p-6">
                  <SheetHeader className="mb-8">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {selectedEntry.icon && (
                          <span
                            className={`text-4xl ${getFacetClass(
                              "text",
                              getDominantFacet(
                                selectedEntry.domainScores
                              ).toLowerCase() as any,
                              "600"
                            )}`}
                          >
                            {selectedEntry.icon}
                          </span>
                        )}
                        <div>
                          <SheetTitle
                            className={`text-3xl mb-2 ${getFacetClass(
                              "text",
                              getDominantFacet(
                                selectedEntry.domainScores
                              ).toLowerCase() as any,
                              "700"
                            )}`}
                          >
                            {selectedEntry.title}
                          </SheetTitle>
                          <SheetDescription className="text-base capitalize">
                            {selectedEntry.category} Profile
                          </SheetDescription>
                        </div>
                      </div>
                    </div>
                  </SheetHeader>

                  <div className="mb-8 flex justify-center">
                    <TriangleChart
                      scores={selectedEntry.domainScores}
                      worldviewName={selectedEntry.title}
                      width={250}
                      height={217}
                      className="mx-auto !p-0 !bg-transparent !shadow-none !backdrop-blur-none"
                    />
                  </div>

                  <div className="mb-6 space-y-2">
                    <Button
                      variant={
                        savedWorldviews.some((p) => p.id === selectedEntry.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleSaveCodexEntry(selectedEntry)}
                      disabled={savedWorldviews.some(
                        (p) => p.id === selectedEntry.id
                      )}
                    >
                      {savedWorldviews.some(
                        (p) => p.id === selectedEntry.id
                      ) ? (
                        <Icons.check className="mr-1 h-3 w-3" />
                      ) : (
                        <Icons.saved className="mr-1 h-3 w-3" />
                      )}
                      {savedWorldviews.some((p) => p.id === selectedEntry.id)
                        ? "Saved to Library"
                        : "Save to Library"}
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full text-xs"
                    >
                      <Link href={`/codex/${selectedEntry.id}`}>
                        View Full Deep-Dive Page{" "}
                        <Icons.chevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-6 mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border/30 pb-2">
                      Facet Breakdown
                    </h3>
                    {FACET_NAMES.map((facetName) => {
                      const scoreObj = selectedEntry.domainScores.find(
                        (ds) => ds.facetName === facetName
                      );
                      const score = scoreObj ? scoreObj.score : 0.5;
                      const facetConfig = FACETS[facetName];
                      const facetSummary =
                        selectedEntry.facetSummaries?.[facetName] ||
                        `Information for ${facetName} is not available for this worldview.`;
                      const spectrumPoleLabels = SPECTRUM_LABELS[facetName] || {
                        left: "Low",
                        right: "High",
                      };

                      return (
                        <div
                          key={facetName}
                          className="p-4 rounded-md border border-border/30 bg-background/40 space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <h4
                              className={`text-lg font-semibold ${getFacetClass(
                                "text",
                                facetName.toLowerCase() as any,
                                "700"
                              )}`}
                            >
                              {facetName}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground italic mb-2">
                            {facetConfig?.tagline || "..."}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {facetSummary}
                          </p>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="w-full h-6 rounded bg-muted/30 relative mt-2"
                                aria-label={`${facetName} spectrum: ${
                                  spectrumPoleLabels.left
                                } to ${
                                  spectrumPoleLabels.right
                                }. Score: ${Math.round(score * 100)}%`}
                              >
                                <div
                                  className={`h-full rounded ${getFacetClass(
                                    "bg",
                                    facetName.toLowerCase() as any,
                                    "500"
                                  )}`}
                                />
                                <div
                                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                                  style={{
                                    left: `${score * 100}%`,
                                    pointerEvents: "none",
                                    zIndex: 10,
                                  }}
                                  aria-hidden="true"
                                >
                                  <div className="px-1.5 py-0 text-[10px] bg-black/70 text-white rounded shadow-md whitespace-nowrap">
                                    {Math.round(score * 100)}%
                                  </div>
                                  <svg
                                    width="8"
                                    height="5"
                                    viewBox="0 0 8 5"
                                    className="fill-black/70 mx-auto"
                                  >
                                    <path d="M4 5L0 0H8L4 5Z" />
                                  </svg>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg text-xs"
                            >
                              <p>
                                {spectrumPoleLabels.left}{" "}
                                <span className="text-muted-foreground mx-1">
                                  ←
                                </span>{" "}
                                Score: {Math.round(score * 100)}%{" "}
                                <span className="text-muted-foreground mx-1">
                                  →
                                </span>{" "}
                                {spectrumPoleLabels.right}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mb-4 space-y-2 border-t border-border/30 pt-6">
                    <Button
                      variant={
                        savedWorldviews.some((p) => p.id === selectedEntry.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleSaveCodexEntry(selectedEntry)}
                      disabled={savedWorldviews.some(
                        (p) => p.id === selectedEntry.id
                      )}
                    >
                      {savedWorldviews.some(
                        (p) => p.id === selectedEntry.id
                      ) ? (
                        <Icons.check className="mr-1 h-3 w-3" />
                      ) : (
                        <Icons.saved className="mr-1 h-3 w-3" />
                      )}
                      {savedWorldviews.some((p) => p.id === selectedEntry.id)
                        ? "Saved to Library"
                        : "Save to Library"}
                    </Button>
                  </div>
                </div>
              </TooltipProvider>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
