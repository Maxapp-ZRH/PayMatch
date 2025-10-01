/**
 * Next.js Middleware for Internationalization
 *
 * Handles locale detection, routing, and redirects for the PayMatch application.
 * Integrates with next-intl to provide seamless multilingual routing.
 * Swiss users are automatically redirected to en-CH locale (default for Swiss market).
 */

import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the internationalization middleware
const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
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
