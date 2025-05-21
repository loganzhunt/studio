"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";

import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { WorldviewProfile, FacetName } from "@/types";

import ClientTriangleChart from "@/components/visualization/ClientTriangleChart"; // Use the client-side wrapper

import { FACETS, FACET_NAMES } from "@/config/facets";
import { getFacetColorHsl, DOMAIN_COLORS } from '@/lib/colors';
import chroma from 'chroma-js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const SPECTRUM_LABELS: Record<FacetName, { left: string; right: string }> = {
  Ontology: { left: "Materialism", right: "Idealism" },
  Epistemology: { left: "Empirical", right: "Revelatory" },
  Praxeology: { left: "Hierarchical", right: "Egalitarian" },
  Axiology: { left: "Individualism", right: "Collectivism" },
  Mythology: { left: "Linear", right: "Cyclical" },
  Cosmology: { left: "Mechanistic", right: "Holistic" },
  Teleology: { left: "Existential", right: "Divine" },
};


export default function ResultsPage() {
  const { domainScores, activeProfile, savedWorldviews, addSavedWorldview, hasAssessmentBeenRun } = useWorldview();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [profileTitle, setProfileTitle] = useState(activeProfile?.title || "My Assessment Results");
   const [isClient, setIsClient] = useState(false); // Added isClient state

  useEffect(() => {
    setIsClient(true); // Set isClient on mount
  }, []);


  useEffect(() => {
    if (activeProfile?.id) {
      setIsSaved(savedWorldviews.some(p => p.id === activeProfile.id));
      setProfileTitle(activeProfile.title);
    } else if (hasAssessmentBeenRun) {
      setIsSaved(false);
      setProfileTitle(`Assessment - ${new Date().toLocaleDateString()}`);
    } else {
      setIsSaved(false);
      setProfileTitle("Results Placeholder");
    }
  }, [activeProfile, savedWorldviews, hasAssessmentBeenRun]);

  const displayTitle = activeProfile?.title || (hasAssessmentBeenRun ? profileTitle : "Neutral Baseline");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Your Worldview Results</h1>
      <p className="text-xl text-muted-foreground text-center mb-8">"{displayTitle}"</p>

      {!hasAssessmentBeenRun && !activeProfile && (
        <Card className="mb-8 glassmorphic-card text-center p-6">
          <CardTitle className="text-xl text-primary">No Assessment Taken</CardTitle>
          <CardDescription className="my-2">Complete the assessment to see your personalized results.</CardDescription>
          <Button asChild>
            <Link href="/assessment"><Icons.assessment className="mr-2 h-4 w-4" /> Begin Assessment</Link>
          </Button>
        </Card>
      )}

      {(hasAssessmentBeenRun || activeProfile) && (
        <Card className="mb-8 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl">Meta-Prism Signature</CardTitle>
            <CardDescription>Your scores across the 7 facets of worldview.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="md:sticky md:top-24 flex justify-center">
               {/* Use ClientTriangleChart with isClient check */}
              {isClient && (
                <ClientTriangleChart scores={activeProfile?.domainScores || domainScores} width={300} height={260} className="max-w-sm !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
              )}
            </div>
            <div className="space-y-4">
              {FACET_NAMES.map(facetName => {
                const scoreObj = (activeProfile?.domainScores || domainScores).find(ds => ds.facetName === facetName);
                const score = scoreObj ? scoreObj.score : 0.5; // Default to 0.5 if score not found
                const facetConfig = FACETS[facetName];
                const spectrumPoleLabels = SPECTRUM_LABELS[facetName] || { left: 'Low', right: 'High' };

                const barColorDark = chroma(DOMAIN_COLORS[facetName]).darken(1.5).hex();
                const barColorLight = chroma(DOMAIN_COLORS[facetName]).brighten(1.5).hex();

                return (
                  <div key={facetName} className="p-4 rounded-md border border-border/30 bg-background/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold" style={{color: getFacetColorHsl(facetName)}}>
                        {facetName}
                      </h4>
                      <span className="text-sm font-semibold" style={{color: getFacetColorHsl(facetName)}}>
                        {Math.round(score * 100)}%
                      </span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full h-6 rounded bg-muted/30 relative cursor-help" aria-label={`${facetName} spectrum: ${spectrumPoleLabels.left} to ${spectrumPoleLabels.right}. Score: ${Math.round(score * 100)}%`}>
                            <div
                              className="h-full rounded"
                              style={{ background: `linear-gradient(to right, ${barColorDark}, ${barColorLight})` }}
                            />
                            <div
                              className="absolute top-0 bottom-0 w-1.5 bg-foreground/50 rounded-sm transform -translate-x-1/2"
                              style={{ left: `${score * 100}%` }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg text-xs">
                          <p>{spectrumPoleLabels.left} <span className="text-muted-foreground mx-1">←</span> Score: {Math.round(score * 100)}% <span className="text-muted-foreground mx-1">→</span> {spectrumPoleLabels.right}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
              );})}}
            </div></CardContent></Card>)}

      {(hasAssessmentBeenRun || activeProfile) && (
        <Card className="mt-8 glassmorphic-card">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => {
                let titleToSave = profileTitle.trim();
                if (!titleToSave && activeProfile?.id) {
                  titleToSave = activeProfile.title;
                } else if (!titleToSave) {
                  const newTitle = prompt("Enter a title for this worldview profile:", hasAssessmentBeenRun ? `Assessment - ${new Date().toLocaleDateString()}` : "My Custom Profile");
                  if (!newTitle || !newTitle.trim()) {
                    toast({ title: "Save Cancelled", description: "Profile title cannot be empty.", variant: "destructive" });
                    return;
                  }
                  titleToSave = newTitle.trim();
                  setProfileTitle(titleToSave);
                }

                if (savedWorldviews.some(p => p.title.toLowerCase() === titleToSave.toLowerCase() && p.id !== activeProfile?.id)) {
                  toast({ title: "Save Error", description: `A profile named "${titleToSave}" already exists. Please choose a different title.`, variant: "destructive" });
                  return;
                }

                const profileToSave: WorldviewProfile = {
                  id: activeProfile?.id || `assessment_${Date.now()}`,
                  title: titleToSave,
                  domainScores: activeProfile?.domainScores || domainScores, // Use the appropriate scores
                  createdAt: activeProfile?.createdAt || new Date().toISOString(),
                  summary: activeProfile?.summary || (hasAssessmentBeenRun ? "Assessment results" : "Custom profile"),
                  isArchetype: activeProfile?.isArchetype || false,
                  facetSelections: activeProfile?.facetSelections
                };
                addSavedWorldview(profileToSave);
                setIsSaved(true);
              }}
              disabled={(isSaved && activeProfile?.id ? savedWorldviews.some(p => p.id === activeProfile.id) : false) || (!hasAssessmentBeenRun && !activeProfile)}
            >
              <Icons.saved className="mr-2 h-4 w-4" />
              {(isSaved && activeProfile?.id && savedWorldviews.some(p => p.id === activeProfile.id)) ? "Profile Saved" : "Save to Library"}
            </Button>
            <Button variant="outline" disabled><Icons.download className="mr-2 h-4 w-4" /> Export PNG</Button>
            <Button variant="outline" disabled><Icons.print className="mr-2 h-4 w-4" /> Export PDF</Button>
            <Button variant="outline" disabled><Icons.share className="mr-2 h-4 w-4" /> Share Link</Button>
            <Button variant="default" asChild><Link href="/assessment"><Icons.reset className="mr-2 h-4 w-4" /> Retake Assessment</Link></Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
