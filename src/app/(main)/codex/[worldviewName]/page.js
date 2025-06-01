// This is a special file that Next.js looks for to build static paths
// The generateStaticParams function must be in a Server Component
import { BASE_CODEX_DATA } from "@/data/codex/base-codex-data";
import { LATEST_CODEX_UPDATE_BATCH } from "@/data/codex/latest-codex-update-batch";
import { ADDITIONAL_CODEX_DATA } from "@/data/codex/additional-codex-data";

export function generateStaticParams() {
  try {
    const combinedRawData = [
      ...LATEST_CODEX_UPDATE_BATCH,
      ...ADDITIONAL_CODEX_DATA,
      ...BASE_CODEX_DATA
    ];
    
    const uniqueIds = new Set();
    const params = [];

    for (const item of combinedRawData) {
      // Use id directly if available, otherwise generate from title/name
      const id = item.id || 
                (item.title || item.name || '').toLowerCase()
                  .replace(/\s+/g, '_')
                  .replace(/[^a-z0-9_]/g, '');
      
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

// Re-export the default client component
export { default } from "./client";
