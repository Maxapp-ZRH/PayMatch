-- Add stripe_subscription_id column to organizations table
-- This column stores the Stripe subscription ID for paid plans

ALTER TABLE public.organizations 
ADD COLUMN stripe_subscription_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.organizations.stripe_subscription_id IS 'Stripe subscription ID for paid plans';
