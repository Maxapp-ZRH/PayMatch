/**
 * Pending Registration Password Reset Server Actions
 *
 * Handles password reset for users who have pending registrations
 * but haven't verified their email yet.
 */

'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendPasswordResetEmail as sendPasswordResetEmailService } from '../services/email-service';
import { checkRateLimit } from '../services/rate-limiting';
import {
  setRedisObject,
  getRedisObject,
  deleteRedisKey,
} from '../services/redis';
import { generatePasswordResetToken } from '../utils/token-operations';

export interface PendingPasswordResetResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface PendingPasswordResetToken {
  token: string;
  email: string;
  pendingRegistrationId: string;
  expiresAt: Date;
  [key: string]: unknown;
}

// Redis storage for pending password reset tokens
const PENDING_PASSWORD_RESET_PREFIX = 'pending_password_reset';

/**
 * Send password reset email for pending registration
 */
export async function sendPendingPasswordResetEmail(
  email: string
): Promise<PendingPasswordResetResult> {
  try {
    // Check rate limit using centralized config
    if (!(await checkRateLimit(email, 'PASSWORD_RESET'))) {
      return {
        success: false,
        message:
          'Too many password reset attempts. Please wait before trying again.',
      };
    }

    // Check if user has pending registration
    const { data: pendingReg, error: fetchError } = await supabaseAdmin
      .from('pending_registrations')
      .select('id, email, expires_at')
      .eq('email', email)
      .single();

    if (fetchError || !pendingReg) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message:
          "If an account with that email exists, we've sent a password reset link.",
      };
    }

    // Check if pending registration has expired
    if (new Date() > new Date(pendingReg.expires_at)) {
      // Clean up expired registration
      await supabaseAdmin
        .from('pending_registrations')
        .delete()
        .eq('id', pendingReg.id);

      return {
        success: true,
        message:
          "If an account with that email exists, we've sent a password reset link.",
      };
    }

    // Generate reset token
    const { token: resetToken, expiresAt } = generatePasswordResetToken();

    // Store token in Redis
    const tokenData: PendingPasswordResetToken = {
      token: resetToken,
      email: pendingReg.email,
      pendingRegistrationId: pendingReg.id,
      expiresAt,
    };

    const tokenKey = `${PENDING_PASSWORD_RESET_PREFIX}:${resetToken}`;
    const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    await setRedisObject(tokenKey, tokenData, ttlSeconds);

    // Send reset email
    const result = await sendPasswordResetEmailService(
      email,
      resetToken,
      email // Use email as name since we don't have user metadata yet
    );

    if (!result.success) {
      console.error(
        'Failed to send pending password reset email:',
        result.error
      );
      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.',
      };
    }

    return {
      success: true,
      message:
        "If an account with that email exists, we've sent a password reset link.",
    };
  } catch (error) {
    console.error('Error sending pending password reset email:', error);
    return {
      success: false,
      message: 'Failed to send password reset email. Please try again.',
    };
  }
}

/**
 * Reset password for pending registration
 */
export async function resetPendingPassword(
  token: string,
  newPassword: string
): Promise<PendingPasswordResetResult> {
  try {
    // Get token from Redis
    const tokenKey = `${PENDING_PASSWORD_RESET_PREFIX}:${token}`;
    const resetData = await getRedisObject<PendingPasswordResetToken>(tokenKey);

    if (!resetData) {
      return {
        success: false,
        message: 'Invalid or expired reset token.',
      };
    }

    // Check if token has expired
    if (new Date() > resetData.expiresAt) {
      await deleteRedisKey(tokenKey);
      return {
        success: false,
        message: 'Reset token has expired. Please request a new one.',
      };
    }

    // Update pending registration password
    const { error: updateError } = await supabaseAdmin
      .from('pending_registrations')
      .update({
        password_hash: newPassword, // Store plain password temporarily
        updated_at: new Date().toISOString(),
      })
      .eq('id', resetData.pendingRegistrationId);

    if (updateError) {
      console.error(
        'Error updating pending registration password:',
        updateError
      );
      return {
        success: false,
        message: 'Failed to reset password. Please try again.',
      };
    }

    // Clean up token from Redis
    await deleteRedisKey(tokenKey);

    return {
      success: true,
      message:
        'Password reset successfully! You can now verify your email to complete registration.',
    };
  } catch (error) {
    console.error('Error resetting pending password:', error);
    return {
      success: false,
      message: 'Failed to reset password. Please try again.',
    };
  }
}

/**
 * Verify pending password reset token validity
 */
export async function verifyPendingResetToken(
  token: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const tokenKey = `${PENDING_PASSWORD_RESET_PREFIX}:${token}`;
    const resetData = await getRedisObject<PendingPasswordResetToken>(tokenKey);

    if (!resetData) {
      return {
        valid: false,
        error: 'Invalid reset token.',
      };
    }

    // Check if token has expired
    if (new Date() > resetData.expiresAt) {
      await deleteRedisKey(tokenKey);
      return {
        valid: false,
        error: 'Reset token has expired.',
      };
    }

    // Check if pending registration still exists
    const { data: pendingReg, error: fetchError } = await supabaseAdmin
      .from('pending_registrations')
      .select('id, email, expires_at')
      .eq('id', resetData.pendingRegistrationId)
      .single();

    if (fetchError || !pendingReg) {
      await deleteRedisKey(tokenKey);
      return {
        valid: false,
        error: 'Pending registration no longer exists.',
      };
    }

    // Check if pending registration has expired
    if (new Date() > new Date(pendingReg.expires_at)) {
      await deleteRedisKey(tokenKey);
      return {
        valid: false,
        error: 'Pending registration has expired.',
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error verifying pending reset token:', error);
    return {
      valid: false,
      error: 'Failed to verify reset token.',
    };
  }
}
