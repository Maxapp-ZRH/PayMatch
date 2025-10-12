/**
 * Password Reset Server Actions
 *
 * Handles password reset functionality using Supabase magic links.
 * Simplified implementation with Supabase Auth handling token generation and verification.
 */

'use server';

import { sendPasswordResetEmail as sendPasswordResetEmailService } from '@/features/email';
// Removed: Legacy auth rate limiting - Supabase handles this automatically
import {
  findUserByEmail,
  checkPendingRegistration,
} from '../utils/user-operations';
import { logPasswordResetAttempt } from '../services/audit-logging';
import { extractClientIP } from '../utils/client-ip';

export interface PasswordResetResult {
  success: boolean;
  message: string;
  error?: string;
  userId?: string;
}

/**
 * Send password reset email using Supabase magic links
 */
export async function sendPasswordResetEmail(
  email: string,
  request?: Request,
  clientIP?: string,
  userAgent?: string
): Promise<PasswordResetResult> {
  const ip = clientIP || (request ? extractClientIP(request) : 'unknown');

  try {
    // Supabase handles all rate limiting automatically
    // No need for custom Redis rate limiting

    // Find user to get their name
    const { user } = await findUserByEmail(email);

    const userName = user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
      : email;

    // Send password reset email (Supabase handles token generation)
    const result = await sendPasswordResetEmailService(email, userName);

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error);
      await logPasswordResetAttempt(
        email,
        { request, clientIP, userAgent },
        false,
        'Failed to send password reset email',
        { ip, error: result.error }
      );

      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.',
      };
    }

    // Log successful password reset request
    await logPasswordResetAttempt(
      email,
      { request, clientIP, userAgent },
      true,
      undefined,
      { ip }
    );

    return {
      success: true,
      message:
        "If an account with that email exists, we've sent a password reset link.",
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);

    // Log password reset error
    await logPasswordResetAttempt(
      email,
      { request, clientIP, userAgent },
      false,
      error instanceof Error ? error.message : 'Unknown error',
      { ip, error: error instanceof Error ? error.stack : 'Unknown error' }
    );

    return {
      success: false,
      message: 'Failed to send password reset email. Please try again.',
    };
  }
}

/**
 * Check if user has pending registration for password reset
 * With Supabase Auth, this means checking if user exists but email is not confirmed
 */
export async function checkPendingRegistrationForPasswordReset(
  email: string
): Promise<{
  hasPendingRegistration: boolean;
  error?: string;
}> {
  return await checkPendingRegistration(email);
}
