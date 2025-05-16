"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { TriangleChart } from "@/components/triangle-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";

// Re-using DomainFeedbackBar from results for consistency, can be componentized
function DomainFeedbackBar({ facetName, score, anchorLeft, anchorRight }: { facetName: string, score: number, anchorLeft: string, anchorRight: string }) {
  // This should ideally come from a shared config
  const facetColors: Record<string, string> = {
    Ontology: "hsl(var(--domain-ontology))",
    Epistemology: "hsl(var(--domain-epistemology))",
    Praxeology: "hsl(var(--domain-praxeology))",
    Axiology: "hsl(var(--domain-axiology))",
    Mythology: "hsl(var(--domain-mythology))",
    Cosmology: "hsl(var(--domain-cosmology))",
    Teleology: "hsl(var(--domain-teleology))",
  };
  const color = facetColors[facetName] || "hsl(var(--primary))";

  return (
    <div className="mb-4 p-3 rounded-md border border-border bg-card/50">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color }}>{facetName}</span>
        <span className="text-xs text-muted-foreground">{Math.round(score * 100)}%</span>
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


export default function DashboardPage() {
  const { domainScores, activeProfile, savedWorldviews } = useWorldview();

  const currentTitle = activeProfile?.title || "Your Latest Worldview";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Icons.assessment className="w-5 h-5 text-primary"/> Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Ready to explore your worldview or refine your current understanding?</p>
            <Button asChild className="w-full"><Link href="/assessment">Start/Retake Assessment</Link></Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Icons.builder className="w-5 h-5 text-primary"/> Builder Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Craft a custom worldview by selecting systems from the Codex.</p>
            <Button asChild className="w-full" variant="outline"><Link href="/builder">Open Builder</Link></Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Icons.saved className="w-5 h-5 text-primary"/> Saved Worldviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You have {savedWorldviews.length} saved profile(s).</p>
            <Button asChild className="w-full" variant="outline"><Link href="/saved-worldviews">View Saved</Link></Button>
          </CardContent>
        </Card>
      </div>
      
      {domainScores && domainScores.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glassmorphic-card">
            <CardHeader>
              <CardTitle className="text-2xl">Latest Profile: "{currentTitle}"</CardTitle>
              <CardDescription>A summary of your most recent worldview assessment or creation.</CardDescription>
            </CardHeader>
            <CardContent>
              {domainScores.map(ds => (
                <DomainFeedbackBar 
                  key={ds.facetName}
                  facetName={ds.facetName}
                  score={ds.score}
                  anchorLeft={`${ds.facetName} Low`}
                  anchorRight={`${ds.facetName} High`}
                />
              ))}
              <Button asChild className="mt-4"><Link href="/results">View Full Results</Link></Button>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-2xl">Your Signature</CardTitle>
                 <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => alert("Export options placeholder")}>
                  <Icons.share className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <TriangleChart scores={domainScores} className="mx-auto" />
                <div className="mt-4 flex flex-col space-y-2">
                   <Button variant="outline" size="sm"><Icons.edit className="mr-2 h-4 w-4" /> Edit Selections</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Placeholder for InsightPanel */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Key takeaways and reflection prompts will appear here.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
         <Card className="glassmorphic-card text-center py-12">
            <CardHeader>
              <Icons.search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-2xl">No Active Worldview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Complete an assessment or build a worldview to see your signature here.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild><Link href="/assessment">Start Assessment</Link></Button>
                <Button variant="outline" asChild><Link href="/builder">Go to Builder</Link></Button>
              </div>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
