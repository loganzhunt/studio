import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  EnhancedErrorBoundary,
  ErrorBoundary,
  AssessmentErrorBoundary,
  GlobalErrorBoundary,
} from "@/components/enhanced-error-boundary";
import React from "react";

// Mock child component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Working component</div>;
};

describe("Error Boundary Components", () => {
  // Reset error boundaries before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ErrorBoundary", () => {
    it("renders children when there is no error", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Working component")).toBeInTheDocument();
    });

    it("renders error UI when child component throws", () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Try again")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("allows retry functionality", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      let shouldThrow = true;

      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Click retry button
      fireEvent.click(screen.getByText("Try again"));

      // Change the error condition and rerender
      shouldThrow = false;
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Working component")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("AssessmentErrorBoundary", () => {
    it("renders assessment-specific error UI", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <AssessmentErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AssessmentErrorBoundary>
      );

      expect(screen.getByText("Assessment Error")).toBeInTheDocument();
      expect(
        screen.getByText(/There was an issue with the assessment/)
      ).toBeInTheDocument();
      expect(screen.getByText("Restart Assessment")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("GlobalErrorBoundary", () => {
    it("renders global error UI with navigation options", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );

      expect(screen.getByText("Application Error")).toBeInTheDocument();
      expect(screen.getByText(/unexpected error occurred/)).toBeInTheDocument();
      expect(screen.getByText("Go to Home")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("EnhancedErrorBoundary", () => {
    it("renders default variant fallback when there is an error", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      consoleSpy.mockRestore();
    });

    it("renders assessment variant fallback when specified", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <EnhancedErrorBoundary variant="assessment">
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );

      expect(screen.getByText("Assessment Error")).toBeInTheDocument();
      consoleSpy.mockRestore();
    });

    it("renders global variant fallback when specified", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <EnhancedErrorBoundary variant="global">
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );

      expect(screen.getByText("Application Error")).toBeInTheDocument();
      consoleSpy.mockRestore();
    });

    it("allows custom fallback to override default variants", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const customFallback = <div>Custom Error UI</div>;

      render(
        <EnhancedErrorBoundary variant="global" fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );

      expect(screen.getByText("Custom Error UI")).toBeInTheDocument();
      consoleSpy.mockRestore();
    });
  });
});
