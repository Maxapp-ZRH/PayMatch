/**
 * Magic Link Login Form Component
 *
 * Provides a clean interface for passwordless authentication using magic links.
 * Users enter their email and receive a magic link to sign in.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/marketing_pages/Button';
import { TextField } from '@/components/ui/text-field';
import { sendMagicLinkLogin } from '@/features/auth/server/actions/magic-link-login';

const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

interface MagicLinkLoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function MagicLinkLoginForm({
  onSuccess,
  onError,
  className,
}: MagicLinkLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: MagicLinkFormData) => {
    setIsLoading(true);
    clearErrors();

    try {
      const result = await sendMagicLinkLogin(data.email);

      if (result.success) {
        setIsSent(true);
        setSentEmail(data.email);
        onSuccess?.();
      } else {
        setError('email', {
          message: result.message || 'Failed to send magic link',
        });
        onError?.(result.message || 'Failed to send magic link');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError('email', { message: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsSent(false);
    setSentEmail('');
  };

  if (isSent) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Magic Link Sent!
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Check your email at <strong>{sentEmail}</strong> and click the link
            to sign in.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Link expires in 1 hour. Check spam folder if not received.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResend}
            color="swiss"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </div>
            ) : (
              'Resend Link'
            )}
          </Button>

          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Different Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 ${className}`}
    >
      <TextField
        label="Email address"
        type="email"
        autoComplete="email"
        required
        {...register('email')}
        error={errors.email?.message}
        disabled={isLoading}
      />

      <Button
        type="submit"
        color="swiss"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Magic Link...
          </div>
        ) : (
          'Send Magic Link'
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          We&apos;ll send you a secure link to sign in without a password.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-cyan-600 hover:text-cyan-700">
            Sign up here
          </Link>
        </p>
      </div>
    </form>
  );
}
