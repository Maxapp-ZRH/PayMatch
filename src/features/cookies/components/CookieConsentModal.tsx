/**
 * Cookie Consent Modal Component
 *
 * A modal that appears when users try to perform actions that require
 * marketing cookie consent (like newsletter subscription). Provides
 * a quick way to enable marketing cookies without navigating away.
 */

'use client';

import { useState } from 'react';
import { X, Cookie, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/marketing_pages/Button';
import { Link } from '@/i18n/navigation';
import { CookieEmailIntegrationService } from '../services/cookie-email-integration';
import { ConsentServiceClient } from '../services/consent-service-client';
import type { CookiePreferences } from '../types/cookie-types';

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsentGiven?: () => void;
  title?: string;
  message?: string;
  actionText?: string;
}

export function CookieConsentModal({
  isOpen,
  onClose,
  onConsentGiven,
  title = 'Marketing Cookies Required',
  message = 'To subscribe to our newsletter, we need your consent for marketing cookies.',
  actionText = 'Enable Marketing Cookies',
}: CookieConsentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleEnableMarketing = async () => {
    setIsProcessing(true);
    try {
      // Get current preferences
      const currentPrefs =
        CookieEmailIntegrationService.getCookiePreferences() || {
          necessary: true,
          analytics: false,
          marketing: false,
        };

      // Enable marketing cookies
      const newPrefs: CookiePreferences = {
        ...currentPrefs,
        marketing: true,
      };

      // Save to localStorage
      localStorage.setItem('paymatch-cookie-consent', JSON.stringify(newPrefs));
      localStorage.setItem(
        'paymatch-cookie-consent-date',
        new Date().toISOString()
      );

      // Record consent with audit trail
      await ConsentServiceClient.recordCookieConsentChange(
        newPrefs,
        undefined,
        undefined,
        {
          userAgent: navigator.userAgent,
          source: 'cookie_consent_modal',
        }
      );

      // Sync with email preferences
      await CookieEmailIntegrationService.handleCookiePreferenceChange(
        newPrefs
      );

      // Dispatch custom event to notify other components of consent change
      window.dispatchEvent(
        new CustomEvent('cookieConsentChanged', {
          detail: { preferences: newPrefs },
        })
      );

      onConsentGiven?.();
      onClose();
    } catch (error) {
      console.error('Failed to enable marketing cookies:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSettings = () => {
    onClose();
    // Navigate to cookie settings page
    window.location.href = '/cookie-settings';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Cookie className="w-6 h-6 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Cookie className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 mb-1">
                  What are marketing cookies?
                </h4>
                <p className="text-sm text-orange-700">
                  Marketing cookies help us deliver relevant content and enable
                  features like newsletter subscriptions. They don&apos;t
                  collect personal information without your consent.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleEnableMarketing}
              disabled={isProcessing}
              color="swiss"
              className="flex-1"
            >
              {isProcessing ? 'Enabling...' : actionText}
            </Button>

            <Button
              onClick={handleManageSettings}
              variant="outline"
              color="gray"
              className="flex-1 sm:flex-none"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage All Settings
            </Button>
          </div>

          {/* Links */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <Link
                href="/cookies"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                Cookie Policy
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                Privacy Policy
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentModal;
