/**
 * Draft Data Hook
 *
 * Custom hook for loading and managing draft data in onboarding forms.
 * Automatically loads saved draft data when component mounts.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { onboardingDraftService } from '../services/draft-service';
import type { OnboardingData } from '../types';

interface UseDraftDataOptions {
  orgId: string;
  currentStep?: number;
}

interface UseDraftDataReturn {
  draftData: Partial<OnboardingData>;
  isLoading: boolean;
  error: string | null;
  loadDraft: () => Promise<void>;
  clearDraft: () => Promise<void>;
}

export function useDraftData({
  orgId,
}: UseDraftDataOptions): UseDraftDataReturn {
  const [draftData, setDraftData] = useState<Partial<OnboardingData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDraft = useCallback(async () => {
    if (!orgId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onboardingDraftService.loadDraft(orgId);

      if (result.success) {
        setDraftData(result.data || {});
      } else {
        setError(result.error || 'Failed to load draft data');
      }
    } catch (error) {
      console.error('Error loading draft data:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  const clearDraft = useCallback(async () => {
    if (!orgId) return;

    try {
      const result = await onboardingDraftService.clearDraft(orgId);
      if (result.success) {
        setDraftData({});
      }
    } catch (error) {
      console.error('Error clearing draft data:', error);
    }
  }, [orgId]);

  // Load draft data on mount
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  return {
    draftData,
    isLoading,
    error,
    loadDraft,
    clearDraft,
  };
}
