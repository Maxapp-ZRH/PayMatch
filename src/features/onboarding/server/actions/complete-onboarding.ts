/**
 * Complete Onboarding Server Action
 *
 * Marks onboarding as completed for an organization.
 * This is called when the user finishes the onboarding wizard.
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { syncEmailPreferences } from '@/features/email';
import { ConsentService } from '@/features/cookies/services/consent-service';

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

    // Set up default email preferences for the user
    try {
      const emailSettings = {
        emailNotifications: true, // Default to enabled
        autoReminders: true, // Default to enabled
      };

      await syncEmailPreferences(user.email!, emailSettings, user.id);
      console.log('Default email preferences set up successfully');
    } catch (emailError) {
      console.error('Failed to set up default email preferences:', emailError);
      // Don't fail onboarding if email setup fails
    }

    // Set up default consent records for GDPR compliance
    try {
      await ConsentService.recordConsent({
        email: user.email!,
        userId: user.id,
        consentType: 'data_processing',
        consentGiven: true,
        consentMethod: 'account_settings',
        consentSource: 'onboarding_wizard',
        privacyPolicyVersion: '1.0',
        consentFormVersion: '1.0',
        userAgent: undefined, // Not available in server context
      });

      await ConsentService.recordConsent({
        email: user.email!,
        userId: user.id,
        consentType: 'marketing_emails',
        consentGiven: false, // Default to false, user can opt-in later
        consentMethod: 'account_settings',
        consentSource: 'onboarding_wizard',
        privacyPolicyVersion: '1.0',
        consentFormVersion: '1.0',
        userAgent: undefined,
      });

      console.log('Default consent records created successfully');
    } catch (consentError) {
      console.error('Failed to set up consent records:', consentError);
      // Don't fail onboarding if consent setup fails
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
