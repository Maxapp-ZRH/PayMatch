/**
 * Supabase Client Configuration
 *
 * Browser client for Supabase operations including authentication.
 * Used in client-side components and hooks.
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
