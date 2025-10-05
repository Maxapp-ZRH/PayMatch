/**
 * usePlanPricing Hook
 *
 * Custom hook for accessing plan pricing information and calculations.
 * Integrates with the existing pricing configuration from @/config/plans.
 */

import { useMemo } from 'react';
import type { PlanName, BillingPeriod } from '@/config/plans';
import { getPlanPricingInCHF } from '@/config/plans';
import { formatPlanPrice, getBillingDescription } from '@/lib/pricing';

export function usePlanPricing(
  planName: PlanName,
  billingPeriod: BillingPeriod
) {
  return useMemo(() => {
    const monthlyPrice = getPlanPricingInCHF(planName, 'monthly');
    const annualPrice = getPlanPricingInCHF(planName, 'annual');
    const currentPrice =
      billingPeriod === 'monthly' ? monthlyPrice : annualPrice;

    return {
      monthlyPrice,
      annualPrice,
      currentPrice,
      formattedPrice: formatPlanPrice(currentPrice),
      billingDescription: getBillingDescription(
        billingPeriod,
        monthlyPrice,
        annualPrice
      ),
    };
  }, [planName, billingPeriod]);
}

export function useAllPlansPricing(billingPeriod: BillingPeriod) {
  return useMemo(() => {
    const planNames: PlanName[] = [
      'free',
      'freelancer',
      'business',
      'enterprise',
    ];
    return planNames.map((planName) => {
      const monthlyPrice = getPlanPricingInCHF(planName, 'monthly');
      const annualPrice = getPlanPricingInCHF(planName, 'annual');
      const currentPrice =
        billingPeriod === 'monthly' ? monthlyPrice : annualPrice;

      return {
        planName,
        monthlyPrice,
        annualPrice,
        currentPrice,
        formattedPrice: formatPlanPrice(currentPrice),
        billingDescription: getBillingDescription(
          billingPeriod,
          monthlyPrice,
          annualPrice
        ),
      };
    });
  }, [billingPeriod]);
}
