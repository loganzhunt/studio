// Custom hook for worldview management functionality
"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { useToast } from "@/hooks/use-toast";
import type { WorldviewProfile, CodexEntry } from "@/types";
import { useState, useEffect } from "react";
import { codexScoresToDomainScores } from "@/lib/codex-utils";

export const useWorldviewManagement = (worldview?: CodexEntry | null) => {
  const {
    savedWorldviews,
    addSavedWorldview,
    deleteSavedWorldview,
    updateSavedWorldview,
  } = useWorldview();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  // Check if this worldview is already saved
  useEffect(() => {
    if (worldview) {
      const isAlreadySaved = savedWorldviews.some(
        (saved) => saved.id === worldview.id
      );
      setIsSaved(isAlreadySaved);
    }
  }, [savedWorldviews, worldview]);

  // Handle saving the worldview
  const handleSaveWorldview = () => {
    if (!worldview) return;

    // Convert CodexEntry to WorldviewProfile format
    addSavedWorldview({
      id: worldview.id,
      title: worldview.title,
      type: "codex",
      createdAt: new Date().toISOString(),
      domainScores: Array.isArray(worldview.domainScores)
        ? worldview.domainScores
        : codexScoresToDomainScores(worldview.scores || {}),
      summary: worldview.summary || worldview.description,
      icon: worldview.icon,
    });

    setIsSaved(true);
    toast({
      title: "Worldview Saved",
      description: `${worldview.title} has been added to your saved worldviews.`,
    });
  };

  return {
    isSaved,
    handleSaveWorldview,
    deleteSavedWorldview,
    updateSavedWorldview,
  };
};
