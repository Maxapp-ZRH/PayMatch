/**
 * Centralized Plan Data
 *
 * Single source of truth for all plan features, descriptions, and metadata.
 * This eliminates duplication between marketing and onboarding components.
 */

import type { PlanName } from '@/config/plans';

// Plan features for each plan type
export const PLAN_FEATURES: Record<PlanName, string[]> = {
  free: [
    '5 invoices per month',
    '10 clients',
    '5 MB storage',
    'Swiss QR-bill generation',
    'Payment reconciliation',
    'Community support',
  ],
  freelancer: [
    'Unlimited invoices',
    '50 clients max',
    '50 MB storage',
    'Swiss QR-bill generation',
    'Payment reconciliation',
    'Priority support',
  ],
  business: [
    'Everything in Freelancer',
    'Unlimited clients',
    '100 MB storage',
    'Team management (10 users)',
    'Advanced reminders',
    'Branding control',
    'Advanced reporting',
  ],
  enterprise: [
    'Everything in Business',
    'Unlimited users',
    '150 MB storage',
    'Dedicated support / SLA',
    'Advanced security',
    'Early access to AI features',
    'Custom requests',
  ],
};

// Plan descriptions for each plan type
export const PLAN_DESCRIPTIONS: Record<PlanName, string> = {
  free: 'Perfect for getting started with Swiss invoicing.',
  freelancer: 'For solo professionals who want invoicing without limits.',
  business:
    'For SMEs and fiduciaries that need collaboration and more features.',
  enterprise: 'For large fiduciaries and corporates with advanced needs.',
};

// Plan display names
export const PLAN_DISPLAY_NAMES: Record<PlanName, string> = {
  free: 'Free',
  freelancer: 'Freelancer',
  business: 'Business',
  enterprise: 'Enterprise',
};

// Feature comparison values for table display
export const FEATURE_VALUES: Record<
  string,
  Record<PlanName, string | 'check' | 'cross'>
> = {
  invoices: {
    free: '5/month',
    freelancer: 'Unlimited',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  clients: {
    free: '10',
    freelancer: '50',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  users: {
    free: '1',
    freelancer: '1',
    business: '10',
    enterprise: 'Unlimited',
  },
  storage: {
    free: '5 MB',
    freelancer: '50 MB',
    business: '100 MB',
    enterprise: '150 MB',
  },
  qrBillInvoices: {
    free: 'check',
    freelancer: 'check',
    business: 'check',
    enterprise: 'check',
  },
  paymentReconciliation: {
    free: 'check',
    freelancer: 'check',
    business: 'check',
    enterprise: 'check',
  },
  reminders: {
    free: 'Basic',
    freelancer: 'Basic',
    business: 'Advanced',
    enterprise: 'Advanced',
  },
  reportsDataExports: {
    free: 'Basic',
    freelancer: 'Basic',
    business: 'Advanced',
    enterprise: 'Advanced',
  },
  brandingControl: {
    free: 'cross',
    freelancer: 'cross',
    business: 'check',
    enterprise: 'check',
  },
  teamManagement: {
    free: 'cross',
    freelancer: 'cross',
    business: 'check',
    enterprise: 'check',
  },
  support: {
    free: 'Community',
    freelancer: 'Priority',
    business: 'Priority',
    enterprise: 'Dedicated SLA',
  },
};

// Utility functions
export function getPlanFeatures(planName: PlanName): string[] {
  return PLAN_FEATURES[planName] || [];
}

export function getPlanDescription(planName: PlanName): string {
  return PLAN_DESCRIPTIONS[planName] || '';
}

export function getPlanDisplayName(planName: PlanName): string {
  return PLAN_DISPLAY_NAMES[planName] || planName;
}

export function getFeatureValue(
  featureKey: string,
  planName: PlanName
): string | 'check' | 'cross' {
  return FEATURE_VALUES[featureKey]?.[planName] || 'cross';
}

// Get all plan names in order
export function getAllPlanNames(): PlanName[] {
  return ['free', 'freelancer', 'business', 'enterprise'];
}

// Get plan index for comparison tables
export function getPlanIndex(planName: PlanName): number {
  return getAllPlanNames().indexOf(planName);
}
