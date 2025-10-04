-- Create a function to check if user has an organization
-- This function runs with elevated privileges and bypasses RLS

CREATE OR REPLACE FUNCTION check_user_has_organization(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if user has an active organization membership
  RETURN EXISTS (
    SELECT 1 
    FROM organization_users 
    WHERE user_id = user_uuid 
      AND status = 'active'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_user_has_organization(UUID) TO authenticated;
