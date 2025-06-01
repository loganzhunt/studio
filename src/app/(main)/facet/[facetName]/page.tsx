import { FACET_NAMES, FACETS } from '@/config/facets';
import Link from 'next/link';

// This function generates all possible parameter combinations for the dynamic route
// It's required for static site generation (SSG) with Next.js

// The generateStaticParams function must be defined directly in the page.tsx file
// and exported as a named export for Next.js static export to work
export async function generateStaticParams() {
  // Generate a static path for each facet name
  return Array.isArray(FACET_NAMES) && FACET_NAMES.length > 0 ? FACET_NAMES.map(facetName => ({
    facetName: facetName.toLowerCase(),
  })) : [];
}

// Simple server component for static generation
export default function FacetPage({ params }: { params: { facetName: string } }) {
  const facetName = params?.facetName || '';
  const capitalizedFacetName = facetName.charAt(0).toUpperCase() + facetName.slice(1);
  const facet = capitalizedFacetName && (capitalizedFacetName in FACETS) ? FACETS[capitalizedFacetName as keyof typeof FACETS] : undefined;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">{facet?.name || capitalizedFacetName}</h1>
      <p className="text-center mb-6">
        {facet?.tagline || 'Facet details'}
      </p>
      
      <div className="text-center">
        <p className="mb-4">
          For the full interactive experience, please visit this page in your browser.
        </p>
        <div className="flex justify-center">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
