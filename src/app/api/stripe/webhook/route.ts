/**
 * Stripe Webhook API Route
 *
 * Handles Stripe webhook events for subscription management.
 * Updates organization plans based on subscription status changes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/features/stripe/server/actions/handle-stripe-webhook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const result = await handleStripeWebhook(body, signature);

    if (result.success) {
      return NextResponse.json({ received: true });
    } else {
      console.error('Webhook processing failed:', result.error);
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
