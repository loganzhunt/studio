'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// Create a client-only wrapper that prevents SSR issues
function ClientOnlyWrapper({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

// Higher-order component to make any component client-only
export function withClientOnly<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent?: React.ComponentType
) {
  const ClientOnlyComponent = dynamic(
    () => Promise.resolve(Component),
    {
      ssr: false,
      loading: LoadingComponent ? () => <LoadingComponent /> : () => <div>Loading...</div>
    }
  );

  return ClientOnlyComponent;
}

// Specific wrapper for facet-dependent components
export function FacetDependentComponent({ 
  children, 
  fallback = <div>Loading facets...</div> 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ClientOnlyWrapper>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ClientOnlyWrapper>
  );
}

export default ClientOnlyWrapper;
