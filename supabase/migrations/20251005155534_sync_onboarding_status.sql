-- Sync Onboarding Status Between Tables
-- This migration ensures consistency between user_profiles and organizations onboarding status

-- Update user_profiles onboarding_completed to match organizations
UPDATE public.user_profiles 
SET 
  onboarding_completed = org.onboarding_completed,
  onboarding_completed_at = CASE 
    WHEN org.onboarding_completed = true AND user_profiles.onboarding_completed_at IS NULL 
    THEN org.updated_at 
    ELSE user_profiles.onboarding_completed_at 
  END,
  updated_at = NOW()
FROM public.organization_users ou
JOIN public.organizations org ON ou.org_id = org.id
WHERE user_profiles.id = ou.user_id 
  AND ou.status = 'active' 
  AND ou.role = 'owner';

-- Add comment for documentation
COMMENT ON COLUMN public.user_profiles.onboarding_completed IS 'Tracks whether the user has completed the onboarding process - synced with organizations table';
COMMENT ON COLUMN public.user_profiles.onboarding_completed_at IS 'Timestamp when the user completed onboarding - synced with organizations table';
