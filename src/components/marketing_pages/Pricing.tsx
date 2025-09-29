'use client';

import { useState } from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/marketing_pages/Button';
import { Container } from '@/components/marketing_pages/Container';
import { Logomark } from '@/components/marketing_pages/Logo';
import {
  pricingConfig,
  calculateMonthlyPricing,
  createFeatureIcon,
  PRICING_CONSTANTS,
  featureComparisonData,
  getPricingPlansForLocale,
  getCurrencySymbol,
} from '@/config/pricing';

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

function FeatureIcon({
  value,
  className = 'w-4 h-4',
}: {
  value: string | 'check' | 'cross';
  className?: string;
}) {
  if (value === 'check') {
    const { Icon, className: iconClassName } = createFeatureIcon(
      'check',
      className
    );
    return <Icon className={iconClassName} />;
  }
  if (value === 'cross') {
    const { Icon, className: iconClassName } = createFeatureIcon(
      'cross',
      className
    );
    return <Icon className={iconClassName} />;
  }
  return <span className="text-gray-700">{value}</span>;
}

function Plan({
  name,
  monthlyPrice,
  annualPrice,
  description,
  button,
  features,
  activePeriod,
  logomarkClassName,
  featured = false,
  t,
  currencySymbol,
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
  logomarkClassName?: string;
  featured?: boolean;
  t: (key: string) => string;
  currencySymbol: string;
}) {
  return (
    <div className="relative">
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {t('mostPopular')}
          </span>
        </div>
      )}
      <section
        className={clsx(
          'flex flex-col overflow-hidden rounded-3xl p-6 shadow-lg shadow-gray-900/5',
          featured ? 'order-first bg-gray-900 lg:order-0' : 'bg-white'
        )}
      >
        <h3
          className={clsx(
            'flex items-center text-sm font-semibold',
            featured ? 'text-white' : 'text-gray-900'
          )}
        >
          <Logomark className={clsx('h-6 w-6 flex-none', logomarkClassName)} />
          <span className="ml-4">{name}</span>
        </h3>
        <div className="mt-5">
          <div className="relative flex text-3xl tracking-tight">
            <span
              aria-hidden={activePeriod === 'Annually'}
              className={clsx(
                'transition duration-300',
                activePeriod === 'Annually' &&
                  'pointer-events-none translate-x-6 opacity-0 select-none',
                featured ? 'text-white' : 'text-gray-900'
              )}
            >
              {currencySymbol} {monthlyPrice}
            </span>
            <span
              aria-hidden={activePeriod === 'Monthly'}
              className={clsx(
                'absolute top-0 left-0 transition duration-300',
                activePeriod === 'Monthly' &&
                  'pointer-events-none -translate-x-6 opacity-0 select-none',
                featured ? 'text-white' : 'text-gray-900'
              )}
            >
              {currencySymbol}{' '}
              {calculateMonthlyPricing(
                annualPrice,
                PRICING_CONSTANTS.annualDiscountPercent
              )}
            </span>
          </div>
          <div className="mt-1">
            <span
              className={clsx(
                'text-sm',
                featured ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              {activePeriod === 'Monthly'
                ? t('billedMonthly')
                : `${t('billedAnnually')} (${pricingConfig.currency} ${annualPrice}/year)`}
            </span>
          </div>
        </div>
        <p
          className={clsx(
            'mt-3 text-sm',
            featured ? 'text-gray-300' : 'text-gray-700'
          )}
        >
          {description}
        </p>
        <div className="order-last mt-6">
          <ul
            role="list"
            className={clsx(
              '-my-2 divide-y text-sm',
              featured
                ? 'divide-gray-800 text-gray-300'
                : 'divide-gray-200 text-gray-700'
            )}
          >
            {features.map((feature) => (
              <li key={feature} className="flex py-2">
                <CheckIcon
                  className={clsx(
                    'h-6 w-6 flex-none',
                    featured ? 'text-white' : 'text-teal-600'
                  )}
                />
                <span className="ml-4">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          href={button.href}
          color={featured ? 'swiss' : 'gray'}
          className="mt-6"
          aria-label={`Get started with the ${name} plan for ${pricingConfig.currency} ${activePeriod === 'Monthly' ? monthlyPrice : calculateMonthlyPricing(annualPrice, pricingConfig.annualDiscountPercent)}`}
        >
          {button.label}
        </Button>
      </section>
    </div>
  );
}

export function Pricing() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [activePeriod, setActivePeriod] = useState<'Monthly' | 'Annually'>(
    'Monthly'
  );

  // Get pricing data and currency for current locale
  const pricingPlans = getPricingPlansForLocale(locale);
  const currencySymbol = getCurrencySymbol(locale);

  // Map feature names to translation keys
  const getFeatureTranslation = (featureKey: string) => {
    return t(`featureComparison.${featureKey}`);
  };

  // Map feature values to translation keys
  const getFeatureValueTranslation = (value: string | 'check' | 'cross') => {
    if (value === 'check' || value === 'cross') return value;

    // Handle numeric values and other non-translatable values
    if (value === '1' || value === '10 max' || value === 'Unlimited') {
      return value;
    }

    const valueMap: Record<string, string> = {
      Basic: 'featureComparison.basic',
      Advanced: 'featureComparison.advanced',
      Community: 'featureComparison.community',
      Priority: 'featureComparison.priority',
      'Dedicated SLA': 'featureComparison.dedicatedSLA',
    };
    return t(valueMap[value] || value);
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

        <div className="mt-8 flex justify-center">
          <div className="relative">
            <RadioGroup
              value={activePeriod}
              onChange={setActivePeriod}
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
                'pointer-events-none absolute inset-0 z-10 grid grid-cols-2 overflow-hidden rounded-lg bg-teal-600 transition-all duration-300',
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
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1">
            <span className="text-sm font-medium text-green-700">
              {t('annualBillingBadge')}
            </span>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 items-start gap-x-8 gap-y-10 sm:mt-20 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const planKey = plan.name.toLowerCase();
            const translatedPlan = {
              ...plan,
              description: t(`plans.${planKey}.description`),
              features: t.raw(`plans.${planKey}.features`),
              button: {
                label: t('common.getStarted'),
                href: '/register',
              },
            };
            return (
              <Plan
                key={plan.name}
                {...translatedPlan}
                activePeriod={activePeriod}
                t={t}
                currencySymbol={currencySymbol}
              />
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">
              {t('comparisonTitle')}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('comparisonDescription')}
            </p>
          </div>
          <div className="overflow-x-auto shadow-lg shadow-gray-900/5 rounded-3xl border border-gray-200">
            <table className="w-full table-auto border-separate border-spacing-0">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="border-b border-r border-gray-200 px-6 py-4 text-left font-semibold text-gray-900 text-lg first:rounded-tl-3xl">
                    {t('features')}
                  </th>
                  {pricingPlans.map((plan, index) => {
                    const isLast = index === pricingPlans.length - 1;
                    const isFeatured = plan.featured;
                    const monthlyPrice =
                      activePeriod === 'Monthly'
                        ? plan.monthlyPrice
                        : calculateMonthlyPricing(
                            plan.annualPrice,
                            PRICING_CONSTANTS.annualDiscountPercent
                          );

                    return (
                      <th
                        key={plan.name}
                        className={`border-b ${isLast ? 'border-gray-200' : 'border-r border-gray-200'} px-6 py-4 text-center font-semibold text-lg last:rounded-tr-3xl ${
                          isFeatured
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-gray-900'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-sm font-medium mb-1 ${
                              isFeatured ? 'text-teal-600' : 'text-gray-500'
                            }`}
                          >
                            {plan.name.toUpperCase()}
                          </span>
                          <span className="text-2xl font-bold">
                            {currencySymbol} {monthlyPrice}
                          </span>
                          {isFeatured && (
                            <span className="text-xs text-teal-600 font-medium mt-1">
                              {t('mostPopular')}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {featureComparisonData.map((row, index) => {
                  const isLastRow = index === featureComparisonData.length - 1;
                  const planValues = [
                    row.free,
                    row.freelancer,
                    row.business,
                    row.enterprise,
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
                          isLastRow ? 'first:rounded-bl-3xl' : ''
                        )}
                      >
                        {getFeatureTranslation(row.featureKey)}
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
                                ? 'border-gray-200 last:rounded-br-3xl'
                                : 'border-r border-gray-200',
                              isFeatured ? 'bg-teal-50/30' : ''
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
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                {t('footerLink')}
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
