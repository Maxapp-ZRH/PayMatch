/**
 * Progressive Save Hook
 *
 * Custom hook for implementing progressive saving in onboarding forms.
 * Provides debounced auto-save functionality with loading states.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { onboardingDraftService } from '../services/draft-service';
import type { OnboardingData } from '../types';

interface UseProgressiveSaveOptions {
  orgId: string;
  currentStep: number;
  enabled?: boolean;
}

interface UseProgressiveSaveReturn {
  saveDraft: (data: Partial<OnboardingData>) => Promise<void>;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

export function useProgressiveSave({
  orgId,
  currentStep,
  enabled = true,
}: UseProgressiveSaveOptions): UseProgressiveSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const saveDraft = useCallback(
    async (data: Partial<OnboardingData>) => {
      if (!enabled || !orgId || isSavingRef.current) return;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce the save operation
      saveTimeoutRef.current = setTimeout(async () => {
        if (isSavingRef.current) return; // Prevent concurrent saves

        isSavingRef.current = true;
        setIsSaving(true);
        setSaveError(null);

        try {
          const result = await onboardingDraftService.saveDraft(
            orgId,
            data,
            currentStep
          );

          if (result.success) {
            setLastSaved(new Date());
            setSaveError(null);
          } else {
            setSaveError(result.error || 'Failed to save draft');
          }
        } catch (error) {
          console.error('Error saving draft:', error);
          setSaveError('An unexpected error occurred');
        } finally {
          setIsSaving(false);
          isSavingRef.current = false;
        }
      }, 1000); // 1 second debounce
    },
    [orgId, currentStep, enabled]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveDraft,
    isSaving,
    lastSaved,
    saveError,
  };
}
