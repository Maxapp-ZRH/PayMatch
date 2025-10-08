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
// Lazy imports to avoid Redis initialization at module load time
// import { extractClientIP, checkIPRateLimit } from './features/auth/server/services/ip-rate-limiting';
// import { checkSessionTimeout, updateSessionActivity } from './features/auth/server/services/session-timeout';
// import { logRateLimitHit } from './features/auth/server/services/audit-logging';

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
  // Ensure pathname is a valid string
  if (!pathname || typeof pathname !== 'string') {
    return 'public';
  }

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

/**
 * Extract client IP from NextRequest (Edge Runtime compatible)
 */
function extractClientIPFromRequest(request: NextRequest): string {
  try {
    // Check various headers for the real IP address
    const vercelIP = request.headers.get('x-vercel-forwarded-for');
    if (vercelIP && typeof vercelIP === 'string' && vercelIP.trim()) {
      const firstIP = vercelIP.split(',')[0]?.trim();
      if (firstIP && firstIP.length > 0) {
        return firstIP;
      }
    }

    const cloudflareIP = request.headers.get('cf-connecting-ip');
    if (
      cloudflareIP &&
      typeof cloudflareIP === 'string' &&
      cloudflareIP.trim()
    ) {
      return cloudflareIP.trim();
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    if (
      forwardedFor &&
      typeof forwardedFor === 'string' &&
      forwardedFor.trim()
    ) {
      const firstIP = forwardedFor.split(',')[0]?.trim();
      if (firstIP && firstIP.length > 0) {
        return firstIP;
      }
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP && typeof realIP === 'string' && realIP.trim()) {
      return realIP.trim();
    }

    return '0.0.0.0';
  } catch (error) {
    console.warn('Error extracting client IP in middleware:', error);
    return '0.0.0.0';
  }
}

/**
 * Simple Edge Runtime rate limiting using in-memory storage
 * This is a basic implementation that resets on cold starts
 */
const edgeRateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

function checkSimpleEdgeRateLimit(
  ip: string,
  path: string
): { allowed: boolean; rateLimitType?: string } {
  try {
    // Simple rate limiting rules
    const rateLimitConfig = {
      '/login': { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
      '/register': { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 requests per hour
      '/forgot-password': { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
    };

    // Find matching rate limit config
    let config = rateLimitConfig['/login']; // default
    let rateLimitType = 'IP_LOGIN_ATTEMPTS';

    for (const [pathPrefix, pathConfig] of Object.entries(rateLimitConfig)) {
      if (path.startsWith(pathPrefix)) {
        config = pathConfig;
        rateLimitType =
          pathPrefix === '/login'
            ? 'IP_LOGIN_ATTEMPTS'
            : pathPrefix === '/register'
              ? 'IP_REGISTRATION_ATTEMPTS'
              : 'IP_PASSWORD_RESET_ATTEMPTS';
        break;
      }
    }

    const key = `${ip}:${rateLimitType}`;
    const now = Date.now();
    const entry = edgeRateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      // No entry or window expired
      edgeRateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { allowed: true, rateLimitType };
    }

    if (entry.count >= config.maxRequests) {
      return { allowed: false, rateLimitType };
    }

    // Increment count
    entry.count++;
    edgeRateLimitStore.set(key, entry);
    return { allowed: true, rateLimitType };
  } catch (error) {
    console.error('Simple edge rate limit error:', error);
    return { allowed: true };
  }
}

// Session timeout check removed - handled in server actions where Redis is available

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  return response;
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ensure pathname is a valid string
  if (!pathname || typeof pathname !== 'string') {
    return handleI18nRouting(request);
  }

  // Remove locale prefix efficiently
  const pathnameWithoutLocale = pathname.replace(/^\/(en-CH|de-CH)/, '') || '/';

  // Ensure pathnameWithoutLocale is always a valid string
  if (!pathnameWithoutLocale || typeof pathnameWithoutLocale !== 'string') {
    return handleI18nRouting(request);
  }

  // Early return for static assets
  const routeType = getRouteType(pathnameWithoutLocale);
  if (routeType === 'static') {
    return handleI18nRouting(request);
  }

  // Check simple rate limiting for auth routes (Edge Runtime compatible)
  if (routeType === 'auth') {
    const ip = extractClientIPFromRequest(request);
    const { allowed, rateLimitType } = checkSimpleEdgeRateLimit(
      ip,
      pathnameWithoutLocale
    );

    if (!allowed) {
      console.log(`Rate limit exceeded for ${rateLimitType} from IP: ${ip}`);
      const response = NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message:
            'Too many requests from this IP address. Please try again later.',
          rateLimitType,
        },
        { status: 429 }
      );

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', '10');
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('Retry-After', '900'); // 15 minutes

      return addSecurityHeaders(response);
    }
  }

  // Only create Supabase client for protected routes
  const needsAuth = routeType === 'dashboard' || routeType === 'onboarding';

  let user = null;
  let authError = null;
  let orgData = null;
  let sessionValid = true;
  let sessionWarning = false;

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

      // Session timeout check is handled in server actions where Redis is available
      // In middleware, we just pass through authenticated users
      if (user && !error) {
        sessionValid = true; // Assume valid for middleware purposes
        sessionWarning = false;

        // If session is invalid, sign out the user
        if (!sessionValid) {
          await supabase.auth.signOut();
          user = null;
        }
      }

      // Single organization query for both dashboard and onboarding routes
      if (user && !error && sessionValid) {
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
        pathnameWithoutLocale,
        sessionValid,
        sessionWarning
      );

    case 'onboarding':
      return handleOnboardingRoute(
        request,
        user,
        authError,
        orgData,
        pathnameWithoutLocale,
        sessionValid,
        sessionWarning
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
  pathnameWithoutLocale: string,
  sessionValid: boolean = true,
  sessionWarning: boolean = false
) {
  // Auth check
  if (!user || authError || !sessionValid) {
    const loginUrl = new URL('/login', request.url);
    // Ensure pathnameWithoutLocale is a valid string
    if (pathnameWithoutLocale && typeof pathnameWithoutLocale === 'string') {
      loginUrl.searchParams.set('redirectTo', pathnameWithoutLocale);
    }
    if (!sessionValid) {
      loginUrl.searchParams.set('reason', 'session_expired');
    }
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

  // Add session warning header if needed
  const response = handleI18nRouting(request);
  if (sessionWarning) {
    response.headers.set('X-Session-Warning', 'true');
  }

  return addSecurityHeaders(response);
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
  pathnameWithoutLocale: string,
  sessionValid: boolean = true,
  sessionWarning: boolean = false
) {
  // Auth check
  if (!user || authError || !sessionValid) {
    const loginUrl = new URL('/login', request.url);
    // Ensure pathnameWithoutLocale is a valid string
    if (pathnameWithoutLocale && typeof pathnameWithoutLocale === 'string') {
      loginUrl.searchParams.set('redirectTo', pathnameWithoutLocale);
    }
    if (!sessionValid) {
      loginUrl.searchParams.set('reason', 'session_expired');
    }
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

  // Add session warning header if needed
  const response = handleI18nRouting(request);
  if (sessionWarning) {
    response.headers.set('X-Session-Warning', 'true');
  }

  return addSecurityHeaders(response);
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
