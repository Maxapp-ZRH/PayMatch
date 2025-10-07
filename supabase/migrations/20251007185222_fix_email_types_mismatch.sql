-- Fix email types mismatch between code and database
-- Add missing business email types and update constraints

-- Update email_preferences table constraint to include missing email types
ALTER TABLE public.email_preferences 
DROP CONSTRAINT IF EXISTS email_preferences_email_type_check;

ALTER TABLE public.email_preferences 
ADD CONSTRAINT email_preferences_email_type_check 
CHECK (email_type IN (
  'newsletter_promotional',    -- Marketing emails, offers, sales
  'newsletter_informational',  -- Product updates, tips, educational content
  'newsletter_news',          -- Company news, announcements
  'support',                  -- Support-related emails
  'transactional',            -- Account-related, receipts, confirmations
  'security',                 -- Security alerts, login notifications
  'legal',                    -- Legal updates, terms changes
  'business_notifications',   -- Business notifications (invoice status, payments)
  'overdue_alerts'            -- Overdue payment alerts (sent to business owner)
));

-- Update email_type_categories table to include new business email types
INSERT INTO public.email_type_categories (email_type, category, requires_marketing_consent, description) VALUES
('business_notifications', 'transactional', false, 'Business notifications: invoice status, payment confirmations, account updates'),
('overdue_alerts', 'transactional', false, 'Overdue payment alerts: notifications sent to business owner about overdue payments')
ON CONFLICT (email_type) DO UPDATE SET
  category = EXCLUDED.category,
  requires_marketing_consent = EXCLUDED.requires_marketing_consent,
  description = EXCLUDED.description;

-- Update the email_type_requires_marketing_consent function to handle new types
CREATE OR REPLACE FUNCTION public.email_type_requires_marketing_consent(
  p_email_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  requires_consent BOOLEAN;
BEGIN
  SELECT requires_marketing_consent INTO requires_consent
  FROM public.email_type_categories
  WHERE email_type = p_email_type;
  
  RETURN COALESCE(requires_consent, false);
END;
$$;

-- Update the get_email_types_by_category function to include new types
CREATE OR REPLACE FUNCTION public.get_email_types_by_category(
  p_category TEXT
)
RETURNS TABLE (
  email_type TEXT,
  description TEXT,
  requires_marketing_consent BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    etc.email_type,
    etc.description,
    etc.requires_marketing_consent
  FROM public.email_type_categories etc
  WHERE etc.category = p_category
  ORDER BY etc.email_type;
END;
$$;

-- Add comment to document the new email types
COMMENT ON CONSTRAINT email_preferences_email_type_check ON public.email_preferences IS 
'Validates email_type against all supported email types including business notifications and overdue alerts';

-- Update table comment to reflect new email types
COMMENT ON TABLE public.email_preferences IS 
'Stores email unsubscribe preferences for different email types including business notifications and overdue alerts';
