/**
 * Onboarding Form Component
 *
 * Handles the user onboarding process with a mock complete button.
 * In a real implementation, this would guide users through setup steps.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import { Button } from '@/components/marketing_pages/Button';
import { authToasts } from '@/lib/toast';

export function OnboardingForm() {
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCompleteOnboarding = async () => {
    setIsCompleting(true);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        authToasts.error('Authentication error', 'Please sign in again.');
        router.push('/login');
        return;
      }

      // Update user profile to mark onboarding as completed
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error completing onboarding:', updateError);
        authToasts.error(
          'Failed to complete onboarding',
          'Please try again or contact support.'
        );
        return;
      }

      // Show success message
      authToasts.success(
        'Onboarding completed!',
        'Welcome to PayMatch! You can now access all features.'
      );

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      authToasts.error(
        'An unexpected error occurred',
        'Please try again or contact support.'
      );
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mock onboarding steps */}
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Account Created
              </h3>
              <p className="text-sm text-gray-500">
                Your PayMatch account has been successfully created.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Email Verified
              </h3>
              <p className="text-sm text-gray-500">
                Your email address has been verified and is ready to use.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Organization Setup
              </h3>
              <p className="text-sm text-gray-500">
                Configure your business details and Swiss QR-bill settings.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Payment Integration
              </h3>
              <p className="text-sm text-gray-500">
                Connect your payment methods and bank accounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete onboarding button */}
      <div className="pt-4">
        <Button
          onClick={handleCompleteOnboarding}
          disabled={isCompleting}
          color="cyan"
          className="w-full"
        >
          {isCompleting ? 'Completing...' : 'Complete Setup'}
        </Button>
      </div>

      {/* Skip for now option */}
      <div className="text-center">
        <button
          onClick={handleCompleteOnboarding}
          className="text-sm text-gray-500 hover:text-gray-700"
          disabled={isCompleting}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
