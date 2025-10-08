/**
 * Create Audit Logs Table
 * 
 * Stores comprehensive audit logs for authentication and user activities.
 * Essential for compliance, security monitoring, and debugging.
 */

-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  ip_address INET,
  user_agent TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'error')),
  error_message TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_email ON public.audit_logs(email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON public.audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON public.audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_session_id ON public.audit_logs(session_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON public.audit_logs(user_id, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_action ON public.audit_logs(ip_address, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_email_action ON public.audit_logs(email, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_status ON public.audit_logs(created_at, status);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Service role can manage all audit logs
CREATE POLICY "Service role can manage audit logs" ON public.audit_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Users can view their own audit logs (for transparency)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Add table and column descriptions
COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit logs for authentication and user activities';
COMMENT ON COLUMN public.audit_logs.user_id IS 'User ID (null for anonymous actions)';
COMMENT ON COLUMN public.audit_logs.email IS 'Email address associated with the action';
COMMENT ON COLUMN public.audit_logs.ip_address IS 'IP address of the client';
COMMENT ON COLUMN public.audit_logs.user_agent IS 'User agent string from the client';
COMMENT ON COLUMN public.audit_logs.action IS 'Action performed (login, register, password_reset, etc.)';
COMMENT ON COLUMN public.audit_logs.resource_type IS 'Type of resource affected (user, organization, etc.)';
COMMENT ON COLUMN public.audit_logs.resource_id IS 'ID of the resource affected';
COMMENT ON COLUMN public.audit_logs.details IS 'Additional details about the action';
COMMENT ON COLUMN public.audit_logs.status IS 'Status of the action (success, failure, error)';
COMMENT ON COLUMN public.audit_logs.error_message IS 'Error message if action failed';
COMMENT ON COLUMN public.audit_logs.session_id IS 'Session ID for tracking user sessions';

-- Create a function to automatically clean up old audit logs
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete audit logs older than 1 year
  DELETE FROM public.audit_logs 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Log the cleanup action
  INSERT INTO public.audit_logs (
    action,
    resource_type,
    details,
    status,
    created_at
  ) VALUES (
    'audit_cleanup',
    'audit_logs',
    jsonb_build_object('deleted_count', ROW_COUNT),
    'success',
    NOW()
  );
END;
$$;
