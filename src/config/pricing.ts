/**
 * Pricing Configuration
 *
 * Centralized pricing data for PayMatch plans including pricing tiers,
 * features, comparison table, and utility functions. This ensures
 * consistent pricing information across all components and pages.
 *
 * Note: Text content is now handled by the translation system.
 * This file provides the structural data and utility functions.
 */

import {
  Check,
  X,
  Users,
  FileText,
  CreditCard,
  Bell,
  BarChart3,
  Palette,
  HeadphonesIcon,
} from 'lucide-react';

export interface PricingPlan {
  name: string;
  featured: boolean;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  button: {
    label: string;
    href: string;
  };
  features: string[];
  logomarkClassName: string;
}

export interface PricingPlanData {
  name: string;
  featured: boolean;
  monthlyPrice: number;
  annualPrice: number;
  logomarkClassName: string;
}

export interface PricingPlanWithCurrencies {
  name: string;
  featured: boolean;
  prices: {
    CHF: {
      monthly: number;
      annual: number;
    };
    EUR: {
      monthly: number;
      annual: number;
    };
  };
  logomarkClassName: string;
}

export interface FeatureComparisonRow {
  feature: string;
  free: string | 'check' | 'cross';
  freelancer: string | 'check' | 'cross';
  business: string | 'check' | 'cross';
  enterprise: string | 'check' | 'cross';
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FeatureComparisonRowData {
  featureKey: string;
  free: string | 'check' | 'cross';
  freelancer: string | 'check' | 'cross';
  business: string | 'check' | 'cross';
  enterprise: string | 'check' | 'cross';
  icon?: React.ComponentType<{ className?: string }>;
}

export interface PricingConfig {
  plans: PricingPlan[];
  featureComparison: FeatureComparisonRow[];
  annualDiscountPercent: number;
  currency: string;
  billingPeriods: string[];
  sectionTitle: string;
  sectionDescription: string;
  comparisonTitle: string;
  comparisonDescription: string;
  annualBillingBadge: string;
  footerText: string;
  footerLink: {
    text: string;
    href: string;
  };
}

// Utility function to calculate monthly pricing with annual discount
export function calculateMonthlyPricing(
  annualPrice: number,
  discountPercent: number = 20
): number {
  const discountedAnnual = annualPrice * (1 - discountPercent / 100);
  return Math.round(discountedAnnual / 12);
}

// Helper function to create icon components for feature comparison
export function createFeatureIcon(type: 'check' | 'cross', className?: string) {
  const Icon = type === 'check' ? Check : X;
  const colorClass = type === 'check' ? 'text-green-600' : 'text-red-600';
  return { Icon, className: `w-4 h-4 ${colorClass} ${className || ''}` };
}

// Pricing plans data with multiple currencies
export const pricingPlansWithCurrencies: PricingPlanWithCurrencies[] = [
  {
    name: 'Free',
    featured: false,
    prices: {
      CHF: { monthly: 0, annual: 0 },
      EUR: { monthly: 0, annual: 0 },
    },
    logomarkClassName: 'fill-gray-400',
  },
  {
    name: 'Freelancer',
    featured: false,
    prices: {
      CHF: { monthly: 5, annual: 48 },
      EUR: { monthly: 5, annual: 48 },
    },
    logomarkClassName: 'fill-gray-500',
  },
  {
    name: 'Business',
    featured: true,
    prices: {
      CHF: { monthly: 50, annual: 480 },
      EUR: { monthly: 50, annual: 480 },
    },
    logomarkClassName: 'fill-teal-600',
  },
  {
    name: 'Enterprise',
    featured: false,
    prices: {
      CHF: { monthly: 150, annual: 1440 },
      EUR: { monthly: 150, annual: 1440 },
    },
    logomarkClassName: 'fill-red-600',
  },
];

// Legacy pricing plans data (without text content - handled by translations)
export const pricingPlansData: PricingPlanData[] = [
  {
    name: 'Free',
    featured: false,
    monthlyPrice: 0,
    annualPrice: 0,
    logomarkClassName: 'fill-gray-400',
  },
  {
    name: 'Freelancer',
    featured: false,
    monthlyPrice: 5,
    annualPrice: 48,
    logomarkClassName: 'fill-gray-500',
  },
  {
    name: 'Business',
    featured: true,
    monthlyPrice: 50,
    annualPrice: 480,
    logomarkClassName: 'fill-teal-600',
  },
  {
    name: 'Enterprise',
    featured: false,
    monthlyPrice: 150,
    annualPrice: 1440,
    logomarkClassName: 'fill-red-600',
  },
];

// Legacy pricing plans (deprecated - use with translations)
export const pricingPlans: PricingPlan[] = [
  {
    name: 'Freelancer',
    featured: false,
    monthlyPrice: 5,
    annualPrice: 48,
    description: 'For solo professionals who want invoicing without limits.',
    button: {
      label: 'Get Started',
      href: '/register',
    },
    features: [
      'Unlimited invoices & clients',
      'Swiss QR-bill generation',
      'Payment reconciliation',
      'Priority support',
      'No feature restrictions',
    ],
    logomarkClassName: 'fill-gray-500',
  },
  {
    name: 'Business',
    featured: true,
    monthlyPrice: 50,
    annualPrice: 480,
    description:
      'For SMEs and fiduciaries that need collaboration and more features.',
    button: {
      label: 'Get Started',
      href: '/register',
    },
    features: [
      'Everything in Freelancer',
      'Team management (10 users)',
      'Advanced reminders',
      'Branding control',
      'Organization dashboard',
      'Advanced reporting',
    ],
    logomarkClassName: 'fill-teal-600',
  },
  {
    name: 'Enterprise',
    featured: false,
    monthlyPrice: 150,
    annualPrice: 1440,
    description: 'For large fiduciaries and corporates with advanced needs.',
    button: {
      label: 'Get Started',
      href: '/register',
    },
    features: [
      'Everything in Business',
      'Unlimited users',
      'Dedicated support / SLA',
      'Advanced security',
      'Early access to AI features',
      'Custom requests',
    ],
    logomarkClassName: 'fill-red-600',
  },
];

// Feature comparison table data (with translation keys)
export const featureComparisonData: FeatureComparisonRowData[] = [
  {
    featureKey: 'invoices',
    icon: FileText,
    free: 'Unlimited',
    freelancer: 'Unlimited',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    featureKey: 'clients',
    icon: Users,
    free: 'Unlimited',
    freelancer: 'Unlimited',
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
    featureKey: 'support',
    icon: HeadphonesIcon,
    free: 'Community',
    freelancer: 'Priority',
    business: 'Priority',
    enterprise: 'Dedicated SLA',
  },
];

// Legacy feature comparison (deprecated - use with translations)
export const featureComparison: FeatureComparisonRow[] = [
  {
    feature: 'Invoices',
    icon: FileText,
    free: 'Unlimited',
    freelancer: 'Unlimited',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Clients',
    icon: Users,
    free: 'Unlimited',
    freelancer: 'Unlimited',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Users',
    icon: Users,
    free: '1',
    freelancer: '1',
    business: '10 max',
    enterprise: 'Unlimited',
  },
  {
    feature: 'QR-bill invoices',
    icon: FileText,
    free: 'check',
    freelancer: 'check',
    business: 'check',
    enterprise: 'check',
  },
  {
    feature: 'Payment reconciliation',
    icon: CreditCard,
    free: 'check',
    freelancer: 'check',
    business: 'check',
    enterprise: 'check',
  },
  {
    feature: 'Reminders',
    icon: Bell,
    free: 'Basic',
    freelancer: 'Basic',
    business: 'Advanced',
    enterprise: 'Advanced',
  },
  {
    feature: 'Reports / Data exports',
    icon: BarChart3,
    free: 'check',
    freelancer: 'check',
    business: 'check',
    enterprise: 'check',
  },
  {
    feature: 'Branding control',
    icon: Palette,
    free: 'cross',
    freelancer: 'cross',
    business: 'check',
    enterprise: 'check',
  },
  {
    feature: 'Team management',
    icon: Users,
    free: 'cross',
    freelancer: 'cross',
    business: 'check',
    enterprise: 'check',
  },
  {
    feature: 'Support',
    icon: HeadphonesIcon,
    free: 'Community',
    freelancer: 'Priority',
    business: 'Priority',
    enterprise: 'Dedicated SLA',
  },
];

// Currency configuration
export const CURRENCY_CONFIG = {
  CHF: {
    symbol: 'CHF',
    code: 'CHF',
    region: 'CH',
    locales: ['de-CH', 'en-CH'],
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    region: 'EU',
    locales: ['en', 'de', 'fr', 'it'],
  },
} as const;

// Pricing configuration constants (non-text data)
export const PRICING_CONSTANTS = {
  annualDiscountPercent: 20,
  defaultCurrency: 'CHF',
  billingPeriods: ['Monthly', 'Annually'],
} as const;

// Helper function to get currency based on locale
export function getCurrencyForLocale(
  locale: string
): keyof typeof CURRENCY_CONFIG {
  // Swiss locales use CHF
  if (locale === 'de-CH' || locale === 'en-CH') {
    return 'CHF';
  }
  // All other locales use EUR
  return 'EUR';
}

// Helper function to get currency symbol
export function getCurrencySymbol(locale: string): string {
  const currency = getCurrencyForLocale(locale);
  return CURRENCY_CONFIG[currency].symbol;
}

// Helper function to get currency code
export function getCurrencyCode(locale: string): string {
  const currency = getCurrencyForLocale(locale);
  return CURRENCY_CONFIG[currency].code;
}

// Helper function to get pricing plans for a specific locale
export function getPricingPlansForLocale(locale: string): PricingPlanData[] {
  const currency = getCurrencyForLocale(locale);

  return pricingPlansWithCurrencies.map((plan) => ({
    name: plan.name,
    featured: plan.featured,
    monthlyPrice: plan.prices[currency].monthly,
    annualPrice: plan.prices[currency].annual,
    logomarkClassName: plan.logomarkClassName,
  }));
}

// Helper function to get a specific plan's price for a locale
export function getPlanPriceForLocale(
  planName: string,
  locale: string,
  period: 'monthly' | 'annual'
): number {
  const currency = getCurrencyForLocale(locale);
  const plan = pricingPlansWithCurrencies.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase()
  );

