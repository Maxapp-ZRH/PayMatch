/**
 * Enhanced Error Handling Utilities
 *
 * Provides comprehensive error handling, categorization, and recovery mechanisms
 * for the authentication system and beyond.
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  userAgent?: string;
  url?: string;
}

export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  recoverable: boolean;
  retryable: boolean;
  category:
    | 'auth'
    | 'network'
    | 'validation'
    | 'permission'
    | 'system'
    | 'unknown';
  context?: ErrorContext;
  originalError?: Error;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly category: ErrorDetails['category'];
  public readonly recoverable: boolean;
  public readonly retryable: boolean;
  public readonly context?: ErrorContext;

  constructor(
    message: string,
    code: string,
    category: ErrorDetails['category'] = 'unknown',
    options: {
      recoverable?: boolean;
      retryable?: boolean;
      context?: ErrorContext;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.category = category;
    this.recoverable = options.recoverable ?? false;
    this.retryable = options.retryable ?? false;
    this.context = options.context;

    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

/**
 * Error categorization and handling
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorDetails[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Categorize and handle authentication errors
   */
  handleAuthError(error: unknown, context: ErrorContext = {}): ErrorDetails {
    const errorMessage = this.extractErrorMessage(error);
    // const errorCode = this.extractErrorCode(error); // TODO: Use for future error categorization

    // Authentication-specific error handling
    if (errorMessage.includes('Invalid login credentials')) {
      return this.createErrorDetails({
        code: 'AUTH_INVALID_CREDENTIALS',
        message: errorMessage,
        userMessage:
          'Invalid email or password. Please check your credentials and try again.',
        category: 'auth',
        recoverable: true,
        retryable: true,
        context,
        originalError: error as Error,
      });
    }

    if (errorMessage.includes('Email not confirmed')) {
      return this.createErrorDetails({
        code: 'AUTH_EMAIL_NOT_CONFIRMED',
        message: errorMessage,
        userMessage: 'Please verify your email address before signing in.',
        category: 'auth',
        recoverable: true,
        retryable: false,
        context,
        originalError: error as Error,
      });
    }

    if (errorMessage.includes('Too many requests')) {
      return this.createErrorDetails({
        code: 'AUTH_RATE_LIMITED',
        message: errorMessage,
        userMessage:
          'Too many attempts. Please wait a moment before trying again.',
        category: 'auth',
        recoverable: true,
        retryable: true,
        context,
        originalError: error as Error,
      });
    }

    if (errorMessage.includes('JWT') || errorMessage.includes('token')) {
      return this.createErrorDetails({
        code: 'AUTH_TOKEN_INVALID',
        message: errorMessage,
        userMessage: 'Your session has expired. Please sign in again.',
        category: 'auth',
        recoverable: true,
        retryable: false,
        context,
        originalError: error as Error,
      });
    }

    // Network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return this.createErrorDetails({
        code: 'NETWORK_ERROR',
        message: errorMessage,
        userMessage:
          'Network error. Please check your connection and try again.',
        category: 'network',
        recoverable: true,
        retryable: true,
        context,
        originalError: error as Error,
      });
    }

    // Default fallback
    return this.createErrorDetails({
      code: 'UNKNOWN_ERROR',
      message: errorMessage,
      userMessage: 'An unexpected error occurred. Please try again.',
      category: 'unknown',
      recoverable: false,
      retryable: true,
      context,
      originalError: error as Error,
    });
  }

  /**
   * Handle network errors with retry logic
   */
  async handleNetworkError<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw new AppError(
            `Network operation failed after ${maxRetries} attempts`,
            'NETWORK_MAX_RETRIES_EXCEEDED',
            'network',
            {
              recoverable: true,
              retryable: false,
              cause: lastError,
            }
          );
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }

  /**
   * Handle session errors with automatic recovery
   */
  handleSessionError(error: unknown, context: ErrorContext = {}): ErrorDetails {
    const errorMessage = this.extractErrorMessage(error);

    if (errorMessage.includes('session') || errorMessage.includes('expired')) {
      return this.createErrorDetails({
        code: 'SESSION_EXPIRED',
        message: errorMessage,
        userMessage: 'Your session has expired. Please sign in again.',
        category: 'auth',
        recoverable: true,
        retryable: false,
        context,
        originalError: error as Error,
      });
    }

    return this.handleAuthError(error, context);
  }

  /**
   * Log error for monitoring and debugging
   */
  logError(errorDetails: ErrorDetails): void {
    this.errorLog.push(errorDetails);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorDetails);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorDetails);
    }
  }

  /**
   * Get error recovery suggestions
   */
  getRecoverySuggestions(errorDetails: ErrorDetails): string[] {
    const suggestions: string[] = [];

    switch (errorDetails.code) {
      case 'AUTH_INVALID_CREDENTIALS':
        suggestions.push('Check your email and password');
        suggestions.push('Try resetting your password');
        break;

      case 'AUTH_EMAIL_NOT_CONFIRMED':
        suggestions.push('Check your email for verification link');
        suggestions.push('Request a new verification email');
        break;

      case 'AUTH_RATE_LIMITED':
        suggestions.push('Wait a few minutes before trying again');
        break;

      case 'NETWORK_ERROR':
        suggestions.push('Check your internet connection');
        suggestions.push('Try refreshing the page');
        break;

      case 'SESSION_EXPIRED':
        suggestions.push('Sign in again to continue');
        break;

      default:
        suggestions.push('Try refreshing the page');
        suggestions.push('Contact support if the problem persists');
    }

    return suggestions;
  }

  private createErrorDetails(options: {
    code: string;
    message: string;
    userMessage: string;
    category: ErrorDetails['category'];
    recoverable: boolean;
    retryable: boolean;
    context?: ErrorContext;
    originalError?: Error;
  }): ErrorDetails {
    return {
      ...options,
      context: {
        ...options.context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent:
          typeof window !== 'undefined' ? navigator.userAgent : undefined,
      },
    };
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'Unknown error';
  }

  private extractErrorCode(error: unknown): string {
    if (error && typeof error === 'object' && 'code' in error) {
      return String(error.code);
    }
    return 'UNKNOWN';
  }

  private async sendToMonitoringService(
    errorDetails: ErrorDetails
  ): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorDetails),
      });
    } catch (logError) {
      console.error('Failed to send error to monitoring service:', logError);
    }
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export function handleError(
  error: unknown,
  context?: ErrorContext
): ErrorDetails {
  return errorHandler.handleAuthError(error, context);
}

export function logError(error: unknown, context?: ErrorContext): ErrorDetails {
  const errorDetails = errorHandler.handleAuthError(error, context);
  errorHandler.logError(errorDetails);
  return errorDetails;
}

export function createAppError(
  message: string,
  code: string,
  category: ErrorDetails['category'] = 'unknown',
  options?: {
    recoverable?: boolean;
    retryable?: boolean;
    context?: ErrorContext;
    cause?: Error;
  }
): AppError {
  return new AppError(message, code, category, options);
}
