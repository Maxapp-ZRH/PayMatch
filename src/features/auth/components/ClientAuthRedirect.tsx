/**
 * Client-Side Authentication Redirect Component
 *
 * Handles authentication redirects on the client side to avoid
 * server-side cookie usage that forces dynamic rendering.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function ClientAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const supabase = createClient();

        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.log('Auth check error:', error);
          return;
        }

        // If user is authenticated, redirect based on their status
        if (session?.user) {
          const user = session.user;

          // Check if email is verified
          if (!user.email_confirmed_at) {
            router.push('/verify-email');
            return;
          }

          // Check onboarding status from user metadata
          const hasCompletedOnboarding =
            user.user_metadata?.onboarding_completed === true;

          if (!hasCompletedOnboarding) {
            router.push('/onboarding');
          } else {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.log('Auth redirect error:', error);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // This component doesn't render anything
  return null;
}
