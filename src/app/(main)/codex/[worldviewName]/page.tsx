import Link from "next/link";
import { getCombinedCodexData, createIdFromTitle } from "@/lib/codex-utils";
import type { CodexEntry } from "@/types";

// Must be async to match Next.js expectations for generateStaticParams
export async function generateStaticParams() {
  try {
    const combinedRawData = getCombinedCodexData();

    const uniqueIds = new Set();
    const params = [];

    for (const item of combinedRawData) {
      // Use id directly if available, otherwise generate from title/name
      const id = item.id || createIdFromTitle(item.title || item.name || "");

      if (id && !uniqueIds.has(id)) {
        params.push({ worldviewName: id });
        uniqueIds.add(id);
      }
    }

    return params;
  } catch (error) {
    console.error("Error generating static params for codex:", error);
    return [];
  }
}

// This function is no longer needed here as it's moved to codex-utils.ts

// Static fallback component
export default function CodexWorldviewPage({
  params,
}: {
  params: { worldviewName: string };
}) {
  const worldviewName = params?.worldviewName || "";

  // This page component is a server component with minimal features
  // to allow static generation
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">Worldview Details</h1>
      <p className="text-center mb-6">
        This page contains information about {worldviewName}.
      </p>

      <div className="text-center">
        <p className="mb-4">
          For the full interactive experience, please visit this page in your
          browser.
        </p>
        <div className="flex justify-center">
          <Link
            href="/codex"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Codex
          </Link>
        </div>
      </div>
    </div>
  );
}
