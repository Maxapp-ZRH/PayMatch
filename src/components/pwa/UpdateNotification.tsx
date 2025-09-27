'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import clsx from 'clsx';

export function UpdateNotification() {
  const { updateServiceWorker } = usePWA();
  const [showUpdate, setShowUpdate] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdate(true);
      });
    }
  }, []);

  const handleUpdate = async () => {
    await updateServiceWorker();
    handleDismiss();
  };

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowUpdate(false);
      setIsExiting(false);
    }, 300);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[70] max-w-sm">
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
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              Update Available
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              A new version of PayMatch is ready with improvements
            </p>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleUpdate}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Update Now
              </button>

              <button
                onClick={handleDismiss}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Later
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
