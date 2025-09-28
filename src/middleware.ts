/**
 * Next.js Middleware for Internationalization
 *
 * Handles locale detection, routing, and redirects for the PayMatch application.
 * Integrates with next-intl to provide seamless multilingual routing.
 * Swiss users are automatically redirected to de-CH locale.
 */

import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the internationalization middleware
const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Check if this is a request to the root path without locale
  if (request.nextUrl.pathname === '/') {
    // Get the Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';

    // Check if user prefers German or is from Switzerland
    const prefersGerman =
      acceptLanguage.includes('de') || acceptLanguage.includes('CH');

    if (prefersGerman) {
      // Redirect Swiss/German users to de-CH
      return Response.redirect(new URL('/de-CH', request.url));
    }
  }

  // Use the next-intl middleware for all other requests
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

    // However, match all pathnames within specific routes
    '/([\\w-]+)?/support/(.+)',
    '/([\\w-]+)?/downloads/(.+)',
    '/([\\w-]+)?/brand/(.+)',
  ],
};
