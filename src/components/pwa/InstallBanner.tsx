'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface InstallBannerProps {
  onDismiss?: () => void;
}

export function InstallBanner({ onDismiss }: InstallBannerProps) {
  const t = useTranslations('utils.installBanner');
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      localStorage.setItem('pwa-banner-dismissed', 'true');
      onDismiss?.();
    }, 300);
  }, [onDismiss]);

  // Show banner if installable and not installed
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      // Delay showing to avoid immediate popup
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  // Auto-hide after 15 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, handleDismiss]);

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
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('title')}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{t('description')}</p>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleInstall}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                <Download className="w-3 h-3 mr-1" />
                {t('install')}
              </button>

              <button
                onClick={handleDismiss}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                {t('notNow')}
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
      </div>
    </div>
  );
}
