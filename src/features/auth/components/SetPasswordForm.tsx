/**
 * Set Password Form Component
 *
 * Handles password collection during email verification for GDPR compliance.
 * This form is shown when user clicks verification link and needs to set their password.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/marketing_pages/Button';
import { PasswordField } from '@/components/ui/password-field';
import { setPendingRegistrationPassword } from '../server/actions/registration';
import { authToasts } from '@/lib/toast';

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

interface SetPasswordFormProps {
  email: string;
  onSuccess?: () => void;
}

export function SetPasswordForm({ email, onSuccess }: SetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: SetPasswordFormData) => {
    setIsLoading(true);

    try {
      const result = await setPendingRegistrationPassword(email, data.password);

      if (result.success) {
        authToasts.success('Account created successfully!', result.message);
        onSuccess?.();
        router.push('/login');
      } else {
        authToasts.error(result.message);
      }
    } catch (error) {
      console.error('Set password error:', error);
      authToasts.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Set your password
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Complete your account setup by creating a secure password for{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <PasswordField
          label="Password"
          autoComplete="new-password"
          required
          showRequirements
          value={passwordValue || ''}
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordField
          label="Confirm Password"
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
          {isLoading ? 'Creating account...' : 'Complete registration'}
        </Button>
      </form>
    </div>
  );
}
