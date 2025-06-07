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
import { FACETS, FACET_NAMES, isValidFacetNames } from "@/config/facets";
import { FacetIcon } from "@/components/facet-icon";
import { getDominantFacet } from "@/lib/colors";
import {
  FACET_INFO,
  getFacetClass,
  getFacetStyle,
  getFacetClasses,
  type FacetName,
  type ColorType,
} from "@/lib/facet-colors";
import {
  GlassCard,
  HeroShimmer,
  SpectrumBar,
  GlassAccordionItem,
} from "@/components/glass-components";
import { Sparkles, ArrowRight } from "lucide-react";
import { featuredWorldviewsData } from "@/data/featured-worldviews";
import React from "react";

// Import client-side components that need interactivity
import HomeHeroSection from "@/components/home/hero-section";
import HomeFeatureCarousel from "@/components/home/feature-carousel";
import HomeTestimonialSection from "@/components/home/testimonial-section";

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
      {/* Hero Section - Client component for interactivity */}
      <HomeHeroSection />

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover your unique metaphysical signature through our
              interdisciplinary assessment framework
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 mb-2 text-primary">
                    {React.createElement(step.icon, { size: 28 })}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Worldviews Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Featured Worldviews
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore different archetype profiles from our symbolic codex
            </p>
          </div>

          {/* Client Feature Carousel Component */}
          <HomeFeatureCarousel
            featuredWorldviews={featuredWorldviewsData.map((item) => ({
              id: item.id,
              name: item.title,
              description: item.summary || "",
              icon: item.icon || "✨",
              scores: item.domainScores || [],
            }))}
          />
        </div>
      </section>

      {/* The Seven Facets Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              The Seven Facets
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every worldview can be mapped across these seven dimensions
            </p>
          </div>

          {/* Grid of Facet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isValidFacetNames() &&
              FACET_NAMES.map((facetName) => {
                const facet = FACETS[facetName];
                // Convert facet name to lowercase to match ColorType
                const facetColor = facetName.toLowerCase() as ColorType;
                return (
                  <Card
                    key={facetName}
                    className={`overflow-hidden transition-all hover:shadow-lg ${getFacetStyle(
                      facetColor,
                      "border"
                    )}`}
                  >
                    <CardHeader
                      className={`${getFacetStyle(
                        facetColor,
                        "bg-light"
                      )} pb-2`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8">
                          <FacetIcon
                            facetName={facetName}
                            className={`h-full w-full ${getFacetStyle(
                              facetColor,
                              "text"
                            )}`}
                            score={0.7}
                          />
                        </div>
                        <CardTitle className="text-lg">{facet.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="font-medium mb-1">{facet.tagline}</p>
                      <CardDescription>
                        {facet.description.length > 120
                          ? facet.description.substring(0, 120) + "..."
                          : facet.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Moved to client component */}
      <HomeTestimonialSection />

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Common questions about the Meta-Prism project
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <GlassAccordionItem value="item-1">
                <AccordionTrigger>
                  What exactly is the Meta-Prism?
                </AccordionTrigger>
                <AccordionContent>
                  The Meta-Prism is a symbolic framework for mapping how people
                  construct meaning and understand reality. It assesses seven
                  key facets of worldview—ontology, epistemology, axiology,
                  praxeology, cosmology, teleology, and mythology—creating a
                  unique "metaphysical signature" for each person.
                </AccordionContent>
              </GlassAccordionItem>

              <GlassAccordionItem value="item-2">
                <AccordionTrigger>Is this a personality test?</AccordionTrigger>
                <AccordionContent>
                  No, it's not a personality test. While personality tests focus
                  on traits and behaviors, the Meta-Prism explores deeper
                  dimensions of how you construct meaning and understand
                  reality. It maps your philosophical assumptions rather than
                  your personality characteristics.
                </AccordionContent>
              </GlassAccordionItem>

              <GlassAccordionItem value="item-3">
                <AccordionTrigger>How accurate is it?</AccordionTrigger>
                <AccordionContent>
                  The Meta-Prism is designed to be thought-provoking rather than
                  definitive. Its value lies in promoting reflection and
                  exploration. The results represent your responses at a
                  particular moment and are meant to spark deeper inquiry rather
                  than label you permanently.
                </AccordionContent>
              </GlassAccordionItem>

              <GlassAccordionItem value="item-4">
                <AccordionTrigger>How is my data handled?</AccordionTrigger>
                <AccordionContent>
                  Your assessment results are stored locally on your device by
                  default. If you create an account, your data is securely
                  stored with encryption and never shared with third parties.
                  We're committed to maintaining the highest standards of data
                  privacy and security.
                </AccordionContent>
              </GlassAccordionItem>

              <GlassAccordionItem value="item-5">
                <AccordionTrigger>
                  What's the science behind this?
                </AccordionTrigger>
                <AccordionContent>
                  The Meta-Prism draws from interdisciplinary research in
                  philosophy, cognitive science, cultural anthropology, and
                  developmental psychology. While not claiming to be an
                  empirical scientific instrument, it synthesizes diverse
                  academic perspectives into an accessible framework for
                  personal exploration.
                </AccordionContent>
              </GlassAccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-5xl">
          <GlassCard className="py-12 px-6 md:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Map Your Worldview
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Take the free assessment and discover your metaphysical signature
              across seven dimensions of reality.
            </p>
            <Link href="/assessment">
              <Button size="lg" className="h-14 px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Begin Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
