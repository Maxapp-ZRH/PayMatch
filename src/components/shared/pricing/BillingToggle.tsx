/**
 * BillingToggle Component
 *
 * Shared billing period toggle component for switching between monthly and annual billing.
 * Used in both marketing and onboarding pricing sections.
 */

import React from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { BillingToggleProps } from '@/lib/pricing';

export function BillingToggle({
  value,
  onChange,
  className,
}: BillingToggleProps) {
  return (
    <motion.div
      className={clsx('flex justify-center', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative">
        <RadioGroup
          id="pricing-billing-period"
          value={value}
          onChange={onChange}
          className="grid grid-cols-2"
        >
          <Radio
            value="monthly"
            className="cursor-pointer border border-gray-300 px-6 py-3 text-sm text-gray-700 transition-colors hover:border-gray-400 data-focus:outline-2 data-focus:outline-offset-2 rounded-l-lg"
          >
            Monthly
          </Radio>
          <Radio
            value="annual"
            className="cursor-pointer border border-gray-300 px-6 py-3 text-sm text-gray-700 transition-colors hover:border-gray-400 data-focus:outline-2 data-focus:outline-offset-2 -ml-px rounded-r-lg"
          >
            Annually
          </Radio>
        </RadioGroup>
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-0 z-10 grid grid-cols-2 overflow-hidden rounded-lg bg-red-500 transition-all duration-300',
            value === 'monthly'
              ? '[clip-path:inset(0_50%_0_0)]'
              : '[clip-path:inset(0_0_0_calc(50%-1px))]'
          )}
        >
          <div className="py-3 text-center text-sm font-semibold text-white">
            Monthly
          </div>
          <div className="py-3 text-center text-sm font-semibold text-white -ml-px">
            Annually
          </div>
        </div>
      </div>
    </motion.div>
  );
}
