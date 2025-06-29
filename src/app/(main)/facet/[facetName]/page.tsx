
"use client";

import { useParams, useRouter } from 'next/navigation';
import { FACETS, FACET_NAMES } from '@/config/facets';
import type { FacetName } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons'; // Added this import
import { FacetIcon } from '@/components/facet-icon';
import Link from 'next/link';
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState, useMemo } from 'react';
import { getFacetColorHsl, DOMAIN_COLORS } from '@/lib/colors';
import chroma from 'chroma-js';

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
  const baseHexColorForChroma = DOMAIN_COLORS[facet.name as FacetName] || '#CCCCCC';


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

      {/* Introduction Block */}
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: facetColorHslString }}>Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{facet.deepDive.introduction}</p>
        </CardContent>
      </Card>

      {/* Spectrum and Symbolic Range */}
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: facetColorHslString }}>Spectrum & Symbolic Range</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 leading-relaxed">{facet.deepDive.spectrumExplanation}</p>
          <div className="my-6 h-8 w-full rounded-full flex overflow-hidden border border-border/30">
            {facet.deepDive.spectrumAnchors.map((anchor, index, arr) => (
              <div 
                key={anchor} 
                className="flex-1 h-full flex items-center justify-center text-xs font-medium text-background transition-all duration-300"
                style={{ 
                  backgroundColor: chroma(baseHexColorForChroma).darken(1 - (index / (arr.length -1)) * 2 + 1).alpha(0.7 + (index / (arr.length -1)) * 0.3 ).hex(),
                  color: chroma.contrast(chroma(baseHexColorForChroma).darken(1 - (index / (arr.length -1)) * 2 + 1).hex(), '#fff') > 4.5 ? '#fff' : '#000'
                }}
                title={anchor}
              >
                 <span className="truncate px-1">{anchor}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Codex and Archetype Examples */}
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: facetColorHslString }}>Codex & Archetype Examples</CardTitle>
          <CardDescription>Illustrative worldviews and archetypes related to {facet.name}.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facet.deepDive.exampleWorldviews.map((example, idx) => (
            <Card key={idx} className="bg-background/30 p-1 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  {example.icon && <span className="text-xl" style={{color: facetColorHslString}}>{example.icon}</span>}
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </div>
                <CardDescription className="text-xs capitalize">{example.type} - Score: {example.exampleScore}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{example.summary}</p>
              </CardContent>
              {example.id && (
                <CardFooter className="mt-auto pt-3">
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild style={{ color: facetColorHslString }}>
                    <Link href={example.type === 'codex' ? `/codex/${example.id}` : `/archetypes#${example.id}`}>
                      Learn more <Icons.chevronRight className="ml-1 h-3 w-3"/>
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>
      
      {/* Archetypal Patterns */}
       {facet.deepDive.archetypalPatterns && facet.deepDive.archetypalPatterns.length > 0 && (
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: facetColorHslString }}>Archetypal Patterns</CardTitle>
            <CardDescription>Common archetypal expressions related to {facet.name}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {facet.deepDive.archetypalPatterns.map((pattern, idx) => (
              <div key={idx} className="p-3 rounded-md border border-border/50 bg-background/30">
                <div className="flex items-center gap-2 mb-1">
                  {pattern.icon && Icons[pattern.icon] ? 
                    React.createElement(Icons[pattern.icon], { className: "h-5 w-5", style: { color: facetColorHslString } }) : 
                    <Icons.archetypes className="h-5 w-5" style={{ color: facetColorHslString }} />
                  }
                  <h4 className="font-semibold text-foreground">{pattern.title} <span className="text-xs text-muted-foreground">({pattern.scoreRange})</span></h4>
                </div>
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* "What If?" Exploration Mode */}
      {facet.deepDive.whatIfInterpretations && (
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: facetColorHslString }}>'What If?' Exploration</CardTitle>
            <CardDescription>Adjust the slider to see how different scores in {facet.name} might be interpreted.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Slider
                defaultValue={[whatIfScore]}
                max={1}
                step={0.01}
                onValueChange={(value) => setWhatIfScore(value[0])}
                className="w-full"
              />
              <span className="text-lg font-semibold tabular-nums" style={{ color: facetColorHslString, minWidth: '50px' }}>
                {Math.round(whatIfScore * 100)}%
              </span>
            </div>
            <div className="p-4 rounded-md bg-background/30 border border-border/50 min-h-[60px]">
              <p className="text-sm text-muted-foreground italic">{whatIfInterpretation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reflection/Journaling Prompt */}
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: facetColorHslString }}>Reflection: Your {facet.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {facet.deepDive.reflectionPrompts.map((prompt, idx) => (
            <p key={idx} className="text-muted-foreground mb-3 leading-relaxed"><em>{prompt}</em></p>
          ))}
          <Textarea
            placeholder={`Your thoughts on ${facet.name}... (not saved)`}
            className="mt-2 min-h-[100px] bg-background/30"
          />
        </CardContent>
      </Card>

      {/* Strengths, Tensions, Blind Spots */}
      {(facet.deepDive.strengthsPlaceholder || facet.deepDive.tensionsPlaceholder || facet.deepDive.blindSpotsPlaceholder) && (
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: facetColorHslString }}>Further Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {facet.deepDive.strengthsPlaceholder && (
              <div>
                <h4 className="font-semibold text-lg text-foreground/90 mb-1">Potential Strengths</h4>
                <p className="text-sm text-muted-foreground">{facet.deepDive.strengthsPlaceholder}</p>
              </div>
            )}
            {facet.deepDive.tensionsPlaceholder && (
               <div>
                <h4 className="font-semibold text-lg text-foreground/90 mb-1">Possible Tensions</h4>
                <p className="text-sm text-muted-foreground">{facet.deepDive.tensionsPlaceholder}</p>
              </div>
            )}
            {facet.deepDive.blindSpotsPlaceholder && (
              <div>
                <h4 className="font-semibold text-lg text-foreground/90 mb-1">Potential Blind Spots</h4>
                <p className="text-sm text-muted-foreground">{facet.deepDive.blindSpotsPlaceholder}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}


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
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Select Facet" />
            </SelectTrigger>
            <SelectContent>
              {FACET_NAMES.map(name => (
                <SelectItem key={name} value={name.toLowerCase()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

