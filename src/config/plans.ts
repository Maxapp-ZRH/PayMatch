/**
 * Centralized Plan Configuration
 *
 * This file contains all plan definitions, limits, and features for PayMatch.
 * All pricing and feature data is centralized here for easy management and updates.
 * This ensures consistency across the entire application.
 */

import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  HeadphonesIcon,
  Palette,
  Users,
} from 'lucide-react';

// Plan types
export type PlanName = 'free' | 'freelancer' | 'business' | 'enterprise';
export type Currency = 'CHF';
export type BillingPeriod = 'monthly' | 'annual';

// Plan limits interface
export interface PlanLimits {
  invoices: number; // -1 for unlimited
  clients: number; // -1 for unlimited
  users: number; // -1 for unlimited
  storage: number; // in MB, -1 for unlimited
  customBranding: boolean;
  teamManagement: boolean;
  advancedReporting: boolean;
  prioritySupport: boolean;
  dedicatedSupport: boolean;
  earlyAccess: boolean;
  customRequests: boolean;
}

// Plan pricing interface (CHF only)
export interface PlanPricing {
  monthly: number; // in cents (CHF)
  annual: number; // in cents (CHF)
}

// Plan configuration interface (CHF only)
export interface PlanConfig {
  name: PlanName;
  displayName: string;
  featured: boolean;
  pricing: PlanPricing; // CHF only
  limits: PlanLimits;
  logomarkClassName: string;
  descriptionKey: string;
  featuresKey: string;
}

// Feature comparison row interface
export interface FeatureComparisonRow {
  featureKey: string;
  icon: React.ComponentType<{ className?: string }>;
  free: string | 'check' | 'cross';
  freelancer: string | 'check' | 'cross';
  business: string | 'check' | 'cross';
  enterprise: string | 'check' | 'cross';
}

// Plan configurations
export const PLANS: Record<PlanName, PlanConfig> = {
  free: {
    name: 'free',
    displayName: 'Free',
    featured: false,
    pricing: { monthly: 0, annual: 0 },
    limits: {
      invoices: 5,
      clients: 10,
      users: 1,
      storage: 5, // 5MB
      customBranding: false,
      teamManagement: false,
      advancedReporting: false,
      prioritySupport: false,
      dedicatedSupport: false,
      earlyAccess: false,
      customRequests: false,
    },
    logomarkClassName: 'fill-gray-400',
    descriptionKey: 'plans.free.description',
    featuresKey: 'plans.free.features',
  },
  freelancer: {
    name: 'freelancer',
    displayName: 'Freelancer',
    featured: false,
    pricing: { monthly: 500, annual: 4800 }, // 5 CHF monthly, 48 CHF annual
    limits: {
      invoices: -1, // unlimited
      clients: 50, // max 50 clients
      users: 1,
      storage: 50, // 50MB
      customBranding: false,
      teamManagement: false,
      advancedReporting: false,
      prioritySupport: true,
      dedicatedSupport: false,
      earlyAccess: false,
      customRequests: false,
    },
    logomarkClassName: 'fill-gray-500',
    descriptionKey: 'plans.freelancer.description',
    featuresKey: 'plans.freelancer.features',
  },
  business: {
    name: 'business',
    displayName: 'Business',
    featured: true,
    pricing: { monthly: 5000, annual: 48000 }, // 50 CHF monthly, 480 CHF annual
    limits: {
      invoices: -1, // unlimited
      clients: -1, // unlimited
      users: 10,
      storage: 100, // 100MB
      customBranding: true,
      teamManagement: true,
      advancedReporting: true,
      prioritySupport: true,
      dedicatedSupport: false,
      earlyAccess: false,
      customRequests: false,
    },
    logomarkClassName: 'fill-red-500',
    descriptionKey: 'plans.business.description',
    featuresKey: 'plans.business.features',
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    featured: false,
    pricing: { monthly: 15000, annual: 144000 }, // 150 CHF monthly, 1440 CHF annual
    limits: {
      invoices: -1, // unlimited
      clients: -1, // unlimited
      users: -1, // unlimited
      storage: 150, // 150MB
      customBranding: true,
      teamManagement: true,
      advancedReporting: true,
      prioritySupport: true,
      dedicatedSupport: true,
      earlyAccess: true,
      customRequests: true,
    },
    logomarkClassName: 'fill-red-600',
    descriptionKey: 'plans.enterprise.description',
    featuresKey: 'plans.enterprise.features',
  },
};

