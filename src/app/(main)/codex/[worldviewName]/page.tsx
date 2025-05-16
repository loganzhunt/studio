"use client";

import { useParams } from 'next/navigation';
import { TriangleChart } from '@/components/triangle-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import type { CodexEntry } from '@/types';
import { FACETS, FACET_NAMES } from '@/config/facets';
import Link from 'next/link';

// Dummy data - replace with actual data fetching
const getDummyCodexEntry = (id: string): CodexEntry | null => {
  if (id === "stoicism") {
    return {
      id: "stoicism",
      title: "Stoicism",
      summary: "A philosophy of personal ethics informed by its system of logic and its views on the natural world. Emphasizes virtue, reason, and living in accordance with nature. This deep dive explores its core tenets across the 7 facets, offering insights into its approach to reality, knowledge, action, values, meaning, the cosmos, and purpose.",
      domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
      category: "philosophical",
      createdAt: new Date().toISOString(),
      tags: ["Ethics", "Virtue", "Reason", "Logic", "Nature"]
    };
  }
  return null;
};


export default function CodexDeepDivePage() {
  const params = useParams();
  const worldviewName = params.worldviewName as string; // e.g., "stoicism"
  
  // In a real app, fetch worldview data based on worldviewName
  const worldview = getDummyCodexEntry(worldviewName);

  if (!worldview) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Icons.search className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
        <h1 className="text-2xl font-semibold mb-2">Worldview Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The worldview "{worldviewName}" could not be found in the Codex.
        </p>
        <Button asChild variant="outline">
          <Link href="/codex">Back to Codex</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/codex"><Icons.chevronRight className="h-4 w-4 mr-2 rotate-180" /> Back to Codex</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Triangle and Core Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle className="text-3xl">{worldview.title}</CardTitle>
              <CardDescription className="capitalize">{worldview.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <TriangleChart scores={worldview.domainScores} className="mx-auto" />
              {worldview.tags && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Keywords:</h3>
                  <div className="flex flex-wrap gap-2">
                    {worldview.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Facet-by-Facet Analysis */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{worldview.summary}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Facet Analysis</CardTitle>
              <CardDescription>How {worldview.title} approaches each worldview dimension.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {worldview.domainScores.map(ds => {
                const facetConfig = FACETS[ds.facetName];
                return (
                  <div key={ds.facetName} className="p-4 rounded-md border border-border bg-background/30">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-semibold" style={{color: `hsl(var(${facetConfig.colorVariable.slice(2)}))`}}>
                        {ds.facetName}
                      </h3>
                      <span className="text-sm font-bold" style={{color: `hsl(var(${facetConfig.colorVariable.slice(2)}))`}}>{Math.round(ds.score * 100)}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{facetConfig.tagline}</p>
                    {/* Placeholder for mini-description per domain specific to this worldview */}
                    <p className="text-sm text-muted-foreground">
                      Detailed analysis of how {worldview.title} addresses {ds.facetName.toLowerCase()}... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
