-- Cleanup Unused Functions
-- Remove functions that are not being used in the application

-- Remove duplicate function (user_has_organization is the one we use)
DROP FUNCTION IF EXISTS check_user_has_organization(UUID);

-- Remove old trigger function (replaced by handle_email_verification)
DROP FUNCTION IF EXISTS handle_new_user();

-- Note: Keeping the following functions as they may be useful for future features:
-- - get_user_organizations: For user dashboard showing all organizations
-- - user_has_org_access: For checking access to specific organizations
-- - user_is_org_owner: For admin functions and organization management

-- Add comments to document the remaining functions
COMMENT ON FUNCTION public.get_user_organizations(UUID) IS 'Get all organizations for a user - useful for dashboard and organization switching';
COMMENT ON FUNCTION public.user_has_org_access(UUID, UUID) IS 'Check if user has access to specific organization - useful for organization-specific features';
COMMENT ON FUNCTION public.user_is_org_owner(UUID, UUID) IS 'Check if user owns specific organization - useful for admin functions and organization management';
COMMENT ON FUNCTION public.user_has_organization(UUID) IS 'Check if user has any organization - used in login flow';
COMMENT ON FUNCTION public.cleanup_expired_registrations_direct() IS 'Clean up expired pending registrations - used by cron job';
COMMENT ON FUNCTION public.handle_email_verification() IS 'Create organization when user verifies email - used by auth trigger';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Auto-update updated_at timestamps - used by table triggers';