// Feature comparison table
export const FEATURE_COMPARISON: FeatureComparisonRow[] = [
  {
    featureKey: 'invoices',
    icon: FileText,
    free: '5',
    freelancer: 'Unlimited',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    featureKey: 'clients',
    icon: Users,
    free: '10',
    freelancer: '50',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    featureKey: 'users',
    icon: Users,
    free: '1',
    freelancer: '1',
    business: '10 max',
    enterprise: 'Unlimited',
  },
  {
    featureKey: 'qrBillInvoices',
    icon: FileText,
    free: 'check',
    freelancer: 'check',
    business: 'check',
    enterprise: 'check',
  },
  {
    featureKey: 'paymentReconciliation',
    icon: CreditCard,
    free: 'check',
    freelancer: 'check',
    business: 'check',
    enterprise: 'check',
  },
  {
    featureKey: 'reminders',
    icon: Bell,
    free: 'Basic',
    freelancer: 'Basic',
    business: 'Advanced',
    enterprise: 'Advanced',
  },
  {
    featureKey: 'reportsDataExports',
    icon: BarChart3,
    free: 'check',
    freelancer: 'check',
    business: 'check',
    enterprise: 'check',
  },
  {
    featureKey: 'brandingControl',
    icon: Palette,
    free: 'cross',
    freelancer: 'cross',
    business: 'check',
    enterprise: 'check',
  },
  {
    featureKey: 'teamManagement',
    icon: Users,
    free: 'cross',
    freelancer: 'cross',
    business: 'check',
    enterprise: 'check',
  },
  {
    featureKey: 'storage',
    icon: FileText,
    free: '5 MB',
    freelancer: '50 MB',
    business: '100 MB',
    enterprise: '150 MB',
  },
  {
    featureKey: 'support',
    icon: HeadphonesIcon,
    free: 'Community',
    freelancer: 'Priority',
    business: 'Priority',
    enterprise: 'Dedicated SLA',
  },
];

// Plan order for display
export const PLAN_ORDER: PlanName[] = [
  'free',
  'freelancer',
  'business',
  'enterprise',
];

// Default currency (Swiss market)
export const DEFAULT_CURRENCY: Currency = 'CHF';

// Annual discount percentage
export const ANNUAL_DISCOUNT_PERCENT = 20;

// Utility functions
export function getPlan(planName: PlanName): PlanConfig {
  return PLANS[planName];
}

export function getAllPlans(): PlanConfig[] {
  return PLAN_ORDER.map((name) => PLANS[name]);
}

export function getFeaturedPlan(): PlanConfig | undefined {
  return Object.values(PLANS).find((plan) => plan.featured);
}

export function getFreePlan(): PlanConfig {
  return PLANS.free;
}

export function getPlanPricing(planName: PlanName): PlanPricing {
  return PLANS[planName].pricing;
}

export function getPlanLimits(planName: PlanName): PlanLimits {
  return PLANS[planName].limits;
}

export function isUnlimited(value: number): boolean {
  return value === -1;
}

export function formatLimit(value: number, unit: string = ''): string {
  if (isUnlimited(value)) {
    return 'Unlimited';
  }
  return `${value}${unit ? ` ${unit}` : ''}`;
}

export function getPlanPrice(
  planName: PlanName,
  period: BillingPeriod
): number {
  const pricing = getPlanPricing(planName);
  return period === 'monthly' ? pricing.monthly : pricing.annual;
}

export function calculateAnnualDiscount(monthlyPrice: number): number {
  const annualPrice = monthlyPrice * 12;
  const discount = annualPrice * (ANNUAL_DISCOUNT_PERCENT / 100);
  return Math.round(annualPrice - discount);
}

export function getEffectiveAnnualPrice(planName: PlanName): number {
  const pricing = getPlanPricing(planName);
  return calculateAnnualDiscount(pricing.monthly);
}

export function canUserAccessFeature(
  planName: PlanName,
  feature: keyof PlanLimits
): boolean {
  const limits = getPlanLimits(planName);
  return limits[feature] === true;
}

export function getUserLimit(
  planName: PlanName,
  limit: keyof PlanLimits
): number {
  const limits = getPlanLimits(planName);
  return limits[limit] as number;
}

export function isPlanUpgrade(fromPlan: PlanName, toPlan: PlanName): boolean {
  const planOrder = PLAN_ORDER;
  const fromIndex = planOrder.indexOf(fromPlan);
  const toIndex = planOrder.indexOf(toPlan);
  return toIndex > fromIndex;
}

