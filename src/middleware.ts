/**
 * Next.js Middleware for Internationalization and Authentication
 *
 * Handles locale detection, routing, authentication, and redirects for the PayMatch application.
 * Integrates with next-intl and Supabase Auth to provide seamless multilingual routing and auth.
 * Swiss users are automatically redirected to en-CH locale (default for Swiss market).
 *
 * Note: With deferred account creation, users are only created in Supabase Auth after email verification.
 * This simplifies the middleware logic as unverified users don't have accounts.
 */

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { createClient } from './lib/supabase/middleware';

// Create the internationalization middleware
const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Get the pathname first to avoid unnecessary auth checks
  const pathname = request.nextUrl.pathname;

  // Skip auth checks for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return handleI18nRouting(request);
  }

  // Handle authentication for protected routes
  const { supabase } = createClient(request);

  // Only refresh session for routes that need auth
  const needsAuth =
    pathname.includes('/dashboard') ||
    pathname.includes('/onboarding') ||
    pathname.includes('/settings');

  if (needsAuth) {
    try {
      await supabase.auth.getSession();
    } catch (error) {
      // Only log and clear session for non-refresh-token errors
      if (
        !(
          error instanceof Error &&
          error.message?.includes('refresh_token_not_found')
        )
      ) {
        console.log('Clearing invalid session:', error);
        await supabase.auth.signOut();
      }
    }
  }

  // Define protected routes (require authentication and email verification)
  // Note: /dashboard/* will be handled by the dashboard route group
  // Future nested routes like /dashboard/settings, /dashboard/profile will be automatically protected
  const protectedRoutes = ['/dashboard'];
  // Define onboarding route (requires auth and email verification, but not onboarding completion)
  const onboardingRoute = '/onboarding';
  // Define auth routes (redirect if already authenticated and verified)
  const authRoutes = ['/login', '/register', '/forgot-password'];
  // Define token-protected routes (require valid token parameter)
  const tokenProtectedRoutes = ['/reset-password'];
  // Define special routes that need custom handling
  const specialRoutes = ['/verify-email'];

  // Check if the current path is protected
  // Handle nested dashboard routes (e.g., /dashboard/settings, /dashboard/profile, etc.)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isOnboardingRoute = pathname.startsWith(onboardingRoute);
  const isAuthRoute = authRoutes.some((route) => pathname.includes(route));
  const isTokenProtectedRoute = tokenProtectedRoutes.some((route) =>
    pathname.includes(route)
  );
  const isSpecialRoute = specialRoutes.some((route) =>
    pathname.includes(route)
  );
  // Note: Homepage handles its own authentication redirect in the page component
  // Middleware only handles protected routes and auth routes

  if (isProtectedRoute) {
    // Check if user is authenticated (using getUser for security)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If there's a JWT error or refresh token error, clear the session
    if (
      error &&
      (error.message.includes('User from sub claim in JWT does not exist') ||
        error.message.includes('refresh_token_not_found') ||
        error.message.includes('Invalid Refresh Token'))
    ) {
      console.log('Clearing invalid session due to auth error:', error.message);
      await supabase.auth.signOut();
    }

    if (!user || error) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user's email is verified
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // Check if user has completed onboarding (only for protected routes)
    if (isProtectedRoute) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      // If profile doesn't exist yet or onboarding not completed, redirect to onboarding
      if (profileError || !profile?.onboarding_completed) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    }
  }

  if (isOnboardingRoute) {
    // Check if user is authenticated (using getUser for security)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If there's a JWT error or refresh token error, clear the session
    if (
      error &&
      (error.message.includes('User from sub claim in JWT does not exist') ||
        error.message.includes('refresh_token_not_found') ||
        error.message.includes('Invalid Refresh Token'))
    ) {
      console.log('Clearing invalid session due to auth error:', error.message);
      await supabase.auth.signOut();
    }

    if (!user || error) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user's email is verified
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // Allow access to onboarding - don't check onboarding completion here
    // The onboarding page will handle redirecting to dashboard if already completed
  }

  if (isTokenProtectedRoute) {
    // Check if the route has a valid token parameter
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      // No token provided, redirect to forgot-password page
      return NextResponse.redirect(new URL('/forgot-password', request.url));
    }

    // Token is present, allow access (the page will validate the token)
    // No authentication check needed as this is for password reset
  }

  if (isAuthRoute) {
    // Check if user is already authenticated (using getUser for security)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If there's a JWT error or refresh token error, clear the session
    if (
      error &&
      (error.message.includes('User from sub claim in JWT does not exist') ||
        error.message.includes('refresh_token_not_found') ||
        error.message.includes('Invalid Refresh Token'))
    ) {
      console.log('Clearing invalid session due to auth error:', error.message);
      await supabase.auth.signOut();
    }

    // If user is authenticated (which means they're verified with new flow),
    // redirect them to dashboard (onboarding check happens on dashboard page)
    if (user && !error) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow unauthenticated users to access auth routes (login, register, etc.)
  }

  if (isSpecialRoute) {
    // Handle special routes that need custom authentication logic
    if (pathname.includes('/verify-email')) {
      // With deferred account creation, users won't have accounts until verification
      // However, we should still check if they have a valid email parameter
      // or are coming from a legitimate flow (registration, login, forgot-password)
      const email = request.nextUrl.searchParams.get('email');
      const showResend = request.nextUrl.searchParams.get('showResend');
      const pendingPasswordReset = request.nextUrl.searchParams.get(
        'pendingPasswordReset'
      );

      // If no email parameter and no showResend flag, redirect to registration
      // This prevents direct access to verify-email without context
      if (!email && !showResend && !pendingPasswordReset) {
        return NextResponse.redirect(new URL('/register', request.url));
      }

      // Allow access if they have email parameter or are coming from legitimate flows
    }
  }

  // Let next-intl handle all routing including locale detection
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes (/api, /trpc)
  // - Next.js internals (/_next, /_vercel)
  // - Static files (containing a dot)
  // - Favicon and other assets
  matcher: [
    // Match all pathnames except for
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
};
