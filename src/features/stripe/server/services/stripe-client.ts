/**
 * Stripe Client Service
 *
 * Centralized Stripe client configuration and initialization.
 * Follows the auth feature pattern for service organization.
 */

import Stripe from 'stripe';

// Initialize Stripe client with service role key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// Stripe price IDs mapping (these should be created in your Stripe dashboard)
export const STRIPE_PRICE_IDS: Record<string, string> = {
  // Freelancer plan
  freelancer_monthly:
    process.env.STRIPE_FREELANCER_MONTHLY_PRICE_ID ||
    'price_freelancer_monthly',
  freelancer_annual:
    process.env.STRIPE_FREELANCER_ANNUAL_PRICE_ID || 'price_freelancer_annual',

  // Business plan
  business_monthly:
    process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || 'price_business_monthly',
  business_annual:
    process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID || 'price_business_annual',

  // Enterprise plan
  enterprise_monthly:
    process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID ||
    'price_enterprise_monthly',
  enterprise_annual:
    process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || 'price_enterprise_annual',
};

/**
 * Get Stripe price ID for a plan and billing cycle
 */
export function getStripePriceId(
  planName: string,
  billingCycle: string
): string {
  const key = `${planName}_${billingCycle}`;
  const priceId = STRIPE_PRICE_IDS[key];

  if (!priceId) {
    throw new Error(
      `Stripe price ID not found for plan: ${planName}, billing: ${billingCycle}`
    );
  }

  return priceId;
}

/**
 * Validate Stripe webhook signature
 */
export function validateStripeWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
