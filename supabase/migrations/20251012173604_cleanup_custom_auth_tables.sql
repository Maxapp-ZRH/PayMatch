-- Cleanup Custom Auth Tables Migration
-- 
-- This migration removes custom authentication tables that are no longer needed
-- after migrating to Supabase Auth native features.
-- 
-- Tables removed:
-- - pending_registrations: No longer needed with Supabase magic links
-- 
-- Tables kept:
-- - audit_logs: For compliance and security monitoring
-- - email_preferences: For email management
-- - consent_records: For GDPR compliance

-- Remove pending_registrations table (no longer needed with Supabase magic links)
DROP TABLE IF EXISTS public.pending_registrations;

-- Note: Supabase Auth manages its own indexes on auth.users table
-- We don't need to create additional indexes as they're handled by the auth service
