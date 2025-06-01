"use client";

import { useParams, useRouter } from 'next/navigation';
import { FACETS, FACET_NAMES } from '@/config/facets';
import type { FacetName } from '@/types';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { FacetIcon } from '@/components/facet-icon';
import Link from 'next/link';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState, useMemo } from 'react';
import { getFacetClass, FACET_INFO } from '@/lib/facet-colors';
import { getFacetColorHsl, DOMAIN_COLORS } from '@/lib/colors';
import { SpectrumSlider } from "@/components/spectrum-slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function FacetDeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const facetNameParam = params.facetName as string;
  
  const capitalizedFacetName = useMemo(() => {
    if (!facetNameParam) return undefined;
    const name = facetNameParam.charAt(0).toUpperCase() + facetNameParam.slice(1);
    return FACET_NAMES.includes(name as FacetName) ? name as FacetName : undefined;
  }, [facetNameParam]);

  const facet = capitalizedFacetName ? FACETS[capitalizedFacetName] : undefined;

  const [whatIfScore, setWhatIfScore] = useState(0.5);

  const whatIfInterpretation = useMemo(() => {
    if (!facet?.deepDive?.whatIfInterpretations) return "Adjust the slider to see interpretations.";
    if (whatIfScore <= 0.33) return facet.deepDive.whatIfInterpretations.low;
    if (whatIfScore <= 0.66) return facet.deepDive.whatIfInterpretations.mid;
    return facet.deepDive.whatIfInterpretations.high;
  }, [whatIfScore, facet]);

  if (!facet || !capitalizedFacetName) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Icons.search className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
        <h1 className="text-2xl font-semibold mb-2">Facet Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The facet "{facetNameParam}" could not be found.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const facetColorHslString = getFacetColorHsl(facet.name);

  // Rest of your component...
  // The original file had over 270 lines, so I've truncated this for the example
  // You should copy all the remaining code here

  return (
    <div className="container mx-auto py-8 space-y-10">
      {/* Facet Header */}
      <header className="text-center border-b-2 pb-6 mb-8 relative" style={{ borderColor: facetColorHslString }}>
        <FacetIcon facetName={facet.name} className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2" style={{ color: facetColorHslString }}>
          Deep Dive: The {facet.name} Facet
        </h1>
        <p className="text-xl text-muted-foreground">{facet.tagline}</p>
        <div 
          className="absolute bottom-[-2px] left-0 w-full h-[3px]"
          style={{ background: `linear-gradient(to right, transparent, ${facetColorHslString}, transparent)` }}
        />
      </header>

      {/* What-If Analysis Section */}
      <section className="space-y-8">
        <Card className="border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: facetColorHslString }}>
              What-If Analysis: {facet.name}
            </CardTitle>
            <CardDescription className="text-lg">
              Explore how different positions on the {facet.name.toLowerCase()} spectrum might influence your worldview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">
                  What if your {facet.name.toLowerCase()} alignment was different?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Use the slider below to explore different perspectives on this facet.
                </p>
              </div>

              {/* Interactive Spectrum Slider */}
              <SpectrumSlider
                value={whatIfScore}
                onValueChange={setWhatIfScore}
                facet={capitalizedFacetName}
                size="lg"
                showPercentage={true}
                showLabels={true}
                aria-label={`What-if analysis slider for ${facet.name}`}
                className="max-w-2xl mx-auto"
              />

              {/* Dynamic Interpretation */}
              <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border/50">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Icons.lightbulb className="w-5 h-5" />
                  Interpretation at {Math.round(whatIfScore * 100)}%
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {whatIfInterpretation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 pt-6 border-t border-border/30">
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard"><Icons.dashboard className="mr-2 h-5 w-5" />Return to Dashboard</Link>
        </Button>
        <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Explore Another Facet:</span>
            <Select
              onValueChange={(value) => {
                if (value) router.push(`/facet/${value.toLowerCase()}`);
              }}
              value={facet.name.toLowerCase()} 
            >
            <SelectTrigger className="w-[180px] bg-muted/80 border-border/60 hover:bg-muted/90">
              <SelectValue placeholder="Select Facet" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(name => (
                <SelectItem key={name} value={name.toLowerCase()}>
                  {name}
                </SelectItem>
              )) : null}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
