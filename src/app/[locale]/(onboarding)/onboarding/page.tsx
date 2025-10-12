/**
 * Onboarding Page
 *
 * Main onboarding page that displays the onboarding wizard.
 * Uses a full-page layout with modern design.
 */

import { type Metadata } from 'next';

import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard';
import { requireOnboardingSession } from '@/features/auth';
import type { PlanName } from '@/config/plans';

export const metadata: Metadata = {
  title: 'Onboarding - PayMatch',
  description:
    'Complete your PayMatch setup to start creating Swiss QR-bill compliant invoices.',
};

export default async function OnboardingPage() {
  // Get authenticated session with onboarding requirements
  const { organization } = await requireOnboardingSession();

  if (!organization) {
    throw new Error('Organization not found');
  }

  // Use the stored onboarding step, but ensure it's valid (1-4)
  const currentStep = Math.max(
    1,
    Math.min(4, organization.onboarding_step || 1)
  );

  return (
    <>
      {/* Session Timeout Warning */}

      <OnboardingWizard
        orgId={organization.id}
        initialPlan={organization.plan as PlanName}
        initialStep={currentStep}
      />
    </>
  );
}
