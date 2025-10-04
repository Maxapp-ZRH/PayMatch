-- Add onboarding completion tracking to user_profiles table
-- This migration adds onboarding_completed field to track user onboarding status

-- Add onboarding_completed column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Add onboarding_completed_at timestamp for tracking when onboarding was completed
ALTER TABLE public.user_profiles 
ADD COLUMN onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Add index for efficient querying of onboarding status
CREATE INDEX idx_user_profiles_onboarding_completed ON public.user_profiles(onboarding_completed);

-- Add comment for documentation
COMMENT ON COLUMN public.user_profiles.onboarding_completed IS 'Tracks whether the user has completed the onboarding process';
COMMENT ON COLUMN public.user_profiles.onboarding_completed_at IS 'Timestamp when the user completed onboarding';

-- Update existing users to have onboarding_completed = true (they're already using the system)
-- This prevents existing users from being forced through onboarding
UPDATE public.user_profiles 
SET onboarding_completed = TRUE, onboarding_completed_at = NOW()
WHERE onboarding_completed = FALSE;
