/**
 * Unified Server Session Helper
 *
 * Server-side session management utilities for pages and API routes.
 * Provides consistent session validation and user data fetching.
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  getCachedUserProfile,
  cacheUserProfile,
  cacheOrganization,
} from '../services/cache';
import type {
  ServerSessionResult,
  ExtendedUser,
  SessionValidationOptions,
  SessionErrorDetails,
} from '../../types/session';
import type { User } from '@supabase/supabase-js';

/**
 * Get server session with extended user data
 * @param options - Session validation options
 * @returns Server session result
 */
export async function getServerSession(
  options?: SessionValidationOptions
): Promise<ServerSessionResult> {
  const supabase = await createClient();

  try {
    // Get current user (more secure than getSession)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return {
        user: null,
        session: null,
        error: userError.message,
        isAuthenticated: false,
        isEmailVerified: false,
        hasCompletedOnboarding: false,
        hasOrganization: false,
      };
    }

    if (!user) {
      return {
        user: null,
        session: null,
        error: null,
        isAuthenticated: false,
        isEmailVerified: false,
        hasCompletedOnboarding: false,
        hasOrganization: false,
      };
    }

    // Fetch extended user data
    const extendedUser = await fetchExtendedUserData(supabase, user);

    // Validate requirements
    const isEmailVerified = !!extendedUser.email_confirmed_at;
    const hasCompletedOnboarding =
      !!extendedUser.organization?.onboarding_completed;
    const hasOrganization = !!extendedUser.organization;

    // Check validation requirements
    let error: string | null = null;
    if (options?.requireEmailVerification && !isEmailVerified) {
      error = 'Email verification required';
    } else if (options?.requireOnboarding && !hasCompletedOnboarding) {
      error = 'Onboarding completion required';
    } else if (options?.requireOrganization && !hasOrganization) {
      error = 'Organization membership required';
    }

    return {
      user: extendedUser,
      session: null, // We don't need session object when using getUser()
      error,
      isAuthenticated: true,
      isEmailVerified,
      hasCompletedOnboarding,
      hasOrganization,
      organization: extendedUser.organization || null,
      organizationMembership: extendedUser.organizationMembership || null,
    };
  } catch (error) {
    console.error('Server session error:', error);
    return {
      user: null,
      session: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      isAuthenticated: false,
      isEmailVerified: false,
      hasCompletedOnboarding: false,
      hasOrganization: false,
    };
  }
}

/**
 * Fetch extended user data with profile and organization
 */
async function fetchExtendedUserData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User
): Promise<ExtendedUser> {
  try {
    // Try to get cached profile first
    const cachedProfile = await getCachedUserProfile(user.id);

    let profile = cachedProfile;
    let organization: ExtendedUser['organization'] = null;
    let organizationMembership: ExtendedUser['organizationMembership'] = null;

    // Fetch user profile if not cached
    if (!profile) {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      profile = profileData || null;

      // Cache the profile
      if (profile) {
        await cacheUserProfile(user.id, profile);
      }
    }

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

    if (orgMembership?.organizations) {
      organization =
        orgMembership.organizations as ExtendedUser['organization'];
      organizationMembership =
        orgMembership as ExtendedUser['organizationMembership'];

      // Cache the organization
      if (organization) {
        await cacheOrganization(organization.id, organization);
      }
    }

    return {
      ...user,
      profile,
      organization,
      organizationMembership,
    };
  } catch (error) {
    console.error('Error fetching extended user data:', error);
    return user as ExtendedUser;
  }
}

/**
 * Require authenticated session with redirect
 * @param options - Session validation options
 * @returns Server session result (never returns null due to redirects)
 */
export async function requireServerSession(
  options?: SessionValidationOptions
): Promise<ServerSessionResult> {
  const result = await getServerSession(options);

  // Redirect if not authenticated
  if (!result.isAuthenticated) {
    redirect('/login');
  }

  // Redirect based on validation requirements
  if (options?.requireEmailVerification && !result.isEmailVerified) {
    redirect('/verify-email');
  }

  if (options?.requireOnboarding && !result.hasCompletedOnboarding) {
    redirect('/onboarding');
  }

  if (options?.requireOrganization && !result.hasOrganization) {
    redirect('/onboarding');
  }

  // Redirect to custom path if specified
  if (options?.redirectTo) {
    redirect(options.redirectTo);
  }

  return result;
}

/**
 * Require authenticated session for dashboard
 * @returns Server session result with dashboard requirements
 */
export async function requireDashboardSession(): Promise<ServerSessionResult> {
  return requireServerSession({
    requireEmailVerification: true,
    requireOnboarding: true,
    requireOrganization: true,
  });
}

/**
 * Require authenticated session for onboarding
 * @returns Server session result with onboarding requirements
 */
export async function requireOnboardingSession(): Promise<ServerSessionResult> {
  return requireServerSession({
    requireEmailVerification: true,
    requireOrganization: true,
  });
}

/**
 * Get session for public pages (with optional redirect)
 * @param redirectIfAuthenticated - Redirect to dashboard if authenticated
 * @returns Server session result
 */
export async function getPublicSession(
  redirectIfAuthenticated: boolean = true
): Promise<ServerSessionResult> {
  const result = await getServerSession();

  if (redirectIfAuthenticated && result.isAuthenticated) {
    if (!result.isEmailVerified) {
      redirect('/verify-email');
    } else if (!result.hasCompletedOnboarding) {
      redirect('/onboarding');
    } else {
      redirect('/dashboard');
    }
  }

  return result;
}

/**
 * Validate session and return error details
 * @param session - Session result to validate
 * @param options - Validation options
 * @returns Error details if validation fails
 */
export function validateSessionRequirements(
  session: ServerSessionResult,
  options?: SessionValidationOptions
): SessionErrorDetails | null {
  if (!session.isAuthenticated) {
    return {
      type: 'UNAUTHENTICATED',
      message: 'Authentication required',
      redirectTo: '/login',
    };
  }

  if (options?.requireEmailVerification && !session.isEmailVerified) {
    return {
      type: 'EMAIL_NOT_VERIFIED',
      message: 'Email verification required',
      redirectTo: '/verify-email',
    };
  }

  if (options?.requireOnboarding && !session.hasCompletedOnboarding) {
    return {
      type: 'ONBOARDING_INCOMPLETE',
      message: 'Onboarding completion required',
      redirectTo: '/onboarding',
    };
  }

  if (options?.requireOrganization && !session.hasOrganization) {
    return {
      type: 'NO_ORGANIZATION',
      message: 'Organization membership required',
      redirectTo: '/onboarding',
    };
  }

  return null;
}

/**
 * Handle session errors with appropriate redirects
 * @param error - Session error details
 */
export function handleSessionError(error: SessionErrorDetails): never {
  redirect(error.redirectTo || '/login');
}
