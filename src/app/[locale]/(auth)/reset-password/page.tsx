/**
 * Reset Password Page
 *
 * Handles password reset with new password confirmation.
 * Users arrive here via email link and can set a new password.
 */

import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { PendingPasswordResetForm } from '@/features/auth/components/PendingPasswordResetForm';
import { handleAuthPageLogic } from '@/features/auth/helpers';
import { verifyResetToken } from '@/features/auth/server/actions/password-reset';
import { verifyPendingResetToken } from '@/features/auth/server/actions/pending-password-reset';

export const metadata: Metadata = {
  title: 'Reset Password - PayMatch',
  description: 'Set a new password for your PayMatch account.',
};

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  // Await searchParams as required by Next.js 15
  const resolvedSearchParams = await searchParams;

  // Handle auth page logic with common patterns
  const { redirectUrl, shouldRedirect } = await handleAuthPageLogic();

  if (shouldRedirect) {
    redirect(redirectUrl);
  }

  // Determine which type of password reset to show
  let resetType: 'regular' | 'pending' | 'unknown' = 'unknown';

  if (resolvedSearchParams.token) {
    try {
      // Check if it's a regular password reset token
      const regularResult = await verifyResetToken(resolvedSearchParams.token);
      if (regularResult.valid) {
        resetType = 'regular';
      } else {
        // Check if it's a pending password reset token
        const pendingResult = await verifyPendingResetToken(
          resolvedSearchParams.token
        );
        if (pendingResult.valid) {
          resetType = 'pending';
        }
      }
    } catch (error) {
      console.error('Error determining reset type:', error);
      resetType = 'unknown';
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle={
        <>
          Remember your password?{' '}
          <Link href="/login" className="text-red-500 hover:text-red-600">
            Sign in
          </Link>{' '}
          to your account.
        </>
      }
    >
      {resetType === 'regular' && <ResetPasswordForm />}
      {resetType === 'pending' && <PendingPasswordResetForm />}
      {resetType === 'unknown' && (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Invalid Reset Link
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <div className="mt-6">
            <Link
              href="/forgot-password"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
