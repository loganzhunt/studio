// Utility functions for handling codex data across the application
import { BASE_CODEX_DATA } from "@/data/codex/base-codex-data";
import { LATEST_CODEX_UPDATE_BATCH } from "@/data/codex/latest-codex-update-batch";
import { ADDITIONAL_CODEX_DATA } from "@/data/codex/additional-codex-data";
import { FACET_NAMES } from "@/config/facets";
import type { CodexEntry, FacetName } from "@/types";

/**
 * Creates a URL-friendly ID from a worldview title
 */
export const createIdFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
};

/**
 * Gets the combined codex data from all sources
 */
export const getCombinedCodexData = () => {
  return [
    ...LATEST_CODEX_UPDATE_BATCH,
    ...ADDITIONAL_CODEX_DATA,
    ...BASE_CODEX_DATA,
  ];
};

/**
 * Maps raw data objects to properly formatted CodexEntry objects
 */
export const mapRawDataToCodexEntries = (rawData: any[]): CodexEntry[] => {
  if (!Array.isArray(rawData)) {
    console.error(
      "mapRawDataToCodexEntries received non-array input:",
      rawData
    );
    return [];
  }

  return rawData
    .map((item) => {
      // Handle title/name
      const titleToUse = item?.title || item?.name;
      if (!item || typeof titleToUse !== "string") {
        return null;
      }

      // Create ID from title
      const id = createIdFromTitle(titleToUse);

      // Process scores
      const scoresSource = item.scores || item.domainScores || item.facetScores;
      const domainScoresArray =
        Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0
          ? FACET_NAMES.map((facetKey) => {
              const scoreKeyLower = facetKey.toLowerCase();
              const scoreKeyOriginal = facetKey;
              let scoreValue = 0.5; // Default if no score found

              if (
                scoresSource?.[scoreKeyLower] !== undefined &&
                typeof scoresSource[scoreKeyLower] === "number"
              ) {
                scoreValue = scoresSource[scoreKeyLower];
              } else if (
                scoresSource?.[scoreKeyOriginal] !== undefined &&
                typeof scoresSource[scoreKeyOriginal] === "number"
              ) {
                scoreValue = scoresSource[scoreKeyOriginal];
              }
              return {
                facetName: facetKey,
                score: Math.max(0, Math.min(1, Number(scoreValue))),
              };
            })
          : [];

      // Process facet descriptions/summaries
      const facetSummariesSource =
        item.facetDescriptions || item.facetSummaries || item.facetSummary;
      const processedFacetSummaries: { [K_FacetName in FacetName]?: string } =
        {};
      if (
        facetSummariesSource &&
        typeof facetSummariesSource === "object" &&
        Array.isArray(FACET_NAMES)
      ) {
        for (const facetKey of FACET_NAMES) {
          const summaryKeyLower = facetKey.toLowerCase();
          const summaryKeyOriginal = facetKey;
          let summary = `Information for ${facetKey} is not available for this worldview.`;

          if (typeof facetSummariesSource[summaryKeyLower] === "string") {
            summary = facetSummariesSource[summaryKeyLower];
          } else if (
            typeof facetSummariesSource[summaryKeyOriginal] === "string"
          ) {
            summary = facetSummariesSource[summaryKeyOriginal];
          }
          processedFacetSummaries[facetKey] = summary;
        }
      } else if (Array.isArray(FACET_NAMES)) {
        FACET_NAMES.forEach((facetKey) => {
          processedFacetSummaries[
            facetKey
          ] = `Information for ${facetKey} is not available for ${titleToUse}.`;
        });
      }

      // Process category
      let category: CodexEntry["category"] = "custom";
      const itemCategoryRaw = (item.category || "").toString();
      const itemCategoryMain = itemCategoryRaw.toLowerCase().split(" ")[0];
      const validCategories: CodexEntry["category"][] = [
        "philosophical",
        "religious",
        "archetypal",
        "custom",
      ];
      if (
        validCategories.includes(itemCategoryMain as CodexEntry["category"])
      ) {
        category = itemCategoryMain as CodexEntry["category"];
      }

      // Process tags
      const tags = Array.isArray(item.tags)
        ? item.tags.map(String)
        : typeof item.tags === "string"
        ? [item.tags]
        : [];

      if (category !== "custom" && !tags.includes(category)) {
        tags.push(category);
      }
      if (!tags.includes(id)) {
        tags.push(id);
      }

      return {
        id,
        title: titleToUse,
        description: item.description || "",
        summary: item.summary || "No summary available.",
        icon: item.icon,
        domainScores: domainScoresArray,
        facet_descriptions: processedFacetSummaries,
        key_thinkers: Array.isArray(item.key_thinkers) ? item.key_thinkers : [],
        key_texts: Array.isArray(item.key_texts) ? item.key_texts : [],
        era: item.era || "",
        category,
        tags,
        facetSummaries: processedFacetSummaries,
        isArchetype: category === "archetypal" || tags.includes("archetypal"),
        createdAt: item.createdAt || new Date().toISOString(),
        type: item.type || "codex",
      };
    })
    .filter(Boolean) as CodexEntry[];
};

