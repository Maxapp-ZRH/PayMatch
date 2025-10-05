/**
 * Conditional Analytics Component
 *
 * Renders Vercel Analytics and Speed Insights only when analytics cookies are accepted.
 * Respects user consent and GDPR compliance requirements.
 */

'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CookieEmailIntegrationService } from '@/features/cookies';

export function ConditionalAnalytics() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if analytics cookies are accepted
    const checkAnalyticsConsent = () => {
      try {
        const cookieValidation =
          CookieEmailIntegrationService.getCookiePreferences();
        const hasAnalyticsConsent = cookieValidation?.analytics === true;

        setAnalyticsEnabled(hasAnalyticsConsent);
        setIsInitialized(true);

        if (hasAnalyticsConsent) {
          console.log(
            '✅ Analytics enabled - user has consented to analytics cookies'
          );
        } else {
          console.log(
            '🚫 Analytics disabled - user has not consented to analytics cookies'
          );
        }
      } catch (error) {
        console.error('Error checking analytics consent:', error);
        // Default to disabled for privacy
        setAnalyticsEnabled(false);
        setIsInitialized(true);
      }
    };

    // Check immediately
    checkAnalyticsConsent();

    // Listen for storage changes (when user changes cookie preferences)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'paymatch-cookie-consent') {
        checkAnalyticsConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (same-tab changes)
    const handleCookieChange = () => {
      checkAnalyticsConsent();
    };

    window.addEventListener('cookieConsentChanged', handleCookieChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookieConsentChanged', handleCookieChange);
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

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default ConditionalAnalytics;
