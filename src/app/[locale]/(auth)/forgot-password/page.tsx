/**
 * Forgot Password Page
 *
 * Handles password reset requests with email verification.
 * Users enter their email and receive a reset link via Resend.
 */

import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { handleAuthPageLogic } from '@/features/auth/helpers';

export const metadata: Metadata = {
  title: 'Forgot Password - PayMatch',
  description: 'Reset your PayMatch password to regain access to your account.',
};

export default async function ForgotPassword() {
  // Handle auth page logic with common patterns
  const { redirectUrl, shouldRedirect } = await handleAuthPageLogic();

  if (shouldRedirect) {
    redirect(redirectUrl);
  }

  return (
    <AuthLayout
      title="Forgot your password?"
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
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
