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
    console.log('Searching for user with email:', email);

    const { data: users, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      return {
        user: null,
        error: `Failed to search for user: ${listError.message}`,
      };
    }

    console.log('Found users:', users?.users?.length || 0);

    const user = users?.users?.find((u) => u.email === email);
    console.log('User found:', user ? 'Yes' : 'No');

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
    console.log('userExistsByEmail called for:', email);
    const { user, error } = await findUserByEmail(email);

    console.log('userExistsByEmail result - user:', user, 'error:', error);

    if (error) {
      console.error('Error checking if user exists:', error);
      // If there's an error checking, assume user doesn't exist to allow registration
      return false;
    }

    const exists = user !== null;
    console.log('userExistsByEmail returning:', exists);
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
