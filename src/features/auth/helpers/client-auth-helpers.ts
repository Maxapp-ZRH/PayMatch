/**
 * Client-Side Authentication Helper Functions
 *
 * Client-side authentication utilities that can be used in React components.
 * These functions use the browser Supabase client.
 */

import { createClient } from '@/lib/supabase/client';
import type { User, AuthError } from '@supabase/supabase-js';

/**
 * Safely get authenticated user with session refresh (client-side)
 * @returns Promise<{ user: User | null; error: AuthError | null }>
 */
async function getAuthenticatedUserSafely(): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  const supabase = createClient();

  try {
    // First try to get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      // If session error, try to refresh
      console.log('Session error, attempting refresh:', sessionError.message);
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
          return { user: null, error: null };
        }
        return { user: null, error: refreshError };
      }

      if (refreshedSession?.user) {
        return { user: refreshedSession.user, error: null };
      }
    }

    if (session?.user) {
      return { user: session.user, error: null };
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
        return { user: null, error: null };
      }
      return { user: null, error };
    }

    return { user, error: null };
  } catch (err) {
    console.error('Auth error:', err);
    return { user: null, error: err as AuthError };
  }
}

/**
 * Check if user has an organization (client-side)
 * @param userId - User's ID
 * @returns Promise<boolean>
 */
export async function userHasOrganizationClient(
  userId: string
): Promise<boolean> {
  try {
    const supabase = createClient();

    // Check if user is authenticated with session refresh
    const { user, error: authError } = await getAuthenticatedUserSafely();

    if (authError || !user) {
      return false;
    }

    // First check if user has a profile (this should work with RLS)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return false;
    }

    // Use the database function that bypasses RLS to check organization membership
    const { data, error } = await supabase.rpc('user_has_organization', {
      user_uuid: userId,
    });

    if (error) {
      console.error('Error checking user organization (function):', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return false;
    }

    const result = Boolean(data);
    return result;
  } catch (error) {
    console.error('Exception in userHasOrganizationClient:', error);
    return false;
  }
}

/**
 * Check if user has completed onboarding (client-side)
 * @param userId - User's ID
 * @returns Promise<boolean>
 */
export async function userHasCompletedOnboardingClient(
  userId: string
): Promise<boolean> {
  try {
    const supabase = createClient();

    // Check if user is authenticated with session refresh
    const { user, error: authError } = await getAuthenticatedUserSafely();

    if (authError || !user) {
      return false;
    }

    // Check onboarding status from organizations table (single source of truth)
    const { data: orgMembership, error } = await supabase
      .from('organization_users')
      .select(
        `
        org_id,
        organizations!inner(onboarding_completed)
      `
      )
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }

    const org = orgMembership?.organizations as unknown as
      | { onboarding_completed: boolean }
      | undefined;
    return Boolean(org?.onboarding_completed);
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

/**
 * Get user's primary organization (client-side)
 * @param userId - User's ID
 * @returns Promise<{ id: string; name: string; plan: string } | null>
 */
export async function getUserPrimaryOrganizationClient(
  userId: string
): Promise<{
  id: string;
  name: string;
  plan: string;
} | null> {
  try {
    const supabase = createClient();

    // Check if user is authenticated with session refresh
    const { user, error: authError } = await getAuthenticatedUserSafely();

    if (authError || !user) {
      return null;
    }

    // First get the organization user record
    const { data: orgUser, error: orgUserError } = await supabase
      .from('organization_users')
      .select('org_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .eq('role', 'owner')
      .limit(1)
      .single();

    if (orgUserError || !orgUser) {
      console.error(
        'Error getting user organization membership:',
        orgUserError
      );
      return null;
    }

    // Then get the organization details
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, plan')
      .eq('id', orgUser.org_id)
      .single();

    if (orgError || !organization) {
      console.error('Error getting organization details:', orgError);
      return null;
    }

    return {
      id: organization.id,
      name: organization.name,
      plan: organization.plan,
    };
  } catch (error) {
    console.error('Error getting user organization:', error);
    return null;
  }
}
