// Import necessary data sources
import { BASE_CODEX_DATA } from "@/data/codex/base-codex-data";
import { LATEST_CODEX_UPDATE_BATCH } from "@/data/codex/latest-codex-update-batch";
import { ADDITIONAL_CODEX_DATA } from "@/data/codex/additional-codex-data";
import Link from 'next/link';

// Function to clean up an ID or create one from a title
const createIdFromTitle = (title) => {
  return title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// Must be async to match Next.js expectations for generateStaticParams
export async function generateStaticParams() {
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

// Convert raw data to a more usable format
function mapRawDataToCodexEntries(rawData) {
  return rawData.map(item => {
    const id = item.id || createIdFromTitle(item.title || item.name || '');
    return {
      id,
      title: item.title || item.name || 'Unknown',
      description: item.description || '',
      scores: item.scores || {},
      facet_descriptions: item.facet_descriptions || {},
      key_thinkers: item.key_thinkers || [],
      key_texts: item.key_texts || [],
      era: item.era || '',
      ...item
    };
  });
}

// Static fallback component
export default function CodexWorldviewPage({ params }) {
  const worldviewName = params?.worldviewName || '';
  
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
          For the full interactive experience, please visit this page in your browser.
        </p>
        <div className="flex justify-center">
          <Link href="/codex" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Back to Codex
          </Link>
        </div>
      </div>
    </div>
  );
}
