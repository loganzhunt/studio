
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Icons } from '@/components/icons';
import { FACETS, FACET_NAMES } from '@/config/facets';
import { FacetIcon } from '@/components/facet-icon';
import { TriangleChart } from '@/components/visualization/TriangleChart';
import { GlassCard } from '@/components/glass-card';
import { Badge } from '@/components/ui/badge'; // Added Badge import
import type { DomainScore } from '@/types'; // Added DomainScore type import

// Data for Featured Worldviews
const featuredWorldviewsData: Array<{
  id: string;
  title: string;
  summary: string;
  category: string;
  domainScores: DomainScore[];
}> = [
  {
    id: "stoicism",
    title: "Stoicism",
    summary: "A philosophy of rational resilience and self-mastery, emphasizing virtue and acceptance of nature.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.65 },
      { facetName: "Epistemology", score: 0.7 },
      { facetName: "Praxeology", score: 0.9 },
      { facetName: "Axiology", score: 0.85 },
      { facetName: "Mythology", score: 0.4 },
      { facetName: "Cosmology", score: 0.7 },
      { facetName: "Teleology", score: 0.7 },
    ],
  },
  {
    id: "buddhism",
    title: "Buddhism",
    summary: "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering.",
    category: "Spiritual",
    domainScores: [
      { facetName: "Ontology", score: 0.4 },
      { facetName: "Epistemology", score: 0.8 },
      { facetName: "Praxeology", score: 0.9 },
      { facetName: "Axiology", score: 0.75 },
      { facetName: "Mythology", score: 0.7 },
      { facetName: "Cosmology", score: 0.7 },
      { facetName: "Teleology", score: 0.85 },
    ],
  },
  {
    id: "existentialism",
    title: "Existentialism",
    summary: "Focuses on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.5 },
      { facetName: "Epistemology", score: 0.6 },
      { facetName: "Praxeology", score: 0.8 },
      { facetName: "Axiology", score: 0.65 },
      { facetName: "Mythology", score: 0.25 },
      { facetName: "Cosmology", score: 0.4 },
      { facetName: "Teleology", score: 0.6 },
    ],
  },
  {
    id: "animism",
    title: "Animism",
    summary: "Sees spirit or consciousness present in all beings, places, and phenomena, emphasizing reciprocity.",
    category: "Indigenous",
    domainScores: [
      { facetName: "Ontology", score: 0.8 },
      { facetName: "Epistemology", score: 0.6 },
      { facetName: "Praxeology", score: 0.7 },
      { facetName: "Axiology", score: 0.7 },
      { facetName: "Mythology", score: 0.9 },
      { facetName: "Cosmology", score: 0.75 },
      { facetName: "Teleology", score: 0.6 },
    ],
  }
];


export default function HomePage() {
  const howItWorksSteps = [
    {
      icon: Icons.assessment,
      title: "1. Answer Questions",
      description: "Engage with thought-provoking questions across 7 dimensions of your worldview."
    },
    {
      icon: Icons.results,
      title: "2. Generate Your Map",
      description: "Visualize your unique worldview signature as a symbolic Meta-Prism."
    },
    {
      icon: Icons.archetypes,
      title: "3. Reflect & Compare",
      description: "Explore insights, compare with archetypes, and discover new perspectives."
    }
  ];

  return (
    <div className="flex flex-col"> {/* Removed min-h-screen, as RootLayout handles it */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center bg-gradient-to-br from-background via-card to-background">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url('https://via.placeholder.com/10x10.png/000000/FFFFFF?text=+')", 
              backgroundRepeat: 'repeat',
              backgroundSize: '40px 40px', 
              maskImage: 'radial-gradient(circle at center, white 20%, transparent 70%)'
            }}
          />
          <div className="container mx-auto relative z-10">
            <div className="mx-auto mb-8 h-24 w-24">
              <Icons.logo className="h-full w-full text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
              Discover Your Meta-Prism
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              A symbolic self-assessment tool for exploring how you construct reality.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary px-6 py-2.5 text-base font-medium shadow-md hover:shadow-primary/30 transition-all duration-300 group"
              asChild
            >
              <Link href="/assessment">
                <Icons.sparkles className="mr-2 h-5 w-5 text-primary/80 group-hover:text-primary transition-colors" />
                Begin Your Journey
              </Link>
            </Button>
          </div>
        </section>

        {/* Animated Section Divider */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent my-12 md:my-16"></div>

        {/* How Meta-Prism Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How Meta-Prism Works
              <div className="mt-2 h-1 w-24 bg-primary mx-auto"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => (
                <GlassCard key={index} className="text-center p-8 hover:shadow-primary/20 transition-shadow duration-300">
                  <div className="mb-6">
                    <step.icon className="h-16 w-16 mx-auto text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Animated Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-12 md:my-16"></div>

        {/* Featured Worldviews Section */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Worldviews</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Browse some of the diverse philosophical and spiritual perspectives mapped in our Codex.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredWorldviewsData.map(entry => (
                <Card key={entry.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 glassmorphic-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl line-clamp-1">{entry.title}</CardTitle>
                    <CardDescription className="text-xs h-10 line-clamp-2">{entry.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-center items-center pt-2 pb-4">
                    <TriangleChart scores={entry.domainScores} width={180} height={156} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none mb-3" />
                    <Badge variant="secondary" className="text-xs">{entry.category}</Badge>
                  </CardContent>
                  <CardFooter className="p-4 border-t border-border/30 mt-auto">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/codex/${entry.id}`}>Explore <Icons.chevronRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/codex">Explore the Full Codex <Icons.chevronRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Animated Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-12 md:my-16"></div>

        {/* Facet Accordions Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              The 7 Facets of Worldview
              <div className="mt-2 h-1 w-32 bg-primary mx-auto"></div>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Meta-Prism explores your perspective through seven fundamental dimensions of how we interpret reality, knowledge, action, values, meaning, the cosmos, and purpose.
            </p>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {FACET_NAMES.map((facetName) => {
                const facet = FACETS[facetName];
                return (
                  <AccordionItem value={facet.name} key={facet.name} className="border-border/50 mb-2 last:mb-0 rounded-lg overflow-hidden shadow-md bg-card/70 hover:bg-card/90 transition-colors">
                    <AccordionTrigger className="p-6 text-lg hover:no-underline">
                      <div className="flex items-center gap-3">
                        <FacetIcon facetName={facet.name} className="h-6 w-6" />
                        <span style={{ color: `hsl(var(${facet.colorVariable.slice(2)}))` }}>{facet.name}</span>: <span className="ml-1 text-base font-medium text-muted-foreground">{facet.tagline}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                      <p className="mb-4 text-muted-foreground">{facet.description}</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/facet/${facet.name.toLowerCase()}`}>
                          Deep Dive into {facet.name} <Icons.chevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/30 bg-background">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Meta-Prism. All rights reserved.</p>
          <p className="text-sm mt-1">Explore your reality.</p>
        </div>
      </footer>
    </div>
  );
}
