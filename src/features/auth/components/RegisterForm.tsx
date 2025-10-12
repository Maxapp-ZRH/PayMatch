/**
 * Register Form Component
 *
 * Handles user registration with email, password, and confirm password.
 * Includes form validation, error handling, and email verification flow.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button } from '@/components/marketing_pages/Button';
import { TextField } from '@/components/ui/text-field';
import { SelectField } from '@/components/ui/select-field';
import { PasswordField } from '@/components/ui/password-field';
import { registerUser } from '../server/actions/registration';
import { checkUserPendingRegistration } from '../server/actions/login';
import {
  registerSchema,
  type RegisterFormData,
} from '../schemas/register-schema';
import {
  getClientIP,
  getUserAgent,
  getBrowserLocale,
} from '@/utils/client-info';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  // Watch password field for real-time requirements display
  const watchedPassword = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    // Clear any previous server errors
    clearErrors();
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Check if user already has a pending registration
      const { hasPendingRegistration } = await checkUserPendingRegistration(
        data.email
      );

      if (hasPendingRegistration) {
        // User already has pending registration, redirect to verify-email page with immediate resend
        const emailParam = encodeURIComponent(data.email);
        router.push(`/verify-email?immediateResend=true&email=${emailParam}`);
        return;
      }

      // Extract client information for server action
      const [clientIP, userAgent, browserLocale] = await Promise.all([
        getClientIP(),
        Promise.resolve(getUserAgent()),
        Promise.resolve(getBrowserLocale()),
      ]);

      // Use server action for registration and email sending with new security features
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        referralSource: data.referralSource,
        browserLocale,
        clientIP,
        userAgent,
      });

      if (result.success) {
        // Redirect with email parameter (no toast needed)
        const emailParam = encodeURIComponent(data.email);
        router.push(`/verify-email?email=${emailParam}&showResend=true`);
      } else {
        // Set field-level error
        setError('email', {
          type: 'manual',
          message: result.message || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('email', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <TextField
          label="First name"
          type="text"
          autoComplete="given-name"
          required
          {...register('firstName')}
          error={errors.firstName?.message}
        />

        <TextField
          label="Last name"
          type="text"
          autoComplete="family-name"
          required
          {...register('lastName')}
          error={errors.lastName?.message}
        />

        <TextField
          className="col-span-full"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordField
          className="col-span-full"
          label="Password"
          autoComplete="new-password"
          required
          showRequirements
          value={watchedPassword}
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordField
          className="col-span-full"
          label="Confirm Password"
          autoComplete="new-password"
          required
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <SelectField
          className="col-span-full"
          label="How did you hear about us?"
          {...register('referralSource')}
        >
          <option value="">Select an option</option>
          <option value="google">Google search</option>
          <option value="social">Social media</option>
          <option value="referral">Referral from colleague</option>
          <option value="directory">Swiss business directory</option>
          <option value="other">Other</option>
        </SelectField>
      </div>

      <Button
        type="submit"
        color="swiss"
        className="w-full"
        disabled={isLoading || isSubmitting}
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By signing up, you agree to our{' '}
        <Link
          href="/terms"
          className="text-cyan-600 hover:text-cyan-700 underline transition-colors duration-200 hover:underline-offset-2"
        >
          Terms and Conditions
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="text-cyan-600 hover:text-cyan-700 underline transition-colors duration-200 hover:underline-offset-2"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
