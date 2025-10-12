/**
 * Reset Password Page
 *
 * Handles password reset with Supabase magic links.
 * Users arrive here via magic link and can set a new password.
 */

import { type Metadata } from 'next';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { Button } from '@/components/marketing_pages/Button';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - PayMatch',
  description: 'Set a new password for your PayMatch account.',
};

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    type?: string;
  }>;
}

export default async function ResetPassword({
  searchParams,
}: ResetPasswordPageProps) {
  const resolvedSearchParams = await searchParams;
  const { token, type } = resolvedSearchParams;

  console.log('=== RESET PASSWORD PAGE DEBUG ===');
  console.log('Token from URL:', token);
  console.log('Type from URL:', type);

  // For password reset, we don't need a session - just the token from URL
  const hasValidToken = !!token && type === 'recovery';

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
      {hasValidToken ? (
        <ResetPasswordForm token={token} />
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
              <Button color="swiss" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