export function getUpgradeOptions(currentPlan: PlanName): PlanName[] {
  const currentIndex = PLAN_ORDER.indexOf(currentPlan);
  return PLAN_ORDER.slice(currentIndex + 1);
}

export function getDowngradeOptions(currentPlan: PlanName): PlanName[] {
  const currentIndex = PLAN_ORDER.indexOf(currentPlan);
  return PLAN_ORDER.slice(0, currentIndex);
}

// Feature comparison utilities
export function getFeatureComparison(): FeatureComparisonRow[] {
  return FEATURE_COMPARISON;
}

export function getFeatureComparisonForPlan(
  planName: PlanName
): Record<string, string | 'check' | 'cross'> {
  const comparison: Record<string, string | 'check' | 'cross'> = {};

  FEATURE_COMPARISON.forEach((row) => {
    comparison[row.featureKey] = row[planName];
  });

  return comparison;
}

// Plan validation
export function validatePlanLimits(
  planName: PlanName,
  usage: Partial<PlanLimits>
): boolean {
  const limits = getPlanLimits(planName);

  for (const [key, value] of Object.entries(usage)) {
    if (value === undefined) continue;

    const limit = limits[key as keyof PlanLimits];
    if (typeof limit === 'number' && typeof value === 'number') {
      if (!isUnlimited(limit) && value > limit) {
        return false;
      }
    } else if (typeof limit === 'boolean' && typeof value === 'boolean') {
      if (!limit && value) {
        return false;
      }
    }
  }

  return true;
}

// Enhanced utility functions for better centralization

/**
 * Get plan description key for translation
 */
export function getPlanDescriptionKey(planName: PlanName): string {
  return PLANS[planName].descriptionKey;
}

/**
 * Get plan features key for translation
 */
