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
import { EnhancedTextField } from '@/components/ui/enhanced-text-field';
import {
  sendPasswordResetEmail,
  checkPendingRegistrationForPasswordReset,
} from '../server/actions/password-reset';
import { authToasts } from '@/lib/toast';
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
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
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
          `/verify-email?email=${emailParam}&showResend=true&pendingPasswordReset=true`
        );
        return;
      }

      // Send password reset email for existing users
      const result = await sendPasswordResetEmail(data.email);

      if (result.success) {
        authToasts.passwordResetSent(data.email);
        setSuccess(true);
      } else {
        authToasts.passwordResetError(result.message);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      authToasts.passwordResetError(
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

      <EnhancedTextField
        label="Email address"
        type="email"
        autoComplete="email"
        required
        {...register('email')}
        error={errors.email?.message}
      />

      <Button
        type="submit"
        color="cyan"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Sending reset link...' : 'Send reset link'}
      </Button>
    </form>
  );
}
