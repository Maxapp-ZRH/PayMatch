/**
 * Pending Registration Database Operations
 *
 * Server-only database operations for managing pending user registrations.
 * This file should never be imported by client components.
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateVerificationToken } from './token-operations';
import { userExistsByEmail } from './user-operations';

export interface PendingRegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  referralSource?: string;
  browserLocale?: string;
}

export interface PendingRegistrationResult {
  success: boolean;
  message: string;
  verificationToken?: string;
  email?: string;
  error?: string;
}

/**
 * Store pending registration data temporarily
 */
export async function storePendingRegistration(
  data: PendingRegistrationData
): Promise<PendingRegistrationResult> {
  try {
    const supabase = supabaseAdmin;

    // Check if email already exists in pending registrations
    const { data: existingPending, error: pendingError } = await supabase
      .from('pending_registrations')
      .select('id, expires_at')
      .eq('email', data.email)
      .maybeSingle();

    if (pendingError) {
      console.error('Error checking pending registrations:', pendingError);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
        error: pendingError.message,
      };
    }

    if (existingPending) {
      // Check if existing registration is still valid
      if (new Date() < new Date(existingPending.expires_at)) {
        return {
          success: false,
          message:
            'Registration already in progress. Please check your email for verification link.',
        };
      } else {
        // Delete expired registration
        await supabase
          .from('pending_registrations')
          .delete()
          .eq('id', existingPending.id);
      }
    }

    // Check if user already exists in Supabase Auth
    const userExists = await userExistsByEmail(data.email);
    if (userExists) {
      return {
        success: false,
        message:
          'An account with this email already exists. Please sign in instead.',
      };
    }

    // Generate verification token
    const { token: verificationToken, expiresAt } = generateVerificationToken();

    // Store pending registration WITHOUT password (GDPR-compliant)
    // The password will be collected again during email verification
    // when the user is created in Supabase Auth
    const { error } = await supabase.from('pending_registrations').insert({
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      user_metadata: {
        language: data.language,
        referral_source: data.referralSource,
        browser_locale: data.browserLocale,
      },
      verification_token: verificationToken,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      console.error('Error storing pending registration:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Pending registration stored.',
      verificationToken,
    };
  } catch (error) {
    console.error('Error in storePendingRegistration:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify pending registration and create Supabase user
 */
export async function verifyPendingRegistration(
  token: string
): Promise<PendingRegistrationResult> {
  try {
    const supabase = supabaseAdmin;

    // Get pending registration by token
    const { data: pendingReg, error: fetchError } = await supabase
      .from('pending_registrations')
      .select('*')
      .eq('verification_token', token)
      .maybeSingle();

    if (fetchError) {
      console.error(
        'Database error fetching pending registration:',
        fetchError
      );
      return {
        success: false,
        message: 'Database error. Please try again.',
        error: fetchError.message,
      };
    }

    if (!pendingReg) {
      return {
        success: false,
        message: 'Invalid or expired verification link.',
      };
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(pendingReg.expires_at);

    if (now > expiresAt) {
      // Clean up expired registration
      await supabase
        .from('pending_registrations')
        .delete()
        .eq('id', pendingReg.id);

      return {
        success: false,
        message: 'Verification link has expired. Please register again.',
      };
    }

    // For GDPR compliance, we don't create the user immediately
    // Instead, we return the email so the user can set their password
    // The user will be created when they set their password

    return {
      success: true,
      message:
        'Email verified successfully! Please set your password to complete registration.',
      email: pendingReg.email,
    };
  } catch (error) {
    console.error('Error in verifyPendingRegistration:', error);
    return {
      success: false,
      message: 'Verification failed. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
