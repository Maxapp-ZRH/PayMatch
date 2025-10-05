-- Consolidate Onboarding Status - Single Source of Truth
-- Remove user_profiles.onboarding_completed and use only organizations.onboarding_completed

-- First, sync any existing data from user_profiles to organizations
UPDATE public.organizations 
SET onboarding_completed = up.onboarding_completed,
    updated_at = NOW()
FROM public.organization_users ou
JOIN public.user_profiles up ON ou.user_id = up.id
WHERE organizations.id = ou.org_id 
  AND ou.role = 'owner' 
  AND ou.status = 'active';

-- Drop the redundant column from user_profiles
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS onboarding_completed;

-- Drop the redundant column from user_profiles  
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS onboarding_completed_at;

-- Drop the index that's no longer needed
DROP INDEX IF EXISTS idx_user_profiles_onboarding_completed;

-- Add comment for documentation
COMMENT ON COLUMN public.organizations.onboarding_completed IS 'Single source of truth for onboarding completion status - only organization owners go through onboarding';
