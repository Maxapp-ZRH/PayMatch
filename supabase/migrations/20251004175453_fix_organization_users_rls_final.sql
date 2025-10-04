-- Final fix for organization_users RLS policy
-- Remove all policies that reference organization_users within their own conditions

-- Drop all existing policies on organization_users
DROP POLICY IF EXISTS "Service role can manage memberships" ON organization_users;
DROP POLICY IF EXISTS "Users can manage own memberships" ON organization_users;
DROP POLICY IF EXISTS "Users can read own memberships" ON organization_users;

-- Create simple, non-recursive policies
-- 1. Service role can do everything
CREATE POLICY "Service role can manage memberships" ON organization_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- 2. Users can read their own memberships (simple, no recursion)
CREATE POLICY "Users can read own memberships" ON organization_users
  FOR SELECT
  USING (user_id = auth.uid());

-- 3. Users can insert their own memberships (for when they join an org)
CREATE POLICY "Users can insert own memberships" ON organization_users
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 4. Users can update their own memberships (for status changes)
CREATE POLICY "Users can update own memberships" ON organization_users
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 5. Users can delete their own memberships (for leaving an org)
CREATE POLICY "Users can delete own memberships" ON organization_users
  FOR DELETE
  USING (user_id = auth.uid());

-- Note: We'll handle owner permissions at the application level
-- to avoid RLS recursion issues
