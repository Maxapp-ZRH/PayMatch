/**
 * Onboarding Page
 *
 * Main onboarding page that displays the onboarding wizard.
 * Uses a full-page layout with modern design.
 */

import { type Metadata } from 'next';
import { redirect } from 'next/navigation';

import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard';
import { createClient } from '@/lib/supabase/server';
import type { PlanName } from '@/config/plans';

export const metadata: Metadata = {
  title: 'Onboarding - PayMatch',
  description:
    'Complete your PayMatch setup to start creating Swiss QR-bill compliant invoices.',
};

export default async function OnboardingPage() {
  const supabase = await createClient();

  // Get current user (middleware already verified authentication)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's organization with onboarding step
  const { data: orgMembership } = await supabase
    .from('organization_users')
    .select(
      `
      org_id,
      organizations!inner(id, name, plan, onboarding_step)
    `
    )
    .eq('user_id', user!.id)
    .eq('status', 'active')
    .single();

  const org = orgMembership?.organizations as
    | { id: string; name: string; plan: string; onboarding_step: number }
    | undefined;

  if (!org) {
    // This shouldn't happen due to middleware checks
    redirect('/login');
  }

  // Use the stored onboarding step, but ensure it's valid (1-4)
  const currentStep = Math.max(1, Math.min(4, org.onboarding_step || 1));

  return (
    <OnboardingWizard
      orgId={org.id}
      initialPlan={org.plan as PlanName}
      initialStep={currentStep}
    />
  );
}
