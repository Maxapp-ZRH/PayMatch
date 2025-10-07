/**
 * Onboarding Wizard Component
 *
 * Main onboarding wizard container that manages the step flow.
 * Integrates with Stripe for plan selection and handles the complete onboarding process.
 * Uses a modern full-page layout with smooth animations.
 */

'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import { useCentralizedSaving } from '../hooks/use-centralized-saving';
import { useDraftData } from '../hooks/use-draft-data';
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
    isSaving: false,
    lastSaved: null,
    saveError: null,
  });

  // Skip plan selection if user already has a paid plan
  const shouldSkipPlanSelection = initialPlan && initialPlan !== 'free';

  const router = useRouter();
  const searchParams = useSearchParams();

  // Refs for step components
  const companyDetailsRef = useRef<{ submitForm: () => Promise<void> }>(null);
  const settingsRef = useRef<{ submitForm: () => Promise<void> }>(null);

  // Load draft data to restore form fields
  const { draftData, isLoading: isLoadingDraft } = useDraftData({
    orgId,
  });

  // Centralized saving state
  const savingState = useCentralizedSaving({
    orgId,
    currentStep: state.currentStep,
  });

  // Load draft data into wizard state when available
  useEffect(() => {
    if (draftData && !isLoadingDraft && Object.keys(draftData).length > 0) {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, ...draftData },
      }));
    }
  }, [draftData, isLoadingDraft]);

  // Auto-advance past plan selection if user already has a paid plan
  useEffect(() => {
    if (shouldSkipPlanSelection && state.currentStep === 1) {
      setState((prev) => ({ ...prev, currentStep: 2 }));
    }
  }, [shouldSkipPlanSelection, state.currentStep]);

  const steps = useMemo(
    () => [
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
    ],
    []
  );

  // Handle URL parameters for step navigation - only on mount
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
        // Only allow navigation to the step if it's not beyond the current progress
        // This prevents users from skipping ahead
        const maxAllowedStep = Math.max(initialStep, state.currentStep);
        const targetStep = Math.min(stepNumber, maxAllowedStep);

        setState((prev) => ({ ...prev, currentStep: targetStep }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - we intentionally don't include dependencies to prevent loops

  // Update URL when step changes - but don't listen to URL changes
  const updateUrlForCurrentStep = useCallback(() => {
    const currentStepData = steps[state.currentStep - 1];
    if (currentStepData) {
      const url = new URL(window.location.href);
      const currentStepParam = url.searchParams.get('step');

      // Only update URL if it doesn't match the current step
      if (currentStepParam !== currentStepData.slug) {
        url.searchParams.set('step', currentStepData.slug);
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
  }, [state.currentStep, router, steps]);

  // Update URL when step changes
  useEffect(() => {
    updateUrlForCurrentStep();
  }, [updateUrlForCurrentStep]);

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
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
    } catch (error) {
      console.error('Error in handleNext:', error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout
      currentStep={state.currentStep}
      stepTitles={stepTitles}
      isSaving={savingState.isSaving}
      lastSaved={savingState.lastSaved}
      saveError={savingState.saveError}
    >
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
              ref={
                state.currentStep === 2
                  ? companyDetailsRef
                  : state.currentStep === 3
                    ? settingsRef
                    : undefined
              }
              onNext={handleNext}
              onBack={handleBack}
              formData={state.formData}
              isLoading={state.isLoading}
              saveOnBlur={savingState.saveOnBlur}
              saveImmediately={savingState.saveImmediately}
            />
          </motion.div>
        </AnimatePresence>

        {/* Step Navigation - Only show for Company Details and Settings steps */}
        {state.currentStep >= 2 && state.currentStep < state.totalSteps && (
          <StepNavigation
            onBack={handleBack}
            onNext={async () => {
              // Trigger form submission for current step
              if (state.currentStep === 2 && companyDetailsRef.current) {
                await companyDetailsRef.current.submitForm();
              } else if (state.currentStep === 3 && settingsRef.current) {
                await settingsRef.current.submitForm();
              }
            }}
            canGoBack={state.currentStep === 3} // Only allow back from Settings (step 3)
            canGoNext={state.currentStep < state.totalSteps}
            isLoading={state.isLoading}
            nextLabel="Continue"
            backLabel="Back to Company Details"
            showNext={true}
            showBack={state.currentStep === 3} // Only show back button on Settings step
          />
        )}
      </div>
    </OnboardingLayout>
  );
}
