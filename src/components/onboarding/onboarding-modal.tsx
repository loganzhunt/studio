
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { FACETS } from '@/config/facets';
import { FacetIcon } from '@/components/facet-icon';

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
    icon: Icons.results, // Using results icon for "Begin Journey"
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
    // Allow jumping only to previously visited steps or current step
    if (stepIndex <= currentStep) { 
      setCurrentStep(stepIndex);
    }
  };
  
  const currentStepData = onboardingStepsData[currentStep];

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to restore body scroll when component unmounts or modal closes
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        className="glassmorphic-card !bg-card/80 backdrop-blur-lg !border-border/50 !rounded-2xl !shadow-xl p-3 sm:p-4 flex flex-col max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto" // Make DialogContent itself scrollable
        onInteractOutside={(e) => e.preventDefault()} 
      >
        <DialogHeader className="pt-2 pb-1 text-center relative">
          {/* Step Indicators */}
          <div className="flex justify-center items-center space-x-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                disabled={index > currentStep} // Disable future steps
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300 ease-in-out",
                  currentStep === index ? "bg-primary scale-125" : "bg-muted/50",
                  index <= currentStep ? "cursor-pointer hover:bg-muted" : "cursor-not-allowed opacity-70"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
          {/* Icon and Title for current step */}
          <div className="flex justify-center items-center mb-1">
            {React.createElement(currentStepData.icon, { className: "h-8 w-8 text-primary" })}
          </div>
           <DialogTitle className="text-lg font-semibold text-foreground">{currentStepData.title}</DialogTitle>
        </DialogHeader>

        {/* Main content area - NO LONGER INDEPENDENTLY SCROLLING, min-h removed or greatly reduced */}
        <div className="px-1 py-2 space-y-2 text-center">
          <h2 className="text-md font-semibold text-foreground">{currentStepData.headline}</h2>
          
          {currentStepData.text.split('\n').map((paragraph, index) => (
            <p key={index} className="text-sm text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}

          {currentStepData.facets && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground/90 p-1.5 bg-muted/30 rounded-md max-w-md mx-auto">
              {currentStepData.facets.map(facet => (
                <div key={facet.name} className="flex items-center space-x-1.5 p-1 text-left"> {/* Text left for facet list */}
                  <FacetIcon facetName={facet.name} className="h-3.5 w-3.5 shrink-0" />
                  <div>
                    <span className="font-medium text-foreground/90 whitespace-nowrap">{facet.name}</span>
                    <span className="whitespace-nowrap text-xs block sm:inline"> – {facet.question}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="p-3 border-t border-border/30 mt-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="w-full sm:w-auto order-last sm:order-first text-muted-foreground hover:text-foreground text-xs px-3 py-1.5 h-auto"
          >
            Skip
          </Button>
          <div className="flex w-full sm:w-auto space-x-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="flex-1 sm:flex-none text-xs px-3 py-1.5 h-auto"
              >
                <Icons.chevronRight className="h-3.5 w-3.5 mr-1 rotate-180"/> Back
              </Button>
            )}
            <Button 
              onClick={handleNext} 
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3 py-1.5 h-auto"
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
