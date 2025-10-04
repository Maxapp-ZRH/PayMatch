-- Cleanup Redundant RLS Policies
-- Remove old policies that are now covered by comprehensive policies

-- Remove redundant organization_users policies
DROP POLICY IF EXISTS "Owners can manage org memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can delete own memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can insert own memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can read own memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can update own memberships" ON public.organization_users;

-- Remove redundant organizations policies
DROP POLICY IF EXISTS "Owners can update organizations" ON public.organizations;

-- Verify we only have the comprehensive policies left
-- The following query should show only the comprehensive policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('newsletter_subscribers', 'email_preferences', 'organizations', 'user_profiles', 'organization_users', 'user_checklist_progress')
-- ORDER BY tablename, policyname;
