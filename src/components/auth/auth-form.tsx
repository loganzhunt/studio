
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorldview } from "@/hooks/use-worldview";
import { useToast } from "@/hooks/use-toast";

export function AuthForm() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    sendPasswordResetEmail,
    currentUser
  } = useWorldview();
  const { toast } = useToast();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("signin"); // "signin" or "signup"
  const [showPasswordReset, setShowPasswordReset] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");


  React.useEffect(() => {
    // If user becomes authenticated while modal is open, close it.
    if (currentUser && isAuthModalOpen) {
      closeAuthModal();
    }
  }, [currentUser, isAuthModalOpen, closeAuthModal]);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      // Modal will be closed by useEffect if successful
    } catch (error: any) {
      toast({
        title: "Sign-in Error",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password);
      // Modal will be closed by useEffect if successful
    } catch (error: any) {
      toast({
        title: "Sign-up Error",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      // Modal will be closed by useEffect if successful
    } catch (error: any) {
      toast({
        title: "Sign-in Error",
        description: error.message || "Failed to sign in with email.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({ title: "Missing Email", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(resetEmail);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, a reset link has been sent.",
      });
      setShowPasswordReset(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Password Reset Error",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      setEmail("");
      setPassword("");
      setResetEmail("");
      setShowPasswordReset(false);
      setActiveTab("signin");
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl">
        {!showPasswordReset ? (
          <>
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-2xl font-bold text-center">
                {activeTab === 'signin' ? 'Welcome Back' : 'Create Your Account'}
              </DialogTitle>
              <DialogDescription className="text-center">
                {activeTab === 'signin' 
                  ? 'Sign in to continue your journey with Meta-Prism.'
                  : 'Join Meta-Prism to save your insights and explore your worldview.'}
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pt-2 pb-6">
              <Button
                variant="outline"
                className="w-full h-12 text-base border-border hover:bg-muted/50 mb-6 flex items-center justify-center gap-2 shadow-sm"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                <Icons.google className="h-5 w-5" />
                Sign in with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="email-signin">Email</Label>
                      <Input
                        id="email-signin"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password-signin">Password</Label>
                      <Input
                        id="password-signin"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-background/50"
                      />
                    </div>
                    <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
                      {isSubmitting ? <Icons.spinner className="animate-spin mr-2" /> : null}
                      Sign In
                    </Button>
                  </form>
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-sm text-primary p-0 h-auto" onClick={() => setShowPasswordReset(true)}>
                      Forgot password?
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="signup">
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input
                        id="email-signup"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input
                        id="password-signup"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-background/50"
                      />
                    </div>
                    <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
                      {isSubmitting ? <Icons.spinner className="animate-spin mr-2" /> : null}
                      Sign Up
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          // Password Reset View
          <>
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-2xl font-bold text-center">
                Reset Your Password
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter your email address and we'll send you a link to reset your password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordResetRequest} className="px-6 py-4 space-y-4">
               <div className="space-y-1">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  placeholder="name@example.com"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-background/50"
                />
              </div>
              <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
                {isSubmitting ? <Icons.spinner className="animate-spin mr-2" /> : null}
                Send Reset Link
              </Button>
              <Button variant="link" className="w-full text-sm" onClick={() => setShowPasswordReset(false)} disabled={isSubmitting}>
                Back to Sign In
              </Button>
            </form>
          </>
        )}
        <DialogFooter className="p-6 pt-0 border-t border-border/30 mt-auto sm:justify-start">
          <DialogClose asChild>
            <Button variant="ghost" className="w-full sm:w-auto">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Placeholder for Icons.google and Icons.spinner if not already defined
if (!Icons.google) {
  Icons.google = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>; // Example shield icon
}
if (!Icons.spinner) {
  Icons.spinner = Icons.loader; // Assuming loader is an alias for a spinner
}
if (!Icons.loader) { // Define loader if it's not available, for spinner fallback
  Icons.loader = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;
}

    