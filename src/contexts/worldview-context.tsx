
"use client";

import type { WorldviewContextType, WorldviewProfile, AssessmentAnswers, DomainScore, FacetName } from "@/types";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { FACETS, FACET_NAMES } from "@/config/facets"; // Import FACETS

const defaultWorldviewContext: WorldviewContextType = {
  activeProfile: null,
  setActiveProfile: () => {},
  assessmentAnswers: {},
  setAssessmentAnswers: () => {},
  updateAssessmentAnswer: () => {},
  domainScores: FACET_NAMES.map(name => ({ facetName: name, score: 0 })),
  calculateDomainScores: () => { return []; }, // Ensure it matches the new return type
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
    if (!isLoaded) return; 
    try {
      localStorage.setItem("metaPrismState", JSON.stringify({
        activeProfile,
        assessmentAnswers,
        domainScores, // domainScores in context are also persisted
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
    const newScores: DomainScore[] = FACET_NAMES.map(facetName => {
      const facetConfig = FACETS[facetName];
      const questionsForFacet = facetConfig.questions.length; // Should be 10
      let sumForFacet = 0;
      let answeredCount = 0;

      for (let i = 0; i < questionsForFacet; i++) {
        const questionId = `${facetName}_q${i}`;
        if (assessmentAnswers[questionId] !== undefined) {
          sumForFacet += assessmentAnswers[questionId];
          answeredCount++;
        }
      }

      let score = 0;
      // Ensure all questions for the facet are answered to calculate a meaningful score
      if (answeredCount === questionsForFacet && questionsForFacet > 0) {
        const minSum = questionsForFacet * 1; // Min score for each question is 1 (Likert 1-5)
        const maxSum = questionsForFacet * 5; // Max score for each question is 5 (Likert 1-5)
        if (maxSum - minSum > 0) { // Avoid division by zero if only 1 question or scale is 1 point
             score = (sumForFacet - minSum) / (maxSum - minSum);
        } else if (maxSum - minSum === 0 && questionsForFacet > 0) { // Handle case for single point scale (e.g. all questions must be 3)
            score = sumForFacet / questionsForFacet === minSum / questionsForFacet ? 1 : 0; // Simplified for single point example
        }
      }
      
      return { facetName, score: Math.max(0, Math.min(1, score)) };
    });
    setDomainScores(newScores); // Update context state
    return newScores; // Return for immediate use by caller
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
