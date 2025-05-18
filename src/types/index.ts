
import type { LucideIcon } from 'lucide-react';
import type { Icons } from '@/components/icons'; // Import Icons type

// Simplified User type for local demo
export type LocalUser = {
  displayName: string;
  email?: string; // Email is now optional
} | null;

export type FacetName = 
  | "Ontology" 
  | "Epistemology" 
  | "Praxeology" 
  | "Axiology" 
  | "Mythology" 
  | "Cosmology" 
  | "Teleology";

interface FacetDeepDive {
  introduction: string;
  spectrumExplanation: string;
  spectrumAnchors: string[];
  exampleWorldviews: Array<{
    title: string;
    summary: string;
    exampleScore: number; // e.g., 0.2 (low), 0.5 (mid), 0.8 (high) on the facet's spectrum
    type: 'codex' | 'archetype';
    id?: string; // Optional: if linking to a specific codex/archetype entry
    icon?: string; // For emoji or simple string representation of an icon
  }>;
  reflectionPrompts: string[];
  strengthsPlaceholder?: string;
  tensionsPlaceholder?: string;
  blindSpotsPlaceholder?: string;
  archetypalPatterns?: Array<{ 
    title: string; 
    scoreRange: string; // e.g., "Low (0.0-0.33)"
    description: string; 
    icon?: keyof typeof Icons; 
  }>;
  whatIfInterpretations?: { 
    low: string; 
    mid: string; 
    high: string; 
  };
}

export interface Facet {
  name: FacetName;
  icon: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element); // Allow LucideIcon or custom SVG component
  colorVariable: string; // e.g., "--domain-ontology"
  tagline: string;
  description: string;
  questions: string[]; // 10 Likert-scale questions
  deepDive: FacetDeepDive;
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
  // For Firebase, you might add:
  // userId?: string;
  // lastUpdated?: any; // Firestore Timestamp
}

export interface CodexEntry extends WorldviewProfile {
  category: "religious" | "philosophical" | "archetypal" | "custom";
  tags?: string[];
  facetSummaries?: { [K_FacetName in FacetName]?: string };
}

export interface WorldviewContextType {
  currentUser: LocalUser; 
  signInLocally: (name: string) => void; 
  signOutUser: () => void;
  
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  activeProfile: WorldviewProfile | null;
  setActiveProfile: (profile: WorldviewProfile | null) => void;
  
  assessmentAnswers: AssessmentAnswers;
  setAssessmentAnswers: (answers: AssessmentAnswers) => void;
  updateAssessmentAnswer: (questionId: string, value: number) => void;
  
  domainScores: DomainScore[];
  calculateDomainScores: () => DomainScore[]; 
  hasAssessmentBeenRun: boolean;


  savedWorldviews: WorldviewProfile[];
  addSavedWorldview: (profile: WorldviewProfile) => void; 
  updateSavedWorldview: (profile: WorldviewProfile) => void;
  deleteSavedWorldview: (profileId: string) => void;
  
  facetSelections: { [K_FacetName in FacetName]?: string };
  selectWorldviewForFacet: (facetName: FacetName, worldviewId: string) => void;
  clearFacetSelection: (facetName: FacetName) => void;
  
  loadStateFromLocalStorage: () => void;
}

export type NavItem = {
  title: string;
  href: string;
  icon?: keyof typeof Icons;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
  hideOnDesktop?: boolean;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};
