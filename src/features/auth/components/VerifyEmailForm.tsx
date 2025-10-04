/**
 * Verify Email Form Component
 *
 * Handles email verification status checking and resending verification emails.
 * Shows verification status and provides resend functionality.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  firstName?: string | null;
}

export function VerifyEmailForm({
  userEmail,
  isVerified: emailVerified = false,
  showResend = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  firstName = null, // Passed from page component for personalized greeting
}: VerifyEmailFormProps) {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(emailVerified);
  const [currentEmail] = useState(userEmail || '');
  const [showResendOptions, setShowResendOptions] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [needsEmailInput, setNeedsEmailInput] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [hasAutoSent, setHasAutoSent] = useState(() => {
    // Check if we've already auto-sent for this email in this session
    if (typeof window !== 'undefined' && currentEmail) {
      const autoSentKey = `auto-sent-${currentEmail}`;
      return sessionStorage.getItem(autoSentKey) === 'true';
    }
    return false;
  });
  const router = useRouter();
  const supabase = createClient();

  // Auto-send verification email when user lands on verify-email page
  useEffect(() => {
    console.log(
      'VerifyEmailForm - showResend:',
      showResend,
      'currentEmail:',
      currentEmail,
      'isVerified:',
      isVerified
    );
    if (showResend && !isVerified && currentEmail && !hasAutoSent) {
      console.log('Auto-sending verification email for:', currentEmail);
      setHasAutoSent(true);

      // Store in sessionStorage to persist across page reloads
      if (typeof window !== 'undefined') {
        const autoSentKey = `auto-sent-${currentEmail}`;
        sessionStorage.setItem(autoSentKey, 'true');
      }

      // Auto-send without using the main handler to avoid circular dependency
      const autoSendEmail = async () => {
        setIsResending(true);
        try {
          const pendingResult =
            await resendPendingVerificationEmail(currentEmail);
          if (pendingResult.success) {
            authToasts.success(
              'Verification email sent!',
              pendingResult.message
            );
            setResendCooldown(60);
            return;
          }
          const existingUserResult =
            await resendVerificationEmail(currentEmail);
          if (existingUserResult.success) {
            authToasts.success(
              'Verification email sent!',
              existingUserResult.message
            );
            setResendCooldown(60);
          } else {
            authToasts.error(pendingResult.message);
          }
        } catch (error) {
          console.error('Error auto-sending verification:', error);
          authToasts.verificationError(
            'Failed to send verification email. Please try again.'
          );
        } finally {
          setIsResending(false);
        }
      };

      autoSendEmail();
    } else if (showResend && !isVerified && !currentEmail) {
      console.log('No email provided, setting needsEmailInput to true');
      setNeedsEmailInput(true);
      setShowResendOptions(true);
    }
  }, [showResend, isVerified, currentEmail, hasAutoSent]);

  // Show resend options after 60 seconds (for manual resend)
  useEffect(() => {
    if (showResend && !isVerified) {
      setShowResendOptions(false);

      const countdownTimeout = setTimeout(() => {
        setShowResendOptions(true);
      }, 60000); // 60 seconds

      return () => clearTimeout(countdownTimeout);
    }
  }, [showResend, isVerified]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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
          // Clear sessionStorage when verified
          if (typeof window !== 'undefined' && currentEmail) {
            const autoSentKey = `auto-sent-${currentEmail}`;
            sessionStorage.removeItem(autoSentKey);
          }
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
  }, [supabase, router, emailVerified, currentEmail]);

  const handleResendVerification = useCallback(async () => {
    const emailToUse = currentEmail || emailInput;

    if (!emailToUse) {
      authToasts.error(
        'Please enter your email address to resend verification.'
      );
      return;
    }

    setIsResending(true);

    try {
      // Since we're using deferred account creation, users coming from registration
      // will always have pending registrations. Try pending registration first.
      const pendingResult = await resendPendingVerificationEmail(emailToUse);

      if (pendingResult.success) {
        authToasts.success('Verification email sent!', pendingResult.message);
        setResendCooldown(60); // 60 second cooldown after successful resend
        return;
      }

      // If pending registration resend failed, try existing users as fallback
      // (in case the user was created but not verified)
      const existingUserResult = await resendVerificationEmail(emailToUse);

      if (existingUserResult.success) {
        authToasts.success(
          'Verification email sent!',
          existingUserResult.message
        );
        setResendCooldown(60); // 60 second cooldown after successful resend
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
  }, [currentEmail, emailInput]);

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
        {!isVerified && showResend && (
          <div className="mt-2 text-center">
            {needsEmailInput && (
              <div className="mb-3">
                <input
                  id="email-input"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mb-2">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
          </div>
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
            {showResend && (
              <Button
                onClick={handleResendVerification}
                disabled={
                  isResending ||
                  isChecking ||
                  resendCooldown > 0 ||
                  !showResendOptions ||
                  (needsEmailInput && !emailInput.trim())
                }
                color="cyan"
                className="w-full"
              >
                {isResending
                  ? 'Sending...'
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend verification email'}
              </Button>
            )}
            <p className="text-xs text-gray-500 text-center">
              Already verified?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-cyan-600 hover:text-cyan-700 underline transition-colors duration-200 hover:underline-offset-2 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn&apos;t receive the email? Check your spam folder.
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
