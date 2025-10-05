/**
 * Supabase Client Configuration
 *
 * Browser client for Supabase operations including authentication.
 * Used in client-side components and hooks.
 * Handles Remember Me functionality with session persistence.
 */

import { createBrowserClient } from '@supabase/ssr';

function getStorage() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    // Check if Remember Me is enabled
    const rememberMe =
      localStorage.getItem('supabase.auth.remember') === 'true';
    return rememberMe ? window.localStorage : window.sessionStorage;
  } catch {
    // Fallback to sessionStorage if localStorage is not available
    return window.sessionStorage;
  }
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: getStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
}
