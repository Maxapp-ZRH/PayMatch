/**
 * Dashboard Page
 *
 * Main dashboard for authenticated and onboarded users.
 * Shows key metrics and quick actions.
 */

import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/ui/logout-button';
import { BillingSection } from '@/features/dashboard/components/BillingSection';
import { SettingsSection } from '@/features/dashboard/components/SettingsSection';

export const metadata: Metadata = {
  title: 'Dashboard - PayMatch',
  description:
    'Your PayMatch dashboard for managing Swiss QR-bill compliant invoices.',
};

export default async function Dashboard() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect('/login');
  }

  // Check if user's email is verified
  if (!user.email_confirmed_at) {
    redirect('/verify-email');
  }

  // Check if user has completed onboarding and get organization data
  const { data: orgMembership } = await supabase
    .from('organization_users')
    .select(
      `
      org_id,
      organizations!inner(
        onboarding_completed,
        plan,
        stripe_subscription_status,
        name
      )
    `
    )
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  const org = orgMembership?.organizations as
    | {
        onboarding_completed: boolean;
        plan: string;
        stripe_subscription_status: string | null;
        name: string;
      }
    | undefined;
  if (!org?.onboarding_completed) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to PayMatch!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Your Swiss QR-bill compliant invoicing platform is ready to use.
            </p>
          </div>
          <LogoutButton variant="outline" size="md" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
                Create Invoice
              </button>
              <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Add Client
              </button>
              <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                View Reports
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                No recent activity yet. Start by creating your first invoice!
              </p>
            </div>
          </div>

          {/* Account Status */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">
              Account Status
            </h3>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Verified</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  ✓ Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Onboarding</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  ✓ Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Plan</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    org?.plan === 'free'
                      ? 'bg-gray-100 text-gray-800'
                      : org?.stripe_subscription_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {org?.plan === 'free'
                    ? 'Free'
                    : org?.plan?.charAt(0).toUpperCase() + org?.plan?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className="mt-8">
          <BillingSection orgId={orgMembership?.org_id || ''} />
        </div>

        {/* Settings Section */}
        <div className="mt-8">
          <SettingsSection />
        </div>

        {/* Welcome Message */}
        <div className="mt-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
          <h2 className="text-xl font-semibold">🎉 Congratulations!</h2>
          <p className="mt-2">
            You&apos;ve successfully completed the PayMatch setup. You can now
            start creating Swiss QR-bill compliant invoices and managing your
            business finances.
          </p>
        </div>
      </div>
    </div>
  );
}
