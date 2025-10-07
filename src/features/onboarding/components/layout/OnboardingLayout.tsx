/**
 * Enhanced Onboarding Layout Component
 *
 * Modern, responsive layout for the onboarding experience.
 * Follows marketing pages design patterns with mobile-first approach.
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProgressIndicator } from '@/components/shared/ProgressIndicator';
import { SavingStatusBadge } from '../ui/SavingStatusBadge';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  stepTitles: string[];
  isSaving?: boolean;
  lastSaved?: Date | null;
  saveError?: string | null;
}

export function OnboardingLayout({
  children,
  currentStep,
  stepTitles,
  isSaving = false,
  lastSaved = null,
  saveError = null,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Marketing-style Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 1090 1090"
          aria-hidden="true"
          fill="none"
          preserveAspectRatio="none"
          className="absolute -top-7 left-1/2 -z-10 h-[788px] -translate-x-1/2 mask-[linear-gradient(to_bottom,white_20%,transparent_75%)] stroke-gray-300/30 sm:-top-9 sm:h-auto"
        >
          <circle cx={545} cy={545} r="544.5" />
          <circle cx={545} cy={545} r="480.5" />
          <circle cx={545} cy={545} r="416.5" />
          <circle cx={545} cy={545} r="352.5" />
        </svg>
      </div>

      {/* Marketing-style Header */}
      <header className="relative z-10 border-b border-gray-200/60 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 sm:h-24 items-center">
            {/* Logo - Left */}
            <div className="flex items-center flex-shrink-0">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="PayMatch"
                  width={32}
                  height={32}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  PayMatch
                </h1>
              </div>
            </div>

            {/* Progress Indicator - Center */}
            <div className="flex-1 flex justify-center px-4">
              <div className="hidden sm:block">
                <ProgressIndicator
                  currentStep={currentStep}
                  totalSteps={stepTitles.length}
                  stepTitles={stepTitles}
                  variant="minimal"
                  showPercentage={false}
                />
              </div>
              {/* Mobile Progress - Compact */}
              <div className="sm:hidden">
                <ProgressIndicator
                  currentStep={currentStep}
                  totalSteps={stepTitles.length}
                  stepTitles={stepTitles}
                  variant="compact"
                  showPercentage={false}
                />
              </div>
            </div>

            {/* Saving Status Badge - Right */}
            <div className="flex items-center flex-shrink-0">
              <SavingStatusBadge
                isSaving={isSaving}
                lastSaved={lastSaved}
                saveError={saveError}
                className="w-20 h-6"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <div
          className={`mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 ${
            currentStep === 1
              ? 'max-w-7xl xl:max-w-8xl' // Wider for plan selection
              : 'max-w-4xl' // Normal width for other steps
          }`}
        >
          {/* Content Container */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
