/**
 * Enhanced Onboarding Layout Component
 *
 * Modern, responsive layout for the onboarding experience.
 * Follows marketing pages design patterns with mobile-first approach.
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ProgressIndicator } from '@/components/shared/ProgressIndicator';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  stepTitles: string[];
}

export function OnboardingLayout({
  children,
  currentStep,
  stepTitles,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E4262A' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-50/10" />
      </div>

      {/* Enhanced Header */}
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

            {/* Support Link - Right */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/support"
                className="text-xs sm:text-sm text-gray-600 hover:text-red-500 transition-colors duration-200"
              >
                <span className="hidden sm:inline">Need help?</span>
                <span className="sm:hidden">Help</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
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
