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
import { Lock } from 'lucide-react';

import { Button } from '@/components/marketing_pages/Button';
import { PasswordField } from '@/components/ui/password-field';
import { setPendingRegistrationPassword } from '../server/actions/registration';
import { showToast } from '@/lib/toast';

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
        showToast.success('Account created successfully!', result.message);
        onSuccess?.();
        // Redirect to login page where user can sign in with their new credentials
        router.push(
          '/login?email=' +
            encodeURIComponent(email) +
            '&message=Your account has been created successfully. Please sign in with your new password to continue.'
        );
      } else {
        showToast.error(result.message);
      }
    } catch (error) {
      console.error('Set password error:', error);
      showToast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
          <Lock className="h-6 w-6 text-teal-600" />
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
          color="swiss"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Complete registration'}
        </Button>
      </form>
    </div>
  );
}
