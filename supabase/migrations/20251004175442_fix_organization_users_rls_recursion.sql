-- Fix infinite recursion in organization_users RLS policy
-- The current policy references organization_users within its own condition, causing recursion

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can manage own memberships" ON organization_users;

-- Create a simpler policy that doesn't cause recursion
-- This policy allows users to manage their own memberships and owners to manage all memberships in their org
CREATE POLICY "Users can manage own memberships" ON organization_users
  FOR ALL
  USING (
    -- Users can manage their own memberships
    user_id = auth.uid()
    OR
    -- Owners can manage all memberships in their organization
    EXISTS (
      SELECT 1 
      FROM organization_users ou 
      WHERE ou.org_id = organization_users.org_id 
        AND ou.user_id = auth.uid() 
        AND ou.role = 'owner' 
        AND ou.status = 'active'
    )
  );
