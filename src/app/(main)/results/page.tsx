
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/visualization/TriangleChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS, FACET_NAMES, FacetName } from "@/config/facets"; // Ensure FacetName is imported if used directly
import { Progress } from "@/components/ui/progress";
import { getFacetColorHsl } from '@/lib/colors';


// DomainFeedbackBar component, consistent with dashboard
function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: FacetName, score: number, anchorLeft: string, anchorRight: string }) {
  const facetConfig = FACETS[facetName];
  if (!facetConfig) {
    console.warn(`DomainFeedbackBar: Facet configuration for ${facetName} not found.`);
    return null;
  }
  const colorHsl = getFacetColorHsl(facetName);

  return (
    <div className="mb-4 p-3 rounded-md border border-border/30 bg-background/40">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: colorHsl }}>{facetName}</span>
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
  const { domainScores, activeProfile } = useWorldview();

  // If domainScores aren't loaded yet (e.g. context not initialized, which shouldn't happen)
  // or if it's an empty array for some unexpected reason.
  if (!domainScores || domainScores.length === 0) {
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
  
  const currentTitle = activeProfile?.title || "Your Current Worldview";
  const hasTakenAssessment = domainScores.some(ds => ds.score !== 0.5); // Check if any score differs from default 0.5

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Your Worldview Results</h1>
      <p className="text-xl text-muted-foreground text-center mb-8">"{currentTitle}"</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl">Facet Breakdown</CardTitle>
            <CardDescription>
              {hasTakenAssessment 
                ? "Your scores across the 7 worldview dimensions." 
                : "Placeholder scores. Complete the assessment to see your true breakdown."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {domainScores.map(ds => (
              <DomainFeedbackBar 
                key={ds.facetName}
                facetName={ds.facetName}
                score={ds.score}
                anchorLeft={hasTakenAssessment ? `${FACETS[ds.facetName]?.name || ds.facetName} Low` : "Spectrum Low"}
                anchorRight={hasTakenAssessment ? `${FACETS[ds.facetName]?.name || ds.facetName} High` : "Spectrum High"}
              />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glassmorphic-card">
            <CardHeader>
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
          <Button variant="outline"><Icons.saved className="mr-2 h-4 w-4" /> Save to Library</Button>
          <Button variant="outline"><Icons.download className="mr-2 h-4 w-4" /> Export PNG</Button>
          <Button variant="outline"><Icons.print className="mr-2 h-4 w-4" /> Export PDF</Button>
          <Button variant="outline"><Icons.share className="mr-2 h-4 w-4" /> Share Link</Button>
          <Button variant="default" asChild><Link href="/assessment"><Icons.reset className="mr-2 h-4 w-4" /> Retake Assessment</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
