import { render, screen } from "@testing-library/react";
import {
  LoadingSpinner,
  LoadingCard,
  LoadingSkeleton,
  AssessmentLoadingState,
  withLoadingState,
} from "@/components/loading-states";
import React from "react";

// Mock component for HOC testing
const TestComponent = ({ message }: { message: string }) => (
  <div data-testid="test-component">{message}</div>
);

describe("Loading State Components", () => {
  describe("LoadingSpinner", () => {
    it("renders with default size", () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("h-6", "w-6");
    });

    it("renders with custom size", () => {
      render(<LoadingSpinner size="lg" />);
      const spinner = screen.getByRole("status");
      expect(spinner).toHaveClass("h-8", "w-8");
    });

    it("renders with custom text", () => {
      render(<LoadingSpinner text="Custom loading text" />);
      expect(screen.getByText("Custom loading text")).toBeInTheDocument();
    });

    it("has proper accessibility attributes", () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole("status");
      expect(spinner).toHaveAttribute("aria-label", "Loading");
    });
  });

  describe("LoadingCard", () => {
    it("renders card structure with spinner", () => {
      render(<LoadingCard />);

      const card = screen.getByTestId("loading-card");
      expect(card).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders with custom title", () => {
      render(<LoadingCard title="Custom Loading Title" />);
      expect(screen.getByText("Custom Loading Title")).toBeInTheDocument();
    });

    it("renders with custom description", () => {
      render(<LoadingCard description="Please wait while we process" />);
      expect(
        screen.getByText("Please wait while we process")
      ).toBeInTheDocument();
    });
  });

  describe("LoadingSkeleton", () => {
    it("renders skeleton with default props", () => {
      render(<LoadingSkeleton />);
      const skeleton = screen.getByTestId("loading-skeleton");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass("h-4", "w-full");
    });

    it("renders with custom dimensions", () => {
      render(<LoadingSkeleton width="w-32" height="h-8" />);
      const skeleton = screen.getByTestId("loading-skeleton");
      expect(skeleton).toHaveClass("h-8", "w-32");
    });

    it("renders multiple lines when count is specified", () => {
      render(<LoadingSkeleton count={3} />);
      const skeletons = screen.getAllByTestId("loading-skeleton");
      expect(skeletons).toHaveLength(3);
    });

    it("applies rounded class when specified", () => {
      render(<LoadingSkeleton rounded />);
      const skeleton = screen.getByTestId("loading-skeleton");
      expect(skeleton).toHaveClass("rounded-full");
    });
  });

  describe("AssessmentLoadingState", () => {
    it("renders assessment-specific loading state", () => {
      render(<AssessmentLoadingState />);

      expect(screen.getByText("Preparing Your Assessment")).toBeInTheDocument();
      expect(screen.getByText(/Getting everything ready/)).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("renders with custom step", () => {
      render(<AssessmentLoadingState step="Analyzing responses..." />);
      expect(screen.getByText("Analyzing responses...")).toBeInTheDocument();
    });
  });

  describe("withLoadingState HOC", () => {
    it("shows loading state when isLoading is true", () => {
      const WrappedComponent = withLoadingState(TestComponent);
      render(<WrappedComponent isLoading={true} message="test" />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
    });

    it("shows component when isLoading is false", () => {
      const WrappedComponent = withLoadingState(TestComponent);
      render(<WrappedComponent isLoading={false} message="test message" />);

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByTestId("test-component")).toBeInTheDocument();
      expect(screen.getByText("test message")).toBeInTheDocument();
    });

    it("shows custom loading component when provided", () => {
      const CustomLoading = () => (
        <div data-testid="custom-loading">Custom Loading</div>
      );
      const WrappedComponent = withLoadingState(TestComponent, CustomLoading);
      render(<WrappedComponent isLoading={true} message="test" />);

      expect(screen.getByTestId("custom-loading")).toBeInTheDocument();
      expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
    });

    it("preserves component props when not loading", () => {
      const WrappedComponent = withLoadingState(TestComponent);
      render(<WrappedComponent isLoading={false} message="preserved props" />);

      expect(screen.getByText("preserved props")).toBeInTheDocument();
    });
  });
});
