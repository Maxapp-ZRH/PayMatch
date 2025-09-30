-- Fix security issue with update_updated_at_column function
-- Set search_path to empty string and add SECURITY DEFINER for proper security

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated and service_role
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;

-- Add function comment
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger function to automatically update the updated_at column when a record is modified';
