/**
 * Login Form Component
 *
 * Handles user login with email and password using Supabase Auth.
 * Includes form validation, error handling, and loading states.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Mail, Lock } from 'lucide-react';

import { Button } from '@/components/marketing_pages/Button';
import { createClient } from '@/lib/supabase/client';
import { TextField } from '@/components/ui/text-field';
import { PasswordField } from '@/components/ui/password-field';
import { loginSchema, type LoginFormData } from '../schemas/login-schema';
// Removed client auth helpers - server handles redirects
import {
  checkUserPendingRegistration,
  checkUserExistsInAuth,
} from '../server/actions/login';
import { MagicLinkLoginForm } from './MagicLinkLoginForm';

interface LoginFormProps {
  redirectTo?: string;
  showVerifiedMessage?: boolean;
  initialEmail?: string;
  successMessage?: string;
}

export function LoginForm({
  redirectTo,
  showVerifiedMessage = false,
  initialEmail,
  successMessage,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'magiclink'>(
    'password'
  );
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      email: initialEmail || '',
      password: '',
      rememberMe: false,
    },
  });

  // Check if user previously selected Remember Me
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberMe =
        localStorage.getItem('supabase.auth.remember') === 'true';
      setValue('rememberMe', rememberMe);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    // Clear any previous server errors
    clearErrors();
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // Handle Remember Me functionality
      if (authData.session && data.rememberMe) {
        // For Remember Me, we'll store the session in localStorage
        // This will persist the session across browser sessions
        localStorage.setItem('supabase.auth.remember', 'true');
      } else {
        // Clear the remember flag if not checked
        localStorage.removeItem('supabase.auth.remember');
      }

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
              router.push(
                `/verify-email?immediateResend=true&email=${emailParam}`
              );
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

      // Email is verified - redirect to dashboard or intended destination
      // Server-side auth pages will handle organization and onboarding checks
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
                <p>
                  Your email has been verified. You&apos;re now signed in and
                  will be redirected to complete your setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="rounded-md bg-teal-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-teal-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-teal-800">
                Welcome to PayMatch!
              </h3>
              <div className="mt-2 text-sm text-teal-700">
                <p>
                  Your account has been created successfully. Please sign in
                  with your new password to continue.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Method Selector */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setLoginMethod('password')}
          className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            loginMethod === 'password'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Password</span>
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod('magiclink')}
          className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            loginMethod === 'magiclink'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>Magic Link</span>
        </button>
      </div>

      {/* Conditional Form Rendering */}
      {loginMethod === 'password' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextField
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            color="swiss"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in to PayMatch'}
          </Button>
        </form>
      ) : (
        <MagicLinkLoginForm
          onSuccess={() => {
            // Magic link sent successfully
          }}
          onError={(error) => {
            console.error('Magic link error:', error);
          }}
        />
      )}
    </div>
  );
}
