/**
 * Global Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */

'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/marketing_pages/Button';
import {
  isRefreshTokenError,
  clearInvalidSession,
} from '@/lib/session-cleanup';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error | null;
  errorId: string;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorId,
  resetError,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-4">
          We&apos;re sorry, but something unexpected happened. Our team has been
          notified.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mb-4 p-3 bg-gray-100 rounded text-sm">
            <summary className="cursor-pointer font-medium">
              Error Details
            </summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="space-y-3">
          <Button onClick={resetError} className="w-full" color="swiss">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button href="/" variant="outline" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">Error ID: {errorId}</p>
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Handle auth errors specifically
    if (isRefreshTokenError(error)) {
      console.log(
        'Refresh token error detected in ErrorBoundary, clearing session'
      );
      clearInvalidSession();
    }

    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = async (
    error: Error,
    errorInfo: React.ErrorInfo
  ) => {
    try {
      // Log to your error tracking service (Sentry, LogRocket, etc.)
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Example: Send to your API endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorId={this.state.errorId}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
