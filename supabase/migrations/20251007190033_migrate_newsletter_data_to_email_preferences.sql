-- Migrate newsletter_subscribers data to email_preferences table
-- This migration moves all existing newsletter subscribers to the new unified email preferences system

-- Migrate active newsletter subscribers to email_preferences
INSERT INTO public.email_preferences (email, email_type, is_active, created_at, updated_at)
SELECT 
  ns.email,
  'newsletter_promotional' as email_type,
  ns.is_active,
  ns.subscribed_at as created_at,
  COALESCE(ns.unsubscribed_at, ns.updated_at) as updated_at
FROM public.newsletter_subscribers ns
WHERE ns.is_active = true
ON CONFLICT (email, email_type) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;

-- Migrate inactive newsletter subscribers to email_preferences (as unsubscribed)
INSERT INTO public.email_preferences (email, email_type, is_active, unsubscribed_at, created_at, updated_at)
SELECT 
  ns.email,
  'newsletter_promotional' as email_type,
  false as is_active,
  ns.unsubscribed_at,
  ns.subscribed_at as created_at,
  ns.updated_at
FROM public.newsletter_subscribers ns
WHERE ns.is_active = false
ON CONFLICT (email, email_type) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  unsubscribed_at = EXCLUDED.unsubscribed_at,
  updated_at = EXCLUDED.updated_at;

-- Add comment to document the migration
COMMENT ON TABLE public.newsletter_subscribers IS 
'LEGACY TABLE: Newsletter subscription data migrated to email_preferences table. This table can be removed after confirming migration success.';

-- Create a view for backward compatibility (temporary)
CREATE OR REPLACE VIEW public.newsletter_subscribers_view AS
SELECT 
  ep.email,
  '' as first_name,  -- Not stored in email_preferences
  '' as last_name,   -- Not stored in email_preferences
  ep.is_active,
  ep.created_at as subscribed_at,
  ep.unsubscribed_at,
  ep.created_at,
  ep.updated_at,
  gen_random_uuid()::TEXT as unsubscribe_token  -- Generate for compatibility
FROM public.email_preferences ep
WHERE ep.email_type = 'newsletter_promotional';

-- Add comment to the view
COMMENT ON VIEW public.newsletter_subscribers_view IS 
'Temporary view for backward compatibility. Maps email_preferences to newsletter_subscribers format.';

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Newsletter data migration completed successfully. % active and % inactive subscribers migrated to email_preferences.', 
    (SELECT COUNT(*) FROM public.newsletter_subscribers WHERE is_active = true),
    (SELECT COUNT(*) FROM public.newsletter_subscribers WHERE is_active = false);
END $$;
