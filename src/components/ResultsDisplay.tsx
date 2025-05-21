// src/components/ResultsDisplay.tsx
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getFacetColorHsl } from '@/lib/colors';
import { FACETS, FACET_NAMES, FacetName } from "@/config/facets";
import type { WorldviewProfile } from "@/types";

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
        <span className="text-sm font-medium" style={{ color: getFacetColorHsl(facetName) }}>{facetConfig.name}</span>
        <span className="text-xs font-semibold" style={{ color: getFacetColorHsl(facetName) }}>{Math.round(score * 100)}%</span>
      </div>
      <Progress value={score * 100} className="h-3" indicatorStyle={{ backgroundColor: getFacetColorHsl(facetName) }} />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span className="font-semibold">{anchorLeft}</span>
        <span className="font-semibold">{anchorRight}</span>
      </div>
    </div>
  );
}


interface ResultsDisplayProps {
    activeProfile: WorldviewProfile | null;
    domainScores: { facetName: FacetName; score: number }[];
    hasAssessmentBeenRun: boolean;
}

export default function ResultsDisplay({ activeProfile, domainScores, hasAssessmentBeenRun }: ResultsDisplayProps) {
    const currentScoresToDisplay = useMemo(() => {
        if (activeProfile?.domainScores) return activeProfile.domainScores;
        if (hasAssessmentBeenRun && domainScores && domainScores.length > 0) return domainScores;
        return FACET_NAMES.map(name => ({ facetName: name, score: 0.5 })); // Neutral scores for placeholder
    }, [activeProfile, domainScores, hasAssessmentBeenRun]);

    if (!currentScoresToDisplay) { // Should almost never happen with the default above
        return null; // Or a loading spinner specific to this component
    }

    return (
        <>
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
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="glassmorphic-card">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Your Signature</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center">
                            <TriangleChart scores={currentScoresToDisplay} width={250} height={217} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
                        </CardContent>
                    </Card>

                    <Card className="glassmorphic-card">
                        <CardHeader>
                            <CardTitle>Insights & Reflections</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {hasAssessmentBeenRun || activeProfile
                                    ? "Explore your dashboard for detailed insights and archetype comparisons. You can also delve deeper into each facet through the 'Facet Deep Dive' pages."
                                    : "Complete the assessment or load a profile to unlock insights."
                                }
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}