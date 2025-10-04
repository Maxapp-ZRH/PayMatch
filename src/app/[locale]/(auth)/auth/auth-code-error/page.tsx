/**
 * Auth Code Error Page
 *
 * Simple error page for authentication failures.
 */

import { type Metadata } from 'next';
import Link from 'next/link';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { Button } from '@/components/marketing_pages/Button';

export const metadata: Metadata = {
  title: 'Authentication Error - PayMatch',
  description: 'There was an error with your authentication. Please try again.',
};

export default async function AuthCodeError({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const emailFromUrl = resolvedSearchParams.email;
  return (
    <AuthLayout
      title="Authentication Error"
      subtitle="There was a problem with your authentication link."
    >
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
          Link expired or invalid
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          This verification link has expired or is no longer valid. Request a
          new one to continue.
        </p>
        <div className="mt-8">
          <Link
            href={
              emailFromUrl
                ? `/verify-email?email=${encodeURIComponent(emailFromUrl)}&showResend=true`
                : '/verify-email'
            }
          >
            <Button color="cyan" className="w-full">
              Get new verification link
            </Button>
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Already verified? Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
