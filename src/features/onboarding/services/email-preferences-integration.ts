/**
 * Onboarding Email Preferences Integration Service
 *
 * Integrates onboarding email notification settings with the GDPR-compliant
 * email preferences system. Ensures proper consent management and compliance.
 */

'use client';

import { EmailPreferencesService } from '@/features/email/email-service';
import { ConsentServiceClient } from '@/features/cookies/services/consent-service-client';
import type { EmailType } from '@/features/cookies/services/consent-service-client';

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

export class OnboardingEmailPreferencesService {
  /**
   * Sync onboarding email settings with email preferences system
   */
  static async syncEmailPreferences(
    userEmail: string,
    settings: OnboardingEmailSettings,
    userId?: string
  ): Promise<EmailPreferencesResult> {
    try {
      const results = [];

      // Handle business notifications (invoice status changes)
      if (settings.emailNotifications) {
        const businessResult = await this.enableEmailType(
          userEmail,
          'business_notifications',
          userId
        );
        results.push(businessResult);
      } else {
        const businessResult = await this.disableEmailType(
          userEmail,
          'business_notifications',
          userId
        );
        results.push(businessResult);
      }

      // Handle overdue alerts
      if (settings.autoReminders) {
        const alertsResult = await this.enableEmailType(
          userEmail,
          'overdue_alerts',
          userId
        );
        results.push(alertsResult);
      } else {
        const alertsResult = await this.disableEmailType(
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
  private static async enableEmailType(
    email: string,
    emailType: EmailType,
    userId?: string
  ): Promise<EmailPreferencesResult> {
    try {
      // Record consent for business-related emails (necessary for service operation)
      await ConsentServiceClient.recordConsent({
        email,
        userId,
        consentType: 'data_processing', // Business notifications are necessary for service operation
        consentGiven: true,
        consentMethod: 'account_settings',
        consentSource: 'onboarding_settings',
        privacyPolicyVersion: '1.0',
        consentFormVersion: '1.0',
        userAgent:
          typeof window !== 'undefined' ? navigator.userAgent : undefined,
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
  private static async disableEmailType(
    email: string,
    emailType: EmailType,
    userId?: string
  ): Promise<EmailPreferencesResult> {
    try {
      // Record consent withdrawal
      await ConsentServiceClient.recordConsent({
        email,
        userId,
        consentType: 'data_processing', // Business notifications are necessary for service operation
        consentGiven: false,
        consentMethod: 'account_settings',
        consentSource: 'onboarding_settings',
        privacyPolicyVersion: '1.0',
        consentFormVersion: '1.0',
        userAgent:
          typeof window !== 'undefined' ? navigator.userAgent : undefined,
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
  static async getCurrentPreferences(email: string): Promise<{
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
  static async validateCompliance(email: string): Promise<{
    compliant: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      // Check if user has given consent for business emails
      const consentStatus = await ConsentServiceClient.getConsentStatus(
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
}
