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

import { CirclesBackground } from '@/components/marketing_pages/CirclesBackground';
import { Button } from '@/components/marketing_pages/Button';
import { ClearRememberMeHandler } from '@/components/auth/ClearRememberMeHandler';

export default function VerificationSuccess() {
  const [countdown, setCountdown] = useState(2);

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

    // Auto-close tab after 2 seconds
    const closeTimer = setTimeout(() => {
      // Try to close the current tab/window
      window.close();

      // If window.close() doesn't work (some browsers block it),
      // redirect to onboarding as fallback
      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 100);
    }, 2000);

    // Also try to redirect the parent window to onboarding
    // This works if the verification was opened in a popup or new tab
    try {
      if (window.opener) {
        window.opener.location.href = '/onboarding';
      }
    } catch (error) {
      // Ignore cross-origin errors
      console.log('Could not redirect parent window:', error);
    }

    return () => {
      clearTimeout(closeTimer);
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
            Your email has been verified. This window will close automatically
            and redirect you to the onboarding process.
          </p>
        </div>

        <div className="-mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            {/* Countdown Timer */}
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                <span className="text-sm text-gray-500">
                  Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}
                  ...
                </span>
              </div>
            </div>

            {/* Manual redirect button as fallback */}
            <div className="mt-8">
              <Button
                onClick={() => {
                  window.close();
                  setTimeout(() => {
                    window.location.href = '/onboarding';
                  }, 100);
                }}
                color="swiss"
                className="w-full"
              >
                Continue to Onboarding
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
