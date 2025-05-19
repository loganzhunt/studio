"use client";

import { useParams, useRouter } from 'next/navigation';
import { TriangleChart } from '@/components/visualization/TriangleChart'; 
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { getFacetColorHsl, SPECTRUM_LABELS } from '@/lib/colors'; 

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
          <div className="md:sticky md:top-24"> 
            <TriangleChart scores={worldview.domainScores} className="mx-auto max-w-sm" />
          </div>
          <Accordion type="single" collapsible className="w-full" defaultValue={FACET_NAMES[0]}>
            {worldview.domainScores.map(ds => {
              const facetConfig = FACETS[ds.facetName];
              const spectrumPoleLabels = SPECTRUM_LABELS[ds.facetName];
              const facetColor = getFacetColorHsl(ds.facetName);

              return (
                <AccordionItem value={ds.facetName} key={ds.facetName} className="border-border/50 mb-2 last:mb-0 rounded-lg overflow-hidden bg-background/30 hover:bg-background/50 transition-colors">
                  <AccordionTrigger className="p-4 text-md hover:no-underline">
                    <div className="flex flex-col items-start text-left w-full">
                      <div className="flex items-center gap-2 w-full justify-between">
                        <div className="flex items-center gap-2">
                           {facetConfig?.icon && React.createElement(facetConfig.icon, { className: "h-5 w-5", style: { color: facetColor } })}
                          <span className="font-semibold" style={{ color: facetColor }}>{ds.facetName}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: facetColor }}>{Math.round(ds.score * 100)}%</span>
                      </div>
                      {spectrumPoleLabels && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {spectrumPoleLabels.left} <span className="text-foreground/50 mx-1">←────→</span> {spectrumPoleLabels.right}
                        </p>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {worldview.facetSummaries?.[ds.facetName] || `Detailed insights into ${worldview.title}'s approach to ${ds.facetName.toLowerCase()}...`}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
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