/**
 * Conditional Analytics Component
 *
 * Renders Vercel Analytics and Speed Insights only when analytics cookies are accepted.
 * Respects user consent and GDPR compliance requirements.
 *
 * Features:
 * - Real-time consent checking
 * - Automatic enable/disable based on cookie preferences
 * - Debug logging in development
 * - Privacy-first approach (disabled by default)
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CookieEmailIntegrationService } from '@/features/email';

export function ConditionalAnalytics() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastLoggedState = useRef<boolean | null>(null);

  useEffect(() => {
    // Check if analytics cookies are accepted
    const checkAnalyticsConsent = () => {
      try {
        const cookiePreferences =
          CookieEmailIntegrationService.getCookiePreferences();
        const hasAnalyticsConsent = cookiePreferences?.analytics === true;

        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Analytics Consent Check:', {
            cookiePreferences,
            hasAnalyticsConsent,
            timestamp: new Date().toISOString(),
          });
        }

        setAnalyticsEnabled(hasAnalyticsConsent);
        setIsInitialized(true);

        // Log analytics status change only when it actually changes
        if (
          process.env.NODE_ENV === 'development' &&
          lastLoggedState.current !== hasAnalyticsConsent
        ) {
          console.log(
            hasAnalyticsConsent
              ? '✅ Vercel Analytics ENABLED'
              : '❌ Vercel Analytics DISABLED'
          );
          lastLoggedState.current = hasAnalyticsConsent;
        }
      } catch (error) {
        console.error('Error checking analytics consent:', error);
        // Default to disabled for privacy
        setAnalyticsEnabled(false);
        setIsInitialized(true);

        if (
          process.env.NODE_ENV === 'development' &&
          lastLoggedState.current !== false
        ) {
          console.log('❌ Vercel Analytics DISABLED (error)');
          lastLoggedState.current = false;
        }
      }
    };

    // Check immediately
    checkAnalyticsConsent();

    // Listen for storage changes (when user changes cookie preferences in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'paymatch-cookie-consent') {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            '🔄 Cookie preferences changed in another tab, rechecking analytics consent'
          );
        }
        checkAnalyticsConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (same-tab changes)
    const handleCookieChange = (event: CustomEvent) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          '🔄 Cookie preferences changed in current tab, rechecking analytics consent',
          event.detail
        );
      }
      checkAnalyticsConsent();
    };

    window.addEventListener(
      'cookieConsentChanged',
      handleCookieChange as EventListener
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'cookieConsentChanged',
        handleCookieChange as EventListener
      );
    };
  }, []);

  // Don't render anything until we've checked consent
  if (!isInitialized) {
    return null;
  }

  // Only render analytics if user has consented
  if (!analyticsEnabled) {
    return null;
  }

  if (
    process.env.NODE_ENV === 'development' &&
    lastLoggedState.current === true
  ) {
    console.log('🚀 Loading Vercel Analytics and Speed Insights...');
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default ConditionalAnalytics;
