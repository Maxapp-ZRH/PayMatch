-- Remove legacy newsletter_subscribers table
-- This migration removes the old newsletter_subscribers table after successful migration to email_preferences

-- Drop the temporary view first
DROP VIEW IF EXISTS public.newsletter_subscribers_view;

-- Drop the legacy newsletter_subscribers table
DROP TABLE IF EXISTS public.newsletter_subscribers;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Legacy newsletter_subscribers table removed successfully. All newsletter functionality now uses the unified email_preferences system.';
END $$;
