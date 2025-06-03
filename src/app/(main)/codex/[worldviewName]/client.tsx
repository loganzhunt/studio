"use client";

import { useParams, useRouter } from "next/navigation";
import TriangleChart from "@/components/visualization/TriangleChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { CodexEntry, FacetName } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import Link from "next/link";
import { useWorldview } from "@/hooks/use-worldview";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { SPECTRUM_LABELS } from "@/lib/colors";
import { getFacetClass, FACET_INFO } from "@/lib/facet-colors";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import all codex data - needed to find the specific entry
import { BASE_CODEX_DATA } from "@/data/codex/base-codex-data";
import { LATEST_CODEX_UPDATE_BATCH } from "@/data/codex/latest-codex-update-batch";
import { ADDITIONAL_CODEX_DATA } from "@/data/codex/additional-codex-data";
import { mapRawDataToCodexEntries } from "@/app/(main)/codex/page"; // Import the mapper

const SECTION_IDS = {
  SUMMARY: "summary",
  FACETS: "facets",
  ORIGINS: "origins",
  BELIEFS: "beliefs",
  REFLECTION: "reflection",
  RESOURCES: "resources",
};

export default function CodexDeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const worldviewNameFromParam = params.worldviewName as string;

  const { savedWorldviews, addSavedWorldview } = useWorldview();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const allCodexEntries = useMemo(() => {
    try {
      const combinedRawData = [
        ...LATEST_CODEX_UPDATE_BATCH,
        ...ADDITIONAL_CODEX_DATA,
        ...BASE_CODEX_DATA,
      ];
      return mapRawDataToCodexEntries(combinedRawData);
    } catch (error) {
      console.error("Error mapping codex data:", error);
      return [];
    }
  }, []);

  // Get the worldview data from our codex entries
  const worldview = useMemo(() => {
    return allCodexEntries.find((entry) => {
      const entryId =
        entry.id ||
        (entry.title || "")
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");
      return entryId === worldviewNameFromParam;
    });
  }, [allCodexEntries, worldviewNameFromParam]);

  // Check if this worldview is already saved
  useEffect(() => {
    if (worldview) {
      const isAlreadySaved = savedWorldviews.some(
        (saved) => saved.id === worldview.id
      );
      setIsSaved(isAlreadySaved);
    }
  }, [savedWorldviews, worldview]);

  // Handle saving the worldview
  const handleSaveWorldview = () => {
    if (!worldview) return;

    // Convert CodexEntry to WorldviewProfile format
    addSavedWorldview({
      id: worldview.id,
      title: worldview.title,
      type: "codex",
      createdAt: new Date().toISOString(),
      domainScores: Array.isArray(worldview.domainScores)
        ? worldview.domainScores
        : Object.entries(worldview.scores || {}).map(([key, value]) => ({
            facetName: key as FacetName,
            score: value as number,
          })),
      summary: worldview.summary || worldview.description,
      icon: worldview.icon,
    });

    setIsSaved(true);
    toast({
      title: "Worldview Saved",
      description: `${worldview.title} has been added to your saved worldviews.`,
    });
  };

  if (!worldview) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Icons.search className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
        <h1 className="text-2xl font-semibold mb-2">Worldview Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The worldview "{worldviewNameFromParam}" could not be found in our
          codex.
        </p>
        <Button asChild variant="outline">
          <Link href="/codex">View All Worldviews</Link>
        </Button>
      </div>
    );
  }

  // Your render code...
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">{worldview.title}</h1>
      <div className="flex justify-center gap-4 mt-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/codex">
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Back to Codex
          </Link>
        </Button>
      </div>
    </div>
  );
}
