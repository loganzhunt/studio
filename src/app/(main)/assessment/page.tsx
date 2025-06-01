'use client';

import dynamic from 'next/dynamic';
import { FacetDependentComponent } from '@/components/client-only';

// Dynamically import the assessment page with no SSR
const AssessmentPageClient = dynamic(
  () => import('./page.client'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading assessment...</div>
  }
);

export default function AssessmentPage() {
  return (
    <FacetDependentComponent>
      <AssessmentPageClient />
    </FacetDependentComponent>
  );
}