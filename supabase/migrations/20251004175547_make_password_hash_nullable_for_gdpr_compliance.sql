-- Make password_hash nullable for GDPR compliance
-- We no longer store plain text passwords in pending registrations

-- Update the column to allow NULL values
ALTER TABLE public.pending_registrations 
ALTER COLUMN password_hash DROP NOT NULL;

-- Add a comment explaining the GDPR compliance change
COMMENT ON COLUMN public.pending_registrations.password_hash IS 
'Password hash field - NULL for GDPR compliance. Passwords are collected during email verification and stored only in Supabase Auth with proper hashing.';

-- Update existing records to set password_hash to NULL for GDPR compliance
UPDATE public.pending_registrations 
SET password_hash = NULL 
WHERE password_hash IS NOT NULL;

-- Add a comment to the table explaining the GDPR compliance approach
COMMENT ON TABLE public.pending_registrations IS 
'Pending user registrations - GDPR compliant. Stores only essential verification data without passwords. Passwords are collected during email verification and stored securely in Supabase Auth.';
