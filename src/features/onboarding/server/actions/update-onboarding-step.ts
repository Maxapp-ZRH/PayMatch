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

interface OrganizationUpdateData {
  onboarding_step: number;
  updated_at: string;
  name?: string;
  legal_name?: string;
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
  vat_number?: string;
  phone?: string;
  website?: string;
  default_currency?: string;
  default_language?: string;
  timezone?: string;
  default_payment_terms_days?: number;
  invoice_numbering?: string;
  email_notifications?: boolean;
  auto_reminders?: boolean;
  reminder_days?: string;
}

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

    // Prepare update data
    const updateData: OrganizationUpdateData = {
      onboarding_step: data.step,
      updated_at: new Date().toISOString(),
    };

    // If stepData is provided, update organization fields based on the step
    if (data.stepData && Object.keys(data.stepData).length > 0) {
      // Step 2: Company Details
      if (data.step === 2) {
        if ('companyName' in data.stepData && data.stepData.companyName) {
          updateData.name = data.stepData.companyName as string;
          updateData.legal_name = data.stepData.companyName as string;
        }
        if ('address' in data.stepData && data.stepData.address) {
          updateData.street = data.stepData.address as string;
        }
        if ('city' in data.stepData && data.stepData.city) {
          updateData.city = data.stepData.city as string;
        }
        if ('postalCode' in data.stepData && data.stepData.postalCode) {
          updateData.zip = data.stepData.postalCode as string;
        }
        if ('country' in data.stepData && data.stepData.country) {
          updateData.country = data.stepData.country as string;
        }
        if ('vatNumber' in data.stepData && data.stepData.vatNumber) {
          updateData.vat_number = data.stepData.vatNumber as string;
        }
        if ('phone' in data.stepData && data.stepData.phone) {
          updateData.phone = data.stepData.phone as string;
        }
        if ('website' in data.stepData && data.stepData.website) {
          updateData.website = data.stepData.website as string;
        }
      }

      // Step 3: Settings
      if (data.step === 3) {
        if (
          'defaultCurrency' in data.stepData &&
          data.stepData.defaultCurrency
        ) {
          updateData.default_currency = data.stepData.defaultCurrency as string;
        }
        if ('language' in data.stepData && data.stepData.language) {
          updateData.default_language = data.stepData.language as string;
        }
        if ('timezone' in data.stepData && data.stepData.timezone) {
          updateData.timezone = data.stepData.timezone as string;
        }
        if ('paymentTerms' in data.stepData && data.stepData.paymentTerms) {
          updateData.default_payment_terms_days = parseInt(
            data.stepData.paymentTerms as string
          );
        }
        if (
          'invoiceNumbering' in data.stepData &&
          data.stepData.invoiceNumbering
        ) {
          updateData.invoice_numbering = data.stepData
            .invoiceNumbering as string;
        }
        if (
          'emailNotifications' in data.stepData &&
          data.stepData.emailNotifications !== undefined
        ) {
          updateData.email_notifications = data.stepData
            .emailNotifications as boolean;
        }
        if (
          'autoReminders' in data.stepData &&
          data.stepData.autoReminders !== undefined
        ) {
          updateData.auto_reminders = data.stepData.autoReminders as boolean;
        }
        if ('reminderDays' in data.stepData && data.stepData.reminderDays) {
          updateData.reminder_days = data.stepData.reminderDays as string;
        }
      }
    }

    // Update organization
    const { error: updateError } = await supabase
      .from('organizations')
      .update(updateData)
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
