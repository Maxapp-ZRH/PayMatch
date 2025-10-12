/**
 * Authentication Helper Functions
 *
 * Centralized authentication utilities and helper functions.
 * Provides common auth logic used across the application.
 */

import { User, AuthError } from '@supabase/supabase-js';

export interface AuthUserResult {
  user: User | null;
  error: AuthError | null;
  isUnauthenticated: boolean;
}

/**
 * Safely get authenticated user with proper error handling
 * @param supabase - Supabase client instance
 * @returns Promise<AuthUserResult>
 */
export async function getAuthUserSafely(supabase: {
  auth: {
    getUser: () => Promise<{
      data: { user: User | null };
      error: AuthError | null;
    }>;
    signOut: () => Promise<{ error: AuthError | null }>;
  };
}): Promise<AuthUserResult> {
  try {
    // First try to get the current user (more secure than getSession)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      // Handle JWT errors by clearing the session
      if (isJWTError(userError)) {
        await supabase.auth.signOut();
        return { user: null, error: null, isUnauthenticated: true };
      }

      return { user: null, error: userError, isUnauthenticated: true };
    }

    if (user) {
      return { user, error: null, isUnauthenticated: false };
    }

    return { user: null, error: null, isUnauthenticated: true };
  } catch (err) {
    // Only log non-"Auth session missing!" errors
    if (
      !(err as { message?: string }).message?.includes('Auth session missing')
    ) {
      console.error('Auth error:', err);
    }

    return { user: null, error: err as AuthError, isUnauthenticated: true };
  }
}

// Removed handleAuthPageLogic - replaced with simpler checkAuthPageRedirect

/**
 * Check if user is authenticated and handle redirects for auth pages
 * @param supabase - Supabase client instance
 * @param redirectTo - Optional redirect destination
 * @returns Promise with redirect URL or null if no redirect needed
 */
export async function checkAuthPageRedirect(
  supabase: {
    auth: {
      getUser: () => Promise<{
        data: { user: User | null };
        error: AuthError | null;
      }>;
    };
  },
  redirectTo?: string
): Promise<string | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user && !error) {
    // Check if user's email is verified
    if (!user.email_confirmed_at) {
      return '/verify-email';
    }

    // Redirect to dashboard or intended destination
    return redirectTo || '/dashboard';
  }

  return null;
}

/**
 * Check if an error is a JWT/token related error that requires sign out
 * @param error - Error object
 * @returns boolean indicating if user should be signed out
 */
export function isJWTError(error: unknown): boolean {
  const errorMessage =
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : '';

  return (
    errorMessage.includes('JWT') ||
    errorMessage.includes('token') ||
    errorMessage.includes('User from sub claim') ||
    errorMessage.includes('does not exist') ||
    errorMessage.includes('Invalid Refresh Token')
  );
}

/**
 * Handle authentication errors with user-friendly messages
 * @param error - Error object
 * @param context - Context where error occurred
 * @returns User-friendly error message
 */
export function handleAuthError(error: unknown, context: string): string {
  const errorMessage =
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : '';

  if (errorMessage.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }

  if (errorMessage.includes('Email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }

  if (errorMessage.includes('Too many requests')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }

  console.error(`Auth error in ${context}:`, error);
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Clear all client-side authentication data
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;

  // Clear Supabase auth data
  localStorage.removeItem('supabase.auth.remember');
  localStorage.removeItem('supabase.auth.token');

  // Clear app-specific data
  localStorage.removeItem('paymatch.user');
  localStorage.removeItem('paymatch.organization');
  localStorage.removeItem('paymatch.preferences');

  // Clear session storage
  sessionStorage.clear();

  // Clear cookies
  document.cookie.split(';').forEach((c) => {
    const eqPos = c.indexOf('=');
    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  });
}
