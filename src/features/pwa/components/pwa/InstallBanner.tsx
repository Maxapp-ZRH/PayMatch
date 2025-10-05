'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Download, Smartphone, Info } from 'lucide-react';
import { usePWA } from '@/features/pwa/hooks/use-pwa';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/marketing_pages/Button';

interface InstallBannerProps {
  onDismiss?: () => void;
}

const PWA_BANNER_DELAY = 20 * 1000; // 20 seconds in milliseconds

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
      onDismiss?.();
    }, 300);
  }, [onDismiss]);

  // Load PWA banner after 20 seconds (dismissal logic handled by BannerManager)
  useEffect(() => {
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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500">
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
                <Button
                  onClick={handleInstall}
                  color="swiss"
                  className="flex-1 text-xs px-3 py-2"
                >
                  <Download className="w-3 h-3 mr-1" />
                  {t('install')}
                </Button>

                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  {t('notNow')}
                </button>
              </div>

              <Button
                href="/pwa"
                onClick={handleDismiss}
                variant="outline"
                color="swiss"
                className="w-full text-xs px-3 py-2"
              >
                <Info className="w-3 h-3 mr-1" />
                {t('learnMore')}
              </Button>
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
