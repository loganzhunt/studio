import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2
        className={cn("animate-spin", sizeClasses[size])}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
};

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = "Loading...",
  description,
  className,
}) => {
  return (
    <div
      data-testid="loading-card"
      className={cn(
        "p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  width = "w-full",
  height = "h-4",
  rounded = false,
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          data-testid="loading-skeleton"
          className={cn(
            "animate-pulse bg-gray-200 dark:bg-gray-700",
            width,
            height,
            rounded ? "rounded-full" : "rounded",
            className
          )}
        />
      ))}
    </>
  );
};

interface AssessmentLoadingStateProps {
  step?: string;
}

export const AssessmentLoadingState: React.FC<AssessmentLoadingStateProps> = ({
  step = "Getting everything ready for you...",
}) => {
  return (
    <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-md max-w-md mx-auto text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <LoadingSpinner size="lg" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Preparing Your Assessment
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{step}</p>
        </div>
      </div>
    </div>
  );
};

interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children,
  fallback,
  errorFallback,
}) => {
  if (error) {
    return (
      errorFallback || (
        <div className="flex items-center justify-center p-6 text-red-600 dark:text-red-400">
          <div className="text-center">
            <p className="font-medium">Error occurred</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {error}
            </p>
          </div>
        </div>
      )
    );
  }

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center p-6">
          <LoadingSpinner text="Loading..." />
        </div>
      )
    );
  }

  return <>{children}</>;
};

// Skeleton components for better loading UX
export const AssessmentSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-24 bg-gray-200 dark:bg-gray-700 rounded"
        ></div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="space-y-1 flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Higher-order component for adding loading states
export function withLoadingState<P extends object>(
  Component: React.ComponentType<P>,
  loadingComponent?: React.ComponentType
) {
  return function WithLoadingStateComponent(
    props: P & { loading?: boolean; isLoading?: boolean; error?: string }
  ) {
    const { loading, isLoading, error, ...restProps } = props;
    const isComponentLoading = loading || isLoading;

    if (error) {
      return (
        <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded">
          Error: {error}
        </div>
      );
    }

    if (isComponentLoading) {
      const LoadingComponent = loadingComponent || LoadingSpinner;
      return <LoadingComponent />;
    }

    return <Component {...(restProps as P)} />;
  };
}
