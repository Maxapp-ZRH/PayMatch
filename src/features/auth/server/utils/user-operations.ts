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
 * @param email - User's email address
 * @returns Object with hasPendingRegistration boolean and optional error
 */
export async function checkPendingRegistration(email: string): Promise<{
  hasPendingRegistration: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('pending_registrations')
      .select('id, email, expires_at')
      .eq('email', email)
      .single();

    if (error) {
      return { hasPendingRegistration: false };
    }

    // Check if not expired
    const isExpired = new Date() > new Date(data.expires_at);

    if (isExpired) {
      return { hasPendingRegistration: false };
    }
    return { hasPendingRegistration: true };
  } catch {
    return { hasPendingRegistration: false };
  }
}

/**
 * Get pending registration data for an email
 * @param email - User's email address
 * @returns Pending registration data or null if not found/expired
 */
export async function getPendingRegistration(email: string): Promise<{
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_metadata: Record<string, unknown>;
  expires_at: string;
  created_at: string;
} | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('pending_registrations')
      .select(
        'id, email, first_name, last_name, user_metadata, expires_at, created_at'
      )
      .eq('email', email)
      .single();

    if (error) {
      return null;
    }

    // Check if not expired
    const isExpired = new Date() > new Date(data.expires_at);

    if (isExpired) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Clean up expired pending registrations
 * @returns Number of cleaned up registrations
 */
export async function cleanupExpiredPendingRegistrations(): Promise<{
  cleanedCount: number;
  error?: string;
}> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('pending_registrations')
      .delete()
      .lt('expires_at', now)
      .select('id');

    if (error) {
      return { cleanedCount: 0, error: error.message };
    }

    return { cleanedCount: data?.length || 0 };
  } catch (error) {
    return {
      cleanedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
