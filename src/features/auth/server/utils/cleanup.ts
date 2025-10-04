/**
 * Cleanup Utilities
 *
 * Utility functions for cleaning up expired data and maintaining database hygiene.
 */

import { cleanupExpiredPendingRegistrations } from './user-operations';

/**
 * Run all cleanup operations
 * This can be called periodically or on app startup
 */
export async function runCleanupOperations(): Promise<{
  success: boolean;
  results: {
    expiredRegistrations: {
      cleanedCount: number;
      error?: string;
    };
  };
}> {
  try {
    // Clean up expired pending registrations
    const expiredRegistrations = await cleanupExpiredPendingRegistrations();

    console.log('Cleanup completed:', {
      expiredRegistrations: expiredRegistrations.cleanedCount,
    });

    return {
      success: true,
      results: {
        expiredRegistrations,
      },
    };
  } catch (error) {
    console.error('Cleanup failed:', error);
    return {
      success: false,
      results: {
        expiredRegistrations: { cleanedCount: 0, error: 'Cleanup failed' },
      },
    };
  }
}
