"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Icons } from '@/components/icons';
import { FACETS, FACET_NAMES } from '@/config/facets';
import { FacetIcon } from '@/components/facet-icon';
import type { DomainScore } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { getDominantFacet, getFacetColorHsl } from '@/lib/colors';
import { FractalTriangleLogo } from "@/components/FractalTriangleLogo";
// Removed existing dynamic import of TriangleChart

// Import the new ClientTriangleChart wrapper component
import ClientTriangleChart from "@/components/visualization/ClientTriangleChart";


// Data for Featured Worldviews
const featuredWorldviewsData: Array<{
  id: string;
  title: string;
  icon?: string;
  summary: string;
  category: string;
  domainScores: DomainScore[];
}> = [
  {
    id: "stoicism",
    title: "Stoicism",
    icon: "\u221D",
    summary: "A philosophy of rational resilience and self-mastery, emphasizing virtue and acceptance of nature.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.30 }, { facetName: "Epistemology", score: 0.20 },
      { facetName: "Praxeology", score: 0.65 }, { facetName: "Axiology", score: 0.75 },
      { facetName: "Mythology", score: 0.30 }, { facetName: "Cosmology", score: 0.40 },
      { facetName: "Teleology", score: 0.30 },
    ],
  },
  {
    id: "buddhism",
    title: "Buddhism",
    icon: "\u2638",
    summary: "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering.",
    category: "Spiritual",
    domainScores: [
      { facetName: "Ontology", score: 0.55 }, { facetName: "Epistemology", score: 0.55 },
      { facetName: "Praxeology", score: 0.60 }, { facetName: "Axiology", score: 0.70 },
      { facetName: "Mythology", score: 0.70 }, { facetName: "Cosmology", score: 0.60 },
      { facetName: "Teleology", score: 0.70 },
    ],
  },
  {
    id: "existentialism",
    title: "Existentialism",
    icon: "\u2203",
    summary: "Focuses on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.30 }, { facetName: "Epistemology", score: 0.30 },
      { facetName: "Praxeology", score: 0.55 }, { facetName: "Axiology", score: 0.35 },
      { facetName: "Mythology", score: 0.25 }, { facetName: "Cosmology", score: 0.25 },
      { facetName: "Teleology", score: 0.05 },
    ],
  },
  {
    id: "animism",
    title: "Animism",
    icon: "\u273F",
    summary: "Sees spirit or consciousness present in all beings, places, and phenomena, emphasizing reciprocity.",
    category: "Indigenous",
    domainScores: [
      { facetName: "Ontology", score: 0.80 }, { facetName: "Epistemology", score: 0.70 },
      { facetName: "Praxeology", score: 0.40 }, { facetName: "Axiology", score: 0.70 },
      { facetName: "Mythology", score: 0.80 }, { facetName: "Cosmology", score: 0.90 },
      { facetName: "Teleology", score: 0.80 },
    ],
  },
  {
    id: "scientific_materialism",
    title: "Scientific Materialism",
    icon: "\u23DA",
    summary: "Grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    category: "Scientific",
    domainScores: [
        { facetName: "Ontology", score: 0.05 }, { facetName: "Epistemology", score: 0.05 },
        { facetName: "Praxeology", score: 0.35 }, { facetName: "Axiology", score: 0.20 },
        { facetName: "Mythology", score: 0.05 }, { facetName: "Cosmology", score: 0.10 },
        { facetName: "Teleology", score: 0.05 },
    ]
  },
  {
    id: "platonism",
    title: "Platonism",
    icon: "\u03A6",
    summary: "A philosophical tradition centered on transcendent forms and the pursuit of the Good.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.90 }, { facetName: "Epistemology", score: 0.80 },
      { facetName: "Praxeology", score: 0.45 }, { facetName: "Axiology", score: 0.65 },
      { facetName: "Mythology", score: 0.70 }, { facetName: "Cosmology", score: 0.80 },
      { facetName: "Teleology", score: 0.75 },
    ]
  }
];


