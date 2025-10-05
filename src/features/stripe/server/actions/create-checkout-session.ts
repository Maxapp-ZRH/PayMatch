/**
 * Create Stripe Checkout Session Server Action
 *
 * Creates a Stripe checkout session for paid plans.
 * Handles both monthly and annual billing cycles.
 */

'use server';

import { stripe, getStripePriceId } from '../services/stripe-client';
import { createClient } from '@/lib/supabase/server';
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

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        org_id: org.id,
        user_id: user.id,
        plan_name: data.planName,
        billing_cycle: data.billingCycle,
      },
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
