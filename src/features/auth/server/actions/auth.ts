/**
 * Core Authentication Server Actions
 *
 * Handles core authentication operations like login and logout.
 * This module focuses on essential auth operations.
 */

'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Logout the current user and clear all sessions
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();

    // Get current user before logout for logging
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.log(`Logging out user: ${user.email} (${user.id})`);
    }

    // Sign out from all sessions (this clears the current session)
    const { error } = await supabase.auth.signOut({
      scope: 'global', // This signs out from all sessions across all devices
    });

    if (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Failed to logout. Please try again.',
      };
    }

    console.log('User logged out successfully from all sessions');
    return {
      success: true,
      message: 'Successfully logged out.',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during logout.',
    };
  }
}
