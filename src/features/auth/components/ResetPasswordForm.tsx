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
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/marketing_pages/Button';
import { PasswordField } from '@/components/ui/password-field';
import { showToast } from '@/lib/toast';
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
        showToast.error(
          'Invalid reset link',
          'Please request a new password reset link.'
        );
        setIsValidToken(false);
        return;
      }

      try {
        const result = await verifyResetToken(token);
        if (!result.valid) {
          showToast.error(
            'Invalid or expired reset link',
            result.error || 'Please request a new password reset link.'
          );
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        showToast.error(
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
      showToast.error(
        'Invalid reset link',
        'Please request a new password reset link.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token, data.password);

      if (!result.success) {
        showToast.error('Password reset failed', result.message);
        return;
      }

      showToast.success(
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
      showToast.error(
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
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
          <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
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
          <XCircle className="h-6 w-6 text-red-600" />
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
          <CheckCircle className="h-6 w-6 text-green-600" />
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
