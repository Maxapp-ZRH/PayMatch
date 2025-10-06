/**
 * Create Stripe Checkout Session Server Action
 *
 * Creates a Stripe checkout session for paid plans.
 * Handles both monthly and annual billing cycles.
 */

'use server';

import { stripe, getStripePriceId } from '../services/stripe-client';
import { createClient } from '@/lib/supabase/server';
import { getSwissCustomText } from '../../config/branding';
import type {
  CreateCheckoutSessionData,
  CheckoutSessionResult,
} from '../../types';

export async function createCheckoutSession(
  data: CreateCheckoutSessionData
): Promise<CheckoutSessionResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    // Get organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, stripe_customer_id')
      .eq('id', data.orgId)
      .single();

    if (orgError || !org) {
      return {
        success: false,
        error: 'Organization not found',
      };
    }

    // Get Stripe price ID
    const priceId = getStripePriceId(data.planName, data.billingCycle);

    // Create or get Stripe customer
    let customerId = org.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: org.name,
        metadata: {
          paymatch_org_id: org.id,
          paymatch_user_id: user.id,
        },
      });

      customerId = customer.id;

      // Update organization with Stripe customer ID
      await supabase
        .from('organizations')
        .update({ stripe_customer_id: customerId })
        .eq('id', org.id);
    }

    // Create checkout session with flexible billing mode
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      // Remove payment_method_types to enable Dashboard-managed payment methods
      // This enables Swiss payment methods (PostFinance, Twint, etc.) and European methods (SEPA, SOFORT, etc.)
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      submit_type: 'subscribe', // Swiss subscription-specific submit button
      currency: 'CHF', // Swiss Franc - enables Swiss payment methods
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      // Swiss market branding and localization
      locale: 'auto', // Auto-detect customer locale
      custom_text: {
        submit: {
          message: getSwissCustomText('en-CH').submit,
        },
        after_submit: {
          message: getSwissCustomText('en-CH').after_submit,
        },
        terms_of_service_acceptance: {
          message: getSwissCustomText('en-CH').terms_of_service,
        },
      },
      // Swiss legal compliance
      consent_collection: {
        terms_of_service: 'required', // Required for Swiss data protection compliance
        payment_method_reuse_agreement: {
          position: 'hidden', // Hide default text, use custom Swiss text
        },
      },
      metadata: {
        org_id: org.id,
        user_id: user.id,
        plan_name: data.planName,
        billing_cycle: data.billingCycle,
      },
      // Automatically charge customer's payment method
      payment_method_collection: 'always',
      subscription_data: {
        metadata: {
          org_id: org.id,
          user_id: user.id,
          plan_name: data.planName,
          billing_cycle: data.billingCycle,
        },
      },
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url!,
    };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create checkout session',
    };
  }
}
