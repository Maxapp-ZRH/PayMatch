/**
 * Fix Organization Users RLS Policy
 * 
 * Fixes the circular dependency in the organization_users RLS policy
 * that prevents users from checking if they have an organization.
 */

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can read org memberships" ON public.organization_users;

-- Create a simpler policy that allows users to read their own memberships
CREATE POLICY "Users can read own memberships" ON public.organization_users
  FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Keep the existing management policies
-- (They should already exist, but let's make sure they're correct)

-- Ensure the service role policy exists
DROP POLICY IF EXISTS "Service role can manage memberships" ON public.organization_users;
CREATE POLICY "Service role can manage memberships" ON public.organization_users
  FOR ALL USING (auth.role() = 'service_role');

-- Ensure the owners and admins policy exists
DROP POLICY IF EXISTS "Owners and admins can manage memberships" ON public.organization_users;
CREATE POLICY "Owners and admins can manage memberships" ON public.organization_users
  FOR ALL USING (
    org_id IN (
      SELECT organization_users_1.org_id
      FROM organization_users organization_users_1
      WHERE organization_users_1.user_id = (SELECT auth.uid())
        AND organization_users_1.status = 'active'
        AND organization_users_1.role IN ('owner', 'admin')
    )
  );
