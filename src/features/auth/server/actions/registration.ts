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
} from '../utils/user-operations';
import { generateVerificationToken } from '../utils/token-operations';

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  referralSource?: string;
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
  try {
    console.log('Starting registration for email:', data.email);

    // Check if user already has a pending registration
    const { hasPendingRegistration } = await checkPendingRegistration(
      data.email
    );

    if (hasPendingRegistration) {
      console.log(
        'User already has pending registration, preventing duplicate registration'
      );
      return {
        success: false,
        message:
          'You already have a pending registration. Please check your email and verify your account.',
      };
    }

    // Store pending registration data temporarily
    const pendingResult = await storePendingRegistration({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      language: 'de', // Default to German for Swiss market
    });

    console.log('Pending registration result:', pendingResult);

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
      return {
        success: false,
        message:
          'Registration data stored, but failed to send verification email. Please try again.',
      };
    }

    return {
      success: true,
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  } catch (error) {
    console.error('Registration error:', error);
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
