-- Add onboarding draft data storage
-- This migration adds a JSONB column to store draft form data for progressive saving

-- Add onboarding_draft_data column to organizations table
ALTER TABLE public.organizations 
ADD COLUMN onboarding_draft_data JSONB DEFAULT '{}';

-- Add index for efficient querying of draft data
CREATE INDEX idx_organizations_onboarding_draft_data ON public.organizations USING GIN (onboarding_draft_data);

-- Add comment for documentation
COMMENT ON COLUMN public.organizations.onboarding_draft_data IS 'Stores draft form data during onboarding process for progressive saving. Cleared when onboarding is completed.';

-- Add function to clear draft data when onboarding is completed
CREATE OR REPLACE FUNCTION clear_onboarding_draft_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Clear draft data when onboarding is marked as completed
  IF NEW.onboarding_completed = true AND OLD.onboarding_completed = false THEN
    NEW.onboarding_draft_data = '{}';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically clear draft data on completion
CREATE TRIGGER clear_draft_data_on_completion
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION clear_onboarding_draft_data();

-- Add RLS policy for draft data access
-- Users can only access draft data for their own organization
CREATE POLICY "Users can access their organization draft data" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id 
      FROM public.organization_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND status = 'active'
    )
  );

CREATE POLICY "Users can update their organization draft data" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT org_id 
      FROM public.organization_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND status = 'active'
    )
  );
