"use client";

import type {
  WorldviewContextType,
  WorldviewProfile,
  AssessmentAnswers,
  DomainScore,
  FacetName,
  LocalUser,
} from "@/types";
import React, { 
  createContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo,
  useReducer 
} from "react";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { calculateAllDomainScores } from "@/lib/scoring";
import { auth, googleProvider } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

// Optimized state management
interface WorldviewState {
  currentUser: LocalUser | null;
  activeProfile: WorldviewProfile | null;
  assessmentAnswers: AssessmentAnswers;
  domainScores: DomainScore[];
  hasAssessmentBeenRun: boolean;
  isAuthModalOpen: boolean;
  loading: boolean;
  error: string | null;
}

type WorldviewAction = 
  | { type: 'SET_USER'; payload: LocalUser | null }
  | { type: 'SET_ACTIVE_PROFILE'; payload: WorldviewProfile | null }
  | { type: 'SET_ASSESSMENT_ANSWERS'; payload: AssessmentAnswers }
  | { type: 'UPDATE_ASSESSMENT_ANSWER'; payload: { facetName: FacetName; answer: number } }
  | { type: 'SET_DOMAIN_SCORES'; payload: DomainScore[] }
  | { type: 'SET_ASSESSMENT_RUN'; payload: boolean }
  | { type: 'SET_AUTH_MODAL'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const worldviewReducer = (state: WorldviewState, action: WorldviewAction): WorldviewState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload, loading: false };
    case 'SET_ACTIVE_PROFILE':
      return { ...state, activeProfile: action.payload };
    case 'SET_ASSESSMENT_ANSWERS':
      return { ...state, assessmentAnswers: action.payload };
    case 'UPDATE_ASSESSMENT_ANSWER':
      return {
        ...state,
        assessmentAnswers: {
          ...state.assessmentAnswers,
          [action.payload.facetName]: action.payload.answer
        }
      };
    case 'SET_DOMAIN_SCORES':
      return { ...state, domainScores: action.payload };
    case 'SET_ASSESSMENT_RUN':
      return { ...state, hasAssessmentBeenRun: action.payload };
    case 'SET_AUTH_MODAL':
      return { ...state, isAuthModalOpen: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState: WorldviewState = {
  currentUser: null,
  activeProfile: null,
  assessmentAnswers: {},
  domainScores: Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
    ? FACET_NAMES.map((name) => ({ facetName: name, score: 0 }))
    : [],
  hasAssessmentBeenRun: false,
  isAuthModalOpen: false,
  loading: true,
  error: null,
};

const defaultWorldviewContext: WorldviewContextType = {
  currentUser: null,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signOutUser: () => {},
  sendPasswordReset: async () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  activeProfile: null,
  setActiveProfile: () => {},
  assessmentAnswers: {},
  setAssessmentAnswers: () => {},
  updateAssessmentAnswer: () => {},
  domainScores: [],
  calculateDomainScores: () => [],
  hasAssessmentBeenRun: false,
  profiles: [],
  setProfiles: () => {},
  saveProfile: () => {},
  deleteProfile: () => {},
  savedWorldviews: [],
  setSavedWorldviews: () => {},
  saveDraftWorldview: () => {},
  loadWorldviewFromDraft: () => {},
  deleteSavedWorldview: () => {},
  facetSelections: {},
  setFacetSelections: () => {},
  clearFacetSelection: () => {},
  addFacetSelection: () => {},
  assessmentStarted: false,
  setAssessmentStarted: () => {},
  facetProgress: {},
  setFacetProgress: () => {},
  currentFacetIndex: 0,
  setCurrentFacetIndex: () => {},
  resetWorldview: () => {},
  loading: false,
  error: null,
};

export const WorldviewContext = createContext<WorldviewContextType>(defaultWorldviewContext);

export const WorldviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(worldviewReducer, initialState);
  const { toast } = useToast();

  // Separate state for features not in the reducer
  const [profiles, setProfiles] = useState<WorldviewProfile[]>([]);
  const [savedWorldviews, setSavedWorldviews] = useState<WorldviewProfile[]>([]);
  const [facetSelections, setFacetSelections] = useState<Record<string, any>>({});
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [facetProgress, setFacetProgress] = useState<Record<string, number>>({});
  const [currentFacetIndex, setCurrentFacetIndex] = useState(0);

  // Memoized Firebase user conversion
  const firebaseUserToLocalUser = useCallback((firebaseUser: FirebaseUser): LocalUser => {
    const isGoogleProvider = firebaseUser.providerData.some(
      (provider) => provider.providerId === "google.com"
    );
    return {
      displayName:
        firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
      email: firebaseUser.email || "",
      uid: firebaseUser.uid,
      photoURL: firebaseUser.photoURL || undefined,
      provider: isGoogleProvider ? "google" : "email",
      emailVerified: firebaseUser.emailVerified,
    };
  }, []);

  // Memoized auth functions
  const signUpWithEmail = useCallback(async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      const localUser = firebaseUserToLocalUser(userCredential.user);
      dispatch({ type: 'SET_USER', payload: localUser });
      dispatch({ type: 'SET_AUTH_MODAL', payload: false });
      
      toast({
        title: "Account Created!",
        description: `Welcome to Meta-Prism, ${displayName}!`,
      });
    } catch (error: any) {
      console.error("Email sign-up error:", error);
      let message = "Failed to create account.";
      if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [firebaseUserToLocalUser, toast]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const localUser = firebaseUserToLocalUser(userCredential.user);
      dispatch({ type: 'SET_USER', payload: localUser });
      dispatch({ type: 'SET_AUTH_MODAL', payload: false });
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error("Email sign-in error:", error);
      let message = "Failed to sign in.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        message = "Invalid email or password.";
      }
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [firebaseUserToLocalUser, toast]);

  const signInWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await signInWithPopup(auth, googleProvider);
      const localUser = firebaseUserToLocalUser(result.user);
      dispatch({ type: 'SET_USER', payload: localUser });
      dispatch({ type: 'SET_AUTH_MODAL', payload: false });
      
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      const message = "Failed to sign in with Google.";
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [firebaseUserToLocalUser, toast]);

  const signOutUser = useCallback(() => {
    signOut(auth);
    dispatch({ type: 'SET_USER', payload: null });
    toast({ title: "Signed out", description: "You have been signed out." });
  }, [toast]);

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      const message = "Failed to send password reset email.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [toast]);

  // Memoized calculation functions
  const calculateDomainScores = useCallback(() => {
    const newScores = calculateAllDomainScores(state.assessmentAnswers, FACETS);
    dispatch({ type: 'SET_DOMAIN_SCORES', payload: newScores });
    return newScores;
  }, [state.assessmentAnswers]);

  const updateAssessmentAnswer = useCallback((facetName: FacetName, answer: number) => {
    dispatch({ type: 'UPDATE_ASSESSMENT_ANSWER', payload: { facetName, answer } });
  }, []);

  const setActiveProfile = useCallback((profile: WorldviewProfile | null) => {
    dispatch({ type: 'SET_ACTIVE_PROFILE', payload: profile });
  }, []);

  const setAssessmentAnswers = useCallback((answers: AssessmentAnswers) => {
    dispatch({ type: 'SET_ASSESSMENT_ANSWERS', payload: answers });
  }, []);

  const openAuthModal = useCallback(() => {
    dispatch({ type: 'SET_AUTH_MODAL', payload: true });
  }, []);

  const closeAuthModal = useCallback(() => {
    dispatch({ type: 'SET_AUTH_MODAL', payload: false });
  }, []);

  // Placeholder functions for features not implemented in reducer yet
  const saveProfile = useCallback(() => {}, []);
  const deleteProfile = useCallback(() => {}, []);
  const saveDraftWorldview = useCallback(() => {}, []);
  const loadWorldviewFromDraft = useCallback(() => {}, []);
  const deleteSavedWorldview = useCallback(() => {}, []);
  const clearFacetSelection = useCallback(() => {}, []);
  const addFacetSelection = useCallback(() => {}, []);
  const resetWorldview = useCallback(() => {}, []);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const localUser = firebaseUserToLocalUser(firebaseUser);
        dispatch({ type: 'SET_USER', payload: localUser });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    });
    return () => unsubscribe();
  }, [firebaseUserToLocalUser]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // User auth
    currentUser: state.currentUser,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOutUser,
    sendPasswordReset,
    
    // Auth modal
    isAuthModalOpen: state.isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    
    // Assessment
    activeProfile: state.activeProfile,
    setActiveProfile,
    assessmentAnswers: state.assessmentAnswers,
    setAssessmentAnswers,
    updateAssessmentAnswer,
    domainScores: state.domainScores,
    calculateDomainScores,
    hasAssessmentBeenRun: state.hasAssessmentBeenRun,
    
    // Profiles and worldviews
    profiles,
    setProfiles,
    saveProfile,
    deleteProfile,
    savedWorldviews,
    setSavedWorldviews,
    saveDraftWorldview,
    loadWorldviewFromDraft,
    deleteSavedWorldview,
    
    // Facet selections
    facetSelections,
    setFacetSelections,
    clearFacetSelection,
    addFacetSelection,
    
    // Assessment progress
    assessmentStarted,
    setAssessmentStarted,
    facetProgress,
    setFacetProgress,
    currentFacetIndex,
    setCurrentFacetIndex,
    
    // Utilities
    resetWorldview,
    loading: state.loading,
    error: state.error,
  }), [
    state.currentUser,
    state.isAuthModalOpen,
    state.activeProfile,
    state.assessmentAnswers,
    state.domainScores,
    state.hasAssessmentBeenRun,
    state.loading,
    state.error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOutUser,
    sendPasswordReset,
    openAuthModal,
    closeAuthModal,
    setActiveProfile,
    setAssessmentAnswers,
    updateAssessmentAnswer,
    calculateDomainScores,
    profiles,
    setProfiles,
    saveProfile,
    deleteProfile,
    savedWorldviews,
    setSavedWorldviews,
    saveDraftWorldview,
    loadWorldviewFromDraft,
    deleteSavedWorldview,
    facetSelections,
    setFacetSelections,
    clearFacetSelection,
    addFacetSelection,
    assessmentStarted,
    setAssessmentStarted,
    facetProgress,
    setFacetProgress,
    currentFacetIndex,
    setCurrentFacetIndex,
    resetWorldview,
  ]);

  return (
    <WorldviewContext.Provider value={contextValue}>
      {children}
    </WorldviewContext.Provider>
  );
};
