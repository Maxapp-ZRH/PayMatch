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
import { handleAuthPageLogic } from '@/features/auth/helpers';

export const metadata: Metadata = {
  title: 'Reset Password - PayMatch',
  description: 'Set a new password for your PayMatch account.',
};

export default async function ResetPassword() {
  // Handle auth page logic with common patterns
  const { redirectUrl, shouldRedirect } = await handleAuthPageLogic();

  if (shouldRedirect) {
    redirect(redirectUrl);
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
      <ResetPasswordForm />
    </AuthLayout>
  );
}
