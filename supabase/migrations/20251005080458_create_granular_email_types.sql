-- Create granular email types for better consent management
-- Supports Switzerland FADP requirements for specific consent

-- Add new email types to existing email_preferences table
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
  'legal'                     -- Legal updates, terms changes
));

-- Create email_type_categories table for better organization
CREATE TABLE IF NOT EXISTS public.email_type_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_type TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN (
    'marketing',
    'informational', 
    'transactional',
    'security',
    'legal'
  )),
  requires_marketing_consent BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert email type categories
INSERT INTO public.email_type_categories (email_type, category, requires_marketing_consent, description) VALUES
('newsletter_promotional', 'marketing', true, 'Promotional emails, offers, sales, marketing campaigns'),
('newsletter_informational', 'informational', false, 'Product updates, tips, educational content, how-to guides'),
('newsletter_news', 'informational', false, 'Company news, announcements, industry updates'),
('support', 'transactional', false, 'Support-related emails, help desk communications'),
('transactional', 'transactional', false, 'Account-related emails, receipts, confirmations'),
('security', 'security', false, 'Security alerts, login notifications, account security'),
('legal', 'legal', false, 'Legal updates, terms changes, privacy policy updates')
ON CONFLICT (email_type) DO NOTHING;

-- Create function to check if email type requires marketing consent
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

-- Create function to get all email types for a category
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

-- Grant permissions
GRANT SELECT ON public.email_type_categories TO authenticated;
GRANT EXECUTE ON FUNCTION public.email_type_requires_marketing_consent TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_types_by_category TO authenticated;
GRANT ALL ON public.email_type_categories TO service_role;
GRANT EXECUTE ON FUNCTION public.email_type_requires_marketing_consent TO service_role;
GRANT EXECUTE ON FUNCTION public.get_email_types_by_category TO service_role;
