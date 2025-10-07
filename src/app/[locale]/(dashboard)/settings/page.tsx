/**
 * Settings Page
 *
 * Comprehensive account settings and preferences management.
 * Provides access to all user account settings including email preferences,
 * privacy settings, security, and other account management options.
 */

import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SettingsPageContent } from '@/features/dashboard/components/SettingsPageContent';

export const metadata: Metadata = {
  title: 'Settings - PayMatch',
  description: 'Manage your PayMatch account settings and preferences.',
};

export default async function SettingsPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect('/login');
  }

  // Check if user's email is verified
  if (!user.email_confirmed_at) {
    redirect('/verify-email');
  }

  // Check if user has completed onboarding
  const { data: orgMembership } = await supabase
    .from('organization_users')
    .select(
      `
      org_id,
      organizations!inner(onboarding_completed)
    `
    )
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  const org = orgMembership?.organizations as
    | { onboarding_completed: boolean }
    | undefined;
  if (!org?.onboarding_completed) {
    redirect('/onboarding');
  }

  return <SettingsPageContent userEmail={user.email || ''} />;
}
