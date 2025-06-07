"use client";

import { useState, useCallback, useMemo } from "react";
import { FACETS, FACET_NAMES, withValidFacetNames } from "@/config/facets";
import { calculateAllDomainScores } from "@/lib/scoring";
import type { AssessmentAnswers, DomainScore, FacetName } from "@/types";

export interface UseAssessmentReturn {
  assessmentAnswers: AssessmentAnswers;
  setAssessmentAnswers: (answers: AssessmentAnswers) => void;
  updateAssessmentAnswer: (questionId: string, value: number) => void;
  domainScores: DomainScore[];
  calculateDomainScores: () => DomainScore[];
  hasAssessmentBeenRun: boolean;
}

export function useAssessment(
  initialAnswers: AssessmentAnswers = {}
): UseAssessmentReturn {
  const [assessmentAnswers, setAssessmentAnswers] =
    useState<AssessmentAnswers>(initialAnswers);
  const [domainScores, setDomainScores] = useState<DomainScore[]>(
    withValidFacetNames(
      (facetNames) => facetNames.map((name) => ({ facetName: name, score: 0 })),
      []
    )
  );

  // Update a single assessment answer
  const updateAssessmentAnswer = useCallback(
    (questionId: string, value: number) => {
      setAssessmentAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    },
    []
  );

  // Calculate domain scores from answers
  const calculateDomainScores = useCallback(() => {
    const newScores = calculateAllDomainScores(assessmentAnswers, FACETS);
    setDomainScores(newScores);
    return newScores;
  }, [assessmentAnswers]);

  // Determine if assessment has been run based on whether we have valid answers
  const hasAssessmentBeenRun = useMemo(() => {
    return (
      Object.keys(assessmentAnswers).length > 0 &&
      FACET_NAMES.some((facetName) =>
        Object.keys(assessmentAnswers).some((key) =>
          key.toLowerCase().startsWith(facetName.toLowerCase())
        )
      )
    );
  }, [assessmentAnswers]);

  return {
    assessmentAnswers,
    setAssessmentAnswers,
    updateAssessmentAnswer,
    domainScores,
    calculateDomainScores,
    hasAssessmentBeenRun,
  };
}
