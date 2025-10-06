/**
 * Update Organization Plan Server Action
 *
 * Updates organization plan after successful Stripe subscription.
 * Handles both free and paid plans.
 */

'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import type {
  UpdateOrganizationPlanData,
  UpdateOrganizationPlanResult,
} from '../../types';

export async function updateOrganizationPlan(
  data: UpdateOrganizationPlanData
): Promise<UpdateOrganizationPlanResult> {
  try {
    const supabase = supabaseAdmin;

    // Update organization plan
    const updateData: {
      plan: string;
      updated_at: string;
      stripe_customer_id?: string | null;
      stripe_subscription_id?: string | null;
      stripe_subscription_status?: string | null;
    } = {
      plan: data.planName,
      updated_at: new Date().toISOString(),
    };

    // Add Stripe-specific fields for paid plans
    if (data.planName !== 'free') {
      if (data.stripeCustomerId) {
        updateData.stripe_customer_id = data.stripeCustomerId;
      }
      if (data.stripeSubscriptionId) {
        updateData.stripe_subscription_id = data.stripeSubscriptionId;
      }
      if (data.stripeSubscriptionStatus) {
        updateData.stripe_subscription_status = data.stripeSubscriptionStatus;
      }
    } else {
      // Clear Stripe fields for free plan
      updateData.stripe_customer_id = null;
      updateData.stripe_subscription_id = null;
      updateData.stripe_subscription_status = null;
    }

    console.log('Attempting to update organization:', {
      orgId: data.orgId,
      updateData,
    });

    const { error: updateError } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', data.orgId);

    if (updateError) {
      console.error('Error updating organization plan:', updateError);
      return {
        success: false,
        message: 'Failed to update organization plan',
        error: updateError.message,
      };
    }

    console.log('Successfully updated organization plan in database');

    return {
      success: true,
      message: `Organization plan updated to ${data.planName}`,
    };
  } catch (error) {
    console.error('Error updating organization plan:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
