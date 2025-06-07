import type { FacetName } from "@/types";

/**
 * Options for the worldview builder interface.
 * In a production environment, these would likely be retrieved from the Codex entries.
 */
export const codexBuilderOptions: Record<
  FacetName,
  {
    id: string;
    name: string;
    facetScores: Partial<Record<FacetName, number>>;
  }[]
> = {
  Ontology: [
    {
      id: "ontology_materialism",
      name: "Materialism",
      facetScores: {
        Ontology: 0.9,
        Epistemology: 0.7,
        Praxeology: 0.5,
        Axiology: 0.4,
        Mythology: 0.2,
        Cosmology: 0.8,
        Teleology: 0.3,
      },
    },
    {
      id: "ontology_idealism",
      name: "Idealism",
      facetScores: {
        Ontology: 0.2,
        Epistemology: 0.4,
        Praxeology: 0.6,
        Axiology: 0.7,
        Mythology: 0.8,
        Cosmology: 0.3,
        Teleology: 0.7,
      },
    },
  ],
  Epistemology: [
    {
      id: "epistemology_empiricism",
      name: "Empiricism",
      facetScores: {
        Ontology: 0.6,
        Epistemology: 0.9,
        Praxeology: 0.7,
        Axiology: 0.5,
        Mythology: 0.3,
        Cosmology: 0.6,
        Teleology: 0.4,
      },
    },
    {
      id: "epistemology_rationalism",
      name: "Rationalism",
      facetScores: {
        Ontology: 0.5,
        Epistemology: 0.2,
        Praxeology: 0.5,
        Axiology: 0.6,
        Mythology: 0.5,
        Cosmology: 0.4,
        Teleology: 0.6,
      },
    },
  ],
  Praxeology: [
    {
      id: "praxeology_utilitarianism",
      name: "Utilitarianism",
      facetScores: {
        Ontology: 0.5,
        Epistemology: 0.6,
        Praxeology: 0.9,
        Axiology: 0.7,
        Mythology: 0.2,
        Cosmology: 0.4,
        Teleology: 0.5,
      },
    },
    {
      id: "praxeology_virtue_ethics",
      name: "Virtue Ethics",
      facetScores: {
        Ontology: 0.4,
        Epistemology: 0.3,
        Praxeology: 0.2,
        Axiology: 0.8,
        Mythology: 0.6,
        Cosmology: 0.3,
        Teleology: 0.7,
      },
    },
  ],
  Axiology: [
    {
      id: "axiology_relativism",
      name: "Moral Relativism",
      facetScores: {
        Ontology: 0.6,
        Epistemology: 0.7,
        Praxeology: 0.6,
        Axiology: 0.9,
        Mythology: 0.3,
        Cosmology: 0.5,
        Teleology: 0.4,
      },
    },
    {
      id: "axiology_absolutism",
      name: "Moral Absolutism",
      facetScores: {
        Ontology: 0.3,
        Epistemology: 0.4,
        Praxeology: 0.5,
        Axiology: 0.1,
        Mythology: 0.8,
        Cosmology: 0.4,
        Teleology: 0.8,
      },
    },
  ],
  Mythology: [
    {
      id: "mythology_polytheism",
      name: "Polytheism",
      facetScores: {
        Ontology: 0.3,
        Epistemology: 0.3,
        Praxeology: 0.5,
        Axiology: 0.6,
        Mythology: 0.9,
        Cosmology: 0.5,
        Teleology: 0.7,
      },
    },
    {
      id: "mythology_atheism",
      name: "Atheism",
      facetScores: {
        Ontology: 0.8,
        Epistemology: 0.8,
        Praxeology: 0.6,
        Axiology: 0.5,
        Mythology: 0.1,
        Cosmology: 0.7,
        Teleology: 0.2,
      },
    },
  ],
  Cosmology: [
    {
      id: "cosmology_big_bang",
      name: "Big Bang Theory",
      facetScores: {
        Ontology: 0.8,
        Epistemology: 0.9,
        Praxeology: 0.5,
        Axiology: 0.4,
        Mythology: 0.1,
        Cosmology: 0.9,
        Teleology: 0.2,
      },
    },
    {
      id: "cosmology_cyclical",
      name: "Cyclical Universe",
      facetScores: {
        Ontology: 0.4,
        Epistemology: 0.5,
        Praxeology: 0.6,
        Axiology: 0.5,
        Mythology: 0.7,
        Cosmology: 0.2,
        Teleology: 0.6,
      },
    },
  ],
  Teleology: [
    {
      id: "teleology_determinism",
      name: "Determinism",
      facetScores: {
        Ontology: 0.7,
        Epistemology: 0.6,
        Praxeology: 0.5,
        Axiology: 0.4,
        Mythology: 0.3,
        Cosmology: 0.7,
        Teleology: 0.9,
      },
    },
    {
      id: "teleology_existential",
      name: "Existential Freedom",
      facetScores: {
        Ontology: 0.5,
        Epistemology: 0.4,
        Praxeology: 0.7,
        Axiology: 0.6,
        Mythology: 0.4,
        Cosmology: 0.3,
        Teleology: 0.1,
      },
    },
  ],
};
