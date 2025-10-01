/**
 * Banner Manager Component
 *
 * Coordinates the display of multiple banners (Cookie Banner, PWA Install Banner)
 * to ensure only one banner appears at a time. Manages priority and timing
 * to prevent banner overlap and improve user experience.
 *
 * PWA banners are loaded after 2 minutes to avoid immediate popups.
 */

'use client';

import { useState, useEffect } from 'react';
import { CookieBanner } from './CookieBanner';
import { InstallBanner } from '@/features/pwa/components/pwa/InstallBanner';
import { usePWA } from '@/features/pwa/hooks/use-pwa';

type BannerType = 'cookie' | 'pwa' | null;

const PWA_BANNER_STORAGE_KEY = 'pwa-banner-dismissed';

export function BannerManager() {
  const { isInstallable, isInstalled } = usePWA();
  const [activeBanner, setActiveBanner] = useState<BannerType>(null);
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);
  const [pwaDismissed, setPwaDismissed] = useState<boolean>(false);
  const [pwaLoaded, setPwaLoaded] = useState<boolean>(false);

  // Check for existing preferences on mount
  useEffect(() => {
    const cookieConsentValue = localStorage.getItem('paymatch-cookie-consent');
    const pwaDismissedValue = localStorage.getItem(PWA_BANNER_STORAGE_KEY);

    setCookieConsent(cookieConsentValue);
    setPwaDismissed(pwaDismissedValue === 'true');
  }, []);

  // Load PWA banner after 2 minutes
  useEffect(() => {
    if (pwaDismissed) return; // Don't load if already dismissed

    const timer = setTimeout(
      () => {
        setPwaLoaded(true);
      },
      2 * 60 * 1000
    ); // 2 minutes

    return () => clearTimeout(timer);
  }, [pwaDismissed]);

  // Determine which banner should be shown
  useEffect(() => {
    // Priority 1: Cookie banner (if no consent given)
    if (!cookieConsent) {
      setActiveBanner('cookie');
      return;
    }

    // Priority 2: PWA banner (if loaded, installable, not installed, and not dismissed)
    if (pwaLoaded && isInstallable && !isInstalled && !pwaDismissed) {
      setActiveBanner('pwa');
      return;
    }

    // No banner should be shown
    setActiveBanner(null);
  }, [cookieConsent, pwaLoaded, pwaDismissed, isInstallable, isInstalled]);

  // Handle cookie banner dismissal
  const handleCookieBannerDismiss = () => {
    setActiveBanner(null);
    // After a short delay, check if PWA banner should be shown
    setTimeout(() => {
      if (pwaLoaded && isInstallable && !isInstalled && !pwaDismissed) {
        setActiveBanner('pwa');
      }
    }, 500);
  };

  // Handle PWA banner dismissal
  const handlePwaBannerDismiss = () => {
    setActiveBanner(null);
    setPwaDismissed(true);
    localStorage.setItem(PWA_BANNER_STORAGE_KEY, 'true');
  };

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'paymatch-cookie-consent') {
        setCookieConsent(e.newValue);
      }
      if (e.key === PWA_BANNER_STORAGE_KEY) {
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
