/**
 * Password Reset Server Actions
 *
 * Handles password reset functionality including token generation,
 * email sending, and password updates.
 */

'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendPasswordResetEmail as sendPasswordResetEmailService } from '../services/email-service';
import { checkRateLimit } from '../services/rate-limiting';
import { findUserByEmail } from '../utils/user-operations';
import { generatePasswordResetToken } from '../utils/token-operations';

export interface PasswordResetResult {
  success: boolean;
  message: string;
  error?: string;
  userId?: string;
}

export interface PasswordResetToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: Date;
}

// In-memory storage for password reset tokens (use Redis in production)
const passwordResetTokens = new Map<string, PasswordResetToken>();

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<PasswordResetResult> {
  try {
    // Check rate limit
    if (!checkRateLimit(`password_reset_${email}`, 3, 15 * 60 * 1000)) {
      // 3 attempts per 15 minutes
      return {
        success: false,
        message:
          'Too many password reset attempts. Please wait before trying again.',
      };
    }

    // Find user by email
    const { user, error: userError } = await findUserByEmail(email);
    if (userError) {
      console.error('Error finding user:', userError);
      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.',
      };
    }

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message:
          "If an account with that email exists, we've sent a password reset link.",
      };
    }

    // Generate reset token
    const { token: resetToken, expiresAt } = generatePasswordResetToken();

    // Store token
    passwordResetTokens.set(resetToken, {
      token: resetToken,
      userId: user.id,
      email: user.email!,
      expiresAt,
    });

    // Send reset email
    const result = await sendPasswordResetEmailService(
      email,
      resetToken,
      user.user_metadata?.name || email
    );

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error);
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
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      message: 'Failed to send password reset email. Please try again.',
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<PasswordResetResult> {
  try {
    // Get token from storage
    const resetData = passwordResetTokens.get(token);
    if (!resetData) {
      return {
        success: false,
        message: 'Invalid or expired reset token.',
      };
    }

    // Check if token has expired
    if (new Date() > resetData.expiresAt) {
      passwordResetTokens.delete(token);
      return {
        success: false,
        message: 'Reset token has expired. Please request a new one.',
      };
    }

    // Update user password using admin client
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(resetData.userId, {
        password: newPassword,
      });

    if (updateError) {
      console.error('Error updating password:', updateError);
      return {
        success: false,
        message: 'Failed to reset password. Please try again.',
      };
    }

    // Clean up token
    passwordResetTokens.delete(token);

    return {
      success: true,
      message:
        'Password reset successfully! You can now sign in with your new password.',
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      message: 'Failed to reset password. Please try again.',
    };
  }
}

/**
 * Verify reset token validity
 */
export async function verifyResetToken(
  token: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const resetData = passwordResetTokens.get(token);
    if (!resetData) {
      return {
        valid: false,
        error: 'Invalid reset token.',
      };
    }

    if (new Date() > resetData.expiresAt) {
      passwordResetTokens.delete(token);
      return {
        valid: false,
        error: 'Reset token has expired.',
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error verifying reset token:', error);
    return {
      valid: false,
      error: 'Failed to verify reset token.',
    };
  }
}
