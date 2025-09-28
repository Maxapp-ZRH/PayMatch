/**
 * Banner Manager Component
 *
 * Coordinates the display of multiple banners (Cookie Banner, PWA Install Banner)
 * to ensure only one banner appears at a time. Manages priority and timing
 * to prevent banner overlap and improve user experience.
 */

'use client';

import { useState, useEffect } from 'react';
import { CookieBanner } from './CookieBanner';
import { InstallBanner } from '@/components/pwa/InstallBanner';
import { usePWA } from '@/hooks/use-pwa';

type BannerType = 'cookie' | 'pwa' | null;

export function BannerManager() {
  const { isInstallable, isInstalled } = usePWA();
  const [activeBanner, setActiveBanner] = useState<BannerType>(null);
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);
  const [pwaDismissed, setPwaDismissed] = useState<boolean>(false);

  // Check for existing preferences on mount
  useEffect(() => {
    const cookieConsentValue = localStorage.getItem('paymatch-cookie-consent');
    const pwaDismissedValue = localStorage.getItem('pwa-banner-dismissed');

    setCookieConsent(cookieConsentValue);
    setPwaDismissed(pwaDismissedValue === 'true');
  }, []);

  // Determine which banner should be shown
  useEffect(() => {
    // Priority 1: Cookie banner (if no consent given)
    if (!cookieConsent) {
      setActiveBanner('cookie');
      return;
    }

    // Priority 2: PWA banner (if installable, not installed, and not dismissed)
    if (isInstallable && !isInstalled && !pwaDismissed) {
      setActiveBanner('pwa');
      return;
    }

    // No banner should be shown
    setActiveBanner(null);
  }, [cookieConsent, pwaDismissed, isInstallable, isInstalled]);

  // Handle cookie banner dismissal
  const handleCookieBannerDismiss = () => {
    setActiveBanner(null);
    // After a short delay, check if PWA banner should be shown
    setTimeout(() => {
      if (isInstallable && !isInstalled && !pwaDismissed) {
        setActiveBanner('pwa');
      }
    }, 500);
  };

  // Handle PWA banner dismissal
  const handlePwaBannerDismiss = () => {
    setActiveBanner(null);
    setPwaDismissed(true);
  };

  // Listen for cookie consent changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'paymatch-cookie-consent') {
        setCookieConsent(e.newValue);
      }
      if (e.key === 'pwa-banner-dismissed') {
        setPwaDismissed(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      {activeBanner === 'cookie' && (
        <CookieBanner onDismiss={handleCookieBannerDismiss} />
      )}
      {activeBanner === 'pwa' && (
        <InstallBanner onDismiss={handlePwaBannerDismiss} />
      )}
    </>
  );
}
