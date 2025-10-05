/**
 * Onboarding Page
 *
 * User onboarding flow for new PayMatch users.
 * Guides users through essential setup steps.
 */

import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthLayout } from '@/components/marketing_pages/AuthLayout';
import { OnboardingForm } from '@/features/onboarding/components/OnboardingForm';
import { LogoutButton } from '@/components/ui/logout-button';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Onboarding - PayMatch',
  description:
    'Complete your PayMatch setup to start creating Swiss QR-bill compliant invoices.',
};

export default async function Onboarding() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect('/login');
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect('/dashboard');
  }

  return (
    <AuthLayout
      title="Welcome to PayMatch!"
      subtitle="Let's get you set up to start creating Swiss QR-bill compliant invoices."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <LogoutButton variant="ghost" size="sm" />
        </div>
        <OnboardingForm />
      </div>
    </AuthLayout>
  );
}
