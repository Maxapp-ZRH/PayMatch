import { type Metadata } from 'next';
import Link from 'next/link';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { Button } from '@/components/marketing_pages/Button';
import { SelectField, TextField } from '@/components/marketing_pages/Fields';

export const metadata: Metadata = {
  title: 'Sign Up - PayMatch',
};

export default function Register() {
  return (
    <AuthLayout
      title="Create your PayMatch account"
      subtitle={
        <>
          Already registered?{' '}
          <Link href="/login" className="text-teal-600">
            Sign in
          </Link>{' '}
          to your account.
        </>
      }
    >
      <form>
        <div className="grid grid-cols-2 gap-6">
          <TextField
            label="First name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
          />
          <TextField
            label="Last name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
          <TextField
            className="col-span-full"
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            className="col-span-full"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <SelectField
            className="col-span-full"
            label="How did you hear about us?"
            name="referral_source"
          >
            <option>Google search</option>
            <option>Social media</option>
            <option>Referral from colleague</option>
            <option>Swiss business directory</option>
            <option>Other</option>
          </SelectField>
        </div>
        <Button type="submit" color="cyan" className="mt-8 w-full">
          Start invoicing with PayMatch
        </Button>
      </form>
    </AuthLayout>
  );
}
