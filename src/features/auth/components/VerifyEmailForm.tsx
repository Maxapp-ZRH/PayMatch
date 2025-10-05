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
import { showToast } from '@/lib/toast';
import { CheckCircle, Mail, Loader2 } from 'lucide-react';
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
  const router = useRouter();
  const supabase = createClient();

  // Initialize UI state based on props (no auto-send since registration already sends email)
  useEffect(() => {
    // If no email provided but showResend is true, show email input
    if (showResend && !isVerified && !currentEmail) {
      setNeedsEmailInput(true);
      setShowResendOptions(true);
    }
  }, [showResend, isVerified, currentEmail]);

  // Show resend options after 60 seconds (for manual resend)
  useEffect(() => {
    if (showResend && !isVerified) {
      setShowResendOptions(false);
      setResendCooldown(60); // Start 60-second countdown

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
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        // For now, we'll rely on the user clicking the verification link
        // which will redirect them to the auth callback and then to the appropriate page
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
      showToast.error(
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
        showToast.success('Verification email sent!', pendingResult.message);
        setResendCooldown(60); // 60 second cooldown after successful resend
        return;
      }

      // If pending registration resend failed, try existing users as fallback
      // (in case the user was created but not verified)
      const existingUserResult = await resendVerificationEmail(emailToUse);

      if (existingUserResult.success) {
        showToast.success(
          'Verification email sent!',
          existingUserResult.message
        );
        setResendCooldown(60); // 60 second cooldown after successful resend
      } else {
        // Show the error from pending registration (more likely scenario)
        showToast.error(pendingResult.message);
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      showToast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  }, [currentEmail, emailInput]);

  if (isVerified) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Email Verified!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Your email has been verified successfully. Redirecting to dashboard...
        </p>
        <div className="mt-6">
          <Loader2 className="animate-spin h-6 w-6 text-cyan-500 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
          <Mail className="h-6 w-6 text-teal-600" />
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
            <Loader2 className="animate-spin h-4 w-4 text-cyan-500 mr-2" />
            Checking verification status...
          </div>
        </div>
      )}
    </div>
  );
}
