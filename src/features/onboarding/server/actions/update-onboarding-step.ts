/**
 * Update Onboarding Step Server Action
 *
 * Updates the current onboarding step for an organization.
 * Used to track progress through the onboarding wizard.
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { syncEmailPreferences } from '@/features/email';

import type {
  UpdateOnboardingStepData,
  UpdateOnboardingStepResult,
} from '../../types';

interface OrganizationUpdateData {
  onboarding_step: number;
  updated_at: string;
  plan?: string;
  name?: string;
  legal_name?: string;
  address_line_1?: string;
  address_line_2?: string;
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
  canton?: string;
  uid?: string;
  iban?: string;
  qr_iban?: string;
  legal_entity_type?: string;
  default_vat_rates?: Array<{
    name: string;
    rate: number;
    type: 'standard' | 'reduced' | 'zero';
  }>;
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
      // Step 1: Plan Selection
      if (data.step === 1) {
        if ('plan' in data.stepData && data.stepData.plan) {
          updateData.plan = data.stepData.plan as string;
        }
        if ('billingCycle' in data.stepData && data.stepData.billingCycle) {
          // Store billing cycle in a custom field or handle via Stripe
          // For now, we'll handle this through Stripe subscription data
        }
      }

      // Step 2: Company Details
      if (data.step === 2) {
        if ('companyName' in data.stepData && data.stepData.companyName) {
          updateData.name = data.stepData.companyName as string;
          updateData.legal_name = data.stepData.companyName as string;
        }
        if ('address_line_1' in data.stepData && data.stepData.address_line_1) {
          updateData.address_line_1 = data.stepData.address_line_1 as string;
        }
        if ('address_line_2' in data.stepData && data.stepData.address_line_2) {
          updateData.address_line_2 = data.stepData.address_line_2 as string;
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
        if ('phone' in data.stepData && data.stepData.phone) {
          updateData.phone = data.stepData.phone as string;
        }
        if ('website' in data.stepData && data.stepData.website) {
          updateData.website = data.stepData.website as string;
        }
        if ('canton' in data.stepData && data.stepData.canton) {
          updateData.canton = data.stepData.canton as string;
        }
        if ('uidVatNumber' in data.stepData && data.stepData.uidVatNumber) {
          // Store the same value in both uid and vat_number fields
          updateData.uid = data.stepData.uidVatNumber as string;
          updateData.vat_number = data.stepData.uidVatNumber as string;
        }
        if ('iban' in data.stepData && data.stepData.iban) {
          updateData.iban = data.stepData.iban as string;
        }
        if ('qrIban' in data.stepData && data.stepData.qrIban) {
          updateData.qr_iban = data.stepData.qrIban as string;
        }
        if (
          'legalEntityType' in data.stepData &&
          data.stepData.legalEntityType
        ) {
          updateData.legal_entity_type = data.stepData
            .legalEntityType as string;
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
        // Always set standard Swiss VAT rates for Swiss businesses
        updateData.default_vat_rates = [
          { name: 'Standard Rate', rate: 7.7, type: 'standard' },
          { name: 'Reduced Rate', rate: 2.5, type: 'reduced' },
          { name: 'Zero Rate', rate: 0, type: 'zero' },
        ];
        if (
          'defaultVatRates' in data.stepData &&
          data.stepData.defaultVatRates
        ) {
          updateData.default_vat_rates = data.stepData
            .defaultVatRates as Array<{
            name: string;
            rate: number;
            type: 'standard' | 'reduced' | 'zero';
          }>;
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

    // Sync email preferences if this is the settings step (step 3)
    if (data.step === 3 && data.stepData) {
      try {
        const emailSettings = {
          emailNotifications: Boolean(data.stepData.emailNotifications ?? true),
          autoReminders: Boolean(data.stepData.autoReminders ?? true),
          reminderDays:
            typeof data.stepData.reminderDays === 'string'
              ? data.stepData.reminderDays
              : undefined,
        };

        // Get user email from organization (use billing_email as fallback)
        const { data: orgData } = await supabase
          .from('organizations')
          .select('owner_email, billing_email')
          .eq('id', data.orgId)
          .single();

        const userEmail =
          orgData?.owner_email || orgData?.billing_email || user.email;
        if (userEmail) {
          await syncEmailPreferences(userEmail, emailSettings, user.id);
        }
      } catch (emailError) {
        console.error('Failed to sync email preferences:', emailError);
        // Don't fail the entire operation if email sync fails
      }
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
