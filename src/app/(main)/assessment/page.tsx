"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FACETS, FACET_NAMES } from '@/config/facets';
import type { FacetName } from '@/types';
import { Icons } from '@/components/icons';
import { useWorldview } from '@/hooks/use-worldview'; // Assuming you have this hook

const LIKERT_SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Slightly Disagree" },
  { value: 4, label: "Neutral" },
  { value: 5, label: "Slightly Agree" },
  { value: 6, label: "Agree" },
  { value: 7, label: "Strongly Agree" },
];

export default function AssessmentPage() {
  const [currentFacetIndex, setCurrentFacetIndex] = useState(0);
  const { assessmentAnswers, updateAssessmentAnswer, calculateDomainScores } = useWorldview();

  const currentFacetName = FACET_NAMES[currentFacetIndex];
  const currentFacet = FACETS[currentFacetName];
  const totalFacets = FACET_NAMES.length;
  const progress = ((currentFacetIndex + 1) / totalFacets) * 100;

  const handleNext = () => {
    if (currentFacetIndex < totalFacets - 1) {
      setCurrentFacetIndex(currentFacetIndex + 1);
    } else {
      // Last facet, calculate scores and navigate to results (placeholder)
      calculateDomainScores();
      // router.push('/results'); // Uncomment when router is available
      alert("Assessment Complete! Scores calculated. Navigation to results page is next.");
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

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl glassmorphic-card">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl" style={{ color: `hsl(var(${currentFacet.colorVariable.slice(2)}))` }}>
              {currentFacet.name} Assessment
            </CardTitle>
            <span className="text-sm text-muted-foreground">Section {currentFacetIndex + 1} of {totalFacets}</span>
          </div>
          <CardDescription>{currentFacet.tagline}</CardDescription>
          <Progress value={progress} className="w-full mt-2" />
        </CardHeader>
        <CardContent>
          <form>
            {currentFacet.questions.map((question, index) => (
              <div key={index} className="mb-8 p-4 rounded-md border border-border bg-background/30">
                <Label htmlFor={`${currentFacetName}_q${index}`} className="text-lg font-medium block mb-3 text-foreground">
                  Question {index + 1}: {question}
                </Label>
                <RadioGroup
                  id={`${currentFacetName}_q${index}`}
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  value={assessmentAnswers[`${currentFacetName}_q${index}`]?.toString()}
                  className="flex flex-col space-y-2 sm:flex-row sm:flex-wrap sm:space-y-0 sm:space-x-4"
                >
                  {LIKERT_SCALE_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={option.value.toString()} id={`${currentFacetName}_q${index}_opt${option.value}`} />
                      <Label htmlFor={`${currentFacetName}_q${index}_opt${option.value}`} className="font-normal text-sm text-muted-foreground cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentFacetIndex === 0}>
            <Icons.chevronRight className="mr-2 h-4 w-4 rotate-180" /> Previous
          </Button>
          <Button onClick={handleNext}>
            {currentFacetIndex === totalFacets - 1 ? 'Finish Assessment' : 'Next'}
            <Icons.chevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
