/**
 * User Operations
 *
 * Database operations for user management.
 * Handles user creation, updates, and queries.
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { User } from '@supabase/supabase-js';

export interface UserSearchResult {
  user: User | null;
  error: string | null;
}

/**
 * Find user by email using admin client
 */
export async function findUserByEmail(
  email: string
): Promise<UserSearchResult> {
  try {
    const { data: users, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      return {
        user: null,
        error: `Failed to search for user: ${listError.message}`,
      };
    }

    const user = users?.users?.find((u) => u.email === email);

    return {
      user: user || null,
      error: null,
    };
  } catch (error) {
    console.error('Error finding user by email:', error);
    return {
      user: null,
      error: `Failed to search for user: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Check if user exists by email
 */
export async function userExistsByEmail(email: string): Promise<boolean> {
  try {
    const { user, error } = await findUserByEmail(email);

    if (error) {
      console.error('Error checking if user exists:', error);
      // If there's an error checking, assume user doesn't exist to allow registration
      return false;
    }

    const exists = user !== null;
    return exists;
  } catch (error) {
    console.error('Exception in userExistsByEmail:', error);
    // If there's an exception, assume user doesn't exist to allow registration
    return false;
  }
}

/**
 * Check if user email is verified
 */
export async function isUserEmailVerified(email: string): Promise<boolean> {
  const { user } = await findUserByEmail(email);
  return user?.email_confirmed_at !== null;
}

/**
 * Get user metadata
 */
export async function getUserMetadata(
  email: string
): Promise<Record<string, unknown> | null> {
  const { user } = await findUserByEmail(email);
  return user?.user_metadata || null;
}

/**
 * Check if a user has a pending registration (not yet verified)
 * With Supabase Auth, this means checking if user exists but email is not confirmed
 * @param email - User's email address
 * @returns Object with hasPendingRegistration boolean and optional error
 */
export async function checkPendingRegistration(email: string): Promise<{
  hasPendingRegistration: boolean;
  error?: string;
}> {
  try {
    const { user, error } = await findUserByEmail(email);

    if (error) {
      return { hasPendingRegistration: false, error };
    }

    // User has pending registration if they exist but email is not confirmed
    const hasPendingRegistration =
      user !== null && user.email_confirmed_at === null;

    return { hasPendingRegistration };
  } catch (error) {
    return {
      hasPendingRegistration: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get pending registration data for an email
 * With Supabase Auth, this returns user data if they exist but email is not confirmed
 * @param email - User's email address
 * @returns User data or null if not found/verified
 */
export async function getPendingRegistration(email: string): Promise<{
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_metadata: Record<string, unknown>;
  created_at: string;
} | null> {
  try {
    const { user, error } = await findUserByEmail(email);

    if (error || !user || user.email_confirmed_at !== null) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      first_name: user.user_metadata?.first_name || null,
      last_name: user.user_metadata?.last_name || null,
      user_metadata: user.user_metadata || {},
      created_at: user.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Clean up expired pending registrations
 * With Supabase Auth, this is no longer needed as Supabase handles user lifecycle
 * @returns Always returns 0 as cleanup is handled by Supabase
 */
export async function cleanupExpiredPendingRegistrations(): Promise<{
  cleanedCount: number;
  error?: string;
}> {
  // Supabase Auth handles user lifecycle automatically
  // No manual cleanup needed
  return { cleanedCount: 0 };
}
