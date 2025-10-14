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
import { AuthToast } from '@/lib/toast';
import { CheckCircle, Mail, Loader2 } from 'lucide-react';
import { resendVerificationEmail } from '@/features/auth/server/actions/registration';

interface VerifyEmailFormProps {
  userEmail: string;
  isVerified?: boolean;
  showResend?: boolean;
  immediateResend?: boolean;
  redirectTo?: string;
}

export function VerifyEmailForm({
  userEmail,
  isVerified: emailVerified = false,
  showResend = false,
  immediateResend = false,
  redirectTo,
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
    // If no email provided but showResend/immediateResend is true, show email input
    if ((showResend || immediateResend) && !isVerified && !currentEmail) {
      setNeedsEmailInput(true);
      setShowResendOptions(true);
    }
  }, [showResend, immediateResend, isVerified, currentEmail]);

  // Real-time verification detection using Supabase Auth state changes
  useEffect(() => {
    if (!currentEmail || isVerified) return;

    console.log(
      'Setting up real-time verification detection for:',
      currentEmail
    );

    // Listen for auth state changes in real-time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', {
        event,
        hasSession: !!session,
        userEmail: session?.user?.email,
      });

      if (event === 'SIGNED_IN' && session?.user?.email === currentEmail) {
        console.log('User verified on another device!');
        setIsVerified(true);
        AuthToast.emailVerification.success();

        // Redirect directly to onboarding (not login)
        setTimeout(() => {
          router.push('/onboarding');
        }, 2000);
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [currentEmail, isVerified, supabase, router]);

  // Show resend options after 60 seconds (for manual resend) or immediately (for user-initiated flows)
  useEffect(() => {
    if ((showResend || immediateResend) && !isVerified) {
      if (immediateResend) {
        // User-initiated flow (login/forgot-password) - show resend immediately
        setShowResendOptions(true);
        setResendCooldown(0);
      } else {
        // Registration flow - 60-second cooldown
        setShowResendOptions(false);
        setResendCooldown(60); // Start 60-second countdown

        const countdownTimeout = setTimeout(() => {
          setShowResendOptions(true);
        }, 60000); // 60 seconds

        return () => clearTimeout(countdownTimeout);
      }
    }
  }, [showResend, immediateResend, isVerified]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle automatic redirect after verification
  useEffect(() => {
    if (isVerified && redirectTo === 'onboarding') {
      // Show success message for 2 seconds, then redirect to onboarding
      const redirectTimer = setTimeout(() => {
        router.push('/onboarding');
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isVerified, redirectTo, router]);

  // Check verification status periodically and listen for cross-tab communication
  useEffect(() => {
    const checkVerificationStatus = async () => {
      setIsChecking(true);
      try {
        // If we have a verified param in the URL, mark as verified
        if (emailVerified) {
          setIsVerified(true);
          // Redirect to onboarding after a short delay
          setTimeout(() => {
            router.push('/onboarding');
          }, 2000);
          return;
        }

        // Check if user has completed verification in another tab
        // This happens when user clicks verification link and sets password
        const verificationComplete = localStorage.getItem(
          'email-verification-complete'
        );
        const verificationEmail = localStorage.getItem(
          'email-verification-email'
        );

        if (
          verificationComplete === 'true' &&
          verificationEmail === currentEmail
        ) {
          setIsVerified(true);
          // Clear the localStorage flag
          localStorage.removeItem('email-verification-complete');
          localStorage.removeItem('email-verification-email');

          // Show success message and redirect to onboarding
          AuthToast.emailVerification.success();
          setTimeout(() => {
            router.push('/onboarding');
          }, 2000);
          return;
        }

        // Check if user session exists (user has completed verification and password setup)
        if (currentEmail) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user && user.email === currentEmail && user.email_confirmed_at) {
            setIsVerified(true);
            AuthToast.emailVerification.success();
            setTimeout(() => {
              router.push('/onboarding');
            }, 2000);
            return;
          }
        }

        // Check if user has been verified from another device by checking pending registrations
        // This handles the case where user verifies email on mobile/another device
        if (currentEmail) {
          try {
            const { data: pendingRegistrations } = await supabase
              .from('pending_registrations')
              .select('email, verified_at, verified')
              .eq('email', currentEmail)
              .eq('verified', true)
              .single();

            if (pendingRegistrations && pendingRegistrations.verified_at) {
              setIsVerified(true);
              AuthToast.emailVerification.success();
              setTimeout(() => {
                router.push('/onboarding');
              }, 2000);
              return;
            }
          } catch (error) {
            // Ignore errors - this is just a check for cross-device verification
            console.log('No verified pending registration found:', error);
          }

          // Check if user has been verified from another device by checking if they can sign in
          // This is a lightweight way to detect cross-device verification
          try {
            // Try to get user session - if user exists and is verified, this will work
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (
              user &&
              user.email === currentEmail &&
              user.email_confirmed_at
            ) {
              setIsVerified(true);
              AuthToast.emailVerification.success();
              setTimeout(() => {
                router.push('/onboarding');
              }, 2000);
              return;
            }
          } catch (error) {
            // Ignore errors - this is just a check for cross-device verification
            console.log('Could not check user session:', error);
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately
    checkVerificationStatus();

    // Check every 10 seconds as fallback (real-time detection handles most cases)
    const interval = setInterval(checkVerificationStatus, 10000);

    // Listen for storage events (cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'email-verification-complete' && e.newValue === 'true') {
        const verificationEmail = localStorage.getItem(
          'email-verification-email'
        );
        if (verificationEmail === currentEmail) {
          setIsVerified(true);
          localStorage.removeItem('email-verification-complete');
          localStorage.removeItem('email-verification-email');
          AuthToast.emailVerification.successWithRedirect();
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [supabase, router, emailVerified, currentEmail]);

  const handleResendVerification = useCallback(async () => {
    const emailToUse = currentEmail || emailInput;

    if (!emailToUse) {
      AuthToast.emailVerification.emailRequired();
      return;
    }

    setIsResending(true);

    try {
      // Use Supabase Auth resend verification
      const result = await resendVerificationEmail(emailToUse);

      if (result.success) {
        AuthToast.emailVerification.resendSuccess();
        setResendCooldown(60); // 60 second cooldown after successful resend
        setShowResendOptions(false); // Hide resend button during cooldown
      } else {
        AuthToast.emailVerification.resendFailed();
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      AuthToast.emailVerification.unexpectedError();
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
          {redirectTo === 'onboarding'
            ? 'Your email has been verified successfully. Redirecting to account setup...'
            : 'Your email has been verified successfully. Redirecting to login...'}
        </p>
        <div className="mt-6">
          <Loader2 className="animate-spin h-6 w-6 text-cyan-500 mx-auto" />
        </div>
        <div className="mt-4">
          <Button
            onClick={() =>
              router.push(
                redirectTo === 'onboarding' ? '/onboarding' : '/login'
              )
            }
            color="swiss"
            className="w-full"
          >
            {redirectTo === 'onboarding' ? 'Continue to Setup' : 'Go to Login'}
          </Button>
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
            <>We&apos;ve sent a verification link to your email address.</>
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
            color="swiss"
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
                color="swiss"
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
