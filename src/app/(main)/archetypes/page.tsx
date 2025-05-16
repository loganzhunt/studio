"use client";

import { TriangleChart } from "@/components/triangle-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { CodexEntry, FacetName } from "@/types";
import { FACET_NAMES } from "@/config/facets";
import Link from "next/link";
import { useWorldview } from "@/hooks/use-worldview";

// Dummy data for Archetypes
const dummyArchetypes: CodexEntry[] = [
  {
    id: "the_sage",
    title: "The Sage",
    summary: "Represents wisdom, knowledge, and truth. The Sage seeks understanding and enlightenment through introspection and learning.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === "Epistemology" ? 0.9 : (name === "Ontology" ? 0.8 : Math.random() * 0.5) })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "the_explorer",
    title: "The Explorer",
    summary: "Embodies freedom, adventure, and discovery. The Explorer seeks new experiences and pushes boundaries to find authenticity.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === "Praxeology" ? 0.85 : (name === "Cosmology" ? 0.75 : Math.random() * 0.5) })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "the_lover",
    title: "The Lover",
    summary: "Represents connection, intimacy, and passion. The Lover seeks harmony in relationships and appreciates beauty and sensuality.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === "Axiology" ? 0.9 : (name === "Mythology" ? 0.8 : Math.random() * 0.5) })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
  },
   {
    id: "the_creator",
    title: "The Creator",
    summary: "Driven by imagination and the desire to innovate. The Creator seeks to bring something new into existence and values self-expression.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: name === "Mythology" ? 0.88 : (name === "Teleology" ? 0.78 : Math.random() * 0.5) })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
  }
];

// Placeholder for similarity calculation
const calculateSimilarity = (userScores: any[], archetypeScores: any[]): number => {
  // Simple dot product or cosine similarity could be used here.
  // For now, just a random number.
  return Math.random() * 70 + 30; // Random similarity between 30% and 100%
};


export default function ArchetypesPage() {
  const { domainScores: userDomainScores } = useWorldview();

  let closestArchetype = null;
  let highestSimilarity = 0;

  if (userDomainScores && userDomainScores.length > 0) {
    for (const archetype of dummyArchetypes) {
      const similarity = calculateSimilarity(userDomainScores, archetype.domainScores);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        closestArchetype = archetype;
      }
    }
  }


  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Archetypes</h1>
        <p className="text-xl text-muted-foreground">
          Explore predefined symbolic profiles and see how your worldview aligns.
        </p>
      </header>

      {closestArchetype && userDomainScores && userDomainScores.length > 0 && (
        <Card className="mb-12 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">Your Closest Archetype Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Your Signature</h3>
                <TriangleChart scores={userDomainScores} width={200} height={173} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
              </div>
              <div className="flex flex-col items-center text-center">
                <Icons.sparkles className="w-10 h-10 text-primary mb-2" />
                <p className="text-2xl font-bold text-primary">{Math.round(highestSimilarity)}%</p>
                <p className="text-muted-foreground">Exploratory Alignment</p>
                <Button variant="link" size="sm" className="mt-2">How is this calculated?</Button>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">{closestArchetype.title}</h3>
                 <TriangleChart scores={closestArchetype.domainScores} width={200} height={173} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h4 className="text-xl font-semibold">{closestArchetype.title}</h4>
              <p className="text-muted-foreground max-w-md mx-auto">{closestArchetype.summary}</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href={`/codex/${closestArchetype.id}`}>Learn more about {closestArchetype.title}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="text-3xl font-semibold mb-6 text-center">Browse Archetypal Profiles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyArchetypes.map((archetype) => (
          <Card key={archetype.id} className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">{archetype.title}</CardTitle>
              <CardDescription className="h-16 line-clamp-3">{archetype.summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
               <TriangleChart scores={archetype.domainScores} width={200} height={173} className="mx-auto mb-4 !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
              <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                <Link href={`/codex/${archetype.id}`}>
                  Explore {archetype.title} <Icons.chevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
