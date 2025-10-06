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

  // Remove locale prefix from pathname for route matching
  // Supported locales: en-CH, de-CH
  const localePattern = /^\/(en-CH|de-CH)/;
  const pathnameWithoutLocale = pathname.replace(localePattern, '') || '/';

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

  // Only check auth for protected routes
  const needsAuth =
    pathnameWithoutLocale.includes('/dashboard') ||
    pathnameWithoutLocale.includes('/onboarding');

  let user = null;
  let authError = null;

  if (needsAuth) {
    try {
      // Use getUser() for secure authentication
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      user = authUser;
      authError = error;

      console.log('Middleware auth check:', {
        pathname: pathnameWithoutLocale,
        hasUser: !!user,
        userId: user?.id,
        emailConfirmed: user?.email_confirmed_at,
        error: authError?.message,
      });
    } catch (error) {
      console.log('Middleware auth error:', error);
      await supabase.auth.signOut();
      user = null;
      authError = error as Error;
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
    pathnameWithoutLocale.startsWith(route)
  );
  const isOnboardingRoute = pathnameWithoutLocale.startsWith(onboardingRoute);
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.includes(route)
  );
  const isTokenProtectedRoute = tokenProtectedRoutes.some((route) =>
    pathnameWithoutLocale.includes(route)
  );
  const isSpecialRoute = specialRoutes.some((route) =>
    pathnameWithoutLocale.includes(route)
  );

  // Note: Homepage handles its own authentication redirect in the page component
  // Middleware only handles protected routes and auth routes

  if (isProtectedRoute) {
    if (!user || authError) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathnameWithoutLocale);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user's email is verified
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // Check if user has completed onboarding
    const { data: orgMembership, error: orgError } = await supabase
      .from('organization_users')
      .select(
        `
        org_id,
        organizations!inner(onboarding_completed)
      `
      )
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // If no organization or onboarding not completed, redirect to onboarding
    const org = orgMembership?.organizations as unknown as
      | { onboarding_completed: boolean }
      | undefined;
    if (orgError || !org?.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  if (isOnboardingRoute) {
    if (!user || authError) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathnameWithoutLocale);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user's email is verified
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // Check if onboarding is already completed - redirect to dashboard
    const { data: orgMembership, error: orgError } = await supabase
      .from('organization_users')
      .select(
        `
        org_id,
        organizations!inner(onboarding_completed)
      `
      )
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    console.log('Onboarding route check:', {
      pathname: pathnameWithoutLocale,
      userId: user.id,
      orgMembership: !!orgMembership,
      orgError: orgError?.message,
      onboardingCompleted: (
        orgMembership?.organizations as unknown as
          | { onboarding_completed: boolean }
          | undefined
      )?.onboarding_completed,
    });

    const org = orgMembership?.organizations as unknown as
      | { onboarding_completed: boolean }
      | undefined;
    if (org?.onboarding_completed) {
      console.log('Redirecting to dashboard - onboarding already completed');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow access to onboarding
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
    console.log('Auth route check:', {
      pathname: pathnameWithoutLocale,
      hasUser: !!user,
      hasError: !!authError,
      errorMessage: authError?.message,
    });

    // If user is authenticated, redirect them to dashboard
    // The dashboard route will handle onboarding redirect if needed
    if (user && !authError) {
      console.log('Redirecting authenticated user to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow unauthenticated users to access auth routes (login, register, etc.)
  }

  if (isSpecialRoute) {
    // Handle special routes that need custom authentication logic
    if (pathnameWithoutLocale.includes('/verify-email')) {
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
