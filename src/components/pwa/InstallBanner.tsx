'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Download, Smartphone, Info } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface InstallBannerProps {
  onDismiss?: () => void;
}

const PWA_BANNER_STORAGE_KEY = 'pwa-banner-dismissed';
const PWA_BANNER_DELAY = 30 * 1000; // 30 seconds in milliseconds

export function InstallBanner({ onDismiss }: InstallBannerProps) {
  const t = useTranslations('utils.installBanner');
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      localStorage.setItem(PWA_BANNER_STORAGE_KEY, 'true');
      onDismiss?.();
    }, 300);
  }, [onDismiss]);

  // Check if banner was previously dismissed
  useEffect(() => {
    const wasDismissed =
      localStorage.getItem(PWA_BANNER_STORAGE_KEY) === 'true';
    if (wasDismissed) {
      return; // Don't show if previously dismissed
    }

    // Load PWA banner after 2 minutes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, PWA_BANNER_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Show banner if installable, not installed, and loaded
  useEffect(() => {
    if (isLoaded && isInstallable && !isInstalled) {
      setIsVisible(true);
    }
  }, [isLoaded, isInstallable, isInstalled]);

  const handleInstall = async () => {
    await installPWA();
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] max-w-sm">
      <div
        className={clsx(
          'bg-white rounded-3xl shadow-lg shadow-gray-900/5 border border-gray-200 p-6 transition-all duration-300 ease-out',
          isExiting
            ? 'translate-y-2 scale-95 opacity-0'
            : 'translate-y-0 scale-100 opacity-100'
        )}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#E4262A' }}
            >
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('title')}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{t('description')}</p>

            <div className="mt-4 space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  style={{ backgroundColor: '#E4262A' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#C21E1E')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#E4262A')
                  }
                >
                  <Download className="w-3 h-3 mr-1" />
                  {t('install')}
                </button>

                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  {t('notNow')}
                </button>
              </div>

              <Link
                href="/pwa"
                onClick={handleDismiss}
                className="w-full inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ color: '#E4262A', backgroundColor: '#FEF2F2' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#FEE2E2')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#FEF2F2')
                }
              >
                <Info className="w-3 h-3 mr-1" />
                {t('learnMore')}
              </Link>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
