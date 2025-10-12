/**
 * Register Page
 *
 * User registration page with Supabase Auth integration.
 * Handles signup, email verification, and redirects to onboarding.
 */

import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { createClient } from '@/lib/supabase/server';
import { checkAuthPageRedirect } from '@/features/auth/helpers/auth-helpers';

export const metadata: Metadata = {
  title: 'Sign Up - PayMatch',
  description:
    'Create your PayMatch account to start Swiss invoicing with QR-bill compliance.',
};

export default async function Register() {
  const supabase = await createClient();

  // Check if user is already authenticated and handle redirects
  const redirectUrl = await checkAuthPageRedirect(supabase);
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return (
    <AuthLayout
      title="Create your PayMatch account"
      subtitle={
        <>
          Already registered?{' '}
          <Link href="/login" className="text-red-500 hover:text-red-600">
            Sign in
          </Link>{' '}
          to your account.
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
