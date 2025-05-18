
"use client";

import { useParams, useRouter } from 'next/navigation';
import { FACETS, FACET_NAMES } from '@/config/facets';
import type { FacetName } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { FacetIcon } from '@/components/facet-icon';
import Link from 'next/link';
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState, useMemo } from 'react';
import { getFacetColorHsl } from '@/lib/colors';

export default function FacetDeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const facetNameParam = params.facetName as string;
  const capitalizedFacetName = facetNameParam.charAt(0).toUpperCase() + facetNameParam.slice(1) as FacetName;
  
  const facet = FACETS[capitalizedFacetName];

  const [whatIfScore, setWhatIfScore] = useState(0.5);

  const whatIfInterpretation = useMemo(() => {
    if (!facet?.deepDive?.whatIfInterpretations) return "Adjust the slider to see interpretations.";
    if (whatIfScore <= 0.33) return facet.deepDive.whatIfInterpretations.low;
    if (whatIfScore <= 0.66) return facet.deepDive.whatIfInterpretations.mid;
    return facet.deepDive.whatIfInterpretations.high;
  }, [whatIfScore, facet]);

  if (!facet) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Icons.search className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
        <h1 className="text-2xl font-semibold mb-2">Facet Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The facet "{capitalizedFacetName}" could not be found.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const facetColor = getFacetColorHsl(facet.name);

  return (
    <div className="container mx-auto py-8 space-y-10">
      {/* Facet Header */}
      <header className="text-center border-b-2 pb-6 mb-8 relative" style={{ borderColor: facetColor }}>
        <FacetIcon facetName={facet.name} className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2" style={{ color: facetColor }}>
          Deep Dive: The {facet.name} Facet
        </h1>
        <p className="text-xl text-muted-foreground">{facet.tagline}</p>
        <div 
          className="absolute bottom-[-2px] left-0 w-full h-[3px]"
          style={{ background: `linear-gradient(to right, transparent, ${facetColor}, transparent)` }}
        />
      </header>

      {/* Introduction Block */}
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: facetColor }}>Introduction: {facet.deepDive.introduction.split(':')[0]}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{facet.deepDive.introduction.substring(facet.deepDive.introduction.indexOf(':') + 1).trim() || facet.description}</p>
        </CardContent>
      </Card>

      {/* Spectrum and Symbolic Range */}
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: facetColor }}>Spectrum & Symbolic Range</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 leading-relaxed">{facet.deepDive.spectrumExplanation}</p>
          <div className="my-6 h-8 w-full rounded-full flex overflow-hidden border border-border/30">
            {facet.deepDive.spectrumAnchors.map((anchor, index, arr) => (
              <div 
                key={anchor} 
                className="flex-1 h-full flex items-center justify-center text-xs font-medium text-background transition-all duration-300"
                style={{ 
                  backgroundColor: chroma(facetColor).darken(1 - (index / (arr.length -1)) * 2 + 1).alpha(0.7 + (index / (arr.length -1)) * 0.3 ).hex(),
                  color: chroma.contrast(chroma(facetColor).darken(1 - (index / (arr.length -1)) * 2 + 1).hex(), '#fff') > 4.5 ? '#fff' : '#000'
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
          <CardTitle className="text-2xl" style={{ color: facetColor }}>Codex & Archetype Examples</CardTitle>
          <CardDescription>Illustrative worldviews and archetypes related to {facet.name}.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facet.deepDive.exampleWorldviews.map((example, idx) => (
            <Card key={idx} className="bg-background/30 p-1 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  {/* Placeholder for Icon */}
                  <Icons.sparkles className="h-5 w-5" style={{ color: facetColor }} /> 
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">{example.type === 'codex' ? "Codex Entry" : "Archetype"} - Score: {example.exampleScore}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{example.summary}</p>
                {/* Placeholder for mini triangle visual */}
              </CardContent>
              {example.id && (
                <CardFooter className="mt-auto pt-3">
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild style={{ color: facetColor }}>
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
            <CardTitle className="text-2xl" style={{ color: facetColor }}>Archetypal Patterns</CardTitle>
            <CardDescription>Common archetypal expressions related to {facet.name}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {facet.deepDive.archetypalPatterns.map((pattern, idx) => (
              <div key={idx} className="p-3 rounded-md border border-border/50 bg-background/30">
                <div className="flex items-center gap-2 mb-1">
                  {pattern.icon && Icons[pattern.icon] ? 
                    React.createElement(Icons[pattern.icon], { className: "h-5 w-5", style: { color: facetColor } }) : 
                    <Icons.users className="h-5 w-5" style={{ color: facetColor }} />
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
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: facetColor }}>'What If?' Exploration</CardTitle>
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
            <span className="text-lg font-semibold tabular-nums" style={{ color: facetColor, minWidth: '50px' }}>
              {Math.round(whatIfScore * 100)}%
            </span>
          </div>
          <div className="p-4 rounded-md bg-background/30 border border-border/50 min-h-[60px]">
            <p className="text-sm text-muted-foreground italic">{whatIfInterpretation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Reflection/Journaling Prompt */}
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: facetColor }}>Reflection: Your {facet.name}</CardTitle>
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
              defaultValue={facet.name.toLowerCase()}
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

// Helper for chroma.js if it's not globally available - should be imported if used project-wide
// For now, assuming it's available or will be added if this script is used
// You might need to `npm install chroma-js` and `npm install --save-dev @types/chroma-js`
// Then import: import chroma from 'chroma-js';
declare var chroma: any; // Temporary declaration if chroma-js is not properly typed/imported yet

