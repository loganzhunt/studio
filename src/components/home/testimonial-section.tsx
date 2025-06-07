"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { GlassCard } from "@/components/glass-components";
import { ParallaxGradient } from "@/components/ParallaxGradient";
import { useMediaQuery } from "@/hooks/use-media-query";

// Testimonial data
const testimonials = [
  {
    quote:
      "The Meta-Prism revealed patterns in my thinking I'd never noticed before. It's given me a new vocabulary to understand my own worldview.",
    author: "Dr. Maya Chen",
    title: "Professor of Comparative Philosophy",
  },
  {
    quote:
      "As someone who's studied belief systems for decades, I found the Meta-Prism framework remarkably insightful. It bridges academic theory with practical self-awareness.",
    author: "James Wilson",
    title: "Author & Cultural Researcher",
  },
  {
    quote:
      "I've used many assessment tools in my coaching practice, but the Meta-Prism offers a uniquely holistic perspective on how people construct meaning.",
    author: "Sarah Johnson",
    title: "Executive Coach",
  },
  {
    quote:
      "The Meta-Prism helped our team understand each other's fundamental assumptions about the world. It's been transformative for our collaborative process.",
    author: "Michael Ortega",
    title: "Innovation Director",
  },
];

export default function HomeTestimonialSection() {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // We need to use useEffect to handle client-only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Interactive background effect - client-side only */}
      {mounted && (
        <ParallaxGradient className="absolute inset-0 opacity-30 z-0" />
      )}

      <div className="container relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            What People Are Saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how the Meta-Prism is changing perspectives
          </p>
        </div>

        {mounted && (
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className={isDesktop ? "basis-1/2" : "basis-full"}
                >
                  <div className="p-1">
                    <GlassCard className="h-full p-6 md:p-8">
                      <CardContent className="p-0 flex flex-col justify-between h-full">
                        <div className="mb-6">
                          <blockquote className="text-lg md:text-xl italic">
                            "{testimonial.quote}"
                          </blockquote>
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-muted-foreground">
                            {testimonial.title}
                          </p>
                        </div>
                      </CardContent>
                    </GlassCard>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}
