/**
 * Consent Service for GDPR & Switzerland FADP Compliance
 *
 * Provides comprehensive consent management with audit trails, consent age tracking,
 * granular email types, and consent proof generation for compliance audits.
 */

import { createClient } from '@/lib/supabase/server';
import type {
  ConsentRecord,
  ConsentType,
  ConsentMethod,
  ConsentStatus,
  ConsentRenewalInfo,
  ConsentProof,
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

export class ConsentService {
  private static readonly CONSENT_EXPIRY_DAYS = 730; // 2 years for Switzerland FADP
  private static readonly RENEWAL_REMINDER_DAYS = 30; // 30 days before expiry

  /**
   * Record consent decision with full audit trail
   */
  static async recordConsent(
    consent: ConsentRecord
  ): Promise<{ success: boolean; recordId?: string; error?: string }> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('consent_records')
        .upsert({
          user_id: consent.userId,
          email: consent.email,
          session_id: consent.sessionId,
          consent_type: consent.consentType,
          consent_given: consent.consentGiven,
          consent_withdrawn: consent.consentWithdrawn || false,
          consent_method: consent.consentMethod,
          privacy_policy_version: consent.privacyPolicyVersion,
          consent_form_version: consent.consentFormVersion,
          ip_address: consent.ipAddress,
          user_agent: consent.userAgent,
          consent_given_at: consent.consentGivenAt?.toISOString(),
          consent_withdrawn_at: consent.consentWithdrawnAt?.toISOString(),
          consent_source: consent.consentSource,
          consent_context: consent.consentContext,
          withdrawal_reason: consent.withdrawalReason,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to record consent:', error);
        return { success: false, error: error.message };
      }

      return { success: true, recordId: data.id };
    } catch (error) {
      console.error('Error recording consent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get consent status for a user
   */
  static async getConsentStatus(
    userId?: string,
    email?: string
  ): Promise<{ success: boolean; status?: ConsentStatus[]; error?: string }> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc('get_user_consent_status', {
        p_user_id: userId,
        p_email: email,
      });

      if (error) {
        console.error('Failed to get consent status:', error);
        return { success: false, error: error.message };
      }

      const status: ConsentStatus[] = data.map(
        (record: Record<string, unknown>) => ({
          consentType: record.consent_type as string,
          consentGiven: record.consent_given as boolean,
          consentGivenAt: record.consent_given_at
            ? new Date(record.consent_given_at as string)
            : undefined,
          consentWithdrawn: record.consent_withdrawn as boolean,
          consentWithdrawnAt: record.consent_withdrawn_at
            ? new Date(record.consent_withdrawn_at as string)
            : undefined,
          consentAgeDays: record.consent_age_days as number,
          isValid: record.is_valid as boolean,
        })
      );

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
   * Check if consent needs renewal
   */
  static async checkConsentRenewal(
    userId?: string,
    email?: string
  ): Promise<{
    success: boolean;
    renewals?: ConsentRenewalInfo[];
    error?: string;
  }> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc(
        'check_consent_renewal_required',
        {
          p_user_id: userId,
          p_email: email,
        }
      );

      if (error) {
        console.error('Failed to check consent renewal:', error);
        return { success: false, error: error.message };
      }

      const renewals: ConsentRenewalInfo[] = data.map(
        (record: Record<string, unknown>) => ({
          consentType: record.consent_type as string,
          needsRenewal: record.needs_renewal as boolean,
          daysUntilExpiry: record.days_until_expiry as number,
        })
      );

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
   * Withdraw consent with audit trail
   */
  static async withdrawConsent(
    consentType: ConsentType,
    userId?: string,
    email?: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from('consent_records')
        .update({
          consent_withdrawn: true,
          consent_withdrawn_at: new Date().toISOString(),
          withdrawal_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .match({
          user_id: userId,
          email: email,
          consent_type: consentType,
          consent_given: true,
          consent_withdrawn: false,
        });

      if (error) {
        console.error('Failed to withdraw consent:', error);
        return { success: false, error: error.message };
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
   * Check if email type requires marketing consent
   */
  static async emailTypeRequiresMarketingConsent(
    emailType: EmailType
  ): Promise<boolean> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.rpc(
        'email_type_requires_marketing_consent',
        {
          p_email_type: emailType,
        }
      );

      if (error) {
        console.error('Failed to check email type consent requirement:', error);
        return true; // Default to requiring consent for safety
      }

      return data || false;
    } catch (error) {
      console.error('Error checking email type consent requirement:', error);
      return true; // Default to requiring consent for safety
    }
  }

  /**
   * Generate consent proof for compliance audits
   */
  static async generateConsentProof(
    userId?: string,
    email?: string
  ): Promise<{ success: boolean; proof?: ConsentProof; error?: string }> {
    try {
      const statusResult = await this.getConsentStatus(userId, email);
      if (!statusResult.success || !statusResult.status) {
        return { success: false, error: statusResult.error };
      }

      // Get full consent records
      const supabase = await createClient();
      const { data: records, error } = await supabase
        .from('consent_records')
        .select('*')
        .or(`user_id.eq.${userId},email.eq.${email}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to get consent records:', error);
        return { success: false, error: error.message };
      }

      const consentRecords: ConsentRecord[] = records.map(
        (record: Record<string, unknown>) => ({
          id: record.id as string,
          userId: record.user_id as string,
          email: record.email as string,
          sessionId: record.session_id as string,
          consentType: record.consent_type as ConsentType,
          consentGiven: record.consent_given as boolean,
          consentWithdrawn: record.consent_withdrawn as boolean,
          consentMethod: record.consent_method as ConsentMethod,
          privacyPolicyVersion: record.privacy_policy_version as string,
          consentFormVersion: record.consent_form_version as string,
          ipAddress: record.ip_address as string,
          userAgent: record.user_agent as string,
          consentGivenAt: record.consent_given_at
            ? new Date(record.consent_given_at as string)
            : undefined,
          consentWithdrawnAt: record.consent_withdrawn_at
            ? new Date(record.consent_withdrawn_at as string)
            : undefined,
          consentSource: record.consent_source as string,
          consentContext: record.consent_context as Record<string, unknown>,
          withdrawalReason: record.withdrawal_reason as string,
        })
      );

      const generatedAt = new Date();
      const validUntil = new Date(generatedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours

      // Generate proof hash for integrity
      const proofData = {
        userId,
        email,
        records: consentRecords,
        generatedAt: generatedAt.toISOString(),
        validUntil: validUntil.toISOString(),
      };

      const proofHash = await this.generateHash(JSON.stringify(proofData));

      const proof: ConsentProof = {
        userId,
        email,
        consentRecords,
        generatedAt,
        validUntil,
        proofHash,
      };

      return { success: true, proof };
    } catch (error) {
      console.error('Error generating consent proof:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Enhanced cookie-email integration with consent recording
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
      const consentRecords: ConsentRecord[] = [];

      // Record marketing cookie consent
      consentRecords.push({
        userId,
        email,
        sessionId: context?.sessionId,
        consentType: 'marketing_cookies',
        consentGiven: preferences.marketing,
        consentMethod: 'cookie_banner',
        privacyPolicyVersion: '1.0', // Should be dynamic
        consentFormVersion: '1.0', // Should be dynamic
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
        consentGivenAt: new Date(),
        consentSource: context?.source || 'cookie_banner',
        consentContext: { preferences },
      });

      // Record analytics cookie consent
      consentRecords.push({
        userId,
        email,
        sessionId: context?.sessionId,
        consentType: 'analytics_cookies',
        consentGiven: preferences.analytics,
        consentMethod: 'cookie_banner',
        privacyPolicyVersion: '1.0',
        consentFormVersion: '1.0',
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
        consentGivenAt: new Date(),
        consentSource: context?.source || 'cookie_banner',
        consentContext: { preferences },
      });

      // Record all consent decisions
      for (const record of consentRecords) {
        const result = await this.recordConsent(record);
        if (!result.success) {
          console.error('Failed to record consent:', result.error);
        }
      }

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
   * Generate hash for consent proof integrity
   */
  private static async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get consent statistics for compliance reporting
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
      const supabase = await createClient();

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
