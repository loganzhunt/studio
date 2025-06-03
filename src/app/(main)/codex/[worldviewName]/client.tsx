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
import type { FacetName } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { SPECTRUM_LABELS } from "@/lib/colors";
import { getFacetClass, FACET_INFO } from "@/lib/facet-colors";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import utilities for codex data and worldview management
import { getCodexEntryBySlug } from "@/lib/codex-utils";
import { useWorldviewManagement } from "@/hooks/use-worldview-management";

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

  // Get the worldview data using our utility
  const worldview = getCodexEntryBySlug(worldviewNameFromParam);

  // Use our custom hook for worldview management
  const { isSaved, handleSaveWorldview } = useWorldviewManagement(worldview);

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
        <Button
          variant={isSaved ? "outline" : "default"}
          size="sm"
          onClick={handleSaveWorldview}
          disabled={isSaved}
        >
          <Icons.bookmark className="mr-2 h-4 w-4" />
          {isSaved ? "Saved" : "Save Worldview"}
        </Button>
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
