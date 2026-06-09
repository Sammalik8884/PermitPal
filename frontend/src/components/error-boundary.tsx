import React from "react";
import { AlertTriangle, WifiOff, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// ─── Error Boundary ──────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    // Log to error reporting service in production
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/dashboard";
  };

  isNetworkError(): boolean {
    const { error } = this.state;
    if (!error) return false;
    const message = error.message.toLowerCase();
    return (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("timeout") ||
      message.includes("connection") ||
      error.name === "TypeError"
    );
  }

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const isNetwork = this.isNetworkError();
    const isDev = import.meta.env.DEV;

    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="mx-auto max-w-md text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            {isNetwork ? (
              <WifiOff className="h-8 w-8 text-destructive" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-destructive" />
            )}
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {isNetwork
                ? "Connection Problem"
                : "Something went wrong"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isNetwork
                ? "Please check your internet connection and try again."
                : "An unexpected error occurred. Our team has been notified."}
            </p>
          </div>

          {/* Error details in dev mode */}
          {isDev && this.state.error && (
            <div className="rounded-lg border bg-muted/50 p-4 text-left">
              <p className="text-xs font-mono text-destructive break-all">
                {this.state.error.message}
              </p>
              {this.state.errorInfo?.componentStack && (
                <pre className="mt-2 max-h-32 overflow-auto text-xs text-muted-foreground">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={this.handleGoHome}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
            <Button onClick={this.handleReset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export { ErrorBoundary };
