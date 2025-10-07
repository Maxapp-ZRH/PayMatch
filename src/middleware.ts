/**
 * Optimized Next.js Middleware for Internationalization and Authentication
 *
 * Performance optimizations:
 * - Single database query for organization data
 * - Consolidated route matching logic
 * - Reduced redundant auth checks
 * - Early returns for better performance
 */

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { createClient } from './lib/supabase/middleware';
import type { User } from '@supabase/supabase-js';

// Create the internationalization middleware
const handleI18nRouting = createMiddleware(routing);

// Route patterns for efficient matching
const ROUTE_PATTERNS = {
  STATIC: /^\/_next|^\/api|\./,
  DASHBOARD: /^\/dashboard/,
  ONBOARDING: /^\/onboarding/,
  AUTH: /^\/(login|register|forgot-password)/,
  TOKEN_PROTECTED: /^\/reset-password/,
  SPECIAL: /^\/verify-email/,
} as const;

// Route types for better organization
type RouteType =
  | 'static'
  | 'dashboard'
  | 'onboarding'
  | 'auth'
  | 'token-protected'
  | 'special'
  | 'public';

/**
 * Efficiently determine route type with single regex check
 */
function getRouteType(pathname: string): RouteType {
  if (ROUTE_PATTERNS.STATIC.test(pathname)) return 'static';
  if (ROUTE_PATTERNS.DASHBOARD.test(pathname)) return 'dashboard';
  if (ROUTE_PATTERNS.ONBOARDING.test(pathname)) return 'onboarding';
  if (ROUTE_PATTERNS.AUTH.test(pathname)) return 'auth';
  if (ROUTE_PATTERNS.TOKEN_PROTECTED.test(pathname)) return 'token-protected';
  if (ROUTE_PATTERNS.SPECIAL.test(pathname)) return 'special';
  return 'public';
}

/**
 * Get organization data with single optimized query
 */
async function getOrganizationData(
  supabase: ReturnType<typeof createClient>['supabase'],
  userId: string
) {
  const { data, error } = await supabase
    .from('organization_users')
    .select(
      `
      org_id,
      organizations!inner(onboarding_completed)
    `
    )
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  return {
    data,
    error,
    onboardingCompleted:
      (data?.organizations as unknown as { onboarding_completed: boolean })
        ?.onboarding_completed ?? false,
  };
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Remove locale prefix efficiently
  const pathnameWithoutLocale = pathname.replace(/^\/(en-CH|de-CH)/, '') || '/';

  // Early return for static assets
  const routeType = getRouteType(pathnameWithoutLocale);
  if (routeType === 'static') {
    return handleI18nRouting(request);
  }

  // Only create Supabase client for protected routes
  const needsAuth = routeType === 'dashboard' || routeType === 'onboarding';

  let user = null;
  let authError = null;
  let orgData = null;

  if (needsAuth) {
    const { supabase } = createClient(request);

    try {
      // Single auth check
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();
      user = authUser;
      authError = error;

      // Single organization query for both dashboard and onboarding routes
      if (user && !error) {
        orgData = await getOrganizationData(supabase, user.id);
      }
    } catch (error) {
      await supabase.auth.signOut();
      user = null;
      authError = error as Error;
    }
  }

  // Route-specific handling with early returns
  switch (routeType) {
    case 'dashboard':
      return handleDashboardRoute(
        request,
        user,
        authError,
        orgData,
        pathnameWithoutLocale
      );

    case 'onboarding':
      return handleOnboardingRoute(
        request,
        user,
        authError,
        orgData,
        pathnameWithoutLocale
      );

    case 'auth':
      return handleAuthRoute(request, user, authError);

    case 'token-protected':
      return handleTokenProtectedRoute(request);

    case 'special':
      return handleSpecialRoute(request);

    default:
      // Public routes - no auth needed
      return handleI18nRouting(request);
  }
}

/**
 * Handle dashboard route access
 */
function handleDashboardRoute(
  request: NextRequest,
  user: User | null,
  authError: Error | null,
  orgData: {
    data: unknown;
    error: unknown;
    onboardingCompleted: boolean;
  } | null,
  pathnameWithoutLocale: string
) {
  // Auth check
  if (!user || authError) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathnameWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  // Email verification check
  if (!user.email_confirmed_at) {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  // Onboarding completion check
  if (orgData?.error || !orgData?.onboardingCompleted) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Allow access to dashboard
  return handleI18nRouting(request);
}

/**
 * Handle onboarding route access
 */
function handleOnboardingRoute(
  request: NextRequest,
  user: User | null,
  authError: Error | null,
  orgData: {
    data: unknown;
    error: unknown;
    onboardingCompleted: boolean;
  } | null,
  pathnameWithoutLocale: string
) {
  // Auth check
  if (!user || authError) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathnameWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  // Email verification check
  if (!user.email_confirmed_at) {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  // If onboarding already completed, redirect to dashboard
  if (orgData?.onboardingCompleted) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow access to onboarding
  return handleI18nRouting(request);
}

/**
 * Handle auth routes (login, register, etc.)
 */
function handleAuthRoute(
  request: NextRequest,
  user: User | null,
  authError: Error | null
) {
  // If user is authenticated, redirect to dashboard
  if (user && !authError) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow unauthenticated users to access auth routes
  return handleI18nRouting(request);
}

/**
 * Handle token-protected routes (reset-password)
 */
function handleTokenProtectedRoute(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/forgot-password', request.url));
  }

  // Allow access with token
  return handleI18nRouting(request);
}

/**
 * Handle special routes (verify-email)
 */
function handleSpecialRoute(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  const showResend = request.nextUrl.searchParams.get('showResend');
  const pendingPasswordReset = request.nextUrl.searchParams.get(
    'pendingPasswordReset'
  );

  // Prevent direct access without context
  if (!email && !showResend && !pendingPasswordReset) {
    return NextResponse.redirect(new URL('/register', request.url));
  }

  // Allow access with proper context
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
