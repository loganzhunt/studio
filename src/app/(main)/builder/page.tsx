"use client";

import { useState } from 'react';
import { FACETS, FACET_NAMES } from '@/config/facets';
import type { FacetName, DomainScore } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TriangleChart } from '@/components/triangle-chart';
import { Icons } from '@/components/icons';
import { useWorldview } from '@/hooks/use-worldview';
import Link from 'next/link';

// Dummy Codex entries for selection
const dummyCodexOptions = {
  Ontology: [{id: "ontology_opt1", name: "Materialism"}, {id: "ontology_opt2", name: "Idealism"}],
  Epistemology: [{id: "epistemology_opt1", name: "Empiricism"}, {id: "epistemology_opt2", name: "Rationalism"}],
  Praxeology: [{id: "praxeology_opt1", name: "Consequentialism"}, {id: "praxeology_opt2", name: "Deontology"}],
  Axiology: [{id: "axiology_opt1", name: "Hedonism"}, {id: "axiology_opt2", name: "Eudaimonism"}],
  Mythology: [{id: "mythology_opt1", name: "Monotheism"}, {id: "mythology_opt2", name: "Polytheism"}],
  Cosmology: [{id: "cosmology_opt1", name: "Big Bang Theory"}, {id: "cosmology_opt2", name: "Steady State Theory"}],
  Teleology: [{id: "teleology_opt1", name: "Nihilism"}, {id: "teleology_opt2", name: "Existential Purpose"}],
};

export default function BuilderPage() {
  const { facetSelections, selectWorldviewForFacet, clearFacetSelection, activeProfile, domainScores: currentDomainScores, addSavedWorldview } = useWorldview();
  const [worldviewTitle, setWorldviewTitle] = useState(activeProfile?.title || "My Custom Worldview");

  // This would be more complex, fetching scores from selected codex entries
  const builderDomainScores: DomainScore[] = FACET_NAMES.map(name => {
    const selectedOptId = facetSelections[name];
    // Simulate scores based on selection - in real app, fetch from codex entry
    let score = 0.5; // Default
    if(selectedOptId) {
      const facetOpts = dummyCodexOptions[name];
      if (facetOpts && facetOpts.length > 0) {
         score = selectedOptId === facetOpts[0].id ? 0.8 : 0.3; // Example scoring
      }
    }
    return { facetName: name, score };
  });

  const handleSaveWorldview = () => {
    const newProfile = {
      id: `custom_${Date.now()}`,
      title: worldviewTitle,
      domainScores: builderDomainScores,
      facetSelections,
      createdAt: new Date().toISOString(),
    };
    addSavedWorldview(newProfile);
    alert(`Worldview "${worldviewTitle}" saved!`);
  };

  const handleClearSelections = () => {
    FACET_NAMES.forEach(name => clearFacetSelection(name));
    setWorldviewTitle("My Custom Worldview");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Worldview Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Facet Selectors */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle>Construct Your Worldview</CardTitle>
              <CardDescription>Select one system from the Codex for each of the 7 facets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {FACET_NAMES.map(facetName => {
                const facet = FACETS[facetName];
                const options = dummyCodexOptions[facetName] || [];
                return (
                  <div key={facetName} className="p-4 rounded-md border border-border bg-background/30">
                    <label htmlFor={`${facetName}-select`} className="block text-md font-semibold mb-2" style={{color: `hsl(var(${facet.colorVariable.slice(2)}))`}}>
                      {facet.name} <span className="text-xs text-muted-foreground">({facet.tagline})</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={facetSelections[facetName]}
                        onValueChange={(value) => value ? selectWorldviewForFacet(facetName, value) : clearFacetSelection(facetName)}
                      >
                        <SelectTrigger id={`${facetName}-select`} className="flex-grow bg-background/50">
                          <SelectValue placeholder={`Select a view for ${facetName}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Clear Selection</SelectItem>
                          {options.map(opt => (
                            <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/facet/${facetName.toLowerCase()}`}><Icons.search className="h-4 w-4 mr-1" /> Explore</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Triangle and Actions */}
        <div className="space-y-6">
          <Card className="glassmorphic-card sticky top-24"> {/* Sticky for visibility */}
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <TriangleChart scores={builderDomainScores} className="mx-auto mb-6" />
              <div className="mb-4">
                <label htmlFor="worldview-title" className="block text-sm font-medium mb-1">Worldview Title</label>
                <input 
                  id="worldview-title" 
                  type="text"
                  value={worldviewTitle}
                  onChange={(e) => setWorldviewTitle(e.target.value)}
                  placeholder="E.g., My Reflective Stance"
                  className="w-full p-2 rounded-md border border-input bg-background/50 text-foreground focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button onClick={handleSaveWorldview}><Icons.save className="mr-2 h-4 w-4" /> Save Worldview to Library</Button>
                <Button variant="outline" onClick={handleClearSelections}><Icons.delete className="mr-2 h-4 w-4" /> Clear All Selections</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
