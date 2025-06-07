"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";
// Define CarouselApi type locally
type CarouselApi = UseEmblaCarouselType[1];

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TriangleChart from "@/components/visualization/TriangleChart";
import { getDominantFacet } from "@/lib/colors";
import {
  getFacetClass,
  getFacetStyle,
  type ColorType,
} from "@/lib/facet-colors";
import { GlassCard, SpectrumBar } from "@/components/glass-components";
import type { DomainScore } from "@/types";

// Define a type for featured worldviews
export interface FeaturedWorldview {
  id: string;
  name: string;
  description: string;
  icon: string;
  scores: DomainScore[];
}

// Props interface
export interface HomeFeatureCarouselProps {
  featuredWorldviews: FeaturedWorldview[];
}

export default function HomeFeatureCarousel({
  featuredWorldviews,
}: HomeFeatureCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCarouselChange = (index: number) => {
    setActiveIndex(index);
  };

  // Track the API instance to access methods like selectedScrollSnap
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  // When the carousel API changes or selectedScrollSnap changes, update our activeIndex
  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    // Initial call
    handleSelect();

    // Setup listeners for carousel changes
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {featuredWorldviews.map((worldview, index) => {
            // Convert string facet name to lowercase to match expected ColorType
            const dominantFacet = getDominantFacet(worldview.scores);
            const facetColor = dominantFacet
              ? (dominantFacet.toLowerCase() as ColorType)
              : undefined;

            return (
              <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <GlassCard
                    className={`h-full py-6 ${
                      facetColor
                        ? getFacetStyle(facetColor, "border-light")
                        : ""
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">{worldview.icon}</div>
                        <CardTitle>{worldview.name}</CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {worldview.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-0">
                      <div className="h-[120px] w-[120px]">
                        <TriangleChart
                          scores={worldview.scores}
                          width={120}
                          height={104}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center pt-4">
                      <Link href={`/worldviews/${worldview.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${
                            facetColor
                              ? getFacetStyle(facetColor, "hover-light")
                              : ""
                          }`}
                        >
                          Explore <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </GlassCard>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="absolute -top-[60px] right-0 flex space-x-2">
          <CarouselPrevious className="static translate-y-0 mr-2" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>

      {/* Spectrum indicators */}
      <div className="flex justify-center mt-8">
        <div className="max-w-md w-full">
          <SpectrumBar
            positions={featuredWorldviews.length}
            activePosition={activeIndex}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Traditional</span>
            <span>Integral</span>
            <span>Visionary</span>
          </div>
        </div>
      </div>
    </div>
  );
}
