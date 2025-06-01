'use client';

import dynamic from 'next/dynamic';
import { FacetDependentComponent } from '@/components/client-only';

// Dynamically import the dashboard page with no SSR
const DashboardPageClient = dynamic(
  () => import('./page.client'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>
  }
);

export default function DashboardPage() {
  return (
    <FacetDependentComponent>
      <DashboardPageClient />
    </FacetDependentComponent>
  );
}
