/**
 * Create Organization on Email Verification
 * 
 * Creates a database trigger that automatically creates an organization
 * when a user's email is verified (email_confirmed_at is set).
 * This replaces the application-level organization creation.
 */

-- Function to create organization when email is verified
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
  user_name TEXT;
  user_language TEXT;
BEGIN
  -- Only proceed if email_confirmed_at changed from NULL to a timestamp
  -- and the user doesn't already have an organization
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    
    -- Check if user already has an organization
    IF EXISTS (
      SELECT 1 FROM public.organization_users 
      WHERE user_id = NEW.id AND status = 'active'
    ) THEN
      -- User already has an organization, just update profile
      UPDATE public.user_profiles 
      SET 
        name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        updated_at = NOW()
      WHERE id = NEW.id;
      
      RETURN NEW;
    END IF;

    -- Extract user name and language from metadata
    user_name := COALESCE(
      NEW.raw_user_meta_data->>'name',
      CONCAT(
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        ' ',
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      ),
      NEW.email
    );
    
    user_language := COALESCE(NEW.raw_user_meta_data->>'language', 'de');

    -- Create user profile if it doesn't exist
    INSERT INTO public.user_profiles (id, name, created_at, updated_at)
    VALUES (NEW.id, user_name, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      updated_at = NOW();

    -- Create default organization for the user
    INSERT INTO public.organizations (
      name, 
      default_language, 
      plan, 
      onboarding_completed, 
      onboarding_step,
      created_at,
      updated_at
    )
    VALUES (
      CONCAT(user_name, '''s Organization'),
      user_language,
      'free',
      false,
      1,
      NOW(),
      NOW()
    )
    RETURNING id INTO new_org_id;

    -- Add user as owner of the organization
    INSERT INTO public.organization_users (
      org_id, 
      user_id, 
      role, 
      status, 
      accepted_at,
      created_at,
      updated_at
    )
    VALUES (
      new_org_id, 
      NEW.id, 
      'owner', 
      'active', 
      NOW(),
      NOW(),
      NOW()
    );

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER on_email_verification
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_verification();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_email_verification() TO service_role;
