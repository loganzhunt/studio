"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
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
import type { LocalUser } from "@/types";
import {
  AppError,
  FirebaseAuthErrorCode,
  isFirebaseAuthError,
} from "@/types/errors";

export interface UseAuthReturn {
  currentUser: LocalUser;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isLoading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [currentUser, setCurrentUser] = useState<LocalUser>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Convert Firebase user to our LocalUser type
  const firebaseUserToLocalUser = useCallback(
    (firebaseUser: FirebaseUser): LocalUser => {
      const isGoogleProvider = firebaseUser.providerData.some(
        (provider) => provider.providerId === "google.com"
      );
      return {
        displayName:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "User",
        email: firebaseUser.email || "",
        uid: firebaseUser.uid,
        photoURL: firebaseUser.photoURL || undefined,
        provider: isGoogleProvider ? "google" : "email",
        emailVerified: firebaseUser.emailVerified,
      };
    },
    []
  );

  // Sign up with email and password
  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName });

        const localUser = firebaseUserToLocalUser(userCredential.user);
        setCurrentUser(localUser);
        setIsAuthModalOpen(false);

        toast({
          title: "Account Created!",
          description: `Welcome to Meta-Prism, ${displayName}!`,
        });
      } catch (error: unknown) {
        console.error("Email sign-up error:", error);
        let message = "Failed to create account.";
        if (isFirebaseAuthError(error)) {
          if (error.code === FirebaseAuthErrorCode.EMAIL_ALREADY_IN_USE) {
            message = "An account with this email already exists.";
          } else if (error.code === FirebaseAuthErrorCode.WEAK_PASSWORD) {
            message = "Password should be at least 6 characters.";
          }
        }
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    },
    [firebaseUserToLocalUser, toast]
  );

  // Sign in with email and password
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const localUser = firebaseUserToLocalUser(userCredential.user);
        setCurrentUser(localUser);
        setIsAuthModalOpen(false);

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } catch (error: unknown) {
        console.error("Email sign-in error:", error);
        let message = "Failed to sign in.";
        if (isFirebaseAuthError(error)) {
          if (
            error.code === FirebaseAuthErrorCode.USER_NOT_FOUND ||
            error.code === FirebaseAuthErrorCode.WRONG_PASSWORD
          ) {
            message = "Invalid email or password.";
          }
        }
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    },
    [firebaseUserToLocalUser, toast]
  );

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const localUser = firebaseUserToLocalUser(result.user);
      setCurrentUser(localUser);
      setIsAuthModalOpen(false);

      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      const message = "Failed to sign in with Google.";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUserToLocalUser, toast]);

  // Sign out
  const signOutUser = useCallback(() => {
    signOut(auth);
    setCurrentUser(null);
    toast({ title: "Signed out", description: "You have been signed out." });
  }, [toast]);

  // Send password reset email
  const sendPasswordReset = useCallback(
    async (email: string) => {
      try {
        await sendPasswordResetEmail(auth, email);
        toast({
          title: "Password reset sent",
          description: "Check your email for password reset instructions.",
        });
      } catch (error: unknown) {
        console.error("Password reset error:", error);
        const message = "Failed to send password reset email.";
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    },
    [toast]
  );

  // Auth modal handlers
  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const localUser = firebaseUserToLocalUser(firebaseUser);
        setCurrentUser(localUser);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseUserToLocalUser]);

  return {
    currentUser,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOutUser,
    sendPasswordReset,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    isLoading,
    error,
  };
}
