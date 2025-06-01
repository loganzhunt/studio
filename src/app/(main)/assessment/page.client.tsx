"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FACETS } from '@/config/facets';
import { useFacetNames } from '@/providers/facet-provider';
import type { FacetName } from '@/types';
import { Icons } from '@/components/icons';
import { useWorldview } from '@/hooks/use-worldview';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { OnboardingModal } from '@/components/onboarding/onboarding-modal';
import { GlassCard, PrismButton, SpectrumBar } from '@/components/glass-components';

const LIKERT_SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

const ONBOARDING_STORAGE_KEY = 'metaPrismOnboardingSeen_neutral_v1'; // Use a new key

export default function AssessmentPage() {
  const [currentFacetIndex, setCurrentFacetIndex] = useState(0);
  const { assessmentAnswers, updateAssessmentAnswer, calculateDomainScores, setAssessmentAnswers } = useWorldview();
  const facetNames = useFacetNames();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    try {
      const onboardingSeen = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (onboardingSeen !== "true") {
        setShowOnboardingModal(true);
      }
    } catch (error) {
      console.error("Error accessing localStorage for onboarding:", error);
      // Decide if you want to show onboarding by default if localStorage fails
      setShowOnboardingModal(true); 
    }
    setOnboardingChecked(true);
  }, []);

  const handleCloseOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch (error) {
      console.error("Error saving onboarding status to localStorage:", error);
    }
    setShowOnboardingModal(false);
  };

  const currentFacetName = facetNames[currentFacetIndex] || facetNames[0] || null;
  const currentFacet = currentFacetName ? FACETS[currentFacetName] : null;
  const totalFacets = facetNames.length;
  const progress = ((currentFacetIndex + 1) / totalFacets) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentFacetName]);

  const areAllCurrentQuestionsAnswered = useMemo(() => {
    if (!currentFacet || !currentFacet.questions || !Array.isArray(currentFacet.questions) || !currentFacetName) return false;
    return currentFacet.questions.every((_, index) => {
      const questionId = `${currentFacetName}_q${index}`;
      return assessmentAnswers[questionId] !== undefined;
    });
  }, [assessmentAnswers, currentFacet, currentFacetName]);

  const handleNext = async () => {
    if (!areAllCurrentQuestionsAnswered && currentFacetIndex < totalFacets - 1) {
      toast({
        title: "Incomplete Section",
        description: "Please answer all questions in this section before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    if (currentFacetIndex < totalFacets - 1) {
      setCurrentFacetIndex(currentFacetIndex + 1);
      setTimeout(() => setIsProcessing(false), 300); 
    } else {
      router.push('/results'); 
      setTimeout(() => {
        try {
          const calculatedScores = calculateDomainScores(); 
          // localStorage.setItem("metaPrismAssessmentScores", JSON.stringify(calculatedScores)); // Context handles main score persistence
          toast({
            title: "Assessment Complete!",
            description: "Your worldview signature is being generated.",
          });
        } catch (error) {
          console.error("Error during background score calculation/saving:", error);
          toast({
            title: "Scoring Error",
            description: "There was an issue calculating your scores. Your answers are saved; you can try viewing results later or retaking.",
            variant: "destructive",
          });
        }
        // setIsProcessing(false); // Not strictly needed as navigated away
      }, 0); 
    }
  };

  const handlePrevious = () => {
    if (currentFacetIndex > 0) {
      setIsProcessing(true);
      setCurrentFacetIndex(currentFacetIndex - 1);
      setTimeout(() => setIsProcessing(false), 300);
    }
  };

  const handleAnswerChange = (questionIndex: number, value: string) => {
    const questionId = `${currentFacetName}_q${questionIndex}`;
    updateAssessmentAnswer(questionId, parseInt(value, 10));
  };

  if (!onboardingChecked) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Icons.loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (showOnboardingModal) {
    return <OnboardingModal isOpen={showOnboardingModal} onClose={handleCloseOnboarding} />;
  }

  if (!currentFacet || !currentFacetName || facetNames.length === 0) {
    return <div>Loading facet information...</div>;
  }

  return (
    <div className="container mx-auto py-4">
      <GlassCard className="w-full max-w-3xl mx-auto" variant="default" animated>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: `hsl(var(${currentFacet.colorVariable.slice(2)}))` }}>
                {currentFacet.name}
              </h1>
              <p className="text-lg text-muted-foreground">{currentFacet.tagline}</p>
            </div>
            <span className="text-sm text-muted-foreground">Section {currentFacetIndex + 1} of {totalFacets}</span>
          </div>
          <Progress value={progress} className="w-full mt-4 h-3" indicatorStyle={{ backgroundColor: `hsl(var(${currentFacet.colorVariable.slice(2)}))`}}/>
          <SpectrumBar className="mt-2" />
        </div>
        <div className="space-y-4" key={currentFacetName}>
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            {currentFacet && currentFacet.questions && Array.isArray(currentFacet.questions) ? currentFacet.questions.map((question, index) => (
              <div 
                key={index} 
                className="bg-card/70 backdrop-blur-md rounded-xl shadow-lg p-4 mb-4"
              >
                <Label htmlFor={`${currentFacetName}_q${index}`} className="text-xl font-semibold block mb-3 text-foreground">
                  {index + 1}. {question}
                </Label>
                <RadioGroup
                  id={`${currentFacetName}_q${index}`}
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  value={assessmentAnswers[`${currentFacetName}_q${index}`]?.toString()}
                  className="flex flex-col space-y-2"
                >
                  {LIKERT_SCALE_OPTIONS && Array.isArray(LIKERT_SCALE_OPTIONS) ? LIKERT_SCALE_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value={option.value.toString()} id={`${currentFacetName}_q${index}_opt${option.value}`} />
                      <Label htmlFor={`${currentFacetName}_q${index}_opt${option.value}`} className="font-normal text-base text-muted-foreground cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  )) : null}
                </RadioGroup>
              </div>
            )) : <div>Loading questions...</div>}
             <button type="submit" disabled={isProcessing} className="hidden"></button>
          </form>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
          <PrismButton variant="secondary" size="large" onClick={handlePrevious} disabled={currentFacetIndex === 0 || isProcessing}>
            <Icons.chevronRight className="mr-2 h-5 w-5 rotate-180" /> Previous
          </PrismButton>
          <PrismButton 
            size="large" 
            onClick={handleNext} 
            disabled={isProcessing || (!areAllCurrentQuestionsAnswered && currentFacetIndex < totalFacets - 1)}
            className={cn(
              (!areAllCurrentQuestionsAnswered && currentFacetIndex < totalFacets - 1) && "opacity-60 cursor-not-allowed",
              isProcessing && "opacity-70"
            )}
          >
            {isProcessing && <Icons.loader className="mr-2 h-5 w-5 animate-spin" />}
            {currentFacetIndex === totalFacets - 1 ? 'Finish Assessment' : 'Next'}
            {currentFacetIndex < totalFacets - 1 && <Icons.chevronRight className="ml-2 h-5 w-5" />}
          </PrismButton>
        </div>
      </GlassCard>
    </div>
  );
}
