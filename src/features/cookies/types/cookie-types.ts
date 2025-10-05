/**
 * Cookie Types
 *
 * Type definitions for cookie preferences and consent management.
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export type ConsentType =
  | 'marketing_cookies'
  | 'analytics_cookies'
  | 'newsletter_subscription'
  | 'marketing_emails'
  | 'data_processing'
  | 'third_party_sharing';

export type ConsentMethod =
  | 'cookie_banner'
  | 'newsletter_form'
  | 'account_settings'
  | 'email_link'
  | 'api_request'
  | 'admin_action';

export interface ConsentRecord {
  id?: string;
  userId?: string;
  email?: string;
  sessionId?: string;
  consentType: ConsentType;
  consentGiven: boolean;
  consentWithdrawn?: boolean;
  consentMethod: ConsentMethod;
  privacyPolicyVersion?: string;
  consentFormVersion?: string;
  ipAddress?: string;
  userAgent?: string;
  consentGivenAt?: Date;
  consentWithdrawnAt?: Date;
  consentSource?: string;
  consentContext?: Record<string, unknown>;
  withdrawalReason?: string;
}

export interface ConsentStatus {
  consentType: string;
  consentGiven: boolean;
  consentGivenAt?: Date;
  consentWithdrawn?: boolean;
  consentWithdrawnAt?: Date;
  consentAgeDays?: number;
  isValid: boolean;
}

export interface ConsentRenewalInfo {
  consentType: string;
  needsRenewal: boolean;
  daysUntilExpiry?: number;
}

export interface ConsentProof {
  userId?: string;
  email?: string;
  consentRecords: ConsentRecord[];
  generatedAt: Date;
  validUntil: Date;
  proofHash: string;
}
