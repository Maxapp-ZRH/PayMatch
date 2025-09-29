import { type Metadata } from 'next';
import Link from 'next/link';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { Button } from '@/components/marketing_pages/Button';
import { TextField } from '@/components/marketing_pages/Fields';

export const metadata: Metadata = {
  title: 'Sign In - PayMatch',
};

export default function Login() {
  return (
    <AuthLayout
      title="Sign in to account"
      subtitle={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-red-500">
            Sign up
          </Link>{' '}
          to start invoicing.
        </>
      }
    >
      <form>
        <div className="space-y-6">
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" color="cyan" className="mt-8 w-full">
          Sign in to PayMatch
        </Button>
      </form>
    </AuthLayout>
  );
}
