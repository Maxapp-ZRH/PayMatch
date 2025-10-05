'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import { Container } from '@/components/marketing_pages/Container';
import {
  FeatureComparisonTable,
  PlanCard,
  BillingToggle,
  SaveBadge,
} from '@/components/shared/pricing';
import { getCurrencySymbol } from '@/config/pricing';
import { getPlanComparisonData, type PlanName } from '@/config/plans';
import { useAllPlansData, useAllPlansPricing } from '@/hooks/pricing';

export function Pricing() {
  const t = useTranslations('pricing');
  const tCommon = useTranslations('common');
  const [activePeriod, setActivePeriod] = useState<'Monthly' | 'Annually'>(
    'Monthly'
  );
  const [previousPeriod, setPreviousPeriod] = useState<'Monthly' | 'Annually'>(
    'Monthly'
  );

  // Use centralized data and hooks
  const plansData = useAllPlansData();
  const plansPricing = useAllPlansPricing(
    activePeriod === 'Monthly' ? 'monthly' : 'annual'
  );
  const comparisonData = getPlanComparisonData();
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

        <div className="mt-8">
          <BillingToggle
            value={activePeriod === 'Monthly' ? 'monthly' : 'annual'}
            onChange={(newPeriod) => {
              const newActivePeriod =
                newPeriod === 'monthly' ? 'Monthly' : 'Annually';
              setPreviousPeriod(activePeriod);
              setActivePeriod(newActivePeriod);
            }}
          />
        </div>

        <div className="mt-6">
          <SaveBadge discountPercent={20} />
        </div>

        <motion.div
          className="mx-auto mt-12 grid max-w-4xl grid-cols-1 items-start gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {plansData.map((plan, index) => {
            const planPricing = plansPricing.find(
              (p) => p.planName === plan.name
            );

            if (!planPricing) return null;

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
                <PlanCard
                  plan={translatedPlan}
                  monthlyPrice={planPricing.monthlyPrice}
                  annualPrice={planPricing.annualPrice}
                  billingPeriod={
                    activePeriod === 'Monthly' ? 'monthly' : 'annual'
                  }
                  variant="marketing"
                  previousPeriod={
                    previousPeriod === 'Monthly' ? 'monthly' : 'annual'
                  }
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
        <FeatureComparisonTable
          comparisonData={comparisonData}
          billingPeriod={activePeriod === 'Monthly' ? 'monthly' : 'annual'}
          previousPeriod={previousPeriod === 'Monthly' ? 'monthly' : 'annual'}
          title={t('comparisonTitle')}
          description={t('comparisonDescription')}
          className="hidden sm:block"
          currencySymbol={currencySymbol}
          getFeatureTranslation={getFeatureTranslation}
          getFeatureValueTranslation={getFeatureValueTranslation}
          footerText={t('footerText')}
          footerLink={t('footerLink')}
          footerLinkHref="/register"
        />
      </Container>
    </section>
  );
}
