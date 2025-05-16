"use client";

import { useContext } from "react";
import { WorldviewContext }from "@/contexts/worldview-context";
import type { WorldviewContextType } from "@/types";

export const useWorldview = (): WorldviewContextType => {
  const context = useContext(WorldviewContext);
  if (context === undefined) {
    throw new Error("useWorldview must be used within a WorldviewProvider");
  }
  return context;
};
