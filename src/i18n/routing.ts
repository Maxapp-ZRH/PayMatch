/**
 * Internationalization Routing Configuration
 *
 * Defines supported locales and routing behavior for the PayMatch application.
 * Supports Swiss market with German and English languages (Switzerland only).
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales for Swiss market (Switzerland only)
  locales: ['en-CH', 'de-CH'],

  // Default locale (Swiss English)
  defaultLocale: 'en-CH',

  // Locale prefix strategy - no prefix for default locale
  localePrefix: 'as-needed', // Only add prefix when not default locale

  // Locale detection settings
  localeDetection: true,

  // Cookie settings for locale persistence
  localeCookie: {
    name: 'NEXT_LOCALE',
    sameSite: 'lax' as const,
    secure: true,
  },

  // Pathnames for different locales
  pathnames: {
    // Home
    '/': '/',

    // Authentication
    '/login': {
      'en-CH': '/login',
      'de-CH': '/anmelden',
    },
    '/register': {
      'en-CH': '/register',
      'de-CH': '/registrieren',
    },

    // Legal pages
    '/privacy': {
      'en-CH': '/privacy',
      'de-CH': '/datenschutz',
    },
    '/terms': {
      'en-CH': '/terms',
      'de-CH': '/agb',
    },
    '/imprint': {
      'en-CH': '/imprint',
      'de-CH': '/impressum',
    },
    '/cookies': {
      'en-CH': '/cookies',
      'de-CH': '/cookies',
    },
    '/gdpr': {
      'en-CH': '/gdpr',
      'de-CH': '/dsgvo',
    },

    // Main pages
    '/support': {
      'en-CH': '/support',
      'de-CH': '/support',
    },
    '/pwa': {
      'en-CH': '/pwa',
      'de-CH': '/pwa',
    },
    '/integrations': {
      'en-CH': '/integrations',
      'de-CH': '/integrationen',
    },
  },
});

// Type-safe locale checking
export type Locale = (typeof routing)['locales'][number];
