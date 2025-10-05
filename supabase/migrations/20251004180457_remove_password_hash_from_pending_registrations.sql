-- Remove password_hash column from pending_registrations table
-- This column is no longer needed since we don't store passwords in pending registrations
-- for GDPR compliance

-- Drop the password_hash column
ALTER TABLE public.pending_registrations 
DROP COLUMN IF EXISTS password_hash;

-- Add comment to document the change
COMMENT ON TABLE public.pending_registrations IS 'Stores pending user registrations before email verification. No passwords stored for GDPR compliance.';
