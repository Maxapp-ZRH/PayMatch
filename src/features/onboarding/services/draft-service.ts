/**
 * Onboarding Draft Service
 *
 * Handles progressive saving of onboarding form data to prevent data loss.
 * Provides debounced auto-save functionality for form inputs.
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import type { OnboardingData } from '../types';

export interface DraftSaveResult {
  success: boolean;
  message: string;
  error?: string;
}

export class OnboardingDraftService {
  private supabase = createClient();
  private saveTimeout: NodeJS.Timeout | null = null;
  private readonly DEBOUNCE_DELAY = 2000; // 2 seconds

  /**
   * Save draft data with debouncing to prevent excessive API calls
   */
  async saveDraft(
    orgId: string,
    stepData: Partial<OnboardingData>,
    step: number
  ): Promise<DraftSaveResult> {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    return new Promise((resolve) => {
      this.saveTimeout = setTimeout(async () => {
        try {
          const { error } = await this.supabase
            .from('organizations')
            .update({
              onboarding_draft_data: {
                step,
                data: stepData,
                last_saved: new Date().toISOString(),
              },
              updated_at: new Date().toISOString(),
            })
            .eq('id', orgId);

          if (error) {
            console.error('Error saving draft data:', error);
            resolve({
              success: false,
              message: 'Failed to save draft data',
              error: error.message,
            });
            return;
          }

          resolve({
            success: true,
            message: 'Draft data saved successfully',
          });
        } catch (error) {
          console.error('Error saving draft data:', error);
          resolve({
            success: false,
            message: 'An unexpected error occurred',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }, this.DEBOUNCE_DELAY);
    });
  }

  /**
   * Load draft data for a specific step
   */
  async loadDraft(orgId: string): Promise<{
    success: boolean;
    data?: Partial<OnboardingData>;
    step?: number;
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('organizations')
        .select('onboarding_draft_data')
        .eq('id', orgId)
        .single();

      if (error) {
        console.error('Error loading draft data:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      const draftData = data?.onboarding_draft_data;
      if (!draftData || typeof draftData !== 'object') {
        return {
          success: true,
          data: {},
        };
      }

      return {
        success: true,
        data: draftData.data || {},
        step: draftData.step || 1,
      };
    } catch (error) {
      console.error('Error loading draft data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Clear draft data (called when onboarding is completed)
   */
  async clearDraft(orgId: string): Promise<DraftSaveResult> {
    try {
      const { error } = await this.supabase
        .from('organizations')
        .update({
          onboarding_draft_data: {},
          updated_at: new Date().toISOString(),
        })
        .eq('id', orgId);

      if (error) {
        console.error('Error clearing draft data:', error);
        return {
          success: false,
          message: 'Failed to clear draft data',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Draft data cleared successfully',
      };
    } catch (error) {
      console.error('Error clearing draft data:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Cancel pending save operations
   */
  cancelPendingSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
  }
}

// Export singleton instance
export const onboardingDraftService = new OnboardingDraftService();
