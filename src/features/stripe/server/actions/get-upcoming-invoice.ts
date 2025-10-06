/**
 * Get Upcoming Invoice Server Action
 *
 * Retrieves the upcoming invoice for a customer's subscription.
 * Useful for showing customers what they'll be charged next.
 */

'use server';

import { stripe } from '../services/stripe-client';
import { createClient } from '@/lib/supabase/server';

export interface GetUpcomingInvoiceData {
  orgId: string;
}

export interface GetUpcomingInvoiceResult {
  success: boolean;
  invoice?: {
    id: string;
    amount_due: number;
    currency: string;
    period_start: number;
    period_end: number;
    subtotal: number;
    tax: number;
    total: number;
    line_items: Array<{
      description: string;
      amount: number;
      quantity: number;
    }>;
  };
  error?: string;
}

export async function getUpcomingInvoice(
  data: GetUpcomingInvoiceData
): Promise<GetUpcomingInvoiceResult> {
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

    // Get upcoming invoice
    // @ts-expect-error - Stripe TypeScript definitions issue with retrieveUpcoming method
    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: org.stripe_customer_id,
    });

    return {
      success: true,
      invoice: {
        id: upcomingInvoice.id,
        amount_due: upcomingInvoice.amount_due,
        currency: upcomingInvoice.currency,
        period_start: upcomingInvoice.period_start,
        period_end: upcomingInvoice.period_end,
        subtotal: upcomingInvoice.subtotal,
        tax: upcomingInvoice.tax || 0,
        total: upcomingInvoice.total,
        line_items: upcomingInvoice.lines.data,
      },
    };
  } catch (error) {
    console.error('Error getting upcoming invoice:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get upcoming invoice',
    };
  }
}
