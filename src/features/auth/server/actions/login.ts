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
 * Clean up expired pending registrations
 * This can be called periodically or on login attempts
 */
export async function cleanupExpiredRegistrations(): Promise<{
  cleanedCount: number;
  error?: string;
}> {
  return await cleanupExpiredPendingRegistrations();
}
