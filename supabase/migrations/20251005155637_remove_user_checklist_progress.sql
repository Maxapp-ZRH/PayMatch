-- Remove Unused user_checklist_progress Table
-- This table is no longer needed as onboarding is tracked at the organization level
-- The organizations.onboarding_completed field is the single source of truth

-- Drop the unused table
DROP TABLE IF EXISTS public.user_checklist_progress;

-- Add comment for documentation
COMMENT ON COLUMN public.organizations.onboarding_completed IS 'Single source of truth for organization onboarding status. Only organization owners go through complex onboarding. Invited users have simplified profile setup.';
