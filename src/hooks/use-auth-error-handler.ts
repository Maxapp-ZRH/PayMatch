/**
 * Auth Error Handler Hook
 *
 * Provides client-side handling of authentication errors,
 * particularly refresh token errors that can occur during session validation.
 */

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  isRefreshTokenError,
  clearInvalidSession,
} from '@/lib/session-cleanup';

/**
 * Hook to handle authentication errors globally
 * This should be used in the root layout or main app component
 */
export function useAuthErrorHandler() {
  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state changes and handle errors
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      // Handle sign out events (which can be triggered by invalid tokens)
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing any remaining auth data');
        await clearInvalidSession();
      }
    });

    // Handle unhandled promise rejections that might be auth errors
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isRefreshTokenError(event.reason)) {
        console.log('Unhandled refresh token error detected, clearing session');
        clearInvalidSession();
        event.preventDefault(); // Prevent the error from being logged
      }
    };

    // Handle uncaught errors that might be auth errors
    const handleError = (event: ErrorEvent) => {
      if (isRefreshTokenError(event.error)) {
        console.log('Uncaught refresh token error detected, clearing session');
        clearInvalidSession();
        event.preventDefault(); // Prevent the error from being logged
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
      window.removeEventListener('error', handleError);
    };
  }, []);
}

/**
 * Hook to handle auth errors in specific components
 * @param onAuthError - Callback to handle auth errors
 */
export function useAuthErrorCallback(onAuthError?: (error: Error) => void) {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isRefreshTokenError(event.reason)) {
        console.log('Refresh token error in component, clearing session');
        clearInvalidSession();
        onAuthError?.(event.reason);
        event.preventDefault();
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (isRefreshTokenError(event.error)) {
        console.log('Refresh token error in component, clearing session');
        clearInvalidSession();
        onAuthError?.(event.error);
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
      window.removeEventListener('error', handleError);
    };
  }, [onAuthError]);
}
