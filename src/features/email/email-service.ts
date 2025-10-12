/**
 * Centralized Email Service
 *
 * Unified email service that handles all email types with consistent
 * unsubscribe functionality, error handling, and database operations.
 */

import React from 'react';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import {
  generateUnsubscribeUrl,
  getUnsubscribeHeaders,
  verifyUnsubscribeToken,
} from './unsubscribe';
import type { EmailType } from './schemas/email';
import { getStandardEmailAttachments } from './email-assets';
import { renderEmailToHtml } from './email-renderer';
import type { Database } from '@/types/database';

// Initialize clients lazily to ensure environment variables are loaded
let resend: Resend | null = null;
let supabase: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Get or create Resend client instance
 *
 * Lazy initialization ensures environment variables are loaded before client creation.
 * Throws an error if RESEND_API_KEY is not configured.
 *
 * @returns {Resend} Configured Resend client instance
 * @throws {Error} When RESEND_API_KEY environment variable is not set
 */
function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

/**
 * Get or create Supabase client instance with service role key
 *
 * Lazy initialization ensures environment variables are loaded before client creation.
 * Uses service role key for privileged database operations like email preferences management.
 * Throws errors if required environment variables are not configured.
 *
 * @returns {ReturnType<typeof createClient<Database>>} Configured Supabase client with Database types
 * @throws {Error} When NEXT_PUBLIC_SUPABASE_URL environment variable is not set
 * @throws {Error} When SUPABASE_SERVICE_ROLE_KEY environment variable is not set
 */
function getSupabaseClient(): ReturnType<typeof createClient<Database>> {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL environment variable is not set'
      );
    }

    if (!serviceKey) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY environment variable is not set'
      );
    }

    supabase = createClient<Database>(url, serviceKey);
  }
  return supabase;
}

// Environment variables with fallbacks
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@paymatch.app';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'PayMatch';

// EmailType is imported from schemas

/**
 * Configuration options for sending emails
 *
 * @interface EmailOptions
 */
export interface EmailOptions {
  /** Recipient email address(es) */
  to: string | string[];
  /** Email subject line */
  subject: string;
  /** HTML content of the email */
  html: string;
  /** Plain text version of the email (optional) */
  text?: string;
  /** Sender email address (defaults to FROM_EMAIL) */
  from?: string;
  /** Reply-to email address */
  replyTo?: string;
  /** Type of email for unsubscribe handling (defaults to 'transactional') */
  emailType?: EmailType;
  /** User ID for tracking and unsubscribe purposes */
  userId?: string;
  /** Additional tags for email tracking */
  tags?: Array<{ name: string; value: string }>;
  /** Email attachments */
  attachments?: Array<{
    content?: string;
    filename: string;
    contentId: string;
    contentType?: string;
  }>;
}

/**
 * Newsletter subscriber information
 *
 * @interface NewsletterSubscriber
 */
export interface NewsletterSubscriber {
  /** Unique subscriber identifier */
  id: string;
  /** Subscriber email address */
  email: string;
  /** Subscriber first name */
  firstName: string;
  /** Subscriber last name */
  lastName: string;
  /** Whether the subscriber is currently active */
  isActive: boolean;
  /** ISO timestamp when subscription was created */
  subscribedAt?: string;
  /** ISO timestamp when subscription was cancelled */
  unsubscribedAt?: string;
}

// Database types for email preferences
type EmailPreferencesInsert =
  Database['public']['Tables']['email_preferences']['Insert'];

/**
 * Email preferences for a specific email type
 *
 * @interface EmailPreferences
 */
export interface EmailPreferences {
  /** Email address */
  email: string;
  /** Associated user ID (optional) */
  userId?: string;
  /** Type of email preference */
  emailType: EmailType;
  /** Whether the preference is currently active */
  isActive: boolean;
  /** ISO timestamp when unsubscribed (if applicable) */
  unsubscribedAt?: string;
}

/**
 * Result of email sending operations
 *
 * @interface EmailServiceResult
 */
export interface EmailServiceResult {
  /** Whether the operation was successful */
  success: boolean;
  /** Resend message ID (if successful) */
  messageId?: string;
  /** Generated unsubscribe URL (if applicable) */
  unsubscribeUrl?: string;
  /** Error message (if failed) */
  error?: string;
}

/**
 * Result of email preferences operations
 *
 * @interface EmailPreferencesResult
 */
