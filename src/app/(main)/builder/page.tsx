"use client";

// Import necessary components and hooks
import { useState } from "react";
// ... other imports from your original builder/page.tsx ...
import ClientTriangleChart from "@/components/visualization/ClientTriangleChart"; // Import the client-side wrapper
import { FACETS, FACET_NAMES } from '@/config/facets'; // Example import

// Import types if needed
import type { FacetName, DomainScore } from '@/types';

export default function BuilderPage() {
  const [isClient, setIsClient] = useState(false); // Added isClient state

  useEffect(() => {
    setIsClient(true); // Set isClient on mount
  }, []);

  // ... rest of your component logic and state ...

  return (
    // ... your JSX structure ...
    <div>
      <h1>Builder Page</h1>
      {/* Example usage of ClientTriangleChart with isClient check */}
      {isClient && (
        <ClientTriangleChart
          scores={[{ facetName: "Ontology", score: 0.5 }]} // Replace with actual scores data
          width={300}
          height={260}
          // Pass other relevant props
        />
      )}
      {/* ... rest of your JSX structure ... */}
    </div>
  );
}

// ... any other helper functions or exports ...
