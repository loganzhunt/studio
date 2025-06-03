// This DataProvider centralizes the data access for codex entries
"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { getAllCodexEntries, getCodexEntryBySlug } from "@/lib/codex-utils";
import type { CodexEntry } from "@/types";

interface CodexDataContextType {
  allEntries: CodexEntry[];
  getEntryBySlug: (slug: string) => CodexEntry | undefined;
}

const CodexDataContext = createContext<CodexDataContextType | null>(null);

export const CodexDataProvider = ({ children }: { children: ReactNode }) => {
  // Load all codex entries once on provider initialization
  const allEntries = useMemo(() => getAllCodexEntries(), []);

  // Provide a function to get an entry by slug
  const getEntryBySlug = useMemo(
    () => (slug: string) => {
      return allEntries.find((entry) => {
        const entryId = entry.id;
        return entryId === slug;
      });
    },
    [allEntries]
  );

  const value = useMemo(
    () => ({ allEntries, getEntryBySlug }),
    [allEntries, getEntryBySlug]
  );

  return (
    <CodexDataContext.Provider value={value}>
      {children}
    </CodexDataContext.Provider>
  );
};

export const useCodexData = () => {
  const context = useContext(CodexDataContext);
  if (!context) {
    throw new Error("useCodexData must be used within a CodexDataProvider");
  }
  return context;
};
