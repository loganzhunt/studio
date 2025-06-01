import { FACET_NAMES } from '@/config/facets';

// This function generates all possible parameter combinations for the dynamic route
// It's required for static site generation (SSG) with Next.js when using output: 'export'
export function generateStaticParams() {
  return FACET_NAMES.map(facetName => ({
    facetName: facetName.toLowerCase(),
  }));
}
