"use client";

import React, { createContext, useContext, useEffect } from "react";
import type {
  WorldviewContextType,
  WorldviewProfile,
  FacetName,
  AssessmentAnswers,
} from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useAssessment } from "@/hooks/use-assessment";
import { useWorldviewStore } from "@/hooks/use-worldview-store";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FACET_NAMES, withValidFacetNames } from "@/config/facets";

// Create context with a default empty value
export const WorldviewContext = createContext<WorldviewContextType | undefined>(
  undefined
);

// WorldviewProvider Props
interface WorldviewProviderProps {
  children: React.ReactNode;
}

/**
 * Provider that combines various hooks to manage worldview data
 * - Authentication
 * - Assessment and scoring
 * - Worldview storage
 * - Facet selection
 * - Local storage persistence
 */
export function WorldviewProvider({ children }: WorldviewProviderProps) {
  // Initialize all the hooks that were previously part of the monolithic context
  const authState = useAuth();
  const assessmentState = useAssessment();
  const worldviewStore = useWorldviewStore();
  const localStorage = useLocalStorage();

  // Load state from localStorage on initial mount
  useEffect(() => {
    // Create a function to handle loading state from localStorage
    const loadFromStorage = () => {
      try {
        // Load assessment answers
        const storedAnswers = localStorage.getItem("assessment-answers");
        if (storedAnswers && typeof storedAnswers === "object") {
          assessmentState.setAssessmentAnswers(
            storedAnswers as AssessmentAnswers
          );
        }

        // Load saved worldviews
        const storedWorldviews = localStorage.getItem("saved-worldviews");
        if (storedWorldviews && Array.isArray(storedWorldviews)) {
          worldviewStore.setSavedWorldviews(storedWorldviews);
        }

        // Load facet selections
        const storedFacetSelections = localStorage.getItem("facet-selections");
        if (
          storedFacetSelections &&
          typeof storedFacetSelections === "object"
        ) {
          // Type assertion to ensure it matches our expected format
          const typedSelections = storedFacetSelections as {
            [K_FacetName in FacetName]?: string;
          };
          worldviewStore.setFacetSelections(typedSelections);
        }

        // Load active profile if it exists
        const storedActiveProfile = localStorage.getItem("active-profile");
        if (
          storedActiveProfile &&
          typeof storedActiveProfile === "object" &&
          "id" in storedActiveProfile &&
          "title" in storedActiveProfile &&
          "domainScores" in storedActiveProfile &&
          "createdAt" in storedActiveProfile
        ) {
          worldviewStore.setActiveProfile(
            storedActiveProfile as WorldviewProfile
          );
        }
      } catch (error) {
        console.error("Error loading state from localStorage:", error);
      }
    };

    loadFromStorage();
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    // Only save if we're in a browser environment
    if (typeof window !== "undefined") {
      // Save assessment answers
      localStorage.setItem(
        "assessment-answers",
        assessmentState.assessmentAnswers
      );

      // Save domain scores
      localStorage.setItem("domain-scores", assessmentState.domainScores);

      // Save saved worldviews
      localStorage.setItem("saved-worldviews", worldviewStore.savedWorldviews);

      // Save facet selections
      localStorage.setItem("facet-selections", worldviewStore.facetSelections);

      // Save active profile
      if (worldviewStore.activeProfile) {
        localStorage.setItem("active-profile", worldviewStore.activeProfile);
      }
    }
  }, [
    assessmentState.assessmentAnswers,
    assessmentState.domainScores,
    worldviewStore.savedWorldviews,
    worldviewStore.facetSelections,
    worldviewStore.activeProfile,
  ]);

  // Create a loadStateFromLocalStorage function for explicit reloads
  const loadStateFromLocalStorage = () => {
    try {
      // Load assessment answers
      const storedAnswers = localStorage.getItem("assessment-answers");
      if (storedAnswers && typeof storedAnswers === "object") {
        assessmentState.setAssessmentAnswers(
          storedAnswers as AssessmentAnswers
        );
      }

      // Load saved worldviews
      const storedWorldviews = localStorage.getItem("saved-worldviews");
      if (storedWorldviews && Array.isArray(storedWorldviews)) {
        worldviewStore.setSavedWorldviews(storedWorldviews);
      }

      // Load facet selections
      const storedFacetSelections = localStorage.getItem("facet-selections");
      if (storedFacetSelections) {
        const typedSelections = storedFacetSelections as {
          [K_FacetName in FacetName]?: string;
        };
        worldviewStore.setFacetSelections(typedSelections);
      }

      // Load active profile
      const storedActiveProfile = localStorage.getItem("active-profile");
      if (
        storedActiveProfile &&
        typeof storedActiveProfile === "object" &&
        "id" in storedActiveProfile &&
        "title" in storedActiveProfile &&
        "domainScores" in storedActiveProfile &&
        "createdAt" in storedActiveProfile
      ) {
        worldviewStore.setActiveProfile(
          storedActiveProfile as WorldviewProfile
        );
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    }
  };

  // Initialize domain scores if empty with zeros
  const initializeDomainScores =
    assessmentState.domainScores.length > 0
      ? assessmentState.domainScores
      : withValidFacetNames(
          (facetNames) =>
            facetNames.map((name) => ({ facetName: name, score: 0 })),
          []
        );

  // Get hasAssessmentBeenRun status
  const hasAssessmentBeenRun =
    Object.keys(assessmentState.assessmentAnswers).length > 0 &&
    FACET_NAMES.some((facetName) =>
      Object.keys(assessmentState.assessmentAnswers).some((key) =>
        key.toLowerCase().startsWith(facetName.toLowerCase())
      )
    );

  // Combine all the states from individual hooks into one context value
  const contextValue: WorldviewContextType = {
    // User auth
    currentUser: authState.currentUser,
    signInWithEmail: authState.signInWithEmail,
    signUpWithEmail: authState.signUpWithEmail,
    signInWithGoogle: authState.signInWithGoogle,
    signOutUser: authState.signOutUser,
    sendPasswordReset: authState.sendPasswordReset,

    // Auth modal
    isAuthModalOpen: authState.isAuthModalOpen,
    openAuthModal: authState.openAuthModal,
    closeAuthModal: authState.closeAuthModal,

    // Assessment
    activeProfile: worldviewStore.activeProfile,
    setActiveProfile: worldviewStore.setActiveProfile,
    assessmentAnswers: assessmentState.assessmentAnswers,
    setAssessmentAnswers: assessmentState.setAssessmentAnswers,
    updateAssessmentAnswer: assessmentState.updateAssessmentAnswer,
    domainScores: initializeDomainScores,
    calculateDomainScores: assessmentState.calculateDomainScores,
    hasAssessmentBeenRun,

    // For backwards compatibility
    userDomainScores: initializeDomainScores,

    // Worldview management
    savedWorldviews: worldviewStore.savedWorldviews,
    addSavedWorldview: worldviewStore.addSavedWorldview,
    updateSavedWorldview: worldviewStore.updateSavedWorldview,
    deleteSavedWorldview: worldviewStore.deleteSavedWorldview,

    // Facet selections
    facetSelections: worldviewStore.facetSelections,
    selectWorldviewForFacet: worldviewStore.selectWorldviewForFacet,
    clearFacetSelection: worldviewStore.clearFacetSelection,

    // Utilities
    loadStateFromLocalStorage,

    // Loading and error states
    isLoading: authState.isLoading,
    error: authState.error,
  };

  return (
    <WorldviewContext.Provider value={contextValue}>
      {children}
    </WorldviewContext.Provider>
  );
}

/**
 * Hook to use the worldview context
 * @returns WorldviewContext value
 */
export function useWorldview(): WorldviewContextType {
  const context = useContext(WorldviewContext);
  if (context === undefined) {
    throw new Error("useWorldview must be used within a WorldviewProvider");
  }
  return context;
}
