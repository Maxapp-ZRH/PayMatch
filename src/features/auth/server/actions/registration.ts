/**
 * Registration Server Actions
 *
 * Handles user registration, email verification, and related operations.
 * Uses deferred account creation with pending registrations.
 */

'use server';

import { storePendingRegistration } from '../utils/pending-registration';
import {
  sendPendingRegistrationEmail,
  sendVerificationEmail,
} from '../services/email-service';
import { checkRateLimit } from '../services/rate-limiting';
import {
  findUserByEmail,
  checkPendingRegistration,
  getPendingRegistration,
} from '../utils/user-operations';
import { generateVerificationToken } from '../utils/token-operations';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { logRegistrationAttempt } from '../services/audit-logging';
import { checkDualRateLimit } from '../services/ip-rate-limiting';

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for GDPR compliance
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
 * Register a new user with deferred account creation
 */
export async function registerUser(
  data: RegisterUserData
): Promise<RegisterResult> {
  const ip = data.clientIP || 'unknown';

  try {
    // Check dual rate limiting (email + IP)
    if (data.clientIP) {
      const { emailAllowed, ipAllowed } = await checkDualRateLimit(
        data.email,
        ip,
        'AUTH_OPERATIONS',
        'IP_REGISTRATION_ATTEMPTS'
      );

      if (!emailAllowed || !ipAllowed) {
        await logRegistrationAttempt(
          data.email,
          { clientIP: data.clientIP, userAgent: data.userAgent },
          false,
          'Rate limit exceeded',
          { ip, emailAllowed, ipAllowed }
        );

        return {
          success: false,
          message:
            'Too many registration attempts. Please wait before trying again.',
        };
      }
    }

    // Check if user already has a pending registration
    const { hasPendingRegistration } = await checkPendingRegistration(
      data.email
    );

    if (hasPendingRegistration) {
      await logRegistrationAttempt(
        data.email,
        { clientIP: data.clientIP, userAgent: data.userAgent },
        false,
        'Duplicate registration attempt',
        { ip }
      );

      return {
        success: false,
        message:
          'You already have a pending registration. Please check your email and verify your account.',
      };
    }

    // Store pending registration data temporarily (GDPR-compliant, no password stored)
    const pendingResult = await storePendingRegistration({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      language: 'de', // Default to German for Swiss market
      referralSource: data.referralSource,
      browserLocale: data.browserLocale,
    });

    if (!pendingResult.success) {
      return {
        success: false,
        message: pendingResult.message,
      };
    }

    // Send verification email with the token
    const emailResult = await sendPendingRegistrationEmail(
      data.email,
      pendingResult.verificationToken!,
      `${data.firstName} ${data.lastName}`
    );

    if (!emailResult.success) {
      await logRegistrationAttempt(
        data.email,
        { clientIP: data.clientIP, userAgent: data.userAgent },
        false,
        'Failed to send verification email',
        { ip, error: emailResult.error }
      );

      return {
        success: false,
        message:
          'Registration data stored, but failed to send verification email. Please try again.',
      };
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
      }
    );

    return {
      success: true,
      message:
        'Registration successful! Please check your email to verify your account. You will be asked to set your password during verification.',
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
    // Check rate limit using centralized config
    if (!(await checkRateLimit(email, 'EMAIL_VERIFICATION'))) {
      return {
        success: false,
        message:
          'Too many verification emails sent. Please wait before trying again.',
      };
    }

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

    // Generate new verification token
    const { token: verificationToken } = generateVerificationToken();

    // Send verification email
    const result = await sendVerificationEmail(
      email,
      verificationToken,
      (user.user_metadata?.name as string) || email
    );

    if (!result.success) {
      console.error('Failed to send verification email:', result.error);
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

/**
 * Set password for pending registration during email verification
 * This is called when user clicks verification link and needs to set their password
 */
export async function setPendingRegistrationPassword(
  email: string,
  password: string
): Promise<RegisterResult> {
  try {
    // Check if there's a pending registration for this email
    const pendingRegistration = await getPendingRegistration(email);
    if (!pendingRegistration) {
      return {
        success: false,
        message: 'No pending registration found. Please register first.',
      };
    }

    // Create Supabase user with the provided password
    const { data: userData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password, // Supabase will hash this properly
        email_confirm: true, // Mark as verified since they clicked the link
        user_metadata: {
          first_name: pendingRegistration.first_name,
          last_name: pendingRegistration.last_name,
          ...pendingRegistration.user_metadata,
        },
      });

    if (authError) {
      console.error('Error creating user during verification:', authError);
      return {
        success: false,
        message: 'Failed to create account. Please try again.',
      };
    }

    if (!userData.user) {
      return {
        success: false,
        message: 'Failed to create user account. Please try again.',
      };
    }

    // Delete the pending registration since user is now created
    const { error: deleteError } = await supabaseAdmin
      .from('pending_registrations')
      .delete()
      .eq('email', email);

    if (deleteError) {
      console.error('Error cleaning up pending registration:', deleteError);
      // Don't fail the operation, just log the error
    }

    return {
      success: true,
      message: 'Account created successfully! You can now sign in.',
    };
  } catch (error) {
    console.error('Error setting pending registration password:', error);
    return {
      success: false,
      message: 'Failed to create account. Please try again.',
    };
  }
}

/**
 * Resend verification email for pending registrations
 * This handles users who have pending registrations but haven't verified their email yet
 */
export async function resendPendingVerificationEmail(
  email: string
): Promise<RegisterResult> {
  try {
    // Check rate limit using centralized config
    if (!(await checkRateLimit(email, 'EMAIL_VERIFICATION'))) {
      return {
        success: false,
        message:
          'Too many verification emails sent. Please wait before trying again.',
      };
    }

    // Check if there's a pending registration for this email
    const pendingRegistration = await getPendingRegistration(email);
    if (!pendingRegistration) {
      return {
        success: false,
        message:
          'Unable to resend verification email. Please try registering again.',
      };
    }

    // Generate new verification token
    const { token: verificationToken, expiresAt } = generateVerificationToken();

    // Update the pending registration with the new token
    const { error: updateError } = await supabaseAdmin
      .from('pending_registrations')
      .update({
        verification_token: verificationToken,
        expires_at: expiresAt.toISOString(),
      })
      .eq('email', email);

    if (updateError) {
      console.error('Error updating verification token:', updateError);
      return {
        success: false,
        message: 'Failed to update verification token. Please try again.',
      };
    }

    // Send verification email using the same function as registration
    // Construct name from first_name and last_name columns
    const name =
      pendingRegistration.first_name && pendingRegistration.last_name
        ? `${pendingRegistration.first_name} ${pendingRegistration.last_name}`
        : email;

    const result = await sendVerificationEmail(email, verificationToken, name);

    if (!result.success) {
      console.error(
        'Failed to send verification email for pending registration:',
        result.error
      );
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
    console.error(
      'Error resending verification email for pending registration:',
      error
    );
    return {
      success: false,
      message: 'Failed to resend verification email. Please try again.',
    };
  }
}

/**
 * Get pending user's first name for personalized messages
 */
export async function getPendingUserName(email: string) {
  try {
    if (!email) {
      return { success: false, firstName: null, error: 'No email provided' };
    }

    const { data: pendingRegistration, error } = await supabaseAdmin
      .from('pending_registrations')
      .select('first_name')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error fetching pending user name:', error);
      return { success: false, firstName: null, error: error.message };
    }

    if (!pendingRegistration) {
      return {
        success: false,
        firstName: null,
        error: 'No pending registration found',
      };
    }

    return {
      success: true,
      firstName: pendingRegistration.first_name || null,
    };
  } catch (error) {
    console.error('Error in getPendingUserName:', error);
    return {
      success: false,
      firstName: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
