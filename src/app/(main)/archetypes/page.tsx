"use client";

import { useState, useMemo, useEffect } from "react";
import TriangleChart from "@/components/visualization/TriangleChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { CodexEntry, FacetName, DomainScore } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import {
  getCombinedCodexData,
  mapRawDataToCodexEntries,
} from "@/lib/codex-utils";
import Link from "next/link";
import { useWorldview } from "@/hooks/use-worldview";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SPECTRUM_LABELS } from "@/lib/colors";
import { getFacetClass, FACET_INFO } from "@/lib/facet-colors";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper Functions
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

// Using the centralized mapRawArchetypeToCodexEntry function from codex-utils.ts

const calculateSimilarity = (
  userScores: DomainScore[],
  archetypeScores: DomainScore[]
): number => {
  if (
    !userScores ||
    userScores.length !== FACET_NAMES.length ||
    !archetypeScores ||
    archetypeScores.length !== FACET_NAMES.length
  ) {
    return 0;
  }

  const userMap = new Map(userScores.map((s) => [s.facetName, s.score]));
  const archetypeMap = new Map(
    archetypeScores.map((s) => [s.facetName, s.score])
  );

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
  const {
    domainScores: userDomainScores,
    addSavedWorldview,
    savedWorldviews,
  } = useWorldview();
  const [selectedArchetype, setSelectedArchetype] = useState<CodexEntry | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [codexEntries, setCodexEntries] = useState<CodexEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadCodexData = () => {
      try {
        const combinedRawData = getCombinedCodexData();
        const allEntries = mapRawDataToCodexEntries(combinedRawData);

        // Filter and validate entries
        const validEntries = allEntries.filter((entry) => {
          if (!entry || !entry.title) {
            console.error("Invalid entry detected:", entry);
            return false;
          }
          return true;
        });

        const archetypeEntries = validEntries.map((entry) => {
          return {
            ...entry,
            domainScores: safeDomainScores(entry),
          };
        });

        setCodexEntries(archetypeEntries);
      } catch (error) {
        console.error("Error loading codex data:", error);
        setCodexEntries([]);
      }
    };

    loadCodexData();
  }, []);

  const { closestArchetype, highestSimilarity } = useMemo(() => {
    let closest: CodexEntry | null = null;
    let highestSim = 0;

    if (
      userDomainScores &&
      userDomainScores.length > 0 &&
      Array.isArray(codexEntries)
    ) {
      for (const archetype of codexEntries) {
        if (!archetype || !archetype.domainScores) continue;
        const similarity = calculateSimilarity(
          userDomainScores,
          archetype.domainScores
        );
        if (similarity > highestSim) {
          highestSim = similarity;
          closest = archetype;
        }
      }
    }
    return { closestArchetype: closest, highestSimilarity: highestSim };
  }, [userDomainScores, codexEntries]);

  const handleOpenDrawer = (archetype: CodexEntry) => {
    setSelectedArchetype(archetype);
    setIsDrawerOpen(true);
  };

  const handleSaveArchetype = (archetypeToSave: CodexEntry | null) => {
    if (!archetypeToSave) return;
    const isAlreadySaved = savedWorldviews.some(
      (p) => p.id === archetypeToSave.id
    );
    if (isAlreadySaved) {
      toast({
        title: "Already Saved",
        description: `"${archetypeToSave.title}" is already in your library.`,
      });
      return;
    }
    const safeArchetypeToSave = {
      ...archetypeToSave,
      domainScores: safeDomainScores(archetypeToSave),
      createdAt: archetypeToSave.createdAt || new Date().toISOString(),
    };
    addSavedWorldview(safeArchetypeToSave);
    toast({
      title: "Saved to Library",
      description: `"${archetypeToSave.title}" has been saved to your library.`,
    });
  };

  const TriangleChartWrapper = ({
    scores,
    worldviewName,
  }: {
    scores: DomainScore[] | undefined;
    worldviewName: string;
  }) => {
    return (
      <TriangleChart
        scores={scores || []}
        worldviewName={worldviewName}
        width={200}
        height={173}
        className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none"
      />
    );
  };

  const safeDomainScores = (entry: CodexEntry | null | undefined) => {
    if (!entry || !entry.domainScores) {
      return FACET_NAMES.map((facetName) => ({
        facetName,
        score: 0.5,
      }));
    }
    return entry.domainScores;
  };

  const safeSelectedArchetype = selectedArchetype || {
    id: "",
    title: "Unknown Archetype",
    summary: "No summary available.",
    domainScores: FACET_NAMES.map((facetName) => ({
      facetName,
      score: 0.5,
    })),
    facetSummaries: {},
    category: "custom", // Updated to a valid category
  };

  const ArchetypeCard = ({ archetype }: { archetype: CodexEntry }) => {
    if (!archetype || !archetype.title || !archetype.domainScores) {
      return null;
    }
    const dominantFacet = getDominantFacet(archetype.domainScores);
    const facetKey = dominantFacet.toLowerCase() as keyof typeof FACET_INFO;

    return (
      <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300 ease-in-out h-full">
        <CardHeader className="text-center">
          <CardTitle
            className={`text-xl ${getFacetClass("text", facetKey, "700")}`}
          >
            {archetype.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-xs text-left">
            {archetype.summary}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center items-center pt-2 pb-3">
          <TriangleChartWrapper
            scores={archetype.domainScores}
            worldviewName={archetype.title}
          />
        </CardContent>
        <CardFooter className="p-4 border-t border-border/30 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleOpenDrawer(archetype)}
          >
            View Details <Icons.chevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Your Archetypes</h2>
          <p className="text-sm text-muted-foreground">
            These are the archetypes that best match your worldview.
          </p>
        </div>
        <div className="flex-none">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full md:w-auto"
            onClick={() => handleOpenDrawer(safeSelectedArchetype)}
          >
            <Link href="/archetypes/new">
              <Icons.add className="mr-2 h-4 w-4" />
              Create Your Own Archetype
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {codexEntries.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-sm text-muted-foreground">
              No archetypes found. Please check back later.
            </p>
          </div>
        )}
        {codexEntries.map((archetype) => (
          <ArchetypeCard key={archetype.id} archetype={archetype} />
        ))}
      </div>
      {closestArchetype && (
        <div className="rounded-lg border border-border/30 p-4 bg-card">
          <h3 className="text-lg font-semibold mb-2">Closest Archetype</h3>
          <ArchetypeCard archetype={closestArchetype} />
        </div>
      )}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>
              {selectedArchetype?.title || "Archetype Details"}
            </SheetTitle>
            <SheetDescription>
              {selectedArchetype?.summary || "No description available."}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-60 rounded-md border border-border/30">
            <div className="p-4">
              {selectedArchetype?.domainScores?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-10">
                  No domain scores available for this archetype.
                </p>
              )}
              {selectedArchetype?.domainScores?.map((score) => {
                const facetInfo =
                  FACET_INFO[
                    score.facetName.toLowerCase() as keyof typeof FACET_INFO
                  ];
                if (!facetInfo) return null;
                return (
                  <div
                    key={score.facetName}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${facetInfo.color}`}
                      />
                      <span className="text-sm font-medium">
                        {facetInfo?.name || "Unknown Facet"}
                      </span>
                    </div>
                    <div className="flex-1 h-2.5 mx-4 bg-muted rounded-full">
                      <div
                        className="h-2.5 bg-primary rounded-full"
                        style={{
                          width: `${score.score * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {score.score.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => handleSaveArchetype(selectedArchetype)}
            >
              Save to Library
            </Button>
            <Button
              variant="default"
              onClick={() => setIsDrawerOpen(false)}
              className="ml-auto"
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
