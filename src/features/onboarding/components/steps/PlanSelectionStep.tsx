/**
 * Plan Selection Step Component
 *
 * First step of the onboarding wizard - plan selection.
 * Shows paid plans with a subtle free option, using marketing design language.
 */

'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Gift } from 'lucide-react';
import { PlanName, BillingPeriod } from '@/config/plans';
import {
  BillingToggle,
  PlanCard,
  SaveBadge,
} from '@/components/shared/pricing';
import { useAllPlansData, useAllPlansPricing } from '@/hooks/pricing';
import type { PlanData } from '@/lib/pricing/plan-types';
import { createCheckoutSession } from '@/features/stripe/server/actions/create-checkout-session';
import { updateOrganizationPlan } from '@/features/stripe/server/actions/update-organization-plan';
import { showToast } from '@/lib/toast';
import type { StepProps } from '../../types';

export function PlanSelectionStep({ onNext, formData }: StepProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanName | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annual');

  const plansData = useAllPlansData();
  const pricingData = useAllPlansPricing(billingPeriod);

  // Filter out the free plan - only show paid plans
  const paidPlans = plansData.filter((plan: PlanData) => plan.name !== 'free');

  const handlePlanSelect = (planName: PlanName) => {
    setSelectedPlan(planName);
  };

  const handleBillingPeriodChange = (period: BillingPeriod) => {
    setBillingPeriod(period);
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    try {
      // Create checkout session for paid plans
      const result = await createCheckoutSession({
        orgId: formData.orgId!,
        userId: '', // Will be set by the server action
        planName: selectedPlan,
        billingCycle: billingPeriod,
        successUrl: `${window.location.origin}/onboarding?step=company-details`,
        cancelUrl: `${window.location.origin}/onboarding?step=plan-selection`,
      });

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        showToast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error processing plan selection:', error);
      showToast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueFree = async () => {
    setIsProcessing(true);
    try {
      // Update organization plan to free
      const result = await updateOrganizationPlan({
        orgId: formData.orgId!,
        planName: 'free',
      });

      if (result.success) {
        showToast.success('Free plan selected successfully!');
        onNext({ plan: 'free' });
      } else {
        showToast.error(result.message || 'Failed to select free plan');
      }
    } catch (error) {
      console.error('Error processing free plan selection:', error);
      showToast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-gray-900">
          Choose Your Plan
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Select the perfect plan for your business needs
        </p>
      </div>

      {/* Billing Period Toggle */}
      <div className="flex justify-center">
        <BillingToggle
          value={billingPeriod}
          onChange={handleBillingPeriodChange}
        />
      </div>

      {/* Save Badge */}
      <div className="flex justify-center">
        <SaveBadge discountPercent={20} />
      </div>

      {/* Plan Cards - Responsive Grid */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:max-w-none lg:grid-cols-3">
        {paidPlans.map((plan: PlanData) => {
          const isSelected = selectedPlan === plan.name;
          const pricing = pricingData.find((p) => p.planName === plan.name);

          if (!pricing) return null;

          return (
            <div key={plan.name}>
              <PlanCard
                plan={plan}
                monthlyPrice={pricing.monthlyPrice}
                annualPrice={pricing.annualPrice}
                billingPeriod={billingPeriod}
                isSelected={isSelected}
                onSelect={handlePlanSelect}
                variant="onboarding"
                previousPeriod={billingPeriod}
              />
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        {/* Select Plan Button - Only show when a plan is selected */}
        {selectedPlan && (
          <button
            onClick={handleContinue}
            disabled={isProcessing}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                Processing...
              </>
            ) : (
              <>
                Continue with{' '}
                {
                  plansData.find((p: PlanData) => p.name === selectedPlan)
                    ?.displayName
                }
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </>
            )}
          </button>
        )}

        {/* Free Plan Option - Always visible */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            All plans include Swiss QR-bill compliance and payment
            reconciliation.
          </p>
          <p className="text-sm text-gray-500">
            <button
              onClick={handleContinueFree}
              disabled={isProcessing}
              className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin inline -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>
                  <Gift className="inline mr-1 h-4 w-4" />
                  Start with Free plan →
                </>
              )}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
