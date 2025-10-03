


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






CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_updated_at_column"() IS 'Trigger function to automatically update the updated_at column when a record is modified';


SET default_tablespace = '';

SET default_table_access_method = "heap";


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



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_unsubscribe_token_key" UNIQUE ("unsubscribe_token");



CREATE INDEX "idx_newsletter_subscribers_email" ON "public"."newsletter_subscribers" USING "btree" ("email");



CREATE INDEX "idx_newsletter_subscribers_is_active" ON "public"."newsletter_subscribers" USING "btree" ("is_active");



CREATE INDEX "idx_newsletter_subscribers_unsubscribe_token" ON "public"."newsletter_subscribers" USING "btree" ("unsubscribe_token");



CREATE OR REPLACE TRIGGER "update_newsletter_subscribers_updated_at" BEFORE UPDATE ON "public"."newsletter_subscribers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE "public"."newsletter_subscribers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "newsletter_subscribers_access_policy" ON "public"."newsletter_subscribers" USING (((( SELECT "auth"."role"() AS "role") = 'service_role'::"text") OR ((( SELECT "auth"."role"() AS "role") = 'anon'::"text") AND ("pg_trigger_depth"() = 0)) OR ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text") AND ("email" = ( SELECT (("current_setting"('request.jwt.claims'::"text", true))::json ->> 'email'::"text")))) OR ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text") AND ("unsubscribe_token" = ( SELECT (("current_setting"('request.jwt.claims'::"text", true))::json ->> 'unsubscribe_token'::"text"))))));



COMMENT ON POLICY "newsletter_subscribers_access_policy" ON "public"."newsletter_subscribers" IS 'Consolidated RLS policy for newsletter subscribers with optimized auth function calls and single policy per action type';





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "anon";
GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "service_role";









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
