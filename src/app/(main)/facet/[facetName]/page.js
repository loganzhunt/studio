// This is a special file that Next.js looks for to build static paths
// The generateStaticParams function must be in a Server Component
import { FACET_NAMES } from '@/config/facets';

export function generateStaticParams() {
  return FACET_NAMES.map(facetName => ({
    facetName: facetName.toLowerCase(),
  }));
}

// Re-export the default client component
export { default } from "./client";
