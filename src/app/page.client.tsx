"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icons } from "@/components/icons";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { FacetIcon } from "@/components/facet-icon";
import TriangleChart from "@/components/visualization/TriangleChart";
import type { DomainScore } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { getDominantFacet } from "@/lib/colors";
import { DynamicLogo } from "@/components/DynamicLogo";
import {
  FACET_INFO,
  getFacetClass,
  getFacetClasses,
  type FacetName,
} from "@/lib/facet-colors";
import {
  GlassCard,
  PrismButton,
  HeroShimmer,
  SpectrumBar,
} from "@/components/glass-components";
import { FacetClassForcer } from "@/components/force-facet-classes";
import { Sparkles, ArrowRight } from "lucide-react";

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
    summary:
      "A philosophy of rational resilience and self-mastery, emphasizing virtue and acceptance of nature.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.3 },
      { facetName: "Epistemology", score: 0.2 },
      { facetName: "Praxeology", score: 0.65 },
      { facetName: "Axiology", score: 0.75 },
      { facetName: "Mythology", score: 0.3 },
      { facetName: "Cosmology", score: 0.4 },
      { facetName: "Teleology", score: 0.3 },
    ],
  },
  {
    id: "buddhism",
    title: "Buddhism",
    icon: "\u2638",
    summary:
      "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering.",
    category: "Spiritual",
    domainScores: [
      { facetName: "Ontology", score: 0.55 },
      { facetName: "Epistemology", score: 0.55 },
      { facetName: "Praxeology", score: 0.6 },
      { facetName: "Axiology", score: 0.7 },
      { facetName: "Mythology", score: 0.7 },
      { facetName: "Cosmology", score: 0.6 },
      { facetName: "Teleology", score: 0.7 },
    ],
  },
  {
    id: "existentialism",
    title: "Existentialism",
    icon: "\u2203",
    summary:
      "Focuses on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.3 },
      { facetName: "Epistemology", score: 0.3 },
      { facetName: "Praxeology", score: 0.55 },
      { facetName: "Axiology", score: 0.35 },
      { facetName: "Mythology", score: 0.25 },
      { facetName: "Cosmology", score: 0.25 },
      { facetName: "Teleology", score: 0.05 },
    ],
  },
  {
    id: "animism",
    title: "Animism",
    icon: "\u273F",
    summary:
      "Sees spirit or consciousness present in all beings, places, and phenomena, emphasizing reciprocity.",
    category: "Indigenous",
    domainScores: [
      { facetName: "Ontology", score: 0.8 },
      { facetName: "Epistemology", score: 0.7 },
      { facetName: "Praxeology", score: 0.4 },
      { facetName: "Axiology", score: 0.7 },
      { facetName: "Mythology", score: 0.8 },
      { facetName: "Cosmology", score: 0.9 },
      { facetName: "Teleology", score: 0.8 },
    ],
  },
  {
    id: "scientific_materialism",
    title: "Scientific Materialism",
    icon: "\u23DA",
    summary:
      "Grounded in physicalism and empirical science. Reality is ultimately material and measurable.",
    category: "Scientific",
    domainScores: [
      { facetName: "Ontology", score: 0.05 },
      { facetName: "Epistemology", score: 0.05 },
      { facetName: "Praxeology", score: 0.35 },
      { facetName: "Axiology", score: 0.2 },
      { facetName: "Mythology", score: 0.05 },
      { facetName: "Cosmology", score: 0.1 },
      { facetName: "Teleology", score: 0.05 },
    ],
  },
  {
    id: "platonism",
    title: "Platonism",
    icon: "\u03A6",
    summary:
      "A philosophical tradition centered on transcendent forms and the pursuit of the Good.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.9 },
      { facetName: "Epistemology", score: 0.8 },
      { facetName: "Praxeology", score: 0.45 },
      { facetName: "Axiology", score: 0.65 },
      { facetName: "Mythology", score: 0.7 },
      { facetName: "Cosmology", score: 0.8 },
      { facetName: "Teleology", score: 0.75 },
    ],
  },
];

