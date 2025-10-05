/**
 * usePlanData Hook
 *
 * Custom hook for accessing plan data including features, descriptions, and metadata.
 * Provides a consistent interface for both marketing and onboarding components.
 */

import { useMemo } from 'react';
import type { PlanName } from '@/config/plans';
import {
  getPlanFeatures,
  getPlanDescription,
  getPlanDisplayName,
  isPlanFeatured,
  type PlanData,
} from '@/lib/pricing';

export function usePlanData(planName: PlanName): PlanData {
  return useMemo(
    () => ({
      name: planName,
      displayName: getPlanDisplayName(planName),
      description: getPlanDescription(planName),
      features: getPlanFeatures(planName),
      featured: isPlanFeatured(planName),
    }),
    [planName]
  );
}

export function useAllPlansData(): PlanData[] {
  return useMemo(() => {
    const planNames: PlanName[] = [
      'free',
      'freelancer',
      'business',
      'enterprise',
    ];
    return planNames.map((planName) => ({
      name: planName,
      displayName: getPlanDisplayName(planName),
      description: getPlanDescription(planName),
      features: getPlanFeatures(planName),
      featured: isPlanFeatured(planName),
    }));
  }, []);
}
