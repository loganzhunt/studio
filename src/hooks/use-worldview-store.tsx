"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { WorldviewProfile, FacetName } from "@/types";

export interface UseWorldviewStoreReturn {
  activeProfile: WorldviewProfile | null;
  setActiveProfile: (profile: WorldviewProfile | null) => void;
  savedWorldviews: WorldviewProfile[];
  setSavedWorldviews: (worldviews: WorldviewProfile[]) => void;
  addSavedWorldview: (profile: WorldviewProfile) => void;
  updateSavedWorldview: (profile: WorldviewProfile) => void;
  deleteSavedWorldview: (profileId: string) => void;
  facetSelections: { [K_FacetName in FacetName]?: string };
  setFacetSelections: (selections: {
    [K_FacetName in FacetName]?: string;
  }) => void;
  selectWorldviewForFacet: (facetName: FacetName, worldviewId: string) => void;
  clearFacetSelection: (facetName: FacetName) => void;
}

export function useWorldviewStore(
  initialSavedWorldviews: WorldviewProfile[] = [],
  initialFacetSelections: { [K_FacetName in FacetName]?: string } = {}
): UseWorldviewStoreReturn {
  const [activeProfile, setActiveProfile] = useState<WorldviewProfile | null>(
    null
  );
  const [savedWorldviews, setSavedWorldviews] = useState<WorldviewProfile[]>(
    initialSavedWorldviews
  );
  const [facetSelections, setFacetSelections] = useState<{
    [K_FacetName in FacetName]?: string;
  }>(initialFacetSelections);
  const { toast } = useToast();

  // Add a new worldview profile
  const addSavedWorldview = useCallback(
    (profile: WorldviewProfile) => {
      const newId = profile.id || `profile_${Date.now()}`;
      const profileWithId = {
        ...profile,
        id: newId,
        createdAt: new Date().toISOString(),
      };
      setSavedWorldviews((prev) => [...prev, profileWithId]);
      toast({
        title: "Profile Saved",
        description: `"${profile.title}" has been saved.`,
      });
    },
    [toast]
  );

  // Update an existing worldview profile
  const updateSavedWorldview = useCallback(
    (profile: WorldviewProfile) => {
      setSavedWorldviews((prev) =>
        prev.map((p) => (p.id === profile.id ? profile : p))
      );
      toast({
        title: "Profile Updated",
        description: `"${profile.title}" has been updated.`,
      });
    },
    [toast]
  );

  // Delete a worldview profile
  const deleteSavedWorldview = useCallback((profileId: string) => {
    setSavedWorldviews((prev) => prev.filter((p) => p.id !== profileId));
  }, []);

  // Select a worldview for a specific facet
  const selectWorldviewForFacet = useCallback(
    (facetName: FacetName, worldviewId: string) => {
      setFacetSelections((prev) => ({
        ...prev,
        [facetName]: worldviewId,
      }));
    },
    []
  );

  // Clear facet selection for a specific facet
  const clearFacetSelection = useCallback((facetName: FacetName) => {
    setFacetSelections((prev) => {
      const newSelections = { ...prev };
      delete newSelections[facetName];
      return newSelections;
    });
  }, []);

  return {
    activeProfile,
    setActiveProfile,
    savedWorldviews,
    setSavedWorldviews,
    addSavedWorldview,
    updateSavedWorldview,
    deleteSavedWorldview,
    facetSelections,
    setFacetSelections,
    selectWorldviewForFacet,
    clearFacetSelection,
  };
}
