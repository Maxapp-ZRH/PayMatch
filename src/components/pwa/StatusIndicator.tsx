'use client';

import { usePWA } from '@/hooks/use-pwa';
import { Wifi, WifiOff, Download, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function StatusIndicator() {
  const t = useTranslations('utils.statusIndicator');
  const { isOnline, isInstalled, isServiceWorkerReady } = usePWA();

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
        {/* Online Status */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          <span className="text-xs text-gray-600">
            {isOnline ? t('online') : t('offline')}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-gray-300" />

        {/* PWA Status */}
        <div className="flex items-center space-x-1">
          {isInstalled ? (
            <CheckCircle className="w-4 h-4 text-blue-600" />
          ) : (
            <Download className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-xs text-gray-600">
            {isInstalled ? 'PWA' : 'Web'}
          </span>
        </div>

        {/* Service Worker Status */}
        {isServiceWorkerReady && (
          <>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">SW</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
