/**
 * Complete Onboarding Server Action
 *
 * Marks onboarding as completed for an organization.
 * This is called when the user finishes the onboarding wizard.
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export interface CompleteOnboardingData {
  orgId: string;
}

export interface CompleteOnboardingResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function completeOnboarding(
  data: CompleteOnboardingData
): Promise<CompleteOnboardingResult> {
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

    // Update organization onboarding status
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        onboarding_completed: true,
        onboarding_step: 4, // Final step
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.orgId);

    if (updateError) {
      console.error('Error completing onboarding:', updateError);
      return {
        success: false,
        message: 'Failed to complete onboarding',
        error: updateError.message,
      };
    }

    // Note: Only organizations table tracks onboarding completion now
    // This is the single source of truth for onboarding status

    return {
      success: true,
      message: 'Onboarding completed successfully',
    };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
