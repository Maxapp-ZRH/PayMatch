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
  password: string;
  firstName: string;
  lastName: string;
  language: string;
}

export interface PendingRegistrationResult {
  success: boolean;
  message: string;
  verificationToken?: string;
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
    console.log('Checking if user exists in Supabase Auth for:', data.email);
    const userExists = await userExistsByEmail(data.email);
    console.log('User exists check result:', userExists);

    if (userExists) {
      console.log('User already exists, returning error');
      return {
        success: false,
        message:
          'An account with this email already exists. Please sign in instead.',
      };
    }

    console.log('User does not exist, proceeding with registration');

    // Generate verification token
    const { token: verificationToken, expiresAt } = generateVerificationToken();

    // Store pending registration with plain password
    // SECURITY NOTE: Plain password is temporarily stored (max 24 hours)
    // This is necessary because Supabase expects plain passwords for user creation
    // The record is automatically deleted after verification or expiration
    const { error } = await supabase.from('pending_registrations').insert({
      email: data.email,
      password_hash: data.password, // Temporarily store plain password
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        language: data.language,
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
      .single();

    if (fetchError || !pendingReg) {
      return {
        success: false,
        message: 'Invalid or expired verification link.',
      };
    }

    // Check if token has expired
    if (new Date() > new Date(pendingReg.expires_at)) {
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

    // Create Supabase user (without email confirmation to trigger the database trigger)
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: pendingReg.email,
        password: pendingReg.password_hash,
        email_confirm: false, // Don't confirm yet - let the trigger handle it
        user_metadata: pendingReg.user_metadata,
      });

    if (createError || !newUser.user) {
      console.error('Error creating Supabase user:', createError);
      return {
        success: false,
        message: 'Failed to create account. Please try again.',
      };
    }

    // Update user to confirm email - this will trigger the database trigger
    // which will create the user profile, organization, and organization membership
    const { error: confirmError } =
      await supabaseAdmin.auth.admin.updateUserById(newUser.user.id, {
        email_confirm: true,
      });

    if (confirmError) {
      console.error('Error confirming email:', confirmError);
      return {
        success: false,
        message:
          'Account created but failed to confirm email. Please contact support.',
      };
    }

    // Clean up pending registration (removes plain password from database)
    await supabase
      .from('pending_registrations')
      .delete()
      .eq('id', pendingReg.id);

    return {
      success: true,
      message: 'Account created successfully! You can now sign in.',
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
