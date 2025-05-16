import type { LucideIcon } from 'lucide-react';

export type FacetName = 
  | "Ontology" 
  | "Epistemology" 
  | "Praxeology" 
  | "Axiology" 
  | "Mythology" 
  | "Cosmology" 
  | "Teleology";

export interface Facet {
  name: FacetName;
  icon: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element); // Allow LucideIcon or custom SVG component
  colorVariable: string; // e.g., "--domain-ontology"
  tagline: string;
  description: string;
  questions: string[]; // 10 Likert-scale questions
}

export interface DomainScore {
  facetName: FacetName;
  score: number; // Normalized value (0-1)
}

export interface AssessmentAnswers {
  [questionId: string]: number; // e.g., "ontology_q1": 5
}

export interface WorldviewProfile {
  id: string;
  title: string;
  domainScores: DomainScore[];
  facetSelections?: { [K_FacetName in FacetName]?: string }; // Worldview ID selected for each facet
  createdAt: string; // ISO date string
  summary?: string;
  isArchetype?: boolean;
}

export interface CodexEntry extends WorldviewProfile {
  category: "religious" | "philosophical" | "archetypal" | "custom";
  tags?: string[];
}

export interface WorldviewContextType {
  activeProfile: WorldviewProfile | null;
  setActiveProfile: (profile: WorldviewProfile | null) => void;
  assessmentAnswers: AssessmentAnswers;
  setAssessmentAnswers: (answers: AssessmentAnswers) => void;
  updateAssessmentAnswer: (questionId: string, value: number) => void;
  domainScores: DomainScore[];
  calculateDomainScores: () => void;
  savedWorldviews: WorldviewProfile[];
  addSavedWorldview: (profile: WorldviewProfile) => void;
  updateSavedWorldview: (profile: WorldviewProfile) => void;
  deleteSavedWorldview: (profileId: string) => void;
  facetSelections: { [K_FacetName in FacetName]?: string }; // Worldview ID from Codex
  selectWorldviewForFacet: (facetName: FacetName, worldviewId: string) => void;
  clearFacetSelection: (facetName: FacetName) => void;
  loadStateFromLocalStorage: () => void;
}

export type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};
