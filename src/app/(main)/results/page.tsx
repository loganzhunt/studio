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

function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: FacetName, score: number, anchorLeft: string, anchorRight: string }) {
  const facetConfig = FACETS[facetName];
  if (!facetConfig) {
    // console.warn(`DomainFeedbackBar: Facet configuration for ${facetName} not found.`);
    return null; // Or some fallback UI
  }
  const colorHsl = getFacetColorHsl(facetName);

  return (
    <div className="mb-4 p-3 rounded-md border border-border/30 bg-background/40">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: colorHsl }}>{facetConfig.name}</span>
        <span className="text-xs font-semibold" style={{ color: colorHsl }}>{Math.round(score * 100)}%</span>
      </div>
      <Progress value={score * 100} className="h-3" indicatorStyle={{ backgroundColor: colorHsl }} />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{anchorLeft}</span>
        <span>{anchorRight}</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { domainScores, activeProfile, savedWorldviews, addSavedWorldview } = useWorldview();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [profileTitle, setProfileTitle] = useState(activeProfile?.title || "My Assessment Results");

  useEffect(() => {
    if (activeProfile?.id) {
      setIsSaved(savedWorldviews.some(p => p.id === activeProfile.id));
      setProfileTitle(activeProfile.title);
    } else {
      setIsSaved(false); // Fresh assessment result isn't "saved" yet by ID
      setProfileTitle(`Assessment - ${new Date().toLocaleDateString()}`);
    }
  }, [activeProfile, savedWorldviews]);

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
  
  // Check if an assessment has been taken by seeing if any score is different from the initial context default (0)
  // or the dashboard placeholder (0.5). For results page, we expect calculated scores.
  const hasTakenAssessment = domainScores.some(ds => ds.score !== 0); 

  const handleSaveResults = () => {
    let titleToSave = profileTitle.trim();
    if (!titleToSave && !activeProfile?.id) { // Only prompt for new assessments
        const newTitle = prompt("Enter a title for this worldview profile:", `Assessment - ${new Date().toLocaleDateString()}`);
        if (!newTitle || !newTitle.trim()) {
            toast({ title: "Save Cancelled", description: "Profile title cannot be empty.", variant: "destructive" });
            return;
        }
        titleToSave = newTitle.trim();
        setProfileTitle(titleToSave); // Update local state if prompted
    } else if (!titleToSave && activeProfile?.id) {
        titleToSave = activeProfile.title; // Use existing title if loaded profile
    }


    // Check for duplicate titles if it's a new save or if the title has changed
    if (savedWorldviews.some(p => p.title.toLowerCase() === titleToSave.toLowerCase() && p.id !== activeProfile?.id)) {
        toast({ title: "Save Error", description: `A profile named "${titleToSave}" already exists. Please choose a different title.`, variant: "destructive" });
        return;
    }

    const profileToSave: WorldviewProfile = {
      id: activeProfile?.id || `assessment_${Date.now()}`, // Use existing ID or generate new one
      title: titleToSave,
      domainScores: domainScores,
      createdAt: activeProfile?.createdAt || new Date().toISOString(),
      summary: activeProfile?.summary || "Assessment results",
      isArchetype: activeProfile?.isArchetype || false,
      // facetSelections are not typically part of direct assessment results unless loaded from builder
    };

    addSavedWorldview(profileToSave); // This function in context now handles toasts
    setIsSaved(true); // Assume save is successful, context handles toast
  };


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Your Worldview Results</h1>
      <p className="text-xl text-muted-foreground text-center mb-8">"{profileTitle}"</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl">Facet Breakdown</CardTitle>
            <CardDescription>
              {hasTakenAssessment 
                ? "Your scores across the 7 worldview dimensions." 
                : "Complete an assessment to see your breakdown."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {domainScores.map(ds => (
              <DomainFeedbackBar 
                key={ds.facetName}
                facetName={ds.facetName}
                score={ds.score}
                anchorLeft={hasTakenAssessment && FACETS[ds.facetName] ? `${FACETS[ds.facetName].name} Low` : "Spectrum Low"}
                anchorRight={hasTakenAssessment && FACETS[ds.facetName] ? `${FACETS[ds.facetName].name} High` : "Spectrum High"}
              />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glassmorphic-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Your Signature</CardTitle>
            </CardHeader>
            <CardContent>
              <TriangleChart scores={domainScores} width={250} height={217} className="mx-auto !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Insights & Reflections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {hasTakenAssessment 
                  ? "Symbolic interpretations and reflective prompts based on your scores will appear here."
                  : "Complete the assessment to unlock insights."
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8 glassmorphic-card">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={handleSaveResults} disabled={isSaved && activeProfile?.id ? savedWorldviews.some(p => p.id === activeProfile.id) : false}>
            <Icons.saved className="mr-2 h-4 w-4" /> 
            {isSaved && activeProfile?.id ? (savedWorldviews.some(p => p.id === activeProfile.id) ? "Profile Saved" : "Save to Library") : "Save to Library"}
          </Button>
          {/* Placeholder buttons, functionality not implemented in this step */}
          <Button variant="outline" disabled><Icons.download className="mr-2 h-4 w-4" /> Export PNG</Button>
          <Button variant="outline" disabled><Icons.print className="mr-2 h-4 w-4" /> Export PDF</Button>
          <Button variant="outline" disabled><Icons.share className="mr-2 h-4 w-4" /> Share Link</Button>
          <Button variant="default" asChild><Link href="/assessment"><Icons.reset className="mr-2 h-4 w-4" /> Retake Assessment</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}