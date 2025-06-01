'use client';

import dynamic from 'next/dynamic';
import { FacetDependentComponent } from '@/components/client-only';

// Dynamically import the results page with no SSR
const ResultsPageClient = dynamic(
  () => import('./page.client'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading results...</div>
  }
);

export default function ResultsPage() {
  return (
    <FacetDependentComponent>
      <ResultsPageClient />
    </FacetDependentComponent>
  );
}