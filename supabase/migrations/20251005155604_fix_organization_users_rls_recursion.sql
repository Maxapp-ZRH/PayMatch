-- Fix infinite recursion in organization_users RLS policy
-- The current policy causes infinite recursion by querying organization_users within itself

-- Drop the problematic policy
DROP POLICY IF EXISTS "organization_users_comprehensive_policy" ON public.organization_users;

-- Create a simple, non-recursive policy for organization_users
CREATE POLICY "Users can access their organization memberships" ON public.organization_users
  FOR ALL USING (
    -- Service role can access everything
    current_setting('role') = 'service_role' OR
    -- Users can access their own memberships
    user_id = (SELECT auth.uid())
  );

-- Grant necessary permissions
GRANT ALL ON public.organization_users TO authenticated;
GRANT ALL ON public.organization_users TO service_role;
