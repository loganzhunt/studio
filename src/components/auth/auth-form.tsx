
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
    signInLocally,
    currentUser
  } = useWorldview();
  const { toast } = useToast();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (currentUser && isAuthModalOpen) {
      // If user becomes current (e.g. successful local sign in) while modal is open, close it.
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
      signInLocally(name, email); // Context handles setting user and localStorage
      // Modal closure should ideally be handled by useEffect watching currentUser or by signInLocally if it's guaranteed to update context state synchronously.
      // For now, explicit closeAuthModal() is removed here as useEffect above should handle it.
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
      setName(""); // Reset form fields when modal is closed
      setEmail("");
    }
    // If opening, isAuthModalOpen from context should already be true.
    // This handler primarily manages closure.
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
              {isSubmitting ? <Icons.loader className="animate-spin mr-2" /> : null}
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
