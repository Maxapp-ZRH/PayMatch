-- Create consent_records table for comprehensive GDPR compliance
-- Tracks all consent decisions with full audit trail for Switzerland FADP compliance

CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- User identification
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  session_id TEXT, -- For anonymous users
  
  -- Consent details
  consent_type TEXT NOT NULL CHECK (consent_type IN (
    'marketing_cookies', 
    'analytics_cookies', 
    'newsletter_subscription',
    'marketing_emails',
    'data_processing',
    'third_party_sharing'
  )),
  
  -- Consent status
  consent_given BOOLEAN NOT NULL,
  consent_withdrawn BOOLEAN DEFAULT false,
  
  -- Detailed consent information
  consent_method TEXT NOT NULL CHECK (consent_method IN (
    'cookie_banner',
    'newsletter_form',
    'account_settings',
    'email_link',
    'api_request',
    'admin_action'
  )),
  
  -- Legal compliance fields
  privacy_policy_version TEXT,
  consent_form_version TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  consent_given_at TIMESTAMPTZ,
  consent_withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Additional metadata for audit
  consent_source TEXT, -- e.g., 'footer_form', 'popup_banner'
  consent_context JSONB, -- Store additional context like page URL, referrer
  withdrawal_reason TEXT,
  
  -- Switzerland FADP specific fields
  consent_age_days INTEGER,
  
  -- Ensure unique consent per user per type (latest consent wins)
  UNIQUE(user_id, consent_type, email)
);

-- Create indexes for performance and compliance queries
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON public.consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_email ON public.consent_records(email);
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_type ON public.consent_records(consent_type);
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_given_at ON public.consent_records(consent_given_at);
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_withdrawn_at ON public.consent_records(consent_withdrawn_at);
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_age ON public.consent_records(consent_age_days);

-- Create updated_at trigger
CREATE TRIGGER update_consent_records_updated_at
  BEFORE UPDATE ON public.consent_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consent records
-- Users can view their own consent records
CREATE POLICY "Users can view own consent records" ON public.consent_records
  FOR SELECT USING (
    auth.uid() = user_id OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Users can update their own consent records (for withdrawal)
CREATE POLICY "Users can update own consent records" ON public.consent_records
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Service role can manage all consent records (for system operations)
CREATE POLICY "Service role can manage all consent records" ON public.consent_records
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to calculate consent age
CREATE OR REPLACE FUNCTION public.calculate_consent_age(consent_given_at TIMESTAMPTZ)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF consent_given_at IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN EXTRACT(DAYS FROM (NOW() - consent_given_at))::INTEGER;
END;
$$;

-- Create function to get consent status for a user
CREATE OR REPLACE FUNCTION public.get_user_consent_status(
  p_user_id UUID DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS TABLE (
  consent_type TEXT,
  consent_given BOOLEAN,
  consent_given_at TIMESTAMPTZ,
  consent_withdrawn BOOLEAN,
  consent_withdrawn_at TIMESTAMPTZ,
  consent_age_days INTEGER,
  is_valid BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.consent_type,
    cr.consent_given,
    cr.consent_given_at,
    cr.consent_withdrawn,
    cr.consent_withdrawn_at,
    public.calculate_consent_age(cr.consent_given_at) as consent_age_days,
    -- Consent is valid if given, not withdrawn, and not expired (Switzerland: 2 years max)
    (cr.consent_given = true AND 
     cr.consent_withdrawn = false AND 
     (public.calculate_consent_age(cr.consent_given_at) IS NULL OR public.calculate_consent_age(cr.consent_given_at) < 730)) as is_valid
  FROM public.consent_records cr
  WHERE 
    (p_user_id IS NOT NULL AND cr.user_id = p_user_id) OR
    (p_email IS NOT NULL AND cr.email = p_email)
  ORDER BY cr.consent_given_at DESC;
END;
$$;

-- Create function to check if consent needs renewal (Switzerland FADP: 2 years)
CREATE OR REPLACE FUNCTION public.check_consent_renewal_required(
  p_user_id UUID DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS TABLE (
  consent_type TEXT,
  needs_renewal BOOLEAN,
  days_until_expiry INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.consent_type,
    (public.calculate_consent_age(cr.consent_given_at) >= 600) as needs_renewal, -- 30 days before 2-year expiry
    (730 - public.calculate_consent_age(cr.consent_given_at)) as days_until_expiry
  FROM public.consent_records cr
  WHERE 
    cr.consent_given = true 
    AND cr.consent_withdrawn = false
    AND ((p_user_id IS NOT NULL AND cr.user_id = p_user_id) OR
         (p_email IS NOT NULL AND cr.email = p_email))
    AND public.calculate_consent_age(cr.consent_given_at) < 730; -- Not yet expired
END;
$$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.consent_records TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_consent_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_consent_renewal_required TO authenticated;
GRANT ALL ON public.consent_records TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_consent_status TO service_role;
GRANT EXECUTE ON FUNCTION public.check_consent_renewal_required TO service_role;
