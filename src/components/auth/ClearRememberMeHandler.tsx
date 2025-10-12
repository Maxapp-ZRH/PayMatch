/**
 * Clear Remember Me Handler
 *
 * Client component that clears the remember me flag when redirected
 * from email verification to prevent new users from being remembered.
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { clearAuthData } from '@/features/auth/helpers/auth-helpers';

export function ClearRememberMeHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Clear remember me flag if this is a new user verification
    const clearRememberMe = searchParams.get('clearRememberMe');
    if (clearRememberMe === 'true') {
      console.log('Clearing remember me flag for new user verification');
      clearAuthData();
    }
  }, [searchParams]);

  // This component doesn't render anything
  return null;
}
