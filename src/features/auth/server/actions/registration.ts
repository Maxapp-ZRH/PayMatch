/**
 * Registration Server Actions
 *
 * Handles user registration, email verification, and related operations.
 * Uses Supabase Auth with magic links for email verification.
 */

'use server';

import { findUserByEmail } from '../utils/user-operations';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { logRegistrationAttempt } from '../services/audit-logging';
import { sendVerificationEmail } from '@/features/email/services/auth-integration';

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Required with Supabase Auth
  referralSource?: string;
  browserLocale?: string;
  clientIP?: string; // Extracted client IP
  userAgent?: string; // Extracted user agent
}

export interface RegisterResult {
  success: boolean;
  message: string;
  error?: string;
  userId?: string;
}

/**
 * Register a new user with Supabase Auth
 */
export async function registerUser(
  data: RegisterUserData
): Promise<RegisterResult> {
  const ip = data.clientIP || 'unknown';

  try {
    // Supabase Auth handles all rate limiting automatically
    // No need for custom Redis rate limiting

    // Check if user already exists
    const { user: existingUser } = await findUserByEmail(data.email);
    if (existingUser) {
      await logRegistrationAttempt(
        data.email,
        { clientIP: data.clientIP, userAgent: data.userAgent },
        false,
        'User already exists',
        { ip }
      );

      return {
        success: false,
        message:
          'An account with this email already exists. Please sign in instead.',
      };
    }

    // Create user with Supabase Auth (email not confirmed yet)
    // We'll send our own custom verification email
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: false, // User must verify email
        user_metadata: {
          first_name: data.firstName,
          last_name: data.lastName,
          referral_source: data.referralSource,
          browser_locale: data.browserLocale,
        },
      });

    if (authError || !authData.user) {
      await logRegistrationAttempt(
        data.email,
        { clientIP: data.clientIP, userAgent: data.userAgent },
        false,
        'Failed to create user account',
        { ip, error: authError?.message }
      );

      return {
        success: false,
        message: authError?.message || 'Failed to create account',
      };
    }

    // Send confirmation email via Resend with custom template
    const emailResult = await sendVerificationEmail(
      data.email,
      data.firstName,
      data.lastName
    );

    if (!emailResult.success) {
      console.error('Failed to send confirmation email:', emailResult.error);
      // Don't fail registration if email fails, just log it
      await logRegistrationAttempt(
        data.email,
        { clientIP: data.clientIP, userAgent: data.userAgent },
        false,
        'Failed to send confirmation email',
        { ip, error: emailResult.error }
      );
    }

    // Log successful registration
    await logRegistrationAttempt(
      data.email,
      { clientIP: data.clientIP, userAgent: data.userAgent },
      true,
      undefined,
      {
        ip,
        referralSource: data.referralSource,
        browserLocale: data.browserLocale,
        userId: authData.user.id,
      }
    );

    return {
      success: true,
      message:
        'Registration successful! Please check your email to verify your account.',
      userId: authData.user.id,
    };
  } catch (error) {
    console.error('Registration error:', error);

    // Log registration error
    await logRegistrationAttempt(
      data.email,
      { clientIP: data.clientIP, userAgent: data.userAgent },
      false,
      error instanceof Error ? error.message : 'Unknown error',
      { ip, error: error instanceof Error ? error.stack : 'Unknown error' }
    );

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Resend verification email for unverified users
 */
export async function resendVerificationEmail(
  email: string
): Promise<RegisterResult> {
  try {
    // Find user by email
    const { user, error: userError } = await findUserByEmail(email);
    if (userError || !user) {
      return {
        success: false,
        message: 'User not found. Please check your email address.',
      };
    }

    if (user.email_confirmed_at) {
      return {
        success: false,
        message: 'Email is already verified. You can sign in now.',
      };
    }

    // Send verification email via Resend with custom template
    const emailResult = await sendVerificationEmail(
      email,
      user.user_metadata?.first_name || 'User',
      user.user_metadata?.last_name || ''
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return {
        success: false,
        message: 'Failed to send verification email. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Verification email sent successfully!',
    };
  } catch (error) {
    console.error('Error resending verification email:', error);
    return {
      success: false,
      message: 'Failed to resend verification email. Please try again.',
    };
  }
}
