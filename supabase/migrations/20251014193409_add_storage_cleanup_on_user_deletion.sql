-- Add Storage Cleanup on User Deletion
-- 
-- This migration ensures that when a user is deleted, their storage items
-- (avatars and organization logos) are also cleaned up automatically.
-- 
-- Since we can't directly modify storage.objects through migrations due to
-- permission constraints, we'll create a function that can be called
-- by the application or through a webhook when user deletion occurs.

-- Create function to clean up user's storage items
CREATE OR REPLACE FUNCTION public.cleanup_user_storage_items(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avatar_paths text[];
  logo_paths text[];
  path text;
BEGIN
  -- Log the cleanup attempt
  RAISE NOTICE 'Starting storage cleanup for user: %', user_id;
  
  -- Get all avatar paths for this user
  -- Avatars are stored in the pattern: users/{user_id}/avatar.*
  SELECT ARRAY_AGG(name) INTO avatar_paths
  FROM storage.objects 
  WHERE bucket_id = 'avatars' 
    AND name LIKE 'users/' || user_id::text || '/%';
  
  -- Get all logo paths for organizations owned by this user
  -- Logos are stored in the pattern: organizations/{org_id}/logo.*
  SELECT ARRAY_AGG(o.name) INTO logo_paths
  FROM storage.objects o
  JOIN public.organizations org ON org.id::text = (regexp_match(o.name, '^organizations/([^/]+)/.*$'))[1]
  WHERE o.bucket_id = 'logos' 
    AND org.owner_id = user_id;
  
  -- Delete avatar files
  IF avatar_paths IS NOT NULL THEN
    FOREACH path IN ARRAY avatar_paths LOOP
      BEGIN
        DELETE FROM storage.objects 
        WHERE bucket_id = 'avatars' AND name = path;
        RAISE NOTICE 'Deleted avatar: %', path;
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to delete avatar %: %', path, SQLERRM;
      END;
    END LOOP;
  END IF;
  
  -- Delete logo files for organizations owned by this user
  IF logo_paths IS NOT NULL THEN
    FOREACH path IN ARRAY logo_paths LOOP
      BEGIN
        DELETE FROM storage.objects 
        WHERE bucket_id = 'logos' AND name = path;
        RAISE NOTICE 'Deleted logo: %', path;
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to delete logo %: %', path, SQLERRM;
      END;
    END LOOP;
  END IF;
  
  RAISE NOTICE 'Storage cleanup completed for user: %', user_id;
END;
$$;

-- Create function to clean up storage when user leaves organization
-- This is called when a user leaves an organization but doesn't delete their account
CREATE OR REPLACE FUNCTION public.cleanup_organization_logos_on_membership_removal(org_id UUID, user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  logo_paths text[];
  path text;
  is_owner boolean;
BEGIN
  -- Check if the user is the owner of the organization
  SELECT EXISTS(
    SELECT 1 FROM public.organizations 
    WHERE id = org_id AND owner_id = user_id
  ) INTO is_owner;
  
  -- Only clean up logos if the user is the owner
  IF is_owner THEN
    RAISE NOTICE 'User % is owner of organization %, cleaning up logos', user_id, org_id;
    
    -- Get all logo paths for this organization
    SELECT ARRAY_AGG(name) INTO logo_paths
    FROM storage.objects 
    WHERE bucket_id = 'logos' 
      AND name LIKE 'organizations/' || org_id::text || '/%';
    
    -- Delete logo files
    IF logo_paths IS NOT NULL THEN
      FOREACH path IN ARRAY logo_paths LOOP
        BEGIN
          DELETE FROM storage.objects 
          WHERE bucket_id = 'logos' AND name = path;
          RAISE NOTICE 'Deleted logo: %', path;
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Failed to delete logo %: %', path, SQLERRM;
        END;
      END LOOP;
    END IF;
  ELSE
    RAISE NOTICE 'User % is not owner of organization %, no logo cleanup needed', user_id, org_id;
  END IF;
END;
$$;

-- Create a trigger function that will be called when user_profiles are deleted
-- This happens when auth.users records are deleted due to CASCADE
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the storage cleanup function
  PERFORM public.cleanup_user_storage_items(OLD.id);
  
  -- Log the deletion
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    OLD.id,
    'user_deleted',
    'user_profile',
    OLD.id,
    jsonb_build_object(
      'email', OLD.email,
      'first_name', OLD.first_name,
      'last_name', OLD.last_name,
      'storage_cleanup', 'completed'
    )
  );
  
  RETURN OLD;
END;
$$;

-- Create trigger on user_profiles deletion
CREATE TRIGGER on_user_profile_deletion
  BEFORE DELETE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_deletion();

-- Create a trigger function for organization membership removal
CREATE OR REPLACE FUNCTION public.handle_organization_membership_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clean up organization logos if the user was the owner
  PERFORM public.cleanup_organization_logos_on_membership_removal(OLD.org_id, OLD.user_id);
  
  -- Log the membership removal
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    OLD.user_id,
    'organization_membership_removed',
    'organization_user',
    OLD.id,
    jsonb_build_object(
      'org_id', OLD.org_id,
      'storage_cleanup', 'completed'
    )
  );
  
  RETURN OLD;
END;
$$;

-- Create trigger on organization_users deletion
CREATE TRIGGER on_organization_membership_removal
  BEFORE DELETE ON public.organization_users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_organization_membership_removal();

-- Add comments for documentation
COMMENT ON FUNCTION public.cleanup_user_storage_items(UUID) IS 'Cleans up all storage items (avatars and organization logos) for a deleted user';
COMMENT ON FUNCTION public.cleanup_organization_logos_on_membership_removal(UUID, UUID) IS 'Cleans up organization logos when a user leaves an organization they own';
COMMENT ON FUNCTION public.handle_user_deletion() IS 'Trigger function that cleans up storage when a user profile is deleted';
COMMENT ON FUNCTION public.handle_organization_membership_removal() IS 'Trigger function that cleans up storage when a user leaves an organization';

-- Note: These functions require elevated permissions to modify storage.objects
-- In production, you may need to call these functions through:
-- 1. Supabase Edge Functions with service role permissions
-- 2. Application-level cleanup when user deletion is detected
-- 3. Webhook handlers for auth events
