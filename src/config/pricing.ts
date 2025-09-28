/**
 * Pricing Configuration
 *
 * Centralized pricing data for PayMatch plans including pricing tiers,
 * features, comparison table, and utility functions. This ensures
 * consistent pricing information across all components and pages.
 */

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

export interface FeatureComparisonRow {
  feature: string;
  free: string;
  freelancer: string;
  business: string;
  enterprise: string;
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

// Pricing plans configuration
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

// Feature comparison table data
export const featureComparison: FeatureComparisonRow[] = [
  {
    feature: 'Invoices',
    free: 'Unlimited',
    freelancer: 'Unlimited',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Clients',
    free: 'Unlimited',
    freelancer: 'Unlimited',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Users',
    free: '1',
    freelancer: '1',
    business: '10 max',
    enterprise: 'Unlimited',
  },
  {
    feature: 'QR-bill invoices',
    free: '✅',
    freelancer: '✅',
    business: '✅',
    enterprise: '✅',
  },
  {
    feature: 'Payment reconciliation',
    free: '✅',
    freelancer: '✅',
    business: '✅',
    enterprise: '✅',
  },
  {
    feature: 'Reminders',
    free: 'Basic',
    freelancer: 'Basic',
    business: 'Advanced',
    enterprise: 'Advanced',
  },
  {
    feature: 'Reports / Data exports',
    free: '✅',
    freelancer: '✅',
    business: '✅',
    enterprise: '✅',
  },
  {
    feature: 'Branding control',
    free: '❌',
    freelancer: '❌',
    business: '✅',
    enterprise: '✅',
  },
  {
    feature: 'Team management',
    free: '❌',
    freelancer: '❌',
    business: '✅',
    enterprise: '✅',
  },
  {
    feature: 'Support',
    free: 'Community',
    freelancer: 'Priority',
    business: 'Priority',
    enterprise: 'Dedicated SLA',
  },
];

// Complete pricing configuration
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

export function getFeaturedPlan(): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.featured);
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

// Export individual configurations for specific use cases
export { pricingPlans as plans };
export { featureComparison as comparisonTable };
