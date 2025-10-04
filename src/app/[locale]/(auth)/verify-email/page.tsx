/**
 * Email Verification Page
 *
 * Dedicated page for users who need to verify their email address.
 * Shows verification status and allows resending verification emails.
 */

import { type Metadata } from 'next';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { VerifyEmailForm } from '@/features/auth/components/VerifyEmailForm';

export const metadata: Metadata = {
  title: 'Verify Email - PayMatch',
  description: 'Verify your email address to access your PayMatch account.',
};

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{
    verified?: string;
    email?: string;
    showResend?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const isVerified = resolvedSearchParams.verified === 'true';
  const emailFromUrl = resolvedSearchParams.email;
  const showResend = resolvedSearchParams.showResend === 'true';

  // With deferred account creation, users won't have accounts until verification
  // So we always show the verification page for unauthenticated users
  return (
    <AuthLayout
      title={isVerified ? 'Email verified successfully!' : 'Verify your email'}
      subtitle={
        isVerified ? (
          <>
            Your email has been verified! You can now sign in to access your
            PayMatch account.
          </>
        ) : emailFromUrl ? (
          <>
            We&apos;ve sent a verification link to{' '}
            <span className="font-medium text-gray-900">{emailFromUrl}</span>.
            Please check your email and click the link to verify your account.
          </>
        ) : (
          <>
            We&apos;ve sent a verification link to your email address. Please
            check your email and click the link to verify your account.
          </>
        )
      }
    >
      <VerifyEmailForm
        userEmail={emailFromUrl || ''}
        isVerified={isVerified}
        showResend={showResend}
      />
    </AuthLayout>
  );
}
