/**
 * Authentication Helper Functions
 *
 * Centralized authentication utilities and helper functions.
 * Provides common auth logic used across the application.
 */

import { createClient } from '@/lib/supabase/server';
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
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // Handle JWT errors by clearing the session
      if (
        error.message?.includes('JWT') ||
        error.message?.includes('token') ||
        error.message?.includes('User from sub claim') ||
        error.message?.includes('does not exist')
      ) {
        console.log('JWT error detected, clearing session');
        await supabase.auth.signOut();
        return { user: null, error: null, isUnauthenticated: true };
      }

      return { user: null, error, isUnauthenticated: true };
    }

    return { user, error: null, isUnauthenticated: false };
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

/**
 * Handle common auth page logic
 * @param searchParamsPromise - Promise resolving to search params
 * @returns Promise with user, redirect URL, and redirect flag
 */
export async function handleAuthPageLogic(
  searchParamsPromise?: Promise<{
    redirectTo?: string;
    verified?: string;
    email?: string;
  }>
): Promise<{
  user: User | null;
  redirectUrl: string;
  shouldRedirect: boolean;
}> {
  const supabase = await createClient();
  const { user, error } = await getAuthUserSafely(supabase);
  const resolvedSearchParams = await searchParamsPromise;
  const redirectTo = resolvedSearchParams?.redirectTo || '/dashboard';

  if (user && !error) {
    if (!user.email_confirmed_at) {
      return { user, redirectUrl: '/verify-email', shouldRedirect: true };
    }

    // Check if user has completed onboarding
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (!profile?.onboarding_completed) {
      return { user, redirectUrl: '/onboarding', shouldRedirect: true };
    }

    return { user, redirectUrl: redirectTo, shouldRedirect: true };
  }

  return { user: null, redirectUrl: '', shouldRedirect: false };
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
