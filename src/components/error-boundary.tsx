"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // In production, send to monitoring service
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[400px] flex items-center justify-center p-6">
            <div className="text-center space-y-4 max-w-md">
              <div className="flex justify-center">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {this.state.error?.message ||
                  "An unexpected error occurred. Please try refreshing the page."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary for assessment components
export class AssessmentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Assessment Error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-100">
                  Assessment Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Unable to load the assessment component. Please try again.
                </p>
              </div>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Global error boundary for application-level errors
export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Global Error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="text-center space-y-6 max-w-lg">
              <div className="flex justify-center">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Application Error
                </h1>
                <p className="text-muted-foreground mb-4">
                  The application encountered an unexpected error. This has been
                  logged and will be investigated.
                </p>
                <details className="text-left bg-muted p-3 rounded-md text-sm">
                  <summary className="cursor-pointer font-medium mb-2">
                    Error Details
                  </summary>
                  <code className="text-red-600 dark:text-red-400">
                    {this.state.error?.message || "Unknown error occurred"}
                  </code>
                </details>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Application
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
