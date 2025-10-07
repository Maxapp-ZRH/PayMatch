/**
 * Onboarding Types
 *
 * Type definitions for the onboarding flow, following the auth feature pattern.
 * All onboarding-related types are centralized here for consistency.
 */

import { PlanName, BillingPeriod } from '@/config/plans';

// Onboarding step types
export type OnboardingStep =
  | 'plan-selection'
  | 'company-details'
  | 'settings'
  | 'success';

// Company details form data
export interface CompanyDetails {
  name: string;
  legal_name?: string;
  street: string;
  zip: string;
  city: string;
  canton: string;
  country: 'CH';
  iban: string;
  qr_iban?: string;
  vat_number?: string;
  uid?: string;
}

// Default settings form data
export interface DefaultSettings {
  default_language: 'de' | 'fr' | 'it' | 'en';
  default_currency: 'CHF';
  default_payment_terms_days: 14 | 30 | 60 | 90;
  timezone: string;
}

// Complete onboarding data
export interface OnboardingData {
  orgId?: string;
  plan?: PlanName;
  billingCycle?: BillingPeriod;
  companyDetails?: CompanyDetails;
  settings?: DefaultSettings;

  // Company details fields (for form handling)
  companyName?: string;
  address?: string;
  address1?: string;
  address2?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  website?: string;
  canton?: string;
  uidVatNumber?: string;
  iban?: string;
  qrIban?: string;
  legalEntityType?: string;

  // Settings fields (for form handling)
  defaultCurrency?: string;
  language?: string;
  timezone?: string;
  invoiceNumbering?: string;
  paymentTerms?: string;
  emailNotifications?: boolean;
  autoReminders?: boolean;
  reminderDays?: string;
  vatRegistered?: boolean;
  defaultVatRates?: Array<{
    name: string;
    rate: number;
    type: 'standard' | 'reduced' | 'zero';
  }>;
}

// Onboarding wizard state
export interface OnboardingWizardState {
  currentStep: number;
  totalSteps: number;
  formData: OnboardingData;
  isLoading: boolean;
  errors: Record<string, string>;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

// Step navigation props
export interface StepNavigationProps {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  isLoading?: boolean;
  canGoBack?: boolean;
  canGoNext?: boolean;
}

// Step component props
export interface StepProps extends StepNavigationProps {
  formData: OnboardingData;
  saveOnBlur?: (data: Partial<OnboardingData>) => void;
  saveImmediately?: (data: Partial<OnboardingData>) => Promise<void>;
  onSubmit?: () => Promise<Partial<OnboardingData> | void>;
}

// Swiss validation result
export interface SwissValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Onboarding completion result
export interface OnboardingCompletionResult {
  success: boolean;
  message: string;
  error?: string;
}

// Server action types
export interface UpdateOnboardingStepData {
  orgId: string;
  step: number;
  stepData?: Record<string, unknown>;
}

export interface UpdateOnboardingStepResult {
  success: boolean;
  message: string;
  error?: string;
}
