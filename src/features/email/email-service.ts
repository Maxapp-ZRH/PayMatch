/**
 * Centralized Email Service
 *
 * Unified email service that handles all email types with consistent
 * unsubscribe functionality, error handling, and database operations.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import {
  generateUnsubscribeUrl,
  getUnsubscribeHeaders,
  verifyUnsubscribeToken,
} from './unsubscribe';
import { getStandardEmailAttachments } from './email-assets';
import { renderEmailToHtml } from './email-renderer';

// Initialize clients lazily to ensure environment variables are loaded
let resend: Resend | null = null;
let supabase: ReturnType<typeof createClient> | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

function getSupabaseClient() {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      throw new Error('Supabase environment variables are not set');
    }

    supabase = createClient(url, serviceKey);
  }
  return supabase;
}

// Environment variables with fallbacks
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@paymatch.app';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'PayMatch';

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

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  emailType?: EmailType;
  userId?: string;
  tags?: Array<{ name: string; value: string }>;
  attachments?: Array<{
    content?: string;
    filename: string;
    contentId: string;
    contentType?: string;
  }>;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  subscribedAt?: string;
  unsubscribedAt?: string;
}

export interface EmailPreferences {
  email: string;
  userId?: string;
  emailType: EmailType;
  isActive: boolean;
  unsubscribedAt?: string;
}

/**
 * Send email with proper unsubscribe headers and functionality
 */
