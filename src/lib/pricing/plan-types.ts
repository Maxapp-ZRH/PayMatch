/**
 * Plan Types and Interfaces
 *
 * Shared TypeScript interfaces for plan-related data structures.
 * Used by both marketing and onboarding components.
 */

import type { PlanName } from '@/config/plans';

// Plan data interface
export interface PlanData {
  name: PlanName;
  displayName: string;
  description: string;
  features: string[];
  featured: boolean;
}

// Plan card props interface
export interface PlanCardProps {
  plan: PlanData;
  monthlyPrice: number;
  annualPrice: number;
  billingPeriod: 'monthly' | 'annual';
  isSelected?: boolean;
  onSelect?: (planName: PlanName) => void;
  variant: 'marketing' | 'onboarding';
  className?: string;
  previousPeriod?: 'monthly' | 'annual';
}

// Feature comparison row interface
export interface FeatureComparisonRow {
  featureKey: string;
  free: string | 'check' | 'cross';
  freelancer: string | 'check' | 'cross';
  business: string | 'check' | 'cross';
  enterprise: string | 'check' | 'cross';
}

// Feature icon props interface
export interface FeatureIconProps {
  value: string | 'check' | 'cross';
  className?: string;
  textColor?: string;
}

// Billing toggle props interface
export interface BillingToggleProps {
  value: 'monthly' | 'annual';
  onChange: (value: 'monthly' | 'annual') => void;
  className?: string;
}

// Plan selection props interface
export interface PlanSelectionProps {
  selectedPlan: PlanName | null;
  billingPeriod: 'monthly' | 'annual';
  onPlanSelect: (plan: PlanName) => void;
  onBillingChange: (period: 'monthly' | 'annual') => void;
  variant: 'marketing' | 'onboarding';
  showComparisonTable?: boolean;
}
