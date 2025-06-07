"use client";

import * as React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorldview } from "@/hooks/use-worldview";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isFirebaseAuthError } from "@/types/errors";

export function AuthForm() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    currentUser,
  } = useWorldview();
  const { toast } = useToast();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [mode, setMode] = React.useState<"signin" | "signup" | "reset">(
    "signin"
  );

  React.useEffect(() => {
    if (currentUser && isAuthModalOpen) {
      closeAuthModal();
    }
  }, [currentUser, isAuthModalOpen, closeAuthModal]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }
    if (mode === "reset") {
      setIsSubmitting(true);
      try {
        await sendPasswordReset(email);
      } catch (error: unknown) {
        console.error("Password reset error:", error);
      }
      setIsSubmitting(false);
      return;
    }
    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }
    if (mode === "signup" && !displayName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your display name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: unknown) {
      console.error("Email auth error:", error);
    }
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
    }
    setIsSubmitting(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      setEmail("");
      setPassword("");
      setDisplayName("");
      setMode("signin");
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Create Account"
              : "Reset Password"}
          </DialogTitle>
          <DialogDescription className="text-center pt-1">
            {mode === "signin"
              ? "Welcome back to Meta-Prism"
              : mode === "signup"
              ? "Join Meta-Prism to save your worldview"
              : "Enter your email to reset your password"}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="your@email.com"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-background/50"
              />
            </div>
            {mode !== "reset" && (
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background/50"
                />
              </div>
            )}
            {mode === "signup" && (
              <div className="space-y-1">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your display name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background/50"
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Icons.loader className="animate-spin mr-2" />
              ) : null}
              {mode === "signin"
                ? "Sign In"
                : mode === "signup"
                ? "Create Account"
                : "Send Reset Email"}
            </Button>
          </form>

          {mode !== "reset" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-10"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </>
          )}

          <div className="text-center space-y-2">
            {mode === "signin" && (
              <>
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot your password?
                </button>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}
            {mode === "signup" && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </div>
            )}
            {mode === "reset" && (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
        <DialogFooter className="p-6 pt-2 border-t border-border/30 mt-auto sm:justify-start">
          <DialogClose asChild>
            <Button variant="ghost" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
