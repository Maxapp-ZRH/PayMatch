/**
 * Onboarding Wizard Component
 *
 * Main onboarding wizard container that manages the step flow.
 * Integrates with Stripe for plan selection and handles the complete onboarding process.
 * Uses a modern full-page layout with smooth animations.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { OnboardingLayout } from './layout/OnboardingLayout';
import { StepNavigation } from './ui/StepNavigation';
import { PlanSelectionStep } from './steps/PlanSelectionStep';
import { CompanyDetailsStep } from './steps/CompanyDetailsStep';
import { SettingsStep } from './steps/SettingsStep';
import { SuccessStep } from './steps/SuccessStep';
import { updateOnboardingStep } from '../server/actions/update-onboarding-step';
import { completeOnboarding } from '../server/actions/complete-onboarding';
import { onboardingDraftService } from '../services/draft-service';
import type { OnboardingData, OnboardingWizardState } from '../types';
import type { PlanName } from '@/config/plans';

interface OnboardingWizardProps {
  orgId: string;
  initialPlan: PlanName;
  initialStep?: number;
}

export function OnboardingWizard({
  orgId,
  initialPlan,
  initialStep = 1,
}: OnboardingWizardProps) {
  const [state, setState] = useState<OnboardingWizardState>({
    currentStep: initialStep,
    totalSteps: 4,
    formData: { orgId, plan: initialPlan },
    isLoading: false,
    errors: {},
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL parameters for step navigation
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepMap: Record<string, number> = {
        'plan-selection': 1,
        'company-details': 2,
        settings: 3,
        success: 4,
      };

      const stepNumber = stepMap[stepParam];
      if (stepNumber && stepNumber !== state.currentStep) {
        setState((prev) => ({ ...prev, currentStep: stepNumber }));
      }
    }
  }, [searchParams, state.currentStep]);

  const steps = [
    {
      id: 1,
      component: PlanSelectionStep,
      title: 'Choose Plan',
      slug: 'plan-selection',
      description: 'Select the perfect plan for your business',
    },
    {
      id: 2,
      component: CompanyDetailsStep,
      title: 'Company Details',
      slug: 'company-details',
      description: 'Tell us about your business',
    },
    {
      id: 3,
      component: SettingsStep,
      title: 'Settings',
      slug: 'settings',
      description: 'Configure your preferences',
    },
    {
      id: 4,
      component: SuccessStep,
      title: 'Complete',
      slug: 'success',
      description: "You're all set!",
    },
  ];

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    const nextStep = Math.min(state.currentStep + 1, state.totalSteps);

    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...stepData },
      currentStep: nextStep,
    }));

    // Update database with new step
    try {
      await updateOnboardingStep({
        orgId: state.formData.orgId!,
        step: nextStep,
        stepData,
      });
    } catch (error) {
      console.error('Failed to update onboarding step:', error);
    }

    // If this is the final step, complete onboarding
    if (nextStep === state.totalSteps) {
      try {
        const result = await completeOnboarding({
          orgId: state.formData.orgId!,
        });

        if (result.success) {
          // Clear draft data when onboarding is completed
          try {
            await onboardingDraftService.clearDraft(state.formData.orgId!);
          } catch (error) {
            console.error('Error clearing draft data:', error);
          }

          // Don't redirect immediately - let SuccessStep handle it
          return;
        } else {
          console.error('Failed to complete onboarding:', result.message);
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }

    // Update URL to reflect current step
    const currentStepData = steps[nextStep - 1];
    if (currentStepData) {
      const url = new URL(window.location.href);
      url.searchParams.set('step', currentStepData.slug);
      router.replace(url.pathname + url.search);
    }
  };

  const handleBack = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));

    // Update URL to reflect current step
    const currentStepData = steps[state.currentStep - 2];
    if (currentStepData) {
      const url = new URL(window.location.href);
      url.searchParams.set('step', currentStepData.slug);
      router.replace(url.pathname + url.search);
    }
  };

  const CurrentStepComponent = steps[state.currentStep - 1]?.component;
  const currentStepData = steps[state.currentStep - 1];
  const stepTitles = steps.map((step) => step.title);

  if (!CurrentStepComponent || !currentStepData) {
    return <div>Invalid step</div>;
  }

  return (
    <OnboardingLayout currentStep={state.currentStep} stepTitles={stepTitles}>
      <div className="space-y-8">
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <CurrentStepComponent
              onNext={handleNext}
              onBack={handleBack}
              formData={state.formData}
              isLoading={state.isLoading}
            />
          </motion.div>
        </AnimatePresence>

        {/* Step Navigation - Only show for non-plan selection and non-success steps */}
        {state.currentStep > 1 && state.currentStep < state.totalSteps && (
          <StepNavigation
            onBack={handleBack}
            onNext={() => handleNext({})}
            canGoBack={state.currentStep > 1}
            canGoNext={state.currentStep < state.totalSteps}
            isLoading={state.isLoading}
            nextLabel="Continue"
            backLabel="Previous Step"
            showNext={true}
            showBack={state.currentStep > 1}
          />
        )}
      </div>
    </OnboardingLayout>
  );
}
