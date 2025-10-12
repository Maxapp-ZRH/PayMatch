-- Fix auth.users table access for email preferences
-- The email service needs to access auth.users for email lookups

-- Grant necessary permissions for service role to access auth.users
-- This is needed for the email preferences service to work properly

-- The service role should already have access to auth.users, but let's ensure it
-- by explicitly granting permissions if they don't exist

-- Grant SELECT permission on auth.users to service_role
-- (This should already exist, but we're being explicit)
DO $$
BEGIN
  -- Check if service_role has access to auth.users
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_privileges 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND grantee = 'service_role'
  ) THEN
    -- Grant SELECT permission to service_role
    GRANT SELECT ON auth.users TO service_role;
  END IF;
END $$;

-- Also ensure that the email_preferences table has proper RLS policies
-- for service role access

-- Drop and recreate the email_preferences policy to ensure service role access
DROP POLICY IF EXISTS "email_preferences_comprehensive_policy" ON public.email_preferences;

CREATE POLICY "email_preferences_comprehensive_policy" ON public.email_preferences
  FOR ALL USING (
    -- Service role has full access
    current_setting('role') = 'service_role'
    OR
    -- Authenticated users can manage their own preferences
    (
      (SELECT auth.uid()) IS NOT NULL 
      AND user_id = (SELECT auth.uid())
    )
  );

-- Ensure service role has all necessary permissions
GRANT ALL ON public.email_preferences TO service_role;
GRANT ALL ON public.email_preferences TO authenticated;

-- Also ensure consent_records table has proper service role access
-- since the error mentioned "Failed to record consent"
DROP POLICY IF EXISTS "consent_records_comprehensive_policy" ON public.consent_records;

CREATE POLICY "consent_records_comprehensive_policy" ON public.consent_records
  FOR ALL USING (
    -- Service role has full access
    current_setting('role') = 'service_role'
    OR
    -- Authenticated users can manage their own consent records
    (
      (SELECT auth.uid()) IS NOT NULL 
      AND user_id = (SELECT auth.uid())
    )
  );

-- Ensure service role has all necessary permissions for consent_records
GRANT ALL ON public.consent_records TO service_role;
GRANT ALL ON public.consent_records TO authenticated;
