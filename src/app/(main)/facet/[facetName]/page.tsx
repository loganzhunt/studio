"use client";

import { useParams } from 'next/navigation';
import { FACETS, FACET_NAMES } from '@/config/facets';
import type { Facet, FacetName } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { FacetIcon } from '@/components/facet-icon';
import { TriangleChart } from '@/components/triangle-chart'; // Re-used for example worldviews
import type { CodexEntry } from '@/types';
import Link from 'next/link';

// Dummy data for worldview options related to a facet
const getDummyWorldviewsForFacet = (facetName: FacetName): CodexEntry[] => {
  return [
    { id: `${facetName.toLowerCase()}_view1`, title: `${facetName} System Alpha`, summary: `An approach to ${facetName.toLowerCase()} emphasizing certain principles.`, domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === facetName ? 0.9 : Math.random() * 0.5 })), category: "philosophical", createdAt: new Date().toISOString() },
    { id: `${facetName.toLowerCase()}_view2`, title: `${facetName} System Beta`, summary: `Another perspective on ${facetName.toLowerCase()} with different implications.`, domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === facetName ? 0.8 : Math.random() * 0.6 })), category: "philosophical", createdAt: new Date().toISOString() },
    { id: `${facetName.toLowerCase()}_view3`, title: `${facetName} Tradition Gamma`, summary: `A traditional framework for understanding ${facetName.toLowerCase()}.`, domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === facetName ? 0.85 : Math.random() * 0.4 })), category: "religious", createdAt: new Date().toISOString() },
  ];
};


export default function FacetPage() {
  const params = useParams();
  // Capitalize first letter for matching with FACETS keys
  const facetNameParam = params.facetName as string;
  const capitalizedFacetName = facetNameParam.charAt(0).toUpperCase() + facetNameParam.slice(1) as FacetName;
  
  const facet = FACETS[capitalizedFacetName];

  if (!facet) {
    return <div className="container mx-auto py-8 text-center">Facet not found.</div>;
  }

  const worldviewOptions = getDummyWorldviewsForFacet(facet.name);
  // Placeholder for selected worldview for this facet
  const selectedWorldviewId = `${facet.name.toLowerCase()}_view1`; // Example: first one is selected

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <FacetIcon facetName={facet.name} className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2" style={{ color: `hsl(var(${facet.colorVariable.slice(2)}))` }}>
          {facet.name}
        </h1>
        <p className="text-xl text-muted-foreground">{facet.tagline}</p>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">{facet.description}</p>
      </header>

      <Card className="glassmorphic-card mb-8">
        <CardHeader>
          <CardTitle>Select Your Perspective on {facet.name}</CardTitle>
          <CardDescription>Choose one worldview that best represents your current understanding for this facet. This will be part of your active worldview profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Currently selected for {facet.name}: <span className="font-semibold text-primary">{worldviewOptions.find(w => w.id === selectedWorldviewId)?.title || "None"}</span>
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {worldviewOptions.map(worldview => {
          const isSelected = worldview.id === selectedWorldviewId;
          return (
            <Card 
              key={worldview.id} 
              className={`overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-all duration-300 ${isSelected ? 'ring-2 ring-primary shadow-primary/30' : 'ring-1 ring-transparent'}`}
            >
              <CardHeader>
                <CardTitle className="text-lg">{worldview.title}</CardTitle>
                <CardDescription className="h-12 line-clamp-2">{worldview.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                 <TriangleChart scores={worldview.domainScores} width={150} height={130} className="mx-auto mb-4 !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
                <div className="flex flex-col space-y-2">
                  <Button variant={isSelected ? "default" : "outline"} size="sm" className="w-full">
                    {isSelected && <Icons.check className="mr-2 h-4 w-4" />}
                    {isSelected ? 'Selected' : 'Select this View'}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground" asChild>
                    <Link href={`/codex/${worldview.id}`}>Learn More <Icons.chevronRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link href="/builder">
            <Icons.builder className="mr-2 h-5 w-5" /> Review All Facet Selections (in Builder)
          </Link>
        </Button>
      </div>
    </div>
  );
}
