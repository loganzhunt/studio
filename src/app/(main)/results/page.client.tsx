"use client";

import { useWorldview } from "@/hooks/use-worldview";
import TriangleChart from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS } from "@/config/facets";
import { useFacetNames } from "@/providers/facet-provider";
import type { FacetName } from '@/types';
import { Progress } from "@/components/ui/progress";
import { getFacetClass, FACET_INFO } from '@/lib/facet-colors';
import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { WorldviewProfile } from "@/types";
import { GlassCard, PrismButton, SpectrumBar } from '@/components/glass-components';

const SPECTRUM_LABELS: Record<FacetName, { left: string; right: string }> = {
  Ontology: { left: "Materialism", right: "Idealism" },
  Epistemology: { left: "Empirical", right: "Revelatory" },
  Praxeology: { left: "Hierarchical", right: "Egalitarian" },
  Axiology: { left: "Individualism", right: "Collectivism" },
  Mythology: { left: "Linear", right: "Cyclical" },
  Cosmology: { left: "Mechanistic", right: "Holistic" },
  Teleology: { left: "Existential", right: "Divine" },
};

function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: FacetName, score: number, anchorLeft: string, anchorRight: string }) {
  const facetConfig = FACETS[facetName];
  if (!facetConfig) {
    console.warn(`Facet configuration not found for: ${facetName} in DomainFeedbackBar`);
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded-md border border-border/30 bg-background/40">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium ${getFacetClass('text', facetName.toLowerCase() as any, '700')}`}>{facetConfig.name}</span>
        <span className={`text-xs font-semibold ${getFacetClass('text', facetName.toLowerCase() as any, '800')}`}>{Math.round(score * 100)}%</span>
      </div>
      <Progress 
        value={score * 100} 
        className="h-3"
        indicatorClassName={getFacetClass('bg', facetName.toLowerCase() as any, '600')}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span className="font-semibold">{anchorLeft}</span>
        <span className="font-semibold">{anchorRight}</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { domainScores, activeProfile, savedWorldviews, addSavedWorldview, hasAssessmentBeenRun } = useWorldview();
  const { toast } = useToast();
  const facetNames = useFacetNames();
  const [isSaved, setIsSaved] = useState(false);
  const [profileTitle, setProfileTitle] = useState(activeProfile?.title || "My Assessment Results");

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

  const currentScoresToDisplay = useMemo(() => {
    if (activeProfile?.domainScores) return activeProfile.domainScores;
    if (hasAssessmentBeenRun && domainScores && domainScores.length > 0) return domainScores;
    return Array.isArray(facetNames) && facetNames.length > 0 ? facetNames.map(name => ({ facetName: name, score: 0.5 })) : []; // Neutral scores for placeholder
  }, [activeProfile, domainScores, hasAssessmentBeenRun, facetNames]);

  const displayTitle = activeProfile?.title || (hasAssessmentBeenRun ? profileTitle : "Neutral Baseline");

  if (!currentScoresToDisplay) { // Should almost never happen with the default above
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <Icons.loader className="w-16 h-16 text-muted-foreground mb-4 animate-spin" />
        <h2 className="text-2xl font-semibold mb-2">Loading Results...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Worldview Results</h1>
        <p className="text-xl text-muted-foreground">"{displayTitle}"</p>
        <SpectrumBar className="mt-4 mx-auto w-48" />
      </div>

      {!hasAssessmentBeenRun && !activeProfile && (
        <GlassCard className="mb-8 text-center" animated>
          <h2 className="text-xl text-primary font-semibold">No Assessment Taken</h2>
          <p className="text-muted-foreground my-2">Complete the assessment to see your personalized results.</p>
          <PrismButton asChild>
            <Link href="/assessment">
              <Icons.assessment className="mr-2 h-4 w-4" />
              Begin Assessment
            </Link>
          </PrismButton>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2" animated>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Facet Breakdown</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {hasAssessmentBeenRun || activeProfile
                ? "Your scores across the 7 worldview dimensions."
                : "Showing neutral baseline scores. Complete an assessment or load a profile to see a breakdown."
              }
            </p>
          </div>
          <div>
            {currentScoresToDisplay.map(ds => {
              const facetConfig = FACETS[ds.facetName];
              if (!facetConfig) return null;

              const labels = SPECTRUM_LABELS[ds.facetName];
              const anchorLeftText = labels ? labels.left : "Spectrum Low";
              const anchorRightText = labels ? labels.right : "Spectrum High";

              return (
                <DomainFeedbackBar
                  key={ds.facetName}
                  facetName={ds.facetName}
                  score={ds.score}
                  anchorLeft={anchorLeftText}
                  anchorRight={anchorRightText}
                />
              );
            })}
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard animated>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Your Signature</h2>
            </div>
            <div className="flex justify-center items-center">
              <TriangleChart scores={currentScoresToDisplay} worldviewName="Your Assessment" width={250} height={217} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
            </div>
          </GlassCard>

          <GlassCard animated>
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Insights & Reflections</h3>
            </div>
            <div>
              <p className="text-muted-foreground">
                {hasAssessmentBeenRun || activeProfile
                  ? "Explore your dashboard for detailed insights and archetype comparisons. You can also delve deeper into each facet through the 'Facet Deep Dive' pages."
                  : "Complete the assessment or load a profile to unlock insights."
                }
              </p>
               {(hasAssessmentBeenRun || activeProfile) && (
                 <PrismButton asChild variant="secondary" className="mt-4 w-full">
                   <Link href="/dashboard">
                     Go to Dashboard
                     <Icons.chevronRight className="ml-1 h-4 w-4" />
                   </Link>
                 </PrismButton>
               )}
            </div>
          </GlassCard>
        </div>
      </div>

      {(hasAssessmentBeenRun || activeProfile) && (
        <GlassCard className="mt-8" animated>
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Actions</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <PrismButton
              variant="secondary"
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
                  domainScores: currentScoresToDisplay, // Use the scores currently being displayed
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
            </PrismButton>
            <PrismButton variant="ghost" disabled>
              <Icons.download className="mr-2 h-4 w-4" />
              Export PNG
            </PrismButton>
            <PrismButton variant="ghost" disabled>
              <Icons.print className="mr-2 h-4 w-4" />
              Export PDF
            </PrismButton>
            <PrismButton variant="ghost" disabled>
              <Icons.share className="mr-2 h-4 w-4" />
              Share Link
            </PrismButton>
            <PrismButton asChild>
              <Link href="/assessment">
                <Icons.reset className="mr-2 h-4 w-4" />
                Retake Assessment
              </Link>
            </PrismButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
