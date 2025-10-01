'use client';

import { useState } from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, User, Building2, Crown } from 'lucide-react';

import { Button } from '@/components/marketing_pages/Button';
import { Container } from '@/components/marketing_pages/Container';
import {
  calculateMonthlyPricing,
  PRICING_CONSTANTS,
  getCurrencySymbol,
} from '@/config/pricing';
import {
  getFeatureComparison,
  getPlanComparisonData,
  getPlanPricingInCHF,
  type PlanName,
} from '@/config/plans';

function CheckIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="12"
        r="8.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Function to get the appropriate icon for each plan
function getPlanIcon(planName: string, isFeatured: boolean) {
  const iconProps = {
    className: clsx(
      'h-5 w-5 sm:h-6 sm:w-6 flex-none',
      isFeatured ? 'text-red-500' : 'text-gray-600'
    ),
  };

  switch (planName.toLowerCase()) {
    case 'free':
      return <Gift {...iconProps} />;
    case 'freelancer':
      return <User {...iconProps} />;
    case 'business':
      return <Building2 {...iconProps} />;
    case 'enterprise':
      return <Crown {...iconProps} />;
    default:
      return <Gift {...iconProps} />;
  }
}

function FeatureIcon({
  value,
  className = 'w-4 h-4',
  textColor = 'text-gray-700',
}: {
  value: string | 'check' | 'cross';
  className?: string;
  textColor?: string;
}) {
  if (value === 'check') {
    return (
      <CheckIcon className={`h-4 w-4 text-green-600 ${className || ''}`} />
    );
  }
  if (value === 'cross') {
    return (
      <svg
        className={`h-4 w-4 text-red-600 ${className || ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  }
  return <span className={textColor}>{value}</span>;
}

function Plan({
  name,
  monthlyPrice,
  annualPrice,
  description,
  button,
  features,
  activePeriod,
  featured = false,
  t,
  currencySymbol,
  planIndex,
  getFeatureTranslation,
  getFeatureValueTranslation,
  previousPeriod,
}: {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  button: {
    label: string;
    href: string;
  };
  features: Array<string>;
  activePeriod: 'Monthly' | 'Annually';
  featured?: boolean;
  t: (key: string) => string;
  currencySymbol: string;
  planIndex?: number;
  getFeatureTranslation: (key: string) => string;
  getFeatureValueTranslation: (
    value: string | 'check' | 'cross'
  ) => string | 'check' | 'cross';
  previousPeriod: 'Monthly' | 'Annually';
}) {
  return (
    <div className="relative">
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {t('mostPopular')}
          </div>
        </div>
      )}
      <section
        className={clsx(
          'flex flex-col overflow-hidden rounded-3xl p-4 sm:p-6 shadow-lg shadow-gray-900/5',
          featured
            ? 'order-first bg-gray-900 lg:order-0 ring-2 ring-red-400/50 ring-offset-2'
            : 'bg-white'
        )}
      >
        <h3
          className={clsx(
            'flex items-center text-sm font-semibold',
            featured ? 'text-white' : 'text-gray-900'
          )}
        >
          {getPlanIcon(name, featured)}
          <span className="ml-3 sm:ml-4">{name}</span>
        </h3>
        <div className="mt-4 sm:mt-5">
          <div className="flex items-baseline">
            <AnimatePresence mode="wait">
              <motion.div
                key={`price-container-${activePeriod}`}
                initial={{
                  opacity: 0,
                  x: previousPeriod === 'Monthly' ? -20 : 20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: previousPeriod === 'Monthly' ? 20 : -20,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex items-baseline"
              >
                <span
                  className={clsx(
                    'text-2xl sm:text-3xl font-bold tracking-tight',
                    featured ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {currencySymbol}
                  {activePeriod === 'Monthly'
                    ? monthlyPrice
                    : calculateMonthlyPricing(annualPrice)}
                </span>
                <span
                  className={clsx(
                    'ml-1 text-sm font-medium',
                    featured ? 'text-gray-300' : 'text-gray-500'
                  )}
                >
                  /month
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`billing-${activePeriod}`}
              initial={{
                opacity: 0,
                x: previousPeriod === 'Monthly' ? -20 : 20,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: previousPeriod === 'Monthly' ? 20 : -20,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={clsx(
                'mt-1 text-sm',
                featured ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              {activePeriod === 'Monthly'
                ? t('billedMonthly')
                : `${t('billedAnnually')} (${currencySymbol}${annualPrice})`}
            </motion.p>
          </AnimatePresence>
        </div>
        <p
          className={clsx(
            'mt-3 text-xs sm:text-sm',
            featured ? 'text-gray-300' : 'text-gray-700'
          )}
        >
          {description}
        </p>
        <div className="order-last mt-4 sm:mt-6">
          {/* Mobile: Show comparison table */}
          <div className="block sm:hidden">
            {planIndex !== undefined && (
              <ul
                role="list"
                className={clsx(
                  '-my-2 divide-y text-xs',
                  name === 'Business' || featured
                    ? 'divide-gray-800 text-white '
                    : 'divide-gray-200 text-gray-700'
                )}
              >
                {getFeatureComparison().map((row, index) => {
                  const planValues = [
                    row.free,
                    row.freelancer,
                    row.business,
                    row.enterprise,
                  ];
                  const value = planValues[planIndex];

                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="flex-1 pr-2">
                        {getFeatureTranslation(row.featureKey)}
                      </span>
                      <div className="flex-shrink-0">
                        <FeatureIcon
                          value={getFeatureValueTranslation(value)}
                          className="w-4 h-4"
                          textColor={
                            name === 'Business' || featured
                              ? 'text-white'
                              : 'text-gray-700'
                          }
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Desktop: Show individual features */}
          <div className="hidden sm:block">
            <ul
              role="list"
              className={clsx(
                '-my-2 divide-y text-sm',
                featured
                  ? 'divide-gray-800 text-white'
                  : 'divide-gray-200 text-gray-700'
              )}
            >
              {features.map((feature) => (
                <li key={feature} className="flex py-2">
                  <CheckIcon
                    className={clsx(
                      'h-6 w-6 flex-none',
                      featured ? 'text-white' : 'text-red-500'
                    )}
                  />
                  <span className="ml-4">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button
          href={button.href}
          color={featured ? 'swiss' : 'gray'}
          className="mt-4 sm:mt-6 text-sm sm:text-base"
          aria-label={`Get started with the ${name} plan for ${currencySymbol} ${activePeriod === 'Monthly' ? monthlyPrice : calculateMonthlyPricing(annualPrice)}`}
        >
          {button.label}
        </Button>
      </section>
    </div>
  );
}

export function Pricing() {
  const t = useTranslations('pricing');
  const tCommon = useTranslations('common');
  const [activePeriod, setActivePeriod] = useState<'Monthly' | 'Annually'>(
    'Monthly'
  );
  const [previousPeriod, setPreviousPeriod] = useState<'Monthly' | 'Annually'>(
    'Monthly'
  );

  // Get pricing data and currency for current locale
  const comparisonData = getPlanComparisonData();
  const pricingPlans = comparisonData.plans;
  const currencySymbol = getCurrencySymbol();

  // Map feature names to translation keys
  const getFeatureTranslation = (featureKey: string) => {
    return t(`featureComparison.${featureKey}`);
  };

  // Map feature values to translation keys
  const getFeatureValueTranslation = (
    value: string | 'check' | 'cross' | undefined
  ) => {
    // Handle undefined or null values
    if (!value) return 'cross';

    if (value === 'check' || value === 'cross') return value;

    // Handle numeric values and other non-translatable values
    if (value === 'Unlimited' || /^\d+$/.test(value) || value === '10 max') {
      return value;
    }

    const valueMap: Record<string, string> = {
      Basic: 'featureComparison.basic',
      Advanced: 'featureComparison.advanced',
      Community: 'featureComparison.community',
      Priority: 'featureComparison.priority',
      'Dedicated SLA': 'featureComparison.dedicatedSLA',
    };

    const translationKey = valueMap[value];
    if (translationKey) {
      return t(translationKey);
    }

    return value;
  };

  // Get plan index for feature comparison
  const getPlanIndex = (planName: string) => {
    const planNames = ['Free', 'Freelancer', 'Business', 'Enterprise'];
    return planNames.indexOf(planName);
  };

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="border-t border-gray-200 bg-gray-100 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            {t('title')}
          </h2>
          <p className="mt-2 text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <RadioGroup
              value={activePeriod}
              onChange={(newPeriod) => {
                setPreviousPeriod(activePeriod);
                setActivePeriod(newPeriod);
              }}
              className="grid grid-cols-2"
            >
              {PRICING_CONSTANTS.billingPeriods.map((period) => (
                <Radio
                  key={period}
                  value={period}
                  className={clsx(
                    'cursor-pointer border border-gray-300 px-[calc(--spacing(3)-1px)] py-[calc(--spacing(2)-1px)] text-sm text-gray-700 transition-colors hover:border-gray-400 data-focus:outline-2 data-focus:outline-offset-2',
                    period === 'Monthly'
                      ? 'rounded-l-lg'
                      : '-ml-px rounded-r-lg'
                  )}
                >
                  {t(`billingPeriods.${period.toLowerCase()}`)}
                </Radio>
              ))}
            </RadioGroup>
            <div
              aria-hidden="true"
              className={clsx(
                'pointer-events-none absolute inset-0 z-10 grid grid-cols-2 overflow-hidden rounded-lg bg-red-500 transition-all duration-300',
                activePeriod === 'Monthly'
                  ? '[clip-path:inset(0_50%_0_0)]'
                  : '[clip-path:inset(0_0_0_calc(50%-1px))]'
              )}
            >
              {PRICING_CONSTANTS.billingPeriods.map((period) => (
                <div
                  key={period}
                  className={clsx(
                    'py-2 text-center text-sm font-semibold text-white',
                    period === 'Annually' && '-ml-px'
                  )}
                >
                  {t(`billingPeriods.${period.toLowerCase()}`)}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-2 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-green-800">
                {t('annualBillingBadge')}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 items-start gap-x-8 gap-y-8 sm:mt-20 sm:grid-cols-2 sm:gap-y-10 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {pricingPlans.map((plan, index) => {
            const planKey = plan.name as PlanName;
            const translatedPlan = {
              ...plan,
              description: t(`plans.${planKey}.description`),
              features: t.raw(`plans.${planKey}.features`),
              button: {
                label: tCommon('buttons.getStarted'),
                href: '/register',
              },
            };
            return (
              <motion.div
                key={plan.name}
                className={clsx(
                  // Show Free plan only on mobile (hidden on sm and up)
                  plan.name === 'free' ? 'block sm:hidden' : 'block'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
              >
                <Plan
                  name={plan.displayName}
                  monthlyPrice={getPlanPricingInCHF(planKey, 'monthly')}
                  annualPrice={getPlanPricingInCHF(planKey, 'annual')}
                  description={translatedPlan.description}
                  button={translatedPlan.button}
                  features={translatedPlan.features}
                  activePeriod={activePeriod}
                  featured={plan.featured}
                  t={t}
                  currencySymbol={currencySymbol}
                  planIndex={getPlanIndex(plan.name)}
                  getFeatureTranslation={getFeatureTranslation}
                  getFeatureValueTranslation={getFeatureValueTranslation}
                  previousPeriod={previousPeriod}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile: Start with Free plan link */}
        <div className="mt-12 text-center sm:hidden">
          <p className="text-sm text-gray-600 mb-4">
            All plans include Swiss QR-bill compliance and payment
            reconciliation.
          </p>
          <p className="text-sm text-gray-500">
            <Link
              href="/register"
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Start with Free plan →
            </Link>
          </p>
        </div>

        {/* Feature Comparison Table - Hidden on mobile */}
        <motion.div
          className="mt-20 hidden sm:block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">
              {t('comparisonTitle')}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('comparisonDescription')}
            </p>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block overflow-x-auto shadow-lg shadow-gray-900/5 rounded-3xl border border-gray-200">
            <table className="w-full table-auto border-separate border-spacing-0">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="border-b border-r border-gray-200 px-6 py-4 text-left font-semibold text-gray-900 text-lg first:rounded-tl-3xl">
                    {t('features')}
                  </th>
                  {pricingPlans.map((plan, index) => {
                    const isLast = index === pricingPlans.length - 1;
                    const isFeatured = plan.featured;
                    const planKey = plan.name as PlanName;
                    const monthlyPrice =
                      activePeriod === 'Monthly'
                        ? getPlanPricingInCHF(planKey, 'monthly')
                        : calculateMonthlyPricing(plan.pricing.annual);

                    return (
                      <th
                        key={plan.name}
                        className={`border-b ${isLast ? 'border-gray-200' : 'border-r border-gray-200'} px-6 py-4 text-center font-semibold text-lg last:rounded-tr-3xl ${
                          isFeatured
                            ? 'text-red-500 bg-red-50'
                            : 'text-gray-900'
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
                                  key={`table-price-container-${activePeriod}-${plan.name}`}
                                  initial={{
                                    opacity: 0,
                                    x: previousPeriod === 'Monthly' ? -20 : 20,
                                  }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{
                                    opacity: 0,
                                    x: previousPeriod === 'Monthly' ? 20 : -20,
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
                                key={`table-billing-${activePeriod}-${plan.name}`}
                                initial={{
                                  opacity: 0,
                                  x: previousPeriod === 'Monthly' ? -20 : 20,
                                }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{
                                  opacity: 0,
                                  x: previousPeriod === 'Monthly' ? 20 : -20,
                                }}
                                transition={{
                                  duration: 0.3,
                                  ease: 'easeInOut',
                                }}
                                className="text-sm text-gray-500 mt-1"
                              >
                                {activePeriod === 'Monthly'
                                  ? t('billedMonthly')
                                  : `${t('billedAnnually')} (${currencySymbol}${getPlanPricingInCHF(planKey, 'annual')})`}
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
                  const isLastRow =
                    index === comparisonData.features.length - 1;
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
                        {getFeatureTranslation(row.key)}
                      </td>
                      {pricingPlans.map((plan, planIndex) => {
                        const isLast = planIndex === pricingPlans.length - 1;
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
                                value={getFeatureValueTranslation(value)}
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

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">{t('footerText')}</p>
            <p className="mt-2 text-sm text-gray-500">
              <Link
                href="/register"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                {t('footerLink')}
              </Link>
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
