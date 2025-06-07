"use client";

import { useEffect } from "react";
import { initPerformanceMonitoring } from "@/lib/performance";

/**
 * Component that initializes performance monitoring on the client side
 * using useEffect to prevent redundant executions
 */
export function PerformanceInitializer() {
  useEffect(() => {
    // Initialize performance monitoring only once when component mounts
    initPerformanceMonitoring();
  }, []);

  return null; // This is a utility component that doesn't render anything
}
