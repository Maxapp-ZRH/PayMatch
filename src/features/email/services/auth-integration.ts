/**
 * Auth Email Integration Service
 *
 * Handles all email-related operations for authentication using Supabase auth links.
 * Centralized email sending logic for auth flows with branded templates.
 *
 * - signup: For email verification after user registration (no password needed)
 * - recovery: For password reset links
 * - magiclink: For passwordless login flows
 */

'use server';

import React from 'react';
import { sendEmailWithComponent } from '@/features/email/email-service';
import { EmailVerification } from '@/emails/email-verification';
import { PasswordReset } from '@/emails/password-reset';
import { MagicLinkLogin } from '@/emails/magic-link-login';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Send verification email using Supabase signup links
 * This will verify the user's email and mark email_confirmed as true
 * Note: User must already exist from registration (no password needed here)
 */
export async function sendVerificationEmail(
  email: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Generate a magic link for email verification
    // This is the correct type for email verification after registration
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error || !data.properties?.action_link) {
      console.error('Failed to generate verification link:', error);
      throw new Error(error?.message || 'Failed to generate verification link');
    }

    // Parse the generated link to extract the token
    const generatedUrl = new URL(data.properties.action_link);
    const token = generatedUrl.searchParams.get('token');
    const type = generatedUrl.searchParams.get('type');

    if (!token) {
      console.error('No token found in generated link');
      throw new Error('No token found in generated verification link');
    }

    // Construct our own callback URL with the token
    const verificationUrl = `${baseUrl}/auth/callback?token=${token}&type=${type}`;

    const userName = `${firstName} ${lastName}`;

    // Send using existing React Email template with magic link
    const result = await sendEmailWithComponent({
      to: email,
      subject: 'Verify your PayMatch account',
      emailType: 'security', // Mark as security email to skip unsubscribe URLs
      component: React.createElement(EmailVerification, {
        userName,
        verificationUrl: verificationUrl,
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
 * Send password reset email using Supabase magic links
 */
export async function sendPasswordResetEmail(
  email: string,
  userName: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // Generate Supabase password reset magic link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${baseUrl}/auth/callback?type=recovery`,
      },
    });

    if (error || !data.properties?.action_link) {
      console.error('Failed to generate reset link:', error);
      throw new Error(error?.message || 'Failed to generate reset link');
    }

    // Parse the generated link to extract the token
    const generatedUrl = new URL(data.properties.action_link);
    const token = generatedUrl.searchParams.get('token');
    const type = generatedUrl.searchParams.get('type');

    if (!token) {
      console.error('No token found in generated reset link');
      throw new Error('No token found in generated password reset link');
    }

    // Construct our own callback URL with the token and type
    const resetUrl = `${baseUrl}/auth/callback?token=${token}&type=${type || 'recovery'}`;

    // Send using existing React Email template
    const result = await sendEmailWithComponent({
      to: email,
      subject: 'Reset your PayMatch password',
      emailType: 'security', // Mark as security email to skip unsubscribe URLs
      component: React.createElement(PasswordReset, {
        userName,
        resetUrl: resetUrl,
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

/**
 * Send magic link login email using Supabase magic link
 * This allows users to sign in without a password
 */
export async function sendMagicLinkEmail(
  email: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // First check if user exists by trying to list users
    const { data: usersData, error: userError } =
      await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000, // Get all users to search through
      });

    if (userError) {
      console.error('Error checking user existence:', userError);
      throw new Error('Failed to check user existence');
    }

    // Find user by email
    const user = usersData.users.find((u) => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // Get proper user name
    const properUserName = user.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
      : email;

    // Generate Supabase magic link for login
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error || !data.properties?.action_link) {
      console.error('Failed to generate magic link:', error);
      throw new Error(error?.message || 'Failed to generate magic link');
    }

    // Parse the generated link to extract the token
    const generatedUrl = new URL(data.properties.action_link);
    const token = generatedUrl.searchParams.get('token');
    const type = generatedUrl.searchParams.get('type');

    if (!token) {
      console.error('No token found in generated magic link');
      throw new Error('No token found in generated magic link');
    }

    // Construct our own callback URL with the token
    const magicLinkUrl = `${baseUrl}/auth/callback?token=${token}&type=${type || 'magiclink'}`;

    // Send using existing React Email template
    const result = await sendEmailWithComponent({
      to: email,
      subject: 'Your magic link to sign in to PayMatch',
      emailType: 'security', // Mark as security email to skip unsubscribe URLs
      component: React.createElement(MagicLinkLogin, {
        userName: properUserName,
        magicLinkUrl: magicLinkUrl,
        appUrl: baseUrl,
      }),
    });

    if (!result.success) {
      console.error('Failed to send magic link email:', result.error);
      return {
        success: false,
        message: 'Failed to send magic link email',
        error: result.error,
      };
    }

    console.log('Magic link email sent successfully');
    return { success: true, message: 'Magic link email sent successfully' };
  } catch (error) {
    console.error('Error sending magic link email:', error);
    return {
      success: false,
      message: 'Failed to send magic link email',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
