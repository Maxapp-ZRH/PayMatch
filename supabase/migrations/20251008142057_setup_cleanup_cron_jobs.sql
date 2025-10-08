-- Setup Comprehensive Cleanup Cron Jobs
--
-- This migration sets up cron jobs for all cleanup functions:
-- 1. Expired registrations cleanup (already exists, but we'll verify)
-- 2. Audit logs cleanup (new)
-- 3. Session cleanup (new)
--
-- All functions use direct database operations for better performance
-- rather than HTTP calls to edge functions.

-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- =============================================================================
-- 1. AUDIT LOGS CLEANUP FUNCTION
-- =============================================================================

-- Create a direct cleanup function for audit logs (more efficient than edge function)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs_direct()
RETURNS TABLE(cleaned_count integer, cleaned_date_range text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
  oldest_date text;
  newest_date text;
BEGIN
  -- Log the start of cleanup
  RAISE LOG 'Starting direct cleanup of old audit logs';
  
  -- Get the date range of records that will be deleted (for logging)
  SELECT 
    MIN(created_at)::text,
    MAX(created_at)::text
  INTO oldest_date, newest_date
  FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Delete audit logs older than 1 year
  DELETE FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Get the count of deleted records
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the results
  RAISE LOG 'Cleaned up % old audit log entries (date range: % to %)', 
    deleted_count, oldest_date, newest_date;
  
  -- Log the cleanup action in audit logs (if any logs remain)
  IF deleted_count > 0 THEN
    INSERT INTO audit_logs (
      action,
      resource_type,
      details,
      status,
      created_at
    ) VALUES (
      'audit_cleanup',
      'audit_logs',
      jsonb_build_object(
        'deleted_count', deleted_count,
        'date_range', jsonb_build_object('oldest', oldest_date, 'newest', newest_date)
      ),
      'success',
      NOW()
    );
  END IF;
  
  -- Return the results
  RETURN QUERY SELECT deleted_count, COALESCE(oldest_date || ' to ' || newest_date, 'No records found');
END;
$$;

-- =============================================================================
-- 2. SESSION CLEANUP FUNCTION
-- =============================================================================

-- Create a function to clean up expired session data
-- Note: This is mainly for logging since Redis TTL handles cleanup automatically
CREATE OR REPLACE FUNCTION cleanup_expired_sessions_direct()
RETURNS TABLE(cleaned_count integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer := 0;
  cleanup_message text;
BEGIN
  -- Log the start of cleanup
  RAISE LOG 'Starting session cleanup (Redis TTL handles automatic cleanup)';
  
  -- Since Redis TTL handles session cleanup automatically,
  -- this function mainly logs the operation and provides monitoring
  cleanup_message := 'Session cleanup completed - Redis TTL handles automatic cleanup';
  
  -- Log the cleanup operation in audit logs
  INSERT INTO audit_logs (
    action,
    resource_type,
    details,
    status,
    created_at
  ) VALUES (
    'session_cleanup',
    'session',
    jsonb_build_object(
      'message', cleanup_message,
      'redis_ttl_handled', true
    ),
    'success',
    NOW()
  );
  
  -- Return the results
  RETURN QUERY SELECT deleted_count, cleanup_message;
END;
$$;

-- =============================================================================
-- 3. COMPREHENSIVE CLEANUP FUNCTION
-- =============================================================================

-- Create a master cleanup function that runs all cleanup operations
CREATE OR REPLACE FUNCTION run_all_cleanup_operations()
RETURNS TABLE(
  operation text,
  cleaned_count integer,
  details text,
  success boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reg_result record;
  audit_result record;
  session_result record;
BEGIN
  -- Log the start of comprehensive cleanup
  RAISE LOG 'Starting comprehensive cleanup operations';
  
  -- 1. Clean up expired registrations
  BEGIN
    SELECT * INTO reg_result FROM cleanup_expired_registrations_direct();
    RETURN QUERY SELECT 
      'expired_registrations'::text,
      reg_result.cleaned_count,
      'Cleaned ' || reg_result.cleaned_count || ' expired registrations'::text,
      true;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 
        'expired_registrations'::text,
        0,
        'Error: ' || SQLERRM::text,
        false;
  END;
  
  -- 2. Clean up old audit logs
  BEGIN
    SELECT * INTO audit_result FROM cleanup_old_audit_logs_direct();
    RETURN QUERY SELECT 
      'audit_logs'::text,
      audit_result.cleaned_count,
      audit_result.cleaned_date_range,
      true;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 
        'audit_logs'::text,
        0,
        'Error: ' || SQLERRM::text,
        false;
  END;
  
  -- 3. Clean up sessions
  BEGIN
    SELECT * INTO session_result FROM cleanup_expired_sessions_direct();
    RETURN QUERY SELECT 
      'sessions'::text,
      session_result.cleaned_count,
      session_result.message,
      true;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 
        'sessions'::text,
        0,
        'Error: ' || SQLERRM::text,
        false;
  END;
  
  -- Log completion
  RAISE LOG 'Comprehensive cleanup operations completed';
END;
$$;

-- =============================================================================
-- 4. SET UP CRON JOBS
-- =============================================================================

-- Remove any existing cron jobs with the same names to avoid duplicates
SELECT cron.unschedule('cleanup-expired-registrations') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'cleanup-expired-registrations'
);

SELECT cron.unschedule('cleanup-audit-logs') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'cleanup-audit-logs'
);

SELECT cron.unschedule('cleanup-sessions') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'cleanup-sessions'
);

SELECT cron.unschedule('comprehensive-cleanup') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'comprehensive-cleanup'
);

