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

  // Load messages for the locale from the structured directory
  let messages;
  try {
    // For now, we'll load from a single file per locale
    // Later we can implement dynamic loading from multiple files
    messages = (await import(`./messages/${locale}/index.json`)).default;
  } catch {
    console.warn(
      `Failed to load messages for locale ${locale}, falling back to English`
    );
    try {
      messages = (await import(`./messages/en/index.json`)).default;
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
