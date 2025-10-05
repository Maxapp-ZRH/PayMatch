/**
 * PlanCard Component
 *
 * Shared plan card component that displays plan information, features, and pricing.
 * Used in both marketing and onboarding pricing sections with different variants.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { CheckIcon } from './CheckIcon';
import { PlanIcon } from './PlanIcon';
import type { PlanCardProps } from '@/lib/pricing';

export function PlanCard({
  plan,
  monthlyPrice,
  annualPrice,
  billingPeriod,
  isSelected = false,
  onSelect,
  variant,
  className,
  previousPeriod,
}: PlanCardProps) {
  const isFeatured = plan.featured;
  const planPrice = billingPeriod === 'monthly' ? monthlyPrice : annualPrice;
  const planKey = plan.name;

  const handleClick = () => {
    if (onSelect) {
      onSelect(planKey);
    }
  };

  return (
    <motion.div
      className={clsx('relative', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            Most Popular
          </div>
        </div>
      )}

      {/* Plan Card */}
      <section
        className={clsx(
          'flex flex-col overflow-hidden rounded-3xl p-4 sm:p-6 border-2 cursor-pointer transition-all duration-200',
          isSelected && variant === 'onboarding'
            ? 'border-red-500'
            : 'border-gray-200',
          isFeatured
            ? 'order-first bg-gray-900 lg:order-0 border-red-400'
            : 'bg-white hover:border-gray-300'
        )}
        onClick={handleClick}
      >
        {/* Plan Header */}
        <h3
          className={clsx(
            'flex items-center text-sm font-semibold',
            isFeatured ? 'text-white' : 'text-gray-900'
          )}
        >
          <PlanIcon planName={planKey} isFeatured={isFeatured} />
          <span className="ml-3 sm:ml-4">{plan.displayName}</span>
        </h3>

        {/* Pricing */}
        <div className="mt-4 sm:mt-5">
          <div className="flex items-baseline">
            <AnimatePresence mode="wait">
              <motion.div
                key={`price-container-${billingPeriod}`}
                initial={{
                  opacity: 0,
                  x: previousPeriod === 'monthly' ? -20 : 20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: previousPeriod === 'monthly' ? 20 : -20,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex items-baseline"
              >
                <span
                  className={clsx(
                    'text-2xl sm:text-3xl font-bold tracking-tight',
                    isFeatured ? 'text-white' : 'text-gray-900'
                  )}
                >
                  CHF {planPrice}
                </span>
                <span
                  className={clsx(
                    'ml-1 text-sm font-medium',
                    isFeatured ? 'text-gray-300' : 'text-gray-500'
                  )}
                >
                  /month
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`billing-${billingPeriod}`}
              initial={{
                opacity: 0,
                x: previousPeriod === 'monthly' ? -20 : 20,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: previousPeriod === 'monthly' ? 20 : -20,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={clsx(
                'mt-1 text-sm',
                isFeatured ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              {billingPeriod === 'monthly'
                ? 'Billed monthly'
                : `Billed annually (CHF ${annualPrice})`}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Description */}
        <p
          className={clsx(
            'mt-3 text-xs sm:text-sm',
            isFeatured ? 'text-gray-300' : 'text-gray-700'
          )}
        >
          {plan.description}
        </p>

        {/* Features */}
        <div className="order-last mt-4 sm:mt-6">
          {/* Mobile: Show individual features with check icons */}
          <div className="block sm:hidden">
            <ul
              role="list"
              className={clsx(
                '-my-2 divide-y text-sm',
                isFeatured
                  ? 'divide-gray-800 text-white'
                  : 'divide-gray-200 text-gray-700'
              )}
            >
              {plan.features.map((feature) => (
                <li key={feature} className="flex py-2">
                  <CheckIcon
                    className={clsx(
                      'h-5 w-5 flex-none',
                      isFeatured ? 'text-white' : 'text-red-500'
                    )}
                  />
                  <span className="ml-3 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop: Show individual features */}
          <div className="hidden sm:block">
            <ul
              role="list"
              className={clsx(
                '-my-2 divide-y text-sm',
                isFeatured
                  ? 'divide-gray-800 text-white'
                  : 'divide-gray-200 text-gray-700'
              )}
            >
              {plan.features.map((feature) => (
                <li key={feature} className="flex py-2">
                  <CheckIcon
                    className={clsx(
                      'h-6 w-6 flex-none',
                      isFeatured ? 'text-white' : 'text-red-500'
                    )}
                  />
                  <span className="ml-4">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
