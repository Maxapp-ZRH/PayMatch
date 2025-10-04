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
    console.log('Checking pending registration for email:', email);

    const { data, error } = await supabaseAdmin
      .from('pending_registrations')
      .select('id, email, expires_at')
      .eq('email', email)
      .single();

    if (error) {
      console.log('No pending registration found:', error.message);
      return { hasPendingRegistration: false };
    }

    // Check if not expired
    const isExpired = new Date() > new Date(data.expires_at);
    console.log('Pending registration found, expired:', isExpired);

    if (isExpired) {
      return { hasPendingRegistration: false };
    }

    console.log('Valid pending registration found');
    return { hasPendingRegistration: true };
  } catch (error) {
    console.log('Error checking pending registration:', error);
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
  password_hash: string;
  expires_at: string;
  created_at: string;
} | null> {
  try {
    console.log('Getting pending registration for email:', email);

    const { data, error } = await supabaseAdmin
      .from('pending_registrations')
      .select(
        'id, email, first_name, last_name, user_metadata, password_hash, expires_at, created_at'
      )
      .eq('email', email)
      .single();

    if (error) {
      console.log('No pending registration found:', error.message);
      return null;
    }

    // Check if not expired
    const isExpired = new Date() > new Date(data.expires_at);
    console.log('Pending registration found, expired:', isExpired);

    if (isExpired) {
      return null;
    }

    console.log('Valid pending registration found');
    return data;
  } catch (error) {
    console.log('Error getting pending registration:', error);
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
