/**
 * Cookie-Email Integration Service
 *
 * Handles synchronization between cookie consent preferences and email marketing preferences.
 * Ensures GDPR compliance by connecting marketing cookie consent with email subscriptions.
 */

'use client';

import type { CookiePreferences } from '@/features/cookies/types/cookie-types';

export class CookieEmailIntegrationService {
  private static readonly COOKIE_CONSENT_KEY = 'paymatch-cookie-consent';

  /**
   * Get current cookie preferences from localStorage
   */
  static getCookiePreferences(): CookiePreferences | null {
    if (typeof window === 'undefined') return null;

    const cookieConsent = localStorage.getItem(this.COOKIE_CONSENT_KEY);
    if (!cookieConsent) return null;

    try {
      return JSON.parse(cookieConsent) as CookiePreferences;
    } catch (error) {
      console.error('Failed to parse cookie preferences:', error);
      return null;
    }
  }

  /**
   * Check if marketing cookies are accepted
   */
  static isMarketingConsentGiven(): boolean {
    const preferences = this.getCookiePreferences();
    return preferences?.marketing === true;
  }

  /**
   * Validate newsletter subscription against marketing cookie consent
   */
  static validateNewsletterSubscription(): { valid: boolean; error?: string } {
    const marketingConsent = this.isMarketingConsentGiven();

    if (!marketingConsent) {
      return {
        valid: false,
        error:
          'Marketing cookies must be accepted to subscribe to newsletter. Please accept marketing cookies in the cookie banner first.',
      };
    }

    return { valid: true };
  }

  /**
   * Sync email preferences when marketing cookie consent changes
   */
  static async syncEmailPreferencesWithCookieConsent(
    marketingConsent: boolean,
    userEmail?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!marketingConsent) {
        // If marketing consent is withdrawn, disable marketing emails
        if (userEmail) {
          // Disable marketing email preferences via API
          try {
            await fetch('/api/email/preferences', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                emailType: 'newsletter_promotional',
                isActive: false,
              }),
            });
          } catch (error) {
            console.error(
              'Failed to unsubscribe from marketing emails:',
              error
            );
          }
        }

        return {
          success: true,
          message:
            'Marketing email preferences have been updated based on cookie consent withdrawal.',
        };
      } else {
        // If marketing consent is given, we don't automatically subscribe users
        // They still need to explicitly subscribe to newsletter
        return {
          success: true,
          message:
            'Marketing cookie consent accepted. Users can now subscribe to newsletter.',
        };
      }
    } catch (error) {
      console.error(
        'Failed to sync email preferences with cookie consent:',
        error
      );
      return {
        success: false,
        message: 'Failed to sync email preferences with cookie consent.',
      };
    }
  }

  /**
   * Handle cookie preference changes
   */
  static async handleCookiePreferenceChange(
    preferences: CookiePreferences,
    userEmail?: string
  ): Promise<{ success: boolean; message: string }> {
    // Only sync if marketing preference changed
    const previousPreferences = this.getCookiePreferences();
    const marketingChanged =
      previousPreferences?.marketing !== preferences.marketing;

    if (marketingChanged) {
      return await this.syncEmailPreferencesWithCookieConsent(
        preferences.marketing,
        userEmail
      );
    }

    return {
      success: true,
      message: 'Cookie preferences updated successfully.',
    };
  }

  /**
   * Get user email from auth context (if available)
   */
  static async getCurrentUserEmail(): Promise<string | undefined> {
    try {
      // This would need to be implemented based on your auth system
      // For now, return undefined as we don't have direct access to auth context here
      return undefined;
    } catch (error) {
      console.error('Failed to get current user email:', error);
      return undefined;
    }
  }

  /**
   * Show cookie consent required message
   */
  static getCookieConsentRequiredMessage(): string {
    return 'To subscribe to our newsletter, please first accept marketing cookies in the cookie banner. This ensures we comply with GDPR regulations.';
  }

  /**
   * Check if user can subscribe to newsletter
   */
  static canSubscribeToNewsletter(): {
    canSubscribe: boolean;
    reason?: string;
  } {
    const marketingConsent = this.isMarketingConsentGiven();

    if (!marketingConsent) {
      return {
        canSubscribe: false,
        reason: this.getCookieConsentRequiredMessage(),
      };
    }

    return { canSubscribe: true };
  }
}
