"use client";

import { useState } from "react";
import { FACETS, FACET_NAMES } from "@/config/facets";
import type { FacetName, DomainScore } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TriangleChart from "@/components/visualization/TriangleChart";
import { Icons } from "@/components/icons";
import { useWorldview } from "@/hooks/use-worldview";
import Link from "next/link";
import { Input } from "@/components/ui/input";

// Dummy Codex entries for selection
// In a real app, these would come from a data source (e.g., the Codex entries themselves)
// and would include actual scores for each facet.
const dummyCodexOptions: Record<
  FacetName,
  {
    id: string;
    name: string;
    facetScores: Partial<Record<FacetName, number>>;
  }[]
> = {
  Ontology: [
    {
      id: "ontology_materialism",
      name: "Materialism",
      facetScores: {
        Ontology: 0.9,
        Epistemology: 0.7,
        Praxeology: 0.5,
        Axiology: 0.4,
        Mythology: 0.2,
        Cosmology: 0.8,
        Teleology: 0.3,
      },
    },
    {
      id: "ontology_idealism",
      name: "Idealism",
      facetScores: {
        Ontology: 0.2,
        Epistemology: 0.4,
        Praxeology: 0.6,
        Axiology: 0.7,
        Mythology: 0.8,
        Cosmology: 0.3,
        Teleology: 0.7,
      },
    },
  ],
  Epistemology: [
    {
      id: "epistemology_empiricism",
      name: "Empiricism",
      facetScores: {
        Ontology: 0.6,
        Epistemology: 0.9,
        Praxeology: 0.7,
        Axiology: 0.5,
        Mythology: 0.3,
        Cosmology: 0.6,
        Teleology: 0.4,
      },
    },
    {
      id: "epistemology_rationalism",
      name: "Rationalism",
      facetScores: {
        Ontology: 0.4,
        Epistemology: 0.2,
        Praxeology: 0.5,
        Axiology: 0.6,
        Mythology: 0.7,
        Cosmology: 0.4,
        Teleology: 0.6,
      },
    },
  ],
  Praxeology: [
    {
      id: "praxeology_consequentialism",
      name: "Consequentialism",
      facetScores: {
        Ontology: 0.5,
        Epistemology: 0.6,
        Praxeology: 0.9,
        Axiology: 0.8,
        Mythology: 0.4,
        Cosmology: 0.5,
        Teleology: 0.7,
      },
    },
    {
      id: "praxeology_deontology",
      name: "Deontology",
      facetScores: {
        Ontology: 0.6,
        Epistemology: 0.5,
        Praxeology: 0.2,
        Axiology: 0.3,
        Mythology: 0.6,
        Cosmology: 0.6,
        Teleology: 0.4,
      },
    },
  ],
  Axiology: [
    {
      id: "axiology_hedonism",
      name: "Hedonism",
      facetScores: {
        Ontology: 0.4,
        Epistemology: 0.3,
        Praxeology: 0.7,
        Axiology: 0.9,
        Mythology: 0.5,
        Cosmology: 0.4,
        Teleology: 0.8,
      },
    },
    {
      id: "axiology_eudaimonism",
      name: "Eudaimonism",
      facetScores: {
        Ontology: 0.7,
        Epistemology: 0.6,
        Praxeology: 0.4,
        Axiology: 0.2,
        Mythology: 0.7,
        Cosmology: 0.7,
        Teleology: 0.3,
      },
    },
  ],
  Mythology: [
    {
      id: "mythology_monotheism",
      name: "Monotheism",
      facetScores: {
        Ontology: 0.8,
        Epistemology: 0.7,
        Praxeology: 0.6,
        Axiology: 0.7,
        Mythology: 0.9,
        Cosmology: 0.8,
        Teleology: 0.9,
      },
    },
    {
      id: "mythology_polytheism",
      name: "Polytheism",
      facetScores: {
        Ontology: 0.3,
        Epistemology: 0.4,
        Praxeology: 0.5,
        Axiology: 0.4,
        Mythology: 0.2,
        Cosmology: 0.3,
        Teleology: 0.2,
      },
    },
  ],
  Cosmology: [
    {
      id: "cosmology_bigbang",
      name: "Big Bang Theory",
      facetScores: {
        Ontology: 0.7,
        Epistemology: 0.8,
        Praxeology: 0.4,
        Axiology: 0.3,
        Mythology: 0.1,
        Cosmology: 0.9,
        Teleology: 0.2,
      },
    },
    {
      id: "cosmology_steadystate",
      name: "Steady State Theory",
      facetScores: {
        Ontology: 0.4,
        Epistemology: 0.3,
        Praxeology: 0.6,
        Axiology: 0.5,
        Mythology: 0.4,
        Cosmology: 0.2,
        Teleology: 0.5,
      },
    },
  ],
  Teleology: [
    {
      id: "teleology_nihilism",
      name: "Nihilism",
      facetScores: {
        Ontology: 0.1,
        Epistemology: 0.2,
        Praxeology: 0.1,
        Axiology: 0.1,
        Mythology: 0.1,
        Cosmology: 0.1,
        Teleology: 0.1,
      },
    },
    {
      id: "teleology_existentialpurpose",
      name: "Existential Purpose",
      facetScores: {
        Ontology: 0.6,
        Epistemology: 0.7,
        Praxeology: 0.8,
        Axiology: 0.8,
        Mythology: 0.7,
        Cosmology: 0.6,
        Teleology: 0.9,
      },
    },
  ],
};