export function getPlanFeaturesKey(planName: PlanName): string {
  return PLANS[planName].featuresKey;
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(planName: PlanName): string {
  return PLANS[planName].displayName;
}

/**
 * Get plan pricing for a specific period
 */
export function getPlanPricingForPeriod(
  planName: PlanName,
  period: BillingPeriod
): number {
  const pricing = getPlanPricing(planName);
  return period === 'monthly' ? pricing.monthly : pricing.annual;
}

/**
 * Get plan pricing in CHF (converted from cents)
 */
export function getPlanPricingInCHF(
  planName: PlanName,
  period: BillingPeriod
): number {
  return getPlanPricingForPeriod(planName, period) / 100;
}

/**
 * Format plan limit for display
 */
export function formatPlanLimit(
  limit: number,
  unit: string = '',
  unlimitedText: string = 'Unlimited'
): string {
  if (isUnlimited(limit)) {
    return unlimitedText;
  }
  return `${limit}${unit ? ` ${unit}` : ''}`;
}

/**
 * Get formatted plan limits for display
 */
export function getFormattedPlanLimits(planName: PlanName): {
  invoices: string;
  clients: string;
  users: string;
  storage: string;
  [key: string]: string;
} {
  const limits = getPlanLimits(planName);

  return {
    invoices: formatPlanLimit(limits.invoices),
    clients: formatPlanLimit(limits.clients),
    users: formatPlanLimit(limits.users),
    storage: formatPlanLimit(limits.storage, 'MB'),
    customBranding: limits.customBranding ? 'Yes' : 'No',
    teamManagement: limits.teamManagement ? 'Yes' : 'No',
    advancedReporting: limits.advancedReporting ? 'Yes' : 'No',
    prioritySupport: limits.prioritySupport ? 'Yes' : 'No',
    dedicatedSupport: limits.dedicatedSupport ? 'Yes' : 'No',
    earlyAccess: limits.earlyAccess ? 'Yes' : 'No',
    customRequests: limits.customRequests ? 'Yes' : 'No',
  };
}

/**
 * Get feature display value for a specific plan
 */
export function getFeatureDisplayValue(
  featureKey: string,
  planName: PlanName
): string | 'check' | 'cross' {
  const row = FEATURE_COMPARISON.find((r) => r.featureKey === featureKey);
  if (!row) return 'cross';

  return row[planName];
}

/**
 * Get all feature display values for a plan
 */
export function getPlanFeatureValues(
  planName: PlanName
): Record<string, string | 'check' | 'cross'> {
  const values: Record<string, string | 'check' | 'cross'> = {};

  FEATURE_COMPARISON.forEach((row) => {
    values[row.featureKey] = row[planName];
  });

  return values;
}

/**
 * Check if a plan has a specific feature
 */
export function planHasFeature(
  planName: PlanName,
  featureKey: string
): boolean {
  const value = getFeatureDisplayValue(featureKey, planName);
  return value === 'check' || (typeof value === 'string' && value !== 'cross');
}

/**
 * Get plan comparison data for UI display
 */
export function getPlanComparisonData() {
  return {
    plans: PLAN_ORDER.map((planName) => ({
      name: planName,
      displayName: getPlanDisplayName(planName),
      featured: PLANS[planName].featured,
      pricing: getPlanPricing(planName),
      limits: getFormattedPlanLimits(planName),
      features: getPlanFeatureValues(planName),
    })),
    features: FEATURE_COMPARISON.map((row) => ({
      key: row.featureKey,
      icon: row.icon,
      values: {
        free: row.free,
        freelancer: row.freelancer,
        business: row.business,
        enterprise: row.enterprise,
      },
    })),
  };
}

/**
 * Get plan summary for quick reference
 */
export function getPlanSummary(planName: PlanName): {
  name: string;
  displayName: string;
  featured: boolean;
  monthlyPrice: number;
  annualPrice: number;
  monthlyPriceCHF: number;
  annualPriceCHF: number;
  keyFeatures: string[];
  limits: ReturnType<typeof getFormattedPlanLimits>;
} {
  const plan = PLANS[planName];
  const pricing = plan.pricing;

  return {
    name: plan.name,
    displayName: plan.displayName,
    featured: plan.featured,
    monthlyPrice: pricing.monthly,
    annualPrice: pricing.annual,
    monthlyPriceCHF: pricing.monthly / 100,
    annualPriceCHF: pricing.annual / 100,
    keyFeatures: Object.entries(getPlanFeatureValues(planName))
      .filter(([, value]) => value === 'check')
      .map(([key]) => key),
    limits: getFormattedPlanLimits(planName),
  };
}

/**
 * Get all plan summaries
 */
export function getAllPlanSummaries() {
  return PLAN_ORDER.map(getPlanSummary);
}

/**
 * Find plans by feature
 */
export function getPlansWithFeature(featureKey: string): PlanName[] {
  return PLAN_ORDER.filter((planName) => planHasFeature(planName, featureKey));
}

/**
 * Find plans by limit value
 */
export function getPlansWithLimit(
  limitKey: keyof PlanLimits,
  value: number | boolean
): PlanName[] {
  return PLAN_ORDER.filter((planName) => {
    const limits = getPlanLimits(planName);
    return limits[limitKey] === value;
  });
}

/**
 * Compare two plans
 */
export function comparePlans(
  plan1: PlanName,
  plan2: PlanName
): {
  pricing: { plan1: number; plan2: number; difference: number };
  features: {
    plan1: string[];
    plan2: string[];
    common: string[];
    unique: { plan1: string[]; plan2: string[] };
  };
  limits: {
    plan1: ReturnType<typeof getFormattedPlanLimits>;
    plan2: ReturnType<typeof getFormattedPlanLimits>;
  };
} {
  const summary1 = getPlanSummary(plan1);
  const summary2 = getPlanSummary(plan2);

  const features1 = Object.entries(getPlanFeatureValues(plan1))
    .filter(([, value]) => value === 'check')
    .map(([key]) => key);
  const features2 = Object.entries(getPlanFeatureValues(plan2))
    .filter(([, value]) => value === 'check')
    .map(([key]) => key);

  const commonFeatures = features1.filter((f) => features2.includes(f));
  const uniqueFeatures1 = features1.filter((f) => !features2.includes(f));
  const uniqueFeatures2 = features2.filter((f) => !features1.includes(f));

  return {
    pricing: {
      plan1: summary1.monthlyPriceCHF,
      plan2: summary2.monthlyPriceCHF,
      difference: summary2.monthlyPriceCHF - summary1.monthlyPriceCHF,
    },
    features: {
      plan1: features1,
      plan2: features2,
      common: commonFeatures,
      unique: {
        plan1: uniqueFeatures1,
        plan2: uniqueFeatures2,
      },
    },
    limits: {
      plan1: summary1.limits,
      plan2: summary2.limits,
    },
  };
}

// Export plan names for type safety
export const PLAN_NAMES = Object.keys(PLANS) as PlanName[];
export const CURRENCIES = ['CHF'] as const;
export const BILLING_PERIODS = ['monthly', 'annual'] as const;
