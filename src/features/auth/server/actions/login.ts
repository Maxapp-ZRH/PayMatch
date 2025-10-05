/**
 * Login Server Actions
 *
 * Server-side actions for login operations including
 * checking pending registrations and cleaning up expired data.
 */

'use server';

import {
  checkPendingRegistration,
  cleanupExpiredPendingRegistrations,
  findUserByEmail,
} from '../utils/user-operations';

/**
 * Check if user has pending registration
 */
export async function checkUserPendingRegistration(email: string): Promise<{
  hasPendingRegistration: boolean;
  error?: string;
}> {
  return await checkPendingRegistration(email);
}

/**
 * Check if user exists in Supabase Auth
 */
export async function checkUserExistsInAuth(email: string): Promise<{
  exists: boolean;
  error?: string;
}> {
  try {
    const { user, error } = await findUserByEmail(email);

    if (error) {
      return { exists: false, error: error };
    }

    return { exists: !!user };
  } catch (error) {
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Clean up expired pending registrations
 * This can be called periodically or on login attempts
 */
export async function cleanupExpiredRegistrations(): Promise<{
  cleanedCount: number;
  error?: string;
}> {
  return await cleanupExpiredPendingRegistrations();
}
