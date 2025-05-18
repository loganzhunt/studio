
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Using Progress for step bar
import { Icons } from '@/components/icons'; // For generic icons
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingStepsData = [
  {
    icon: Icons.sparkles, // Placeholder icon
    headline: "See Your Worldview Through a New Lens",
    title: "Welcome to Meta-Prism",
    text: "This interactive tool reveals how you filter, interpret, and create meaning—across seven symbolic dimensions of reality."
  },
  {
    icon: Icons.logo, // Placeholder icon
    headline: "Your Symbolic Prism",
    title: "What is Meta-Prism?",
    text: "Your worldview acts as a symbolic “prism,” refracting experience into color and pattern.\nVisualize your hidden assumptions, and explore how you see the world."
  },
  {
    icon: Icons.list, // Placeholder icon
    headline: "Explore the Seven Facets",
    title: "Meet the 7 Facets",
    text: "Each lens reveals a different dimension of your perspective:",
    facets: [
      { name: "Ontology", question: "What is real?" },
      { name: "Epistemology", question: "What can be known?" },
      { name: "Praxeology", question: "How should we act?" },
      { name: "Axiology", question: "What is valuable?" },
      { name: "Mythology", question: "What stories define us?" },
      { name: "Cosmology", question: "How is the universe structured?" },
      { name: "Teleology", question: "What is the purpose?" },
    ]
  },
  {
    icon: Icons.assessment, // Placeholder icon
    headline: "Map Your Spectrum",
    title: "How the Assessment Works",
    text: "Answer 70 rapid-fire statements (10 per domain).\nYour answers generate a unique “worldview signature”—a color-coded triangle chart that maps your symbolic spectrum."
  },
  {
    icon: Icons.results, // Placeholder icon
    headline: "Ready to Discover Your Meta-Prism Signature?",
    title: "Begin Your Journey",
    text: "Your journey is private, intuitive, and always in your control.\nLet’s begin!"
  }
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = onboardingStepsData.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // Finish
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDotClick = (stepIndex: number) => {
    if (stepIndex < currentStep) { // Allow jumping only to previous steps
      setCurrentStep(stepIndex);
    }
  };
  
  const currentStepData = onboardingStepsData[currentStep];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        className="glassmorphic-card !bg-card/80 backdrop-blur-lg !border-border/50 !rounded-2xl !shadow-xl p-0 flex flex-col max-w-lg w-[95vw] max-h-[90vh] sm:max-h-[85vh] md:max-h-[550px]"
        onInteractOutside={(e) => e.preventDefault()} // Prevent closing on outside click for guided flow
      >
        <DialogHeader className="p-4 sm:p-6 text-center border-b border-border/30 relative">
          <div className="flex justify-center items-center space-x-2 mb-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                disabled={index >= currentStep && index !==0} // Disable future steps, allow current or past
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-300 ease-in-out",
                  currentStep === index ? "bg-primary scale-125" : "bg-muted/50 hover:bg-muted",
                  index < currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-70"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
           <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">{currentStepData.title}</DialogTitle>
           <DialogClose 
            className="absolute top-3 right-3 rounded-full p-1.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={onClose} // This is the main "Close X" button
            aria-label="Close onboarding"
           >
            <Icons.close className="h-5 w-5 text-muted-foreground" />
          </DialogClose>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex justify-center mb-3 sm:mb-4">
             {React.createElement(currentStepData.icon, { className: "w-10 h-10 sm:w-12 sm:w-12 text-primary" })}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center">{currentStepData.headline}</h2>
          
          {currentStepData.text.split('\n').map((paragraph, index) => (
            <p key={index} className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed">
              {paragraph}
            </p>
          ))}

          {currentStepData.facets && (
            <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground/90 p-3 bg-muted/30 rounded-md">
              {currentStepData.facets.map(facet => (
                <div key={facet.name} className="flex items-start space-x-1.5">
                  <span className="font-semibold text-foreground/90 whitespace-nowrap">{facet.name}</span>
                  <span className="whitespace-nowrap">– {facet.question}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="p-4 sm:p-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="w-full sm:w-auto order-last sm:order-first text-muted-foreground hover:text-foreground"
            size="sm"
          >
            Skip
          </Button>
          <div className="flex w-full sm:w-auto space-x-3">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="flex-1 sm:flex-none"
                size="sm"
              >
                <Icons.chevronRight className="h-4 w-4 mr-1.5 rotate-180"/> Back
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              {currentStep === totalSteps - 1 ? "Start Assessment" : "Next"}
              {currentStep < totalSteps - 1 && <Icons.chevronRight className="h-4 w-4 ml-1.5"/>}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
