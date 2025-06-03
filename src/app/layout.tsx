import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { WorldviewProvider } from "@/contexts/worldview-context-optimized-fixed";
import { FacetProvider } from "@/providers/facet-provider";
import { Header } from "@/components/layout/header";
import { ErrorBoundary } from "@/components/error-boundary";
import { initPerformanceMonitoring } from "@/lib/performance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meta-Prism",
  description:
    "A symbolic self-assessment tool for exploring how you construct reality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize performance monitoring on client side
  if (typeof window !== "undefined") {
    initPerformanceMonitoring();
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <ErrorBoundary>
          <FacetProvider>
            <WorldviewProvider>
              <Header />
              <div className="flex-grow">
                <ErrorBoundary>{children}</ErrorBoundary>
              </div>
              <Toaster />
            </WorldviewProvider>
          </FacetProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
