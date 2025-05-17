
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

export function AuthForm() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    signInLocally, // Updated to local sign-in
    currentUser
  } = useWorldview();
  const { toast } = useToast();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (currentUser && isAuthModalOpen) {
      closeAuthModal();
    }
  }, [currentUser, isAuthModalOpen, closeAuthModal]);

  const handleLocalSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: "Missing Fields", description: "Please enter both name and email.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      signInLocally(name, email);
      // Modal closure is handled by useEffect above or by signInLocally directly
    } catch (error: any) {
      toast({
        title: "Sign-in Error",
        description: error.message || "Failed to sign in locally.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      setName("");
      setEmail("");
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 glassmorphic-card !bg-card/80 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center">
            Sign In (Local Demo)
          </DialogTitle>
          <DialogDescription className="text-center pt-1">
            Enter any name and email to simulate a local session.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          <Alert variant="default" className="bg-accent/20 border-accent/50">
            <Icons.info className="h-4 w-4 !text-accent-foreground" />
            <AlertTitle className="font-semibold text-accent-foreground">Local Demo Mode</AlertTitle>
            <AlertDescription className="text-accent-foreground/80 text-xs">
              Your name and email are stored only in your browser (localStorage). This data is not secure, not shared, and will be lost if you clear your browser data. Do not enter real sensitive information.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLocalSignIn} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="local-name">Name</Label>
              <Input
                id="local-name"
                placeholder="E.g., Alex Prism"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="local-email">Email</Label>
              <Input
                id="local-email"
                placeholder="alex@example.com (not validated)"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-background/50"
              />
            </div>
            <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
              {isSubmitting ? <Icons.spinner className="animate-spin mr-2" /> : null}
              Sign In (Local Demo)
            </Button>
          </form>
        </div>
        <DialogFooter className="p-6 pt-2 border-t border-border/30 mt-auto sm:justify-start">
          <DialogClose asChild>
            <Button variant="ghost" className="w-full sm:w-auto">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Placeholder for Icons.spinner if not already defined
if (!Icons.spinner) {
  Icons.spinner = Icons.loader; // Assuming loader is an alias for a spinner
}
if (!Icons.loader) { // Define loader if it's not available, for spinner fallback
  Icons.loader = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;
}
