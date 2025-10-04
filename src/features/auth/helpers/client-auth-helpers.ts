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
    const supabase = createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return false;
    }

    // Query organization membership
    const { data, error } = await supabase
      .from('organization_users')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1);

    if (error) {
      console.error('Error checking user organization:', error);
      return false;
    }

    return Boolean(data && data.length > 0);
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
