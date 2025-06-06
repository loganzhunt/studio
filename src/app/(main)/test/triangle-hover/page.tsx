"use client";

import dynamic from "next/dynamic";

// Dynamically import the test component
const TriangleHoverTest = dynamic(
  () => import("@/components/test/TriangleHoverTest"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white text-xl">Loading triangle hover test...</div>
      </div>
    ),
  }
);

export default function TriangleTestPage() {
  return <TriangleHoverTest />;
}
