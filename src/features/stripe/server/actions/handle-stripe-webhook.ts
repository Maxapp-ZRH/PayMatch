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
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { PlanName } from '@/config/plans';
import type Stripe from 'stripe';

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

    console.log('Processing Stripe webhook event:', {
      type: event.type,
      id: event.id,
      created: event.created,
      livemode: event.livemode,
    });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata as Record<string, string>;
        const { org_id, plan_name } = metadata;

        if (org_id && plan_name) {
          console.log(
            `Processing checkout completion for org ${org_id}, plan ${plan_name}`
          );

          // Update organization plan
          const result = await updateOrganizationPlan({
            orgId: org_id,
            planName: plan_name as PlanName,
            stripeCustomerId: session.customer as string,
          });

          if (!result.success) {
            console.error('Failed to update organization plan:', result.error);
          } else {
            console.log(
              `Successfully updated organization ${org_id} to ${plan_name} plan`
            );

            // Update onboarding step to company-details (step 2)
            const supabase = supabaseAdmin;
            const { error: stepError } = await supabase
              .from('organizations')
              .update({
                onboarding_step: 2,
                updated_at: new Date().toISOString(),
              })
              .eq('id', org_id);

            if (stepError) {
              console.error('Failed to update onboarding step:', stepError);
            } else {
              console.log(
                `Updated onboarding step to 2 for organization ${org_id}`
              );
            }
          }
        } else {
          console.warn(
            'Missing required metadata in checkout.session.completed event:',
            { org_id, plan_name }
          );
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

      case 'invoice.created': {
        const invoice = event.data.object as {
          subscription?: string;
          status: string;
        };
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          );
          const metadata = subscription.metadata as Record<string, string>;
          const { org_id } = metadata;

          if (org_id) {
            console.log(
              `Invoice created for organization ${org_id}, status: ${invoice.status}`
            );
            // Invoice is in draft status, will be finalized in ~1 hour
          }
        }
        break;
      }

      case 'invoice.finalized': {
        const invoice = event.data.object as { subscription?: string };
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          );
          const metadata = subscription.metadata as Record<string, string>;
          const { org_id } = metadata;

          if (org_id) {
            console.log(
              `Invoice finalized for organization ${org_id}, payment will be attempted`
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

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const metadata = subscription.metadata as Record<string, string>;
        const { org_id, plan_name } = metadata;

        if (org_id && plan_name) {
          console.log(
            `Processing subscription creation for org ${org_id}, plan ${plan_name}`
          );

          // Get customer details for billing address
          let billingAddress;
          try {
            const customer = await stripe.customers.retrieve(
              subscription.customer as string
            );
            if (customer && !customer.deleted && customer.address) {
              billingAddress = {
                line1: customer.address.line1 || undefined,
                line2: customer.address.line2 || undefined,
                city: customer.address.city || undefined,
                state: customer.address.state || undefined,
                postal_code: customer.address.postal_code || undefined,
                country: customer.address.country || undefined,
              };
            }
          } catch (error) {
            console.warn(
              'Failed to retrieve customer for billing address:',
              error
            );
          }

          // Get payment method details if available
          let paymentMethodId: string | undefined;
          let paymentMethodType: string | undefined;

          if (subscription.default_payment_method) {
            try {
              const paymentMethod = await stripe.paymentMethods.retrieve(
                subscription.default_payment_method as string
              );
              paymentMethodId = paymentMethod.id;
              paymentMethodType = paymentMethod.type;
            } catch (error) {
              console.warn('Failed to retrieve payment method:', error);
            }
          }

          // Update organization with enhanced subscription details
          const result = await updateOrganizationPlan({
            orgId: org_id,
            planName: plan_name as PlanName,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripeSubscriptionStatus: subscription.status,
            billingAddress,
            subscriptionStartDate: new Date(subscription.created * 1000),
            paymentMethodId,
            paymentMethodType,
            currentPeriodEnd: new Date(
              (
                subscription as Stripe.Subscription & {
                  current_period_end: number;
                }
              ).current_period_end * 1000
            ),
          });

          if (!result.success) {
            console.error(
              'Failed to update organization with subscription:',
              result.error
            );
          } else {
            console.log(
              `Successfully updated organization ${org_id} with subscription ${subscription.id}`
            );
          }
        } else {
          console.warn(
            'Missing required metadata in customer.subscription.created event:',
            { org_id, plan_name }
          );
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const metadata = subscription.metadata as Record<string, string>;
        const { org_id } = metadata;

        if (org_id) {
          console.log(
            `Processing subscription update for org ${org_id}, status: ${subscription.status}`
          );

          // Get updated payment method details if available
          let paymentMethodId: string | undefined;
          let paymentMethodType: string | undefined;

          if (subscription.default_payment_method) {
            try {
              const paymentMethod = await stripe.paymentMethods.retrieve(
                subscription.default_payment_method as string
              );
              paymentMethodId = paymentMethod.id;
              paymentMethodType = paymentMethod.type;
            } catch (error) {
              console.warn('Failed to retrieve payment method:', error);
            }
          }

          // Update subscription status and payment method
          const supabase = supabaseAdmin;
          const updateData: Record<string, string | Date> = {
            stripe_subscription_status: subscription.status,
            stripe_subscription_current_period_end: new Date(
              (
                subscription as Stripe.Subscription & {
                  current_period_end: number;
                }
              ).current_period_end * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Add payment method data if available
          if (paymentMethodId) {
            updateData.stripe_payment_method_id = paymentMethodId;
          }
          if (paymentMethodType) {
            updateData.stripe_payment_method_type = paymentMethodType;
          }

          const { error } = await supabase
            .from('organizations')
            .update(updateData)
            .eq('id', org_id);

          if (error) {
            console.error('Failed to update subscription status:', error);
          } else {
            console.log(
              `Updated subscription status for organization ${org_id}`
            );
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const metadata = subscription.metadata as Record<string, string>;
        const { org_id } = metadata;

        if (org_id) {
          console.log(`Processing subscription cancellation for org ${org_id}`);

          // Downgrade to free plan
          const result = await updateOrganizationPlan({
            orgId: org_id,
            planName: 'free',
          });

          if (!result.success) {
            console.error(
              'Failed to downgrade organization to free plan:',
              result.error
            );
          } else {
            console.log(
              `Successfully downgraded organization ${org_id} to free plan`
            );
          }
        }
        break;
      }

      // Handle product and price creation events (normal Stripe events)
      case 'product.created':
      case 'price.created':
      case 'plan.created':
        console.log(`Stripe resource created: ${event.type}`);
        break;

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
