/**
 * useFeatureComparison Hook
 *
 * Custom hook for accessing feature comparison data and utilities.
 * Provides consistent feature comparison logic for both marketing and onboarding components.
 */

import { useMemo } from 'react';
import type { PlanName } from '@/config/plans';
import { getPlanFeatureComparison, translateFeatureValue } from '@/lib/pricing';
import type { FeatureComparisonRow } from '@/lib/pricing';

export function useFeatureComparison() {
  return useMemo(() => {
    const planNames: PlanName[] = [
      'free',
      'freelancer',
      'business',
      'enterprise',
    ];
    const featureKeys = [
      'invoices',
      'clients',
      'users',
      'storage',
      'qrBillInvoices',
      'paymentReconciliation',
      'reminders',
      'reportsDataExports',
      'brandingControl',
      'teamManagement',
      'support',
    ];

    return featureKeys.map((featureKey) => {
      const row: FeatureComparisonRow = {
        featureKey,
        free: 'cross',
        freelancer: 'cross',
        business: 'cross',
        enterprise: 'cross',
      };

      planNames.forEach((planName) => {
        const comparison = getPlanFeatureComparison(planName);
        const feature = comparison.find((f) => f.featureKey === featureKey);
        if (feature) {
          row[planName] = translateFeatureValue(feature.value);
        }
      });

      return row;
    });
  }, []);
}

export function usePlanFeatureComparison(planName: PlanName) {
  return useMemo(() => {
    return getPlanFeatureComparison(planName);
  }, [planName]);
}
