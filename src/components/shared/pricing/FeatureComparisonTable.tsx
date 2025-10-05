/**
 * FeatureComparisonTable Component
 *
 * Shared feature comparison table component for displaying plan features side by side.
 * Used in both marketing and onboarding pricing sections with consistent styling and animations.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { FeatureIcon } from './FeatureIcon';
import type { PlanName, BillingPeriod } from '@/config/plans';
import { getPlanPricingInCHF } from '@/config/plans';

interface FeatureComparisonTableProps {
  comparisonData: {
    plans: Array<{
      name: PlanName;
      displayName: string;
      featured: boolean;
    }>;
    features: Array<{
      key: string;
      values: {
        free: string | 'check' | 'cross';
        freelancer: string | 'check' | 'cross';
        business: string | 'check' | 'cross';
        enterprise: string | 'check' | 'cross';
      };
    }>;
  };
  billingPeriod: BillingPeriod;
  previousPeriod: BillingPeriod;
  title?: string;
  description?: string;
  className?: string;
  // Marketing-specific props
  currencySymbol?: string;
  getFeatureTranslation?: (key: string) => string;
  getFeatureValueTranslation?: (
    value: string | 'check' | 'cross'
  ) => string | 'check' | 'cross';
  footerText?: string;
  footerLink?: string;
  footerLinkHref?: string;
}

export function FeatureComparisonTable({
  comparisonData,
  billingPeriod,
  previousPeriod,
  title = 'Compare All Features',
  description = "See exactly what's included in each plan to make the best choice for your business.",
  className,
  currencySymbol = 'CHF',
  getFeatureTranslation,
  getFeatureValueTranslation,
  footerText,
  footerLink,
  footerLinkHref,
}: FeatureComparisonTableProps) {
  return (
    <motion.div
      className={clsx('mt-20', className)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="text-center mb-12">
        <h3 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">
          {title}
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto shadow-lg shadow-gray-900/5 rounded-3xl border border-gray-200">
        <table className="w-full table-auto border-separate border-spacing-0">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="border-b border-r border-gray-200 px-6 py-4 text-left font-semibold text-gray-900 text-lg first:rounded-tl-3xl">
                Features
              </th>
              {comparisonData.plans.map((plan, index) => {
                const isLast = index === comparisonData.plans.length - 1;
                const isFeatured = plan.featured;
                const planKey = plan.name as PlanName;
                const monthlyPrice =
                  billingPeriod === 'monthly'
                    ? getPlanPricingInCHF(planKey, 'monthly')
                    : getPlanPricingInCHF(planKey, 'annual') / 12;

                return (
                  <th
                    key={plan.name}
                    className={`border-b ${isLast ? 'border-gray-200' : 'border-r border-gray-200'} px-6 py-4 text-center font-semibold text-lg last:rounded-tr-3xl ${
                      isFeatured ? 'text-red-500 bg-red-50' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-sm font-medium mb-2 ${
                          isFeatured ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        {plan.displayName.toUpperCase()}
                      </span>
                      <div className="text-center">
                        <div className="flex items-baseline justify-center">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`table-price-container-${billingPeriod}-${plan.name}`}
                              initial={{
                                opacity: 0,
                                x: previousPeriod === 'monthly' ? -20 : 20,
                              }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{
                                opacity: 0,
                                x: previousPeriod === 'monthly' ? 20 : -20,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: 'easeInOut',
                              }}
                              className="flex items-baseline"
                            >
                              <span className="text-2xl font-bold">
                                {currencySymbol} {monthlyPrice}
                              </span>
                              <span className="ml-1 text-sm text-gray-500">
                                /month
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`table-billing-${billingPeriod}-${plan.name}`}
                            initial={{
                              opacity: 0,
                              x: previousPeriod === 'monthly' ? -20 : 20,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                              opacity: 0,
                              x: previousPeriod === 'monthly' ? 20 : -20,
                            }}
                            transition={{
                              duration: 0.3,
                              ease: 'easeInOut',
                            }}
                            className="text-sm text-gray-500 mt-1"
                          >
                            {billingPeriod === 'monthly'
                              ? 'Billed monthly'
                              : `Billed annually (${currencySymbol}${getPlanPricingInCHF(planKey, 'annual')})`}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonData.features.map((row, index) => {
              const isLastRow = index === comparisonData.features.length - 1;
              const planValues = [
                row.values.free,
                row.values.freelancer,
                row.values.business,
                row.values.enterprise,
              ];

              return (
                <tr
                  key={index}
                  className={clsx(
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  )}
                >
                  <td
                    className={clsx(
                      'border-b border-r border-gray-200 px-6 py-4 font-medium text-gray-900 text-lg',
                      isLastRow ? 'rounded-bl-3xl' : ''
                    )}
                  >
                    {getFeatureTranslation
                      ? getFeatureTranslation(row.key)
                      : row.key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                  </td>
                  {comparisonData.plans.map((plan, planIndex) => {
                    const isLast =
                      planIndex === comparisonData.plans.length - 1;
                    const isFeatured = plan.featured;
                    const value = planValues[planIndex];

                    return (
                      <td
                        key={plan.name}
                        className={clsx(
                          'border-b px-6 py-4 text-center',
                          isLast
                            ? 'border-gray-200'
                            : 'border-r border-gray-200',
                          isLast && isLastRow ? 'rounded-br-3xl' : '',
                          isFeatured ? 'bg-red-50/30' : ''
                        )}
                      >
                        <div className="flex items-center justify-center">
                          <FeatureIcon
                            value={
                              getFeatureValueTranslation
                                ? getFeatureValueTranslation(value)
                                : value
                            }
                            className="w-5 h-5"
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Show Free plan link */}
      <div className="mt-12 text-center lg:hidden">
        <p className="text-sm text-gray-600 mb-4">
          All plans include Swiss QR-bill compliance and payment reconciliation.
        </p>
      </div>

      {/* Footer section for marketing */}
      {footerText && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">{footerText}</p>
          {footerLink && footerLinkHref && (
            <p className="mt-2 text-sm text-gray-500">
              <a
                href={footerLinkHref}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                {footerLink}
              </a>
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
