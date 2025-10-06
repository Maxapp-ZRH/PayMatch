/**
 * Plan Selection Component
 *
 * Displays plan options using the centralized plans configuration.
 * Handles both free and paid plan selection with Stripe integration.
 * Designed to match the marketing page pricing section.
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Check, Gift, User, Building2, Crown } from 'lucide-react';
import {
  getAllPlans,
  getPlanSummary,
  PlanName,
  BillingPeriod,
  ANNUAL_DISCOUNT_PERCENT,
} from '@/config/plans';
import { formatSwissCurrencyFromCents } from '@/utils/formatting';
import { createCheckoutSession } from '../server/actions/create-checkout-session';
import { createPortalSession } from '../server/actions/create-portal-session';
import { updateOrganizationPlan } from '../server/actions/update-organization-plan';
import { showToast } from '@/lib/toast';
import { Button } from '@/components/marketing_pages/Button';
import { createClient } from '@/lib/supabase/client';

interface PlanSelectionProps {
  orgId: string;
  initialPlan?: PlanName;
  onPlanSelected?: (planName: PlanName) => void;
}

// Function to get the appropriate icon for each plan
function getPlanIcon(planName: string, isFeatured: boolean) {
  const iconProps = {
    className: clsx('h-6 w-6', isFeatured ? 'text-white' : 'text-gray-900'),
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
      return <User {...iconProps} />;
  }
}

export function PlanSelection({
  orgId,
  initialPlan = 'free',
  onPlanSelected,
}: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanName>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<BillingPeriod>('monthly');
  const [previousBillingCycle, setPreviousBillingCycle] =
    useState<BillingPeriod>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const plans = getAllPlans();

  const handlePlanSelect = async (planName: PlanName) => {
    setIsLoading(true);

    try {
      if (planName === 'free') {
        // Free plan - update organization directly
        const result = await updateOrganizationPlan({
          orgId,
          planName: 'free',
        });

        if (result.success) {
          showToast.success('Free plan activated!');
          onPlanSelected?.(planName);
        } else {
          showToast.error(result.message);
        }
      } else {
        // Check if customer already has a Stripe customer ID
        const supabase = createClient();
        const { data: org } = await supabase
          .from('organizations')
          .select('stripe_customer_id, stripe_subscription_id')
          .eq('id', orgId)
          .single();

        if (org?.stripe_customer_id && !org?.stripe_subscription_id) {
          // Customer exists but no subscription - redirect to customer portal
          const result = await createPortalSession({
            orgId,
            returnUrl: `${window.location.origin}/onboarding?step=company-details&plan=${planName}`,
          });

          if (result.success && result.url) {
            window.location.href = result.url;
          } else {
            showToast.error('Failed to open billing portal. Please try again.');
          }
        } else {
          // Create new checkout session
          const result = await createCheckoutSession({
            planName,
            billingCycle,
            orgId,
            userId: '', // Will be filled by server action
            successUrl: `${window.location.origin}/onboarding?step=company-details&plan=${planName}`,
            cancelUrl: `${window.location.origin}/onboarding?step=plan-selection`,
          });

          if (result.success && result.url) {
            // Redirect to Stripe checkout
            window.location.href = result.url;
          } else {
            showToast.error(
              result.error || 'Failed to create checkout session'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      showToast.error('An error occurred while selecting the plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillingCycleChange = (newCycle: BillingPeriod) => {
    setPreviousBillingCycle(billingCycle);
    setBillingCycle(newCycle);
  };

  return (
    <section
      id="plan-selection"
      aria-labelledby="plan-selection-title"
      className="py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            id="plan-selection-title"
            className="text-base font-semibold leading-7 text-red-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Select the plan that best fits your business needs
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200">
            <button
              onClick={() => handleBillingCycleChange('monthly')}
              className={clsx(
                'cursor-pointer rounded-full py-1 px-2.5',
                billingCycle === 'monthly'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingCycleChange('annual')}
              className={clsx(
                'cursor-pointer rounded-full py-1 px-2.5',
                billingCycle === 'annual'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              Annually
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                Save {ANNUAL_DISCOUNT_PERCENT}%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plan Cards */}
        <motion.div
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 items-start gap-x-8 gap-y-8 sm:mt-20 sm:grid-cols-2 sm:gap-y-10 lg:max-w-none lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {plans.map((plan, index) => {
            const planSummary = getPlanSummary(plan.name);
            const displayPrice = formatSwissCurrencyFromCents(
              billingCycle === 'monthly'
                ? planSummary.monthlyPrice
                : planSummary.annualPrice
            );

            return (
              <motion.div
                key={plan.name}
                className={clsx(
                  'relative',
                  plan.name === 'free' ? 'block sm:hidden' : 'block'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.1,
                }}
              >
                <PlanCard
                  plan={planSummary}
                  billingCycle={billingCycle}
                  previousBillingCycle={previousBillingCycle}
                  displayPrice={displayPrice}
                  selected={selectedPlan === plan.name}
                  onSelect={() => setSelectedPlan(plan.name)}
                  onContinue={() => handlePlanSelect(plan.name)}
                  isLoading={isLoading}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

interface PlanCardProps {
  plan: ReturnType<typeof getPlanSummary>;
  billingCycle: BillingPeriod;
  previousBillingCycle: BillingPeriod;
  displayPrice: string;
  selected: boolean;
  onSelect: () => void;
  onContinue: () => void;
  isLoading: boolean;
}

function PlanCard({
  plan,
  billingCycle,
  previousBillingCycle,
  displayPrice,
  selected,
  onSelect,
  onContinue,
  isLoading,
}: PlanCardProps) {
  const isFeatured = plan.featured;
  const isFree = plan.name === 'free';

  return (
    <div
      className={clsx(
        'relative flex flex-col rounded-3xl p-8 ring-1',
        isFeatured ? 'bg-red-600 ring-red-600' : 'bg-white ring-gray-200',
        selected && !isFeatured && 'ring-red-600 ring-2'
      )}
      onClick={onSelect}
    >
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold leading-5 text-white">
            Most popular
          </div>
        </div>
      )}

      <section className="flex-1">
        <div className="flex items-center gap-x-4">
          {getPlanIcon(plan.name, isFeatured)}
          <h3
            className={clsx(
              'text-lg font-semibold leading-8',
              isFeatured ? 'text-white' : 'text-gray-900'
            )}
          >
            {plan.displayName}
          </h3>
        </div>

        <p
          className={clsx(
            'mt-4 text-sm leading-6',
            isFeatured ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          {plan.name === 'free' &&
            'Perfect for getting started with basic invoicing'}
          {plan.name === 'freelancer' &&
            'Ideal for freelancers and small businesses'}
          {plan.name === 'business' &&
            'Perfect for growing businesses with teams'}
          {plan.name === 'enterprise' &&
            'Advanced features for large organizations'}
        </p>

        <div className="mt-4 sm:mt-5">
          <div className="flex items-baseline">
            <AnimatePresence mode="wait">
              <motion.div
                key={`price-container-${billingCycle}`}
                initial={{
                  opacity: 0,
                  x: previousBillingCycle === 'monthly' ? -20 : 20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: previousBillingCycle === 'monthly' ? 20 : -20,
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
                  {displayPrice}
                </span>
                <span
                  className={clsx(
                    'ml-1 text-sm font-medium',
                    isFeatured ? 'text-gray-300' : 'text-gray-500'
                  )}
                >
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {billingCycle === 'annual' && !isFree && (
              <motion.div
                key="annual-savings"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-sm text-green-600"
              >
                Save {ANNUAL_DISCOUNT_PERCENT}% with annual billing
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features List */}
        <ul
          role="list"
          className={clsx(
            'mt-6 space-y-3 text-sm leading-6',
            isFeatured ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          {plan.keyFeatures.slice(0, 4).map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <Check
                className={clsx(
                  'h-6 w-5 flex-none',
                  isFeatured ? 'text-white' : 'text-red-500'
                )}
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          onContinue();
        }}
        disabled={isLoading}
        color={isFeatured ? 'swiss' : 'gray'}
        className="mt-4 sm:mt-6 text-sm sm:text-base"
        aria-label={`Get started with the ${plan.displayName} plan for ${displayPrice}`}
      >
        {isLoading ? 'Processing...' : isFree ? 'Start Free' : 'Subscribe'}
      </Button>
    </div>
  );
}
