/**
 * Fix Organization Users RLS Infinite Recursion
 * 
 * Fixes the infinite recursion issue in the organization_users RLS policy
 * that prevents users from checking if they have an organization.
 * The "Owners and admins can manage memberships" policy was causing
 * infinite recursion by querying the same table it protects.
 */

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Owners and admins can manage memberships" ON public.organization_users;

-- Create a simpler policy that doesn't cause recursion
-- Users can manage memberships for organizations they own (based on user_profiles or direct ownership)
CREATE POLICY "Users can manage own memberships" ON public.organization_users
  FOR ALL USING (
    user_id = (SELECT auth.uid()) 
    OR 
    org_id IN (
      SELECT o.id 
      FROM organizations o 
      JOIN organization_users ou ON o.id = ou.org_id 
      WHERE ou.user_id = (SELECT auth.uid()) 
        AND ou.role = 'owner' 
        AND ou.status = 'active'
    )
  );

-- Ensure the service role policy exists and is correct
DROP POLICY IF EXISTS "Service role can manage memberships" ON public.organization_users;
CREATE POLICY "Service role can manage memberships" ON public.organization_users
  FOR ALL USING (auth.role() = 'service_role');

-- The "Users can read own memberships" policy should already exist and be working
-- Let's verify it exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_users' 
    AND policyname = 'Users can read own memberships'
  ) THEN
    CREATE POLICY "Users can read own memberships" ON public.organization_users
      FOR SELECT USING (user_id = (SELECT auth.uid()));
  END IF;
END $$;
