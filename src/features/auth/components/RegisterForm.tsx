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

import { Button } from '@/components/marketing_pages/Button';
import { EnhancedTextField } from '@/components/ui/enhanced-text-field';
import { EnhancedSelectField } from '@/components/ui/enhanced-select-field';
import { PasswordField } from '@/components/ui/password-field';
import { registerUser } from '../server/actions/registration';
import { checkUserPendingRegistration } from '../server/actions/login';
import { authToasts } from '@/lib/toast';
import {
  registerSchema,
  type RegisterFormData,
} from '../schemas/register-schema';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Check if user already has a pending registration
      const { hasPendingRegistration } = await checkUserPendingRegistration(
        data.email
      );

      if (hasPendingRegistration) {
        // User already has pending registration, redirect to verify-email page
        console.log(
          'User already has pending registration, redirecting to verify-email'
        );
        authToasts.warning(
          'Registration Already in Progress',
          'You already have a pending registration. Please check your email and verify your account.'
        );
        const emailParam = encodeURIComponent(data.email);
        router.push(`/verify-email?showResend=true&email=${emailParam}`);
        return;
      }

      // Use server action for registration and email sending
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        referralSource: data.referralSource,
      });

      if (result.success) {
        // Show success toast and redirect
        authToasts.registrationSuccess(data.email);
        router.push('/verify-email');
      } else {
        // Show error toast
        authToasts.registrationError(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      authToasts.registrationError(
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <EnhancedTextField
          label="First name"
          type="text"
          autoComplete="given-name"
          required
          {...register('firstName')}
          error={errors.firstName?.message}
        />

        <EnhancedTextField
          label="Last name"
          type="text"
          autoComplete="family-name"
          required
          {...register('lastName')}
          error={errors.lastName?.message}
        />

        <EnhancedTextField
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
          value={passwordValue || ''}
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

        <EnhancedSelectField
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
        </EnhancedSelectField>
      </div>

      <Button
        type="submit"
        color="cyan"
        className="w-full"
        disabled={isLoading || isSubmitting}
      >
        {isLoading ? 'Creating account...' : 'Start invoicing with PayMatch'}
      </Button>
    </form>
  );
}