export default function BuilderPage() {
  const {
    facetSelections,
    selectWorldviewForFacet,
    clearFacetSelection,
    activeProfile,
    domainScores: currentDomainScores,
    addSavedWorldview,
    savedWorldviews,
  } = useWorldview();
  const [worldviewTitle, setWorldviewTitle] = useState(
    activeProfile?.title || "My Custom Worldview"
  );

  // Ensure we have valid FACET_NAMES before proceeding
  if (!FACET_NAMES || !Array.isArray(FACET_NAMES) || FACET_NAMES.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Error</CardTitle>
            <CardDescription>
              Unable to load facet configuration. Please check the system setup.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const builderDomainScores: DomainScore[] =
    FACET_NAMES?.map((name) => {
      const selectedOptId = facetSelections?.[name];
      let score = 0.5; // Default neutral score

      if (selectedOptId && dummyCodexOptions && name in dummyCodexOptions) {
        const facetOptions = dummyCodexOptions[name];
        if (Array.isArray(facetOptions)) {
          const selectedOptionData = facetOptions.find(
            (opt) => opt?.id === selectedOptId
          );
          if (
            selectedOptionData &&
            selectedOptionData.facetScores &&
            typeof selectedOptionData.facetScores === "object"
          ) {
            // Prioritize the score for the current facet if available
            const specificScore = selectedOptionData.facetScores[name];
            if (
              typeof specificScore === "number" &&
              specificScore >= 0 &&
              specificScore <= 1
            ) {
              score = specificScore;
            } else {
              // Fallback: average of all scores in the selected option, or 0.5 if none
              const scoresArray = Object.values(
                selectedOptionData.facetScores
              ).filter(
                (s) => typeof s === "number" && s >= 0 && s <= 1
              ) as number[];
              if (scoresArray.length > 0) {
                score =
                  scoresArray.reduce((acc, s) => acc + s, 0) /
                  scoresArray.length;
              }
            }
          }
        }
      }
      return { facetName: name, score: Math.max(0, Math.min(1, score)) };
    }) || [];

  const handleSaveWorldview = () => {
    // Check if title already exists
    if (
      savedWorldviews.some(
        (profile) =>
          profile.title.toLowerCase() === worldviewTitle.toLowerCase().trim()
      )
    ) {
      alert(
        `A worldview profile named "${worldviewTitle.trim()}" already exists. Please choose a different title.`
      );
      return;
    }
    if (!worldviewTitle.trim()) {
      alert("Please enter a title for your worldview.");
      return;
    }

    const newProfile = {
      id: `custom_${Date.now()}_${worldviewTitle
        .toLowerCase()
        .replace(/\s+/g, "_")}`,
      title: worldviewTitle.trim(),
      domainScores: builderDomainScores,
      facetSelections, // Save the IDs of the selected worldviews for each facet
      createdAt: new Date().toISOString(),
    };
    addSavedWorldview(newProfile);
    alert(`Worldview "${worldviewTitle.trim()}" saved!`);
  };

  const handleClearSelections = () => {
    if (Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0) {
      FACET_NAMES.forEach((name) => {
        if (name && clearFacetSelection) {
          clearFacetSelection(name);
        }
      });
    }
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
              <CardDescription>
                Select one system from the Codex for each of the 7 facets. Your
                choices will generate a unique Meta-Prism signature.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {FACET_NAMES && Array.isArray(FACET_NAMES) ? (
                FACET_NAMES.map((facetName) => {
                  const facet = FACETS?.[facetName];
                  if (!facet) {
                    return (
                      <div
                        key={facetName}
                        className="p-4 rounded-md border border-red-500 bg-red-50"
                      >
                        <p className="text-red-700">
                          Error: Facet configuration not found for {facetName}
                        </p>
                      </div>
                    );
                  }

                  const options = dummyCodexOptions?.[facetName] || [];
                  return (
                    <div
                      key={facetName}
                      className="p-4 rounded-md border border-border/30 bg-background/40"
                    >
                      <label
                        htmlFor={`${facetName}-select`}
                        className="block text-md font-semibold mb-2"
                        style={{
                          color: `hsl(var(${facet.colorVariable.slice(2)}))`,
                        }}
                      >
                        {facet.name}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({facet.tagline})
                        </span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={facetSelections?.[facetName] || ""}
                          onValueChange={(value) =>
                            value
                              ? selectWorldviewForFacet(facetName, value)
                              : clearFacetSelection(facetName)
                          }
                        >
                          <SelectTrigger
                            id={`${facetName}-select`}
                            className="flex-grow bg-muted/80 border-border/60 hover:bg-muted/90 transition-all duration-200 hover:border-white/30 hover:shadow-[0_3px_10px_rgba(0,0,0,0.15)] hover:translate-y-[-1px]"
                          >
                            <SelectValue
                              placeholder={`Select a view for ${facetName}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(options) && options.length > 0 ? (
                              options.map((opt) =>
                                opt && opt.id ? (
                                  <SelectItem key={opt.id} value={opt.id}>
                                    {opt.name || "Unnamed Option"}
                                  </SelectItem>
                                ) : null
                              )
                            ) : (
                              <SelectItem value="no_options" disabled>
                                No options available for this facet
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-muted/60 border-border/60 hover:bg-muted/80 text-foreground/90 hover:text-foreground relative overflow-hidden transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-[0_3px_10px_rgba(139,92,246,0.15)] active:translate-y-[0px] active:scale-[0.98] group"
                          asChild
                        >
                          <Link href={`/facet/${facetName.toLowerCase()}`}>
                            <Icons.search className="h-4 w-4 mr-1 group-hover:animate-[icon-pulse_0.6s_ease-in-out]" /> Explore
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-animation" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-md border border-red-500 bg-red-50">
                  <p className="text-red-700">
                    Error: FACET_NAMES is not properly configured
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Triangle and Actions */}
        <div className="space-y-6">
          <Card className="glassmorphic-card sticky top-24">
            {" "}
            {/* Sticky for visibility */}
            <CardHeader>
              <CardTitle>Live Preview & Save</CardTitle>
            </CardHeader>
            <CardContent>
              <TriangleChart
                scores={builderDomainScores}
                worldviewName={worldviewTitle || "Custom Worldview"}
                className="mx-auto mb-6 !p-0 !bg-transparent !shadow-none !backdrop-blur-none transition-transform duration-300 hover:scale-[1.03]"
                width={250}
                height={217}
              />
              <div className="mb-4">
                <label
                  htmlFor="worldview-title"
                  className="block text-sm font-medium mb-1 text-foreground/80"
                >
                  Worldview Title
                </label>
                <Input
                  id="worldview-title"
                  type="text"
                  value={worldviewTitle}
                  onChange={(e) => setWorldviewTitle(e.target.value)}
                  placeholder="E.g., My Reflective Stance"
                  className="w-full p-2 rounded-md border border-input bg-background/50 text-foreground focus:ring-primary focus:border-primary transition-all duration-200 hover:border-white/30 hover:bg-white/5 focus:hover:border-primary focus:translate-y-[-1px] focus:shadow-[0_3px_10px_rgba(139,92,246,0.15)]"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSaveWorldview}
                  disabled={!worldviewTitle.trim()}
                  className="relative overflow-hidden transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-[0_3px_10px_rgba(139,92,246,0.15)] active:translate-y-[0px] active:scale-[0.98] group"
                >
                  <Icons.saved className="mr-2 h-4 w-4 group-hover:animate-[icon-pulse_0.6s_ease-in-out]" /> Save Worldview to
                  Library
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-animation" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearSelections}
                  className="relative overflow-hidden transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-[0_3px_10px_rgba(139,92,246,0.15)] active:translate-y-[0px] active:scale-[0.98] group"
                >
                  <Icons.delete className="mr-2 h-4 w-4 group-hover:animate-[icon-pulse_0.6s_ease-in-out]" /> Clear All Selections
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-animation" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
