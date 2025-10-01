'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieBannerProps {
  onDismiss?: () => void;
}

export function CookieBanner({ onDismiss }: CookieBannerProps) {
  const t = useTranslations('utils.cookieBanner');
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('paymatch-cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    handleDismiss();
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
    handleDismiss();
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
    handleDismiss();
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('paymatch-cookie-consent', JSON.stringify(prefs));
    localStorage.setItem(
      'paymatch-cookie-consent-date',
      new Date().toISOString()
    );

    // Here you would typically initialize your analytics/marketing tools
    // based on the user's preferences
    if (prefs.analytics) {
      // Initialize analytics (e.g., Google Analytics)
      console.log('Analytics cookies accepted');
    }
    if (prefs.marketing) {
      // Initialize marketing tools (e.g., Facebook Pixel)
      console.log('Marketing cookies accepted');
    }
  };

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onDismiss?.();
    }, 300);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[80] max-w-4xl mx-auto">
      <div
        className={clsx(
          'bg-white rounded-3xl shadow-lg shadow-gray-900/5 border border-gray-200 p-6 transition-all duration-300 ease-out',
          isExiting
            ? 'translate-y-2 scale-95 opacity-0'
            : 'translate-y-0 scale-100 opacity-100'
        )}
      >
        {!showSettings ? (
          // Main banner view
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('title')}
              </h3>
              <p className="mt-1 text-sm text-gray-600">{t('description')}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  {t('acceptAll')}
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  {t('customize')}
                </button>

                <button
                  onClick={handleRejectAll}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  {t('rejectAll')}
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Settings view
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('preferences.title')}
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Necessary cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {t('preferences.necessary.title')}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {t('preferences.necessary.description')}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-gray-400 rounded-full flex items-center justify-end p-0.5 opacity-60">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500 font-medium">
                    {t('preferences.necessary.alwaysOn')}
                  </span>
                </div>
              </div>

              {/* Analytics cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {t('preferences.analytics.title')}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {t('preferences.analytics.description')}
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onChange={() => togglePreference('analytics')}
                  className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-gray-300 p-0.5 ease-in-out focus:not-data-focus:outline-none data-checked:bg-red-500 data-focus:outline data-focus:outline-red-500 data-focus:outline-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                  />
                </Switch>
              </div>

              {/* Marketing cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {t('preferences.marketing.title')}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {t('preferences.marketing.description')}
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onChange={() => togglePreference('marketing')}
                  className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-gray-300 p-0.5 ease-in-out focus:not-data-focus:outline-none data-checked:bg-red-500 data-focus:outline data-focus:outline-red-500 data-focus:outline-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
                  />
                </Switch>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleAcceptSelected}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                {t('preferences.savePreferences')}
              </button>

              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                {t('acceptAll')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