export interface EmailPreferencesResult {
  /** Whether the operation was successful */
  success: boolean;
  /** Human-readable result message */
  message: string;
  /** Subscriber information */
  subscriber: {
    email: string;
    emailType: EmailType;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
  };
  /** Error message (if failed) */
  error?: string;
}

/**
 * Send email with proper unsubscribe headers and functionality
 *
 * Sends an email using Resend with automatic unsubscribe URL generation for non-mandatory
 * email types. Handles both single and multiple recipients, includes standard attachments,
 * and provides comprehensive error handling.
 *
 * @param {EmailOptions} options - Email configuration options
 * @param {string|string[]} options.to - Recipient email address(es)
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML content of the email
 * @param {string} [options.text] - Plain text version (optional)
 * @param {string} [options.from] - Sender email (defaults to FROM_EMAIL)
 * @param {string} [options.replyTo] - Reply-to email address
 * @param {EmailType} [options.emailType='transactional'] - Type of email for unsubscribe handling
 * @param {string} [options.userId] - User ID for tracking and unsubscribe purposes
 * @param {Array<{name: string, value: string}>} [options.tags] - Additional tags for tracking
 * @param {Array<{content?: string, filename: string, contentId: string, contentType?: string}>} [options.attachments] - Email attachments
 *
 * @returns {Promise<EmailServiceResult>} Result object with success status, message ID, and unsubscribe URL
 *
 * @example
 * ```typescript
 * const result = await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome to PayMatch!',
 *   html: '<h1>Welcome!</h1>',
 *   emailType: 'newsletter_promotional',
 *   userId: 'user-123'
 * });
 *
 * if (result.success) {
 *   console.log('Email sent:', result.messageId);
 * }
 * ```
 */
