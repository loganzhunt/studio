
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/triangle-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { FACETS } from "@/config/facets";

// Insight Summary View: Dynamic Domain Feedback component
function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: string, score: number, anchorLeft: string, anchorRight: string }) {
  const facetConfig = FACETS[facetName as keyof typeof FACETS];
  return (
    <div className="mb-4 p-3 rounded-md border border-border bg-card/50">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: `hsl(var(${facetConfig.colorVariable.slice(2)}))` }}>{facetName}</span>
        <span className="text-xs text-muted-foreground">{Math.round(score * 100)}%</span>
      </div>
      <div className="relative w-full h-6 bg-muted rounded overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
          style={{ width: `${score * 100}%`, backgroundColor: `hsl(var(${facetConfig.colorVariable.slice(2)}))` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{anchorLeft}</span>
        <span>{anchorRight}</span>
      </div>
    </div>
  );
}


export default function ResultsPage() {
  const { domainScores, activeProfile } = useWorldview();

  if (!domainScores || domainScores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <Icons.search className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Results Yet</h2>
        <p className="text-muted-foreground mb-4">
          Complete the assessment to see your worldview signature.
        </p>
        <Button asChild>
          <Link href="/assessment">Start Assessment</Link>
        </Button>
      </div>
    );
  }
  
  const currentTitle = activeProfile?.title || "Your Current Worldview";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Your Worldview Results</h1>
      <p className="text-xl text-muted-foreground text-center mb-8">"{currentTitle}"</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl">Facet Breakdown</CardTitle>
            <CardDescription>Your scores across the 7 worldview dimensions.</CardDescription>
          </CardHeader>
          <CardContent>
            {domainScores.map(ds => (
              <DomainFeedbackBar 
                key={ds.facetName}
                facetName={ds.facetName}
                score={ds.score}
                // Placeholder anchors - these should be dynamic or configured
                anchorLeft={`${ds.facetName} Low`} 
                anchorRight={`${ds.facetName} High`}
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
              <TriangleChart scores={domainScores} className="mx-auto" />
            </CardContent>
          </Card>
          
          {/* Placeholder for InsightPanel */}
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Insights & Reflections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Symbolic interpretations and reflective prompts will appear here.</p>
              {/* <InsightPanel scores={domainScores} /> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Placeholder for Save & Share Footer */}
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