-- 1. Expired registrations cleanup - every 6 hours
SELECT cron.schedule(
  'cleanup-expired-registrations',
  '0 0,6,12,18 * * *', -- Every 6 hours at minute 0
  'SELECT cleanup_expired_registrations_direct();'
);

-- 2. Audit logs cleanup - daily at 2 AM
SELECT cron.schedule(
  'cleanup-audit-logs',
  '0 2 * * *', -- Daily at 2 AM
  'SELECT cleanup_old_audit_logs_direct();'
);

-- 3. Session cleanup - every 4 hours
SELECT cron.schedule(
  'cleanup-sessions',
  '0 */4 * * *', -- Every 4 hours
  'SELECT cleanup_expired_sessions_direct();'
);

-- 4. Comprehensive cleanup - weekly on Sunday at 3 AM
SELECT cron.schedule(
  'comprehensive-cleanup',
  '0 3 * * 0', -- Weekly on Sunday at 3 AM
  'SELECT run_all_cleanup_operations();'
);

-- =============================================================================
-- 5. GRANT PERMISSIONS
-- =============================================================================

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION cleanup_old_audit_logs_direct() TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions_direct() TO service_role;
GRANT EXECUTE ON FUNCTION run_all_cleanup_operations() TO service_role;

-- =============================================================================
-- 6. ADD COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON FUNCTION cleanup_old_audit_logs_direct() IS 
'Direct cleanup function for old audit logs. Removes logs older than 1 year. Called by cron job daily at 2 AM.';

COMMENT ON FUNCTION cleanup_expired_sessions_direct() IS 
'Session cleanup function. Logs cleanup operations since Redis TTL handles automatic cleanup. Called by cron job every 4 hours.';

COMMENT ON FUNCTION run_all_cleanup_operations() IS 
'Master cleanup function that runs all cleanup operations. Called by cron job weekly on Sunday at 3 AM.';

-- =============================================================================
-- 7. LOG SETUP COMPLETION
-- =============================================================================

DO $$
BEGIN
  RAISE LOG 'Comprehensive cron job setup completed:';
  RAISE LOG '- Expired registrations cleanup: every 6 hours';
  RAISE LOG '- Audit logs cleanup: daily at 2 AM';
  RAISE LOG '- Session cleanup: every 4 hours';
  RAISE LOG '- Comprehensive cleanup: weekly on Sunday at 3 AM';
END;
$$;
