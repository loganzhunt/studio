import {
  reportMetric,
  initPerformanceMonitoring,
  trackCustomMetric,
  getPerformanceMetrics,
} from "@/lib/performance";

// Define proper Metric type that matches web-vitals package
type MetricName = "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
type MetricRating = "good" | "needs-improvement" | "poor";

interface Metric {
  name: MetricName;
  value: number;
  rating: MetricRating;
  id: string;
  navigationType: "navigate" | "reload" | "back_forward" | "prerender";
  entries?: PerformanceEntry[];
  delta?: number;
}

// Mock Web Vitals
jest.mock("web-vitals", () => ({
  onCLS: jest.fn(),
  onFCP: jest.fn(),
  onINP: jest.fn(),
  onLCP: jest.fn(),
  onTTFB: jest.fn(),
}));

// Mock console methods
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("Performance Monitoring", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any stored metrics
    if (typeof window !== "undefined") {
      delete (window as any).__performanceMetrics;
    }
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe("reportMetric", () => {
    it("logs metric data in development", () => {
      const mockMetric = {
        name: "LCP",
        value: 2500,
        rating: "good" as const,
        id: "test-id",
        navigationType: "reload" as const,
      };

      reportMetric(mockMetric);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Web Vital:",
        expect.objectContaining({
          name: "LCP",
          value: 2500,
          rating: "good",
        })
      );
    });

    it("stores metric in window object", () => {
      // Mock window object
      Object.defineProperty(window, "__performanceMetrics", {
        value: [],
        writable: true,
        configurable: true,
      });

      const mockMetric = {
        name: "CLS",
        value: 0.1,
        rating: "good" as const,
        id: "test-id",
        navigationType: "reload" as const,
      };

      reportMetric(mockMetric);

      expect((window as any).__performanceMetrics).toContainEqual(
        expect.objectContaining({
          name: "CLS",
          value: 0.1,
          rating: "good",
        })
      );
    });

    it("handles errors gracefully", () => {
      // Force an error by passing invalid data
      const invalidMetric = null as any;

      expect(() => reportMetric(invalidMetric)).not.toThrow();
    });
  });

  describe("initPerformanceMonitoring", () => {
    it("initializes all web vitals listeners", () => {
      const { onCLS, onFCP, onINP, onLCP, onTTFB } = require("web-vitals");

      initPerformanceMonitoring();

      expect(onCLS).toHaveBeenCalledWith(reportMetric);
      expect(onFCP).toHaveBeenCalledWith(reportMetric);
      expect(onINP).toHaveBeenCalledWith(reportMetric);
      expect(onLCP).toHaveBeenCalledWith(reportMetric);
      expect(onTTFB).toHaveBeenCalledWith(reportMetric);
    });

    it("logs initialization message", () => {
      initPerformanceMonitoring();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "🚀 Performance monitoring initialized"
      );
    });
  });

  describe("trackCustomMetric", () => {
    beforeEach(() => {
      // Mock performance.now()
      Object.defineProperty(performance, "now", {
        value: jest.fn(() => 1000),
        writable: true,
        configurable: true,
      });
    });

    it("tracks custom metric with timestamp", () => {
      trackCustomMetric("page-load", 2500, { page: "/home" });

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Custom Metric:",
        expect.objectContaining({
          name: "page-load",
          value: 2500,
          metadata: { page: "/home" },
          timestamp: 1000,
        })
      );
    });

    it("tracks metric without metadata", () => {
      trackCustomMetric("api-call", 500);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Custom Metric:",
        expect.objectContaining({
          name: "api-call",
          value: 500,
          timestamp: 1000,
        })
      );
    });

    it("stores custom metric in window object", () => {
      Object.defineProperty(window, "__customMetrics", {
        value: [],
        writable: true,
        configurable: true,
      });

      trackCustomMetric("assessment-completion", 30000);

      expect((window as any).__customMetrics).toContainEqual(
        expect.objectContaining({
          name: "assessment-completion",
          value: 30000,
        })
      );
    });
  });

  describe("getPerformanceMetrics", () => {
    it("returns stored performance metrics", () => {
      Object.defineProperty(window, "__performanceMetrics", {
        value: [
          { name: "LCP", value: 2500, rating: "good" },
          { name: "FCP", value: 1500, rating: "good" },
        ],
        writable: true,
        configurable: true,
      });

      const metrics = getPerformanceMetrics();

      expect(metrics).toHaveLength(2);
      expect(metrics[0]).toEqual(
        expect.objectContaining({ name: "LCP", value: 2500 })
      );
    });

    it("returns empty array when no metrics stored", () => {
      const metrics = getPerformanceMetrics();
      expect(metrics).toEqual([]);
    });

    it("returns stored custom metrics when includeCustom is true", () => {
      Object.defineProperty(window, "__performanceMetrics", {
        value: [{ name: "LCP", value: 2500 }],
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window, "__customMetrics", {
        value: [{ name: "api-call", value: 500 }],
        writable: true,
        configurable: true,
      });

      const metrics = getPerformanceMetrics(true);

      expect(metrics).toHaveLength(2);
      expect(metrics).toContainEqual(expect.objectContaining({ name: "LCP" }));
      expect(metrics).toContainEqual(
        expect.objectContaining({ name: "api-call" })
      );
    });
  });

  describe("Performance Thresholds", () => {
    it("identifies poor LCP performance", () => {
      const poorLCPMetric = {
        name: "LCP",
        value: 4500, // Poor threshold
        rating: "poor" as const,
        id: "test-id",
        navigationType: "reload" as const,
      };

      reportMetric(poorLCPMetric);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Web Vital:",
        expect.objectContaining({
          name: "LCP",
          rating: "poor",
        })
      );
    });

    it("identifies good CLS performance", () => {
      const goodCLSMetric = {
        name: "CLS",
        value: 0.05, // Good threshold
        rating: "good" as const,
        id: "test-id",
        navigationType: "reload" as const,
      };

      reportMetric(goodCLSMetric);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Web Vital:",
        expect.objectContaining({
          name: "CLS",
          rating: "good",
        })
      );
    });
  });
});
