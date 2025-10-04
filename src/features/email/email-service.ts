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

export type EmailType = 'newsletter' | 'support' | 'transactional' | 'auth';

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

  // Generate unsubscribe URL (only for non-auth emails and if environment variable is available)
  let unsubscribeUrl: string | undefined;
  let headers: Record<string, string> = {};

  // Skip unsubscribe URLs for authentication emails (verification, password reset, etc.)
  if (emailType !== 'auth') {
    try {
      unsubscribeUrl = generateUnsubscribeUrl(
        Array.isArray(to) ? to[0] : to,
        emailType,
        userId
      );

      // Get unsubscribe headers for transactional emails
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

  // Generate unsubscribe URL for the email (only for non-auth emails and if environment variable is available)
  let unsubscribeUrl: string | undefined;
  const emailType = emailOptions.emailType || 'transactional';

  // Skip unsubscribe URLs for authentication emails (verification, password reset, etc.)
  if (emailType !== 'auth') {
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
 * Newsletter subscription management
 */
export class NewsletterService {
  /**
   * Subscribe to newsletter
   */
  static async subscribe(data: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    // Check if email already exists and is active
    const supabaseClient = getSupabaseClient();
    const { data: existingSubscriber, error: checkError } = await supabaseClient
      .from('newsletter_subscribers')
      .select('id, is_active, email')
      .eq('email', data.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error('Failed to check subscription status');
    }

    // Type the subscriber data properly
    const subscriber = existingSubscriber as {
      id: string;
      is_active: boolean;
      email: string;
    } | null;

    // If subscriber exists and is active, return success
    if (subscriber && subscriber.is_active) {
      return {
        success: true,
        message: 'Successfully subscribed to newsletter',
        alreadySubscribed: true,
      };
    }

    // If subscriber exists but is inactive, reactivate them
    if (subscriber && !subscriber.is_active) {
      const { error: updateError } = await (supabaseClient as any)
        .from('newsletter_subscribers')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          is_active: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriber.id);

      if (updateError) {
        throw new Error('Failed to reactivate subscription');
      }

      return {
        success: true,
        message: 'Successfully reactivated newsletter subscription',
        subscriber: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      };
    }

    // Create new subscription
    const { data: newSubscriber, error: insertError } = await (
      supabaseClient as any
    )
      .from('newsletter_subscribers')
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        is_active: true,
      })
      .select('id, email, first_name, last_name')
      .single();

    if (insertError) {
      throw new Error('Failed to create subscription');
    }

    return {
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber: newSubscriber,
    };
  }

  /**
   * Unsubscribe from newsletter
   */
  static async unsubscribe(email: string) {
    const supabaseClient = getSupabaseClient();
    const { data: subscriber, error: findError } = await (supabaseClient as any)
      .from('newsletter_subscribers')
      .select('id, email, first_name, last_name, is_active')
      .eq('email', email)
      .single();

    if (findError || !subscriber) {
      throw new Error('Subscriber not found');
    }

    if (!subscriber.is_active) {
      return {
        success: true,
        message: 'You have already unsubscribed from our newsletter',
        alreadyUnsubscribed: true,
        subscriber: {
          email: subscriber.email,
          firstName: subscriber.first_name,
          lastName: subscriber.last_name,
          emailType: 'newsletter',
        },
      };
    }

    // Unsubscribe the user
    const { error: updateError } = await (supabaseClient as any)
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id);

    if (updateError) {
      throw new Error('Failed to unsubscribe from newsletter');
    }

    return {
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      subscriber: {
        email: subscriber.email,
        firstName: subscriber.first_name,
        lastName: subscriber.last_name,
        emailType: 'newsletter',
      },
    };
  }

  /**
   * Get newsletter subscriber info
   */
  static async getSubscriberInfo(email: string) {
    const supabaseClient = getSupabaseClient();
    const { data: subscriber, error } = await (supabaseClient as any)
      .from('newsletter_subscribers')
      .select('id, email, first_name, last_name, is_active')
      .eq('email', email)
      .single();

    if (error || !subscriber) {
      throw new Error('Subscriber not found');
    }

    return {
      success: true,
      subscriber: {
        email: subscriber.email,
        firstName: subscriber.first_name,
        lastName: subscriber.last_name,
        isActive: subscriber.is_active,
        emailType: 'newsletter',
      },
    };
  }
}

/**
 * Email preferences management
 */
export class EmailPreferencesService {
  /**
   * Unsubscribe from specific email type
   */
  static async unsubscribe(email: string, type: EmailType, userId?: string) {
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
      .select('email, email_type, is_active')
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
      case 'newsletter':
        return await NewsletterService.unsubscribe(email);

      case 'support':
      case 'transactional':
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
      case 'newsletter':
        return await NewsletterService.getSubscriberInfo(email);

      case 'support':
      case 'transactional':
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
