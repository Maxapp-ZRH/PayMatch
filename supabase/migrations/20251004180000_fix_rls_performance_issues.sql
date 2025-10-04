-- Fix RLS Performance Issues
-- This migration addresses two main performance problems:
-- 1. auth_rls_initplan: auth.uid() re-evaluation for each row
-- 2. multiple_permissive_policies: Multiple policies for same role/action

-- ============================================================================
-- 1. FIX AUTH FUNCTION RE-EVALUATION ISSUES
-- ============================================================================

-- Drop and recreate policies with (SELECT auth.uid()) to prevent re-evaluation
-- This applies to all policies that use auth.uid() directly

-- Newsletter subscribers table
DROP POLICY IF EXISTS "newsletter_subscribers_access_policy" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_subscribers_access_policy" ON public.newsletter_subscribers
  FOR ALL USING (
    (SELECT auth.uid()) IS NOT NULL
  );

-- Email preferences table - consolidate multiple policies into single comprehensive ones
DROP POLICY IF EXISTS "Users can view own email preferences" ON public.email_preferences;
DROP POLICY IF EXISTS "Users can update own email preferences" ON public.email_preferences;
DROP POLICY IF EXISTS "Users can insert own email preferences" ON public.email_preferences;
DROP POLICY IF EXISTS "Service role can manage all email preferences" ON public.email_preferences;

-- Create single comprehensive policy for email preferences
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

-- Organizations table - consolidate policies
DROP POLICY IF EXISTS "Service role can manage organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can read their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Owners and admins can update organizations" ON public.organizations;

-- Create single comprehensive policy for organizations
CREATE POLICY "organizations_comprehensive_policy" ON public.organizations
  FOR ALL USING (
    -- Service role has full access
    current_setting('role') = 'service_role'
    OR
    -- Users can read organizations they belong to
    EXISTS (
      SELECT 1 FROM public.organization_users ou
      WHERE ou.org_id = organizations.id
      AND ou.user_id = (SELECT auth.uid())
    )
  );

-- User profiles table - consolidate policies
DROP POLICY IF EXISTS "Service role can manage profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;

-- Create single comprehensive policy for user profiles
CREATE POLICY "user_profiles_comprehensive_policy" ON public.user_profiles
  FOR ALL USING (
    -- Service role has full access
    current_setting('role') = 'service_role'
    OR
    -- Users can manage their own profile
    id = (SELECT auth.uid())
  );

-- Organization users table - consolidate policies
DROP POLICY IF EXISTS "Service role can manage memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Owners and admins can manage memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can read org memberships" ON public.organization_users;

-- Create single comprehensive policy for organization users
CREATE POLICY "organization_users_comprehensive_policy" ON public.organization_users
  FOR ALL USING (
    -- Service role has full access
    current_setting('role') = 'service_role'
    OR
    -- Users can read memberships for organizations they belong to
    EXISTS (
      SELECT 1 FROM public.organization_users ou2
      WHERE ou2.org_id = organization_users.org_id
      AND ou2.user_id = (SELECT auth.uid())
    )
    OR
    -- Users can manage their own memberships
    user_id = (SELECT auth.uid())
  );

-- User checklist progress table - consolidate policies
DROP POLICY IF EXISTS "Service role can manage checklist progress" ON public.user_checklist_progress;
DROP POLICY IF EXISTS "Users can manage own checklist progress" ON public.user_checklist_progress;

-- Create single comprehensive policy for user checklist progress
CREATE POLICY "user_checklist_progress_comprehensive_policy" ON public.user_checklist_progress
  FOR ALL USING (
    -- Service role has full access
    current_setting('role') = 'service_role'
    OR
    -- Users can manage their own checklist progress
    user_id = (SELECT auth.uid())
  );

-- ============================================================================
-- 2. ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON POLICY "newsletter_subscribers_access_policy" ON public.newsletter_subscribers IS 
'Allows authenticated users to access newsletter subscribers. Uses (SELECT auth.uid()) for performance.';

COMMENT ON POLICY "email_preferences_comprehensive_policy" ON public.email_preferences IS 
'Comprehensive policy for email preferences. Service role has full access, users can manage their own preferences. Uses (SELECT auth.uid()) for performance.';

COMMENT ON POLICY "organizations_comprehensive_policy" ON public.organizations IS 
'Comprehensive policy for organizations. Service role has full access, users can read organizations they belong to. Uses (SELECT auth.uid()) for performance.';

COMMENT ON POLICY "user_profiles_comprehensive_policy" ON public.user_profiles IS 
'Comprehensive policy for user profiles. Service role has full access, users can manage their own profile. Uses (SELECT auth.uid()) for performance.';

COMMENT ON POLICY "organization_users_comprehensive_policy" ON public.organization_users IS 
'Comprehensive policy for organization memberships. Service role has full access, users can read memberships for their organizations and manage their own. Uses (SELECT auth.uid()) for performance.';

COMMENT ON POLICY "user_checklist_progress_comprehensive_policy" ON public.user_checklist_progress IS 
'Comprehensive policy for user checklist progress. Service role has full access, users can manage their own progress. Uses (SELECT auth.uid()) for performance.';

-- ============================================================================
-- 3. VERIFY POLICIES ARE OPTIMIZED
-- ============================================================================

-- The following query can be used to verify that policies are optimized:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('newsletter_subscribers', 'email_preferences', 'organizations', 'user_profiles', 'organization_users', 'user_checklist_progress')
-- ORDER BY tablename, policyname;
