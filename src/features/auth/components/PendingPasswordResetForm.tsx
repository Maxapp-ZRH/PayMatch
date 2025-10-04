/**
 * Pending Password Reset Form Component
 *
 * Handles password reset for users with pending registrations.
 * Similar to regular password reset but works with pending_registrations table.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/marketing_pages/Button';
import { PasswordField } from '@/components/ui/password-field';
import {
  resetPendingPassword,
  verifyPendingResetToken,
} from '../server/actions/pending-password-reset';
import { authToasts } from '@/lib/toast';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '../schemas/reset-password-schema';

export function PendingPasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);
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
        const result = await verifyPendingResetToken(token);
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
      const result = await resetPendingPassword(token, data.password);

      if (!result.success) {
        authToasts.error('Password reset failed', result.message);
        return;
      }

      authToasts.success(
        'Password updated successfully!',
        'You can now verify your email to complete registration.'
      );
      setSuccess(true);

      // Redirect to verify-email page after successful password reset
      setTimeout(() => {
        router.push('/verify-email');
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
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Verifying reset link...
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we verify your password reset link.
        </p>
      </div>
    );
  }

  // Show error if token is invalid
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
          Invalid Reset Link
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => router.push('/forgot-password')}
            color="cyan"
            className="w-full"
          >
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  // Show success state
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
          Password Updated Successfully!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Your password has been updated. You can now verify your email to
          complete registration.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => router.push('/verify-email')}
            color="cyan"
            className="w-full"
          >
            Go to Email Verification
          </Button>
        </div>
      </div>
    );
  }

  // Show password reset form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-sm text-gray-600">
        Enter your new password below. After updating your password, you can
        verify your email to complete registration.
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
        {isLoading ? 'Updating password...' : 'Update Password'}
      </Button>
    </form>
  );
}
