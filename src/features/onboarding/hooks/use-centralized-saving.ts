/**
 * Centralized Saving Hook
 *
 * Manages saving state across the entire onboarding wizard.
 * Provides save on blur functionality instead of frequent auto-saves.
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { onboardingDraftService } from '../services/draft-service';
import type { OnboardingData } from '../types';

interface UseCentralizedSavingOptions {
  orgId: string;
  currentStep: number;
}

interface UseCentralizedSavingReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  saveOnBlur: (data: Partial<OnboardingData>) => void;
  saveImmediately: (data: Partial<OnboardingData>) => Promise<void>;
  clearSaveError: () => void;
}

export function useCentralizedSaving({
  orgId,
  currentStep,
}: UseCentralizedSavingOptions): UseCentralizedSavingReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const performSave = useCallback(
    async (data: Partial<OnboardingData>) => {
      if (!orgId || isSavingRef.current) return;

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
    },
    [orgId, currentStep]
  );

  const saveOnBlur = useCallback(
    (data: Partial<OnboardingData>) => {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set a short delay to batch multiple blur events
      saveTimeoutRef.current = setTimeout(() => {
        performSave(data);
      }, 300); // 300ms delay to batch rapid blur events
    },
    [performSave]
  );

  const saveImmediately = useCallback(
    async (data: Partial<OnboardingData>) => {
      // Clear any pending blur saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      await performSave(data);
    },
    [performSave]
  );

  const clearSaveError = useCallback(() => {
    setSaveError(null);
  }, []);

  return {
    isSaving,
    lastSaved,
    saveError,
    saveOnBlur,
    saveImmediately,
    clearSaveError,
  };
}
