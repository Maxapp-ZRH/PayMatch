/**
 * Update Onboarding Step Server Action
 *
 * Updates the current onboarding step for an organization.
 * Used to track progress through the onboarding wizard.
 */

'use server';

import { createClient } from '@/lib/supabase/server';

import type {
  UpdateOnboardingStepData,
  UpdateOnboardingStepResult,
} from '../../types';

export async function updateOnboardingStep(
  data: UpdateOnboardingStepData
): Promise<UpdateOnboardingStepResult> {
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
        message: 'User not authenticated',
      };
    }

    // Update organization onboarding step
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        onboarding_step: data.step,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.orgId);

    if (updateError) {
      console.error('Error updating onboarding step:', updateError);
      return {
        success: false,
        message: 'Failed to update onboarding step',
        error: updateError.message,
      };
    }

    return {
      success: true,
      message: `Onboarding step updated to ${data.step}`,
    };
  } catch (error) {
    console.error('Error updating onboarding step:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
