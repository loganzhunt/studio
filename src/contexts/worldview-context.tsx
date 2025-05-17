
"use client";

import type { WorldviewContextType, WorldviewProfile, AssessmentAnswers, DomainScore, FacetName, LocalUser } from "@/types";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { calculateAllDomainScores } from "@/lib/scoring";
// Firebase imports are removed for local demo
// import { auth, db, googleProvider } from "@/lib/firebase";
// import { onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, type User as FirebaseUser } from "firebase/auth";
// import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";


const defaultWorldviewContext: WorldviewContextType = {
  currentUser: null,
  signInLocally: () => {},
  signOutUser: () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  activeProfile: null,
  setActiveProfile: () => {},
  assessmentAnswers: {},
  setAssessmentAnswers: () => {},
  updateAssessmentAnswer: () => {},
  domainScores: FACET_NAMES.map(name => ({ facetName: name, score: 0 })),
  calculateDomainScores: () => { return FACET_NAMES.map(name => ({ facetName: name, score: 0 })); },
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

const LOCAL_USER_STORAGE_KEY = 'metaPrismLocalUser';
const ASSESSMENT_SCORES_STORAGE_KEY = 'metaPrismAssessmentScores';
const SAVED_WORLDVIEWS_STORAGE_KEY = 'metaPrismSavedWorldviews_local'; // For local demo

export const WorldviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<LocalUser>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<WorldviewProfile | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<AssessmentAnswers>({});
  const [domainScores, setDomainScores] = useState<DomainScore[]>(defaultWorldviewContext.domainScores);
  const [savedWorldviews, setSavedWorldviews] = useState<WorldviewProfile[]>([]);
  const [facetSelections, setFacetSelections] = useState<{ [K_FacetName in FacetName]?: string }>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signInLocally = (name: string, email: string) => {
    if (!name.trim() || !email.trim()) {
      toast({ title: "Name and Email Required", description: "Please enter both name and email.", variant: "destructive" });
      return;
    }
    const localUser: LocalUser = { displayName: name, email: email };
    setCurrentUser(localUser);
    try {
      localStorage.setItem(LOCAL_USER_STORAGE_KEY, JSON.stringify(localUser));
      toast({ title: "Signed In (Local Demo)", description: `Welcome, ${name}!` });
      closeAuthModal();
    } catch (error) {
      console.error("Error saving local user to localStorage:", error);
      toast({ title: "Storage Error", description: "Could not save user locally.", variant: "destructive" });
    }
  };

  const signOutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
      // Optionally, clear the single saved assessment for this demo user or all local data
      // localStorage.removeItem(ASSESSMENT_SCORES_STORAGE_KEY); // Example: clear last assessment on logout
      toast({ title: "Signed Out", description: "You have been signed out from the local demo." });
    } catch (error) {
      console.error("Error removing local user from localStorage:", error);
    }
  };

  const persistState = useCallback(() => {
    if (!isLoaded) return; 
    try {
      // Local user is persisted separately by signInLocally/signOutUser
      localStorage.setItem("metaPrismAssessmentAnswers_local", JSON.stringify(assessmentAnswers));
      localStorage.setItem("metaPrismDomainScores_local", JSON.stringify(domainScores));
      localStorage.setItem(SAVED_WORLDVIEWS_STORAGE_KEY, JSON.stringify(savedWorldviews));
      localStorage.setItem("metaPrismFacetSelections_local", JSON.stringify(facetSelections));
      // activeProfile is more complex to persist if it contains non-serializable data or is large.
      // For a local demo, maybe we don't persist activeProfile directly or simplify it.
    } catch (error) {
      console.error("Error saving app state to localStorage:", error);
    }
  }, [assessmentAnswers, domainScores, savedWorldviews, facetSelections, isLoaded]);
  
  const loadStateFromLocalStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_USER_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const storedAnswers = localStorage.getItem("metaPrismAssessmentAnswers_local");
      if (storedAnswers) setAssessmentAnswers(JSON.parse(storedAnswers));
      
      const storedScores = localStorage.getItem("metaPrismDomainScores_local");
      if (storedScores) setDomainScores(JSON.parse(storedScores));
      else { // If no stored scores, but answers exist, calculate them
        const tempAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};
        if(Object.keys(tempAnswers).length > 0) {
           const calculated = calculateAllDomainScores(tempAnswers, FACETS);
           setDomainScores(calculated);
        }
      }
      
      const storedSavedWorldviews = localStorage.getItem(SAVED_WORLDVIEWS_STORAGE_KEY);
      if (storedSavedWorldviews) setSavedWorldviews(JSON.parse(storedSavedWorldviews));
      
      const storedFacetSelections = localStorage.getItem("metaPrismFacetSelections_local");
      if (storedFacetSelections) setFacetSelections(JSON.parse(storedFacetSelections));

    } catch (error) {
      console.error("Error loading state from localStorage:", error);
      // Clear potentially corrupted storage
      // localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
      // localStorage.removeItem("metaPrismAssessmentAnswers_local");
      // ... etc.
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
    const newScores = calculateAllDomainScores(assessmentAnswers, FACETS);
    setDomainScores(newScores);
    // For local demo, also save the "latest" assessment scores if a user is "logged in"
    if (currentUser) {
        localStorage.setItem(ASSESSMENT_SCORES_STORAGE_KEY, JSON.stringify(newScores));
        // This key holds the general latest assessment, could be tied to user if needed.
        // For "save one assessment result" this is fine.
    }
    return newScores;
  }, [assessmentAnswers, currentUser]);

  const addSavedWorldview = (profile: WorldviewProfile) => {
    // For local demo, save to localStorage.
    // If a local user is signed in, we could theoretically store it under a user-specific key,
    // but for "one assessment" and simplicity, we'll just add to a general list.
    const newId = profile.id || `local_profile_${Date.now()}`;
    const profileWithId = { ...profile, id: newId, createdAt: new Date().toISOString() };
    setSavedWorldviews(prev => [...prev, profileWithId]);
     toast({ title: "Profile Saved Locally", description: `"${profile.title}" has been saved in your browser.` });
  };

  const updateSavedWorldview = (profile: WorldviewProfile) => {
    setSavedWorldviews(prev => prev.map(p => p.id === profile.id ? profile : p));
    toast({ title: "Profile Updated Locally", description: `"${profile.title}" has been updated in your browser.` });
  };

  const deleteSavedWorldview = (profileId: string) => {
    setSavedWorldviews(prev => {
      const profileToDelete = prev.find(p => p.id === profileId);
      if (profileToDelete) {
        toast({ title: "Profile Deleted Locally", description: `"${profileToDelete.title}" has been removed from your browser.` });
      }
      return prev.filter(p => p.id !== profileId);
    });
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
      currentUser,
      signInLocally,
      signOutUser,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
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

// Helper to recalculate scores if not available directly in storedScores
// This function might be better placed in scoring.ts but kept here for context simplicity.
// calculateAllDomainScores is already imported from @/lib/scoring and should handle this.
// We need to ensure calculateAllDomainScores in scoring.ts takes (assessmentAnswers, FACETS)
// and returns DomainScore[].
