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
  resendVerificationEmail,
  resendPendingVerificationEmail,
} from '@/features/auth/server/actions/registration';

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
        // With deferred account creation, we don't check for user session here
        // because the user doesn't exist in Supabase Auth until after email verification
        // Instead, we'll check if the user has been verified by looking at the URL params
        // or by checking if they can access the dashboard

        // If we have a verified param in the URL, mark as verified
        if (emailVerified) {
          setIsVerified(true);
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        // For now, we'll rely on the user clicking the verification link
        // which will redirect them to the auth callback and then to the appropriate page
        console.log('🔍 VerifyEmailForm - Waiting for email verification...');
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately
    checkVerificationStatus();

    // Check every 10 seconds (less frequent since we're not checking auth state)
    const interval = setInterval(checkVerificationStatus, 10000);

    return () => clearInterval(interval);
  }, [supabase, router, emailVerified]);

  const handleResendVerification = async () => {
    if (!currentEmail) {
      authToasts.error(
        'No email address provided. Please go back to the registration page and try again.'
      );
      return;
    }

    setIsResending(true);

    try {
      // Since we're using deferred account creation, users coming from registration
      // will always have pending registrations. Try pending registration first.
      const pendingResult = await resendPendingVerificationEmail(currentEmail);

      if (pendingResult.success) {
        authToasts.success('Verification email sent!', pendingResult.message);
        return;
      }

      // If pending registration resend failed, try existing users as fallback
      // (in case the user was created but not verified)
      const existingUserResult = await resendVerificationEmail(currentEmail);

      if (existingUserResult.success) {
        authToasts.success(
          'Verification email sent!',
          existingUserResult.message
        );
      } else {
        // Show the error from pending registration (more likely scenario)
        authToasts.error(pendingResult.message);
      }
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
            "We've sent a verification link to your email address."
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
            {currentEmail ? (
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
            ) : (
              <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  No email address found. Please go back to the registration
                  page to start over.
                </p>
                <Button
                  onClick={() => router.push('/register')}
                  color="cyan"
                  className="w-full"
                >
                  Go to Registration
                </Button>
              </div>
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
