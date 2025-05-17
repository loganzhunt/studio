
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES } from "@/config/facets";
import type { DomainScore, FacetName } from "@/types";

// Re-using DomainFeedbackBar from results for consistency, can be componentized
function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight, isPlaceholder = false }: { facetName: string, score: number, anchorLeft: string, anchorRight: string, isPlaceholder?: boolean }) {
  const facetConfig = FACETS[facetName as FacetName];
  if (!facetConfig) return null;

  const color = `hsl(var(${facetConfig.colorVariable.slice(2)}))`;

  return (
    <div className="mb-4 p-3 rounded-md border border-border bg-card/50">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color }}>{facetName}</span>
        {isPlaceholder ? (
          <span className="text-xs text-muted-foreground">--%</span>
        ) : (
          <span className="text-xs text-muted-foreground">{Math.round(score * 100)}%</span>
        )}
      </div>
      <div className="relative w-full h-6 bg-muted rounded overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
          style={{ width: `${score * 100}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{anchorLeft}</span>
        <span>{anchorRight}</span>
      </div>
    </div>
  );
}

const NEUTRAL_SCORES: DomainScore[] = FACET_NAMES.map(name => ({ facetName: name, score: 0.5 }));

export default function DashboardPage() {
  const { domainScores, activeProfile } = useWorldview();

  const hasActualScores = domainScores && domainScores.some(ds => ds.score !== 0) && domainScores.length === FACET_NAMES.length;

  const currentTitle = activeProfile?.title || (hasActualScores ? "Your Latest Worldview" : "Your Worldview Signature");
  const displayScores = hasActualScores ? domainScores : NEUTRAL_SCORES;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      
      {/* Your Signature Card - Always shows, with placeholder or actual data */}
      <div className="flex justify-center">
        <Card className="w-full max-w-lg glassmorphic-card">
          <CardHeader className="relative">
            <CardTitle className="text-2xl text-center">{currentTitle}</CardTitle>
            {hasActualScores && (
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => alert("Export options placeholder")}>
                <Icons.share className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <TriangleChart scores={displayScores} className="mx-auto mb-6" interactive={hasActualScores} />
            {!hasActualScores && (
              <p className="text-sm text-muted-foreground text-center mb-4">
                Your results will appear here once you complete the assessment.
              </p>
            )}
            {hasActualScores ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/builder"><Icons.edit className="mr-2 h-4 w-4" /> Edit Selections</Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/assessment"><Icons.assessment className="mr-2 h-4 w-4" /> Begin Assessment</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Explanatory text if no actual scores */}
      {!hasActualScores && (
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            Complete the Meta-Prism assessment to visualize your unique worldview signature, explore detailed facet breakdowns, and compare with philosophical archetypes.
          </p>
        </div>
      )}

      {/* Grid for Profile Details (Facet Bars) and Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl">
              {hasActualScores ? `Profile Detail: "${activeProfile?.title || "Latest Assessment"}"` : "Facet Spectrum Overview"}
            </CardTitle>
            <CardDescription>
              {hasActualScores 
                ? "A summary of your scores across the 7 worldview dimensions." 
                : "Take the assessment to discover your scores on each facet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayScores.map(ds => {
              const facetConfig = FACETS[ds.facetName];
              return (
                <DomainFeedbackBar 
                  key={ds.facetName}
                  facetName={ds.facetName}
                  score={ds.score}
                  anchorLeft={hasActualScores ? `${facetConfig.name} Low` : "Low"} 
                  anchorRight={hasActualScores ? `${facetConfig.name} High` : "High"}
                  isPlaceholder={!hasActualScores}
                />
              );
            })}
            {hasActualScores && (
              <Button asChild className="mt-4"><Link href="/results">View Full Results Analysis</Link></Button>
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle>Quick Insights & Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            {hasActualScores ? (
              <p className="text-muted-foreground">Key takeaways, reflection prompts, and archetype comparisons will appear here.</p>
              // Placeholder for future comparison tools or sliders
            ) : (
              <>
                <p className="text-muted-foreground mb-4">Complete the assessment to unlock comparison features and personalized insights.</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/assessment">
                    <Icons.sparkles className="mr-2 h-4 w-4" /> Unlock Insights
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
