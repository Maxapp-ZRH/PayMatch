-- Add missing organization fields for email integration
-- This migration adds owner_email and ensures address_line_1/address_line_2 exist

-- Add owner_email field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'organizations' 
        AND column_name = 'owner_email'
    ) THEN
        ALTER TABLE "public"."organizations" ADD COLUMN "owner_email" text NULL;
    END IF;
END $$;

-- Add address_line_1 field if it doesn't exist (should exist from previous migration)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'organizations' 
        AND column_name = 'address_line_1'
    ) THEN
        ALTER TABLE "public"."organizations" ADD COLUMN "address_line_1" text NULL;
    END IF;
END $$;

-- Add address_line_2 field if it doesn't exist (should exist from previous migration)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'organizations' 
        AND column_name = 'address_line_2'
    ) THEN
        ALTER TABLE "public"."organizations" ADD COLUMN "address_line_2" text NULL;
    END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS organizations_owner_email_idx ON public.organizations USING btree (owner_email);

-- Add comments for documentation
COMMENT ON COLUMN "public"."organizations"."owner_email" IS 'Email address of the organization owner for business notifications and GDPR compliance.';
