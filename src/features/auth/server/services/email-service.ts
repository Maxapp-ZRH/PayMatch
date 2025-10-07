/**
 * Email Service
 *
 * Handles all email-related operations for authentication.
 * Centralized email sending logic for auth flows.
 */

import React from 'react';
import { sendEmailWithComponent } from '@/features/email/email-service';
import { EmailVerification } from '@/emails/email-verification';
import { PasswordReset } from '@/emails/password-reset';

/**
 * Send verification email for pending registration
 */
export async function sendPendingRegistrationEmail(
  email: string,
  verificationToken: string,
  userName: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/auth/callback?type=signup&token=${verificationToken}`;

    const result = await sendEmailWithComponent({
      to: email,
      subject: 'Verify your PayMatch account',
      emailType: 'security', // Mark as security email to skip unsubscribe URLs
      component: React.createElement(EmailVerification, {
        userName,
        verificationUrl,
        appUrl: baseUrl,
      }),
    });

    if (!result.success) {
      console.error('Failed to send verification email:', result.error);
      return {
        success: false,
        message: 'Failed to send verification email',
        error: result.error,
      };
    }
    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Failed to send verification email',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send verification email for existing users
 */
export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  userName: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/auth/callback?type=signup&token=${verificationToken}`;

    const result = await sendEmailWithComponent({
      to: email,
      subject: 'Verify your PayMatch account',
      emailType: 'security', // Mark as security email to skip unsubscribe URLs
      component: React.createElement(EmailVerification, {
        userName,
        verificationUrl,
        appUrl: baseUrl,
      }),
    });

    if (!result.success) {
      console.error('Failed to send verification email:', result.error);
      return {
        success: false,
        message: 'Failed to send verification email',
        error: result.error,
      };
    }
    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Failed to send verification email',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const result = await sendEmailWithComponent({
      to: email,
      subject: 'Reset your PayMatch password',
      emailType: 'security', // Mark as security email to skip unsubscribe URLs
      component: React.createElement(PasswordReset, {
        userName,
        resetUrl,
        appUrl: baseUrl,
      }),
    });

    if (!result.success) {
      console.error('Failed to send password reset email:', result.error);
      return {
        success: false,
        message: 'Failed to send password reset email',
        error: result.error,
      };
    }
    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      message: 'Failed to send password reset email',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
