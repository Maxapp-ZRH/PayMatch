-- Setup Cleanup Cron Job Migration
--
-- This migration sets up a cron job to automatically clean up expired
-- pending registrations every 6 hours using the pg_cron extension.
--
-- Schedule: Every 6 hours (0 */6 * * *)
-- Purpose: Remove expired pending registrations that are older than 24 hours
-- Function: cleanup-expired-registrations Edge Function

-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to call the Edge Function
-- This function will be called by the cron job
CREATE OR REPLACE FUNCTION call_cleanup_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response text;
  request_id text;
BEGIN
  -- Log the start of cleanup
  RAISE LOG 'Starting scheduled cleanup of expired pending registrations';
  
  -- Call the Edge Function using http extension
  -- Note: This requires the http extension to be enabled
  -- The function will be called via HTTP to the Edge Function endpoint
  SELECT content INTO response
  FROM http((
    'POST',
    current_setting('app.settings.edge_function_url', true) || '/cleanup-expired-registrations',
    ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true))],
    'application/json',
    '{}'
  ));
  
  -- Log the response
  RAISE LOG 'Cleanup function response: %', response;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors but don't fail the cron job
    RAISE LOG 'Error calling cleanup function: %', SQLERRM;
END;
$$;

-- Alternative approach: Direct cleanup without Edge Function
-- This is more efficient as it doesn't require HTTP calls
CREATE OR REPLACE FUNCTION cleanup_expired_registrations_direct()
RETURNS TABLE(cleaned_count integer, cleaned_emails text[])
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
  deleted_emails text[];
BEGIN
  -- Log the start of cleanup
  RAISE LOG 'Starting direct cleanup of expired pending registrations';
  
  -- Get the emails of records that will be deleted (for logging)
  SELECT array_agg(email) INTO deleted_emails
  FROM pending_registrations
  WHERE expires_at < NOW();
  
  -- Delete expired registrations
  DELETE FROM pending_registrations
  WHERE expires_at < NOW();
  
  -- Get the count of deleted records
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the results
  RAISE LOG 'Cleaned up % expired pending registrations: %', deleted_count, deleted_emails;
  
  -- Return the results
  RETURN QUERY SELECT deleted_count, deleted_emails;
END;
$$;

-- Set up the cron job to run every 6 hours
-- Schedule: 0 0,6,12,18 * * * (every 6 hours at minute 0)
-- We'll use the direct cleanup function for better performance
SELECT cron.schedule(
  'cleanup-expired-registrations',
  '0 0,6,12,18 * * *',
  'SELECT cleanup_expired_registrations_direct();'
);

-- Add a comment explaining the cron job
COMMENT ON FUNCTION cleanup_expired_registrations_direct() IS 
'Direct cleanup function for expired pending registrations. Called by cron job every 6 hours.';

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_registrations_direct() TO service_role;
GRANT EXECUTE ON FUNCTION call_cleanup_function() TO service_role;

-- Log the setup completion
DO $$
BEGIN
  RAISE LOG 'Cron job setup completed. Cleanup will run every 6 hours.';
END;
$$;
