/**
 * Server-Side Onboarding Email Preferences Integration Service
 *
 * Server-side version for use in server actions and API routes.
 * Integrates onboarding email notification settings with the GDPR-compliant
 * email preferences system. Ensures proper consent management and compliance.
 */

'use server';

import { EmailPreferencesService } from '@/features/email/email-service';
import { ConsentService } from '@/features/cookies/services/consent-service';
import type { EmailType } from '@/features/cookies/services/consent-service';

export interface OnboardingEmailSettings {
  emailNotifications: boolean;
  autoReminders: boolean;
  reminderDays?: string;
}

export interface EmailPreferencesResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Sync onboarding email settings with email preferences system
 */
export async function syncEmailPreferences(
  userEmail: string,
  settings: OnboardingEmailSettings,
  userId?: string
): Promise<EmailPreferencesResult> {
  try {
    const results = [];

    // Handle business notifications (invoice status changes)
    if (settings.emailNotifications) {
      const businessResult = await enableEmailType(
        userEmail,
        'business_notifications',
        userId
      );
      results.push(businessResult);
    } else {
      const businessResult = await disableEmailType(
        userEmail,
        'business_notifications',
        userId
      );
      results.push(businessResult);
    }

    // Handle overdue alerts
    if (settings.autoReminders) {
      const alertsResult = await enableEmailType(
        userEmail,
        'overdue_alerts',
        userId
      );
      results.push(alertsResult);
    } else {
      const alertsResult = await disableEmailType(
        userEmail,
        'overdue_alerts',
        userId
      );
      results.push(alertsResult);
    }

    // Check if any operations failed
    const failedResults = results.filter((result) => !result.success);
    if (failedResults.length > 0) {
      return {
        success: false,
        message: 'Some email preferences could not be updated',
        error: failedResults.map((r) => r.error).join(', '),
      };
    }

    return {
      success: true,
      message: 'Email preferences updated successfully',
    };
  } catch (error) {
    console.error('Failed to sync email preferences:', error);
    return {
      success: false,
      message: 'Failed to update email preferences',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Enable specific email type with proper consent
 */
async function enableEmailType(
  email: string,
  emailType: EmailType,
  userId?: string
): Promise<EmailPreferencesResult> {
  try {
    // Record consent for business-related emails (necessary for service operation)
    await ConsentService.recordConsent({
      email,
      userId,
      consentType: 'data_processing', // Business notifications are necessary for service operation
      consentGiven: true,
      consentMethod: 'account_settings',
      consentSource: 'onboarding_settings',
      privacyPolicyVersion: '1.0',
      consentFormVersion: '1.0',
      userAgent: undefined, // Not available in server context
    });

    // Enable email preference
    await EmailPreferencesService.subscribe(email, emailType, userId);

    return {
      success: true,
      message: `Enabled ${emailType} emails`,
    };
  } catch (error) {
    console.error(`Failed to enable ${emailType} emails:`, error);
    return {
      success: false,
      message: `Failed to enable ${emailType} emails`,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Disable specific email type
 */
async function disableEmailType(
  email: string,
  emailType: EmailType,
  userId?: string
): Promise<EmailPreferencesResult> {
  try {
    // Record consent withdrawal
    await ConsentService.recordConsent({
      email,
      userId,
      consentType: 'data_processing', // Business notifications are necessary for service operation
      consentGiven: false,
      consentMethod: 'account_settings',
      consentSource: 'onboarding_settings',
      privacyPolicyVersion: '1.0',
      consentFormVersion: '1.0',
      userAgent: undefined, // Not available in server context
    });

    // Disable email preference
    await EmailPreferencesService.unsubscribe(email, emailType, userId);

    return {
      success: true,
      message: `Disabled ${emailType} emails`,
    };
  } catch (error) {
    console.error(`Failed to disable ${emailType} emails:`, error);
    return {
      success: false,
      message: `Failed to disable ${emailType} emails`,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get current email preferences for onboarding settings
 */
export async function getCurrentPreferences(email: string): Promise<{
  emailNotifications: boolean;
  autoReminders: boolean;
}> {
  try {
    const [businessPrefs, alertsPrefs] = await Promise.all([
      EmailPreferencesService.getPreferences(email, 'business_notifications'),
      EmailPreferencesService.getPreferences(email, 'overdue_alerts'),
    ]);

    return {
      emailNotifications: businessPrefs.subscriber.isActive,
      autoReminders: alertsPrefs.subscriber.isActive,
    };
  } catch (error) {
    console.error('Failed to get current email preferences:', error);
    // Return default values if we can't fetch preferences
    return {
      emailNotifications: true,
      autoReminders: true,
    };
  }
}

/**
 * Validate email preferences compliance
 */
export async function validateCompliance(email: string): Promise<{
  compliant: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    // Check if user has given consent for business emails
    const consentStatus = await ConsentService.getConsentStatus(
      email,
      'data_processing'
    );

    if (
      !consentStatus.success ||
      !consentStatus.status ||
      consentStatus.status.length === 0
    ) {
      issues.push('No consent recorded for business email notifications');
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  } catch (error) {
    console.error('Failed to validate compliance:', error);
    return {
      compliant: false,
      issues: ['Failed to validate compliance'],
    };
  }
}
