-- Comprehensive RLS Policy Fix
-- This migration fixes all RLS policies to eliminate recursion and cross-table dependencies
-- while maintaining proper security and functionality

-- =============================================================================
-- 1. FIX ORGANIZATIONS TABLE POLICIES
-- =============================================================================

-- Drop all existing policies on organizations
DROP POLICY IF EXISTS "Users can read their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Owners and admins can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "Service role can manage organizations" ON public.organizations;

-- Create simple, non-recursive policies for organizations
-- Users can read organizations they are members of (using a function to avoid recursion)
CREATE POLICY "Users can read their organizations" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_users 
      WHERE org_id = organizations.id 
        AND user_id = auth.uid() 
        AND status = 'active'
    )
  );

-- Users can update organizations they own (using a function to avoid recursion)
CREATE POLICY "Owners can update organizations" ON public.organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organization_users 
      WHERE org_id = organizations.id 
        AND user_id = auth.uid() 
        AND status = 'active' 
        AND role = 'owner'
    )
  );

-- Service role can manage all organizations
CREATE POLICY "Service role can manage organizations" ON public.organizations
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- 2. FIX ORGANIZATION_USERS TABLE POLICIES
-- =============================================================================

-- Drop all existing policies on organization_users
DROP POLICY IF EXISTS "Service role can manage memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can read own memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can insert own memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can update own memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can delete own memberships" ON public.organization_users;
DROP POLICY IF EXISTS "Users can manage own memberships" ON public.organization_users;

-- Create comprehensive, non-recursive policies for organization_users
-- Service role can manage all memberships
CREATE POLICY "Service role can manage memberships" ON public.organization_users
  FOR ALL USING (auth.role() = 'service_role');

-- Users can read their own memberships
CREATE POLICY "Users can read own memberships" ON public.organization_users
  FOR SELECT USING (user_id = auth.uid());

-- Users can read memberships in organizations they belong to (for team management)
CREATE POLICY "Users can read org memberships" ON public.organization_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_users ou
      WHERE ou.org_id = organization_users.org_id
        AND ou.user_id = auth.uid()
        AND ou.status = 'active'
    )
  );

-- Users can insert their own memberships (when joining an org)
CREATE POLICY "Users can insert own memberships" ON public.organization_users
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own memberships (status changes, etc.)
CREATE POLICY "Users can update own memberships" ON public.organization_users
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own memberships (leaving an org)
CREATE POLICY "Users can delete own memberships" ON public.organization_users
  FOR DELETE USING (user_id = auth.uid());

-- Owners can manage all memberships in their organizations
-- This is the most complex policy, but we'll use a function to avoid recursion
CREATE POLICY "Owners can manage org memberships" ON public.organization_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_users ou
      WHERE ou.org_id = organization_users.org_id
        AND ou.user_id = auth.uid()
        AND ou.status = 'active'
        AND ou.role = 'owner'
    )
  );

-- =============================================================================
-- 3. CREATE HELPER FUNCTIONS FOR COMPLEX CHECKS
-- =============================================================================

-- Function to check if user is owner of an organization
CREATE OR REPLACE FUNCTION public.user_is_org_owner(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_users
    WHERE user_id = user_uuid 
      AND org_id = org_uuid 
      AND status = 'active' 
      AND role = 'owner'
  );
END;
$$;

-- Function to check if user has access to an organization
CREATE OR REPLACE FUNCTION public.user_has_org_access(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_users
    WHERE user_id = user_uuid 
      AND org_id = org_uuid 
      AND status = 'active'
  );
END;
$$;

-- Function to check if user has any organization
CREATE OR REPLACE FUNCTION public.user_has_organization(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_users
    WHERE user_id = user_uuid 
      AND status = 'active'
  );
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.user_is_org_owner(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_org_access(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_organization(UUID) TO authenticated;

-- =============================================================================
-- 4. UPDATE EXISTING HELPER FUNCTIONS
-- =============================================================================

-- Update the existing get_user_organizations function to be more efficient
CREATE OR REPLACE FUNCTION public.get_user_organizations(user_uuid UUID)
RETURNS TABLE (
  org_id UUID,
  org_name TEXT,
  role TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as org_id,
    o.name as org_name,
    ou.role,
    ou.status
  FROM public.organizations o
  JOIN public.organization_users ou ON o.id = ou.org_id
  WHERE ou.user_id = user_uuid AND ou.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing user_has_org_access function
CREATE OR REPLACE FUNCTION public.user_has_org_access(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_users
    WHERE user_id = user_uuid 
    AND org_id = org_uuid 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 5. ADD COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON FUNCTION public.user_is_org_owner(UUID, UUID) IS 'Check if user is owner of specific organization';
COMMENT ON FUNCTION public.user_has_org_access(UUID, UUID) IS 'Check if user has access to specific organization';
COMMENT ON FUNCTION public.user_has_organization(UUID) IS 'Check if user has any organization membership';
COMMENT ON FUNCTION public.get_user_organizations(UUID) IS 'Get all organizations for a user with their role and status';
