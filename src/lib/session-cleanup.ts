/**
 * Session Cleanup Utilities
 *
 * Handles cleanup of invalid or expired sessions on the client side.
 * Provides utilities to clear auth data when refresh tokens are invalid.
 */

import { createClient } from './supabase/client';

/**
 * Clear all authentication data from localStorage and Supabase
 * This should be called when refresh tokens are invalid or expired
 */
export async function clearInvalidSession(): Promise<void> {
  try {
    const supabase = createClient();

    // Sign out from Supabase (this will clear all auth data)
    await supabase.auth.signOut();

    // Clear any additional auth-related localStorage items
    const authKeys = [
      'sb-', // Supabase keys
      'supabase.auth.token',
      'email-verification-',
      'password-reset-',
      'magic-link-',
    ];

    // Get all localStorage keys and remove auth-related ones
    const allKeys = Object.keys(localStorage);
    authKeys.forEach((prefix) => {
      allKeys.forEach((key) => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    });

    console.log('Invalid session cleared successfully');
  } catch (error) {
    console.error('Error clearing invalid session:', error);
  }
}

/**
 * Check if an error is a refresh token error
 */
export function isRefreshTokenError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'code' in error) {
    const authError = error as { code: string; message: string };
    return (
      authError.code === 'refresh_token_not_found' ||
      authError.code === 'invalid_grant' ||
      authError.message?.includes('Invalid Refresh Token') ||
      authError.message?.includes('refresh_token_not_found')
    );
  }
  return false;
}

/**
 * Handle refresh token errors by clearing the session
 */
export async function handleRefreshTokenError(error: unknown): Promise<void> {
  if (isRefreshTokenError(error)) {
    console.log('Refresh token error detected, clearing session');
    await clearInvalidSession();
  }
}
