import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const isExport =
  process.env.NODE_ENV === "production" && process.env.BUILD_MODE === "export";

const nextConfig: NextConfig = {
  // Development optimizations
  ...(isDev && {
    experimental: {
      turbo: {
        rules: {
          "*.svg": ["@svgr/webpack"],
        },
      },
      optimizeCss: false, // Disable CSS optimization in dev for speed
      optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    // Remove deprecated swcMinify option
  }),

  // Production optimizations
  ...(!isDev && {
    output: "export",
    trailingSlash: true,
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    generateBuildId: async () => {
      return "meta-prism-" + Date.now();
    },
  }),

  // Common configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },

  // Note: Security headers removed for export build compatibility
  // For production deployments with server, add headers at the server level

  // Performance optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Development optimizations
      config.cache = {
        type: "filesystem",
        cacheDirectory: ".next/cache/webpack",
      };

      // Reduce bundle splitting in development for faster builds
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              chunks: "all",
              test: /node_modules/,
              name: "vendor",
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
