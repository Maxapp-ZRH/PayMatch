/**
 * Modern Progress Indicator Component
 *
 * A clean, minimalist progress indicator with three variants:
 * - compact: Small circles with numbers, perfect for mobile
 * - minimal: Medium circles with subtle labels, ideal for headers
 * - default: Full-featured with progress bar, great for onboarding
 *
 * Features:
 * - Smooth animations with Framer Motion
 * - Responsive design
 * - Clean typography
 * - Modern color system
 * - No text below circles for cleaner look
 */

'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
  variant?: 'compact' | 'minimal' | 'default';
  showPercentage?: boolean;
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitles = [],
  variant = 'default',
  showPercentage = false,
  className,
}: ProgressIndicatorProps) {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  // Generate step numbers if no titles provided
  const steps =
    stepTitles.length > 0
      ? stepTitles
      : Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);

  // Compact variant - Minimal circles with numbers
  if (variant === 'compact') {
    return (
      <div
        className={cn('flex items-center justify-center space-x-2', className)}
      >
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              className={cn(
                'relative flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium transition-all duration-300',
                {
                  'bg-red-500 text-white shadow-sm': index < currentStep - 1,
                  'bg-white border-2 border-red-500 text-red-500 shadow-sm ring-2 ring-red-500/20':
                    index === currentStep - 1,
                  'bg-gray-100 text-gray-400 border border-gray-200':
                    index > currentStep - 1,
                }
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {index < currentStep - 1 ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Check className="h-2.5 w-2.5" />
                </motion.div>
              ) : (
                <span className="text-xs font-semibold">{index + 1}</span>
              )}
            </motion.div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <motion.div
                className={cn(
                  'w-3 h-px mx-1.5 transition-all duration-500',
                  index < currentStep - 1 ? 'bg-red-500' : 'bg-gray-200'
                )}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 12, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              />
            )}
          </div>
        ))}

        {/* Progress percentage badge */}
        {showPercentage && (
          <motion.div
            className="ml-3 text-xs font-medium text-gray-600 bg-gray-50 rounded-full px-2 py-0.5 border border-gray-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {progressPercentage}%
          </motion.div>
        )}
      </div>
    );
  }

  // Minimal variant - Clean circles with subtle progress
  if (variant === 'minimal') {
    return (
      <div className={cn('flex flex-col items-center space-y-3', className)}>
        {/* Progress circles */}
        <div className="flex items-center">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={cn(
                  'relative flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                  {
                    'bg-red-500 text-white shadow-sm': index < currentStep - 1,
                    'bg-white border-2 border-red-500 text-red-500 shadow-sm ring-2 ring-red-500/20':
                      index === currentStep - 1,
                    'bg-gray-100 text-gray-400 border border-gray-200':
                      index > currentStep - 1,
                  }
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {index < currentStep - 1 ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.div>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </motion.div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <motion.div
                  className={cn(
                    'w-5 h-px mx-2 transition-all duration-500',
                    index < currentStep - 1 ? 'bg-red-500' : 'bg-gray-200'
                  )}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 20, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress text */}
        {showPercentage && (
          <motion.div
            className="text-xs font-medium text-gray-600"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {progressPercentage}% complete
          </motion.div>
        )}
      </div>
    );
  }

  // Default variant - Full featured with progress bar
  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress circles */}
      <div className="flex items-center justify-center">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                {
                  'bg-red-500 text-white shadow-sm': index < currentStep - 1,
                  'bg-white border-2 border-red-500 text-red-500 shadow-sm ring-2 ring-red-500/20':
                    index === currentStep - 1,
                  'bg-gray-100 text-gray-400 border border-gray-200':
                    index > currentStep - 1,
                }
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
            >
              {index < currentStep - 1 ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  {index + 1}
                </motion.span>
              )}
            </motion.div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <motion.div
                className={cn(
                  'w-10 h-px mx-3 transition-all duration-500',
                  index < currentStep - 1 ? 'bg-red-500' : 'bg-gray-200'
                )}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 40, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {showPercentage && (
        <div className="flex items-center justify-center space-x-3">
          <div className="text-sm font-medium text-gray-600">
            {progressPercentage}% Complete
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
