/**
 * Internationalization Routing Configuration
 *
 * Defines supported locales and routing behavior for the PayMatch application.
 * Supports Swiss market with German, French, Italian, and English languages.
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales for Swiss market
  locales: ['en', 'de-CH'],

  // Default locale (English)
  defaultLocale: 'en',

  // Locale prefix strategy
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
      en: '/login',
      'de-CH': '/anmelden',
    },
    '/register': {
      en: '/register',
      'de-CH': '/registrieren',
    },

    // Legal pages
    '/privacy': {
      en: '/privacy',
      'de-CH': '/datenschutz',
    },
    '/terms': {
      en: '/terms',
      'de-CH': '/agb',
    },
    '/imprint': {
      en: '/imprint',
      'de-CH': '/impressum',
    },
    '/cookies': {
      en: '/cookies',
      'de-CH': '/cookies',
    },
    '/gdpr': {
      en: '/gdpr',
      'de-CH': '/dsgvo',
    },

    // Main pages
    '/support': {
      en: '/support',
      'de-CH': '/support',
    },
    '/downloads': {
      en: '/downloads',
      'de-CH': '/downloads',
    },
    '/brand': {
      en: '/brand',
      'de-CH': '/marke',
    },
  },
});

// Type-safe locale checking
export type Locale = (typeof routing)['locales'][number];
