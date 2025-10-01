/**
 * Pricing Configuration
 *
 * Simplified pricing configuration that uses the centralized plans.ts file.
 * This file provides pricing-specific utilities and rendering helpers.
 * All plan data and limits are managed in plans.ts.
 */

import {
  ANNUAL_DISCOUNT_PERCENT,
  BillingPeriod,
  Currency,
  DEFAULT_CURRENCY,
  FEATURE_COMPARISON,
  getAllPlans,
  PlanName,
  PLANS,
} from './plans';

// Re-export types from plans
export type { BillingPeriod, Currency, PlanName };

// Pricing plan interface for rendering
export interface PricingPlan {
  name: string;
  featured: boolean;
  monthlyPrice: number;
  annualPrice: number;
  logomarkClassName: string;
}

// Feature comparison row interface for rendering
export interface FeatureComparisonRow {
  feature: string;
  icon: React.ComponentType<{ className?: string }>;
  free: string | 'check' | 'cross';
  freelancer: string | 'check' | 'cross';
  business: string | 'check' | 'cross';
  enterprise: string | 'check' | 'cross';
}

// Swiss currency configuration (CHF only)
export const CURRENCY_SYMBOL = 'CHF';
export const CURRENCY_CODE = 'CHF';

// Pricing constants
export const PRICING_CONSTANTS = {
  annualDiscountPercent: ANNUAL_DISCOUNT_PERCENT,
  defaultCurrency: DEFAULT_CURRENCY,
  billingPeriods: ['Monthly', 'Annually'] as const,
} as const;

// Helper functions
export function getCurrencySymbol(): string {
  return CURRENCY_SYMBOL;
}

export function getCurrencyCode(): string {
  return CURRENCY_CODE;
}

// Get pricing plans for rendering (CHF only)
export function getPricingPlans(): PricingPlan[] {
  return getAllPlans().map((plan) => ({
    name: plan.displayName,
    featured: plan.featured,
    monthlyPrice: plan.pricing.monthly / 100, // Convert from cents
    annualPrice: plan.pricing.annual / 100, // Convert from cents
    logomarkClassName: plan.logomarkClassName,
  }));
}

// Get pricing plans for a specific locale (CHF only)
export function getPricingPlansForLocale(): PricingPlan[] {
  return getPricingPlans();
}

// Get feature comparison for rendering
export function getFeatureComparison(): FeatureComparisonRow[] {
  return FEATURE_COMPARISON.map((row) => ({
    feature: row.featureKey,
    icon: row.icon,
    free: row.free,
    freelancer: row.freelancer,
    business: row.business,
    enterprise: row.enterprise,
  }));
}

// Calculate monthly pricing with annual discount
export function calculateMonthlyPricing(annualPrice: number): number {
  // The annual price in plans.ts is already the discounted price
  // So we just need to divide by 12 to get the monthly equivalent
  return Math.round(annualPrice / 12);
}

// Export individual configurations
export { PLANS as plans };
export { FEATURE_COMPARISON as comparisonTable };
export { getPricingPlans as plansData };
export { getFeatureComparison as comparisonTableData };
