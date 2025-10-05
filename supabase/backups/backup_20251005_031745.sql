


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_user_organizations"("user_uuid" "uuid") RETURNS TABLE("org_id" "uuid", "org_name" "text", "role" "text", "status" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."get_user_organizations"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_email_verification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  new_org_id UUID;
  user_name TEXT;
  user_language TEXT;
BEGIN
  -- Only proceed if email_confirmed_at changed from NULL to a timestamp
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    
    -- Check if user already has an organization FIRST
    -- This prevents any organization creation if user already has one
    IF EXISTS (
      SELECT 1 FROM public.organization_users 
      WHERE user_id = NEW.id AND status = 'active'
    ) THEN
      -- User already has an organization, just update profile and return
      UPDATE public.user_profiles 
      SET 
        name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        updated_at = NOW()
      WHERE id = NEW.id;
      
      RETURN NEW;
    END IF;

    -- Extract user name and language from metadata
    user_name := COALESCE(
      NEW.raw_user_meta_data->>'name',
      CONCAT(
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        ' ',
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      ),
      NEW.email
    );
    
    user_language := COALESCE(NEW.raw_user_meta_data->>'language', 'de');

    -- Create user profile if it doesn't exist
    INSERT INTO public.user_profiles (id, name, created_at, updated_at)
    VALUES (NEW.id, user_name, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      updated_at = NOW();

    -- Create default organization for the user
    INSERT INTO public.organizations (
      name, 
      default_language, 
      plan, 
      onboarding_completed, 
      onboarding_step,
      created_at,
      updated_at
    )
    VALUES (
      CONCAT(user_name, '''s Organization'),
      user_language,
      'free',
      false,
      1,
      NOW(),
      NOW()
    )
    RETURNING id INTO new_org_id;

    -- Add user as owner of the organization
    INSERT INTO public.organization_users (
      org_id, 
      user_id, 
      role, 
      status, 
      accepted_at,
      created_at,
      updated_at
    )
    VALUES (
      new_org_id, 
      NEW.id, 
      'owner', 
      'active', 
      NOW(),
      NOW(),
      NOW()
    );

  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_email_verification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_updated_at_column"() IS 'Trigger function to automatically update the updated_at column when a record is modified';



CREATE OR REPLACE FUNCTION "public"."user_has_org_access"("user_uuid" "uuid", "org_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_users
    WHERE user_id = user_uuid 
    AND org_id = org_uuid 
    AND status = 'active'
  );
END;
$$;


ALTER FUNCTION "public"."user_has_org_access"("user_uuid" "uuid", "org_uuid" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."email_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "user_id" "uuid",
    "email_type" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "unsubscribed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "email_preferences_email_type_check" CHECK (("email_type" = ANY (ARRAY['newsletter'::"text", 'support'::"text", 'transactional'::"text"])))
);


ALTER TABLE "public"."email_preferences" OWNER TO "postgres";


COMMENT ON TABLE "public"."email_preferences" IS 'Stores email unsubscribe preferences for different email types';



COMMENT ON COLUMN "public"."email_preferences"."email" IS 'Email address';



COMMENT ON COLUMN "public"."email_preferences"."user_id" IS 'Associated user ID (optional)';



COMMENT ON COLUMN "public"."email_preferences"."email_type" IS 'Type of email: newsletter, support, or transactional';



COMMENT ON COLUMN "public"."email_preferences"."is_active" IS 'Whether the user wants to receive this type of email';



COMMENT ON COLUMN "public"."email_preferences"."unsubscribed_at" IS 'When the user unsubscribed';



CREATE TABLE IF NOT EXISTS "public"."newsletter_subscribers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "subscribed_at" timestamp with time zone DEFAULT "now"(),
    "unsubscribed_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "unsubscribe_token" "text" DEFAULT ("gen_random_uuid"())::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."newsletter_subscribers" OWNER TO "postgres";


COMMENT ON TABLE "public"."newsletter_subscribers" IS 'Newsletter subscribers with unsubscribe functionality';



COMMENT ON COLUMN "public"."newsletter_subscribers"."first_name" IS 'Subscriber first name';



COMMENT ON COLUMN "public"."newsletter_subscribers"."last_name" IS 'Subscriber last name';



COMMENT ON COLUMN "public"."newsletter_subscribers"."email" IS 'Subscriber email address (unique)';



COMMENT ON COLUMN "public"."newsletter_subscribers"."subscribed_at" IS 'When the user subscribed to the newsletter';



COMMENT ON COLUMN "public"."newsletter_subscribers"."unsubscribed_at" IS 'When the user unsubscribed (if applicable)';



COMMENT ON COLUMN "public"."newsletter_subscribers"."is_active" IS 'Whether the subscription is currently active';



COMMENT ON COLUMN "public"."newsletter_subscribers"."unsubscribe_token" IS 'Unique token for unsubscribe links';



COMMENT ON COLUMN "public"."newsletter_subscribers"."created_at" IS 'Record creation timestamp';



COMMENT ON COLUMN "public"."newsletter_subscribers"."updated_at" IS 'Record last update timestamp';



CREATE TABLE IF NOT EXISTS "public"."organization_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "org_id" "uuid",
    "user_id" "uuid",
    "role" "text" DEFAULT 'owner'::"text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "invited_by" "uuid",
    "invited_at" timestamp with time zone,
    "accepted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "organization_users_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'accountant'::"text", 'staff'::"text"]))),
    CONSTRAINT "organization_users_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'pending'::"text", 'suspended'::"text"])))
);


ALTER TABLE "public"."organization_users" OWNER TO "postgres";


COMMENT ON TABLE "public"."organization_users" IS 'Many-to-many relationship between users and organizations with roles';



COMMENT ON COLUMN "public"."organization_users"."role" IS 'User role within the organization';



COMMENT ON COLUMN "public"."organization_users"."status" IS 'Membership status (active, pending, suspended)';



COMMENT ON COLUMN "public"."organization_users"."invited_by" IS 'User who sent the invitation';



COMMENT ON COLUMN "public"."organization_users"."invited_at" IS 'When the invitation was sent';



COMMENT ON COLUMN "public"."organization_users"."accepted_at" IS 'When the invitation was accepted';



CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "legal_name" "text",
    "country" "text" DEFAULT 'CH'::"text",
    "canton" "text",
    "city" "text",
    "zip" "text",
    "street" "text",
    "vat_number" "text",
    "uid" "text",
    "logo_url" "text",
    "default_language" "text" DEFAULT 'de'::"text",
    "default_currency" "text" DEFAULT 'CHF'::"text",
    "default_vat_rates" "jsonb" DEFAULT '[]'::"jsonb",
    "default_payment_terms_days" integer DEFAULT 30,
    "iban" "text",
    "qr_iban" "text",
    "plan" "text" DEFAULT 'free'::"text",
    "stripe_customer_id" "text",
    "onboarding_completed" boolean DEFAULT false,
    "onboarding_step" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "organizations_plan_check" CHECK (("plan" = ANY (ARRAY['free'::"text", 'freelancer'::"text", 'business'::"text", 'enterprise'::"text"])))
);


ALTER TABLE "public"."organizations" OWNER TO "postgres";


COMMENT ON TABLE "public"."organizations" IS 'Business entities using PayMatch - single source of truth for all business data';



COMMENT ON COLUMN "public"."organizations"."name" IS 'Display name of the organization';



COMMENT ON COLUMN "public"."organizations"."legal_name" IS 'Legal/registered name of the organization';



COMMENT ON COLUMN "public"."organizations"."country" IS 'Country code (default: CH for Switzerland)';



COMMENT ON COLUMN "public"."organizations"."canton" IS 'Swiss canton code';



COMMENT ON COLUMN "public"."organizations"."vat_number" IS 'Swiss VAT number (CHE-XXX.XXX.XXX format)';



COMMENT ON COLUMN "public"."organizations"."uid" IS 'Swiss business identifier';



COMMENT ON COLUMN "public"."organizations"."iban" IS 'Primary IBAN for payments';



COMMENT ON COLUMN "public"."organizations"."qr_iban" IS 'QR-IBAN for Swiss QR-bill';



COMMENT ON COLUMN "public"."organizations"."plan" IS 'Current subscription plan';



COMMENT ON COLUMN "public"."organizations"."stripe_customer_id" IS 'Stripe customer ID for billing';



COMMENT ON COLUMN "public"."organizations"."onboarding_completed" IS 'Whether onboarding wizard is completed';



COMMENT ON COLUMN "public"."organizations"."onboarding_step" IS 'Current step in onboarding process';



CREATE TABLE IF NOT EXISTS "public"."user_checklist_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "org_id" "uuid",
    "checklist_item_id" "text" NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_checklist_progress" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_checklist_progress" IS 'Tracks onboarding checklist completion progress';



CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "onboarding_completed" boolean DEFAULT false NOT NULL,
    "onboarding_completed_at" timestamp with time zone
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_profiles" IS 'Extended user profiles beyond auth.users';



COMMENT ON COLUMN "public"."user_profiles"."onboarding_completed" IS 'Tracks whether the user has completed the onboarding process';



COMMENT ON COLUMN "public"."user_profiles"."onboarding_completed_at" IS 'Timestamp when the user completed onboarding';



ALTER TABLE ONLY "public"."email_preferences"
    ADD CONSTRAINT "email_preferences_email_email_type_key" UNIQUE ("email", "email_type");



ALTER TABLE ONLY "public"."email_preferences"
    ADD CONSTRAINT "email_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_unsubscribe_token_key" UNIQUE ("unsubscribe_token");



ALTER TABLE ONLY "public"."organization_users"
    ADD CONSTRAINT "organization_users_org_id_user_id_key" UNIQUE ("org_id", "user_id");



ALTER TABLE ONLY "public"."organization_users"
    ADD CONSTRAINT "organization_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_checklist_progress"
    ADD CONSTRAINT "user_checklist_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_email_preferences_email" ON "public"."email_preferences" USING "btree" ("email");



CREATE INDEX "idx_email_preferences_email_type" ON "public"."email_preferences" USING "btree" ("email_type");



CREATE INDEX "idx_email_preferences_is_active" ON "public"."email_preferences" USING "btree" ("is_active");



CREATE INDEX "idx_email_preferences_user_id" ON "public"."email_preferences" USING "btree" ("user_id");



CREATE INDEX "idx_newsletter_subscribers_email" ON "public"."newsletter_subscribers" USING "btree" ("email");



CREATE INDEX "idx_newsletter_subscribers_is_active" ON "public"."newsletter_subscribers" USING "btree" ("is_active");



CREATE INDEX "idx_newsletter_subscribers_unsubscribe_token" ON "public"."newsletter_subscribers" USING "btree" ("unsubscribe_token");



CREATE INDEX "idx_organization_users_org_id" ON "public"."organization_users" USING "btree" ("org_id");



CREATE INDEX "idx_organization_users_status" ON "public"."organization_users" USING "btree" ("status");



CREATE INDEX "idx_organization_users_user_id" ON "public"."organization_users" USING "btree" ("user_id");



CREATE INDEX "idx_organizations_plan" ON "public"."organizations" USING "btree" ("plan");



CREATE INDEX "idx_organizations_stripe_customer_id" ON "public"."organizations" USING "btree" ("stripe_customer_id");



CREATE INDEX "idx_user_checklist_progress_org_id" ON "public"."user_checklist_progress" USING "btree" ("org_id");



CREATE INDEX "idx_user_checklist_progress_user_id" ON "public"."user_checklist_progress" USING "btree" ("user_id");



CREATE INDEX "idx_user_profiles_onboarding_completed" ON "public"."user_profiles" USING "btree" ("onboarding_completed");



CREATE OR REPLACE TRIGGER "update_email_preferences_updated_at" BEFORE UPDATE ON "public"."email_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_newsletter_subscribers_updated_at" BEFORE UPDATE ON "public"."newsletter_subscribers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_organization_users_updated_at" BEFORE UPDATE ON "public"."organization_users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_organizations_updated_at" BEFORE UPDATE ON "public"."organizations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_profiles_updated_at" BEFORE UPDATE ON "public"."user_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."email_preferences"
    ADD CONSTRAINT "email_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_users"
    ADD CONSTRAINT "organization_users_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."organization_users"
    ADD CONSTRAINT "organization_users_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_users"
    ADD CONSTRAINT "organization_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_checklist_progress"
    ADD CONSTRAINT "user_checklist_progress_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_checklist_progress"
    ADD CONSTRAINT "user_checklist_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Owners and admins can manage memberships" ON "public"."organization_users" USING (("org_id" IN ( SELECT "organization_users_1"."org_id"
   FROM "public"."organization_users" "organization_users_1"
  WHERE (("organization_users_1"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("organization_users_1"."status" = 'active'::"text") AND ("organization_users_1"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text"]))))));



CREATE POLICY "Owners and admins can update organizations" ON "public"."organizations" FOR UPDATE USING (("id" IN ( SELECT "organization_users"."org_id"
   FROM "public"."organization_users"
  WHERE (("organization_users"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("organization_users"."status" = 'active'::"text") AND ("organization_users"."role" = ANY (ARRAY['owner'::"text", 'admin'::"text"]))))));



CREATE POLICY "Service role can manage all email preferences" ON "public"."email_preferences" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage checklist progress" ON "public"."user_checklist_progress" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage memberships" ON "public"."organization_users" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage organizations" ON "public"."organizations" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Service role can manage profiles" ON "public"."user_profiles" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can insert own email preferences" ON "public"."email_preferences" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") OR ("email" = (( SELECT "users"."email"
   FROM "auth"."users"
  WHERE ("users"."id" = "auth"."uid"())))::"text")));



CREATE POLICY "Users can manage own checklist progress" ON "public"."user_checklist_progress" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can manage own profile" ON "public"."user_profiles" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can read org memberships" ON "public"."organization_users" FOR SELECT USING (("org_id" IN ( SELECT "organization_users_1"."org_id"
   FROM "public"."organization_users" "organization_users_1"
  WHERE (("organization_users_1"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("organization_users_1"."status" = 'active'::"text")))));



CREATE POLICY "Users can read their organizations" ON "public"."organizations" FOR SELECT USING (("id" IN ( SELECT "organization_users"."org_id"
   FROM "public"."organization_users"
  WHERE (("organization_users"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("organization_users"."status" = 'active'::"text")))));



CREATE POLICY "Users can update own email preferences" ON "public"."email_preferences" FOR UPDATE USING ((("auth"."uid"() = "user_id") OR ("email" = (( SELECT "users"."email"
   FROM "auth"."users"
  WHERE ("users"."id" = "auth"."uid"())))::"text")));



CREATE POLICY "Users can view own email preferences" ON "public"."email_preferences" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("email" = (( SELECT "users"."email"
   FROM "auth"."users"
  WHERE ("users"."id" = "auth"."uid"())))::"text")));



ALTER TABLE "public"."email_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."newsletter_subscribers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "newsletter_subscribers_access_policy" ON "public"."newsletter_subscribers" USING (((( SELECT "auth"."role"() AS "role") = 'service_role'::"text") OR ((( SELECT "auth"."role"() AS "role") = 'anon'::"text") AND ("pg_trigger_depth"() = 0)) OR ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text") AND ("email" = ( SELECT (("current_setting"('request.jwt.claims'::"text", true))::json ->> 'email'::"text")))) OR ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text") AND ("unsubscribe_token" = ( SELECT (("current_setting"('request.jwt.claims'::"text", true))::json ->> 'unsubscribe_token'::"text"))))));



COMMENT ON POLICY "newsletter_subscribers_access_policy" ON "public"."newsletter_subscribers" IS 'Consolidated RLS policy for newsletter subscribers with optimized auth function calls and single policy per action type';



ALTER TABLE "public"."organization_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_checklist_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."get_user_organizations"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_organizations"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_organizations"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_email_verification"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_email_verification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_email_verification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_org_access"("user_uuid" "uuid", "org_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_org_access"("user_uuid" "uuid", "org_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_org_access"("user_uuid" "uuid", "org_uuid" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."email_preferences" TO "anon";
GRANT ALL ON TABLE "public"."email_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."email_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "anon";
GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "service_role";



GRANT ALL ON TABLE "public"."organization_users" TO "anon";
GRANT ALL ON TABLE "public"."organization_users" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_users" TO "service_role";



GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";



GRANT ALL ON TABLE "public"."user_checklist_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_checklist_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_checklist_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;
