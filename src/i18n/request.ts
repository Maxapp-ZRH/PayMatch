/**
 * Internationalization Request Configuration
 *
 * Handles locale detection and message loading for server-side rendering.
 * Provides request-scoped configuration for Server Components.
 */

import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the requested locale from the URL
  const requested = await requestLocale;

  // Validate the locale and fallback to default if invalid
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load messages for the locale from multiple files
  let messages;
  try {
    // Load all message files for the locale
    const [
      commonMessages,
      featuresMessages,
      cookieBannerMessages,
      pwaMessages,
      legalMessages,
      supportMessages,
      faqMessages,
      indexMessages,
    ] = await Promise.all([
      import(`./messages/${locale}/common.json`)
        .then((m) => m.default)
        .catch(() => ({})),
      import(`./messages/${locale}/features.json`)
        .then((m) => m.default)
        .catch(() => ({})),
      import(`./messages/${locale}/cookieBanner.json`)
        .then((m) => m.default)
        .catch(() => ({})),
      import(`./messages/${locale}/pwa.json`)
        .then((m) => m.default)
        .catch(() => ({})),
      import(`./messages/${locale}/legal.json`)
        .then((m) => m.default)
        .catch(() => ({})),
      import(`./messages/${locale}/support.json`)
        .then((m) => m.default)
        .catch(() => ({})),
      import(`./messages/${locale}/faq.json`)
        .then((m) => m.default)
        .catch(() => ({})),
      import(`./messages/${locale}/index.json`)
        .then((m) => m.default)
        .catch(() => ({})),
    ]);

    // Merge all messages into a single object
    messages = {
      common: commonMessages,
      features: featuresMessages,
      cookieBanner: cookieBannerMessages,
      pwa: pwaMessages,
      legal: legalMessages,
      support: supportMessages,
      faq: faqMessages,
      ...indexMessages, // Main page content
    };
  } catch {
    console.warn(
      `Failed to load messages for locale ${locale}, falling back to English`
    );
    try {
      // Fallback to English
      const [
        commonMessages,
        featuresMessages,
        cookieBannerMessages,
        pwaMessages,
        legalMessages,
        supportMessages,
        faqMessages,
        indexMessages,
      ] = await Promise.all([
        import(`./messages/en/common.json`)
          .then((m) => m.default)
          .catch(() => ({})),
        import(`./messages/en/features.json`)
          .then((m) => m.default)
          .catch(() => ({})),
        import(`./messages/en/cookieBanner.json`)
          .then((m) => m.default)
          .catch(() => ({})),
        import(`./messages/en/pwa.json`)
          .then((m) => m.default)
          .catch(() => ({})),
        import(`./messages/en/legal.json`)
          .then((m) => m.default)
          .catch(() => ({})),
        import(`./messages/en/support.json`)
          .then((m) => m.default)
          .catch(() => ({})),
        import(`./messages/en/faq.json`)
          .then((m) => m.default)
          .catch(() => ({})),
        import(`./messages/en/index.json`)
          .then((m) => m.default)
          .catch(() => ({})),
      ]);

      messages = {
        common: commonMessages,
        features: featuresMessages,
        cookieBanner: cookieBannerMessages,
        pwa: pwaMessages,
        legal: legalMessages,
        support: supportMessages,
        faq: faqMessages,
        ...indexMessages,
      };
    } catch (fallbackError) {
      console.error('Failed to load fallback messages:', fallbackError);
      messages = {};
    }
  }

  return {
    locale,
    messages,

    // Time zone for Swiss market
    timeZone: 'Europe/Zurich',

    // Global formats for consistent formatting
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
        medium: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        },
        long: {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        },
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'CHF',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
        currencyEUR: {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
        precise: {
          maximumFractionDigits: 5,
        },
        percent: {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        },
      },
      list: {
        enumeration: {
          style: 'long',
          type: 'conjunction',
        },
      },
    },

    // Error handling
    onError(error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('next-intl error:', error);
      }
    },

    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === 'MISSING_MESSAGE') {
        return `[Missing translation: ${path}]`;
      } else {
        return `[Error in translation: ${path}]`;
      }
    },
  };
});