export default function HomePage() {
  const howItWorksSteps = [
    {
      icon: Icons.assessment,
      title: "1. Answer Questions",
      description:
        "Engage with thought-provoking questions across 7 dimensions of your worldview.",
    },
    {
      icon: Icons.results,
      title: "2. Generate Your Map",
      description:
        "Visualize your unique worldview signature as a symbolic Meta-Prism.",
    },
    {
      icon: Icons.archetypes,
      title: "3. Reflect & Compare",
      description:
        "Explore insights, compare with archetypes, and discover new perspectives.",
    },
  ];

  return (
    <div className="flex flex-col">
      <FacetClassForcer />
      <main className="flex-1">
        {/* Hero Section with Glass Design */}
        <section className="relative py-20 md:py-28 text-center overflow-hidden bg-gradient-to-br from-background via-card to-background">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/cubes.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
            }}
            data-ai-hint="subtle geometric texture"
          />
          <div className="container mx-auto relative z-10">
            <GlassCard className="p-6 sm:p-10 md:p-16 max-w-4xl mx-auto animate-in fade-in duration-700 ease-out">
              <div className="mx-auto mb-6 md:mb-8 flex justify-center">
                {/* Responsive Logo Size - Now Shows User's Custom Triangle After Assessment */}
                <div className="w-28 md:w-36">
                  <DynamicLogo />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground">
                The Meta-Prism
              </h1>

              <p className="mt-3 md:mt-4 mb-6 md:mb-8 text-lg sm:text-xl md:text-2xl font-medium tracking-wider bg-clip-text text-transparent bg-gradient-facet-spectrum px-2">
                Illuminate the Patterns Shaping Your Reality
              </p>

              <p className="max-w-2xl mx-auto text-md sm:text-lg md:text-xl text-muted-foreground/90 leading-relaxed mb-8 md:mb-10">
                Unlock a symbolic mirror of your worldview. Take our interactive
                self-assessment to reveal the hidden prisms through which you
                see existence—and discover how to consciously redesign your
                beliefs, values, and sense of purpose.
              </p>

              <Link href="/assessment">
                <PrismButton
                  size="lg"
                  className="h-12 px-8 text-sm sm:text-base font-semibold shadow-lg group"
                >
                  <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Begin Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </PrismButton>
              </Link>

              <div className="mt-8">
                <SpectrumBar />
              </div>
            </GlassCard>
          </div>

          {/* Glassmorphic Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full grid grid-cols-2 gap-4 opacity-10">
              <div className="bg-gradient-to-br from-fuchsia-500 to-indigo-500 rounded-full animate-pulse" />
              <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Shimmering Text Box Below Hero Section */}
        <div className="container mx-auto px-4 py-8">
          <HeroShimmer className="max-w-2xl mx-auto" />
        </div>

        {/* Animated Section Divider */}
        <div className="h-1 w-full bg-gradient-facet-spectrum opacity-30 my-16 md:my-20 rounded-full"></div>

        {/* How Meta-Prism Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How Meta-Prism Works
              <div className="mt-3 h-1 w-24 bg-gradient-praxeology-axiology mx-auto rounded-full"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => {
                // Map steps to facet colors for visual progression
                const stepFacets: FacetName[] = [
                  "epistemology",
                  "cosmology",
                  "axiology",
                ];
                const facetKey = stepFacets[index];

                return (
                  <Card
                    key={index}
                    className={`text-center p-8 hover:shadow-lg transition-all duration-300 ease-in-out glassmorphic-card border-transparent
                      hover:${getFacetClass("border", facetKey, "200")} 
                      hover:${getFacetClass("bg", facetKey, "50")}`}
                  >
                    <div className="mb-8">
                      <div
                        className={`inline-flex p-4 rounded-2xl ${getFacetClass(
                          "bg",
                          facetKey,
                          "100"
                        )} mb-4`}
                      >
                        <step.icon
                          className={`h-12 w-12 ${getFacetClass(
                            "text",
                            facetKey,
                            "600"
                          )}`}
                        />
                      </div>
                    </div>
                    <h3
                      className={`text-2xl font-semibold mb-4 ${getFacetClass(
                        "text",
                        facetKey,
                        "700"
                      )}`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Animated Section Divider */}
        <div className="h-px w-full bg-gradient-facet-spectrum opacity-50 my-16 md:my-20"></div>

        {/* Featured Worldviews Section */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Featured Worldviews
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
              Browse some of the diverse philosophical and spiritual
              perspectives mapped in our Codex.
            </p>
            <div className="flex justify-center">
              <Carousel
                opts={{
                  align: "start",
                  loop:
                    (featuredWorldviewsData &&
                      Array.isArray(featuredWorldviewsData) &&
                      featuredWorldviewsData.length > 3) ||
                    false,
                }}
                className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl"
              >
                <CarouselContent className="-ml-4">
                  {(featuredWorldviewsData || []).map((entry) => {
                    const dominantFacet = getDominantFacet(
                      entry?.domainScores || []
                    );
                    const facetKey =
                      dominantFacet.toLowerCase() as keyof typeof FACET_INFO;
                    return (
                      <CarouselItem
                        key={entry?.id || Math.random()}
                        className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      >
                        <div className="p-1 h-full">
                          <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out glassmorphic-card">
                            <CardHeader className="p-6 text-center">
                              <div className="flex items-center justify-center gap-2 mb-1">
                                {entry?.icon && (
                                  <span
                                    className={`text-3xl ${getFacetClass(
                                      "text",
                                      facetKey,
                                      "600"
                                    )}`}
                                  >
                                    {entry.icon}
                                  </span>
                                )}
                                <CardTitle
                                  className={`text-xl line-clamp-1 ${getFacetClass(
                                    "text",
                                    facetKey,
                                    "700"
                                  )}`}
                                >
                                  {entry?.title || "Untitled"}
                                </CardTitle>
                              </div>
                              <CardDescription className="line-clamp-2 text-xs pt-1 text-left h-10">
                                {entry?.summary || "No description available"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-center items-center pt-2 pb-4">
                              <TriangleChart
                                scores={entry?.domainScores || []}
                                worldviewName={entry?.title || "Unknown"}
                                width={180}
                                height={156}
                                className="!p-0 !bg-transparent !shadow-none !backdrop-blur-none mb-3"
                              />
                            </CardContent>
                            <CardFooter className="p-3 border-t border-border/30 mt-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                asChild
                              >
                                <Link href={`/codex/${entry?.id || ""}`}>
                                  Explore{" "}
                                  <Icons.chevronRight className="ml-1 h-4 w-4" />
                                </Link>
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
                <Link href="/codex">
                  Explore the Full Codex{" "}
                  <Icons.chevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Animated Section Divider */}
        <div className="h-px w-full bg-gradient-facet-spectrum opacity-40 my-12 md:my-16"></div>

        {/* Facet Accordions Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-facet-spectrum bg-clip-text text-transparent">
                The 7 Facets of Worldview
              </span>
              <div className="mt-2 h-1 w-32 bg-gradient-facet-spectrum mx-auto rounded-full"></div>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Meta-Prism explores your perspective through seven fundamental
              dimensions of how we interpret reality, knowledge, action, values,
              meaning, the cosmos, and purpose.
            </p>

            {/* Spectrum visualization */}
            <div className="mb-8 flex justify-center">
              <div className="bg-gradient-facet-spectrum h-4 w-full max-w-lg rounded-full shadow-lg opacity-80" />
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto"
            >
              {Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
                ? FACET_NAMES.map((facetName) => {
                    const facet = FACETS[facetName];
                    const facetKey = facetName.toLowerCase() as FacetName;
                    const facetInfo = FACET_INFO[facetKey];

                    return (
                      <AccordionItem
                        value={facet.name}
                        key={facet.name}
                        className="glassmorphic-card mb-3 last:mb-0 overflow-hidden hover:shadow-primary/20 transition-all duration-300 ease-in-out"
                      >
                        <AccordionTrigger className="p-6 text-lg hover:no-underline group">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg ${getFacetClass(
                                "bg",
                                facetKey,
                                "500"
                              )} flex items-center justify-center group-hover:scale-110 transition-transform`}
                            >
                              <FacetIcon
                                facetName={facet.name}
                                className="h-5 w-5 text-white"
                              />
                            </div>
                            <div className="text-left">
                              <span
                                className={`${getFacetClass(
                                  "text",
                                  facetKey,
                                  "700"
                                )} font-semibold`}
                              >
                                {facet.name}
                              </span>
                              <span className="text-muted-foreground ml-2">
                                {facetInfo ? facetInfo.question : facet.tagline}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div
                            className={`border-l-4 ${getFacetClass(
                              "border",
                              facetKey,
                              "400"
                            )} pl-4 mb-4`}
                          >
                            <p className="text-muted-foreground mb-3">
                              {facet.description}
                            </p>
                            {facetInfo && (
                              <p
                                className={`text-sm ${getFacetClass(
                                  "text",
                                  facetKey,
                                  "600"
                                )} font-medium`}
                              >
                                Core Question: {facetInfo.question}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${getFacetClass(
                              "border",
                              facetKey,
                              "400"
                            )} ${getFacetClass(
                              "text",
                              facetKey,
                              "700"
                            )} hover:${getFacetClass("bg", facetKey, "100")}`}
                            asChild
                          >
                            <Link href={`/facet/${facet.name.toLowerCase()}`}>
                              Deep Dive into {facet.name}{" "}
                              <Icons.chevronRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })
                : null}
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/30 bg-background">
        <div className="container mx-auto px-4 text-muted-foreground">
          <div className="flex flex-col items-center justify-center text-center">
            <p>
              &copy; {new Date().getFullYear()} Meta-Prism. All rights reserved.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
              <Link
                href="/about"
                className="text-sm text-primary hover:underline transition-colors duration-300 ease-in-out"
              >
                Learn More About the Meta-Prism Model
              </Link>
              <Link
                href="/design-system"
                className="text-sm text-primary hover:underline transition-colors duration-300 ease-in-out"
              >
                Design System
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
