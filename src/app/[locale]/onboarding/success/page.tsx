/**
 * Onboarding Success Page
 *
 * Displays success message after completing onboarding and provides
 * access to customer portal for subscription management.
 */

import { Suspense } from 'react';
import { CheckCircle, ArrowRight, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/marketing_pages/Button';
import { CustomerPortalButton } from '@/features/stripe/components/CustomerPortalButton';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface OnboardingSuccessPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    plan?: string;
    session_id?: string;
  };
}

async function OnboardingSuccessContent({
  searchParams,
}: {
  searchParams: { plan?: string; session_id?: string };
}) {
  const supabase = await createClient();

  // Get current user and organization
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, plan, onboarding_completed')
    .eq('uid', user.id)
    .single();

  if (orgError || !org) {
    redirect('/onboarding');
  }

  const planName = searchParams.plan || org.plan || 'free';
  const isPaidPlan = planName !== 'free';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to PayMatch!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Your account has been set up successfully and you&apos;re ready to
              start creating Swiss QR-bill compliant invoices.
            </p>
          </div>

          {/* Plan Information */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Current Plan
                </h3>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {planName} Plan
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-sm font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {/* Go to Dashboard */}
            <Link href="/dashboard" className="block">
              <Button color="swiss" className="w-full">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Manage Billing (for paid plans) */}
            {isPaidPlan && (
              <CustomerPortalButton
                orgId={org.id}
                returnUrl={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                variant="outline"
                className="w-full"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Billing
              </CustomerPortalButton>
            )}

            {/* Free Plan Upgrade */}
            {!isPaidPlan && (
              <Link href="/pricing" className="block">
                <Button variant="outline" className="w-full">
                  Upgrade Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Additional Information */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Check out our{' '}
              <Link
                href="/help"
                className="text-red-600 hover:text-red-700 underline"
              >
                help center
              </Link>{' '}
              or{' '}
              <Link
                href="/contact"
                className="text-red-600 hover:text-red-700 underline"
              >
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingSuccessPage({
  searchParams,
}: OnboardingSuccessPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <OnboardingSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
