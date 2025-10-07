/**
 * Client-Side Consent Service
 *
 * Client-side version of consent management for browser components.
 * Uses Supabase client-side client instead of server-side client.
 */

import { createClient } from '@/lib/supabase/client';
import type {
  ConsentRecord,
  ConsentType,
  ConsentStatus,
  ConsentRenewalInfo,
  CookiePreferences,
} from '../types/cookie-types';

export type EmailType =
  | 'newsletter_promotional'
  | 'newsletter_informational'
  | 'newsletter_news'
  | 'support'
  | 'transactional'
  | 'security'
  | 'legal'
  | 'business_notifications'
  | 'overdue_alerts';

export class ConsentServiceClient {
  private static readonly CONSENT_EXPIRY_DAYS = 730; // 2 years for Switzerland FADP
  private static readonly RENEWAL_REMINDER_DAYS = 30; // 30 days before expiry

  /**
   * Get cookie preferences from localStorage (client-side)
   */
  static getCookiePreferences(): CookiePreferences | null {
    try {
      const stored = localStorage.getItem('paymatch-cookie-consent');
      if (!stored) return null;

      const preferences = JSON.parse(stored) as CookiePreferences;
      return preferences;
    } catch (error) {
      console.error('Error getting cookie preferences:', error);
      return null;
    }
  }

