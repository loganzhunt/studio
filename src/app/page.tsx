'use client';

import dynamic from 'next/dynamic';
import { FacetDependentComponent } from '@/components/client-only';

// Dynamically import the main page with no SSR
const MainPageClient = dynamic(
  () => import('./page.client'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
);

export default function MainPage() {
  return (
    <FacetDependentComponent>
      <MainPageClient />
    </FacetDependentComponent>
  );
}