/**
 * Gets all codex entries from all data sources
 */
export const getAllCodexEntries = (): CodexEntry[] => {
  try {
    const combinedRawData = getCombinedCodexData();
    return mapRawDataToCodexEntries(combinedRawData);
  } catch (error) {
    console.error("Error mapping codex data:", error);
    return [];
  }
};

/**
 * Gets a specific codex entry by ID or URL slug
 */
export const getCodexEntryBySlug = (slug: string): CodexEntry | undefined => {
  const allEntries = getAllCodexEntries();
  return allEntries.find((entry) => {
    const entryId = entry.id || createIdFromTitle(entry.title || "");
    return entryId === slug;
  });
};

/**
 * Converts codex scores to domain scores array format
 */
export const codexScoresToDomainScores = (
  scores: Record<string, number>
): Array<{ facetName: FacetName; score: number }> => {
  return Object.entries(scores).map(([key, value]) => ({
    facetName: key as FacetName,
    score: value as number,
  }));
};

/**
 * Maps raw archetype data to CodexEntry format with archetype-specific defaults
 * This function is specialized for archetype data and ensures consistent structure
 */
export const mapRawArchetypeToCodexEntry = (raw: any): CodexEntry | null => {
  try {
    if (
      !raw ||
      typeof raw !== "object" ||
      (typeof raw.title !== "string" && typeof raw.name !== "string")
    ) {
      console.warn(
        "mapRawArchetypeToCodexEntry: Skipping invalid raw data item",
        raw
      );
      return null;
    }

    const titleToUse = raw.title || raw.name;
    const id = createIdFromTitle(titleToUse);

    // Process scores - archetypes use 'scores' or 'facetScores'
    const scoresSource = raw.scores || raw.facetScores;
    let domainScoresArray: Array<{ facetName: FacetName; score: number }> = [];

    if (
      scoresSource &&
      typeof scoresSource === "object" &&
      Array.isArray(FACET_NAMES)
    ) {
      domainScoresArray = FACET_NAMES.map((facetKey) => {
        const scoreKeyLower = facetKey.toLowerCase();
        const scoreKeyOriginal = facetKey;
        let scoreValue = 0.5; // Default score

        if (
          scoresSource.hasOwnProperty(scoreKeyLower) &&
          typeof scoresSource[scoreKeyLower] === "number"
        ) {
          scoreValue = scoresSource[scoreKeyLower];
        } else if (
          scoresSource.hasOwnProperty(scoreKeyOriginal) &&
          typeof scoresSource[scoreKeyOriginal] === "number"
        ) {
          scoreValue = scoresSource[scoreKeyOriginal];
        }

        return {
          facetName: facetKey,
          score: Math.max(0, Math.min(1, Number(scoreValue))),
        };
      });
    } else {
      // Default all scores to 0.5 if no scores provided
      domainScoresArray = Array.isArray(FACET_NAMES)
        ? FACET_NAMES.map((name) => ({ facetName: name, score: 0.5 }))
        : [];
    }

    // Process facet summaries
    const facetSummariesSource = raw.facetDescriptions || raw.facetSummaries;
    const processedFacetSummaries: { [K in FacetName]?: string } = {};

    if (
      facetSummariesSource &&
      typeof facetSummariesSource === "object" &&
      Array.isArray(FACET_NAMES)
    ) {
      for (const facetKey of FACET_NAMES) {
        const summaryKeyLower = facetKey.toLowerCase();
        const summaryKeyOriginal = facetKey;
        let summary = `Details for ${facetKey} not available for ${titleToUse}.`;

        if (
          facetSummariesSource.hasOwnProperty(summaryKeyLower) &&
          typeof facetSummariesSource[summaryKeyLower] === "string"
        ) {
          summary = facetSummariesSource[summaryKeyLower];
        } else if (
          facetSummariesSource.hasOwnProperty(summaryKeyOriginal) &&
          typeof facetSummariesSource[summaryKeyOriginal] === "string"
        ) {
          summary = facetSummariesSource[summaryKeyOriginal];
        }

        processedFacetSummaries[facetKey] = summary;
      }
    } else {
      // Default summaries if none provided
      if (Array.isArray(FACET_NAMES)) {
        FACET_NAMES.forEach((name) => {
          processedFacetSummaries[
            name
          ] = `Details for ${name} not available for ${titleToUse}.`;
        });
      }
    }

    return {
      id,
      title: titleToUse,
      summary: raw.summary || "No summary available.",
      domainScores: domainScoresArray,
      facetSummaries: processedFacetSummaries,
      category: "archetypal", // All archetypes use 'archetypal' category
      isArchetype: true,
      createdAt: raw.createdAt || new Date().toISOString(),
      tags: raw.tags || [id],
    };
  } catch (error) {
    console.error("Error in mapRawArchetypeToCodexEntry for item:", raw, error);
    return null;
  }
};
