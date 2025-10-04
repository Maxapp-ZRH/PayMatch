/**
 * Client-Side Authentication Helper Functions
 *
 * Client-side authentication utilities that can be used in React components.
 * These functions use the browser Supabase client.
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Check if user has an organization (client-side)
 * @param userId - User's ID
 * @returns Promise<boolean>
 */
export async function userHasOrganizationClient(
  userId: string
): Promise<boolean> {
  try {
    console.log('userHasOrganizationClient called with userId:', userId);
    const supabase = createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('Auth check result:', { user: user?.id, authError });

    if (authError || !user) {
      console.log('No authenticated user found');
      return false;
    }

    // First check if user has a profile (this should work with RLS)
    console.log('Checking user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    console.log('Profile check result:', { profile, profileError });

    if (profileError || !profile) {
      console.log('No user profile found, user likely not fully set up');
      return false;
    }

    console.log(
      'Querying organization membership using database function for userId:',
      userId
    );

    // Use the database function that bypasses RLS to check organization membership
    const { data, error } = await supabase.rpc('user_has_organization', {
      user_uuid: userId,
    });

    console.log('Organization function result:', { data, error });

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
    console.log('Final organization check result (function):', result);
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

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return false;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }

    return Boolean(data?.onboarding_completed);
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
