
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES, FacetName } from "@/config/facets"; 
import { Progress } from "@/components/ui/progress";
import { getFacetColorHsl } from '@/lib/colors';
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { WorldviewProfile } from "@/types";

const SPECTRUM_LABELS: Record<FacetName, { left: string; right: string }> = {
  Ontology: { left: "Materialism", right: "Idealism" },
  Epistemology: { left: "Empirical", right: "Revelatory" },
  Praxeology: { left: "Hierarchical", right: "Egalitarian" },
  Axiology: { left: "Individualism", right: "Collectivism" },
  Mythology: { left: "Linear", right: "Cyclical" },
  Cosmology: { left: "Mechanistic", right: "Holistic" },
  Teleology: { left: "Divine", right: "Existential" },
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
        <span className="text-sm font-medium" style={{ color: getFacetColorHsl(facetName) }}>{facetConfig.name}</span>
        <span className="text-xs font-semibold" style={{ color: getFacetColorHsl(facetName) }}>{Math.round(score * 100)}%</span>
      </div>
      <Progress value={score * 100} className="h-3" indicatorStyle={{ backgroundColor: getFacetColorHsl(facetName) }} />
      <div className="flex justify-between text-xs text-muted-foreground font-semibold mt-1">
        <span>{anchorLeft}</span>
        <span>{anchorRight}</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { domainScores, activeProfile, savedWorldviews, addSavedWorldview, hasAssessmentBeenRun } = useWorldview();
  const { toast } = useToast();
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
      // When no assessment has been run, and no active profile, use a neutral title
      setProfileTitle("Results Placeholder");
    }
  }, [activeProfile, savedWorldviews, hasAssessmentBeenRun]);


  if (!domainScores) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <Icons.loader className="w-16 h-16 text-muted-foreground mb-4 animate-spin" />
        <h2 className="text-2xl font-semibold mb-2">Loading Results...</h2>
        <p className="text-muted-foreground mb-4">
          Please wait while your worldview signature is being prepared.
        </p>
      </div>
    );
  }
  
  // Determine scores to display: actual scores if assessment run, otherwise neutral (0.5) scores
  const scoresToDisplay = hasAssessmentBeenRun 
    ? domainScores 
    : FACET_NAMES.map(name => ({ facetName: name, score: 0.5 }));
  
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl">Facet Breakdown</CardTitle>
            <CardDescription>
              {hasAssessmentBeenRun || activeProfile
                ? "Your scores across the 7 worldview dimensions." 
                : "Showing neutral baseline scores. Complete an assessment or load a profile to see a breakdown."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scoresToDisplay.map(ds => {
              const facetConfig = FACETS[ds.facetName];
              if (!facetConfig) return null;

              const labels = SPECTRUM_LABELS[ds.facetName];
              const anchorLeftText = labels ? labels.left : "Low";
              const anchorRightText = labels ? labels.right : "High";
              
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
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glassmorphic-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Your Signature</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <TriangleChart scores={scoresToDisplay} width={250} height={217} />
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Insights & Reflections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {hasAssessmentBeenRun || activeProfile 
                  ? "Symbolic interpretations and reflective prompts based on your scores will appear here."
                  : "Complete the assessment or load a profile to unlock insights."
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

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
                  domainScores: domainScores, // Use the current domainScores from context
                  createdAt: activeProfile?.createdAt || new Date().toISOString(),
                  summary: activeProfile?.summary || "Assessment results",
                  isArchetype: activeProfile?.isArchetype || false,
                  facetSelections: activeProfile?.facetSelections // Persist facet selections if they exist on activeProfile
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
