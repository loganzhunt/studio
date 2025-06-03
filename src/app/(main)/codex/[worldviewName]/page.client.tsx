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
import React, { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  SPECTRUM_LABELS,
  DOMAIN_COLORS,
  brightenColor,
  darkenColor,
  colorScale,
  getTextColor,
} from "@/lib/colors";
import { getFacetClass, FACET_INFO } from "@/lib/facet-colors";
import { FacetIcon } from "@/components/facet-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import the utilities for codex data and worldview management
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
  const worldview = useMemo(
    () => getCodexEntryBySlug(worldviewNameFromParam),
    [worldviewNameFromParam]
  );

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
        <Button variant="secondary" size="sm" asChild>
          <Link href="/codex">View All Worldviews</Link>
        </Button>
      </div>
    );
  }

  const handleScrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Calculate dynamic offset based on header height (64px) plus some padding
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 64;
      const yOffset = -(headerHeight + 20); // Header height + 20px padding
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Generate the domain spectrum badges for the facet cards
  const getDomainSpectrum = (facetName: FacetName, score: number) => {
    // Format the score as 2-digit percentage
    const formattedScore = `${Math.round(score * 100)}%`;

    // Get the color for the badge background based on the score
    const facetColor = DOMAIN_COLORS[facetName] || "#888888";
    const scaleColors = [
      brightenColor(facetColor, 1.5),
      facetColor,
      darkenColor(facetColor, 1.5),
    ];
    const backgroundColor = colorScale(scaleColors, score);

    // Get the position on the spectrum
    let position = "";
    if (score < 0.35) position = "Low";
    else if (score < 0.65) position = "Moderate";
    else position = "High";

    return {
      formattedScore,
      position,
      color: backgroundColor,
    };
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{worldview.title}</h1>
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {worldview.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          )) || null}
        </div>
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
          <Button variant="secondary" size="sm" asChild>
            <Link href="/codex">
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              Back to Codex
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Navigation Controls - Sticky */}
          <div className="sticky top-20 z-10 bg-background/95 backdrop-blur-sm p-4 rounded-lg border border-border/40 mb-8">
            <div className="flex flex-wrap gap-2 justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleScrollToSection(SECTION_IDS.SUMMARY)}
              >
                Summary
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleScrollToSection(SECTION_IDS.FACETS)}
              >
                Facets
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleScrollToSection(SECTION_IDS.ORIGINS)}
              >
                Origins
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleScrollToSection(SECTION_IDS.BELIEFS)}
              >
                Beliefs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleScrollToSection(SECTION_IDS.REFLECTION)}
              >
                Reflect
              </Button>
              {(worldview as any).resources &&
                (worldview as any).resources.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleScrollToSection(SECTION_IDS.RESOURCES)}
                  >
                    Resources
                  </Button>
                )}
            </div>
          </div>

          {/* Summary Section */}
          <Card id={SECTION_IDS.SUMMARY} className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {(worldview as any).description}
              </p>
            </CardContent>
          </Card>

          {/* Origins Section */}
          <Card id={SECTION_IDS.ORIGINS} className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Historical Context & Origins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground whitespace-pre-line">
                {(worldview as any).origins}
              </p>

              {(worldview as any).key_figures &&
                (worldview as any).key_figures.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Key Figures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(worldview as any).key_figures.map(
                        (figure: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex border border-border/30 rounded-md overflow-hidden bg-background/30"
                          >
                            <div className="flex flex-col p-3">
                              <span className="font-semibold">
                                {figure.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {figure.years}
                              </span>
                              <p className="text-sm mt-1">
                                {figure.contribution}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Core Beliefs Section */}
          <Card id={SECTION_IDS.BELIEFS} className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Core Beliefs & Principles</CardTitle>
            </CardHeader>
            <CardContent>
              {(worldview as any).principles && (
                <div className="space-y-4">
                  {(worldview as any).principles.map(
                    (principle: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 border border-border/30 rounded-md bg-background/30"
                      >
                        <h3 className="font-semibold mb-1">
                          {principle.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {principle.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reflection/Discussion Section */}
          <Card id={SECTION_IDS.REFLECTION} className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Reflection & Discussion</CardTitle>
              <CardDescription>
                Consider these questions about {worldview.title}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(worldview as any).reflection_questions && (
                <div className="space-y-3">
                  {(worldview as any).reflection_questions.map(
                    (question: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <p className="font-medium italic">{question}</p>
                        <Textarea
                          placeholder="Your thoughts... (not saved)"
                          className="bg-background/30 min-h-20"
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resources Section - Conditional */}
          {(worldview as any).resources &&
            (worldview as any).resources.length > 0 && (
              <Card id={SECTION_IDS.RESOURCES} className="glassmorphic-card">
                <CardHeader>
                  <CardTitle>Further Exploration</CardTitle>
                  <CardDescription>
                    Resources to learn more about {worldview.title}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(worldview as any).resources.map(
                      (resource: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 border border-border/30 rounded-md bg-background/30"
                        >
                          <h3 className="font-semibold">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {resource.author}
                          </p>
                          <p className="text-xs">{resource.description}</p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Sidebar - Right Column (1/3) */}
        <div className="space-y-8">
          {/* Worldview Visualization Card */}
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Worldview Visualization</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-[280px]">
                <TriangleChart
                  scores={worldview.domainScores}
                  worldviewName={worldview.title}
                />
              </div>
            </CardContent>
          </Card>

          {/* Facets Breakdown Card */}
          <Card id={SECTION_IDS.FACETS} className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Facets Breakdown</CardTitle>
              <CardDescription>
                How {worldview.title} approaches each domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
                ? FACET_NAMES.map((facetName) => {
                    const score =
                      worldview.domainScores?.find(
                        (s) => s.facetName === facetName
                      )?.score || 0.5;
                    const spectrum = getDomainSpectrum(facetName, score);
                    const facet = FACETS[facetName];

                    return (
                      <div
                        key={facetName}
                        className="border border-border/30 rounded-lg overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-3 border-b border-border/30 bg-background/30">
                          <div className="flex items-center gap-2">
                            <FacetIcon
                              facetName={facetName}
                              className="h-5 w-5"
                            />
                            <span className="font-semibold">{facetName}</span>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  style={{
                                    backgroundColor: spectrum.color,
                                    color: getTextColor(spectrum.color),
                                  }}
                                >
                                  {spectrum.position} ({spectrum.formattedScore}
                                  )
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Where this worldview falls on the {facetName}{" "}
                                  spectrum
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-muted-foreground">
                            {(worldview as any).facet_descriptions?.[
                              facetName.toLowerCase()
                            ] || facet?.tagline}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            asChild
                          >
                            <Link href={`/facet/${facetName.toLowerCase()}`}>
                              <Icons.arrowRight className="mr-1 h-3 w-3" />
                              Explore {facetName}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                : null}
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border/30 pt-4">
              <p className="text-xs text-muted-foreground text-center">
                Scores represent relative alignment with different ends of each
                spectrum.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
