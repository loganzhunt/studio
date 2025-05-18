
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Removed DialogClose from here if it was imported
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { FACETS } from '@/config/facets'; // Import FACETS for icons
import { FacetIcon } from '@/components/facet-icon'; // Import FacetIcon

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingStepsData = [
  {
    icon: Icons.sparkles,
    headline: "See Your Worldview Through a New Lens",
    title: "Welcome to Meta-Prism",
    text: "This interactive tool reveals how you filter, interpret, and create meaning—across seven symbolic dimensions of reality."
  },
  {
    icon: Icons.logo,
    headline: "Your Symbolic Prism",
    title: "What is Meta-Prism?",
    text: "Your worldview acts as a symbolic “prism,” refracting experience into color and pattern.\nVisualize your hidden assumptions, and explore how you see the world."
  },
  {
    icon: Icons.list,
    headline: "Explore the Seven Facets",
    title: "Meet the 7 Facets",
    text: "Each lens reveals a different dimension of your perspective:",
    facets: [
      { name: "Ontology" as const, question: FACETS.Ontology.tagline },
      { name: "Epistemology" as const, question: FACETS.Epistemology.tagline },
      { name: "Praxeology" as const, question: FACETS.Praxeology.tagline },
      { name: "Axiology" as const, question: FACETS.Axiology.tagline },
      { name: "Mythology" as const, question: FACETS.Mythology.tagline },
      { name: "Cosmology" as const, question: FACETS.Cosmology.tagline },
      { name: "Teleology" as const, question: FACETS.Teleology.tagline },
    ]
  },
  {
    icon: Icons.assessment,
    headline: "Map Your Spectrum",
    title: "How the Assessment Works",
    text: "Answer 70 rapid-fire statements (10 per domain).\nYour answers generate a unique “worldview signature”—a color-coded triangle chart that maps your symbolic spectrum."
  },
  {
    icon: Icons.results,
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
    if (stepIndex < currentStep) { 
      setCurrentStep(stepIndex);
    }
  };
  
  const currentStepData = onboardingStepsData[currentStep];

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
        className="bg-background/60 backdrop-blur-xl rounded-2xl shadow-xl border border-border/30 p-0 flex flex-col max-w-lg w-[95vw] max-h-[90vh] sm:max-h-[85vh]"
        onInteractOutside={(e) => e.preventDefault()} 
      >
        <DialogHeader className="p-3 sm:p-4 md:p-6 text-center border-b border-border/30 relative">
          <div className="flex justify-center items-center space-x-2 mb-2 sm:mb-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                disabled={index >= currentStep && index !== 0}
                className={cn(
                  "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all duration-300 ease-in-out",
                  currentStep === index ? "bg-primary scale-125" : "bg-muted/50 hover:bg-muted",
                  index < currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-70"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-center items-center mb-1 sm:mb-2">
            {React.createElement(currentStepData.icon, { className: "h-8 w-8 sm:h-10 sm:w-10 text-primary" })}
          </div>
           <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">{currentStepData.title}</DialogTitle>
           {/* The explicit DialogClose button that might cause a duplicate 'X' is removed from here. 
               ShadCN DialogContent provides its own default close button. */}
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 min-h-[100px] sm:min-h-[120px]">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground text-center">{currentStepData.headline}</h2>
          
          {currentStepData.text.split('\n').map((paragraph, index) => (
            <p key={index} className="text-sm text-muted-foreground text-center leading-relaxed">
              {paragraph}
            </p>
          ))}

          {currentStepData.facets && (
            <div className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground/90 p-1.5 bg-muted/30 rounded-md">
              {currentStepData.facets.map(facet => (
                <div key={facet.name} className="flex items-center space-x-1.5">
                  <FacetIcon facetName={facet.name} className="h-4 w-4" />
                  <span className="font-medium text-foreground/90 whitespace-nowrap">{facet.name}</span>
                  <span className="whitespace-nowrap text-xs">– {facet.question}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="p-3 sm:p-4 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="w-full sm:w-auto order-last sm:order-first text-muted-foreground hover:text-foreground text-xs sm:text-sm px-3 py-1.5 h-auto sm:h-9"
          >
            Skip
          </Button>
          <div className="flex w-full sm:w-auto space-x-2 sm:space-x-3">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-1.5 h-auto sm:h-9"
              >
                <Icons.chevronRight className="h-3.5 w-3.5 mr-1 rotate-180"/> Back
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm px-3 py-1.5 h-auto sm:h-9"
            >
              {currentStep === totalSteps - 1 ? "Start Assessment" : "Next"}
              {currentStep < totalSteps - 1 && <Icons.chevronRight className="h-3.5 w-3.5 ml-1"/>}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    