export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <div className="flex flex-col">
      <main className="flex-1">
        {/* Hero Section Updated */}
        <section className="relative py-20 md:py-28 text-center overflow-hidden bg-gradient-to-br from-background via-card to-background">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto',
            }}
            data-ai-hint="subtle geometric texture"
          />
          <div className="container mx-auto relative z-10">
            <div className="bg-card/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 md:p-16 max-w-4xl mx-auto animate-in fade-in duration-700 ease-out">
              <div className="mx-auto mb-6 md:mb-8 flex justify-center">
                 {/* Responsive Logo Size */}
                <div className="w-28 md:w-36">
                  <FractalTriangleLogo />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground">
                The Meta-Prism
              </h1>

              <p className="mt-3 md:mt-4 mb-6 md:mb-8 text-lg sm:text-xl md:text-2xl font-medium tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 px-2">
                Illuminate the Patterns Shaping Your Reality
              </p>

              <p className="max-w-2xl mx-auto text-md sm:text-lg md:text-xl text-muted-foreground/90 leading-relaxed mb-8 md:mb-10">
                Unlock a symbolic mirror of your worldview. Take our interactive self-assessment to reveal the hidden prisms through which you see existence—and discover how to consciously redesign your beliefs, values, and sense of purpose.
              </p>

              <Button
                size="lg"
                variant="default"
                className="h-12 px-8 text-sm sm:text-base font-semibold shadow-lg hover:shadow-primary/40 transition-all duration-300 group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground"
                asChild
              >
                <Link href="/assessment">
                  <Icons.sparkles className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Begin Your Journey
                </Link>
              </Button>
            </div>
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
                <Card key={index} className="text-center p-8 hover:shadow-primary/20 transition-shadow duration-300 glassmorphic-card">
                  <div className="mb-6">
                    <step.icon className="h-16 w-16 mx-auto text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
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
            <div className="flex justify-center">
              <Carousel
                opts={{
                  align: "start",
                  loop: featuredWorldviewsData.length > 3,
                }}
                className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl"
              >
                <CarouselContent className="-ml-4">
                  {featuredWorldviewsData.map((entry) => {
                    const dominantFacet = getDominantFacet(entry.domainScores);
                    const titleColor = getFacetColorHsl(dominantFacet);
                    return (
                      <CarouselItem key={entry.id} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <div className="p-1 h-full">
                          <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 glassmorphic-card">
                            <CardHeader className="p-6 text-center">
                               <div className="flex items-center justify-center gap-2 mb-1">
                                {entry.icon && <span className="text-3xl" style={{ color: titleColor }}>{entry.icon}</span>}
                                <CardTitle className="text-xl line-clamp-1" style={{ color: titleColor }}>
                                  {entry.title}
                                </CardTitle>
                              </div>
                              <CardDescription className="line-clamp-2 text-xs pt-1 text-left h-10">
                                {entry.summary}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-center items-center pt-2 pb-4">
                              {/* Using the new ClientTriangleChart */}
                              <ClientTriangleChart scores={entry.domainScores} width={180} height={156} className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none mb-3" />
                            </CardContent>
                            <CardFooter className="p-3 border-t border-border/30 mt-auto">
                              <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                                <Link href={`/codex/${entry.id}`}>Explore <Icons.chevronRight className="ml-1 h-4 w-4" /></Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex absolute left-[-50px] top-1/2 -translate-y-1/2" />
                <CarouselNext className="hidden sm:flex absolute right-[-50px] top-1/2 -translate-y-1/2" />
              </Carousel>
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
        <div className="container mx-auto text-center text-muted-foreground space-y-2">
          <p>&copy; {new Date().getFullYear()} Meta-Prism. All rights reserved.</p>
          <p className="mt-4">
            <Link href="/about" className="text-sm text-primary hover:underline">
              Learn More About the Meta-Prism Model
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}