/**
 * Authentication Helper Functions
 *
 * Centralized authentication utilities and helper functions.
 * Provides common auth logic used across the application.
 */

import { createClient } from '@/lib/supabase/server';
import { User, AuthError, Session } from '@supabase/supabase-js';
import {
  checkSessionTimeout,
  updateSessionActivity,
} from '../server/services/session-timeout';
import { logSessionActivity } from '../server/services/audit-logging';

export interface AuthUserResult {
  user: User | null;
  error: AuthError | null;
  isUnauthenticated: boolean;
}

export interface SessionTimeoutResult {
  isValid: boolean;
  shouldWarn: boolean;
  timeUntilExpiry: number;
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
    getSession: () => Promise<{
      data: { session: Session | null };
      error: AuthError | null;
    }>;
    refreshSession: () => Promise<{
      data: { session: Session | null };
      error: AuthError | null;
    }>;
    signOut: () => Promise<{ error: AuthError | null }>;
  };
}): Promise<AuthUserResult> {
  try {
    // First try to get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      // If session error, try to refresh
      const {
        data: { session: refreshedSession },
        error: refreshError,
      } = await supabase.auth.refreshSession();

      if (refreshError) {
        // If refresh fails, handle the error
        if (
          refreshError.message?.includes('JWT') ||
          refreshError.message?.includes('token') ||
          refreshError.message?.includes('User from sub claim') ||
          refreshError.message?.includes('does not exist') ||
          refreshError.message?.includes('Invalid Refresh Token')
        ) {
          await supabase.auth.signOut();
          return { user: null, error: null, isUnauthenticated: true };
        }
        return { user: null, error: refreshError, isUnauthenticated: true };
      }

      if (refreshedSession?.user) {
        return {
          user: refreshedSession.user,
          error: null,
          isUnauthenticated: false,
        };
      }
    }

    if (session?.user) {
      return { user: session.user, error: null, isUnauthenticated: false };
    }

    // Fallback to getUser if no session
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
        error.message?.includes('does not exist') ||
        error.message?.includes('Invalid Refresh Token')
      ) {
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
    const { data: orgMembership } = await supabase
      .from('organization_users')
      .select(
        `
        org_id,
        organizations!inner(onboarding_completed)
      `
      )
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const org = orgMembership?.organizations as
      | { onboarding_completed: boolean }
      | undefined;
    if (!org?.onboarding_completed) {
      return { user, redirectUrl: '/onboarding', shouldRedirect: true };
    }

    return { user, redirectUrl: redirectTo, shouldRedirect: true };
  }

  return { user: null, redirectUrl: '', shouldRedirect: false };
}

/**
 * Check session timeout for authenticated user
 * @param user - Authenticated user
 * @param sessionId - Session ID
 * @param request - Request object for audit logging
 * @returns Session timeout information
 */
export async function checkUserSessionTimeout(
  user: User,
  sessionId: string,
  request?: Request
): Promise<SessionTimeoutResult> {
  try {
    const timeoutInfo = await checkSessionTimeout(sessionId);

    if (timeoutInfo.isExpired) {
      // Log session expiration
      if (request) {
        await logSessionActivity('session_expired', {
          request,
          user: { id: user.id, email: user.email },
          sessionId,
        });
      }

      return {
        isValid: false,
        shouldWarn: false,
        timeUntilExpiry: 0,
      };
    }

    // Update session activity if valid
    if (timeoutInfo.timeUntilExpiry > 0) {
      await updateSessionActivity(sessionId, user.id, {
        request,
        email: user.email,
      });
    }

    return {
      isValid: true,
      shouldWarn: timeoutInfo.shouldWarn,
      timeUntilExpiry: timeoutInfo.timeUntilExpiry,
    };
  } catch (error) {
    console.error('Session timeout check error:', error);
    return {
      isValid: false,
      shouldWarn: false,
      timeUntilExpiry: 0,
    };
  }
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
