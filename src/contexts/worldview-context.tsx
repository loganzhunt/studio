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
  useReducer,
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
import { ErrorBoundary } from "@/components/error-boundary";

// Enhanced state management with reducer pattern
interface WorldviewState {
  currentUser: LocalUser | null;
  activeProfile: WorldviewProfile | null;
  assessmentAnswers: AssessmentAnswers;
  domainScores: DomainScore[];
  hasAssessmentBeenRun: boolean;
  isAuthModalOpen: boolean;
  loading: boolean;
  error: string | null;
  savedWorldviews: WorldviewProfile[];
  facetSelections: { [K_FacetName in FacetName]?: string };
}

type WorldviewAction =
  | { type: "SET_USER"; payload: LocalUser | null }
  | { type: "SET_ACTIVE_PROFILE"; payload: WorldviewProfile | null }
  | { type: "SET_ASSESSMENT_ANSWERS"; payload: AssessmentAnswers }
  | {
      type: "UPDATE_ASSESSMENT_ANSWER";
      payload: { facetName: FacetName; answer: number };
    }
  | { type: "SET_DOMAIN_SCORES"; payload: DomainScore[] }
  | { type: "SET_ASSESSMENT_RUN"; payload: boolean }
  | { type: "SET_AUTH_MODAL"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SAVED_WORLVIEWS"; payload: WorldviewProfile[] }
  | { type: "SET_SAVED_WORLVIEW"; payload: WorldviewProfile[] }
  | {
      type: "SET_FACET_SELECTIONS";
      payload: { [K_FacetName in FacetName]?: string };
    };

const worldviewReducer = (
  state: WorldviewState,
  action: WorldviewAction
): WorldviewState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, currentUser: action.payload, loading: false };
    case "SET_ACTIVE_PROFILE":
      return { ...state, activeProfile: action.payload };
    case "SET_ASSESSMENT_ANSWERS":
      return { ...state, assessmentAnswers: action.payload };
    case "UPDATE_ASSESSMENT_ANSWER":
      return {
        ...state,
        assessmentAnswers: {
          ...state.assessmentAnswers,
          [action.payload.facetName]: action.payload.answer,
        },
      };
    case "SET_DOMAIN_SCORES":
      return { ...state, domainScores: action.payload };
    case "SET_ASSESSMENT_RUN":
      return { ...state, hasAssessmentBeenRun: action.payload };
    case "SET_AUTH_MODAL":
      return { ...state, isAuthModalOpen: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_SAVED_WORLVIEWS":
    case "SET_SAVED_WORLVIEW":
      return { ...state, savedWorldviews: action.payload };
    case "SET_FACET_SELECTIONS":
      return { ...state, facetSelections: action.payload };
    default:
      return state;
  }
};

const initialState: WorldviewState = {
  currentUser: null,
  activeProfile: null,
  assessmentAnswers: {},
  domainScores:
    Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
      ? FACET_NAMES.map((name) => ({ facetName: name, score: 0 }))
      : [],
  hasAssessmentBeenRun: false,
  isAuthModalOpen: false,
  loading: true,
  error: null,
  savedWorldviews: [],
  facetSelections: {},
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
  domainScores:
    Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
      ? FACET_NAMES.map((name) => ({ facetName: name, score: 0 }))
      : [],
  calculateDomainScores: () => {
    return Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
      ? FACET_NAMES.map((name) => ({ facetName: name, score: 0 }))
      : [];
  },
  hasAssessmentBeenRun: false,
  userDomainScores:
    Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
      ? FACET_NAMES.map((name) => ({ facetName: name, score: 0 }))
      : [],
  savedWorldviews: [],
  addSavedWorldview: () => {},
  updateSavedWorldview: () => {},
  deleteSavedWorldview: () => {},
  facetSelections: {},
  selectWorldviewForFacet: () => {},
  clearFacetSelection: () => {},
  loadStateFromLocalStorage: () => {},
  isLoading: false,
  error: null,
};

export const WorldviewContext = createContext<WorldviewContextType>(
  defaultWorldviewContext
);

