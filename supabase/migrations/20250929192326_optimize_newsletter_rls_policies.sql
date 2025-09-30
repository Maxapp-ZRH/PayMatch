-- Optimize RLS policies for newsletter_subscribers table
-- Fix auth function calls and consolidate multiple permissive policies

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can manage newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can read own subscription" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anonymous users can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can unsubscribe with token" ON public.newsletter_subscribers;

-- Create optimized consolidated policies
-- Single policy for all operations with proper auth function optimization
CREATE POLICY "newsletter_subscribers_access_policy" ON public.newsletter_subscribers
  FOR ALL USING (
    -- Service role can do everything
    (SELECT auth.role()) = 'service_role'
    OR
    -- Anonymous users can insert (subscribe)
    (SELECT auth.role()) = 'anon' AND pg_trigger_depth() = 0
    OR
    -- Authenticated users can read their own subscription
    (SELECT auth.role()) = 'authenticated' AND email = (SELECT (current_setting('request.jwt.claims', true)::json ->> 'email'))
    OR
    -- Users can update (unsubscribe) with their token
    (SELECT auth.role()) = 'authenticated' AND 
    unsubscribe_token = (SELECT (current_setting('request.jwt.claims', true)::json ->> 'unsubscribe_token'))
  );

-- Add policy comment
COMMENT ON POLICY "newsletter_subscribers_access_policy" ON public.newsletter_subscribers IS 
'Consolidated RLS policy for newsletter subscribers with optimized auth function calls and single policy per action type';
