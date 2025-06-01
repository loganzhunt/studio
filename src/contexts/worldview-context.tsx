"use client";

import type { WorldviewContextType, WorldviewProfile, AssessmentAnswers, DomainScore, FacetName, LocalUser } from "@/types";
import React, { createContext, useState, useEffect, useCallback } from "react";
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
  type User as FirebaseUser 
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

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
  domainScores: Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(name => ({ facetName: name, score: 0 })) : [],
  calculateDomainScores: () => { return Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(name => ({ facetName: name, score: 0 })) : []; },
  hasAssessmentBeenRun: false,
  userDomainScores: Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(name => ({ facetName: name, score: 0 })) : [],
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

  // Convert Firebase user to LocalUser format
  const firebaseUserToLocalUser = (firebaseUser: FirebaseUser): LocalUser => {
    const isGoogleProvider = firebaseUser.providerData.some(provider => provider.providerId === 'google.com');
    return {
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      uid: firebaseUser.uid,
      photoURL: firebaseUser.photoURL || undefined,
      provider: isGoogleProvider ? 'google' : 'email',
      emailVerified: firebaseUser.emailVerified
    };
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      const localUser = firebaseUserToLocalUser(userCredential.user);
      setCurrentUser(localUser);
      
      toast({ 
        title: "Account Created!", 
        description: `Welcome to Meta-Prism, ${displayName}!` 
      });
      closeAuthModal();
    } catch (error: any) {
      console.error("Email sign-up error:", error);
      
      let message = "Failed to create account.";
      if (error.code === 'auth/email-already-in-use') {
        message = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      }
      
      toast({ 
        title: "Sign-up Failed", 
        description: message,
        variant: "destructive"
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const localUser = firebaseUserToLocalUser(userCredential.user);
      setCurrentUser(localUser);
      
      toast({ 
        title: "Welcome back!", 
        description: `Signed in as ${localUser?.displayName || 'User'}` 
      });
      closeAuthModal();
    } catch (error: any) {
      console.error("Email sign-in error:", error);
      
      let message = "Failed to sign in.";
      if (error.code === 'auth/user-not-found') {
        message = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Incorrect password.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later.";
      }
      
      toast({ 
        title: "Sign-in Failed", 
        description: message,
        variant: "destructive"
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const localUser = firebaseUserToLocalUser(result.user);
      setCurrentUser(localUser);
      
      toast({ 
        title: "Welcome!", 
        description: `Signed in with Google as ${localUser?.displayName || 'User'}` 
      });
      closeAuthModal();
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      let message = "Failed to sign in with Google.";
      if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in was cancelled.";
      } else if (error.code === 'auth/popup-blocked') {
        message = "Please allow popups for this site and try again.";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        message = "An account already exists with this email using a different sign-in method.";
      }
      
      toast({ 
        title: "Google Sign-in Failed", 
        description: message,
        variant: "destructive"
      });
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ 
        title: "Password Reset Sent", 
        description: "Check your email for password reset instructions." 
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      let message = "Failed to send password reset email.";
      if (error.code === 'auth/user-not-found') {
        message = "No account found with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      }
      
      toast({ 
        title: "Password Reset Failed", 
        description: message,
        variant: "destructive"
      });
    }
  };

  const signOutUser = () => {
    signOut(auth).then(() => {
      setCurrentUser(null);
      toast({ title: "Signed Out", description: "You have been signed out successfully." });
    }).catch((error) => {
      console.error("Sign-out error:", error);
      toast({ 
        title: "Sign-out Error", 
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    });
  };

  const persistState = useCallback(() => {
    if (!isLoaded || !currentUser?.uid) return;
    
    try {
      // Use user-specific keys for data storage
      const userKey = currentUser.uid;
      localStorage.setItem(`metaPrismAssessmentAnswers_${userKey}`, JSON.stringify(assessmentAnswers));
      localStorage.setItem(`metaPrismDomainScores_${userKey}`, JSON.stringify(domainScores));
      localStorage.setItem(`metaPrismSavedWorldviews_${userKey}`, JSON.stringify(savedWorldviews));
      localStorage.setItem(`metaPrismFacetSelections_${userKey}`, JSON.stringify(facetSelections));
    } catch (error) {
      console.error("Error saving app state to localStorage:", error);
    }
  }, [assessmentAnswers, domainScores, savedWorldviews, facetSelections, isLoaded, currentUser?.uid]);

  const loadStateFromLocalStorage = useCallback(() => {
    try {
      if (currentUser?.uid) {
        // Load user-specific data
        const userKey = currentUser.uid;
        
        // Check for user-specific data first
        let storedAnswers = localStorage.getItem(`metaPrismAssessmentAnswers_${userKey}`);
        let storedScores = localStorage.getItem(`metaPrismDomainScores_${userKey}`);
        let storedSavedWorldviews = localStorage.getItem(`metaPrismSavedWorldviews_${userKey}`);
        let storedFacetSelections = localStorage.getItem(`metaPrismFacetSelections_${userKey}`);
        
        // Migration: If no user-specific data exists, check for old format data and migrate it
        if (!storedAnswers) {
          // Check for old local demo keys
          const legacyAnswers = localStorage.getItem("metaPrismAssessmentAnswers_local") || 
                               localStorage.getItem("metaPrismAssessmentAnswers");
          if (legacyAnswers) {
            storedAnswers = legacyAnswers;
            localStorage.setItem(`metaPrismAssessmentAnswers_${userKey}`, legacyAnswers);
            console.log("Migrated assessment answers from legacy storage");
          }
        }
        
        if (!storedScores) {
          const legacyScores = localStorage.getItem("metaPrismDomainScores_local") || 
                              localStorage.getItem("metaPrismDomainScores");
          if (legacyScores) {
            storedScores = legacyScores;
            localStorage.setItem(`metaPrismDomainScores_${userKey}`, legacyScores);
            console.log("Migrated domain scores from legacy storage");
          }
        }
        
        if (!storedSavedWorldviews) {
          const legacyWorldviews = localStorage.getItem("metaPrismSavedWorldviews_local") || 
                                  localStorage.getItem("metaPrismSavedWorldviews");
          if (legacyWorldviews) {
            storedSavedWorldviews = legacyWorldviews;
            localStorage.setItem(`metaPrismSavedWorldviews_${userKey}`, legacyWorldviews);
            console.log("Migrated saved worldviews from legacy storage");
          }
        }
        
        if (!storedFacetSelections) {
          const legacySelections = localStorage.getItem("metaPrismFacetSelections_local") || 
                                  localStorage.getItem("metaPrismFacetSelections");
          if (legacySelections) {
            storedFacetSelections = legacySelections;
            localStorage.setItem(`metaPrismFacetSelections_${userKey}`, legacySelections);
            console.log("Migrated facet selections from legacy storage");
          }
        }

        // Load the data
        if (storedAnswers) setAssessmentAnswers(JSON.parse(storedAnswers));

        if (storedScores) {
          setDomainScores(JSON.parse(storedScores));
        } else {
          const tempAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};
          if(Object.keys(tempAnswers).length > 0) {
             const calculated = calculateAllDomainScores(tempAnswers, FACETS);
             setDomainScores(calculated);
          }
        }

        if (storedSavedWorldviews) setSavedWorldviews(JSON.parse(storedSavedWorldviews));
        if (storedFacetSelections) setFacetSelections(JSON.parse(storedFacetSelections));
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    }
    setIsLoaded(true);
  }, [currentUser?.uid]);

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const localUser = firebaseUserToLocalUser(firebaseUser);
        setCurrentUser(localUser);
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadStateFromLocalStorage();
    }
  }, [currentUser, loadStateFromLocalStorage]);

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
    return newScores;
  }, [assessmentAnswers]);

  const addSavedWorldview = (profile: WorldviewProfile) => {
    const newId = profile.id || `profile_${Date.now()}`;
    const profileWithId = { ...profile, id: newId, createdAt: new Date().toISOString() };
    setSavedWorldviews(prev => [...prev, profileWithId]);
    toast({ title: "Profile Saved", description: `"${profile.title}" has been saved.` });
  };

  const updateSavedWorldview = (profile: WorldviewProfile) => {
    setSavedWorldviews(prev => prev.map(p => p.id === profile.id ? profile : p));
    toast({ title: "Profile Updated", description: `"${profile.title}" has been updated.` });
  };

  const deleteSavedWorldview = (profileId: string) => {
    setSavedWorldviews(prev => {
      const profileToDelete = prev.find(p => p.id === profileId);
      if (profileToDelete) {
        toast({ title: "Profile Deleted", description: `"${profileToDelete.title}" has been removed.` });
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

  // Calculate if assessment has been run based on whether we have valid answers
  const hasAssessmentBeenRun = Object.keys(assessmentAnswers).length > 0 && 
    FACET_NAMES.some(facetName => 
      Object.keys(assessmentAnswers).some(key => key.toLowerCase().startsWith(facetName.toLowerCase()))
    );

  // Provide userDomainScores as an alias for domainScores for backward compatibility
  const userDomainScores = domainScores;

  return (
    <WorldviewContext.Provider value={{
      currentUser,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOutUser,
      sendPasswordReset,
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
      hasAssessmentBeenRun,
      userDomainScores,
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
