/**
 * Bundle optimization utilities for Meta-Prism
 * Provides dynamic imports, code splitting strategies, and bundle analysis tools
 */

import dynamic from "next/dynamic";
import { ComponentType, createElement } from "react";

// Dynamic loading wrapper with loading state
export const createDynamicComponent = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
    loadingText?: string;
  } = {}
) => {
  const {
    loading: LoadingComponent,
    ssr = true,
    loadingText = "Loading...",
  } = options;

  return dynamic(importFn, {
    ssr,
    loading: LoadingComponent
      ? () => createElement(LoadingComponent)
      : () =>
          createElement(
            "div",
            { className: "flex items-center justify-center p-4" },
            createElement("div", {
              className:
                "animate-spin rounded-full h-6 w-6 border-b-2 border-primary",
            }),
            createElement(
              "span",
              { className: "ml-2 text-sm text-muted-foreground" },
              loadingText
            )
          ),
  });
};

// Code-split heavy components
export const DynamicAssessment = createDynamicComponent(
  () => import("@/app/(main)/assessment/page"),
  { loadingText: "Loading Assessment..." }
);

export const DynamicBuilder = createDynamicComponent(
  () => import("@/app/(main)/builder/page"),
  { loadingText: "Loading Builder..." }
);

export const DynamicCodex = createDynamicComponent(
  () => import("@/app/(main)/codex/page"),
  { loadingText: "Loading Codex..." }
);

export const DynamicResults = createDynamicComponent(
  () => import("@/app/(main)/results/page"),
  { loadingText: "Loading Results..." }
);

export const DynamicVisualization = createDynamicComponent(
  () => import("@/components/visualization/TriangleChart"),
  { loadingText: "Loading Visualization..." }
);

// Chart components (heavy dependencies)
export const DynamicChartComponents = {
  TriangleChart: createDynamicComponent(
    () => import("@/components/visualization/TriangleChart"),
    { ssr: false, loadingText: "Loading Chart..." }
  ),
  SpectrumSlider: createDynamicComponent(
    () => import("@/components/spectrum-slider"),
    { ssr: false, loadingText: "Loading Slider..." }
  ),
};

// Utility for preloading critical routes
export const preloadCriticalRoutes = () => {
  if (typeof window !== "undefined") {
    // Preload critical routes on user interaction
    const preloadOnHover = (href: string) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      document.head.appendChild(link);
    };

    // Critical routes to preload
    const criticalRoutes = ["/assessment", "/results", "/codex", "/builder"];

    criticalRoutes.forEach((route) => preloadOnHover(route));
  }
};

// Bundle analyzer configuration
export const bundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === "true",
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: "server",
      analyzerPort: 8889,
    },
    client: {
      analyzerMode: "static",
      reportFilename: "../bundle-analysis/client.html",
    },
  },
};

// Webpack optimization for development vs production
export const webpackOptimizations = {
  development: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  production: {
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 250000,
      cacheGroups: {
        framework: {
          chunks: "all",
          name: "framework",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true,
        },
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name: "lib",
          priority: 30,
          chunks: "all",
          minChunks: 1,
        },
        commons: {
          name: "commons",
          minChunks: 2,
          priority: 20,
          chunks: "all",
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
    usedExports: true,
    sideEffects: false,
  },
};

// Resource hints for better loading performance
export const generateResourceHints = () => {
  if (typeof window !== "undefined") {
    // DNS prefetch for external domains
    const externalDomains = [
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "firebase.googleapis.com",
    ];

    externalDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect to critical external resources
    const criticalResources = [
      "https://fonts.googleapis.com",
      "https://firebase.googleapis.com",
    ];

    criticalResources.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = url;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }
};

// Image optimization utilities
export const imageOptimization = {
  formats: ["webp", "avif"],
  sizes: [16, 32, 48, 64, 96, 128, 256, 384],
  quality: 85,
  loading: "lazy" as const,
  placeholder: "blur" as const,
};

// Service worker utilities for caching
export const serviceWorkerConfig = {
  sw: "/sw.js",
  register: process.env.NODE_ENV === "production",
  scope: "/",
  updateViaCache: "none" as const,
};

// Performance budget warnings
export const performanceBudget = {
  maxAssetSize: 250000, // 250KB
  maxEntrypointSize: 350000, // 350KB
  hints: process.env.NODE_ENV === "production" ? "warning" : false,
};

// Tree shaking configuration
export const treeShakingConfig = {
  usedExports: true,
  sideEffects: [
    "*.css",
    "*.scss",
    "*.sass",
    "*.less",
    "./src/app/globals.css",
    "./src/lib/firebase.ts", // Firebase needs side effects
  ],
};

export default {
  createDynamicComponent,
  DynamicChartComponents,
  preloadCriticalRoutes,
  bundleAnalyzerConfig,
  webpackOptimizations,
  generateResourceHints,
  imageOptimization,
  serviceWorkerConfig,
  performanceBudget,
  treeShakingConfig,
};
