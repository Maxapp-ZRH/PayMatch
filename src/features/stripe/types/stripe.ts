/**
 * Stripe Types
 *
 * Type definitions for Stripe integration, following the auth feature pattern.
 * All Stripe-related types are centralized here for consistency.
 */

import { PlanName, BillingPeriod } from '@/config/plans';

// Stripe customer types
export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  metadata: Record<string, string>;
}

// Stripe subscription types
export interface StripeSubscription {
  id: string;
  customerId: string;
  status:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  planId: string;
  planName: PlanName;
  billingCycle: BillingPeriod;
}

// Stripe checkout session types
export interface CreateCheckoutSessionData {
  planName: PlanName;
  billingCycle: BillingPeriod;
  orgId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

// Customer Portal types are defined in create-portal-session.ts

// Stripe webhook event types
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  created: number;
}

// Plan selection types
export interface PlanSelectionData {
  planName: PlanName;
  billingCycle: BillingPeriod;
  price: number; // in cents
  priceCHF: number; // converted to CHF
}

// Stripe price mapping
export interface StripePriceMapping {
  planName: PlanName;
  billingCycle: BillingPeriod;
  priceId: string;
}

// Organization plan update types
export interface UpdateOrganizationPlanData {
  orgId: string;
  planName: PlanName;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
  billingCycle?: BillingPeriod;
}

export interface UpdateOrganizationPlanResult {
  success: boolean;
  message: string;
  error?: string;
}
