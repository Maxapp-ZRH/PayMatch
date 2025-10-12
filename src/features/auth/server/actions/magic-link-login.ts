/**
 * Magic Link Login Server Actions
 *
 * Handles passwordless authentication using Supabase magic links.
 * Provides secure magic link generation and verification.
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { logAuditEntry } from '@/features/auth/server/services/audit-logging';
import { getClientInfo } from '@/utils/client-info';
import { sendMagicLinkEmail } from '@/features/email/services/auth-integration';

export interface MagicLinkLoginResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Send magic link for passwordless login
 */
export async function sendMagicLinkLogin(
  email: string,
  request?: Request
): Promise<MagicLinkLoginResult> {
  try {
    const { clientIP, userAgent } = await getClientInfo(request);

    // Validate email format
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        error: 'Invalid email format',
      };
    }

    // Try to generate magic link - this will fail if user doesn't exist
    // We'll use the email service which handles user existence checking
    const emailResult = await sendMagicLinkEmail(email);

    if (!emailResult.success) {
      console.error('Magic link email send error:', emailResult.error);

      // Log failed attempt
      await logAuditEntry({
        action: 'magic_link_login_attempt',
        email: email,
        ipAddress: clientIP,
        userAgent: userAgent,
        status: 'failure',
        errorMessage: emailResult.error || 'Failed to send email',
        details: { method: 'magic_link' },
      });

      // Return generic message for security regardless of actual error
      return {
        success: false,
        message:
          'If an account with that email exists, a magic link has been sent. Please check your email and spam folder.',
        error: emailResult.error,
      };
    }

    // Log successful send
    await logAuditEntry({
      action: 'magic_link_sent',
      email: email,
      ipAddress: clientIP,
      userAgent: userAgent,
      status: 'success',
      details: { method: 'magic_link' },
    });

    return {
      success: true,
      message:
        'If an account with that email exists, a magic link has been sent. Please check your email and spam folder.',
    };
  } catch (error) {
    console.error('Magic link login error:', error);

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify magic link and create session
 */
export async function verifyMagicLink(
  token_hash: string,
  type: string,
  request?: Request
): Promise<MagicLinkLoginResult> {
  try {
    const supabase = await createClient();
    const { clientIP, userAgent } = await getClientInfo(request);

    // Verify the magic link token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'magiclink',
    });

    if (error) {
      console.error('Magic link verification error:', error);

      // Log failed verification
      await logAuditEntry({
        action: 'magic_link_verification',
        ipAddress: clientIP,
        userAgent: userAgent,
        status: 'failure',
        errorMessage: error.message,
        details: { method: 'magic_link', token_type: type },
      });

      return {
        success: false,
        message: 'Invalid or expired magic link. Please request a new one.',
        error: error.message,
      };
    }

    // Log successful login
    await logAuditEntry({
      action: 'magic_link_login_success',
      userId: data.user?.id,
      email: data.user?.email,
      ipAddress: clientIP,
      userAgent: userAgent,
      status: 'success',
      details: { method: 'magic_link', token_type: type },
    });

    return {
      success: true,
      message: 'Successfully signed in with magic link!',
    };
  } catch (error) {
    console.error('Magic link verification error:', error);

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
