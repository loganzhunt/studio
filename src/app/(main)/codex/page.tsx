import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TriangleChart } from "@/components/triangle-chart";
import type { CodexEntry, FacetName } from "@/types";
import { FACET_NAMES } from "@/config/facets";
import Link from "next/link";

// Dummy data for Codex entries
const dummyCodexEntries: CodexEntry[] = [
  {
    id: "stoicism",
    title: "Stoicism",
    summary: "A philosophy of personal ethics informed by its system of logic and its views on the natural world. Emphasizes virtue, reason, and living in accordance with nature.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
    category: "philosophical",
    createdAt: new Date().toISOString(),
    tags: ["Ethics", "Virtue", "Reason"]
  },
  {
    id: "buddhism",
    title: "Buddhism",
    summary: "A path of practice and spiritual development leading to Insight into the true nature of reality. Practices like meditation are means of changing yourself in order to develop the qualities of awareness, kindness, and wisdom.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
    category: "religious",
    createdAt: new Date().toISOString(),
    tags: ["Spiritual", "Meditation", "Enlightenment"]
  },
  {
    id: "existentialism",
    title: "Existentialism",
    summary: "A form of philosophical inquiry that explores the problem of human existence and centers on the lived experience of the thinking, feeling, acting individual.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
    category: "philosophical",
    createdAt: new Date().toISOString(),
    tags: ["Freedom", "Responsibility", "Meaning"]
  },
  {
    id: "the_hero",
    title: "The Hero Archetype",
    summary: "Represents the drive for mastery and competence. The Hero strives to prove their worth through courageous acts.",
    domainScores: FACET_NAMES.map(name => ({ facetName: name, score: Math.random() })),
    category: "archetypal",
    isArchetype: true,
    createdAt: new Date().toISOString(),
    tags: ["Courage", "Strength", "Mastery"]
  }
];


function CodexCard({ entry }: { entry: CodexEntry }) {
  // Determine dominant facet for title color (simplified)
  const dominantFacet = entry.domainScores.reduce((max, current) => current.score > max.score ? current : max, entry.domainScores[0]);
  const facetColors: Record<string, string> = { // Should come from config
    Ontology: "text-[hsl(var(--domain-ontology))]",
    Epistemology: "text-[hsl(var(--domain-epistemology))]",
    Praxeology: "text-[hsl(var(--domain-praxeology))]",
    Axiology: "text-[hsl(var(--domain-axiology))]",
    Mythology: "text-[hsl(var(--domain-mythology))]",
    Cosmology: "text-[hsl(var(--domain-cosmology))]",
    Teleology: "text-[hsl(var(--domain-teleology))]",
  };
  const titleColorClass = facetColors[dominantFacet.facetName] || "text-primary";
  
  return (
    <Card className="flex flex-col overflow-hidden glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader>
        <CardTitle className={`text-xl ${titleColorClass}`}>{entry.title}</CardTitle>
        <CardDescription className="h-16 line-clamp-3">{entry.summary}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="mb-4">
         <TriangleChart scores={entry.domainScores} width={200} height={173} className="mx-auto !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
        </div>
        <div className="mt-auto">
          {entry.tags && (
            <div className="mb-3 space-x-1 space-y-1">
              {entry.tags.slice(0,3).map(tag => (
                <span key={tag} className="inline-block bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">#{tag}</span>
              ))}
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/codex/${entry.id}`}>
              Facet Details <Icons.chevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


export default function CodexPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">The Codex</h1>
        <p className="text-xl text-muted-foreground">
          Explore a library of worldviews, philosophies, and archetypal patterns.
        </p>
      </header>

      {/* Filter and Search Section */}
      <Card className="mb-8 p-6 glassmorphic-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Label htmlFor="search-codex" className="block text-sm font-medium mb-1">Search Codex</Label>
            <Input id="search-codex" placeholder="Search by keyword, title, or tag..." className="bg-background/50" />
          </div>
          <div>
            <Label htmlFor="sort-codex" className="block text-sm font-medium mb-1">Sort By</Label>
            <Select>
              <SelectTrigger id="sort-codex" className="bg-background/50">
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="az">Alphabetical (A-Z)</SelectItem>
                <SelectItem value="dominant_facet">Dominant Facet</SelectItem>
                <SelectItem value="category">Tradition Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm"><Icons.filter className="mr-1.5 h-4 w-4"/>All</Button>
          <Button variant="ghost" size="sm">Philosophical</Button>
          <Button variant="ghost" size="sm">Religious</Button>
          <Button variant="ghost" size="sm">Archetypal</Button>
        </div>
      </Card>

      {/* Codex Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyCodexEntries.map((entry) => (
          <CodexCard key={entry.id} entry={entry} />
        ))}
      </div>
       {/* Pagination Placeholder */}
      <div className="mt-12 flex justify-center">
        <Button variant="outline" className="mr-2">Previous</Button>
        <span className="p-2 text-muted-foreground">Page 1 of X</span>
        <Button variant="outline" className="ml-2">Next</Button>
      </div>
    </div>
  );
}

// Add Label component if not globally available
const Label = ({htmlFor, className, children}: {htmlFor: string, className?: string, children: React.ReactNode}) => (
  <label htmlFor={htmlFor} className={className}>{children}</label>
);
