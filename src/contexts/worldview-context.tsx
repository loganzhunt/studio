"use client";

import type { WorldviewContextType, WorldviewProfile, AssessmentAnswers, DomainScore, FacetName } from "@/types";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { FACET_NAMES } from "@/config/facets";

const defaultWorldviewContext: WorldviewContextType = {
  activeProfile: null,
  setActiveProfile: () => {},
  assessmentAnswers: {},
  setAssessmentAnswers: () => {},
  updateAssessmentAnswer: () => {},
  domainScores: FACET_NAMES.map(name => ({ facetName: name, score: 0 })),
  calculateDomainScores: () => {},
  savedWorldviews: [],
  addSavedWorldview: () => {},
  updateSavedWorldview: () => {},
  deleteSavedWorldview: () => {},
  facetSelections: {},
  selectWorldviewForFacet: () => {},
  clearFacetSelection: () => {},
  loadStateFromLocalStorage: () => {},
};

export const WorldviewContext = createContext<WorldviewContextType>(defaultWorldviewContext);

export const WorldviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeProfile, setActiveProfile] = useState<WorldviewProfile | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<AssessmentAnswers>({});
  const [domainScores, setDomainScores] = useState<DomainScore[]>(defaultWorldviewContext.domainScores);
  const [savedWorldviews, setSavedWorldviews] = useState<WorldviewProfile[]>([]);
  const [facetSelections, setFacetSelections] = useState<{ [K_FacetName in FacetName]?: string }>({});
  const [isLoaded, setIsLoaded] = useState(false);


  const persistState = useCallback(() => {
    if (!isLoaded) return; // Don't persist until loaded
    try {
      localStorage.setItem("metaPrismState", JSON.stringify({
        activeProfile,
        assessmentAnswers,
        domainScores,
        savedWorldviews,
        facetSelections,
      }));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [activeProfile, assessmentAnswers, domainScores, savedWorldviews, facetSelections, isLoaded]);
  
  const loadStateFromLocalStorage = useCallback(() => {
    try {
      const storedState = localStorage.getItem("metaPrismState");
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        if (parsedState.activeProfile) setActiveProfile(parsedState.activeProfile);
        if (parsedState.assessmentAnswers) setAssessmentAnswers(parsedState.assessmentAnswers);
        if (parsedState.domainScores) setDomainScores(parsedState.domainScores);
        if (parsedState.savedWorldviews) setSavedWorldviews(parsedState.savedWorldviews);
        if (parsedState.facetSelections) setFacetSelections(parsedState.facetSelections);
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);


  useEffect(() => {
    loadStateFromLocalStorage();
  }, [loadStateFromLocalStorage]);

  useEffect(() => {
    if (isLoaded) {
      persistState();
    }
  }, [persistState, isLoaded]);


  const updateAssessmentAnswer = (questionId: string, value: number) => {
    setAssessmentAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateDomainScores = useCallback(() => {
    // Placeholder logic: This should average questions per facet
    // Assume questions are named like "Ontology_q1", "Ontology_q2", etc.
    // And Likert scale is 1-7. Normalize to 0-1.
    const newScores: DomainScore[] = FACET_NAMES.map(facetName => {
      let total = 0;
      let count = 0;
      for (const qId in assessmentAnswers) {
        if (qId.startsWith(facetName)) {
          total += assessmentAnswers[qId];
          count++;
        }
      }
      // Assuming 10 questions per facet, Likert 1-7. Max score 70, min 10.
      // Normalized score: (actual_sum - min_sum) / (max_sum - min_sum)
      // min_sum = count * 1, max_sum = count * 7 (if 1-7 scale)
      // If questions are 0-indexed for answers (e.g. 0-4 for 5 options)
      // and 10 questions, min_sum = 0, max_sum = 40.
      // For now, a simpler placeholder:
      const score = count > 0 ? (total / (count * 7)) : 0; // Simple average, assuming 1-7 scale
      return { facetName, score: Math.max(0, Math.min(1, score)) };
    });
    setDomainScores(newScores);
  }, [assessmentAnswers]);

  const addSavedWorldview = (profile: WorldviewProfile) => {
    setSavedWorldviews(prev => [...prev, profile]);
  };

  const updateSavedWorldview = (profile: WorldviewProfile) => {
    setSavedWorldviews(prev => prev.map(p => p.id === profile.id ? profile : p));
  };

  const deleteSavedWorldview = (profileId: string) => {
    setSavedWorldviews(prev => prev.filter(p => p.id !== profileId));
  };
  
  const selectWorldviewForFacet = (facetName: FacetName, worldviewId: string) => {
    setFacetSelections(prev => ({ ...prev, [facetName]: worldviewId }));
  };

  const clearFacetSelection = (facetName: FacetName) => {
    setFacetSelections(prev => {
      const newState = { ...prev };
      delete newState[facetName];
      return newState;
    });
  };


  return (
    <WorldviewContext.Provider value={{
      activeProfile,
      setActiveProfile,
      assessmentAnswers,
      setAssessmentAnswers,
      updateAssessmentAnswer,
      domainScores,
      calculateDomainScores,
      savedWorldviews,
      addSavedWorldview,
      updateSavedWorldview,
      deleteSavedWorldview,
      facetSelections,
      selectWorldviewForFacet,
      clearFacetSelection,
      loadStateFromLocalStorage,
    }}>
      {children}
    </WorldviewContext.Provider>
  );
};
