/**
 * Core Authentication Server Actions
 *
 * Handles core authentication operations like login and logout.
 * This module focuses on essential auth operations.
 */

'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Logout the current user
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Failed to logout. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Logged out successfully.',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during logout.',
    };
  }
}
