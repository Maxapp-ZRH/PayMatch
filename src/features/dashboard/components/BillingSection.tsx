/**
 * Billing Section Component
 *
 * Displays current plan information and provides access to customer portal.
 * Used in dashboard settings or billing pages.
 */

'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Crown, Users, FileText } from 'lucide-react';
import { CustomerPortalButton } from '@/features/stripe/components/CustomerPortalButton';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Organization = Database['public']['Tables']['organizations']['Row'];

interface BillingSectionProps {
  orgId: string;
  className?: string;
}

export function BillingSection({ orgId, className }: BillingSectionProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrganization() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (data && !error) {
        setOrganization(data);
      }
      setIsLoading(false);
    }

    fetchOrganization();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <p className="text-red-600">Unable to load billing information</p>
      </div>
    );
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'business':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'freelancer':
        return <FileText className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'business':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'freelancer':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isPaidPlan = organization.plan && organization.plan !== 'free';

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Billing & Subscription
        </h3>
        {isPaidPlan && (
          <CustomerPortalButton orgId={orgId} variant="outline" size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </CustomerPortalButton>
        )}
      </div>

      <div className="space-y-4">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            {getPlanIcon(organization.plan || 'free')}
            <div>
              <p className="font-medium text-gray-900 capitalize">
                {organization.plan || 'Free'} Plan
              </p>
              <p className="text-sm text-gray-500">
                {organization.plan === 'free'
                  ? '5 invoices per month'
                  : 'Unlimited invoices'}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPlanColor(organization.plan || 'free')}`}
          >
            {organization.plan === 'free' ? 'Free' : 'Active'}
          </div>
        </div>

        {/* Stripe Customer ID (for debugging) */}
        {organization.stripe_customer_id && (
          <div className="text-xs text-gray-400">
            Customer ID: {organization.stripe_customer_id.slice(0, 8)}...
          </div>
        )}

        {/* Upgrade Prompt for Free Plan */}
        {!isPaidPlan && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Upgrade to unlock unlimited invoices
                </p>
                <p className="text-xs text-red-600">
                  Get access to advanced features and priority support
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
