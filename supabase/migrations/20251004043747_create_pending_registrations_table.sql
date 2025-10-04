/**
 * Create Pending Registrations Table
 * 
 * Stores temporary registration data until email verification is complete.
 * This allows us to create Supabase users only after email verification.
 */

-- Create pending registrations table
CREATE TABLE IF NOT EXISTS public.pending_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  user_metadata JSONB DEFAULT '{}',
  verification_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_pending_registrations_email ON public.pending_registrations(email);
CREATE INDEX IF NOT EXISTS idx_pending_registrations_token ON public.pending_registrations(verification_token);
CREATE INDEX IF NOT EXISTS idx_pending_registrations_expires_at ON public.pending_registrations(expires_at);

-- Add updated_at trigger
CREATE TRIGGER update_pending_registrations_updated_at
  BEFORE UPDATE ON public.pending_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.pending_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Service role can manage all pending registrations
CREATE POLICY "Service role can manage pending registrations" ON public.pending_registrations
  FOR ALL USING (auth.role() = 'service_role');

-- Add table and column descriptions
COMMENT ON TABLE public.pending_registrations IS 'Temporary storage for user registration data before email verification';
COMMENT ON COLUMN public.pending_registrations.email IS 'User email address (must be unique)';
COMMENT ON COLUMN public.pending_registrations.password_hash IS 'Hashed password for the user';
COMMENT ON COLUMN public.pending_registrations.first_name IS 'User first name';
COMMENT ON COLUMN public.pending_registrations.last_name IS 'User last name';
COMMENT ON COLUMN public.pending_registrations.user_metadata IS 'Additional user metadata (language, etc.)';
COMMENT ON COLUMN public.pending_registrations.verification_token IS 'Unique token for email verification';
COMMENT ON COLUMN public.pending_registrations.expires_at IS 'When the registration expires (typically 24 hours)';
