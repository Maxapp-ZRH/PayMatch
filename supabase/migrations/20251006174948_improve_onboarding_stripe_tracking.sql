-- Improve Onboarding and Stripe Tracking
-- This migration adds constraints, indexes, and additional fields for better onboarding flow and Stripe integration tracking

-- Add constraints for onboarding step validation
ALTER TABLE organizations 
ADD CONSTRAINT check_onboarding_step 
CHECK (onboarding_step >= 1 AND onboarding_step <= 4);

-- Add constraint for plan validation
ALTER TABLE organizations 
ADD CONSTRAINT check_plan_valid 
CHECK (plan IN ('free', 'freelancer', 'business', 'enterprise'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_onboarding_step 
ON organizations(onboarding_step);

CREATE INDEX IF NOT EXISTS idx_organizations_onboarding_completed 
ON organizations(onboarding_completed) 
WHERE onboarding_completed = true;

CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer 
ON organizations(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_organizations_stripe_subscription 
ON organizations(stripe_subscription_id) 
WHERE stripe_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_organizations_plan 
ON organizations(plan);

-- Add additional fields for better Stripe integration tracking
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS stripe_subscription_status TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_method_type TEXT,
ADD COLUMN IF NOT EXISTS billing_email TEXT,
ADD COLUMN IF NOT EXISTS billing_address JSONB,
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE;

-- Add comments for documentation
COMMENT ON COLUMN organizations.onboarding_step IS 'Current step in onboarding process (1=plan-selection, 2=company-details, 3=settings, 4=success)';
COMMENT ON COLUMN organizations.onboarding_completed IS 'Whether the organization has completed the onboarding process';
COMMENT ON COLUMN organizations.plan IS 'Current subscription plan (free, freelancer, business, enterprise)';
COMMENT ON COLUMN organizations.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN organizations.stripe_subscription_id IS 'Stripe subscription ID for active subscription';
COMMENT ON COLUMN organizations.stripe_subscription_status IS 'Current status of Stripe subscription (active, canceled, etc.)';
COMMENT ON COLUMN organizations.stripe_subscription_current_period_end IS 'End date of current billing period';
COMMENT ON COLUMN organizations.stripe_payment_method_id IS 'ID of the default payment method';
COMMENT ON COLUMN organizations.stripe_payment_method_type IS 'Type of payment method (card, sepa_debit, etc.)';
COMMENT ON COLUMN organizations.billing_email IS 'Email address for billing notifications';
COMMENT ON COLUMN organizations.billing_address IS 'Billing address information as JSON';
COMMENT ON COLUMN organizations.last_payment_date IS 'Date of last successful payment';
COMMENT ON COLUMN organizations.subscription_start_date IS 'Date when subscription was first created';

-- Create a function to update onboarding step with validation
CREATE OR REPLACE FUNCTION update_onboarding_step(
  org_id UUID,
  new_step INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  -- Validate step range
  IF new_step < 1 OR new_step > 4 THEN
    RAISE EXCEPTION 'Invalid onboarding step: %', new_step;
  END IF;
  
  -- Update the step
  UPDATE organizations 
  SET 
    onboarding_step = new_step,
    updated_at = NOW()
  WHERE id = org_id;
  
  -- Return true if row was updated
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to complete onboarding
CREATE OR REPLACE FUNCTION complete_onboarding(
  org_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  -- Mark onboarding as completed
  UPDATE organizations 
  SET 
    onboarding_completed = true,
    onboarding_step = 4,
    updated_at = NOW()
  WHERE id = org_id;
  
  -- Return true if row was updated
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update Stripe subscription info
CREATE OR REPLACE FUNCTION update_stripe_subscription(
  org_id UUID,
  subscription_id TEXT,
  subscription_status TEXT DEFAULT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  payment_method_id TEXT DEFAULT NULL,
  payment_method_type TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Update Stripe subscription information
  UPDATE organizations 
  SET 
    stripe_subscription_id = subscription_id,
    stripe_subscription_status = COALESCE(subscription_status, stripe_subscription_status),
    stripe_subscription_current_period_end = COALESCE(current_period_end, stripe_subscription_current_period_end),
    stripe_payment_method_id = COALESCE(payment_method_id, stripe_payment_method_id),
    stripe_payment_method_type = COALESCE(payment_method_type, stripe_payment_method_type),
    updated_at = NOW()
  WHERE id = org_id;
  
  -- Return true if row was updated
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_onboarding_step(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_onboarding(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_stripe_subscription(UUID, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, TEXT, TEXT) TO authenticated;

-- Grant execute permissions to service role for webhooks
GRANT EXECUTE ON FUNCTION update_onboarding_step(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION complete_onboarding(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION update_stripe_subscription(UUID, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, TEXT, TEXT) TO service_role;
