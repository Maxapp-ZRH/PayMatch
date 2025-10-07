-- Add first_name and last_name fields to email_preferences table
-- This allows us to store subscriber names for personalized emails

-- Add first_name and last_name columns
ALTER TABLE public.email_preferences 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.email_preferences.first_name IS 'First name of the email subscriber for personalized communications';
COMMENT ON COLUMN public.email_preferences.last_name IS 'Last name of the email subscriber for personalized communications';

-- Create indexes for performance (optional, for future queries by name)
CREATE INDEX IF NOT EXISTS idx_email_preferences_first_name ON public.email_preferences(first_name);
CREATE INDEX IF NOT EXISTS idx_email_preferences_last_name ON public.email_preferences(last_name);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Added first_name and last_name fields to email_preferences table successfully.';
END $$;
