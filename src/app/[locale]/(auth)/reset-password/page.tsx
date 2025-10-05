/**
 * Reset Password Page
 *
 * Handles password reset with new password confirmation.
 * Users arrive here via email link and can set a new password.
 */

import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { XCircle } from 'lucide-react';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { Button } from '@/components/marketing_pages/Button';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { handleAuthPageLogic } from '@/features/auth/helpers';
import { verifyResetToken } from '@/features/auth/server/actions/password-reset';

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

  // Check if it's a valid password reset token
  let isValidToken = false;

  if (resolvedSearchParams.token) {
    try {
      const result = await verifyResetToken(resolvedSearchParams.token);
      isValidToken = result.valid;
    } catch (error) {
      console.error('Error verifying reset token:', error);
      isValidToken = false;
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
      {isValidToken ? (
        <ResetPasswordForm />
      ) : (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Invalid Reset Link
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <div className="mt-6">
            <Link href="/forgot-password">
              <Button color="cyan" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
