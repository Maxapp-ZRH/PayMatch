/**
 * Forgot Password Form Component
 *
 * Handles password reset requests with email validation.
 * Sends reset link via Supabase Auth and Resend.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/marketing_pages/Button';
import { TextField } from '@/components/ui/text-field';
import {
  sendPasswordResetEmail,
  checkPendingRegistrationForPasswordReset,
} from '../server/actions/password-reset';
import { getClientIP, getUserAgent } from '@/utils/client-info';
import { useRouter } from 'next/navigation';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../schemas/forgot-password-schema';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearErrors(); // Clear any previous server errors
    setIsLoading(true);

    try {
      // First check if user has a pending registration
      const pendingCheck = await checkPendingRegistrationForPasswordReset(
        data.email
      );

      if (pendingCheck.hasPendingRegistration) {
        // Redirect to verify-email page with appropriate message
        const emailParam = encodeURIComponent(data.email);
        router.push(
          `/verify-email?email=${emailParam}&immediateResend=true&pendingPasswordReset=true`
        );
        return;
      }

      // Extract client information for server action
      const [clientIP, userAgent] = await Promise.all([
        getClientIP(),
        Promise.resolve(getUserAgent()),
      ]);

      // Send password reset email for existing users
      const result = await sendPasswordResetEmail(
        data.email,
        undefined,
        clientIP,
        userAgent
      );

      if (result.success) {
        setSuccess(true);
      } else {
        // Set field-level error
        setError('email', {
          type: 'manual',
          message:
            result.message || 'Failed to send reset email. Please try again.',
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('email', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
      });
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
          Check your email
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ve sent you a password reset link. Please check your email and
          click the link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-sm text-gray-600">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </div>

      <TextField
        label="Email address"
        type="email"
        autoComplete="email"
        required
        {...register('email')}
        error={errors.email?.message}
      />

      <Button
        type="submit"
        color="swiss"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Sending reset link...' : 'Send reset link'}
      </Button>
    </form>
  );
}
