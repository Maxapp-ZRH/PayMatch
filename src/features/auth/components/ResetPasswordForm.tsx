/**
 * Reset Password Form Component
 *
 * Handles password reset with new password and confirmation.
 * Updates user password via Supabase Auth.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/marketing_pages/Button';
import { PasswordField } from '@/components/ui/password-field';
import { authToasts } from '@/lib/toast';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '../schemas/reset-password-schema';
import {
  resetPassword,
  verifyResetToken,
} from '../server/actions/password-reset';

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password');

  // Check if token is valid
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        authToasts.error(
          'Invalid reset link',
          'Please request a new password reset link.'
        );
        setIsValidToken(false);
        return;
      }

      try {
        const result = await verifyResetToken(token);
        if (!result.valid) {
          authToasts.error(
            'Invalid or expired reset link',
            result.error || 'Please request a new password reset link.'
          );
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        authToasts.error(
          'Invalid reset link',
          'Please request a new password reset link.'
        );
        setIsValidToken(false);
      }
    };
    checkToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      authToasts.error(
        'Invalid reset link',
        'Please request a new password reset link.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token, data.password);

      if (!result.success) {
        authToasts.error('Password reset failed', result.message);
        return;
      }

      authToasts.success(
        'Password updated successfully!',
        'You can now sign in with your new password.'
      );
      setSuccess(true);

      // Redirect to login after successful password reset
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      authToasts.error(
        'Password reset failed',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while validating token
  if (isValidToken === null) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Validating reset link...
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we verify your password reset link.
        </p>
      </div>
    );
  }

  // Show error state if token is invalid
  if (isValidToken === false) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Invalid reset link
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <div className="mt-6">
          <Button color="cyan" onClick={() => router.push('/forgot-password')}>
            Request new reset link
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Password updated successfully
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Your password has been updated. You will be redirected to the login
          page shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-sm text-gray-600">
        Enter your new password below. Make sure it&apos;s at least 8 characters
        long.
      </div>

      <PasswordField
        label="New Password"
        autoComplete="new-password"
        required
        showRequirements
        value={passwordValue || ''}
        {...register('password')}
        error={errors.password?.message}
      />

      <PasswordField
        label="Confirm New Password"
        autoComplete="new-password"
        required
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        color="cyan"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Updating password...' : 'Update password'}
      </Button>
    </form>
  );
}
