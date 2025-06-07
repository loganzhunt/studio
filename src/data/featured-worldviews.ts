import type { DomainScore } from "@/types";

/**
 * Featured worldview data for the homepage
 */
export const featuredWorldviewsData: Array<{
  id: string;
  title: string;
  icon?: string;
  summary: string;
  category: string;
  domainScores: DomainScore[];
}> = [
  {
    id: "stoicism",
    title: "Stoicism",
    icon: "\u221D",
    summary:
      "A philosophy of rational resilience and self-mastery, emphasizing virtue and acceptance of nature.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.3 },
      { facetName: "Epistemology", score: 0.2 },
      { facetName: "Praxeology", score: 0.65 },
      { facetName: "Axiology", score: 0.75 },
      { facetName: "Mythology", score: 0.3 },
      { facetName: "Cosmology", score: 0.4 },
      { facetName: "Teleology", score: 0.3 },
    ],
  },
  {
    id: "buddhism",
    title: "Buddhism",
    icon: "\u2638",
    summary:
      "A spiritual philosophy emphasizing awakening, impermanence, and the end of suffering.",
    category: "Spiritual",
    domainScores: [
      { facetName: "Ontology", score: 0.55 },
      { facetName: "Epistemology", score: 0.55 },
      { facetName: "Praxeology", score: 0.6 },
      { facetName: "Axiology", score: 0.7 },
      { facetName: "Mythology", score: 0.7 },
      { facetName: "Cosmology", score: 0.6 },
      { facetName: "Teleology", score: 0.7 },
    ],
  },
  {
    id: "existentialism",
    title: "Existentialism",
    icon: "\u2203",
    summary:
      "Focuses on authentic existence, choice, and the creation of meaning in an indifferent universe.",
    category: "Philosophical",
    domainScores: [
      { facetName: "Ontology", score: 0.3 },
      { facetName: "Epistemology", score: 0.3 },
      { facetName: "Praxeology", score: 0.4 },
      { facetName: "Axiology", score: 0.5 },
      { facetName: "Mythology", score: 0.2 },
      { facetName: "Cosmology", score: 0.2 },
      { facetName: "Teleology", score: 0.1 },
    ],
  },
  {
    id: "scientific_humanism",
    title: "Scientific Humanism",
    icon: "\u26A0",
    summary:
      "A worldview that emphasizes rational inquiry, empiricism, and human welfare as the basis of ethics.",
    category: "Scientific",
    domainScores: [
      { facetName: "Ontology", score: 0.8 },
      { facetName: "Epistemology", score: 0.9 },
      { facetName: "Praxeology", score: 0.7 },
      { facetName: "Axiology", score: 0.6 },
      { facetName: "Mythology", score: 0.1 },
      { facetName: "Cosmology", score: 0.85 },
      { facetName: "Teleology", score: 0.2 },
    ],
  },
  {
    id: "christianity",
    title: "Christianity",
    icon: "\u271E",
    summary:
      "A monotheistic religion centered on Jesus Christ, emphasizing love, redemption, and salvation.",
    category: "Religious",
    domainScores: [
      { facetName: "Ontology", score: 0.2 },
      { facetName: "Epistemology", score: 0.3 },
      { facetName: "Praxeology", score: 0.7 },
      { facetName: "Axiology", score: 0.8 },
      { facetName: "Mythology", score: 0.9 },
      { facetName: "Cosmology", score: 0.2 },
      { facetName: "Teleology", score: 0.9 },
    ],
  },
  {
    id: "ecological_awareness",
    title: "Ecological Awareness",
    icon: "\u2698",
    summary:
      "A perspective recognizing the interdependence of all life and the ethical imperative of environmental stewardship.",
    category: "Environmental",
    domainScores: [
      { facetName: "Ontology", score: 0.5 },
      { facetName: "Epistemology", score: 0.6 },
      { facetName: "Praxeology", score: 0.8 },
      { facetName: "Axiology", score: 0.9 },
      { facetName: "Mythology", score: 0.5 },
      { facetName: "Cosmology", score: 0.7 },
      { facetName: "Teleology", score: 0.6 },
    ],
  },
];
