/**
 * Email Verification Page
 *
 * Dedicated page for users who need to verify their email address.
 * Shows verification status and allows resending verification emails.
 */

import { type Metadata } from 'next';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { VerifyEmailForm } from '@/features/auth/components/VerifyEmailForm';
import { SetPasswordForm } from '@/features/auth/components/SetPasswordForm';

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
    setPassword?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const isVerified = resolvedSearchParams.verified === 'true';
  const emailFromUrl = resolvedSearchParams.email;
  const showResend = resolvedSearchParams.showResend === 'true';
  const needsPassword = resolvedSearchParams.setPassword === 'true';

  // If user needs to set password (clicked verification link), show password form
  if (needsPassword && emailFromUrl) {
    return (
      <AuthLayout
        title="Complete your registration"
        subtitle={
          <>
            Your email has been verified! Now set a secure password to complete
            your PayMatch account setup.
          </>
        }
      >
        <SetPasswordForm email={emailFromUrl} />
      </AuthLayout>
    );
  }

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
