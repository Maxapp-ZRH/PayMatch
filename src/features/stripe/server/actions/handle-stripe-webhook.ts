/**
 * Handle Stripe Webhook Server Action
 *
 * Processes Stripe webhook events for subscription management.
 * Updates organization plans based on subscription status changes.
 */

'use server';

import {
  stripe,
  validateStripeWebhookSignature,
} from '../services/stripe-client';
import { updateOrganizationPlan } from './update-organization-plan';
import type { PlanName } from '@/config/plans';

export interface WebhookResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function handleStripeWebhook(
  payload: string,
  signature: string
): Promise<WebhookResult> {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return {
        success: false,
        message: 'Webhook secret not configured',
      };
    }

    // Validate webhook signature
    const event = validateStripeWebhookSignature(
      payload,
      signature,
      webhookSecret
    );

    console.log('Processing Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata as Record<string, string>;
        const { org_id, plan_name } = metadata;

        if (org_id && plan_name) {
          const result = await updateOrganizationPlan({
            orgId: org_id,
            planName: plan_name as PlanName,
            stripeCustomerId: session.customer as string,
          });

          if (!result.success) {
            console.error('Failed to update organization plan:', result.error);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const metadata = subscription.metadata as Record<string, string>;
        const { org_id, plan_name } = metadata;

        if (org_id && plan_name) {
          const result = await updateOrganizationPlan({
            orgId: org_id,
            planName: plan_name as PlanName,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
          });

          if (!result.success) {
            console.error('Failed to update organization plan:', result.error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const metadata = subscription.metadata as Record<string, string>;
        const { org_id } = metadata;

        if (org_id) {
          // Downgrade to free plan when subscription is cancelled
          const result = await updateOrganizationPlan({
            orgId: org_id,
            planName: 'free',
          });

          if (!result.success) {
            console.error(
              'Failed to downgrade organization plan:',
              result.error
            );
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as { subscription?: string };
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          );
          const metadata = subscription.metadata as Record<string, string>;
          const { org_id } = metadata;

          if (org_id) {
            console.log(`Payment succeeded for organization ${org_id}`);
            // Could add payment tracking logic here
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as { subscription?: string };
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          );
          const metadata = subscription.metadata as Record<string, string>;
          const { org_id } = metadata;

          if (org_id) {
            console.log(`Payment failed for organization ${org_id}`);
            // Could add payment failure handling logic here
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return {
      success: true,
      message: 'Webhook processed successfully',
    };
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return {
      success: false,
      message: 'Failed to process webhook',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
