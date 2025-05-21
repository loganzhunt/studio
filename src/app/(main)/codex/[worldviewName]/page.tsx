
"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import type { CodexEntry, FacetName } from '@/types';
import { FACETS, FACET_NAMES } from '@/config/facets';
import Link from 'next/link';
import { useWorldview } from '@/hooks/use-worldview';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useEffect, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { getFacetColorHsl, SPECTRUM_LABELS, DOMAIN_COLORS } from '@/lib/colors'; 
import chroma from 'chroma-js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


// Import all codex data - needed to find the specific entry
import { BASE_CODEX_DATA } from "@/data/codex/base-codex-data";
import { LATEST_CODEX_UPDATE_BATCH } from "@/data/codex/latest-codex-update-batch";
import { ADDITIONAL_CODEX_DATA } from "@/data/codex/additional-codex-data";
import { mapRawDataToCodexEntries } from '@/app/(main)/codex/page'; // Import the mapper

const SECTION_IDS = {
  SUMMARY: "summary",
  FACETS: "facets",
  ORIGINS: "origins",
  BELIEFS: "beliefs",
  REFLECTION: "reflection",
  RESOURCES: "resources",
};

export default function CodexDeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const worldviewNameFromParam = params.worldviewName as string; 
  
  const { savedWorldviews, addSavedWorldview } = useWorldview();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const allCodexEntries = useMemo(() => {
    try {
      const combinedRawData = [
        ...LATEST_CODEX_UPDATE_BATCH, 
        ...ADDITIONAL_CODEX_DATA,
        ...BASE_CODEX_DATA
      ];
      
      const uniqueEntriesData: any[] = [];
      const uniqueTitles = new Set<string>();

      for (const item of combinedRawData) {
        const title = (item.title || item.name || '').toLowerCase().trim();
        if (title && !uniqueTitles.has(title)) {
          const standardizedItem = { ...item, title: item.title || item.name };
          if (item.name && item.title !== item.name) delete standardizedItem.name; 
          uniqueEntriesData.push(standardizedItem);
          uniqueTitles.add(title);
        }
      }
      return mapRawDataToCodexEntries(uniqueEntriesData); 
    } catch (error) {
      console.error("Error processing Codex data arrays for deep dive:", error);
      return [];
    }
  }, []);

  const worldview = useMemo(() => {
    return allCodexEntries.find(entry => entry.id.toLowerCase() === worldviewNameFromParam?.toLowerCase());
  }, [allCodexEntries, worldviewNameFromParam]);

  useEffect(() => {
    if (worldview) {
      setIsSaved(savedWorldviews.some(p => p.id === worldview.id));
    }
  }, [worldview, savedWorldviews]);

  const handleSaveWorldview = () => {
    if (!worldview) return;
    if (isSaved) {
      toast({ title: "Already Saved", description: `"${worldview.title}" is already in your library.` });
      return;
    }
    addSavedWorldview({ ...worldview }); 
    setIsSaved(true); 
    toast({ title: "Saved to Library", description: `"${worldview.title}" has been added to your saved worldviews.` });
  };

  // Placeholder content specific to Platonism for new sections
  // This will be overridden if worldview.originAndContext etc. exist
  const platonismExtraContent = {
    originAndContext: "Platonism originated in ancient Greece with the philosopher Plato (c. 428/427 – 348/347 BC), a student of Socrates and teacher of Aristotle. His Academy in Athens was one of the first institutions of higher learning in the Western world. Platonism profoundly influenced Western thought, particularly through Neoplatonism and its impact on Christian theology (e.g., Augustine) and Islamic philosophy. Key figures include Plato himself, Plotinus, Porphyry, and Proclus.",
    coreBeliefs: "Central to Platonism is the Theory of Forms (or Ideas), which posits that the physical world we perceive is not the real world but only a shadow or imitation of the true, eternal, and perfect Forms. These Forms (e.g., Beauty, Justice, Goodness) are abstract universals. Knowledge is achieved through reason and contemplation of these Forms, not just sensory experience. The soul is seen as immortal and pre-existing, with a destiny to return to the realm of Forms. The highest Form is the Form of the Good, which illuminates all other Forms and is the ultimate source of reality and knowledge.",
    furtherResources: [
      { title: "Plato - Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/plato/" },
      { title: "The Republic by Plato - Project Gutenberg", url: "https://www.gutenberg.org/ebooks/1497" },
      { title: "Internet Encyclopedia of Philosophy - Plato", url: "https://iep.utm.edu/plato/" }
    ]
  };

  if (!worldview) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Icons.search className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
        <h1 className="text-2xl font-semibold mb-2">Worldview Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The worldview "{worldviewNameFromParam}" could not be found in the Codex.
        </p>
        <Button asChild variant="outline">
          <Link href="/codex">Back to Codex</Link>
        </Button>
      </div>
    );
  }

  const sectionLinks = [
    { id: SECTION_IDS.SUMMARY, label: "Summary" },
    { id: SECTION_IDS.FACETS, label: "Facet Profile" },
    { id: SECTION_IDS.ORIGINS, label: "Origin & Context" },
    { id: SECTION_IDS.BELIEFS, label: "Core Beliefs" },
    { id: SECTION_IDS.REFLECTION, label: "Reflection" },
    { id: SECTION_IDS.RESOURCES, label: "Resources" },
  ];

  // Use worldview's own data if available, otherwise fallback to Platonism example
  const originAndContext = (worldview as any).originAndContext || (worldviewNameFromParam === 'platonism' ? platonismExtraContent.originAndContext : `Detailed historical and cultural context for ${worldview.title} will be displayed here.`);
  const coreBeliefs = (worldview as any).coreBeliefs || (worldviewNameFromParam === 'platonism' ? platonismExtraContent.coreBeliefs : `Key tenets and foundational beliefs of ${worldview.title} will be detailed here.`);
  const furtherResources = (worldview as any).furtherResources || (worldviewNameFromParam === 'platonism' ? platonismExtraContent.furtherResources : []);


  return (
    <div className="container mx-auto py-8 space-y-10">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">{worldview.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/codex')}>
              <Icons.codex className="mr-2 h-4 w-4" /> Back to Codex
            </Button>
            <Button onClick={handleSaveWorldview} disabled={isSaved}>
              {isSaved ? <Icons.check className="mr-2 h-4 w-4" /> : <Icons.saved className="mr-2 h-4 w-4" />}
              {isSaved ? "Saved" : "Save Worldview"}
            </Button>
          </div>
        </div>
        <p className="text-lg text-muted-foreground mt-1 capitalize">{worldview.category} Worldview</p>
      </header>

      <nav className="mb-10 p-3 bg-card/30 rounded-lg shadow-sm">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {sectionLinks.map(link => (
            <li key={link.id}>
              <Button variant="link" asChild className="text-muted-foreground hover:text-primary">
                <a href={`#${link.id}`}>{link.label}</a>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <Card id={SECTION_IDS.SUMMARY} className="glassmorphic-card scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{worldview.summary}</p>
          {worldview.tags && worldview.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Keywords:</h3>
              <div className="flex flex-wrap gap-2">
                {worldview.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card id={SECTION_IDS.FACETS} className="glassmorphic-card scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Facet Profile & Scores</CardTitle>
          <CardDescription>How {worldview.title} aligns with each of the 7 Meta-Prism facets.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="md:sticky md:top-24 flex justify-center"> 
            <TriangleChart scores={worldview.domainScores} width={300} height={260} className="max-w-sm !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
          </div>
          <div className="space-y-4">
            {FACET_NAMES.map(facetName => {
              const scoreObj = worldview.domainScores.find(ds => ds.facetName === facetName);
              const score = scoreObj ? scoreObj.score : 0.5; // Default to 0.5 if score not found
              const facetConfig = FACETS[facetName];
              const facetSummary = worldview.facetSummaries?.[facetName] || `Information for ${facetName} is not available.`;
              const spectrumPoleLabels = SPECTRUM_LABELS[facetName] || { left: 'Low', right: 'High' };
              
              const barColorDark = chroma(DOMAIN_COLORS[facetName]).darken(1.5).hex();
              const barColorLight = chroma(DOMAIN_COLORS[facetName]).brighten(1.5).hex();

              return (
                <div key={facetName} className="p-4 rounded-md border border-border/30 bg-background/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold" style={{color: getFacetColorHsl(facetName)}}>
                      {facetName}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground italic mb-1">{facetConfig?.tagline || "..."}</p>
                  <p className="text-sm text-muted-foreground">{facetSummary}</p>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full h-6 rounded bg-muted/30 relative mt-2" aria-label={`${facetName} spectrum: ${spectrumPoleLabels.left} to ${spectrumPoleLabels.right}. Score: ${Math.round(score * 100)}%`}>
                          <div 
                            className="h-full rounded"
                            style={{ background: `linear-gradient(to right, ${barColorDark}, ${barColorLight})` }}
                          />
                          <div
                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                            style={{
                              left: `${score * 100}%`,
                              pointerEvents: 'none', 
                              zIndex: 10 
                            }}
                            aria-hidden="true"
                          >
                            <div 
                              className="px-1.5 py-0 text-[10px] bg-black/70 text-white rounded shadow-md whitespace-nowrap"
                            >
                              {Math.round(score * 100)}%
                            </div>
                            <svg
                              width="8"
                              height="5"
                              viewBox="0 0 8 5"
                              className="fill-black/70 mx-auto" 
                            >
                              <path d="M4 5L0 0H8L4 5Z" />
                            </svg>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg text-xs">
                        <p>{spectrumPoleLabels.left} <span className="text-muted-foreground mx-1">←</span> Score: {Math.round(score * 100)}% <span className="text-muted-foreground mx-1">→</span> {spectrumPoleLabels.right}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card id={SECTION_IDS.ORIGINS} className="glassmorphic-card scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Origin & Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {originAndContext}
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card id={SECTION_IDS.BELIEFS} className="glassmorphic-card scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Core Beliefs & Assumptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {coreBeliefs}
          </p>
        </CardContent>
      </Card>
      
      <Separator />

      <Card className="glassmorphic-card scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Comparative Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Compare {worldview.title} with other worldviews (Feature coming soon).</p>
          <Button variant="outline" disabled className="mt-4">Compare Worldviews</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card id={SECTION_IDS.REFLECTION} className="glassmorphic-card scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Reflection & Journal</CardTitle>
          <CardDescription>Consider these prompts in relation to {worldview.title}. Your notes here are not saved.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
            <li>How does {worldview.title}'s perspective on reality resonate with or challenge your own?</li>
            <li>What aspects of {worldview.title} do you find most insightful or problematic?</li>
            <li>How might integrating elements of {worldview.title} shift your daily experience or decisions?</li>
          </ul>
          <Textarea placeholder={`Your reflections on ${worldview.title}...`} className="min-h-[120px] bg-background/50" />
        </CardContent>
      </Card>

      <Separator />

      <Card id={SECTION_IDS.RESOURCES} className="glassmorphic-card scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Further Resources</CardTitle>
        </CardHeader>
        <CardContent>
          {(Array.isArray(furtherResources) && furtherResources.length > 0) ? (
            <ul className="list-disc list-inside space-y-2">
              {furtherResources.map((resource: any) => (
                <li key={resource.url}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {resource.title} <Icons.share className="inline h-3 w-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Recommended readings, links, and scholars related to {worldview.title} will be listed here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

