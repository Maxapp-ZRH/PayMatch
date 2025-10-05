/**
 * Cookie Settings Management Page
 *
 * Allows users to manage their cookie preferences at any time.
 * Provides granular control over different cookie categories with
 * real-time updates and immediate effect.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { CookieBanner } from '@/features/cookies';
import { Button } from '@/components/marketing_pages/Button';
import { Switch } from '@headlessui/react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { CookiePreferences } from '@/features/cookies/types/cookie-types';

export default function CookieSettingsPage() {
  const t = useTranslations('legal.cookieSettings');
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Load current preferences
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem('paymatch-cookie-consent');
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences(parsed);
        }
      } catch (error) {
        console.error('Failed to load cookie preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handlePreferenceChange = (
    key: keyof CookiePreferences,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem(
        'paymatch-cookie-consent',
        JSON.stringify(preferences)
      );
      localStorage.setItem(
        'paymatch-cookie-consent-date',
        new Date().toISOString()
      );

      // Record consent with audit trail
      const { ConsentServiceClient } = await import('@/features/cookies');
      await ConsentServiceClient.recordCookieConsentChange(
        preferences,
        undefined,
        undefined,
        {
          userAgent: navigator.userAgent,
          source: 'cookie_settings_page',
        }
      );

      // Sync with email preferences
      const { CookieEmailIntegrationService } = await import(
        '@/features/cookies'
      );
      await CookieEmailIntegrationService.handleCookiePreferenceChange(
        preferences
      );

      // Dispatch custom event to notify other components of consent change
      window.dispatchEvent(
        new CustomEvent('cookieConsentChanged', {
          detail: { preferences },
        })
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShowBanner = () => {
    setShowBanner(true);
  };

  const handleBannerDismiss = () => {
    setShowBanner(false);
    // Reload preferences after banner interaction
    const stored = localStorage.getItem('paymatch-cookie-consent');
    if (stored) {
      const parsed = JSON.parse(stored);
      setPreferences(parsed);
    }
  };

  if (isLoading) {
    return (
      <LegalLayout title={t('title')} lastUpdated="October 5, 2025">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title={t('title')} lastUpdated="October 5, 2025">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">{t('successMessage')}</p>
          </div>
        )}

        {/* Introduction */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('sections.introduction.title')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('sections.introduction.content')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleShowBanner}
              variant="outline"
              color="swiss"
              className="w-full sm:w-auto"
            >
              {t('actions.showBanner')}
            </Button>
            <Button
              href="/cookies"
              variant="outline"
              color="gray"
              className="w-full sm:w-auto"
            >
              {t('actions.viewPolicy')}
            </Button>
          </div>
        </section>

        {/* Cookie Categories */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('sections.categories.title')}
          </h2>

          {/* Necessary Cookies */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  {t('sections.categories.necessary.title')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('sections.categories.necessary.description')}
                </p>
              </div>
              <Switch
                checked={preferences.necessary}
                onChange={(checked) =>
                  handlePreferenceChange('necessary', checked)
                }
                disabled={true}
                className="ml-4"
              >
                <span className="sr-only">Necessary cookies</span>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.necessary ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.necessary ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </Switch>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  {t('sections.categories.necessary.note')}
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                  {t('sections.categories.analytics.title')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('sections.categories.analytics.description')}
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onChange={(checked) =>
                  handlePreferenceChange('analytics', checked)
                }
                className="ml-4"
              >
                <span className="sr-only">Analytics cookies</span>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.analytics ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </Switch>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                {t('sections.categories.analytics.details')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>{t('sections.categories.analytics.benefits.1')}</li>
                <li>{t('sections.categories.analytics.benefits.2')}</li>
                <li>{t('sections.categories.analytics.benefits.3')}</li>
              </ul>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                  {t('sections.categories.marketing.title')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('sections.categories.marketing.description')}
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onChange={(checked) =>
                  handlePreferenceChange('marketing', checked)
                }
                className="ml-4"
              >
                <span className="sr-only">Marketing cookies</span>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.marketing ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </Switch>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                {t('sections.categories.marketing.details')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>{t('sections.categories.marketing.benefits.1')}</li>
                <li>{t('sections.categories.marketing.benefits.2')}</li>
                <li>{t('sections.categories.marketing.benefits.3')}</li>
              </ul>
            </div>
            {!preferences.marketing && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-orange-800">
                    {t('sections.categories.marketing.warning')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Save Button */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {t('sections.save.title')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('sections.save.description')}
              </p>
            </div>
            <Button
              onClick={handleSavePreferences}
              disabled={isSaving}
              color="swiss"
              className="w-full sm:w-auto"
            >
              {isSaving ? t('actions.saving') : t('actions.savePreferences')}
            </Button>
          </div>
        </section>

        {/* Cookie Banner Overlay */}
        {showBanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
            <div className="w-full max-w-2xl">
              <CookieBanner onDismiss={handleBannerDismiss} />
            </div>
          </div>
        )}
      </div>
    </LegalLayout>
  );
}