export async function sendEmail(
  options: EmailOptions
): Promise<EmailServiceResult> {
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
 *
 * Renders a React Email component to HTML and sends it using the standard sendEmail function.
 * Automatically handles unsubscribe URL injection into the component props.
 *
 * @param {Omit<EmailOptions, 'html'> & {component: React.ReactElement}} options - Email options with React component
 * @param {string|string[]} options.to - Recipient email address(es)
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plain text version (optional)
 * @param {string} [options.from] - Sender email (defaults to FROM_EMAIL)
 * @param {string} [options.replyTo] - Reply-to email address
 * @param {EmailType} [options.emailType='transactional'] - Type of email for unsubscribe handling
 * @param {string} [options.userId] - User ID for tracking and unsubscribe purposes
 * @param {Array<{name: string, value: string}>} [options.tags] - Additional tags for tracking
 * @param {Array<{content?: string, filename: string, contentId: string, contentType?: string}>} [options.attachments] - Email attachments
 * @param {React.ReactElement} options.component - React Email component to render
 *
 * @returns {Promise<EmailServiceResult>} Result object with success status, message ID, and unsubscribe URL
 *
 * @example
 * ```typescript
 * const result = await sendEmailWithComponent({
 *   to: 'user@example.com',
 *   subject: 'Welcome to PayMatch!',
 *   emailType: 'newsletter_promotional',
 *   userId: 'user-123',
 *   component: <EmailVerification
 *     verificationUrl="https://app.paymatch.app/verify?token=abc123"
 *     userName="John Doe"
 *     appUrl="https://app.paymatch.app"
 *   />
 * });
 * ```
 */
export async function sendEmailWithComponent(
  options: Omit<EmailOptions, 'html'> & {
    component: React.ReactElement;
  }
): Promise<EmailServiceResult> {
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
 * Email preferences management service
 *
 * Handles subscription, unsubscription, and preference retrieval for different email types.
 * Provides database operations for managing user email preferences with proper validation.
 */
export class EmailPreferencesService {
  /**
   * Subscribe to specific email type
   *
   * Creates or updates email preferences for a user, setting them as active subscribers
   * to the specified email type. Handles both new subscriptions and reactivations.
   *
   * @param {string} email - Email address to subscribe
   * @param {EmailType} type - Type of email to subscribe to
   * @param {string} [userId] - Associated user ID (optional)
   * @param {string} [firstName] - Subscriber's first name (optional)
   * @param {string} [lastName] - Subscriber's last name (optional)
   *
   * @returns {Promise<EmailPreferencesResult>} Result with subscription status and subscriber info
   *
   * @throws {Error} When database operation fails
   *
   * @example
   * ```typescript
   * const result = await EmailPreferencesService.subscribe(
   *   'user@example.com',
   *   'newsletter_promotional',
   *   'user-123',
   *   'John',
   *   'Doe'
   * );
   *
   * if (result.success) {
   *   console.log('Subscribed successfully:', result.message);
   * }
   * ```
   */
  static async subscribe(
    email: string,
    type: EmailType,
    userId?: string,
    firstName?: string,
    lastName?: string
  ): Promise<EmailPreferencesResult> {
    const supabaseClient = getSupabaseClient();

    const insertData: EmailPreferencesInsert = {
      email,
      user_id: userId || null,
      email_type: type,
      first_name: firstName || null,
      last_name: lastName || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseClient
      .from('email_preferences')
      .upsert(insertData);

    if (error) {
      throw new Error(
        `Failed to subscribe to ${type} emails: ${error.message}`
      );
    }

    return {
      success: true,
      message: `Successfully subscribed to ${type} emails`,
      subscriber: {
        email,
        emailType: type,
        firstName,
        lastName,
        isActive: true,
      },
    };
  }

  /**
   * Unsubscribe from specific email type
   *
   * Deactivates email preferences for a user, preventing them from receiving emails
   * of the specified type. Validates that the email type is not mandatory before
   * allowing unsubscription.
   *
   * @param {string} email - Email address to unsubscribe
   * @param {EmailType} type - Type of email to unsubscribe from
   * @param {string} [userId] - Associated user ID (optional)
   *
   * @returns {Promise<EmailPreferencesResult>} Result with unsubscription status and subscriber info
   *
   * @throws {Error} When email type is mandatory (security, transactional, support, legal)
   * @throws {Error} When database operation fails
   *
   * @example
   * ```typescript
   * const result = await EmailPreferencesService.unsubscribe(
   *   'user@example.com',
   *   'newsletter_promotional',
   *   'user-123'
   * );
   *
   * if (result.success) {
   *   console.log('Unsubscribed successfully:', result.message);
   * }
   * ```
   */
  static async unsubscribe(
    email: string,
    type: EmailType,
    userId?: string
  ): Promise<EmailPreferencesResult> {
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

    const updateData: EmailPreferencesInsert = {
      email,
      user_id: userId || null,
      email_type: type,
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseClient
      .from('email_preferences')
      .upsert(updateData);

    if (error) {
      throw new Error(
        `Failed to unsubscribe from ${type} emails: ${error.message}`
      );
    }

    return {
      success: true,
      message: `Successfully unsubscribed from ${type} emails`,
      subscriber: {
        email,
        emailType: type,
        isActive: false,
      },
    };
  }

  /**
   * Get email preferences info
   *
   * Retrieves current email preferences for a specific email address and email type.
   * Returns subscriber information including subscription status and personal details.
   *
   * @param {string} email - Email address to query
   * @param {EmailType} type - Type of email to check preferences for
   *
   * @returns {Promise<EmailPreferencesResult>} Result with subscriber info and preferences
   *
   * @throws {Error} When database operation fails
   *
   * @example
   * ```typescript
   * const result = await EmailPreferencesService.getPreferences(
   *   'user@example.com',
   *   'newsletter_promotional'
   * );
   *
   * if (result.success) {
   *   console.log('Subscriber active:', result.subscriber.isActive);
   *   console.log('Name:', result.subscriber.firstName, result.subscriber.lastName);
   * }
   * ```
   */
  static async getPreferences(
    email: string,
    type: EmailType
  ): Promise<EmailPreferencesResult> {
    const supabaseClient = getSupabaseClient();

    const { data: preferences, error } = await supabaseClient
      .from('email_preferences')
      .select('email, email_type, is_active, first_name, last_name')
      .eq('email', email)
      .eq('email_type', type)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch email preferences: ${error.message}`);
    }

    return {
      success: true,
      message: 'Email preferences retrieved successfully',
      subscriber: {
        email,
        isActive: preferences?.is_active ?? true,
        emailType: type,
        firstName: preferences?.first_name ?? undefined,
        lastName: preferences?.last_name ?? undefined,
      },
    };
  }
}

/**
 * Centralized unsubscribe handler service
 *
 * Handles unsubscribe operations with token verification and validation.
 * Provides secure unsubscribe functionality for all supported email types.
 */
export class UnsubscribeService {
  /**
   * Handle unsubscribe request with token verification
   *
   * Verifies the unsubscribe token and processes the unsubscription request
   * for the appropriate email type. Ensures token validity and proper error handling.
   *
   * @param {string} token - JWT token containing unsubscribe information
   *
   * @returns {Promise<EmailPreferencesResult>} Result with unsubscription status
   *
   * @throws {Error} When token is invalid or expired
   * @throws {Error} When email type is invalid
   * @throws {Error} When unsubscription fails
   *
   * @example
   * ```typescript
   * const result = await UnsubscribeService.handleUnsubscribe(token);
   *
   * if (result.success) {
   *   console.log('Unsubscribed successfully:', result.message);
   * } else {
   *   console.error('Unsubscribe failed:', result.error);
   * }
   * ```
   */
  static async handleUnsubscribe(
    token: string
  ): Promise<EmailPreferencesResult> {
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
        throw new Error(`Invalid email type: ${type}`);
    }
  }

  /**
   * Get subscriber info with token verification
   *
   * Verifies the unsubscribe token and retrieves current subscriber information
   * for the associated email address and email type.
   *
   * @param {string} token - JWT token containing subscriber information
   *
   * @returns {Promise<EmailPreferencesResult>} Result with subscriber information
   *
   * @throws {Error} When token is invalid or expired
   * @throws {Error} When email type is invalid
   * @throws {Error} When subscriber info retrieval fails
   *
   * @example
   * ```typescript
   * const result = await UnsubscribeService.getSubscriberInfo(token);
   *
   * if (result.success) {
   *   console.log('Subscriber email:', result.subscriber.email);
   *   console.log('Email type:', result.subscriber.emailType);
   *   console.log('Is active:', result.subscriber.isActive);
   * }
   * ```
   */
  static async getSubscriberInfo(
    token: string
  ): Promise<EmailPreferencesResult> {
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
        throw new Error(`Invalid email type: ${type}`);
    }
  }
}

/**
 * Support request data structure
 *
 * @interface SupportRequestData
 */
export interface SupportRequestData {
  /** Customer's full name */
  name: string;
  /** Customer's email address */
  email: string;
  /** Support request subject */
  subject: string;
  /** Detailed support message */
  message: string;
  /** Support category (general, technical, billing, etc.) */
  category: string;
  /** Priority level (low, medium, high, urgent) */
  priority: string;
  /** Optional file attachments */
  attachments?: File[];
}

/**
 * Support email operation result
 *
 * @interface SupportEmailResult
 */
export interface SupportEmailResult {
  /** Whether the operation was successful */
  success: boolean;
  /** Human-readable result message */
  message: string;
  /** Error message (if failed) */
  error?: string;
}

/**
 * Support email service
 *
 * Handles support request processing and email notifications.
 * Integrates with existing support form logic and ticket management systems.
 */
export class SupportEmailService {
  /**
   * Send support request email
   *
   * Processes a support request and sends appropriate notifications.
   * Currently logs the request data and returns success status.
   * TODO: Integrate with actual support email sending and ticket creation.
   *
   * @param {SupportRequestData} supportData - Support request information
   * @param {string} supportData.name - Customer's full name
   * @param {string} supportData.email - Customer's email address
   * @param {string} supportData.subject - Support request subject
   * @param {string} supportData.message - Detailed support message
   * @param {string} supportData.category - Support category
   * @param {string} supportData.priority - Priority level
   * @param {File[]} [supportData.attachments] - Optional file attachments
   *
   * @returns {Promise<SupportEmailResult>} Result with success status and message
   *
   * @example
   * ```typescript
   * const result = await SupportEmailService.sendSupportRequest({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   subject: 'Login Issues',
   *   message: 'I cannot log into my account...',
   *   category: 'technical',
   *   priority: 'high'
   * });
   *
   * if (result.success) {
   *   console.log('Support request sent:', result.message);
   * }
   * ```
   */
  static async sendSupportRequest(
    supportData: SupportRequestData
  ): Promise<SupportEmailResult> {
    try {
      // This would integrate with the existing support form logic
      // For now, we'll just return the structure
      console.log('Support request data:', supportData);

      // TODO: Implement actual support email sending logic
      // This could send an email to the support team and/or create a ticket

      return {
        success: true,
        message: 'Support request sent successfully',
      };
    } catch (error) {
      console.error('Support email error:', error);
      return {
        success: false,
        message: 'Failed to send support request',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
