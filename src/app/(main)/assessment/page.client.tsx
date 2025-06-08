"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FACETS } from "@/config/facets";
import { useFacetNames } from "@/providers/facet-provider";
import type { FacetName } from "@/types";
import { buildLikertOptions } from "@/lib/assessment-likert";
import { Icons } from "@/components/icons";
import { useWorldview } from "@/hooks/use-worldview";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import {
  GlassCard,
  PrismButton,
  SpectrumBar,
  GlassPanel,
} from "@/components/glass-components";
import { LiveRegion } from "@/components/accessibility";

const ONBOARDING_STORAGE_KEY = "metaPrismOnboardingSeen_neutral_v1";

export default function AssessmentPage() {
  const [currentFacetIndex, setCurrentFacetIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev">(
    "next",
  );
  const [announceMessage, setAnnounceMessage] = useState("");
  const { assessmentAnswers, updateAssessmentAnswer, calculateDomainScores } =
    useWorldview();
  const facetNames = useFacetNames();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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

  const currentFacetName =
    facetNames[currentFacetIndex] || facetNames[0] || null;
  const currentFacet = currentFacetName ? FACETS[currentFacetName] : null;
  const totalFacets = facetNames.length;

  const likertOptions = useMemo(
    () => buildLikertOptions(currentFacetName),
    [currentFacetName],
  );

  // Calculate how many questions are in the current facet
  const totalQuestions = currentFacet?.questions?.length || 0;

  // Calculate overall progress
  const completedQuestions = useMemo(() => {
    let count = 0;

    // Count questions answered in previous facets
    for (let i = 0; i < currentFacetIndex; i++) {
      const facetName = facetNames[i];
      if (facetName && FACETS[facetName]?.questions) {
        count += FACETS[facetName].questions.length;
      }
    }

    // Count questions answered in current facet
    if (currentFacetName) {
      for (let i = 0; i <= currentQuestionIndex; i++) {
        const questionId = `${currentFacetName}_q${i}`;
        if (assessmentAnswers[questionId] !== undefined) {
          count++;
        }
      }
    }

    return count;
  }, [
    currentFacetIndex,
    currentQuestionIndex,
    currentFacetName,
    facetNames,
    assessmentAnswers,
  ]);

  const totalAllQuestions = useMemo(() => {
    return facetNames.reduce((total, facetName) => {
      return total + (FACETS[facetName]?.questions?.length || 0);
    }, 0);
  }, [facetNames]);

  const overallProgress = (completedQuestions / totalAllQuestions) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentFacetName, currentQuestionIndex]);

  const currentQuestion = currentFacet?.questions?.[currentQuestionIndex];
  const currentQuestionId = currentFacetName
    ? `${currentFacetName}_q${currentQuestionIndex}`
    : null;
  const currentAnswer = currentQuestionId
    ? assessmentAnswers[currentQuestionId]
    : undefined;

  const isCurrentQuestionAnswered =
    currentQuestionId !== null &&
    assessmentAnswers[currentQuestionId] !== undefined;

  const areAllCurrentFacetQuestionsAnswered = useMemo(() => {
    if (
      !currentFacet ||
      !currentFacet.questions ||
      !Array.isArray(currentFacet.questions) ||
      !currentFacetName
    )
      return false;
    return currentFacet.questions.every((_, index) => {
      const questionId = `${currentFacetName}_q${index}`;
      return assessmentAnswers[questionId] !== undefined;
    });
  }, [assessmentAnswers, currentFacet, currentFacetName]);

  const handleNextQuestion = () => {
    if (!isCurrentQuestionAnswered) {
      toast({
        title: "Question not answered",
        description: "Please select an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAnimationDirection("next");

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnnounceMessage(
        `Question ${currentQuestionIndex + 2} of ${totalQuestions}`,
      );
      setTimeout(() => setIsProcessing(false), 300);
    } else {
      // Move to next facet
      if (currentFacetIndex < totalFacets - 1) {
        setCurrentFacetIndex(currentFacetIndex + 1);
        setCurrentQuestionIndex(0);
        setAnnounceMessage(
          `Section ${currentFacetIndex + 2}: ${
            facetNames[currentFacetIndex + 1]
          }, Question 1`,
        );
        setTimeout(() => setIsProcessing(false), 300);
      } else {
        // Assessment complete - navigate to results
        router.push("/results");
        setTimeout(() => {
          try {
            calculateDomainScores();
            toast({
              title: "Assessment Complete!",
              description: "Your worldview signature is being generated.",
            });
          } catch (error) {
            console.error(
              "Error during background score calculation/saving:",
              error,
            );
            toast({
              title: "Scoring Error",
              description:
                "There was an issue calculating your scores. Your answers are saved; you can try viewing results later or retaking.",
              variant: "destructive",
            });
          }
        }, 0);
      }
    }
  };

  const handlePreviousQuestion = () => {
    setIsProcessing(true);
    setAnimationDirection("prev");

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnnounceMessage(
        `Question ${currentQuestionIndex} of ${totalQuestions}`,
      );
    } else {
      // Move to previous facet
      if (currentFacetIndex > 0) {
        const prevFacetName = facetNames[currentFacetIndex - 1];
        const prevFacetQuestions = FACETS[prevFacetName]?.questions || [];

        setCurrentFacetIndex(currentFacetIndex - 1);
        setCurrentQuestionIndex(prevFacetQuestions.length - 1);
        setAnnounceMessage(
          `Section ${currentFacetIndex}: ${prevFacetName}, Question ${prevFacetQuestions.length}`,
        );
      }
    }
    setTimeout(() => setIsProcessing(false), 300);
  };

  const handleAnswerChange = (value: string) => {
    if (!currentFacetName || currentQuestionIndex === null) return;

    const questionId = `${currentFacetName}_q${currentQuestionIndex}`;
    updateAssessmentAnswer(questionId, parseInt(value, 10));
  };

  const handleFacetJump = (facetIndex: number) => {
    if (facetIndex === currentFacetIndex) return;

    setIsProcessing(true);
    setAnimationDirection(facetIndex > currentFacetIndex ? "next" : "prev");
    setCurrentFacetIndex(facetIndex);
    setCurrentQuestionIndex(0);
    setAnnounceMessage(
      `Jumped to section ${facetIndex + 1}: ${facetNames[facetIndex]}`,
    );
    setTimeout(() => setIsProcessing(false), 300);
  };

  const toggleCompleteFacet = () => {
    if (
      areAllCurrentFacetQuestionsAnswered &&
      currentFacetIndex < totalFacets - 1
    ) {
      handleFacetJump(currentFacetIndex + 1);
    }
  };

  const cardVariants = {
    initial: (direction: string) => ({
      x: direction === "next" ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: string) => ({
      x: direction === "next" ? "-100%" : "100%",
      opacity: 0,
      scale: 0.8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  const reducedMotionCardVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
      },
    },
  };

  if (!onboardingChecked) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Icons.loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (showOnboardingModal) {
    return (
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={handleCloseOnboarding}
      />
    );
  }

  if (!currentFacet || !currentFacetName || facetNames.length === 0) {
    return <div>Loading facet information...</div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      {/* Fixed Progress Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 p-4 border-r border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Your Progress</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {Math.round(overallProgress)}% Complete
            </span>
            <span className="text-sm text-muted-foreground">
              {completedQuestions}/{totalAllQuestions}
            </span>
          </div>
          <Progress value={overallProgress} className="w-full h-2" />
          <SpectrumBar className="mt-2" />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Assessment Sections
          </h3>
          {facetNames.map((facetName, index) => {
            const facet = FACETS[facetName];
            const isCurrent = index === currentFacetIndex;

            // Calculate completion for this facet
            const totalFacetQuestions = facet.questions?.length || 0;
            let answeredQuestions = 0;

            for (let i = 0; i < totalFacetQuestions; i++) {
              const qId = `${facetName}_q${i}`;
              if (assessmentAnswers[qId] !== undefined) {
                answeredQuestions++;
              }
            }

            const facetCompletionPercent =
              totalFacetQuestions > 0
                ? (answeredQuestions / totalFacetQuestions) * 100
                : 0;

            const completionStatus =
              facetCompletionPercent === 100
                ? "complete"
                : facetCompletionPercent > 0
                  ? "in-progress"
                  : "not-started";

            return (
              <button
                key={facetName}
                onClick={() => handleFacetJump(index)}
                className={cn(
                  "w-full text-left p-2 rounded-md transition-all duration-200 flex items-center",
                  isCurrent
                    ? "bg-white/20 shadow-inner"
                    : "hover:bg-white/15 hover:transform hover:scale-[1.01]",
                  completionStatus === "complete" &&
                    "border-l-4 border-green-500",
                  completionStatus === "in-progress" &&
                    "border-l-4 border-yellow-500",
                )}
                disabled={isProcessing}
                style={
                  isCurrent
                    ? {
                        borderColor: `hsl(var(${facet.colorVariable.slice(
                          2,
                        )}))`,
                      }
                    : {}
                }
              >
                <div className="flex flex-col flex-1">
                  <span
                    className={cn(
                      "font-medium",
                      isCurrent ? "text-white" : "text-muted-foreground",
                    )}
                  >
                    {facet.name}
                  </span>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground mr-2">
                      {answeredQuestions}/{totalFacetQuestions}
                    </span>
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/30 rounded-full"
                        style={{
                          width: `${facetCompletionPercent}%`,
                          backgroundColor:
                            facetCompletionPercent === 100
                              ? "hsl(var(--success))"
                              : `hsl(var(${facet.colorVariable.slice(2)}))`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area with Card Stack */}
      <main className="flex-1 p-4">
        {/* Mobile progress bar (visible only on small screens) */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Section {currentFacetIndex + 1}/{totalFacets}: {currentFacet.name}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="w-full h-2" />
          <SpectrumBar className="mt-1" />
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Current Facet Header */}
          <div className="mb-6">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{
                color: `hsl(var(${currentFacet.colorVariable.slice(2)}))`,
              }}
            >
              {currentFacet.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentFacet.tagline}
            </p>
          </div>

          {/* Question Cards */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait" custom={animationDirection}>
              <motion.div
                key={`${currentFacetName}-${currentQuestionIndex}`}
                custom={animationDirection}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={
                  shouldReduceMotion ? reducedMotionCardVariants : cardVariants
                }
                className="w-full"
              >
                <GlassCard
                  className="w-full"
                  variant="large"
                  animated={!shouldReduceMotion}
                >
                  <CardContent className="p-6">
                    {/* Question number and navigation */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-gray-400 font-medium">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handlePreviousQuestion}
                          disabled={
                            (currentFacetIndex === 0 &&
                              currentQuestionIndex === 0) ||
                            isProcessing
                          }
                          className="p-1 rounded-full hover:bg-white/10"
                          aria-label="Previous question"
                        >
                          <Icons.arrowLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm">
                          {currentQuestionIndex + 1}/{totalQuestions}
                        </span>
                        <button
                          onClick={handleNextQuestion}
                          disabled={!isCurrentQuestionAnswered || isProcessing}
                          className={cn(
                            "p-1 rounded-full hover:bg-white/10",
                            !isCurrentQuestionAnswered &&
                              "opacity-50 cursor-not-allowed",
                          )}
                          aria-label="Next question"
                        >
                          <Icons.arrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Question text */}
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
                      {currentQuestion}
                    </h2>

                    {/* Answer options with ROYGBIV accents */}
                    <div className="mt-8">
                      <RadioGroup
                        value={currentAnswer?.toString()}
                        onValueChange={handleAnswerChange}
                        className="space-y-4"
                      >
                        {likertOptions.map((option) => (
                          <div
                            key={option.value}
                            className={cn(
                              "flex items-center p-4 rounded-lg transition-all border-2 border-transparent",
                              currentAnswer === option.value
                                ? "bg-white/20 border-white/40 shadow-lg transform scale-[1.02]"
                                : "hover:bg-white/10",
                              "focus-within:ring-2 focus-within:ring-white/30",
                            )}
                          >
                            <div className="flex items-center flex-1">
                              <div
                                className={cn(
                                  "w-5 h-5 mr-4 rounded-full",
                                  currentAnswer === option.value
                                    ? "ring-4 ring-white/30"
                                    : "",
                                )}
                                style={{ backgroundColor: option.color }}
                                aria-hidden="true"
                              />
                              <Label
                                htmlFor={`option-${option.value}`}
                                className={cn(
                                  "flex-1 text-lg font-medium cursor-pointer",
                                  currentAnswer === option.value
                                    ? "text-white"
                                    : "text-white/80",
                                )}
                              >
                                {option.label}
                              </Label>
                              <RadioGroupItem
                                id={`option-${option.value}`}
                                value={option.value.toString()}
                                className="h-5 w-5"
                              />
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer navigation */}
          <div className="flex justify-between mt-8">
            <PrismButton
              variant="secondary"
              size="large"
              onClick={handlePreviousQuestion}
              disabled={
                (currentFacetIndex === 0 && currentQuestionIndex === 0) ||
                isProcessing
              }
            >
              <Icons.arrowLeft className="mr-2 h-5 w-5" /> Previous
            </PrismButton>

            <PrismButton
              size="large"
              onClick={handleNextQuestion}
              disabled={!isCurrentQuestionAnswered || isProcessing}
              className={cn(
                !isCurrentQuestionAnswered && "opacity-60 cursor-not-allowed",
                isProcessing && "opacity-70",
              )}
            >
              {isProcessing && (
                <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
              )}
              {currentFacetIndex === totalFacets - 1 &&
              currentQuestionIndex === totalQuestions - 1
                ? "Complete Assessment"
                : "Next"}
              {!(
                currentFacetIndex === totalFacets - 1 &&
                currentQuestionIndex === totalQuestions - 1
              ) && <Icons.arrowRight className="ml-2 h-5 w-5" />}
            </PrismButton>
          </div>

          {/* Complete facet button (only if all questions in current facet are answered) */}
          {areAllCurrentFacetQuestionsAnswered &&
            currentQuestionIndex < totalQuestions - 1 && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="link"
                  onClick={toggleCompleteFacet}
                  disabled={isProcessing}
                  className="text-sm text-white/70 hover:text-white/90"
                >
                  Skip to next section
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
        </div>
      </main>

      {/* Accessibility: Live region for screen reader announcements */}
      <LiveRegion message={announceMessage} priority="polite" />
    </div>
  );
}