  /**
   * Record consent decision with full audit trail (client-side)
   * Note: This is a placeholder - actual database recording should be done server-side
   */
  static async recordConsent(
    consent: ConsentRecord
  ): Promise<{ success: boolean; recordId?: string; error?: string }> {
    try {
      // Client-side service only logs the consent
      // Database recording should be handled by server-side API calls
      console.log('Consent record (client-side):', {
        consentType: consent.consentType,
        consentGiven: consent.consentGiven,
        source: consent.consentSource,
        timestamp: new Date().toISOString(),
      });

      // Return success for client-side operations
      return { success: true, recordId: 'client-side-logged' };
    } catch (error) {
      console.error('Error recording consent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get consent status for a user (client-side)
   * Note: This only returns local storage consent, not database records
   */
  static async getConsentStatus(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userId?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _email?: string
  ): Promise<{ success: boolean; status?: ConsentStatus[]; error?: string }> {
    try {
      // Client-side service only returns local storage consent
      const cookiePrefs = this.getCookiePreferences();
      if (!cookiePrefs) {
        return { success: true, status: [] };
      }

      const status: ConsentStatus[] = [];

      // Marketing cookies status
      status.push({
        consentType: 'marketing_cookies',
        consentGiven: cookiePrefs.marketing,
        consentGivenAt: cookiePrefs.marketing ? new Date() : undefined,
        consentWithdrawn: false,
        consentWithdrawnAt: undefined,
        consentAgeDays: 0,
        isValid: cookiePrefs.marketing,
      });

      // Analytics cookies status
      status.push({
        consentType: 'analytics_cookies',
        consentGiven: cookiePrefs.analytics,
        consentGivenAt: cookiePrefs.analytics ? new Date() : undefined,
        consentWithdrawn: false,
        consentWithdrawnAt: undefined,
        consentAgeDays: 0,
        isValid: cookiePrefs.analytics,
      });

      return { success: true, status };
    } catch (error) {
      console.error('Error getting consent status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if consent needs renewal (client-side)
   * Note: This only checks local storage consent, not database records
   */
  static async checkConsentRenewal(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userId?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _email?: string
  ): Promise<{
    success: boolean;
    renewals?: ConsentRenewalInfo[];
    error?: string;
  }> {
    try {
      // Client-side service only checks local storage consent
      const cookiePrefs = this.getCookiePreferences();
      if (!cookiePrefs) {
        return { success: true, renewals: [] };
      }

      const renewals: ConsentRenewalInfo[] = [];

      // Check marketing cookies renewal
      if (cookiePrefs.marketing) {
        renewals.push({
          consentType: 'marketing_cookies',
          needsRenewal: false, // Local storage doesn't track age
          daysUntilExpiry: undefined,
        });
      }

      // Check analytics cookies renewal
      if (cookiePrefs.analytics) {
        renewals.push({
          consentType: 'analytics_cookies',
          needsRenewal: false, // Local storage doesn't track age
          daysUntilExpiry: undefined,
        });
      }

      return { success: true, renewals };
    } catch (error) {
      console.error('Error checking consent renewal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Withdraw consent with audit trail (client-side)
   * Note: This only handles local storage consent, not database records
   */
  static async withdrawConsent(
    consentType: ConsentType,
    userId?: string,
    email?: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Client-side service only logs the withdrawal
      console.log('Consent withdrawal (client-side):', {
        consentType,
        userId,
        email,
        reason,
        timestamp: new Date().toISOString(),
      });

      // Update local storage if it's a cookie-related consent
      if (
        consentType === 'marketing_cookies' ||
        consentType === 'analytics_cookies'
      ) {
        const currentPrefs = this.getCookiePreferences();
        if (currentPrefs) {
          const updatedPrefs = {
            ...currentPrefs,
            marketing:
              consentType === 'marketing_cookies'
                ? false
                : currentPrefs.marketing,
            analytics:
              consentType === 'analytics_cookies'
                ? false
                : currentPrefs.analytics,
          };
          localStorage.setItem(
            'paymatch-cookie-consent',
            JSON.stringify(updatedPrefs)
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error withdrawing consent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if email type requires marketing consent (client-side)
   * Note: This uses hardcoded logic since we can't access database from client
   */
  static async emailTypeRequiresMarketingConsent(
    emailType: EmailType
  ): Promise<boolean> {
    try {
      // Client-side service uses hardcoded logic for email types
      const marketingEmailTypes: EmailType[] = ['newsletter_promotional'];

      const nonMarketingEmailTypes: EmailType[] = [
        'newsletter_informational',
        'newsletter_news',
        'support',
        'transactional',
        'security',
        'legal',
      ];

      if (marketingEmailTypes.includes(emailType)) {
        return true;
      }

      if (nonMarketingEmailTypes.includes(emailType)) {
        return false;
      }

      // Default to requiring consent for unknown types (safety first)
      return true;
    } catch (error) {
      console.error('Error checking email type consent requirement:', error);
      return true; // Default to requiring consent for safety
    }
  }

  /**
   * Enhanced cookie-email integration with consent recording (client-side)
   * Note: Client-side service only handles local operations, not database writes
   */
  static async recordCookieConsentChange(
    preferences: CookiePreferences,
    userId?: string,
    email?: string,
    context?: {
      ipAddress?: string;
      userAgent?: string;
      source?: string;
      sessionId?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Client-side service only logs the consent change
      // Database recording should be handled by server-side API calls
      console.log('Cookie consent changed:', {
        preferences,
        userId,
        email,
        source: context?.source || 'cookie_banner',
        timestamp: new Date().toISOString(),
      });

      // TODO: In a production app, you might want to call a server-side API
      // to record the consent in the database for audit purposes
      // For now, we'll just handle local storage and let the server-side
      // service handle database operations when needed

      return { success: true };
    } catch (error) {
      console.error('Error recording cookie consent change:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get consent statistics for compliance reporting (client-side)
   */
  static async getConsentStatistics(): Promise<{
    success: boolean;
    statistics?: {
      totalConsents: number;
      activeConsents: number;
      withdrawnConsents: number;
      expiringSoon: number;
      consentTypes: Record<string, number>;
    };
    error?: string;
  }> {
    try {
      const supabase = createClient();

      // Get basic statistics
      const { data: stats, error } = await supabase
        .from('consent_records')
        .select(
          'consent_type, consent_given, consent_withdrawn, consent_age_days'
        );

      if (error) {
        console.error('Failed to get consent statistics:', error);
        return { success: false, error: error.message };
      }

      const statistics = {
        totalConsents: stats.length,
        activeConsents: stats.filter(
          (s) => s.consent_given && !s.consent_withdrawn
        ).length,
        withdrawnConsents: stats.filter((s) => s.consent_withdrawn).length,
        expiringSoon: stats.filter(
          (s) => s.consent_age_days && s.consent_age_days > 600
        ).length,
        consentTypes: stats.reduce(
          (acc, stat) => {
            acc[stat.consent_type] = (acc[stat.consent_type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      };

      return { success: true, statistics };
    } catch (error) {
      console.error('Error getting consent statistics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
