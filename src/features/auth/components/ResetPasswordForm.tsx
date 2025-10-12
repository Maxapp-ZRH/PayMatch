/**
 * Reset Password Form Component
 *
 * Handles password reset with new password and confirmation.
 * Updates user password via Supabase Auth after magic link verification.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/marketing_pages/Button';
import { PasswordField } from '@/components/ui/password-field';
import { showToast } from '@/lib/toast';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '../schemas/reset-password-schema';
import { createClient } from '@/lib/supabase/client';

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      if (!token) {
        showToast.error(
          'Invalid reset link',
          'No reset token found. Please request a new password reset.'
        );
        return;
      }

      // Check if we already have a session (token was verified in auth callback)
      console.log('Checking for existing session...');
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      console.log('Session check result:', {
        session: !!session,
        error: sessionError,
      });

      if (sessionError || !session) {
        // If no session, try to verify the token
        console.log('No session found, verifying token...');
        console.log('Token:', token);
        const { error: tokenError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery',
        });

        if (tokenError) {
          console.error('Token verification error:', tokenError);
          showToast.error(
            'Invalid reset link',
            'This password reset link is invalid or has expired.'
          );
          return;
        }
        console.log('Token verified successfully');
      } else {
        console.log('Using existing session for password reset');
      }

      // Now update the password
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        console.error('Password update error:', error);
        showToast.error('Password update failed', error.message);
        return;
      }

      // Sign out the user after password reset to ensure they go to login page
      await supabase.auth.signOut();

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
        color="swiss"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Updating password...' : 'Update password'}
      </Button>
    </form>
  );
}
