export type LikertValue = {
  value: number;
  label: string;
};

import type { FacetName } from "@/types";
import { getFacetScoreColor } from "@/lib/colors";

export const LIKERT_VALUES: LikertValue[] = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export type LikertOption = LikertValue & { color?: string };

export function buildLikertOptions(
  facetName?: FacetName | null,
): LikertOption[] {
  if (!facetName) return LIKERT_VALUES;
  return LIKERT_VALUES.map((option) => ({
    ...option,
    color: getFacetScoreColor(facetName, (option.value - 1) / 4),
  }));
}
