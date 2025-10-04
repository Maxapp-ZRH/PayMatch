-- Remove unused call_cleanup_function
-- This function was redundant as we use the direct database function for cron jobs

DROP FUNCTION IF EXISTS call_cleanup_function();
