/**
 * Email Verification Success Page
 *
 * Shows a success message after email verification and automatically
 * closes the tab after 2 seconds, then redirects the parent window to onboarding.
 * Uses the same design language as marketing pages.
 */

'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CirclesBackground } from '@/components/marketing_pages/CirclesBackground';
import { Button } from '@/components/marketing_pages/Button';
import { ClearRememberMeHandler } from '@/features/auth/components/ClearRememberMeHandler';
import { createClient } from '@/lib/supabase/client';

export default function VerificationSuccess() {
  const [countdown, setCountdown] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthenticationAndRedirect = async (retryCount = 0) => {
      try {
        const supabase = createClient();

        // Check if user is authenticated
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error checking session:', error);
          setIsCheckingAuth(false);
          return;
        }

        if (session?.user) {
          console.log('User is authenticated:', session.user.email);
          setIsAuthenticated(true);

          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single();

          const hasCompletedOnboarding = profile?.onboarding_completed;
          const redirectPath = hasCompletedOnboarding
            ? '/dashboard'
            : '/onboarding';

          console.log('Redirecting to:', redirectPath);

          // Redirect after a short delay to show success message
          setTimeout(() => {
            router.push(redirectPath);
          }, 2000);
        } else {
          // If no session found and we haven't retried too many times, wait and retry
          if (retryCount < 3) {
            console.log(
              `No session found, retrying in 1 second... (attempt ${retryCount + 1}/3)`
            );
            setTimeout(() => {
              checkAuthenticationAndRedirect(retryCount + 1);
            }, 1000);
            return;
          }

          console.log(
            'User is not authenticated after retries, redirecting to login'
          );
          setIsAuthenticated(false);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } finally {
        if (retryCount >= 3 || isAuthenticated) {
          setIsCheckingAuth(false);
        }
      }
    };

    // Add a small delay before checking authentication to allow session to sync
    setTimeout(() => {
      checkAuthenticationAndRedirect();
    }, 500);
  }, [router]);

  useEffect(() => {
    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
    };
  }, []);

  return (
    <main className="flex min-h-full overflow-hidden pt-16 sm:py-28">
      {/* Clear remember me flag if this is a new user verification */}
      <ClearRememberMeHandler />

      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center justify-center space-x-3"
        >
          <Image
            src="/logo.png"
            alt="PayMatch"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="text-2xl font-bold text-gray-900">PayMatch</span>
        </Link>

        <div className="relative mt-12 sm:mt-16">
          <CirclesBackground
            width="1090"
            height="1090"
            className="absolute -top-7 left-1/2 -z-10 h-[788px] -translate-x-1/2 mask-[linear-gradient(to_bottom,white_20%,transparent_75%)] stroke-gray-300/30 sm:-top-9 sm:h-auto"
          />
          <h1 className="text-center text-2xl font-medium tracking-tight text-gray-900">
            Email Verified Successfully!
          </h1>
          <p className="mt-3 text-center text-lg text-gray-600">
            {isCheckingAuth
              ? 'Verifying your account...'
              : isAuthenticated
                ? 'Your email has been verified and you are now signed in. Redirecting...'
                : 'Your email has been verified. Redirecting to login...'}
          </p>
        </div>

        <div className="-mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            {/* Countdown Timer */}
            {!isCheckingAuth && (
              <div className="mt-8">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  <span className="text-sm text-gray-500">
                    Redirecting in {countdown} second
                    {countdown !== 1 ? 's' : ''}
                    ...
                  </span>
                </div>
              </div>
            )}

            {/* Manual redirect button as fallback */}
            {!isCheckingAuth && (
              <div className="mt-8">
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      // Check onboarding status and redirect accordingly
                      const supabase = createClient();
                      supabase.auth
                        .getSession()
                        .then(({ data: { session } }) => {
                          if (session?.user) {
                            supabase
                              .from('profiles')
                              .select('onboarding_completed')
                              .eq('id', session.user.id)
                              .single()
                              .then(({ data: profile }) => {
                                const redirectPath =
                                  profile?.onboarding_completed
                                    ? '/dashboard'
                                    : '/onboarding';
                                router.push(redirectPath);
                              });
                          } else {
                            router.push('/login');
                          }
                        });
                    } else {
                      router.push('/login');
                    }
                  }}
                  color="swiss"
                  className="w-full"
                >
                  {isAuthenticated ? 'Continue to Dashboard' : 'Go to Login'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
