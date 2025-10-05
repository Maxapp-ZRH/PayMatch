-- Core Authentication and Organization Schema
-- This migration creates the foundational tables for PayMatch's organization-based model

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (single source of truth for business entities)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  legal_name TEXT,
  country TEXT DEFAULT 'CH',
  canton TEXT,
  city TEXT,
  zip TEXT,
  street TEXT,
  vat_number TEXT,
  uid TEXT, -- Swiss business ID
  logo_url TEXT,
  default_language TEXT DEFAULT 'de',
  default_currency TEXT DEFAULT 'CHF',
  default_vat_rates JSONB DEFAULT '[]'::jsonb,
  default_payment_terms_days INT DEFAULT 30,
  iban TEXT,
  qr_iban TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'freelancer', 'business', 'enterprise')),
  stripe_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Organization membership table (users can belong to multiple orgs)
CREATE TABLE IF NOT EXISTS public.organization_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'accountant', 'staff')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- User checklist progress (for onboarding)
CREATE TABLE IF NOT EXISTS public.user_checklist_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  checklist_item_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add table descriptions
COMMENT ON TABLE public.organizations IS 'Business entities using PayMatch - single source of truth for all business data';
COMMENT ON TABLE public.user_profiles IS 'Extended user profiles beyond auth.users';
COMMENT ON TABLE public.organization_users IS 'Many-to-many relationship between users and organizations with roles';
COMMENT ON TABLE public.user_checklist_progress IS 'Tracks onboarding checklist completion progress';

-- Add column descriptions for organizations
COMMENT ON COLUMN public.organizations.name IS 'Display name of the organization';
COMMENT ON COLUMN public.organizations.legal_name IS 'Legal/registered name of the organization';
COMMENT ON COLUMN public.organizations.country IS 'Country code (default: CH for Switzerland)';
COMMENT ON COLUMN public.organizations.canton IS 'Swiss canton code';
COMMENT ON COLUMN public.organizations.vat_number IS 'Swiss VAT number (CHE-XXX.XXX.XXX format)';
COMMENT ON COLUMN public.organizations.uid IS 'Swiss business identifier';
COMMENT ON COLUMN public.organizations.iban IS 'Primary IBAN for payments';
COMMENT ON COLUMN public.organizations.qr_iban IS 'QR-IBAN for Swiss QR-bill';
COMMENT ON COLUMN public.organizations.plan IS 'Current subscription plan';
COMMENT ON COLUMN public.organizations.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN public.organizations.onboarding_completed IS 'Whether onboarding wizard is completed';
COMMENT ON COLUMN public.organizations.onboarding_step IS 'Current step in onboarding process';

-- Add column descriptions for organization_users
COMMENT ON COLUMN public.organization_users.role IS 'User role within the organization';
COMMENT ON COLUMN public.organization_users.status IS 'Membership status (active, pending, suspended)';
COMMENT ON COLUMN public.organization_users.invited_by IS 'User who sent the invitation';
COMMENT ON COLUMN public.organization_users.invited_at IS 'When the invitation was sent';
COMMENT ON COLUMN public.organization_users.accepted_at IS 'When the invitation was accepted';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_plan ON public.organizations(plan);
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer_id ON public.organizations(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_organization_users_org_id ON public.organization_users(org_id);
CREATE INDEX IF NOT EXISTS idx_organization_users_user_id ON public.organization_users(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_users_status ON public.organization_users(status);
CREATE INDEX IF NOT EXISTS idx_user_checklist_progress_user_id ON public.user_checklist_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_checklist_progress_org_id ON public.user_checklist_progress(org_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_users_updated_at
  BEFORE UPDATE ON public.organization_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_checklist_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
-- Users can read organizations they belong to
CREATE POLICY "Users can read their organizations" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM public.organization_users 
      WHERE user_id = (SELECT auth.uid()) AND status = 'active'
    )
  );

-- Users can update organizations they own or admin
CREATE POLICY "Owners and admins can update organizations" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT org_id FROM public.organization_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND status = 'active' 
      AND role IN ('owner', 'admin')
    )
  );

-- Service role can manage all organizations
CREATE POLICY "Service role can manage organizations" ON public.organizations
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for user_profiles
-- Users can read and update their own profile
CREATE POLICY "Users can manage own profile" ON public.user_profiles
  FOR ALL USING (id = (SELECT auth.uid()));

-- Service role can manage all profiles
CREATE POLICY "Service role can manage profiles" ON public.user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for organization_users
-- Users can read organization_users for their organizations
CREATE POLICY "Users can read org memberships" ON public.organization_users
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.organization_users 
      WHERE user_id = (SELECT auth.uid()) AND status = 'active'
    )
  );

-- Owners and admins can manage memberships
CREATE POLICY "Owners and admins can manage memberships" ON public.organization_users
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM public.organization_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND status = 'active' 
      AND role IN ('owner', 'admin')
    )
  );

-- Service role can manage all memberships
CREATE POLICY "Service role can manage memberships" ON public.organization_users
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for user_checklist_progress
-- Users can manage their own checklist progress
CREATE POLICY "Users can manage own checklist progress" ON public.user_checklist_progress
  FOR ALL USING (user_id = (SELECT auth.uid()));

-- Service role can manage all checklist progress
CREATE POLICY "Service role can manage checklist progress" ON public.user_checklist_progress
  FOR ALL USING (auth.role() = 'service_role');

-- Function to create organization for new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));

  -- Create default organization for the user
  INSERT INTO public.organizations (name, default_language)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', 'My Organization'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'de')
  )
  RETURNING id INTO new_org_id;

  -- Add user as owner of the organization
  INSERT INTO public.organization_users (org_id, user_id, role, status, accepted_at)
  VALUES (new_org_id, NEW.id, 'owner', 'active', NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create organization for new users
-- DISABLED - We'll create organizations after email verification
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user's organizations
CREATE OR REPLACE FUNCTION public.get_user_organizations(user_uuid UUID)
RETURNS TABLE (
  org_id UUID,
  org_name TEXT,
  role TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as org_id,
    o.name as org_name,
    ou.role,
    ou.status
  FROM public.organizations o
  JOIN public.organization_users ou ON o.id = ou.org_id
  WHERE ou.user_id = user_uuid AND ou.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to organization
CREATE OR REPLACE FUNCTION public.user_has_org_access(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_users
    WHERE user_id = user_uuid 
    AND org_id = org_uuid 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
