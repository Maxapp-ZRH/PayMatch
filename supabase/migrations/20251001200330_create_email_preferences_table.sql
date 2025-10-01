-- Create email_preferences table for managing unsubscribe preferences
CREATE TABLE IF NOT EXISTS public.email_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN ('newsletter', 'support', 'transactional')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure unique combination of email and email_type
  UNIQUE(email, email_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_preferences_email ON public.email_preferences(email);
CREATE INDEX IF NOT EXISTS idx_email_preferences_user_id ON public.email_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_preferences_email_type ON public.email_preferences(email_type);
CREATE INDEX IF NOT EXISTS idx_email_preferences_is_active ON public.email_preferences(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_preferences_updated_at
  BEFORE UPDATE ON public.email_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own email preferences
CREATE POLICY "Users can view own email preferences" ON public.email_preferences
  FOR SELECT USING (
    auth.uid() = user_id OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Users can update their own email preferences
CREATE POLICY "Users can update own email preferences" ON public.email_preferences
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Users can insert their own email preferences
CREATE POLICY "Users can insert own email preferences" ON public.email_preferences
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Service role can do everything (for API operations)
CREATE POLICY "Service role can manage all email preferences" ON public.email_preferences
  FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.email_preferences TO authenticated;
GRANT ALL ON public.email_preferences TO service_role;

-- Add table description
COMMENT ON TABLE public.email_preferences IS 'Stores email unsubscribe preferences for different email types';
COMMENT ON COLUMN public.email_preferences.email IS 'Email address';
COMMENT ON COLUMN public.email_preferences.user_id IS 'Associated user ID (optional)';
COMMENT ON COLUMN public.email_preferences.email_type IS 'Type of email: newsletter, support, or transactional';
COMMENT ON COLUMN public.email_preferences.is_active IS 'Whether the user wants to receive this type of email';
COMMENT ON COLUMN public.email_preferences.unsubscribed_at IS 'When the user unsubscribed';
