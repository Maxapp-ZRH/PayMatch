/**
 * Create Stripe Customer Portal Session Server Action
 *
 * Creates a Stripe customer portal session for subscription management.
 * Allows customers to update payment methods, view invoices, and manage subscriptions.
 */

'use server';

import { stripe } from '../services/stripe-client';
import { createClient } from '@/lib/supabase/server';

export interface CreatePortalSessionData {
  orgId: string;
  returnUrl?: string;
}

export interface CreatePortalSessionResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function createPortalSession(
  data: CreatePortalSessionData
): Promise<CreatePortalSessionResult> {
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

    // Get organization with Stripe customer ID
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

    if (!org.stripe_customer_id) {
      return {
        success: false,
        error: 'No Stripe customer found for this organization',
      };
    }

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url:
        data.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return {
      success: true,
      url: portalSession.url,
    };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create portal session',
    };
  }
}