  if (!plan) return 0;

  return period === 'monthly'
    ? plan.prices[currency].monthly
    : plan.prices[currency].annual;
}

// Legacy pricing configuration (deprecated - use with translations)
export const pricingConfig: PricingConfig = {
  plans: pricingPlans,
  featureComparison,
  annualDiscountPercent: 20,
  currency: 'CHF',
  billingPeriods: ['Monthly', 'Annually'],
  sectionTitle: 'Simple pricing for Swiss businesses.',
  sectionDescription:
    "From freelancers to enterprises, we've got the perfect plan for your invoicing needs. Start with our free plan and upgrade as you grow.",
  comparisonTitle: 'Compare all features',
  comparisonDescription:
    "See exactly what's included in each plan to choose the perfect fit for your business",
  annualBillingBadge: 'Save 20% with annual billing',
  footerText:
    'All plans include Swiss QR-bill compliance and payment reconciliation.',
  footerLink: {
    text: 'Start with Free plan →',
    href: '/register',
  },
};

// Helper functions for pricing calculations
export function getPlanByName(name: string): PricingPlan | undefined {
  return pricingPlans.find(
    (plan) => plan.name.toLowerCase() === name.toLowerCase()
  );
}

export function getPlanDataByName(name: string): PricingPlanData | undefined {
  return pricingPlansData.find(
    (plan) => plan.name.toLowerCase() === name.toLowerCase()
  );
}

