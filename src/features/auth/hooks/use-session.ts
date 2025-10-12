/**
 * Unified Session Hook
 *
 * Client-side hook for managing user session state across the application.
 * Provides consistent session management with automatic refresh and error handling.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type {
  SessionState,
  UseSessionReturn,
  ExtendedUser,
} from '../types/session';

/**
 * Custom hook for unified session management
 * @param options - Session validation options
 * @returns Session state and management functions
 */
export function useSession(options?: {
  requireEmailVerification?: boolean;
  requireOnboarding?: boolean;
  requireOrganization?: boolean;
}): UseSessionReturn {
  const [state, setState] = useState<SessionState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    isEmailVerified: false,
    hasCompletedOnboarding: false,
    hasOrganization: false,
  });

  const supabase = createClient();
  const initialized = useRef(false);
  const validateSessionRef = useRef<(() => Promise<void>) | null>(null);

  // Memoize individual option values to prevent unnecessary re-renders
  const requireEmailVerification = options?.requireEmailVerification ?? false;
  const requireOnboarding = options?.requireOnboarding ?? false;
  const requireOrganization = options?.requireOrganization ?? false;

  /**
   * Fetch user profile and organization data
   */
  const fetchUserData = useCallback(
    async (user: User): Promise<ExtendedUser> => {
      try {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Fetch organization membership
        const { data: orgMembership } = await supabase
          .from('organization_users')
          .select(
            `
          *,
          organizations!inner(*)
        `
          )
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        const organization =
          orgMembership?.organizations as ExtendedUser['organization'];
        const organizationMembership =
          orgMembership as ExtendedUser['organizationMembership'];

        return {
          ...user,
          profile: profile || null,
          organization: organization || null,
          organizationMembership: organizationMembership || null,
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        return user as ExtendedUser;
      }
    },
    [supabase]
  );

  /**
   * Validate session and update state
   */
  const validateSession = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Get current user (more secure than getSession)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('User error:', userError);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: userError.message,
          isAuthenticated: false,
        }));
        return;
      }

      if (!user) {
        setState((prev) => ({
          ...prev,
          loading: false,
          user: null,
          session: null,
          isAuthenticated: false,
          isEmailVerified: false,
          hasCompletedOnboarding: false,
          hasOrganization: false,
        }));
        return;
      }

      // Fetch extended user data
      const extendedUser = await fetchUserData(user);

      // Validate requirements
      const isEmailVerified = !!extendedUser.email_confirmed_at;
      const hasCompletedOnboarding =
        !!extendedUser.organization?.onboarding_completed;
      const hasOrganization = !!extendedUser.organization;

      // Check validation requirements
      let error: string | null = null;
      if (requireEmailVerification && !isEmailVerified) {
        error = 'Email verification required';
      } else if (requireOnboarding && !hasCompletedOnboarding) {
        error = 'Onboarding completion required';
      } else if (requireOrganization && !hasOrganization) {
        error = 'Organization membership required';
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        user: extendedUser,
        session: null, // We don't need session object when using getUser()
        error,
        isAuthenticated: true,
        isEmailVerified,
        hasCompletedOnboarding,
        hasOrganization,
      }));
    } catch (error) {
      console.error('Session validation error:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        isAuthenticated: false,
      }));
    }
  }, [
    supabase,
    fetchUserData,
    requireEmailVerification,
    requireOnboarding,
    requireOrganization,
  ]);

  // Store the validateSession function in a ref
  validateSessionRef.current = validateSession;

  /**
   * Refresh session
   */
  const refresh = useCallback(async (): Promise<void> => {
    if (validateSessionRef.current) {
      await validateSessionRef.current();
    }
  }, []);

  /**
   * Sign out user from all sessions
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      // Sign out from all sessions globally
      await supabase.auth.signOut({ scope: 'global' });

      // Clear local state immediately
      setState((prev) => ({
        ...prev,
        user: null,
        session: null,
        isAuthenticated: false,
        isEmailVerified: false,
        hasCompletedOnboarding: false,
        hasOrganization: false,
        error: null,
        loading: false,
      }));

      // Clear client-side storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.remember');
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('paymatch.user');
        localStorage.removeItem('paymatch.organization');
        localStorage.removeItem('paymatch.preferences');
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Sign out error:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }));
    }
  }, [supabase]);

  // Initialize session on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (validateSessionRef.current) {
        validateSessionRef.current();
      }
    }
  }, []); // Empty dependency array - only run on mount

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (
        event === 'SIGNED_IN' ||
        event === 'SIGNED_OUT' ||
        event === 'TOKEN_REFRESHED'
      ) {
        // Call validateSession directly without dependency
        try {
          setState((prev) => ({ ...prev, loading: true, error: null }));

          // Get current user (more secure than getSession)
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            console.error('User error:', userError);
            setState((prev) => ({
              ...prev,
              loading: false,
              error: userError.message,
              isAuthenticated: false,
            }));
            return;
          }

          if (!user) {
            setState((prev) => ({
              ...prev,
              loading: false,
              user: null,
              session: null,
              isAuthenticated: false,
              isEmailVerified: false,
              hasCompletedOnboarding: false,
              hasOrganization: false,
            }));
            return;
          }

          // Fetch extended user data
          const extendedUser = await fetchUserData(user);

          // Validate requirements
          const isEmailVerified = !!extendedUser.email_confirmed_at;
          const hasCompletedOnboarding =
            !!extendedUser.organization?.onboarding_completed;
          const hasOrganization = !!extendedUser.organization;

          // Check validation requirements
          let error: string | null = null;
          if (requireEmailVerification && !isEmailVerified) {
            error = 'Email verification required';
          } else if (requireOnboarding && !hasCompletedOnboarding) {
            error = 'Onboarding completion required';
          } else if (requireOrganization && !hasOrganization) {
            error = 'Organization membership required';
          }

          setState((prev) => ({
            ...prev,
            loading: false,
            user: extendedUser,
            session: null, // We don't need session object when using getUser()
            error,
            isAuthenticated: true,
            isEmailVerified,
            hasCompletedOnboarding,
            hasOrganization,
          }));
        } catch (error) {
          console.error('Session validation error:', error);
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            isAuthenticated: false,
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [
    supabase,
    fetchUserData,
    requireEmailVerification,
    requireOnboarding,
    requireOrganization,
  ]);

  return {
    ...state,
    refresh,
    signOut,
  };
}

/**
 * Hook for session with specific requirements
 * @param requireEmailVerification - Require email verification
 * @param requireOnboarding - Require onboarding completion
 * @param requireOrganization - Require organization membership
 * @returns Session state with validation
 */
export function useAuthenticatedSession(
  requireEmailVerification: boolean = true,
  requireOnboarding: boolean = true,
  requireOrganization: boolean = true
): UseSessionReturn {
  return useSession({
    requireEmailVerification,
    requireOnboarding,
    requireOrganization,
  });
}

/**
 * Hook for basic session (no requirements)
 * @returns Basic session state
 */
export function useBasicSession(): UseSessionReturn {
  return useSession();
}

// Re-export the type for convenience
export type { UseSessionReturn } from '../types/session';
