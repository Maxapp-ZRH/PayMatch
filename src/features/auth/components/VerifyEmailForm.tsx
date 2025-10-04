/**
 * Verify Email Form Component
 *
 * Handles email verification status checking and resending verification emails.
 * Shows verification status and provides resend functionality.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/marketing_pages/Button';
import { authToasts } from '@/lib/toast';
import {
  userHasOrganizationClient,
  userHasCompletedOnboardingClient,
} from '../helpers/client-auth-helpers';

interface VerifyEmailFormProps {
  userEmail: string;
  isVerified?: boolean;
  showResend?: boolean;
}

export function VerifyEmailForm({
  userEmail,
  isVerified: emailVerified = false,
  showResend = false,
}: VerifyEmailFormProps) {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(emailVerified);
  const [currentEmail] = useState(userEmail || '');
  const router = useRouter();
  const supabase = createClient();

  // Check verification status periodically
  useEffect(() => {
    const checkVerificationStatus = async () => {
      setIsChecking(true);
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          // Only log as error if it's not the expected "Auth session missing" error
          if (!error.message.includes('Auth session missing')) {
            console.error('Error checking verification status:', error);
          }

          // Handle JWT error by clearing session
          if (
            error.message.includes('User from sub claim in JWT does not exist')
          ) {
            console.log(
              '🔍 VerifyEmailForm - Clearing stale session due to JWT error'
            );
            await supabase.auth.signOut();
            authToasts.warning(
              'Session expired',
              'Your session has expired. Please refresh the page and try again.'
            );
            // Don't return, continue with unauthenticated state
          } else if (error.message.includes('Auth session missing')) {
            // This is expected for unverified users - no action needed
            console.log(
              '🔍 VerifyEmailForm - No session (expected for unverified users)'
            );
          } else {
            return;
          }
        }

        if (user?.email_confirmed_at) {
          setIsVerified(true);

          // Check if user has organization and onboarding completed
          const hasOrg = await userHasOrganizationClient(user.id);
          const hasCompletedOnboarding = await userHasCompletedOnboardingClient(
            user.id
          );

          // Redirect based on completion status
          setTimeout(() => {
            if (!hasOrg) {
              // This shouldn't happen as organization is created during email verification
              router.push('/verify-email');
            } else if (!hasCompletedOnboarding) {
              router.push('/onboarding');
            } else {
              router.push('/dashboard');
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately
    checkVerificationStatus();

    // Check every 5 seconds
    const interval = setInterval(checkVerificationStatus, 5000);

    return () => clearInterval(interval);
  }, [supabase, router]);

  const handleResendVerification = async () => {
    setIsResending(true);

    try {
      // For pending registrations, we need to resend from the registration flow
      // This is a simplified version - in production you might want to store
      // the verification token and resend with the same token
      authToasts.warning(
        'Resend not available',
        'Please register again to receive a new verification email.'
      );
    } catch (error) {
      console.error('Error resending verification:', error);
      authToasts.verificationError(
        'Failed to resend verification email. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isVerified) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Email Verified!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Your email has been verified successfully. Redirecting to dashboard...
        </p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {isVerified ? 'Email verified successfully!' : 'Check your email'}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {isVerified ? (
            'Your email has been verified! You can now sign in to access your PayMatch account.'
          ) : currentEmail ? (
            <>
              We&apos;ve sent a verification link to{' '}
              <span className="font-medium text-gray-900">{currentEmail}</span>
            </>
          ) : (
            'We&apos;ve sent a verification link to your email address.'
          )}
        </p>
        {showResend && !isVerified && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Didn&apos;t receive the email?</strong> Check your spam
              folder or resend the verification email below.
            </p>
          </div>
        )}
        {!isVerified && (
          <p className="mt-1 text-xs text-gray-500">
            Click the link in the email to verify your account and access
            PayMatch.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {isVerified ? (
          <Button
            onClick={() => router.push('/login')}
            color="cyan"
            className="w-full"
          >
            Sign in to your account
          </Button>
        ) : (
          <>
            {currentEmail && (
              <Button
                onClick={handleResendVerification}
                disabled={isResending || isChecking}
                color="cyan"
                className={`w-full ${showResend ? 'ring-2 ring-red-200' : ''}`}
              >
                {isResending
                  ? 'Sending...'
                  : showResend
                    ? 'Resend verification email now'
                    : 'Resend verification email'}
              </Button>
            )}

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Sign out and use different email
            </Button>
          </>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn&apos;t receive the email? Check your spam folder or{' '}
          <button
            onClick={handleResendVerification}
            className="text-cyan-600 hover:text-cyan-700 font-medium"
            disabled={isResending}
          >
            try again
          </button>
        </p>
      </div>

      {isChecking && (
        <div className="text-center">
          <div className="inline-flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500 mr-2"></div>
            Checking verification status...
          </div>
        </div>
      )}
    </div>
  );
}
