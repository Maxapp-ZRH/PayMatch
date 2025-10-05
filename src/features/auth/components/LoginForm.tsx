/**
 * Login Form Component
 *
 * Handles user login with email and password using Supabase Auth.
 * Includes form validation, error handling, and loading states.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/marketing_pages/Button';
import { createClient } from '@/lib/supabase/client';
import { EnhancedTextField } from '@/components/ui/enhanced-text-field';
import { PasswordField } from '@/components/ui/password-field';
import { loginSchema, type LoginFormData } from '../schemas/login-schema';
import {
  userHasOrganizationClient,
  userHasCompletedOnboardingClient,
} from '../helpers/client-auth-helpers';
import {
  checkUserPendingRegistration,
  checkUserExistsInAuth,
} from '../server/actions/login';

interface LoginFormProps {
  redirectTo?: string;
  showVerifiedMessage?: boolean;
}

export function LoginForm({
  redirectTo,
  showVerifiedMessage = false,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data: LoginFormData) => {
    // Clear any previous server errors
    clearErrors();
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // Handle specific error cases with field-level validation
        if (
          error.message.includes('Email not confirmed') ||
          error.message.includes('email_not_confirmed') ||
          error.message.includes('Sign-in failed: email not confirmed') ||
          error.message.includes('not confirmed')
        ) {
          setError('email', {
            type: 'manual',
            message:
              'Please verify your email address before signing in. Check your email for a verification link.',
          });
          return;
        }

        // For "Invalid login credentials" error, check if user exists in Supabase Auth
        // If user doesn't exist, they might have a pending registration
        if (
          error.message.includes('Invalid login credentials') ||
          error.message.includes('invalid_credentials')
        ) {
          // Check if user exists in Supabase Auth by searching for them
          const { exists: userExists, error: userError } =
            await checkUserExistsInAuth(data.email);

          // If user doesn't exist in Supabase Auth, check for pending registration
          if (userError || !userExists) {
            const { hasPendingRegistration } =
              await checkUserPendingRegistration(data.email);

            if (hasPendingRegistration) {
              // User exists in pending registrations - redirect to verify-email
              // GDPR-Compliant: We don't validate passwords for pending registrations
              // The password will be validated when the user is created in Supabase Auth
              const emailParam = encodeURIComponent(data.email);
              router.push(`/verify-email?showResend=true&email=${emailParam}`);
              router.refresh();
              return;
            }
          }

          // Set field-level error for invalid credentials
          setError('password', {
            type: 'manual',
            message:
              'Invalid email or password. Please check your credentials and try again.',
          });
          return;
        }

        // Handle other errors with field-level validation
        setError('email', {
          type: 'manual',
          message: 'An error occurred during login. Please try again.',
        });
        return;
      }

      // At this point, user is authenticated and email is verified

      // Email is verified, check if user has organization
      const hasOrg = await userHasOrganizationClient(authData.user.id);

      if (!hasOrg) {
        // User is verified but doesn't have organization - this shouldn't happen
        // as organization is created during email verification, but handle gracefully
        setError('email', {
          type: 'manual',
          message:
            'Account setup incomplete. Please contact support for assistance.',
        });
        return;
      }

      // Check if user has completed onboarding
      const hasCompletedOnboarding = await userHasCompletedOnboardingClient(
        authData.user.id
      );

      if (!hasCompletedOnboarding) {
        // Redirect to onboarding without error message (this is expected flow)
        router.push('/onboarding');
        router.refresh();
        return;
      }

      // Everything is set up, redirect to dashboard
      const destination = redirectTo || '/dashboard';
      router.push(destination);
      router.refresh();
    } catch {
      setError('email', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showVerifiedMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Email Verified Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your email has been verified. Please sign in to continue.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <EnhancedTextField
          label="Email address"
          type="email"
          autoComplete="email"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordField
          label="Password"
          autoComplete="current-password"
          required
          {...register('password')}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          color="cyan"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in to PayMatch'}
        </Button>
      </form>
    </div>
  );
}
