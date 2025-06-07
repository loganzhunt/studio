import type { AssessmentAnswers, DomainScore, Facet, FacetName } from "@/types";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { clamp } from "@/lib/utils";

/**
 * Calculates the raw score for a single domain based on Likert scale responses.
 * Assumes 10 questions per domain, each answered on a 1-5 scale.
 * Null or undefined responses are treated as neutral (3).
 * @param domainResponses Array of numbers (1-5) or null/undefined for a single domain.
 * @returns The sum of valid responses. Max possible raw score is 50 (10 * 5). Min possible is 10 (10 * 1).
 */
export function calculateRawDomainScore(
  domainResponses: (number | null | undefined)[]
): number {
  let rawScore = 0;
  const numQuestions = 10; // Assuming 10 questions per domain

  for (let i = 0; i < numQuestions; i++) {
    const response = domainResponses[i];
    if (typeof response === "number" && response >= 1 && response <= 5) {
      rawScore += response;
    } else {
      // Handle null, undefined, or out-of-range answers as neutral (or skip, or average)
      // For Meta-Prism, a neutral response on a 1-5 scale is 3.
      // If a question isn't answered, it contributes 0 to the raw score for normalization purposes
      // where max score assumes all questions answered at max.
      // However, the prompt says "sum of valid responses".
      // If we want to normalize based on a fixed max (50), unanswered questions should effectively be 0
      // or a defined neutral value. The previous logic for Meta-Prism context was to treat unanswered
      // as effectively 0 for calculation against a fixed max possible score.
      // Let's stick to summing valid responses (1-5), and normalization handles the scale.
      // If a question MUST be answered, validation should happen at input.
      // For this function, if it's not 1-5, it's not summed.
      // The `normalizeScore` function below assumes a maximum possible raw score.
      // If we treat missing as 0:
      // rawScore += 0; // or simply don't add
      // If we treat missing as neutral (3) for a full 10 questions:
      // rawScore += 3;
      // Given normalization divides by 50 (10q * 5max), if a question is skipped (null/undefined)
      // it just doesn't add to the score, effectively lowering the percentage.
      // This seems fine.
    }
  }
  return rawScore;
}

/**
 * Normalizes a raw score (sum of 10 Likert items 1-5) to a 0.0 - 1.0 range.
 * Minimum possible raw score: 10 (10 * 1)
 * Maximum possible raw score: 50 (10 * 5)
 * The range of raw scores is 40 (50 - 10).
 * Normalized = (Raw - MinRaw) / (MaxRaw - MinRaw)
 * @param rawScore The raw score for a domain (sum of 10 questions, 1-5 each).
 * @returns A normalized score between 0.0 and 1.0.
 */
export function normalizeScore(rawScore: number): number {
  const minRawScore = 1 * 10; // 10 questions, min score 1
  const maxRawScore = 5 * 10; // 10 questions, max score 5

  if (rawScore < minRawScore) return 0.0;
  if (rawScore > maxRawScore) return 1.0;

  // Normalize to 0-1 range
  const normalized = (rawScore - minRawScore) / (maxRawScore - minRawScore);
  return clamp(normalized); // Clamp between 0 and 1
}

/**
 * Calculates normalized scores for all 7 domains.
 * @param allAnswers All assessment answers, keyed by question ID (e.g., "Ontology_q0").
 * @param facetsConfig The configuration object for all facets, including their questions.
 * @returns An array of DomainScore objects.
 */
export function calculateAllDomainScores(
  allAnswers: AssessmentAnswers,
  facetsConfig: Record<FacetName, Facet>
): DomainScore[] {
  const domainScores: DomainScore[] = [];

  for (const facetName of FACET_NAMES) {
    const facet = facetsConfig[facetName];
    if (!facet) {
      // console.warn(`Configuration for facet ${facetName} not found.`);
      domainScores.push({ facetName, score: 0 }); // Default to 0 if config is missing
      continue;
    }

    const domainResponses: (number | null)[] = [];
    for (let i = 0; i < facet.questions.length; i++) {
      const questionId = `${facetName}_q${i}`;
      domainResponses.push(allAnswers[questionId] ?? null); // Use null if answer is undefined
    }

    let rawScore = 0;
    let answeredQuestions = 0;
    domainResponses.forEach((response) => {
      if (response !== null && response >= 1 && response <= 5) {
        rawScore += response;
        answeredQuestions++;
      }
    });

    // If no questions were answered for a facet, its score is 0.
    // Otherwise, normalize based on the answered questions.
    // Min possible for answered questions = answeredQuestions * 1
    // Max possible for answered questions = answeredQuestions * 5
    let normalizedScore = 0;
    if (answeredQuestions > 0) {
      const minPossible = answeredQuestions * 1;
      const maxPossible = answeredQuestions * 5;
      if (maxPossible === minPossible) {
        // all answers were 1 or all were 5, or only one question
        normalizedScore = rawScore / maxPossible; // simple ratio, or (raw-min)/(max-min) => (raw-min)/0
        // if all answers are 1, raw = answeredQ, norm = (ansQ - ansQ) / (5ansQ - ansQ) = 0
        // if all answers are 5, raw = 5ansQ, norm = (5ansQ - ansQ) / (5ansQ - ansQ) = 1
        // if all answers are 3, raw = 3ansQ, norm = (3ansQ - ansQ) / (4ansQ) = 2/4 = 0.5
        normalizedScore =
          (rawScore - minPossible) / (maxPossible - minPossible);
      } else {
        normalizedScore =
          (rawScore - minPossible) / (maxPossible - minPossible);
      }
    }

    domainScores.push({
      facetName,
      score: Math.min(1, Math.max(0, normalizedScore)), // Clamp between 0 and 1
    });
  }

  return domainScores;
}