export function getFeaturedPlan(): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.featured);
}

export function getFeaturedPlanData(): PricingPlanData | undefined {
  return pricingPlansData.find((plan) => plan.featured);
}

export function getFreePlanInfo() {
  return {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for getting started with Swiss invoicing.',
    features: [
      '5 invoices per month',
      'Swiss QR-bill generation',
      'Payment reconciliation',
      'Community support',
    ],
  };
}

export function getFreePlanData() {
  return {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
  };
}

// Helper function to create translated feature comparison rows
export function createTranslatedFeatureComparison(
  t: (key: string) => string
): FeatureComparisonRow[] {
  return featureComparisonData.map((row) => ({
    ...row,
    feature: t(`featureComparison.${row.featureKey}`),
  }));
}

// Helper function to create translated pricing plans
export function createTranslatedPricingPlans(
  t: (key: string) => string,
  tRaw: (key: string) => string[]
): PricingPlan[] {
  return pricingPlansData.map((plan) => {
    const planKey = plan.name.toLowerCase();
    return {
      ...plan,
      description: t(`plans.${planKey}.description`),
      button: {
        label: t('common.getStarted'),
        href: '/register',
      },
      features: tRaw(`plans.${planKey}.features`),
    };
  });
}

// Export individual configurations for specific use cases
export { pricingPlans as plans };
export { featureComparison as comparisonTable };
export { pricingPlansData as plansData };
export { featureComparisonData as comparisonTableData };
export { pricingPlansWithCurrencies as plansWithCurrencies };
