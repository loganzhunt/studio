
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FACETS, FACET_NAMES } from '@/config/facets';
import type { FacetName } from '@/types';
import { Icons } from '@/components/icons';
import { useWorldview } from '@/hooks/use-worldview';
import { useRouter } from 'next/navigation'; // For navigation after completion

const LIKERT_SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export default function AssessmentPage() {
  const [currentFacetIndex, setCurrentFacetIndex] = useState(0);
  const { assessmentAnswers, updateAssessmentAnswer, calculateDomainScores, domainScores: contextDomainScores } = useWorldview();
  const router = useRouter();

  const currentFacetName = FACET_NAMES[currentFacetIndex];
  const currentFacet = FACETS[currentFacetName];
  const totalFacets = FACET_NAMES.length;
  const progress = ((currentFacetIndex + 1) / totalFacets) * 100;

  const areAllCurrentQuestionsAnswered = useMemo(() => {
    if (!currentFacet) return false;
    return currentFacet.questions.every((_, index) => {
      const questionId = `${currentFacetName}_q${index}`;
      return assessmentAnswers[questionId] !== undefined;
    });
  }, [assessmentAnswers, currentFacet, currentFacetName]);

  const handleNext = () => {
    if (!areAllCurrentQuestionsAnswered) {
      alert("Please answer all questions in this section before proceeding.");
      return;
    }

    if (currentFacetIndex < totalFacets - 1) {
      setCurrentFacetIndex(currentFacetIndex + 1);
    } else {
      // Last facet, calculate scores and save
      const calculatedScores = calculateDomainScores(); // This updates context AND returns scores
      localStorage.setItem("metaPrismAssessmentScores", JSON.stringify(calculatedScores));
      alert("Assessment Complete! Your scores have been calculated and saved. You will now be taken to the results page.");
      router.push('/results'); 
    }
  };

  const handlePrevious = () => {
    if (currentFacetIndex > 0) {
      setCurrentFacetIndex(currentFacetIndex - 1);
    }
  };

  const handleAnswerChange = (questionIndex: number, value: string) => {
    const questionId = `${currentFacetName}_q${questionIndex}`;
    updateAssessmentAnswer(questionId, parseInt(value, 10));
  };

  if (!currentFacet) {
    // Should not happen if FACET_NAMES and FACETS are correctly configured
    return <div>Loading facet information...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl glassmorphic-card">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight" style={{ color: `hsl(var(${currentFacet.colorVariable.slice(2)}))` }}>
                {currentFacet.name}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">{currentFacet.tagline}</CardDescription>
            </div>
            <span className="text-sm text-muted-foreground">Section {currentFacetIndex + 1} of {totalFacets}</span>
          </div>
          <Progress value={progress} className="w-full mt-4 h-3" />
        </CardHeader>
        <CardContent className="space-y-8">
          <form>
            {currentFacet.questions.map((question, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6"
              >
                <Label htmlFor={`${currentFacetName}_q${index}`} className="text-xl font-semibold block mb-4 text-foreground">
                  {index + 1}. {question}
                </Label>
                <RadioGroup
                  id={`${currentFacetName}_q${index}`}
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  value={assessmentAnswers[`${currentFacetName}_q${index}`]?.toString()}
                  className="flex flex-col space-y-3"
                >
                  {LIKERT_SCALE_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-3 p-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                      <RadioGroupItem value={option.value.toString()} id={`${currentFacetName}_q${index}_opt${option.value}`} />
                      <Label htmlFor={`${currentFacetName}_q${index}_opt${option.value}`} className="font-normal text-base text-muted-foreground cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between mt-6">
          <Button variant="outline" size="lg" onClick={handlePrevious} disabled={currentFacetIndex === 0}>
            <Icons.chevronRight className="mr-2 h-5 w-5 rotate-180" /> Previous
          </Button>
          <Button 
            size="lg" 
            onClick={handleNext} 
            disabled={!areAllCurrentQuestionsAnswered && currentFacetIndex < totalFacets -1} // Allow finish even if not all answered on last page for now, but next is blocked
            className={!areAllCurrentQuestionsAnswered && currentFacetIndex < totalFacets -1 ? "opacity-50 cursor-not-allowed" : ""}
          >
            {currentFacetIndex === totalFacets - 1 ? 'Finish Assessment' : 'Next'}
            <Icons.chevronRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
