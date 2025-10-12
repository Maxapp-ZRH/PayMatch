/**
 * Login Page
 *
 * User authentication page with Supabase Auth integration.
 * Handles login, password reset, and redirects to dashboard or onboarding.
 */

import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { createClient } from '@/lib/supabase/server';
import { checkAuthPageRedirect } from '@/features/auth/helpers/auth-helpers';

export const metadata: Metadata = {
  title: 'Sign In - PayMatch',
  description:
    'Sign in to your PayMatch account to manage your Swiss invoicing.',
};

interface LoginPageProps {
  searchParams: Promise<{
    redirectTo?: string;
    verified?: string;
    email?: string;
    message?: string;
  }>;
}

export default async function Login({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  // Check if user is already authenticated and handle redirects
  const redirectUrl = await checkAuthPageRedirect(
    supabase,
    resolvedSearchParams.redirectTo
  );
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-red-500 hover:text-red-600">
            Sign up
          </Link>{' '}
          to start invoicing.
        </>
      }
    >
      <LoginForm
        redirectTo={resolvedSearchParams.redirectTo}
        showVerifiedMessage={resolvedSearchParams.verified === 'true'}
        initialEmail={resolvedSearchParams.email}
        successMessage={resolvedSearchParams.message}
      />

      <div className="mt-6 text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Forgot your password?
        </Link>
      </div>
    </AuthLayout>
  );
}