export const WorldviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(worldviewReducer, initialState);
  const { toast } = useToast();

  const openAuthModal = () =>
    dispatch({ type: "SET_AUTH_MODAL", payload: true });
  const closeAuthModal = () =>
    dispatch({ type: "SET_AUTH_MODAL", payload: false });

  // Convert Firebase user to LocalUser format
  const firebaseUserToLocalUser = (firebaseUser: FirebaseUser): LocalUser => {
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
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      const localUser = firebaseUserToLocalUser(userCredential.user);
      dispatch({ type: "SET_USER", payload: localUser });

      toast({
        title: "Account Created!",
        description: `Welcome to Meta-Prism, ${displayName}!`,
      });
      closeAuthModal();
    } catch (error: any) {
      console.error("Email sign-up error:", error);

      let message = "Failed to create account.";
      if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      toast({
        title: "Sign-up Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const localUser = firebaseUserToLocalUser(userCredential.user);
      dispatch({ type: "SET_USER", payload: localUser });

      toast({
        title: "Welcome back!",
        description: `Signed in as ${localUser?.displayName || "User"}`,
      });
      closeAuthModal();
    } catch (error: any) {
      console.error("Email sign-in error:", error);

      let message = "Failed to sign in.";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later.";
      }

      toast({
        title: "Sign-in Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const localUser = firebaseUserToLocalUser(result.user);
      dispatch({ type: "SET_USER", payload: localUser });

      toast({
        title: "Welcome!",
        description: `Signed in with Google as ${
          localUser?.displayName || "User"
        }`,
      });
      closeAuthModal();
    } catch (error: any) {
      console.error("Google sign-in error:", error);

      let message = "Failed to sign in with Google.";
      if (error.code === "auth/popup-closed-by-user") {
        message = "Sign-in was cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        message = "Please allow popups for this site and try again.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        message =
          "An account already exists with this email using a different sign-in method.";
      }

      toast({
        title: "Google Sign-in Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);

      let message = "Failed to send password reset email.";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email address.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      toast({
        title: "Password Reset Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: "SET_USER", payload: null });
        toast({
          title: "Signed Out",
          description: "You have been signed out successfully.",
        });
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
        toast({
          title: "Sign-out Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
      });
  };

  const persistState = useCallback(() => {
    if (state.loading || !state.currentUser?.uid) return;

    // Use requestIdleCallback for non-blocking persistence
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        try {
          const userKey = state.currentUser?.uid;
          if (!userKey) return;
          localStorage.setItem(
            `metaPrismAssessmentAnswers_${userKey}`,
            JSON.stringify(state.assessmentAnswers)
          );
          localStorage.setItem(
            `metaPrismDomainScores_${userKey}`,
            JSON.stringify(state.domainScores)
          );
          localStorage.setItem(
            `metaPrismSavedWorldviews_${userKey}`,
            JSON.stringify(state.savedWorldviews)
          );
          localStorage.setItem(
            `metaPrismFacetSelections_${userKey}`,
            JSON.stringify(state.facetSelections)
          );
        } catch (error) {
          console.error("Error saving app state to localStorage:", error);
        }
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        try {
          const userKey = state.currentUser?.uid;
          if (!userKey) return;
          localStorage.setItem(
            `metaPrismAssessmentAnswers_${userKey}`,
            JSON.stringify(state.assessmentAnswers)
          );
          localStorage.setItem(
            `metaPrismDomainScores_${userKey}`,
            JSON.stringify(state.domainScores)
          );
          localStorage.setItem(
            `metaPrismSavedWorldviews_${userKey}`,
            JSON.stringify(state.savedWorldviews)
          );
          localStorage.setItem(
            `metaPrismFacetSelections_${userKey}`,
            JSON.stringify(state.facetSelections)
          );
        } catch (error) {
          console.error("Error saving app state to localStorage:", error);
        }
      }, 0);
    }
  }, [
    state.assessmentAnswers,
    state.domainScores,
    state.savedWorldviews,
    state.facetSelections,
    state.loading,
    state.currentUser?.uid,
  ]);

  const loadStateFromLocalStorage = useCallback(() => {
    // Set isLoaded immediately to prevent blocking
    dispatch({ type: "SET_LOADING", payload: false });

    // Load data asynchronously
    setTimeout(() => {
      try {
        if (state.currentUser?.uid) {
          const userKey = state.currentUser.uid;

          const storedAnswers = localStorage.getItem(
            `metaPrismAssessmentAnswers_${userKey}`
          );
          const storedScores = localStorage.getItem(
            `metaPrismDomainScores_${userKey}`
          );
          const storedSavedWorldviews = localStorage.getItem(
            `metaPrismSavedWorldviews_${userKey}`
          );
          const storedFacetSelections = localStorage.getItem(
            `metaPrismFacetSelections_${userKey}`
          );

          if (storedAnswers)
            dispatch({
              type: "SET_ASSESSMENT_ANSWERS",
              payload: JSON.parse(storedAnswers),
            });
          if (storedScores) {
            dispatch({
              type: "SET_DOMAIN_SCORES",
              payload: JSON.parse(storedScores),
            });
          }
          if (storedSavedWorldviews)
            dispatch({
              type: "SET_SAVED_WORLVIEWS",
              payload: JSON.parse(storedSavedWorldviews),
            });
          if (storedFacetSelections)
            dispatch({
              type: "SET_FACET_SELECTIONS",
              payload: JSON.parse(storedFacetSelections),
            });
        }
      } catch (error) {
        console.error("Error loading state from localStorage:", error);
      }
    }, 0);
  }, [state.currentUser?.uid]);

  useEffect(() => {
    // Set up Firebase auth state listener - make it non-blocking
    let unsubscribe: (() => void) | null = null;

    // Use setTimeout to defer Firebase initialization
    const timeoutId = setTimeout(() => {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in with Firebase
          const localUser = firebaseUserToLocalUser(firebaseUser);
          dispatch({ type: "SET_USER", payload: localUser });
        } else {
          // User is signed out
          dispatch({ type: "SET_USER", payload: null });
        }
      });
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state.currentUser) {
      loadStateFromLocalStorage();
    }
  }, [state.currentUser, loadStateFromLocalStorage]);

  useEffect(() => {
    if (state.loading) {
      persistState();
    }
  }, [persistState, state.loading]);

  const updateAssessmentAnswer = (questionId: string, value: number) => {
    dispatch({
      type: "UPDATE_ASSESSMENT_ANSWER",
      payload: { facetName: questionId as FacetName, answer: value },
    });
  };

  const calculateDomainScores = useCallback(() => {
    const newScores = calculateAllDomainScores(state.assessmentAnswers, FACETS);
    dispatch({ type: "SET_DOMAIN_SCORES", payload: newScores });
    return newScores;
  }, [state.assessmentAnswers]);

  const addSavedWorldview = (profile: WorldviewProfile) => {
    const newId = profile.id || `profile_${Date.now()}`;
    const profileWithId = {
      ...profile,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    dispatch({
      type: "SET_SAVED_WORLVIEW",
      payload: [...state.savedWorldviews, profileWithId],
    });
    toast({
      title: "Profile Saved",
      description: `"${profile.title}" has been saved.`,
    });
  };

  const updateSavedWorldview = (profile: WorldviewProfile) => {
    dispatch({
      type: "SET_SAVED_WORLVIEW",
      payload: state.savedWorldviews.map((p) =>
        p.id === profile.id ? profile : p
      ),
    });
    toast({
      title: "Profile Updated",
      description: `"${profile.title}" has been updated.`,
    });
  };

  const deleteSavedWorldview = (profileId: string) => {
    dispatch({
      type: "SET_SAVED_WORLVIEW",
      payload: state.savedWorldviews.filter((p) => p.id !== profileId),
    });
  };

  const selectWorldviewForFacet = (
    facetName: FacetName,
    worldviewId: string
  ) => {
    dispatch({
      type: "SET_FACET_SELECTIONS",
      payload: { ...state.facetSelections, [facetName]: worldviewId },
    });
  };

  const clearFacetSelection = (facetName: FacetName) => {
    dispatch({
      type: "SET_FACET_SELECTIONS",
      payload: { ...state.facetSelections, [facetName]: undefined },
    });
  };

  // Calculate if assessment has been run based on whether we have valid answers
  const hasAssessmentBeenRun =
    Object.keys(state.assessmentAnswers).length > 0 &&
    FACET_NAMES.some((facetName) =>
      Object.keys(state.assessmentAnswers).some((key) =>
        key.toLowerCase().startsWith(facetName.toLowerCase())
      )
    );

  // Provide userDomainScores as an alias for domainScores for backward compatibility
  const userDomainScores = state.domainScores;

  const value = useMemo(
    () => ({
      currentUser: state.currentUser,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOutUser,
      sendPasswordReset,
      isAuthModalOpen: state.isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      activeProfile: state.activeProfile,
      setActiveProfile: (profile: WorldviewProfile | null) =>
        dispatch({ type: "SET_ACTIVE_PROFILE", payload: profile }),
      assessmentAnswers: state.assessmentAnswers,
      setAssessmentAnswers: (answers: AssessmentAnswers) =>
        dispatch({ type: "SET_ASSESSMENT_ANSWERS", payload: answers }),
      updateAssessmentAnswer,
      domainScores: state.domainScores,
      calculateDomainScores,
      hasAssessmentBeenRun,
      userDomainScores,
      savedWorldviews: state.savedWorldviews,
      addSavedWorldview,
      updateSavedWorldview,
      deleteSavedWorldview,
      facetSelections: state.facetSelections,
      selectWorldviewForFacet,
      clearFacetSelection,
      loadStateFromLocalStorage,
      isLoading: state.loading,
      error: state.error,
    }),
    [
      state,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOutUser,
      sendPasswordReset,
      closeAuthModal,
      openAuthModal,
      updateAssessmentAnswer,
      calculateDomainScores,
      addSavedWorldview,
      updateSavedWorldview,
      deleteSavedWorldview,
      selectWorldviewForFacet,
      clearFacetSelection,
      loadStateFromLocalStorage,
    ]
  );

  return (
    <WorldviewContext.Provider value={value}>
      {children}
    </WorldviewContext.Provider>
  );
};
