/**
 * Plan Utility Functions
 *
 * Shared utility functions for plan-related operations.
 * Used by both marketing and onboarding components.
 */

import type { PlanName } from '@/config/plans';
import { getFeatureValue } from './plan-data';

// Feature value translation for display
export function translateFeatureValue(
  value: string | 'check' | 'cross' | undefined
): string | 'check' | 'cross' {
  // Handle undefined or null values
  if (!value) return 'cross';

  if (value === 'check' || value === 'cross') return value;

  // Handle numeric values and other non-translatable values
  if (value === 'Unlimited' || /^\d+$/.test(value) || value === '10 max') {
    return value;
  }

  // For now, return the value as-is since we're not using translations
  // This can be enhanced later with proper translation support
  return value;
}

// Get feature comparison data for a specific plan
export function getPlanFeatureComparison(planName: PlanName) {
  const featureKeys = [
    'invoices',
    'clients',
    'users',
    'storage',
    'qrBillInvoices',
    'paymentReconciliation',
    'reminders',
    'reportsDataExports',
    'brandingControl',
    'teamManagement',
    'support',
  ];

  return featureKeys.map((featureKey) => ({
    featureKey,
    value: getFeatureValue(featureKey, planName),
  }));
}

// Check if a plan is featured
export function isPlanFeatured(planName: PlanName): boolean {
  // Business plan is typically featured
  return planName === 'business';
}

// Get plan icon name for consistent icon mapping
export function getPlanIconName(planName: PlanName): string {
  const iconMap: Record<PlanName, string> = {
    free: 'Gift',
    freelancer: 'User',
    business: 'Building2',
    enterprise: 'Crown',
  };

  return iconMap[planName] || 'Gift';
}

// Format plan price for display
export function formatPlanPrice(
  price: number,
  currency: string = 'CHF'
): string {
  if (price === 0) return 'Free';
  return `${currency}${price}`;
}

// Get billing period display text
export function getBillingPeriodText(period: 'monthly' | 'annual'): string {
  return period === 'monthly' ? 'Monthly' : 'Annually';
}

// Get billing description text
export function getBillingDescription(
  period: 'monthly' | 'annual',
  monthlyPrice: number,
  annualPrice: number
): string {
  if (period === 'monthly') {
    return 'Billed monthly';
  }
  return `Billed annually (CHF ${annualPrice})`;
}
