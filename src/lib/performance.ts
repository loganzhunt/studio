import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

// Performance thresholds based on Core Web Vitals
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 }, // Updated from FID to INP
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(
  name: string,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

function reportMetric(metric: Metric) {
  const performanceMetric: PerformanceMetric = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vital:", {
      name: performanceMetric.name,
      value: Math.round(performanceMetric.value),
      rating: performanceMetric.rating,
      id: performanceMetric.id,
    });
  }

  // Store metric in window for testing
  if (typeof window !== "undefined") {
    if (!(window as any).__webVitals) {
      (window as any).__webVitals = [];
    }
    (window as any).__webVitals.push(performanceMetric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // Example with Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", performanceMetric.name, {
        event_category: "Web Vitals",
        value: Math.round(performanceMetric.value),
        custom_map: {
          metric_rating: performanceMetric.rating,
        },
      });
    }

    // Example with custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(performanceMetric),
    // }).catch(console.error);
  }
}

// Initialize Web Vitals monitoring
export function initPerformanceMonitoring() {
  try {
    onCLS(reportMetric);
    onFCP(reportMetric);
    onINP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);

    if (process.env.NODE_ENV === "development") {
      console.log("🚀 Performance monitoring initialized");
    }
  } catch (error) {
    console.error("Failed to initialize performance monitoring:", error);
  }
}

// Export reportMetric for testing
export { reportMetric };

// Custom metric tracking functions
export function trackCustomMetric(
  name: string,
  value: number,
  metadata?: Record<string, any>
) {
  const customMetric = {
    name,
    value,
    timestamp: Date.now(),
    metadata: metadata || {},
  };

  console.log("Custom Metric:", {
    name: customMetric.name,
    value: Math.round(customMetric.value),
    timestamp: customMetric.timestamp,
    metadata: customMetric.metadata,
  });

  // Store in window for testing/debugging
  if (typeof window !== "undefined") {
    if (!(window as any).__customMetrics) {
      (window as any).__customMetrics = [];
    }
    (window as any).__customMetrics.push(customMetric);
  }
}

// Get stored performance metrics
export function getPerformanceMetrics(includeCustom = false): any[] {
  if (typeof window === "undefined") return [];

  const webVitals = (window as any).__webVitals || [];
  const customMetrics = includeCustom
    ? (window as any).__customMetrics || []
    : [];

  return [...webVitals, ...customMetrics];
}

// Custom performance markers for application-specific metrics
export class PerformanceTracker {
  private static marks: Map<string, number> = new Map();

  static mark(name: string) {
    const timestamp = performance.now();
    this.marks.set(name, timestamp);
    performance.mark(name);
  }

  static measure(name: string, startMark: string, endMark?: string) {
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }

      const measure = performance.getEntriesByName(name, "measure")[0];
      if (measure) {
        console.log(
          `Performance: ${name} took ${Math.round(measure.duration)}ms`
        );
        return measure.duration;
      }
    } catch (error) {
      console.error(`Failed to measure ${name}:`, error);
    }
    return 0;
  }

  static getDuration(startMark: string): number {
    const startTime = this.marks.get(startMark);
    if (startTime) {
      return performance.now() - startTime;
    }
    return 0;
  }

  static clearMarks() {
    this.marks.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  if (typeof window !== "undefined") {
    const mountTime = `${componentName}-mount`;
    PerformanceTracker.mark(mountTime);

    return () => {
      const duration = PerformanceTracker.getDuration(mountTime);
      if (duration > 100) {
        // Only log if component took longer than 100ms
        console.log(`${componentName} lifecycle: ${Math.round(duration)}ms`);
      }
    };
  }
  return () => {};
}

// Bundle size monitoring
export function logBundleInfo() {
  if (process.env.NODE_ENV === "development") {
    // This would be populated by webpack-bundle-analyzer data
    console.log("Bundle analysis available at: http://localhost:8888");
  }
}

export default initPerformanceMonitoring;
