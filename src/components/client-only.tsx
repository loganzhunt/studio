"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

// Optimized client-only wrapper without hydration delays
function ClientOnlyWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Higher-order component to make any component client-only
export function withClientOnly<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent?: React.ComponentType
) {
  const ClientOnlyComponent = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: LoadingComponent ? () => <LoadingComponent /> : undefined,
  });

  return ClientOnlyComponent;
}

// Simplified wrapper for facet-dependent components
export function FacetDependentComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientOnlyWrapper>{children}</ClientOnlyWrapper>;
}

export default ClientOnlyWrapper;