export async function sendEmail(options: EmailOptions) {
  const {
    to,
    subject,
    html,
    text,
    from = `${FROM_NAME} <${FROM_EMAIL}>`,
    replyTo,
    emailType = 'transactional',
    userId,
    tags = [],
    attachments = [],
  } = options;

  // Generate unsubscribe URL (only for optional email types)
  let unsubscribeUrl: string | undefined;
  let headers: Record<string, string> = {};

  // Skip unsubscribe URLs for mandatory emails (security, transactional, support, legal)
  const mandatoryEmailTypes: EmailType[] = [
    'security',
    'transactional',
    'support',
    'legal',
  ];

  if (!mandatoryEmailTypes.includes(emailType)) {
    try {
      unsubscribeUrl = generateUnsubscribeUrl(
        Array.isArray(to) ? to[0] : to,
        emailType,
        userId
      );

      // Get unsubscribe headers for non-mandatory transactional emails
      headers =
        emailType === 'transactional'
          ? getUnsubscribeHeaders(
              Array.isArray(to) ? to[0] : to,
              emailType,
              userId
            )
          : {};
    } catch (error) {
      // If unsubscribe URL generation fails (e.g., missing env var), continue without it
      console.warn('Could not generate unsubscribe URL:', error);
      unsubscribeUrl = undefined;
      headers = {};
    }
  }

  // Get standard email attachments (logo, etc.)
  const standardAttachments = getStandardEmailAttachments();
  const allAttachments = [...standardAttachments, ...attachments];

  try {
    const resendClient = getResendClient();
    const result = await resendClient.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo: replyTo,
      headers,
      attachments: allAttachments.length > 0 ? allAttachments : undefined,
      tags: [{ name: 'email_type', value: emailType }, ...tags],
    });

    return {
      success: true,
      messageId: result.data?.id,
      unsubscribeUrl,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email with React Email component
 */
export async function sendEmailWithComponent(
  options: Omit<EmailOptions, 'html'> & {
    component: React.ReactElement;
  }
) {
  const { component, ...emailOptions } = options;

  // Generate unsubscribe URL for the email (only for optional email types)
  let unsubscribeUrl: string | undefined;
  const emailType = emailOptions.emailType || 'transactional';

  // Skip unsubscribe URLs for mandatory emails (security, transactional, support, legal)
  const mandatoryEmailTypes: EmailType[] = [
    'security',
    'transactional',
    'support',
    'legal',
  ];

  if (!mandatoryEmailTypes.includes(emailType)) {
    try {
      unsubscribeUrl = generateUnsubscribeUrl(
        Array.isArray(emailOptions.to) ? emailOptions.to[0] : emailOptions.to,
        emailType,
        emailOptions.userId
      );
    } catch (error) {
      // If unsubscribe URL generation fails (e.g., missing env var), continue without it
      console.warn('Could not generate unsubscribe URL:', error);
      unsubscribeUrl = undefined;
    }
  }

  // Clone the component and add unsubscribe URL as a prop only if it exists
  const componentWithUnsubscribe = unsubscribeUrl
    ? React.cloneElement(
        component as React.ReactElement<{ unsubscribeUrl?: string }>,
        { unsubscribeUrl }
      )
    : component;

  const html = await renderEmailToHtml(componentWithUnsubscribe);

  return sendEmail({
    ...emailOptions,
    html,
  });
}

/**
 * Email preferences management
 */
export class EmailPreferencesService {
  /**
   * Subscribe to specific email type
   */
  static async subscribe(
    email: string,
    type: EmailType,
    userId?: string,
    firstName?: string,
    lastName?: string
  ) {
    const supabaseClient = getSupabaseClient();
    const { error } = await (supabaseClient as any)
      .from('email_preferences')
      .upsert({
        email,
        user_id: userId,
        email_type: type,
        first_name: firstName,
        last_name: lastName,
        is_active: true,
        subscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`Failed to subscribe to ${type} emails`);
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
  }

  /**
   * Unsubscribe from specific email type
   */
  static async unsubscribe(email: string, type: EmailType, userId?: string) {
    // Check if this email type is mandatory (cannot be unsubscribed)
    const mandatoryEmailTypes: EmailType[] = [
      'security',
      'transactional',
      'support',
      'legal',
    ];

    if (mandatoryEmailTypes.includes(type)) {
      throw new Error(
        `Cannot unsubscribe from ${type} emails - they are mandatory for account security, support, and legal compliance`
      );
    }

    const supabaseClient = getSupabaseClient();
    const { error } = await (supabaseClient as any)
      .from('email_preferences')
      .upsert({
        email,
        user_id: userId,
        email_type: type,
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`Failed to unsubscribe from ${type} emails`);
    }

    return {
      success: true,
      message: `Successfully unsubscribed from ${type} emails`,
      subscriber: {
        email,
        emailType: type,
      },
    };
  }

  /**
   * Get email preferences info
   */
  static async getPreferences(email: string, type: EmailType) {
    const supabaseClient = getSupabaseClient();
    const { data: preferences, error } = await (supabaseClient as any)
      .from('email_preferences')
      .select('email, email_type, is_active, first_name, last_name')
      .eq('email', email)
      .eq('email_type', type)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error('Failed to fetch email preferences');
    }

    return {
      success: true,
      subscriber: {
        email,
        isActive: preferences?.is_active ?? true,
        emailType: type,
        firstName: preferences?.first_name ?? '',
        lastName: preferences?.last_name ?? '',
      },
    };
  }
}

/**
 * Centralized unsubscribe handler
 */
export class UnsubscribeService {
  /**
   * Handle unsubscribe request with token verification
   */
  static async handleUnsubscribe(token: string) {
    const tokenData = verifyUnsubscribeToken(token);
    if (!tokenData) {
      throw new Error('Invalid or expired unsubscribe token');
    }

    const { email, type, userId } = tokenData;

    switch (type) {
      case 'newsletter_promotional':
      case 'support':
      case 'transactional':
      case 'security':
      case 'legal':
      case 'business_notifications':
      case 'overdue_alerts':
      case 'newsletter_informational':
      case 'newsletter_news':
        return await EmailPreferencesService.unsubscribe(email, type, userId);

      default:
        throw new Error('Invalid email type');
    }
  }

  /**
   * Get subscriber info with token verification
   */
  static async getSubscriberInfo(token: string) {
    const tokenData = verifyUnsubscribeToken(token);
    if (!tokenData) {
      throw new Error('Invalid or expired unsubscribe token');
    }

    const { email, type } = tokenData;

    switch (type) {
      case 'newsletter_promotional':
      case 'support':
      case 'transactional':
      case 'security':
      case 'legal':
      case 'business_notifications':
      case 'overdue_alerts':
      case 'newsletter_informational':
      case 'newsletter_news':
        return await EmailPreferencesService.getPreferences(email, type);

      default:
        throw new Error('Invalid email type');
    }
  }
}

/**
 * Support email service
 */
export class SupportEmailService {
  /**
   * Send support request email
   */
  static async sendSupportRequest(supportData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
    priority: string;
    attachments?: File[];
  }) {
    // This would integrate with the existing support form logic
    // For now, we'll just return the structure
    console.log('Support request data:', supportData);
    return {
      success: true,
      message: 'Support request sent successfully',
    };
  }
}
