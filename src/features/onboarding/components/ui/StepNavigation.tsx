/**
 * Step Navigation Component
 *
 * Modern navigation component for onboarding steps.
 * Provides smooth transitions and clear visual feedback.
 */

'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface StepNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  backLabel?: string;
  showNext?: boolean;
  showBack?: boolean;
}

export function StepNavigation({
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  isLoading = false,
  nextLabel = 'Continue',
  backLabel = 'Back',
  showNext = true,
  showBack = true,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-gray-200">
      {/* Back Button */}
      <div className="flex-1">
        {showBack && (
          <motion.button
            type="button"
            onClick={onBack}
            disabled={!canGoBack || isLoading}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              canGoBack && !isLoading
                ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            whileHover={canGoBack && !isLoading ? { scale: 1.02 } : {}}
            whileTap={canGoBack && !isLoading ? { scale: 0.98 } : {}}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </motion.button>
        )}
      </div>

      {/* Next Button */}
      <div className="flex-1 flex justify-end">
        {showNext && (
          <motion.button
            type="button"
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className={`inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
              canGoNext && !isLoading
                ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-500 active:text-white/80 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={canGoNext && !isLoading ? { scale: 1.02 } : {}}
            whileTap={canGoNext && !isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                Processing...
              </>
            ) : (
              <>
                {nextLabel}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
