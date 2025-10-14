/**
 * Server-Side Email Preferences Service
 *
 * Handles email preferences operations on the server-side with proper
 * Supabase client initialization and error handling.
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import type { EmailType } from '../schemas/email';

export interface EmailPreferencesResult {
  success: boolean;
  message: string;
  subscriber?: {
    email: string;
    emailType: EmailType;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
  };
  error?: string;
}
/**
 * Subscribe to specific email type (server-side)
 */
export async function subscribeToEmailType(
  email: string,
  type: EmailType,
  userId?: string,
  firstName?: string,
  lastName?: string
): Promise<EmailPreferencesResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('email_preferences').upsert(
      {
        email,
        user_id: userId,
        email_type: type,
        first_name: firstName,
        last_name: lastName,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'email,email_type',
      }
    );

    if (error) {
      return {
        success: false,
        message: `Failed to subscribe to ${type} emails`,
        error: error.message,
      };
    }

    return {
      success: true,
      message: `Successfully subscribed to ${type} emails`,
      subscriber: {
        email,
        emailType: type,
        firstName,
        lastName,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to subscribe to ${type} emails`,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Unsubscribe from specific email type (server-side)
 */
export async function unsubscribeFromEmailType(
  email: string,
  type: EmailType,
  userId?: string
): Promise<EmailPreferencesResult> {
  try {
    // Check if this email type is mandatory (cannot be unsubscribed)
    const mandatoryEmailTypes: EmailType[] = [
      'security',
      'transactional',
      'support',
      'legal',
      'business_notifications',
      'overdue_alerts',
    ];

    if (mandatoryEmailTypes.includes(type)) {
      return {
        success: false,
        message: `Cannot unsubscribe from ${type} emails - they are mandatory for account security, support, and legal compliance`,
        error: 'MANDATORY_EMAIL_TYPE',
      };
    }

    const supabase = await createClient();

    const { error } = await supabase.from('email_preferences').upsert(
      {
        email,
        user_id: userId,
        email_type: type,
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'email,email_type',
      }
    );

    if (error) {
      return {
        success: false,
        message: `Failed to unsubscribe from ${type} emails`,
        error: error.message,
      };
    }

    return {
      success: true,
      message: `Successfully unsubscribed from ${type} emails`,
      subscriber: {
        email,
        emailType: type,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to unsubscribe from ${type} emails`,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get email preferences info (server-side)
 */
export async function getEmailPreferences(
  email: string,
  type: EmailType
): Promise<EmailPreferencesResult> {
  try {
    const supabase = await createClient();

    const { data: preferences, error } = await supabase
      .from('email_preferences')
      .select('email, email_type, is_active, first_name, last_name')
      .eq('email', email)
      .eq('email_type', type)
      .single();

    if (error && error.code !== 'PGRST116') {
      return {
        success: false,
        message: 'Failed to fetch email preferences',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Email preferences retrieved successfully',
      subscriber: {
        email,
        emailType: type,
        firstName: preferences?.first_name ?? '',
        lastName: preferences?.last_name ?? '',
        isActive: preferences?.is_active ?? true,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch email preferences',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
